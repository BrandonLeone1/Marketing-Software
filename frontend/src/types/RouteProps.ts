import { ReactNode } from "react"
import { activeUser } from "./activeUser"

export type RouteProps = {
    activeUser: activeUser,
    children: ReactNode
}