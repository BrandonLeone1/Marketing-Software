import { useState } from "react"
import { SecurityItem } from "../pages/Security"

type props = {
    SecurityItem: SecurityItem
}

export function SecurityI ({SecurityItem}: props) {
    
    const [showDescription, setShowDescription] = useState(false);
    
    return (
        <>
        <div className="flex flex-col gap-3 items-baseline ">
            <button 
            onClick={() => setShowDescription(prev => !prev)}
            className={`cursor-pointer font-medium text-xl block mr-auto hover:text-indigo-500 ${showDescription && "text-indigo-500"}`}>• {SecurityItem.title} <i className={`fa-solid fa-angle-down duration-150 ${showDescription && "rotate-180 duration-150"}`}></i></button>
            
            
                <div className={`transition-all opacity-0 max-h-0 duration-150 ease-in-out overflow-hidden ${showDescription && "opacity-100 max-h-80 duration-150"}`}>
                <p className="block ml-5 opacity-80 max-w-[65ch] text-lg">- {SecurityItem.description}</p>
                </div>

            
            
        </div>
        </>
    )
}