import { ROASCardProps } from "../types/ROASCardProps";
import { ROASChart } from "./ROASChart";

export function ROASCard ({roasInfo}: ROASCardProps) {
    const mostRecentROAS = roasInfo[roasInfo.length - 1]?.roas;
    return (
        <>

        <div className="mx-auto shadow-sm w-full h-full flex flex-col justify-center gap-6 border p-6 rounded-lg border-slate-100 bg-white">
                <div className="flex items-center flex-col gap-2">
                    <h3>ROAS</h3>
                    <div className="flex gap-2 items-center">
                        <p className="text-3xl">{mostRecentROAS}x</p>
                        <p className="text-sm opacity-80">most recently!</p>
                    </div>

                     <div className="w-full">
                        <ROASChart roasInfo={roasInfo} />
                     </div>
                </div>
        </div>
        </>
    )
}