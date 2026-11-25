"use client";
import { useState } from "react";
export function usePointerSwipe(onAction:(kind:"skip"|"save"|"tour")=>void){const [start,setStart]=useState<{x:number;y:number}|null>(null);return {onPointerDown:(e:React.PointerEvent)=>setStart({x:e.clientX,y:e.clientY}),onPointerUp:(e:React.PointerEvent)=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>60||dy < -60)onAction(dy < -Math.abs(dx)?"tour":dx>0?"save":"skip");setStart(null)}}}
