import { KPICardProps } from "../types/KPICardProps";

export function KPICard ({overviewData, title, isLoading}: KPICardProps) {
    // add insights from last week via math
    
    
   
    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    let currentWeek = overviewData[0] ? overviewData[0][title] : null;
    let previousWeek = overviewData[1] ? overviewData[1][title] : null;
    currentWeek = Number(currentWeek).toFixed(2);
    previousWeek = Number(previousWeek).toFixed(2);

    let percentDiff;
    
    if (currentWeek === "0.00" && previousWeek === "0.00") {
        percentDiff = 0;
    } else if (previousWeek === "0.00") {
        percentDiff = 100;
    } else {
        percentDiff = (currentWeek / previousWeek - 1) * 100
    }   

   console.log(overviewData)
   
    return (
        <>
        <div className="mx-auto shadow-sm w-full h-full flex flex-col gap-6 border p-6 rounded-lg border-slate-100 bg-white">
            
            <div className="flex justify-between items-center">
                <h3>{title === "roas" ? "Average ROAS" : title === "spend" ? "Total Ad Spend" : "Total CTR"}</h3>
                <p className={`ml-auto text-xs ${percentDiff >= 0 ? "bg-emerald-800/80" : "bg-rose-800"} text-white px-3 py-1 rounded-xl`}>{percentDiff.toFixed(2)}% vs last week</p>
            </div>

            <p className="text-4xl font-medium">{title === "spend" && "$"}{currentWeek}{title === "roas" ? "x" : title === "ctr" ? "%" : ""}</p>
        </div>
        </>
    )
}