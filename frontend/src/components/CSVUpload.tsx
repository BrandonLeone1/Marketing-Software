import { Dispatch, SetStateAction, useState } from "react"
import Papa from 'papaparse';



type props = {
    setUploadingCSV: Dispatch<SetStateAction<boolean>>,
    campaign_id: number | undefined
}


export function CSVUpload ({setUploadingCSV, campaign_id}: props) {
    
    const [csvFile, setCSVFile] = useState<File | undefined>(undefined);

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
                                revenue: parseFloat(cleanNum(row["Conv. value"])) || 0
                            }
                        })
                        console.log(normalizedRows);

                        const response = await fetch(`https://api.metricflows.xyz/api/metrics/google-ads/add/${campaign_id}`, {
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

    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 flex items-center justify-center p-6">
        <div className="bg-white p-8 max-w-5xl rounded-lg flex flex-col gap-2 max-h-150 overflow-y-auto lg:min-w-xl">
            
            <button
            className="underline opacity-70 block ml-auto cursor-pointer hover:opacity-100 mb-3 duration-150"
            onClick={() => setUploadingCSV(false)}
            >Cancel</button>

            <label htmlFor="google-csv"><span className="font-medium">Upload a Google Ads CSV</span>
                <input 
                type="file"
                onChange={(e) => setCSVFile(e.target.files?.[0])}
                id="google-csv"
                className="border p-2 border-slate-300 rounded-lg mt-2 opacity-70 block cursor-pointer hover:bg-slate-100 duration-150 w-fit"
                />
            </label>

            <button onClick={handleCSVUpload}>Upload</button>
        </div>
    </div>
    
)
}