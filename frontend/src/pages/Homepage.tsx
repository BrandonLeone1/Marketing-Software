import { useEffect, useState } from "react";
import { CampaignCard } from "../components/CampaignCard";
import { HomepageProps } from "../types/HomepageProps";
import { spendLineCharts } from "../types/spendLineCharts";
import { KPICard } from "../components/KPICard";
import { overviewData } from "../types/overviewData";
import { newCampaign } from "../types/newCampaign";

export function Homepage ({campaigns, addCampaign, updateCampaign, deleteCampaign}:HomepageProps) {
    
    const initialState: spendLineCharts = {
        spend: 0,
        metric_date: ""
    }

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
    
       
    
        const response = await fetch(`http://localhost:5000/api/analytics/past-7-spend-per-campaign`, {
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
      
      const response = await fetch(`http://localhost:5000/api/analytics/homepage-overview-7-days`, {
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
}, []);


    return (
        <>
            { addingCampaign && (
                <div className="fixed inset-0 bg-black/80 z-90 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-linear-to-br from-slate-200 to-white p-6 flex flex-col gap-6 relative rounded-lg">
                        <button onClick={() => setAddingCampaign(false)} className="ml-auto absolute right-3 top-3 cursor-pointer underline opacity-70 hover:opacity-100 duration-150">Cancel</button>

                        <label htmlFor="new-campaign-name"><span className="text-xl">Name for new campaign:</span>
                            <input 
                            type="text"
                            id="new-campaign-name"
                            placeholder="Name"
                            value={newCampaign.campaign_name}
                            onChange={(e) => setNewCampaign(prev => ({
                                ...prev,
                                campaign_name: e.target.value
                            }))}
                            className="border border-slate-300 p-2 rounded-xl w-full mt-2"
                            />
                        </label>

                        <label htmlFor="new-campaign-budget"><span className="text-xl">Budget for new campaign:</span>
                            <input 
                            type="number"
                            id="new-campaign-budget"
                            placeholder="$"
                            value={newCampaign.budget}
                            onChange={(e) => setNewCampaign(prev => ({
                                ...prev,
                                budget: e.target.value
                            }))}
                            className="border border-slate-300 p-2 rounded-xl w-full mt-2"
                            />
                        </label>

                        <button 
                        onClick={handleAddCampaign}
                        className="text-xl cursor-pointer bg-indigo-500 px-4 py-1.5 rounded-xl text-white font-medium shadow-md hover:shadow-lg duration-150 hover:opacity-90">Create</button>
                    </div>
                </div>
            )

            }

            <main className="mx-auto max-w-6xl p-6">
                <section>
                    
                    <div className="flex flex-wrap font-semibold mt-20 items-center justify-between">
                        <h1 className="text-4xl py-1.5 mt-6 lg:mt-0">Welcome back!</h1>
                    
                        <div className="flex gap-6 flex-wrap mt-6 lg:mt-0">
                            
                            <h2 className="text-xl py-1.5 opacity-80">Active campaigns: ({campaigns.filter(campaigns => campaigns?.status === "Active").length})</h2>
                            <button 
                            onClick={() => setAddingCampaign(true)}
                            className="text-xl cursor-pointer bg-indigo-500 px-4 py-1.5 rounded-xl text-white font-medium shadow-md hover:shadow-lg duration-150 hover:opacity-90"><i className="fa-solid fa-plus"></i> Create new campaign</button>
                        </div>
                    </div>

                    <div className="mt-24">
                        
                        
                        { campaigns.length < 1 && (
                            <>
                                <p className="mt-12 text-lg max-w-[65ch] opacity-80">You are not a member of any campaigns. Create one to get started! From there add teammates and stay on top of your work. Upload creative work for A/B testing and team feedback, detailed interval-based campaign breakdown and more.</p>
                               
                            </>
                        )

                        }
                        
                    </div>

                </section>
                
                <section>
                    <h3 className="mt-6 opacity-70">All campaigns overview (last 7 days)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    
                        <KPICard overviewData={overviewData} title="spend" isLoading={isLoading}/>
                        <KPICard overviewData={overviewData} title="roas" isLoading={isLoading}/>
                        <KPICard overviewData={overviewData} title="ctr" isLoading={isLoading}/>
                    </div>

                </section>

                <section className="mt-24 gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    { campaigns.map(campaigns => (
                        <CampaignCard key={campaigns.id} campaign={campaigns} spendLineCharts={spendLineCharts[campaigns.id]} updateCampaign={updateCampaign} deleteCampaign={deleteCampaign}/>
                    ))

                    }
                </section>

            </main>
        </>
    )
}