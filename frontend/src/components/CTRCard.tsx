import { CTRCardProps } from "../types/CTRCardProps";
import { CTRChart } from "./CTRChart";

export function CTRCard ({ctrInfo}: CTRCardProps) {
    const mostRecentCTR = ctrInfo[ctrInfo.length - 1]?.ctr;
    return (
        <>
        <div className="mx-auto shadow-sm w-full h-full flex flex-col justify-center gap-6 border p-6 rounded-lg border-slate-100 bg-white">
                <div className="flex items-center flex-col gap-2">
                    <h3>CTR</h3>
                    
                    <div className="flex gap-2 items-center">
                        <p className="text-3xl">{mostRecentCTR}%</p>
                        <p className="text-sm opacity-50">most recently!</p>
                    </div>

                    <div className="w-full">
                        <CTRChart ctrInfo={ctrInfo}/>
                    </div>
                </div>
        </div>
        </>
    )
}