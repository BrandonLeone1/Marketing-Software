import { useState } from "react"
import { newUser } from "../types/newUser"
import { SignupProps } from "../types/SignupProps";
import { Link } from "react-router-dom";

export function Signup ({signupUser}: SignupProps) {
    
    const initialState:newUser = {
        email: "",
        password: ""
    }

    const [newUser, setNewUser] = useState<newUser>(initialState);

    const handleClick = async () => {
        await signupUser(newUser);

        setNewUser({
            email: "",
            password: ""
        });
    }
    
    return (
        <>

            <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full gap-6 lg:gap-12 mx-auto p-6 md:p-10 max-w-7xl">
                
                <section className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl md:order-1 order-1 w-full text-white flex items-center justify-center p-8 md:p-12 rounded-2xl">
                
                <div className="flex gap-8 flex-col max-w-[48ch] py-8">
                    
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">Built To Organize <span className="font-normal bg-linear-to-r from-slate-400 to-slate-200 bg-clip-text text-transparent">Campaigns</span></h1>
                    <div className="space-y-5 text-sm md:text-base leading-relaxed text-slate-300">
                        <div className="flex gap-4 items-start">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400"><i className="fa-solid fa-exclamation"></i></span>
                            <p>Marketing campaigns are difficult to track while keeping everyone on the same page—learned first hand throughout my experience.</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-800/60 text-xs text-emerald-400"><i className="fa-solid fa-check"></i></span>
                            <p>Introducing a collaborative marketing campaign tracking solution. Keep the research team and the creatives on the same page all in one service.</p>
                        </div>
                    </div>
                
                </div>
                
                </section>

                <section className="mx-auto border order-2 md:order-2 shadow-sm bg-white w-full border-zinc-200 flex items-center justify-center p-8 md:p-12 rounded-2xl">
                    
                    <div className="flex gap-5 w-full flex-col justify-center max-w-[42ch] py-4">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-2">Create your account</h2>
                        
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest block" htmlFor="new-email">Email
                            <input 
                            type="email"
                            id="new-email"
                            placeholder="example@email.com"
                            value={newUser.email}
                            onChange={(e) => setNewUser(prev => ({
                                ...prev,
                                email: e.target.value
                            }))}
                            
                            className="w-full mt-1.5 px-3 py-2.5 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                            />
                        </label>

                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest block" htmlFor="new-password">Password
                            <input 
                            type="password"
                            id="new-password"
                            placeholder="Secure password"
                            value={newUser.password}
                            onChange={(e) => setNewUser(prev => ({
                                ...prev,
                                password: e.target.value
                            }))}
                            className="w-full mt-1.5 px-3 py-2.5 text-sm bg-zinc-50/50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none"
                            />
                        </label>

                        <button 
                        onClick={handleClick}
                        className="w-full mt-2 cursor-pointer bg-indigo-600 text-white py-2.5 px-4 rounded-lg shadow-sm font-semibold text-sm tracking-wide transition-all hover:bg-indigo-700 active:scale-[0.99] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Sign up</button>
                    
                        <div className="flex items-center justify-between flex-wrap gap-y-2 mt-4 text-xs text-zinc-500 font-medium tracking-wide">
                            <p>Have an account? <Link to={`/login`} className="text-indigo-600 font-semibold hover:underline ml-1">Log in</Link></p>
                            <Link to={`/security`} className="text-zinc-400 hover:text-zinc-600 transition hover:underline">Security & Architecture</Link>
                        </div>
                    </div>
                        
                        
                </section>
            </main>

        </>
    )
}