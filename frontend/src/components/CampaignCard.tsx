import { Link } from "react-router-dom";
import { CampaignCardProps } from "../types/CampaignCardProps";
import { SparkLine } from "./SparkLine";
import { useState } from "react";
import { editedCampaign } from "../types/editedCampaign";

export function CampaignCard ({campaign, spendLineCharts, updateCampaign, deleteCampaign}: CampaignCardProps) {
    
    const [editingCampaign, setEditingCampaign] = useState(false);

    const initialState:editedCampaign = {
        campaign_name: campaign.campaign_name,
        status: campaign.status,
        budget: String(campaign.budget)
    }

    const [editedCampaign, setEditedCampaign] = useState<editedCampaign>(initialState);

    const handleUpdateCampaign = async () => {
        console.log(editedCampaign)
        await updateCampaign (editedCampaign, campaign.id);

        setEditedCampaign({
            campaign_name: campaign.campaign_name,
            status: campaign.status,
            budget: String(campaign.budget)
        });

        setEditingCampaign(false);
    }

    const [deletingCampaign, setDeletingCampaign] = useState(false);

    const handleDeleteClick = async () => {
        await deleteCampaign(campaign.id);
        setDeletingCampaign(false);
    }

    return (
        <>
            { editingCampaign && (
                <div className="fixed inset-0 bg-zinc-950/40 z-50 backdrop-blur-md flex items-center justify-center p-4 md:p-6">
                    <div className="bg-white border border-zinc-200 p-6 md:p-8 flex flex-col gap-5 relative rounded-2xl shadow-xl w-full max-w-md">
                        
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">

                            <div className="flex items-center gap-4">
                                <button
                                onClick={() => setDeletingCampaign(true)}
                                className="text-zinc-400 hover:text-rose-600 transition"
                                ><i className="fa-solid fa-trash text-sm"></i></button>
                                
                                <button
                                onClick={() => setEditingCampaign(false)}
                                className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition"
                                >Cancel</button>
                            </div>
                            
                            
                            { deletingCampaign && (
                                <div className="flex flex-col gap-3 bg-rose-50/50 border border-rose-100 p-4 rounded-xl my-2">
                                    <p className="text-xs font-semibold text-rose-800">Are you absolutely sure?</p>
                                    <div className="flex items-center gap-3">    
                                        <button onClick={() => setDeletingCampaign(false)} className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition">Cancel</button>
                                        <button 
                                        onClick={handleDeleteClick}
                                        className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition shadow-sm">Delete Campaign</button>
                                    </div>
                                </div>
                            )
                            }
                            
                        </div>

                        <p className="text-sm text-zinc-500 -mt-2 block">Modifying <span className="font-semibold text-zinc-800">{campaign.campaign_name}</span></p>
                        
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest block" htmlFor="new-campaign-name">Campaign Name
                            <input 
                            type="text"
                            id="new-campaign-name"
                            placeholder="New name"
                            value={editedCampaign.campaign_name}
                            onChange={(e) => setEditedCampaign(prev => ({
                                ...prev,
                                campaign_name: e.target.value
                            }))}
                            className="w-full mt-1.5 px-3 py-2 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg text-zinc-900 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                            />
                        </label>
                        
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest block" htmlFor="new-status">Status
                            <select
                            value={editedCampaign.status}
                            id="new-status"
                            onChange={(e) => setEditedCampaign(prev => ({
                                ...prev,
                                status: e.target.value
                            }))} 
                            className="w-full mt-1.5 px-3 py-2 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg text-zinc-900 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                            >
                                <option value={`Active`}>Active</option>
                                <option value={`Paused`}>Paused</option>
                            </select>
                        </label>

                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest block" htmlFor="new-budget">Budget
                            <input 
                            type="number"
                            id="new-budget"
                            placeholder="$"
                            value={editedCampaign.budget}
                            onChange={(e) => setEditedCampaign(prev => ({
                                ...prev,
                                budget: e.target.value
                            }))}
                            className="w-full mt-1.5 px-3 py-2 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg text-zinc-900 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                            />
                        </label>
                        
                        <button 
                        onClick={handleUpdateCampaign}
                        className="w-full mt-2 bg-indigo-600 text-white py-2.5 px-4 rounded-lg shadow-sm font-semibold text-sm tracking-wide transition-all hover:bg-indigo-700 active:scale-[0.99] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save changes</button>
                    </div>
                </div>
            )

            }

            <div className="flex flex-col justify-between bg-white border border-zinc-200 rounded-xl p-5 w-full min-h-85 shadow-sm hover:shadow-md transition duration-200">
                
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-bold tracking-tight text-zinc-900 truncate max-w-[70%]">{campaign.campaign_name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide shrink-0 ${
                    campaign.status === "Active" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" 
                    : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                    }`}>{campaign.status}</span>
                </div>

                <div className="my-2">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Spend History</p>
                    <div className="h-20 w-full flex flex-col justify-center">
                        <SparkLine spendLineCharts={spendLineCharts}/>
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-zinc-400 tracking-tight mt-1 px-0.5">
                        <p>7D Ago</p>
                        <p>Today</p>
                    </div>
                </div>

                <div className="border-t border-zinc-100 pt-3 mt-1 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Budget</p>
                        <p className="text-base font-bold text-zinc-900 mt-0.5">${Number(campaign.budget).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Created</p>
                        <p className="text-xs font-medium text-zinc-500 mt-0.5">{campaign.created_at.split("T")[0]}</p>
                    </div>
                </div>
                
                <div className="border-t border-zinc-100 pt-3 flex justify-between items-center mt-2">
                    <Link to={`/campaign/${campaign.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition" aria-label="An in-depth, campaign-specific dashboard">
                    View insights <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-0.5"></i>
                    </Link>
                    { campaign.user_role === "Owner" && (
                        <button
                        onClick={() => setEditingCampaign(true)} aria-label="Settings button"
                        className="text-zinc-400 hover:text-zinc-600 focus:outline-none transition-colors"
                        ><i className="fa-solid fa-gear text-sm cursor-pointer hover:rotate-45 transition-transform duration-300"></i></button>
                    )
                    }
                </div>
                
            </div>
        </>
    )
}