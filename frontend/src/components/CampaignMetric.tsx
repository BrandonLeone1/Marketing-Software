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
            <div className="w-full border border-zinc-200/80 rounded-xl bg-white shadow-sm transition-all overflow-y-auto px-4">
                
                { !editingMetric ? (
                <div className="p-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-zinc-800">{metric.platform}</p>
                        <p className="text-xs font-medium text-zinc-400">{metric.metric_date}</p>
                    </div>
                    <div>
                        <button 
                        onClick={() => setEditingMetric(true)}
                        className="cursor-pointer p-2 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" 
                        aria-label="Edit campaign metric"
                        >
                        <i className="fa-solid fa-pen-to-square text-base"></i>
                        </button>
                    </div>
                    
                </div>
                ) : (
                    <div className="p-5 bg-zinc-50/50 border-t border-zinc-100 flex flex-col gap-4">

                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Modify Record Data</span>
                            <button
                            onClick={() => setEditingMetric(false)}
                            className="text-xs font-medium text-zinc-400 hover:text-zinc-600 cursor-pointer transition-colors"
                            >Cancel</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                                <label htmlFor="updated-clicks" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Clicks
                                    <input 
                                    type="number"
                                    id="updated-clicks"
                                    value={updatedMetric.clicks}
                                    onChange={(e) => setUpdatedMetric(prev => ({ ...prev, clicks: Number(e.target.value) }))}
                                    className="w-full px-3 py-1.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                </label>
                            </div>

                            <div>
                                <label htmlFor="updated-impressions" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Impressions
                                    <input 
                                    type="number"
                                    id="updated-impressions"
                                    value={updatedMetric.impressions}
                                    onChange={(e) => setUpdatedMetric(prev => ({ ...prev, impressions: Number(e.target.value) }))}
                                    className="w-full px-3 py-1.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                </label>
                            </div>

                            <div>
                                <label htmlFor="updated-conversions" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Conversions
                                    <input 
                                    type="number"
                                    id="updated-conversions"
                                    value={updatedMetric.conversions}
                                    onChange={(e) => setUpdatedMetric(prev => ({ ...prev, conversions: Number(e.target.value) }))}
                                    className="w-full px-3 py-1.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                </label>
                            </div>

                            <div>
                                <label htmlFor="updated-spend" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Spend
                                    <input 
                                    type="number"
                                    value={updatedMetric.ad_spend}
                                    onChange={(e) => setUpdatedMetric(prev => ({
                                        ...prev,
                                        ad_spend: Number(e.target.value)
                                    }))}
                                    id="updated-spend"
                                    className="w-full px-3 py-1.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                </label>
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="updated-revenue" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Revenue
                                    <input 
                                    type="number"
                                    id="updated-revenue"
                                    value={updatedMetric.revenue}
                                    onChange={(e) => setUpdatedMetric(prev => ({ ...prev, revenue: Number(e.target.value) }))}
                                    className="w-full px-3 py-1.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                </label>
                            </div>

                        </div>

                        <button 
                        onClick={handleUpdateMetric}
                        className="w-full cursor-pointer font-semibold bg-indigo-600 px-4 py-2 text-sm text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors focus:outline-none"
                        >Save Changes</button>
                    

                    </div>
                )
                }
            </div>

            
        </>
    )
}