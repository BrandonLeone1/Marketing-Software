import { campaigns } from "./campaigns"
import { editedCampaign } from "./editedCampaign"
import { spendLineCharts } from "./spendLineCharts"

export type CampaignCardProps = {
    campaign: campaigns,
    spendLineCharts: Array<spendLineCharts>,
    updateCampaign: (editedCampaign: editedCampaign, id: number) => Promise<void>,
    deleteCampaign: (id: number) => Promise<void>
}