import { RevenueVsSpendProps } from "../types/RevenueVsSpendProps";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
export function RevenueVsSpend ({campaignTrends}: RevenueVsSpendProps) {
    
    
    const formatter = new Intl.DateTimeFormat(`en-US`, {
        month: "2-digit",
        day: "numeric"
    })
    const revenueAndSpendInfo = campaignTrends.map(item => {
        return {
            metric_date: (formatter.format( new Date(item.metric_date))),
            revenue: item.revenue,
            spend: item.spend,
        }
    })

    
    
    return (
        <>
        <div style={{width: "100%", height: "500px"}}>
            <ResponsiveContainer>
                <ComposedChart data={revenueAndSpendInfo} margin={{top: 20, right: 20, left: 20, bottom: 20}}>
                    <CartesianGrid strokeDasharray={"3 3"} vertical={false} stroke="#E5E7EB"/>
                    <XAxis dataKey={"metric_date"} stroke="#9CA3AF"/>
                    <YAxis stroke="#9CA3AF"/>
                    <Tooltip />
                    <Legend />

                    <Area 
                    type={"monotone"}
                    dataKey={"revenue"}
                    fill="#E0F2FE"
                    stroke="#0284C7"
                    strokeWidth={2}
                    name="Revenue"
                    />

                    <Line 
                    type={"monotone"}
                    dataKey={"spend"}
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{r: 4, stroke: '#EF4444', strokeWidth: 2, fill: "#F8FAFC"}}
                    activeDot={{r: 7, stroke: "#EF4444", strokeWidth: 3, fill: "#EF4444"}}
                    name="Ad Spend"
                    />

                </ComposedChart>
            </ResponsiveContainer>

        </div>
        
        </>
    )
}