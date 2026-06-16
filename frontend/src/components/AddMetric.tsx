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

    const [metrics, setMetrics] = useState<metrics[]>([])
    
    const getMetrics = async () => {
        
        try {
           const response = await fetch(`https://api.metricflows.xyz/api/metrics/get/${campaign_id}`, {
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
            const response = await fetch(`https://api.metricflows.xyz/api/metrics/create/${campaign_id}`, {
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

         <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 flex items-center justify-center p-6">
            <div className="bg-white p-8 max-w-5xl rounded-lg flex flex-col gap-2 max-h-150 overflow-y-auto lg:min-w-xl">
                
                <div className="flex justify-between gap-6">
                    <div className="flex gap-3">
                        <button 
                        onClick={() => setShowingAddMetric(true)}
                        className={`${showingAddMetric && "text-indigo-500 underline"} cursor-pointer font-medium`}>Add metric</button>
                        <button 
                        onClick={() => setShowingAddMetric(false)}
                        className={`${!showingAddMetric && "text-indigo-500 underline"} cursor-pointer font-medium`}>Edit metrics</button>
                    </div>

                     <div>
                        <button onClick={() => setAddingMetrics(false)} className={`cursor-pointer font-medium opacity-70 hover:opacity-100 duration-150`}>Close</button>
                    </div>
                </div>

                { showingAddMetric ? (
                    <>
                    <label htmlFor="platform-input"><span className="text-lg mt-3 block">Platform:</span>
                        <input 
                        type="text"
                        id="platform-input"
                        placeholder="Platform"
                        value={newMetric.platform}
                        onChange={(e) => setNewMetric(prev => ({
                            ...prev,
                            platform: e.target.value
                        }))}
                        className="border px-2 py-3 border-slate-300 opacity-70 rounded-lg w-full mt-2 focus:outline-0 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    </label>
                    
                    <label htmlFor="clicks"><span className="text-lg mt-3 block">Clicks:</span>
                        <input 
                        type="number"
                        id="clicks"
                        value={newMetric.clicks}
                        onChange={(e) => setNewMetric(prev => ({
                            ...prev,
                            clicks: e.target.value
                        }))}
                        className="border px-2 py-3 border-slate-300 opacity-70 rounded-lg w-full mt-2 focus:outline-0 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </label>

                    <label htmlFor="impressions"><span className="text-lg mt-3 block">Impressions:</span>
                        <input 
                        className="border px-2 py-3 border-slate-300 opacity-70 rounded-lg w-full mt-2 focus:outline-0 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        type="number"
                        id="impressions"
                        value={newMetric.impressions}
                        onChange={(e) => setNewMetric(prev => ({
                            ...prev,
                            impressions: e.target.value
                        }))}
                        />
                    </label>
                    
                    <label htmlFor="conversions"><span className="text-lg mt-3 block">Conversions:</span>
                        <input 
                        className="border px-2 py-3 border-slate-300 opacity-70 rounded-lg w-full mt-2 focus:outline-0 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        id="conversions"
                        type="number"
                        value={newMetric.conversions}
                        onChange={(e) => setNewMetric(prev => ({
                            ...prev,
                            conversions: e.target.value
                        }))}
                        />
                    </label>
                    
                    <label htmlFor="spend"><span className="text-lg block mt-3">Ad Spend:</span>
                        <input 
                        value={newMetric.ad_spend}
                        onChange={(e) => setNewMetric(prev => ({
                            ...prev,
                            ad_spend: e.target.value
                        }))}
                        className="border px-2 py-3 border-slate-300 opacity-70 rounded-lg w-full mt-2 focus:outline-0 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        id="spend"
                        type="number"/>
                    </label>
                    
                    <label htmlFor="revenue"><span className="text-lg block mt-3">Revenue:</span>
                        <input 
                        value={newMetric.revenue}
                        onChange={(e) => setNewMetric(prev => ({
                            ...prev,
                            revenue: e.target.value
                        }))}
                        className="border px-2 py-3 border-slate-300 opacity-70 rounded-lg w-full mt-2 focus:outline-0 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        id="revenue"
                        type="number"/>
                    </label>

                    <button
                    onClick={handleAddMetric}
                    className="mt-3 cursor-pointer font-medium bg-indigo-500 px-4 py-2.5 rounded text-white hover:opacity-90 duration-150"
                    >Add</button>

                </>

                ) : (
                    <>
                    <p className="mt-3 text-xl">Metrics for this campaign:</p>

                    <div className="flex flex-col gap-4 mt-3">
                    { formattedMetrics.map(metric => (
                        <CampaignMetric metric={metric} key={metric.id} setMetrics={setMetrics}/>
                    ))
                        
                    }
                    </div>
                  </>
                )

                }

            </div>    
        </div>

    )
    
   
}