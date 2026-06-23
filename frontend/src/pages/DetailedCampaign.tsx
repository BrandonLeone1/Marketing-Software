import { Link, useParams } from "react-router-dom"
import { DetailedCampaignProps } from "../types/DetailedCampaignProps";
import { useEffect, useState } from "react";
import { campaignSummary } from "../types/campaignSummary";
import { CampaignViewCard } from "../components/CampaignViewCard";
import { campaignTrends } from "../types/campaignTrends";
import { RevenueVsSpend } from "../components/RevenueVsSpend";
import { CPACard } from "../components/CPACard";
import { ROASCard } from "../components/ROASCard";
import { CTRCard } from "../components/CTRCard";
import { PlatformBreakdown } from "../components/PlatformBreakdown";
import { TeamManagement } from "../components/TeamManagement";
import { CreativeSection } from "../components/CreativeSection";
import ReactMarkDown from 'react-markdown'
import { AddMetric } from "../components/AddMetric";
import { CSVUpload } from "../components/CSVUpload";


export function DetailedCampaign ({campaigns}: DetailedCampaignProps) {
    
    const selectedID = useParams();
    

    const selectedCampaign = campaigns?.find(item => item?.id === Number(selectedID.id));
    const [selectedDays, setSelectedDays] = useState("30");

    const initialState:campaignSummary = {
        ad_spend: 0,
        clicks: 0,
        conversion_rate: 0,
        conversions: 0,
        cpa: 0,
        ctr: 0,
        revenue: 0,
        roas: 0,
        impressions: 0
    }
    const [campaignSummary, setCampaignSummary] = useState<campaignSummary>(initialState);

    const [campaignTrends, setCampaignTrends] = useState<campaignTrends[]>([]);

    const getCampaignSummary = async () => {
        try {
            
            const response = await fetch(`https://api.metricflows.xyz/api/analytics/summary/${selectedCampaign?.id}/?days=${selectedDays}`, {
            credentials: "include",
           
            })
            
            const data = await response.json();

           
            if (!data.success) {
                throw new Error(`Failed`)
            };

            setCampaignSummary(data.data);

        } catch (error) {
            return console.error(error)
        }
    }

    const getCampaignTrends = async () => {
        
        
        try {
            
            const response = await fetch(`https://api.metricflows.xyz/api/analytics/trends/${selectedCampaign?.id}/?days=${selectedDays}`, {
                credentials: "include",
             
            })
            const data = await response.json();

          
            if (!data.success) {
                throw new Error(`Failed`)
            }

            setCampaignTrends(data.data);

        } catch (error) {
            return console.error(error)
        }
    };

     const getBreakdown = async () => {
        
        try {
         
            const response = await fetch(`https://api.metricflows.xyz/api/analytics/platform-breakdown/${selectedCampaign?.id}/?days=${selectedDays}`, {
            credentials: "include",
            
        });

        const data = await response.json();

     

        if (!data.success) {
            throw new Error(`Failed`)
        }

        setBreakdown(data.data);

        } catch (error) {
            return console.error(error)
        }
        
    }

    useEffect(() => {
        getCampaignSummary();
        getCampaignTrends();
        getBreakdown();
    }, [selectedCampaign, selectedDays])
    
      const formatter = new Intl.DateTimeFormat(`en-US`, {
        month: "2-digit",
        day: "numeric"
    })

     const cpaInfo = campaignTrends?.map(trend => {
        return {
            metric_date: (formatter.format(new Date (trend.metric_date))),
            cpa: Number((trend.spend / trend.conversions).toFixed(2)),
        }
    });

    const roasInfo = campaignTrends?.map(trend => {
        return {
            metric_date: formatter.format(new Date (trend.metric_date)),
            roas: Number(trend.roas).toFixed(2)
        }
    });

    const ctrInfo = campaignTrends?.map(trend => {
        return {
            metric_date: formatter.format(new Date (trend.metric_date)),
            ctr: Number(trend.ctr).toFixed(2)
        }
    });

    const [breakdown, setBreakdown] = useState([]);

    const [showingTeam, setShowingTeam] = useState(false);
    //add openAI on line 170

    const [insights, setInsights] = useState("");
    const [generateInsights, setGenerateInsights] = useState(false);
    const [loadingInsights, setLoadingInsights] = useState(false);

    const getInsights = async () => {
        setLoadingInsights(true);
        try {
            const response = await fetch(`https://api.metricflows.xyz/api/campaigns/insights/${selectedCampaign?.id}`, {
            credentials: "include",
            method: "GET",
        })

        const data = await response.json();

        if (!data.success) {
            throw new Error (`Failed`)
        
        }

        setInsights(data.data);
        setLoadingInsights(false)

        } catch (error) {
            setLoadingInsights(false);
            return console.error(error)
        }
        

    }

    const handleRefresh = async () => {

        await Promise.all([
            getCampaignSummary(),
            getCampaignTrends(),
            getBreakdown()
        ])

    };

    const [addingMetrics, setAddingMetrics] = useState(false);

    const [uploadingCSV, setUploadingCSV] = useState(false);
   
    return (
        <>
            <main className="max-w-7xl p-6 mx-auto">
                <Link to={`/dashboard`} className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-indigo-600 transition-colors mt-2 mb-6 group">
                    <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-0.5"></i> Back to dashboard
                </Link>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{selectedCampaign?.campaign_name}</h1>
        
                <div className="flex items-center flex-wrap gap-2 bg-zinc-100/80 p-1 rounded-xl border border-zinc-200/60 shadow-inner">
                        
                        { selectedCampaign?.user_role === "Owner" && (
                    
                            <>
                            <button 
                            onClick={() => setShowingTeam(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-zinc-700 hover:text-indigo-600 hover:bg-white transition shadow-xs"><i className="fa-solid fa-users text-indigo-500/80"></i> Team</button>
    
                            <button 
                            onClick={() => setAddingMetrics(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-zinc-700 hover:text-indigo-600 hover:bg-white transition shadow-xs"><i className="fa-solid fa-chart-simple text-indigo-500/80"></i> Metrics</button>
                            
                            <button 
                            onClick={() => setUploadingCSV(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-zinc-700 hover:text-indigo-600 hover:bg-white transition shadow-xs"><i className="fa-solid fa-file-csv text-indigo-500/80"></i> Google Ads</button>
                            </>
                        )}

                        { addingMetrics && (
                            <AddMetric setAddingMetrics={setAddingMetrics} campaign_id={selectedCampaign?.id}/>
                        )

                        }

                        <button 
                        onClick={async () => {
                            setGenerateInsights(prev => !prev);
                            
                            if (insights === "") {
                            await getInsights();
                            } else {
                                setInsights("");
                            }
                        }
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-zinc-700 hover:text-indigo-600 hover:bg-white transition shadow-xs"><i className="fa-solid fa-comment text-indigo-500/80"></i> Insights</button>

                        <button 
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-zinc-700 hover:text-indigo-600 hover:bg-white transition shadow-xs"
                        ><i className="fa-solid fa-arrows-rotate text-indigo-500/80"></i> Refresh</button>


                    </div>

                    { showingTeam && (
                        <div className="max-w-5xl">
                            <TeamManagement selectedCampaign={selectedCampaign} setShowingTeam={setShowingTeam}/>
                        </div>
                    )
                    }

                    { uploadingCSV && (
                        <>
                            <CSVUpload setUploadingCSV={setUploadingCSV} campaign_id={selectedCampaign?.id}/>
                        </>
                    )

                    }

                </div>
           

                <section className="mt-6">
                    
                    { generateInsights && (
                        <div className="mt-3">
                            <p className="text-lg font-medium">Insights for campaign {selectedCampaign?.campaign_name} (past 14 days)</p>
                            
                            { loadingInsights && (
                                <div className="h-8 w-8 mt-3 animate-spin rounded-full border-4 border-solid border-indigo-500 border-t-transparent"></div>
                            )

                            }

                            { insights !== "" && (
                            <div className="mt-3 flex prose prose-slate max-w-none flex-col gap-2 border p-4 border-slate-200 rounded-lg bg-white shadow-sm">
                                <ReactMarkDown>{insights}</ReactMarkDown>
                            </div>
                            )
                            }
                        </div>
                    )

                    }
                </section>
                

                <div className="inline-flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 mb-6 shadow-inner">
                    <button 
                    onClick={() => setSelectedDays("14")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${selectedDays === "14" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}>14D</button>
                    <button 
                    onClick={() => setSelectedDays("30")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${selectedDays === "30" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}>30D</button>
                    <button 
                    onClick={() => setSelectedDays("90")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${selectedDays === "90" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}>90D</button>
                </div>

                <section className="mb-10 bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">

                    <h2 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-4">High-Level Performance</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-6">
                        <RevenueVsSpend campaignTrends={campaignTrends}/>

                        <div className="flex flex-col items-center justify-between gap-6">    
                            <CampaignViewCard campaignSummary={campaignSummary} title="traffic"/>
                            <CampaignViewCard campaignSummary={campaignSummary} title="impressions"/>
                            <CampaignViewCard campaignSummary={campaignSummary} title="conversions"/>
                        </div>

                    </div>

                </section>

                <section className="mb-10">
                    
                    <h2 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-4">Granular Trends</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-8">
                        <CPACard cpaInfo={cpaInfo}/>
                        <ROASCard roasInfo={roasInfo}/>
                        <CTRCard ctrInfo={ctrInfo} />
                    </div>

                </section>

                <section className="mb-10">
                    <h2 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-4">Platform Breakdown</h2>
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-5 w-full">
                        <PlatformBreakdown breakdown={breakdown}/>
                    </div>

                </section>

                <section className="mt-24 max-w-5xl">

                    <h2 className="opacity-70">Ad creatives & Feedback</h2>

                    <CreativeSection />

                </section>

            </main>
        </>
    )
}