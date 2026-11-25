-- Store the landing-page audience choice separately from the existing survey role.
alter table public.waitlist_signups
  add column intake_role text;

alter table public.waitlist_signups
  add constraint waitlist_signups_intake_role_check
  check (intake_role is null or intake_role in ('searching', 'agent'));

comment on column public.waitlist_signups.intake_role is
  'Optional audience choice from the landing-page waitlist form.';

-- Replace the RPC signatures so PostgREST accepts the additional optional
-- intake_role argument. The existing internal helper still owns insertion,
-- queue, referral and rate-limit behavior.
drop function public.join_waitlist(text, text, text, text, text, text, text, text, text, text, text);
drop function public.join_waitlist_admin(text, text, text, text, text, text, text, text, text, text, text);

create function public.join_waitlist(
  p_email text,
  p_role text default null,
  p_searching_with text default null,
  p_region text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_referrer text default null,
  p_referral_code text default null,
  p_ip_hash text default null,
  p_unsubscribe_token_hash text default null,
  p_intake_role text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_intake_role text := nullif(lower(btrim(coalesce(p_intake_role, ''))), '');
begin
  if v_intake_role is not null and v_intake_role not in ('searching', 'agent') then
    raise exception 'invalid_input' using errcode = '22023';
  end if;

  perform public.waitlist_join_internal(
    p_email,
    p_role,
    p_searching_with,
    p_region,
    p_utm_source,
    p_utm_medium,
    p_utm_campaign,
    p_referrer,
    p_referral_code,
    p_ip_hash,
    p_unsubscribe_token_hash
  );

  if v_intake_role is not null then
    update public.waitlist_signups
       set intake_role = v_intake_role
     where email = lower(btrim(coalesce(p_email, '')));
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.join_waitlist(
  text, text, text, text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.join_waitlist(
  text, text, text, text, text, text, text, text, text, text, text, text
) to anon;

create function public.join_waitlist_admin(
  p_email text,
  p_role text default null,
  p_searching_with text default null,
  p_region text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_referrer text default null,
  p_referral_code text default null,
  p_ip_hash text default null,
  p_unsubscribe_token_hash text default null,
  p_intake_role text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_intake_role text := nullif(lower(btrim(coalesce(p_intake_role, ''))), '');
  v_result jsonb;
begin
  if v_intake_role is not null and v_intake_role not in ('searching', 'agent') then
    raise exception 'invalid_input' using errcode = '22023';
  end if;

  v_result := public.waitlist_join_internal(
    p_email,
    p_role,
    p_searching_with,
    p_region,
    p_utm_source,
    p_utm_medium,
    p_utm_campaign,
    p_referrer,
    p_referral_code,
    p_ip_hash,
    p_unsubscribe_token_hash
  );

  if v_intake_role is not null then
    update public.waitlist_signups
       set intake_role = v_intake_role
     where email = lower(btrim(coalesce(p_email, '')));
  end if;

  return v_result;
end;
$$;

revoke all on function public.join_waitlist_admin(
  text, text, text, text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.join_waitlist_admin(
  text, text, text, text, text, text, text, text, text, text, text, text
) to service_role;
