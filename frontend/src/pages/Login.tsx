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
        
            <main className="flex items-center justify-center min-h-screen bg-zinc-50 p-6">
                <div className="w-full max-w-105 p-8 md:p-10 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-5">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2 text-center">Log in to continue</h1>
                    
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest block" htmlFor="existing-email">Email
                        <input
                        id="existing-email" 
                        className="w-full mt-1.5 px-3 py-2.5 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                        placeholder="example@email.com"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({
                            ...prev,
                            email: e.target.value
                        }))}
                        />
                    </label>
                    
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest block" htmlFor="existing-password">Password
                        <input
                        id="existing-password" 
                        type="password"
                        placeholder="Your password"
                        className="w-full mt-1.5 px-3 py-2.5 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                        value={newUser.password}
                        onChange={(e) => setNewUser(prev => ({
                            ...prev,
                            password: e.target.value
                        }))}
                        />
                    </label>

                    <button 
                    onClick={handleClick}
                    className="w-full cursor-pointer mt-2 bg-indigo-600 text-white py-2.5 px-4 rounded-lg shadow-sm font-semibold text-sm tracking-wide transition-all hover:bg-indigo-700 active:scale-[0.99] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Log in</button>
                
                    <p className="text-xs text-zinc-500 text-center font-medium tracking-wide mt-2">Need an account? <Link to={`/`} className="text-indigo-600 font-semibold hover:underline ml-1">Sign up</Link></p>
                </div>

            </main>
        
        </>
    )
}