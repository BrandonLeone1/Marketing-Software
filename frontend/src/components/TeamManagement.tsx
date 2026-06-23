import { useEffect, useState } from "react";
import { TeamManagementProps } from "../types/TeamManagementProps";

export function TeamManagement ({selectedCampaign, setShowingTeam}: TeamManagementProps) {
    
   const APIURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const getTeamMembers = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${APIURL}/api/campaigns/get-team/${selectedCampaign?.id}`, {
                credentials: "include",
                headers: {"Authorization": `Bearer ${token}`}
            })
            const data = await response.json();

            console.log(data);
            if (!data.success) {
                throw new Error (`Failed to get team members`)
            }

            setTeamMembers(data.data);
        } catch (error) {
            return console.error(error)
        }
    }

    type teamMember = {
        email: string
        membersid: number
    }

    useEffect(() => {
        getTeamMembers()
    }, [selectedCampaign]);

    const [teamMembers, setTeamMembers] = useState<teamMember[]>([]);
    console.log(teamMembers, "TEAM");


    const [confirmDelete, setConfirmDelete] = useState<teamMember | null>(null);
  

    const handleDeleteMember = async () => {
        
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${APIURL}/api/campaigns/remove-member/${selectedCampaign?.id}`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
            body: JSON.stringify(confirmDelete)
        });

        const data = await response.json();

        console.log(data, "data");

        if (!data.success) {
            throw new Error (`Failed`)
        }
        setConfirmDelete(null)
        getTeamMembers();
        } catch (error) {
            return console.error(error)
        }
        
        
    }
    type newMember = {
        email: string
    }
    const [newMember, setNewMember] = useState<newMember | null>(null);

    const handleAddMember = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${APIURL}/api/campaigns/add-member/${selectedCampaign?.id}`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify(newMember)
            })

            const data = await response.json();

            console.log(data);

            if (!data.success) {
                throw new Error(`Failed`)
            };

            setNewMember({
                email: ""
            })
            getTeamMembers();
        } catch (error) {
            return console.error(error)
        }
    }
    
    return (
        <>
      
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex justify-end">
            <div className="bg-white h-full w-full sm:max-w-md border-l border-zinc-200 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
                
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
                    <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">Team Management</h3>
                    <button 
                    onClick={() => setShowingTeam(false)}
                    className="text-xs font-medium text-zinc-400 hover:text-zinc-600 cursor-pointer transition-colors"
                    >Close</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    
                    <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl flex flex-col gap-3">
                        <label htmlFor="new-member-input" className="block">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Invite New Member</span>
                            <input 
                            type="email"
                            placeholder="colleague@company.com"
                            id="new-member-input"
                            className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            value={newMember?.email}
                            onChange={(e) => setNewMember(prev => ({
                            ...prev,
                            email: e.target.value
                            }))}
                            />
                        </label>

                        <button 
                        onClick={handleAddMember}
                        className="w-full cursor-pointer font-semibold bg-indigo-600 px-4 py-2 text-xs text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
                        >Send Invitation</button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Active Members ({teamMembers.length})</span>
                        { teamMembers.map(teamMembers => (
                            <div key={teamMembers.email} className="flex justify-between items-center p-3 border border-zinc-100 rounded-xl hover:bg-zinc-50/50 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 uppercase">
                                        {teamMembers.email.slice(0, 2)}
                                    </div>
                                </div>
                                
                                <button 
                                onClick={() => setConfirmDelete(teamMembers)}
                                aria-label="Remove team member" 
                                className="cursor-pointer p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                                ><i className="fa-solid fa-trash text-xs"></i></button>
                            </div>
                        ))
                        }
                    </div>

                    { confirmDelete !== null && (
                    <div className="border border-rose-100 bg-rose-50/30 p-4 mt-3 rounded-xl flex flex-col gap-3 animate-in fade-in-50 duration-200">
                        <p className="text-xs font-medium text-rose-800 text-center">Remove <span className="font-bold">{confirmDelete.email}</span> from campaign access?</p>
                        
                        <div className="flex gap-3 justify-center">
                            <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-1 text-xs font-semibold text-zinc-500 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 cursor-pointer transition-colors"
                            >Keep Member</button>
                            
                            <button 
                                onClick={handleDeleteMember}
                                className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 rounded-md hover:bg-rose-700 shadow-sm cursor-pointer transition-colors"
                            >Confirm Revoke</button>
                        </div>
                    </div>
                )

                }

                </div>
                
               
            </div>
        </div>
        </>
    )
}