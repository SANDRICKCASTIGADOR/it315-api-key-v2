"use client";

import { Check, Copy, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

type Props = { value: string; ariaLabel?: string};
export default function CopyButton({ 
    value,
    ariaLabel = "Copy to Clipbpard",

}: Props) {
    const [ok, setOk] = useState(false);
    return (
       <Button
          variant={"outline"}
          size={"sm"}
          onClick={async () => {
             await navigator.clipboard.writeText(value);
             setOk(true);
             setTimeout(() => setOk(false), 2000);
            }} 
          aria-label={ariaLabel}
        >
          {/* {ok ? "Copied!" : "Copy"} */}
          {ok ? (
            <div className="flex flex-row items-center gap-2">
              <Check /> Copied!
            </div>
          ) : (
            <div className="flex flex-row items-center gap-2">
                <Copy /> Copy
            </div>
          )}
       </Button>
    );
}