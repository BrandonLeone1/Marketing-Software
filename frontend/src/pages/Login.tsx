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
                <div className="border border-slate-400 p-8 rounded-lg flex flex-col gap-4">
                    <h1 className="text-3xl font-semibold mb-6 text-center">Login to continue</h1>
                    <input 
                    className="border-slate-400 w-full border p-2 rounded-xl opacity-70"
                    placeholder="Email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({
                        ...prev,
                        email: e.target.value
                    }))}
                    />

                    <input 
                    type="password"
                    placeholder="Password"
                    className="border-slate-400 w-full border p-2 rounded-xl opacity-70"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({
                        ...prev,
                        password: e.target.value
                    }))}
                    />

                    <button 
                    onClick={handleClick}
                    className="cursor-pointer w-full bg-neutral-950 text-white py-1.5 rounded-xl shadow-md font-medium text-lg hover:shadow-lg duration-150 hover:opacity-85">Login</button>
                
                <p className="opacity-65 font-medium">Need an account? | <Link to={`/`} className="underline hover:opacity-67 duration-150">Signup here</Link></p>
                </div>

            </main>
        
        </>
    )
}