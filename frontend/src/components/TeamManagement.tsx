import { useEffect, useState } from "react";
import { TeamManagementProps } from "../types/TeamManagementProps";

export function TeamManagement ({selectedCampaign, setShowingTeam}: TeamManagementProps) {
    
   

    const getTeamMembers = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`https://api.metricflows.xyz/api/campaigns/get-team/${selectedCampaign?.id}`, {
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
            const response = await fetch(`https://api.metricflows.xyz/api/campaigns/remove-member/${selectedCampaign?.id}`, {
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
            const response = await fetch(`https://api.metricflows.xyz/api/campaigns/add-member/${selectedCampaign?.id}`, {
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
      
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40">
            <div className="bg-white fixed right-0 z-100 top-[10%] w-full lg:w-[25%] p-6 rounded-lg shadow-xl border border-slate-200 max-h-100 overflow-y-auto">
                <button 
                onClick={() => setShowingTeam(false)}
                className="block ml-auto cursor-pointer opacity-70 hover:opacity-100 duration-150 underline">Close</button>
                <h3 className="text-xl font-medium mb-2">Team members</h3>

                <label htmlFor="new-member-input"><span className="mt-2 px-2 opacity-70">Add another?</span>
                <input 
                type="email"
                placeholder="Email address"
                id="new-member-input"
                className="w-full mt-2 border p-2 rounded-xl border-slate-200 opacity-70"
                value={newMember?.email}
                onChange={(e) => setNewMember(prev => ({
                    ...prev,
                    email: e.target.value
                }))}
                />
                </label>
                <button 
                onClick={handleAddMember}
                className="mt-3 cursor-pointer font-medium bg-indigo-500 px-4 py-1 rounded text-white hover:bg-indigo-600 duration-150">Add</button>

                <div className="mt-6">
                { teamMembers.map(teamMembers => (
                    <div key={teamMembers.email} className="flex justify-between items-center">
                    <p className="ml-2">• {teamMembers.email}</p>
                    <button 
                    onClick={() => setConfirmDelete(teamMembers)}
                    aria-label="Remove team member" className="cursor-pointer"><i className="fa-solid fa-trash text-rose-800 opacity-70 hover:opacity-100 duration-150"></i></button>
                   </div>
                ))

                }

                { confirmDelete !== null && (
                    <div className="border p-2 mt-4 rounded-xl border-slate-200 flex flex-col gap-4">
                        <button
                        onClick={() => setConfirmDelete(null)}
                        className="block ml-auto underline opacity-50 text-sm cursor-pointer hover:opacity-100 duration-150"
                        >Cancel</button>
                        <p className="text-center text-sm opacity-70">Delete member: {confirmDelete.email}?</p>
                        <button 
                        onClick={handleDeleteMember}
                        className="text-sm font-medium w-fit mx-auto cursor-pointer underline text-rose-800 hover:opacity-80">Delete</button>
                    </div>
                )

                }
                </div>
            </div>
        </div>
        </>
    )
}