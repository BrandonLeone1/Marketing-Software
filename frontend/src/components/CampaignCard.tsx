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
                <div className="fixed inset-0 bg-black/80 z-90 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white p-6 flex flex-col gap-6 rounded-lg">
                        
                        <div className="flex justify-between">
                            <button
                            onClick={() => setDeletingCampaign(true)}
                            ><i className="fa-solid fa-trash text-xl text-rose-800 cursor-pointer opacity-75 hover:opacity-100 duration-150"></i></button>
                            
                            { deletingCampaign && (
                                <div className="flex flex-col mx-auto border p-2 rounded-xl">
                                    <p className="max-w-[30ch] text-xl font-medium">Confirm delete</p>

                                    <div className="flex gap-6 text-lg">    
                                       
                                        <button onClick={() => setDeletingCampaign(false)} className="opacity-70 hover:opacity-100 duration-150 underline cursor-pointer">Cancel</button>
                                        <button 
                                        onClick={handleDeleteClick}
                                        className="underline text-rose-800 cursor-pointer opacity-70 hover:opacity-100 duration-150">Delete</button>
                                    </div>

                                </div>
                            )

                            }
                            
                            
                            <button
                            onClick={() => setEditingCampaign(false)}
                            className="ml-auto cursor-pointer underline opacity-70 hover:opacity-100 duration-150"
                            >Cancel</button>
                        </div>

                        <p className="text-lg font-medium -mt-3">You are editing your campaign: {campaign.campaign_name}</p>
                        
                        <label htmlFor="new-campaign-name">New name?
                            <input 
                            type="text"
                            id="new-campaign-name"
                            placeholder="New name"
                            value={editedCampaign.campaign_name}
                            onChange={(e) => setEditedCampaign(prev => ({
                                ...prev,
                                campaign_name: e.target.value
                            }))}
                            className="border border-slate-300 p-2 rounded-xl w-full mt-2"
                            />
                        </label>
                        
                        <label htmlFor="new-status">New status?
                            <select
                            value={editedCampaign.status}
                            id="new-status"
                            onChange={(e) => setEditedCampaign(prev => ({
                                ...prev,
                                status: e.target.value
                            }))} 
                            className="border border-slate-300 p-2 rounded-xl w-full mt-2"
                            >
                                <option value={`Active`}>Active</option>
                                <option value={`Paused`}>Paused</option>
                            </select>
                        </label>

                        <label htmlFor="new-budget">New budget?
                            <input 
                            type="number"
                            id="new-budget"
                            placeholder="$"
                            value={editedCampaign.budget}
                            onChange={(e) => setEditedCampaign(prev => ({
                                ...prev,
                                budget: e.target.value
                            }))}
                            className="border border-slate-300 p-2 rounded-xl w-full mt-2"
                            />
                        </label>
                        
                        <button 
                        onClick={handleUpdateCampaign}
                        className="text-xl cursor-pointer bg-indigo-500 px-4 py-1.5 rounded-xl text-white font-medium shadow-md hover:shadow-lg duration-150 hover:opacity-90">Update</button>
                    </div>
                </div>
            )

            }

            <div className="flex flex-col gap-6 border bg-white border-slate-100 rounded-lg p-6 w-full h-full shadow-sm">
                
                <div className="flex justify-between">
                    <h3 className="text-lg font-medium truncate">{campaign.campaign_name}</h3>
                    <p className={`${campaign.status === "Active" ? "bg-green-100 w-fit px-4 py-1 rounded-xl" : "bg-yellow-50 px-4 py-1 rounded-xl"} opacity-90`}>{campaign.status}</p>
                </div>

                <p className="text-sm opacity-60 -mb-3">Spend</p>
                <SparkLine spendLineCharts={spendLineCharts}/>
                
                <div className="flex justify-between -mt-3 text-sm opacity-60">
                    <p>7 day</p>
                    <p>Spend</p>
                    <p>7 day</p>
                </div>

                <div className="opacity-90 font-medium gap-2 flex flex-col">
                <p className="opacity-80">Budget:</p>
                <p className="text-lg">${campaign.budget}</p>
                </div>
                <p className="opacity-70 -mt-3">Created: {campaign.created_at.split("T")[0]}</p>
                <hr className="border-slate-300 border opacity-85 appearance-none h-0.5 rounded=x; bg-slate-300"/>
                
                <div className="flex justify-between items-center">
                    <Link to={`/campaign/${campaign.id}`} className="font-medium -mt-1 duration-150 w-fit text-indigo-500 hover:underline" aria-label="An in-depth, campaign-specific dashboard">View insights <i className="fa-solid fa-arrow-right"></i></Link>
                    { campaign.user_role === "Owner" && (
                        <button
                        onClick={() => setEditingCampaign(true)} aria-label="Settings button"
                        ><i className="fa-solid fa-gear text-xl cursor-pointer text-slate-700 hover:rotate-90 duration-200"></i></button>
                    )

                    }
                </div>
            </div>
        </>
    )
}