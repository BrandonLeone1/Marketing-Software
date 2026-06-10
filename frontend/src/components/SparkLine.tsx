import { SparkLineProps } from "../types/SparkLineProps";
import { ResponsiveContainer, AreaChart, Area, XAxis } from 'recharts';

export function SparkLine ({spendLineCharts}: SparkLineProps) {
    return (
        <>
        
        <div style={{ width: "100%", height: '300px', display: 'block', minWidth: 0, }} className="mx-auto">
         <ResponsiveContainer width={"100%"} height={"100%"} minHeight={0} minWidth={0} className=" mx-auto">
            <AreaChart data={spendLineCharts}>
                <XAxis dataKey="metric_date" hide />
                <Area 
                type={"monotone"}
                dataKey={`spend`}
                stroke="#4F46E5"
                strokeWidth={2}
                fill="#EEF2FF" 
                dot={false}
                />
            </AreaChart>
         </ResponsiveContainer>
        </div>
        </>
    )
}