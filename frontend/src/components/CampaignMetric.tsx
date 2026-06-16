import { SetStateAction, useState, Dispatch } from "react";
import { metrics } from "./AddMetric";

type props = {
    metric: metrics,
    setMetrics: Dispatch<SetStateAction<Array<metrics>>>
}

export function CampaignMetric ({metric, setMetrics}: props) {
    
    const [editingMetric, setEditingMetric] = useState(false);
    const [updatedMetric, setUpdatedMetric] = useState<metrics>(metric); 

    const handleUpdateMetric = async () => {
        try {
            const response = await fetch(`https://api.metricflows.xyz/api/metrics/update/${metric.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify(updatedMetric)
        })

        const data = await response.json();

        if (!data.success) {
            throw new Error (`Failed`)
        }

        setMetrics(prev => prev.map(metric => {
            if (metric.id === data.data.id) {
                return data.data
            } else {
                return metric
            }
        }))

        setEditingMetric(false);
        } catch (error) {
            
            return console.error(error)
        }
        
        
    }
 
    return (
        <>
            <div className="w-full py-2 border border-slate-300 px-3 rounded flex justify-between">
                
                { !editingMetric ? (
                <>
                
                <div className="flex flex-col gap-2">
                    <p className="text-lg">{metric.platform}</p>
                    <p className="opacity-70">{metric.metric_date}</p>
                </div>
                <div>
                    <button 
                    onClick={() => setEditingMetric(true)}
                    className="cursor-pointer text-indigo-500 hover:opacity-80 duration-150" aria-label="Edit campaign metric"><i className="fa-solid fa-pen-to-square text-xl"></i></button>
                </div>
                    
                </>
                ) : (
                    <>

                    <div>
                        <button
                        onClick={() => setEditingMetric(false)}
                        className="block mb-1 ml-auto cursor-pointer underline opacity-70 hover:opacity-100 duration-150"
                        >Cancel</button>
                    

                        <label htmlFor="updated-clicks"><span className="font-medium">New clicks?</span>
                            <input 
                            type="number"
                            id="updated-clicks"
                            value={updatedMetric.clicks}
                            onChange={(e) => setUpdatedMetric(prev => ({
                                ...prev,
                                clicks: Number(e.target.value)
                            }))}
                            className="border p-2 border-slate-300 opacity-70 rounded-lg w-full mt-2 mb-3"
                            />
                        </label>

                        <label htmlFor="updated-impressions">New impressions?
                            <input 
                            type="number"
                            id="updated-impressions"
                            value={updatedMetric.impressions}
                            onChange={(e) => setUpdatedMetric(prev => ({
                                ...prev,
                                impressions: Number(e.target.value)
                            }))}
                            className="border p-2 border-slate-300 opacity-70 rounded-lg w-full mt-2 mb-3"
                            />
                        </label>

                        <label htmlFor="updated-conversions">New conversions?
                            <input 
                            type="number"
                            id="updated-conversions"
                            value={updatedMetric.conversions}
                            onChange={(e) => setUpdatedMetric(prev => ({
                                ...prev,
                                conversions: Number(e.target.value)
                            }))}
                            className="border p-2 border-slate-300 opacity-70 rounded-lg w-full mt-2 mb-3"
                            />
                        </label>

                        <label htmlFor="updated-spend">New ad spend?
                            <input 
                            type="number"
                            value={updatedMetric.ad_spend}
                            onChange={(e) => setUpdatedMetric(prev => ({
                                ...prev,
                                ad_spend: Number(e.target.value)
                            }))}
                            id="updated-spend"
                            className="border p-2 border-slate-300 opacity-70 rounded-lg w-full mt-2 mb-3"
                            />
                        </label>

                        <label htmlFor="updated-revenue">New revenue?
                            <input 
                            type="number"
                            id="updated-revenue"
                            value={updatedMetric.revenue}
                            onChange={(e) => setUpdatedMetric(prev => ({
                                ...prev,
                                revenue: Number(e.target.value)
                            }))}
                            className="border p-2 border-slate-300 opacity-70 rounded-lg w-full mt-2 mb-3"
                            />
                        </label>

                        <button 
                        onClick={handleUpdateMetric}
                        className="mt-3 cursor-pointer font-medium bg-indigo-500 px-4 py-1 rounded text-white hover:opacity-90 duration-150">Update</button>

                    </div>

                    </>
                )
                }
            </div>

            
        </>
    )
}