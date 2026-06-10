import { CPACardProps } from "../types/CPACardProps";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export function CPAChart ({cpaInfo}: CPACardProps) {
    return (
        <>

            <div style={{width: "100%", height: "350px"}}>

                <ResponsiveContainer width={"100%"} height={"100%"}>

                    <AreaChart data={cpaInfo} margin={{}}>
                        <defs>
                            <linearGradient id="cpaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray={"3 3"} vertical={false} stroke="#e0e0e0"/>
                        <XAxis dataKey="metric_date" tickLine={false} axisLine={false} hide/>
                        <YAxis tickLine={false} axisLine={false} hide/>
                        <Tooltip />
                        <Area type="monotone" dataKey="cpa" stroke="#8884d8" fillOpacity={1} fill="url(#cpaGradient)" strokeWidth={2} />
                    </AreaChart>

                </ResponsiveContainer>

            </div>

        </>
    )
}