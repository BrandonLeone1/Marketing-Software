import { ReactNode } from "react"
import { activeUser } from "../types/activeUser"
import { Navigate } from "react-router-dom"

type props = {
    activeUser: activeUser | null,
    children: ReactNode,
    loadingAuth: boolean
}

export function ProtectedRoute ({activeUser, children, loadingAuth}: props) {

    if (loadingAuth) {
        return (
            <div className="flex flex-col gap-6">
                <p>Please wait...</p>
                <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        )
    }

    if (!activeUser) {
        return <Navigate to={"/login"}/>
    }

    return children
}