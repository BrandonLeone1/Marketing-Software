import { campaigns } from "./campaigns"

export type TeamManagementProps = {
    selectedCampaign: campaigns | undefined,
    setShowingTeam: Function
}