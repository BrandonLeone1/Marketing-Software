import { useEffect, useState } from "react";
import { CampaignCard } from "../components/CampaignCard";
import { HomepageProps } from "../types/HomepageProps";
import { spendLineCharts } from "../types/spendLineCharts";
import { KPICard } from "../components/KPICard";
import { overviewData } from "../types/overviewData";
import { newCampaign } from "../types/newCampaign";

export function Homepage ({campaigns, addCampaign, updateCampaign, deleteCampaign, activeUser, getCampaigns}:HomepageProps) {
    
    const initialState: spendLineCharts = {
        spend: 0,
        metric_date: ""
    }

    const APIURL = import.meta.env.VITE_API_URL || "http://localhost:5000"

    const [spendLineCharts, setSpendLineCharts] = useState<spendLineCharts>(initialState);
    const [overviewData, setOverViewData] = useState<overviewData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [addingCampaign, setAddingCampaign] = useState(false);

    const initialCampaignState:newCampaign = {
        campaign_name: "",
        budget: ""
    }
    const [newCampaign, setNewCampaign] = useState<newCampaign>(initialCampaignState);

    const past7SpendLinecharts = async () => {
    
    try {
    
       
    
        const response = await fetch(`${APIURL}/api/analytics/past-7-spend-per-campaign`, {
        credentials: "include",
        
     
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error(`Failed to get past 7 spend`)
    }

    setSpendLineCharts(data.data);
  

  } catch (error) {
    return console.error(error);
  }
  
  
};

const getOverviewData = async () => {
    
    setIsLoading(true);
    try {
      
      const response = await fetch(`${APIURL}/api/analytics/homepage-overview-7-days`, {
        credentials: "include",
    
    })
      const data = await response.json();
      if (!data.success) {
        throw new Error(`Failed`)
      };
      
      

      setOverViewData(data.data);
      setIsLoading(false);
    } catch (error) {
        setIsLoading(false);
        return console.error(error);
    }
    
}

const handleAddCampaign = async () => {
    await addCampaign(newCampaign);

    setNewCampaign({
        campaign_name: "",
        budget: ""
    })

    setAddingCampaign(false);
}


useEffect(() => {
    past7SpendLinecharts();
    getOverviewData();
    getCampaigns();
}, []);


    return (
        <>
            { addingCampaign && (
                <div className="fixed inset-0 bg-zinc-950/40 z-50 backdrop-blur-md flex items-center justify-center p-4 md:p-6">
                    <div className="bg-white border border-zinc-200 p-6 md:p-8 flex flex-col gap-5 relative rounded-2xl shadow-xl w-full max-w-md">
                        <button onClick={() => setAddingCampaign(false)} className="absolute right-4 top-4 text-xs font-medium text-zinc-400 hover:text-zinc-600 transition">Cancel</button>

                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest block" htmlFor="new-campaign-name">Name for new campaign
                            <input 
                            type="text"
                            id="new-campaign-name"
                            placeholder="Name"
                            value={newCampaign.campaign_name}
                            onChange={(e) => setNewCampaign(prev => ({
                                ...prev,
                                campaign_name: e.target.value
                            }))}
                            className="w-full mt-1.5 px-3 py-2.5 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                            />
                        </label>

                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest block" htmlFor="new-campaign-budget">Budget for new campaign
                            <input 
                            type="number"
                            id="new-campaign-budget"
                            placeholder="$"
                            value={newCampaign.budget}
                            onChange={(e) => setNewCampaign(prev => ({
                                ...prev,
                                budget: e.target.value
                            }))}
                            className="w-full mt-1.5 px-3 py-2.5 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                            />
                        </label>

                        <button 
                        onClick={handleAddCampaign}
                        className="w-full mt-2 bg-indigo-600 cursor-pointer text-white py-2.5 px-4 rounded-lg shadow-sm font-semibold text-sm tracking-wide transition-all hover:bg-indigo-700 active:scale-[0.99] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Create campaign</button>
                    </div>
                </div>
            )

            }

            <main className="mx-auto max-w-7xl min-h-screen bg-zinc-50/50 p-6 md:p-10">
                <section>
                    
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-b border-zinc-200/80 pb-6 mb-8">
                        
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">Welcome back</h1>
                            <p className="text-sm font-medium text-zinc-500 mt-1">{activeUser?.email}</p>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-full border border-zinc-200/60">
                            Active: {campaigns.filter(campaign => campaign?.status === "Active").length}
                            </span>
                            
                            <button 
                            onClick={() => setAddingCampaign(true)}
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white py-2 px-3.5 rounded-lg shadow-sm font-semibold text-xs tracking-wide transition-all hover:bg-indigo-700 active:scale-[0.99]"><i className="fa-solid fa-plus text-[10px]"></i> New Campaign</button>
                        </div>

                    </div>

                    <div>
                        { campaigns.length < 1 && (
                            <div className="bg-white border border-dashed border-zinc-300 p-8 text-center rounded-xl my-6">
                            <p className="text-sm text-zinc-500 max-w-[50ch] mx-auto leading-relaxed">You are not a member of any campaigns. Create one to get started, invite teammates, and unlock split testing controls.</p>
                            </div>
                        )}
                    </div>

                </section>
                
                <section className="mb-10">
                    <h3 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Performance Overview (7D)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                    
                        <KPICard overviewData={overviewData} title="spend" isLoading={isLoading}/>
                        <KPICard overviewData={overviewData} title="roas" isLoading={isLoading}/>
                        <KPICard overviewData={overviewData} title="ctr" isLoading={isLoading}/>
                    </div>

                </section>

                <section className="border-t border-zinc-200/80 pt-8 mt-4 gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    { campaigns.map(campaigns => (
                        <CampaignCard key={campaigns.id} campaign={campaigns} spendLineCharts={spendLineCharts[campaigns.id]} updateCampaign={updateCampaign} deleteCampaign={deleteCampaign}/>
                    ))

                    }
                </section>

            </main>
        </>
    )
}