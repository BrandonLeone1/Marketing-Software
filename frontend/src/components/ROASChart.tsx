import { ROASCardProps } from "../types/ROASCardProps";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ROASChart ({roasInfo}: ROASCardProps) {
    return (
        <>
        <div style={{width: "100%", height: "350px"}}>
        
                        <ResponsiveContainer width={"100%"} height={"100%"}>
        
                            <AreaChart data={roasInfo}>
                                <defs>
                                    <linearGradient id="roasGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray={"3 3"} vertical={false} stroke="#e0e0e0"/>
                                <XAxis dataKey="metric_date" tickLine={false} axisLine={false} hide/>
                                <YAxis tickLine={false} axisLine={false} hide/>
                                <Tooltip />
                                <Area type="monotone" dataKey="roas" stroke="#8884d8" fillOpacity={1} fill="url(#roasGradient)" strokeWidth={2} />
                            </AreaChart>
        
                        </ResponsiveContainer>
        
                    </div>
        </>
    )
}