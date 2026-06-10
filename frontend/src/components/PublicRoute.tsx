import { Navigate } from "react-router-dom";
import { RouteProps } from "../types/RouteProps";
export function PublicRoute ({activeUser, children}: RouteProps) {
    if (activeUser) {
        return <Navigate to={`/dashboard`}/>
    }

    return children
}