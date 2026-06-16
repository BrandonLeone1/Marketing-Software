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

            <main className="grid grid-cols-1 md:grid-cols-2 xl:h-screen md:h-screen w-full gap-6 mx-auto p-8">
                
                <section className="bg-slate-950 shadow-md md:order-2 order-1 w-full text-white h-full p-8 rounded-lg">
                
                <div className="flex gap-6 flex-col p-6 justify-center h-full xl:-mt-6 max-w-[60ch]">
                    <h1 className="text-4xl font-semibold">Built To Organize <span className="font-light text-slate-400">Campaigns</span></h1>
                    <p className="font-medium opacity-70"><i className="fa-solid fa-exclamation text-slate-400"></i> Marketing campaigns are difficult to track while keeping everyone on the same page - learned first hand throughout my experience.</p>
                    <p className="font-medium opacity-70"><i className="fa-solid fa-check text-emerald-600"></i> Introducing a collaborative marketing campaign tracking solution. Keep the research team and the creatives on the same page all in one service.</p>

                </div>
                
                </section>

                <section className="mx-auto border md:order-2 shadow-md  w-full border-slate-400 h-full p-8 rounded-lg">
                    
                    <div className="flex gap-4 mx-auto flex-col justify-center h-full p-6 max-w-[60ch]">
                        <h2 className="text-3xl text-center font-semibold mb-4">Create your account</h2>
                        
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block" htmlFor="new-email">Email
                            <input 
                            type="email"
                            id="new-email"
                            placeholder="example@email.com"
                            value={newUser.email}
                            onChange={(e) => setNewUser(prev => ({
                                ...prev,
                                email: e.target.value
                            }))}
                            className="border-slate-300 w-full border px-2 py-3 text-base mt-1 mb-1 rounded-xl opacity-70 focus:ring-4 focus:ring-indigo-500 focus:outline-0"
                            />
                        </label>

                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block" htmlFor="new-password">Password
                            <input 
                            type="password"
                            id="new-password"
                            placeholder="Secure password"
                            value={newUser.password}
                            onChange={(e) => setNewUser(prev => ({
                                ...prev,
                                password: e.target.value
                            }))}
                            className="border-slate-300 w-full border px-2 py-3 text-base rounded-xl mt-1 mb-1  opacity-70 focus:ring-4 focus:ring-indigo-500 focus:outline-0"
                            />
                        </label>

                        <button 
                        onClick={handleClick}
                        className="cursor-pointer w-full bg-indigo-500 text-white py-1.5 rounded-xl shadow-md font-medium text-lg hover:shadow-lg duration-150 hover:bg-indigo-600">Signup</button>
                    </div>
                    
                        <p className="opacity-65 font-medium ">Have an account? | <Link to={`/login`} className="underline hover:opacity-67 duration-150">Login here</Link></p>
                </section>
            </main>

        </>
    )
}