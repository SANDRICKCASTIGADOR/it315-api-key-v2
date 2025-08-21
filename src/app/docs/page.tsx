import { KeyRound } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function DocsPage() {
    return (
      <div>
         <div className="mx-auto max-w-4xl space-y-6 p-6">
            {/* Top ToolBar */}
            <div className="flex items-center justify-between">
             <h1 className="text-xl font-semibold">API Guide</h1>
             <div className="flex gap-2">
               <Link href={"/keys"}>
                <Button 
                    variant={"outline"} 
                    className="bg-white text-black flex items-center gap-2" 
                    aria-label="Open API Guide"
                  >
                    <KeyRound /> 
                    Keys Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
}