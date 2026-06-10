import { CampaignViewCardProps } from "../types/CampaignViewCardProps";

export function CampaignViewCard ({campaignSummary, title}:CampaignViewCardProps) {

   

    return (
        <>
            <div className="mx-auto shadow-sm w-full h-full flex flex-col items-center justify-center gap-6 border p-6 rounded-lg border-slate-100 bg-white">
                <div className="flex items-center flex-col gap-4">
                    <h3>{title === "traffic" && "Total clicks:"}{title === "conversions" && "Conversion rate:"}{title === "impressions" && "Total impressions:"}</h3>
                    
                    <p className="text-3xl font-medium">
                        
                        {title === "conversions" && Number(campaignSummary?.conversion_rate).toFixed(2) + "%"}
                        {title === "traffic" && (Number(campaignSummary?.clicks)).toLocaleString('en-US')}
                        {title === "impressions" && Number(campaignSummary?.impressions).toLocaleString('en-US')}
                    </p>
                    
                </div>
            </div>
        </>
    )
}