import { useState } from "react";
import { newUser } from "../types/newUser";
import { LoginProps } from "../types/LoginProps";
import {Link} from 'react-router-dom';

export function Login ({loginUser}: LoginProps) {
    
    const initialState:newUser = {
        email: "",
        password: ""
    };

    const [newUser, setNewUser] = useState<newUser>(initialState);

    const handleClick = async () => {
        await loginUser(newUser);

        setNewUser({
            email: "",
            password: ""
        });
    };
    
    return (
        <>
        
            <main className="flex items-center justify-center h-screen p-6">
                <div className="p-8 bg-white rounded-lg shadow-xl shadow-slate-100 border border-slate-50 flex flex-col gap-4">
                    <h1 className="text-3xl font-semibold mb-6 text-center">Login to continue</h1>
                    
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block" htmlFor="existing-email">Email
                        <input
                        id="existing-email" 
                        className="border-slate-300 w-full border px-2 py-3 mt-1 mb-1 text-base focus:ring-4 focus:ring-indigo-500 focus:outline-0 rounded-xl opacity-70"
                        placeholder="example@email.com"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({
                            ...prev,
                            email: e.target.value
                        }))}
                        />
                    </label>
                    
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block" htmlFor="existing-password">Password
                        <input
                        id="existing-password" 
                        type="password"
                        placeholder="Your password"
                        className="border-slate-300 w-full border px-2 py-3 mt-1 mb-1 text-base focus:ring-4 focus:ring-indigo-500 focus:outline-0 rounded-xl opacity-70"
                        value={newUser.password}
                        onChange={(e) => setNewUser(prev => ({
                            ...prev,
                            password: e.target.value
                        }))}
                        />
                    </label>

                    <button 
                    onClick={handleClick}
                    className="cursor-pointer w-full bg-indigo-500 text-white py-1.5 rounded-xl shadow-md font-medium text-lg hover:shadow-lg duration-150 hover:bg-indigo-600">Login</button>
                
                <p className="opacity-65 font-medium">Need an account? | <Link to={`/`} className="underline hover:opacity-67 duration-150">Signup here</Link></p>
                </div>

            </main>
        
        </>
    )
}