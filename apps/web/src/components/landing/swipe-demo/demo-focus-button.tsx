"use client";

import { buttonClasses } from "@/components/ui/button";

export function DemoFocusButton() {
  return (
    <button
      type="button"
      className={buttonClasses({ variant: "secondary", size: "lg" })}
      onClick={() => {
        document.getElementById("swipe-demo")?.focus();
      }}
    >
      Try the demo
    </button>
  );
}
