export type campaigns = {
    id: number,
    campaign_name: string,
    created_at: string,
    status: "Active" | "Paused",
    budget: number,
    user_role: "Owner" | "Member"
}