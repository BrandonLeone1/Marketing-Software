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
    console.log(selectedID);

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
            
            const response = await fetch(`http://localhost:5000/api/analytics/summary/${selectedCampaign?.id}/?days=${selectedDays}`, {
            credentials: "include",
           
            })
            
            const data = await response.json();

            console.log(data);
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
            
            const response = await fetch(`http://localhost:5000/api/analytics/trends/${selectedCampaign?.id}/?days=${selectedDays}`, {
                credentials: "include",
             
            })
            const data = await response.json();

            console.log(data);
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
         
            const response = await fetch(`http://localhost:5000/api/analytics/platform-breakdown/${selectedCampaign?.id}/?days=${selectedDays}`, {
            credentials: "include",
            
        });

        const data = await response.json();

        console.log(data);

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
            const response = await fetch(`http://localhost:5000/api/campaigns/insights/${selectedCampaign?.id}`, {
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
                <Link to={`/dashboard`} className="text-xl cursor-pointer text-indigo-500 underline opacity-70 hover:opacity-100">Dashboard</Link>
                
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl mt-24 font-semibold">{selectedCampaign?.campaign_name}</h1>
                    
                    <div className="flex flex-col gap-2">
                        
                        { selectedCampaign?.user_role === "Owner" && (
                    
                            <>
                            <button 
                            onClick={() => setShowingTeam(true)}
                            className="mt-24 text-xl cursor-pointer hover:bg-indigo-100 mr-auto px-3 py-1 rounded-lg duration-150"><i className="fa-solid fa-users text-indigo-500"></i> Manage Team</button>
                            <button 
                            
                            onClick={() => setAddingMetrics(true)}
                            className="text-xl cursor-pointer hover:bg-indigo-100 mr-auto px-3 py-1 rounded-lg duration-150"><i className="fa-solid fa-chart-simple text-indigo-500"></i> Add metrics</button>
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
                        className="text-xl cursor-pointer hover:bg-indigo-100 mr-auto px-3 py-1 rounded-lg duration-150"><i className="fa-solid fa-comment text-indigo-500"></i> Quick insights</button>


                        <button 
                        onClick={() => setUploadingCSV(true)}
                        className="text-xl cursor-pointer mr-auto hover:bg-indigo-100 px-3 py-1 rounded-lg duration-150"><i className="fa-solid fa-file-csv text-indigo-500"></i> 
                        Google Ads</button>


                        <button className="text-xl cursor-pointer mr-auto hover:bg-indigo-100 px-3 py-1 rounded-lg duration-150"
                        onClick={handleRefresh}
                        ><i className="fa-solid fa-arrows-rotate text-indigo-500"></i> Refresh data</button>


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
                

                <div className="flex gap-6 flex-wrap font-medium text-lg mt-12">
                    <button 
                    onClick={() => setSelectedDays("14")}
                    className={`${selectedDays === "14" && "after:w-full"} cursor-pointer after:h-0.5 after:w-0 after:bg-indigo-500 after:block hover:after:w-full after:duration-150`}>14 day</button>
                    <button 
                    onClick={() => setSelectedDays("30")}
                    className={`${selectedDays === "30" && "after:w-full"} cursor-pointer after:h-0.5 after:w-0 after:bg-indigo-500 after:block hover:after:w-full after:duration-150`}>30 day</button>
                    <button 
                    onClick={() => setSelectedDays("90")}
                    className={`${selectedDays === "90" && "after:w-full"} cursor-pointer after:h-0.5 after:w-0 after:bg-indigo-500 after:block hover:after:w-full after:duration-150`}>90 day</button>
                    </div>

                <section className="mt-18 border px-4 py-8 rounded-lg border-slate-200">

                    <h2 className="opacity-70">High-Level Overview</h2>

                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 mt-6">
                        <RevenueVsSpend campaignTrends={campaignTrends}/>

                        <div className="flex flex-col items-center justify-between gap-6">    
                            <CampaignViewCard campaignSummary={campaignSummary} title="traffic"/>
                            <CampaignViewCard campaignSummary={campaignSummary} title="impressions"/>
                            <CampaignViewCard campaignSummary={campaignSummary} title="conversions"/>
                        </div>

                    </div>

                </section>

                <section className="mt-24">
                    
                    <h2 className="opacity-70">More Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-8">
                        <CPACard cpaInfo={cpaInfo}/>
                        <ROASCard roasInfo={roasInfo}/>
                        <CTRCard ctrInfo={ctrInfo} />
                    </div>

                </section>

                <section className="mt-24">
                    <h2 className="opacity-70">Platform breakdown</h2>
                    <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6 mt-6 w-full">
                        <PlatformBreakdown breakdown={breakdown}/>
                    </div>

                </section>

                <section className="mt-24">

                    <h2 className="opacity-70">Ad creatives & Feedback</h2>

                    <CreativeSection />

                </section>

            </main>
        </>
    )
}