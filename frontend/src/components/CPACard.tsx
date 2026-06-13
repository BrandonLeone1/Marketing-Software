import { CPACardProps } from "../types/CPACardProps";
import { CPAChart } from "./CPAChart";

export function CPACard ({cpaInfo}: CPACardProps) {
    
    const mostRecentCPA = cpaInfo[cpaInfo.length - 1]?.cpa;
   
    return (
        <>
        <div className="mx-auto shadow-sm w-full h-full flex flex-col justify-center gap-6 border p-6 rounded-lg border-slate-100 bg-white">
                <div className="flex items-center flex-col gap-2">
                    <h3>CPA</h3>
                    
                    <div className="flex gap-2 items-center">
                        <p className="text-3xl">${mostRecentCPA}</p>
                        <p className="text-sm opacity-80">most recently!</p>
                    </div>
                    
                    <div className="w-full">
                    <CPAChart cpaInfo={cpaInfo}/>
                    </div>
                </div>
        </div>
        </>
    )
}