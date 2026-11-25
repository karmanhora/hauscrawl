"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { DemoEndCard } from "./demo-end-card";
import { SwipeActions } from "./swipe-actions";
import { sampleReels } from "./sample-reels";

type Action = "save" | "skip" | "tour";

export function SwipeDeck() {
  const [index, setIndex] = useState(0);
  const [counts, setCounts] = useState({ save: 0, skip: 0, tour: 0 });
  const [history, setHistory] = useState<Array<{ action: Action; image: string }>>([]);
  const [toast, setToast] = useState("");
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(true);
  const deckRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const card = sampleReels[index % sampleReels.length]!;

  useEffect(() => {
    document.getElementById("landing-hero")?.style.setProperty("--active-tint", card.tint);
  }, [card.tint]);

  const act = useCallback((action: Action) => {
    setShowHint(false);
    setDrag({ x: 0, y: 0 });
    if (action === "save" && typeof navigator !== "undefined" && "vibrate" in navigator && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigator.vibrate?.(10);
    }
    setHistory((items) => [...items, { action, image: sampleReels[index % sampleReels.length]!.image }]);
    setCounts((value) => ({ ...value, [action]: value[action] + 1 }));
    setToast(action === "save" ? "Saved to your shortlist (sample)" : action === "tour" ? "Tour request sent to Sample Agent (sample)" : "Skipped sample home");
    setIndex((value) => value + 1);
  }, [index]);

  const undo = useCallback(() => {
    const last = history.at(-1);
    if (!last) return;
    setHistory((items) => items.slice(0, -1));
    setCounts((value) => ({ ...value, [last.action]: Math.max(0, value[last.action] - 1) }));
    setIndex((value) => Math.max(0, value - 1));
    setToast("Last swipe undone");
  }, [history]);

  useEffect(() => {
    const node = deckRef.current;
    if (!node) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "Backspace") {
        event.preventDefault();
        if (event.key === "ArrowLeft") act("skip");
        if (event.key === "ArrowRight") act("save");
        if (event.key === "ArrowUp") act("tour");
        if (event.key === "Backspace") undo();
      }
    };
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [act, undo]);

  return (
    <div ref={deckRef} tabIndex={0} aria-label="Sample demo. Use arrow keys or buttons to save, skip, or book a tour." className="landing-deal w-full max-w-[22rem] rounded-[2rem] bg-white/95 p-3 shadow-2xl outline-none focus-visible:ring-4 focus-visible:ring-[#FFB84D] lg:max-w-[24rem]">
      <div
        className="relative h-[25rem] touch-none select-none overflow-hidden rounded-[1.5rem] bg-[#EEF1F4] cursor-grab active:cursor-grabbing"
        onPointerDown={(event) => { start.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerMove={(event) => { if (start.current) setDrag({ x: event.clientX - start.current.x, y: event.clientY - start.current.y }); }}
        onPointerUp={(event) => {
          if (!start.current) return;
          const dx = event.clientX - start.current.x;
          const dy = event.clientY - start.current.y;
          if (Math.abs(dx) > 55 || dy < -55) act(dy < -Math.abs(dx) ? "tour" : dx > 0 ? "save" : "skip");
          else setDrag({ x: 0, y: 0 });
          start.current = null;
        }}
        onPointerCancel={() => { start.current = null; setDrag({ x: 0, y: 0 }); }}
      >
        <Image src={card.image} alt="Illustrative sample home" fill priority={index === 0} loading={index === 0 ? "eager" : "lazy"} sizes="352px" className="object-cover transition-transform duration-150" style={{ transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 24}deg)` }} draggable={false} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#232A4A]/95 to-transparent p-5 pt-24 text-white">
          <span className="rounded-full bg-white px-2 py-1 text-xs text-[#232A4A]">Sample</span>
          <h3 className="mt-3 text-3xl">{card.neighborhood}</h3>
          <div className="mt-2 flex flex-wrap gap-2">{card.tags.map((tag) => <span key={tag} className="rounded-full border border-white/70 px-2 py-1 text-xs">{tag}</span>)}</div>
          <div className="mt-4 flex items-center gap-2 text-sm"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#FFB84D] text-[#232A4A]">S</span>Sample Agent</div>
        </div>
      </div>
      {showHint && <p className="landing-hint mt-2 text-center text-xs text-stone">Drag or swipe: ← skip · ↑ book a tour · → save</p>}
      <p aria-live="polite" className="mt-2 text-center text-xs text-stone">Saved {counts.save}, skipped {counts.skip}, tours {counts.tour}. {toast}</p>
      <div className="mt-3 flex items-center justify-between">
        <div aria-label={`${counts.save} saved sample homes`} className="flex -space-x-2">{history.filter((item) => item.action === "save").map((item, i) => <Image key={`${item.image}-${i}`} src={item.image} alt="" width={32} height={32} className="h-8 w-8 rounded-full border-2 border-white object-cover" />)}</div>
        <a href="#shortlist" className="text-xs font-medium text-[#1F7A74] underline">See your saves</a>
      </div>
      <SwipeActions act={act} undo={undo} canUndo={history.length > 0} />
      {index >= sampleReels.length && <DemoEndCard />}
    </div>
  );
}
