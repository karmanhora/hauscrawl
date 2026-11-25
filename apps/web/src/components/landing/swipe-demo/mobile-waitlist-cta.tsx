"use client";
import { useEffect, useState } from "react";

export function MobileWaitlistCta(){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{const hero=document.getElementById("landing-hero");const form=document.getElementById("join-bottom");if(!hero||!form)return;let heroIn=true,formIn=false;const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.target===hero)heroIn=entry.isIntersecting;if(entry.target===form)formIn=entry.isIntersecting}setVisible(!heroIn&&!formIn)}, {threshold:0.05});observer.observe(hero);observer.observe(form);return()=>observer.disconnect()},[]);
 return visible?<a href="#join-bottom" className="fixed inset-x-3 z-40 rounded-xl bg-[#FFB84D] px-5 py-3 text-center font-semibold text-[#232A4A] shadow-lg md:hidden" style={{bottom:"calc(env(safe-area-inset-bottom) + 0.75rem)"}}>Join the waitlist</a>:null;
}
