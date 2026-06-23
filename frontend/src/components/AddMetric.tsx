import { useEffect, useMemo, useState } from "react"
import { CampaignMetric } from "./CampaignMetric";


type addingMetrics = boolean

type addMetricProps = {
    setAddingMetrics: React.Dispatch<React.SetStateAction<addingMetrics>>,
    campaign_id: number | undefined
}
 type metric = {
        platform: string,
        clicks: string,
        impressions: string,
        conversions: string,
        ad_spend: string,
        revenue: string
    }


    export type metrics = {
        id: number,
        campaign_id: number,
        metric_date: string,
        clicks: number,
        impressions: number,
        conversions: number,
        ad_spend: number,
        revenue: number,
        platform: number
    }

      const formatter = new Intl.DateTimeFormat(`en-US`, {
        month: "2-digit",
        day: "2-digit"
    })



export function AddMetric ({setAddingMetrics, campaign_id}: addMetricProps) {
    
    const [showingAddMetric, setShowingAddMetric] = useState(true);

   
    const initialMetricState:metric = {
        platform: "",
        clicks: "",
        impressions: "",
        conversions: "",
        ad_spend: "",
        revenue: ""
    }

    const [newMetric, setNewMetric] = useState<metric>(initialMetricState);

    const [metrics, setMetrics] = useState<metrics[]>([]);
    const APIURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    
    const getMetrics = async () => {
        
        try {
           const response = await fetch(`${APIURL}/api/metrics/get/${campaign_id}`, {
            credentials: "include"
            });

            const data = await response.json();

            console.log(data)
            
            if (!data.success) {
                throw new Error (`Failed`)
            } 

            setMetrics(data.data)


        } catch (error) {
            return console.error(error)
        }
        
        
    }
    
    const handleAddMetric = async () => {
        try {
            const response = await fetch(`${APIURL}/api/metrics/create/${campaign_id}`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newMetric)
        });

        const data = await response.json();
        
        console.log(data);

        if (!data.success) {
            throw new Error (`Failed`)
        }

        setMetrics(prev => [...prev, data.data])

        setNewMetric({
            platform: "",
            clicks: "",
            impressions: "",
            conversions: "",
            ad_spend: "",
            revenue: ""
        })
    
        } catch (error) {
            return console.error(error)
        }
        
    }

    useEffect(() => {
        getMetrics()
    }, [showingAddMetric])

    console.log(metrics);

    const formattedMetrics = useMemo(() => {
        return (
            metrics.map(metric => (
                {
                    ...metric,
                    metric_date: formatter.format(new Date (metric.metric_date))
                }
            ))
        )
    }, [metrics]);


    return (

         <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 w-full max-w-xl rounded-2xl flex flex-col shadow-xl max-h-[90vh] overflow-hidden">
                
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
                    <div className="flex bg-zinc-100 p-1 rounded-lg border border-zinc-200/40">
                        <button 
                        onClick={() => setShowingAddMetric(true)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${showingAddMetric ? "bg-white text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-800"}`}
                        >Add Metric</button>
                        <button 
                        onClick={() => setShowingAddMetric(false)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${!showingAddMetric ? "bg-white text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-800"}`}
                        >Edit Metrics</button>
                    </div>
 
                    <button onClick={() => setAddingMetrics(false)} className="text-xs font-medium text-zinc-400 hover:text-zinc-600 cursor-pointer transition-colors">Close</button>
                   
                </div>

                { showingAddMetric ? (
                    <>
                    <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                        <div>
                            <label htmlFor="platform-input" className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase block mb-1.5">Platform Target
                                <input 
                                type="text"
                                id="platform-input"
                                placeholder="e.g. Google Ads"
                                value={newMetric.platform}
                                onChange={(e) => setNewMetric(prev => ({
                                    ...prev,
                                    platform: e.target.value
                                }))}
                                className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                            <label htmlFor="clicks" className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase block mb-1.5">Clicks
                                <input 
                                type="number"
                                id="clicks"
                                value={newMetric.clicks}
                                onChange={(e) => setNewMetric(prev => ({
                                    ...prev,
                                    clicks: e.target.value
                                }))}
                                className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </label>

                            <label htmlFor="impressions" className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase block mb-1.5">Impressions
                                <input 
                                className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                type="number"
                                id="impressions"
                                value={newMetric.impressions}
                                onChange={(e) => setNewMetric(prev => ({
                                    ...prev,
                                    impressions: e.target.value
                                }))}
                                />
                            </label>
                    
                            <label htmlFor="conversions" className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase block mb-1.5">Conversions
                                <input 
                                className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                id="conversions"
                                type="number"
                                value={newMetric.conversions}
                                onChange={(e) => setNewMetric(prev => ({
                                    ...prev,
                                    conversions: e.target.value
                                }))}
                                />
                            </label>
                    
                            <label htmlFor="spend" className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase block mb-1.5">Spend
                                <input 
                                value={newMetric.ad_spend}
                                onChange={(e) => setNewMetric(prev => ({
                                    ...prev,
                                    ad_spend: e.target.value
                                }))}
                                className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                id="spend"
                                type="number"/>
                            </label>
                    
                            <label htmlFor="revenue" className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase block mb-1.5">Revenue
                                <input 
                                value={newMetric.revenue}
                                onChange={(e) => setNewMetric(prev => ({
                                    ...prev,
                                    revenue: e.target.value
                                }))}
                                className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                id="revenue"
                                type="number"/>
                            </label>

                        </div>

                    <button
                    onClick={handleAddMetric}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white py-2 px-3.5 rounded-lg shadow-sm font-semibold text-xs tracking-wide transition-all hover:bg-indigo-700 active:scale-[0.99]"
                    >Add</button>

                </div>
                </>

                ) : (
                    <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                    <p className="mt-3 text-xl">Metrics for this campaign:</p>

                    <div className="flex flex-col gap-4 mt-3">
                    { formattedMetrics.map(metric => (
                        <CampaignMetric metric={metric} key={metric.id} setMetrics={setMetrics}/>
                    ))
                        
                    }
                    </div>
                  </div>
                )

                }

            </div>    
        </div>

    )
    
   
}