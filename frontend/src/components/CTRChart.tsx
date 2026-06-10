import { CTRCardProps } from "../types/CTRCardProps";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function CTRChart ({ctrInfo}: CTRCardProps) {
    return (
        <>

            <div style={{width: "100%", height: "350px"}}>
            
                <ResponsiveContainer width={"100%"} height={"100%"}>
            
                    <AreaChart data={ctrInfo}>
                        <defs>
                            <linearGradient id="ctrGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid strokeDasharray={"3 3"} vertical={false} stroke="#e0e0e0"/>
                        <XAxis dataKey="metric_date" tickLine={false} axisLine={false} hide/>
                        <YAxis tickLine={false} axisLine={false} hide/>
                        <Tooltip />
                        <Area type="monotone" dataKey="ctr" stroke="#8884d8" fillOpacity={1} fill="url(#ctrGradient)" strokeWidth={2} />
                    </AreaChart>
            
                </ResponsiveContainer>
            
            </div>
        
        </>
    )
}