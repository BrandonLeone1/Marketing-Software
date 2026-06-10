import { PlatformBreakdownProps } from "../types/PlatformBreakdownProps";

export function PlatformBreakdown ({breakdown}: PlatformBreakdownProps) {
    console.log(breakdown, "BREAKDOWN");

    const useable = breakdown?.map(breakdown => {
        return {
            platform: breakdown.platform,
            clicks: Number(Number(breakdown.clicks).toFixed(2).toLocaleString()),
            impressions: Number(Number(Number(breakdown.impressions)).toFixed(2).toLocaleString()),
            conversions: Number(Number(breakdown.conversions).toFixed(2).toLocaleString()),
            spend: Number(Number(breakdown.spend).toFixed(2).toLocaleString()),
            revenue: Number(Number(breakdown.revenue).toFixed(2).toLocaleString()),
            roas: Number(Number(breakdown.roas).toFixed(2).toLocaleString()),
            ctr: Number(Number(breakdown.ctr).toFixed(2).toLocaleString()),
            cpa: Number(Number(breakdown.cpa).toFixed(2).toLocaleString())
        }
    })
    return (
        <>
        
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="p-3">Platform</th>
                <th className="p-3 text-right">Clicks</th>
                <th className="p-3 text-right">Impressions</th>
                <th className="p-3 text-right">Conversions</th>
                <th className="p-3 text-right">Ad Spend</th>
                <th className="p-3 text-right">Revenue</th>
                <th className="p-3 text-right">ROAS</th>
                <th className="p-3 text-right">CTR</th>
                <th className="p-3 text-right">CPA</th>
            </tr>
        </thead>
                    <tbody className="divide-y divide-slate-50 text-sm text-slate-700 font-medium">
                        
                        { useable.map(useable => {
                            const platform = useable.platform;
                            const clicks = useable.clicks;
                            const impressions = useable.impressions;
                            const conversions = useable.conversions;
                            const spend = useable.spend;
                            const revenue = useable.revenue;
                            const roas = useable.roas;
                            const ctr = useable.ctr;
                            const cpa = useable.cpa;
                            return (
                                <tr key={useable.platform} className="hover:bg-slate-50/50 duration-150">
                                    <td className="p-3 font-semibold text-slate-900 capitalize">{platform}</td>

                                    <td className="p-3 text-right text-slate-600">{clicks}</td>
                                    <td className="p-3 text-right text-slate-600">{impressions}</td>
                                    <td className="p-3 text-right text-slate-600">{conversions}</td>
                                    <td className="p-3 text-right text-slate-600">${spend}</td>
                                    <td className="p-3 text-right text-slate-600">${revenue}</td>
                                
                                    <td className="p-3 text-right font-semibold text-indigo-500">{roas}x</td>
                                    <td className="p-3 text-right text-slate-600">{ctr}%</td>
                                    <td className="p-3 text-right text-slate-600">${cpa}</td>
                                </tr>
                            )
                        } )

                        }
                        
                    </tbody>
                </table>
            </div>
        
        </>
    )
}