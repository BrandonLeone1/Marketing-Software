import { Dispatch, SetStateAction, useState } from "react"
import Papa from 'papaparse';



type props = {
    setUploadingCSV: Dispatch<SetStateAction<boolean>>,
    campaign_id: number | undefined
}


export function CSVUpload ({setUploadingCSV, campaign_id}: props) {
    
    const [csvFile, setCSVFile] = useState<File | undefined>(undefined);
    const APIURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const handleCSVUpload = async () => {
        console.log(csvFile, csvFile?.name.split(".").pop())
        try {
            
            if (!csvFile || (csvFile?.name.split(".").pop())?.toLowerCase() !== "csv") {
               return alert (`Please upload a proper CSV file.`);   
            };

            const csvFileSize = Number(csvFile.size);
            const maxFileSize = Number(5 * 1024 * 1024);

            if (csvFileSize > maxFileSize ) {
                return alert(`File is too big. Maximum file size is 5MB`)
            }

            Papa.parse(csvFile, {
                header: true,
                skipEmptyLines: true,
                beforeFirstChunk: (chunk) => {
                    const lines = chunk.split(/\r?\n/);

                    const headerIndex = lines.findIndex(line => 
                        line.toLowerCase().startsWith('day,') ||
                        line.toLowerCase().startsWith('campaign,')
                    );

                    if (headerIndex !== -1) {
                        return lines.slice(headerIndex).join('\n')
                    }

                    return chunk
                },

                complete: async (results) => {
                    const rawRows: any = results.data;
                    console.log(rawRows, "raw")

                    if (rawRows.length < 1 ) {
                        alert("Invalid file format. Please ensure you upload a standard Google Ads report with specific 'Day' and 'Cost' columns.")
                        return;
                    }

                    const properHeaders = Object.keys(rawRows[0]);
                    console.log(properHeaders);

                    if (!properHeaders.includes("Day") && !properHeaders.includes("Date") || !properHeaders.includes("Cost")) {
                        return alert('Please upload a Google Ads CSV following the recommended structure');
                    }

                    try {
                        const normalizedRows = rawRows
                        .filter((row:any) => row["Day"] && row["Day"] !== "Total" && row["Campaign"] !== "Total")
                        .map((row:any) => {
                            
                            const cleanNum = (val: any) => val ? val.replace(/[^0-9.-]+/g, ""): "0";
                            const rawDateValue = row["Day"] || row["Date"];
                            const formattedDate = rawDateValue.includes("T") ? rawDateValue.split("T")[0] : rawDateValue
                            
                            return {
                                campaign_id: campaign_id,
                                metric_date: formattedDate,
                                platform: "Google Ads",
                                ad_spend: parseFloat(cleanNum(row["Cost"])) || 0,
                                impressions: parseInt(cleanNum(row["Impr."])) || parseInt(cleanNum(row["Impressions"])) || 0,
                                clicks: parseInt(cleanNum(row["Clicks"])) || 0,
                                conversions: parseInt(cleanNum(row["Conversions"])) || 0,
                                revenue: parseFloat(cleanNum(row["Conv. Value"])) || 0
                            }
                        })
                        console.log(normalizedRows);

                        const response = await fetch(`${APIURL}/api/metrics/google-ads/add/${campaign_id}`, {
                            method: "POST",
                            credentials: "include",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({metricsArray: normalizedRows})
                        })

                        const data = await response.json();

                        console.log(data)
                        

                    } catch (error) {
                        return console.error(error)
                    }
                }
            })

        } catch (error) {
            return console.error(error)
        }

        
    }
    
    return (

    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white border border-zinc-200 w-full max-w-md rounded-2xl flex flex-col shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
                <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Import Metrics</span>
                <button 
                onClick={() => setUploadingCSV(false)} 
                className="text-xs font-medium text-zinc-400 hover:text-zinc-600 cursor-pointer transition-colors"
                >Cancel</button>
            </div>

            <div className="p-5 flex flex-col gap-5">
                <label htmlFor="google-csv" className="block">
                <span className="text-sm font-semibold text-zinc-800 block mb-2.5">Upload a Google Ads CSV</span>
                    <input 
                    type="file"
                    onChange={(e) => setCSVFile(e.target.files?.[0])}
                    id="google-csv"
                    className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200/80 block w-full cursor-pointer transition-colors"
                    />
                </label>

                <button 
                onClick={handleCSVUpload} 
                className="w-full cursor-pointer font-semibold bg-indigo-600 px-4 py-2.5 text-sm text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors focus:outline-none"
                >Process and Import File
                </button>

            </div>
        </div>
    </div>
    
)
}