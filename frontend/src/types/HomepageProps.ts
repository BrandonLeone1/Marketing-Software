import { campaigns } from "./campaigns"
import { editedCampaign } from "./editedCampaign"
import { newCampaign } from "./newCampaign"

export type HomepageProps = {
    campaigns: Array<campaigns>,
    addCampaign: (newCampaign: newCampaign) => Promise<void>,
    updateCampaign: (editedCampaign: editedCampaign, id: number) => Promise<void>,
    deleteCampaign: (id: number) => Promise<void>
}