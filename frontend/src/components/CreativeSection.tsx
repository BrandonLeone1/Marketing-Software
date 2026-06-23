import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
export function CreativeSection () {
    const id = useParams();

    const [newUpload, setNewUpload] = useState<File | undefined>(undefined);
    const [creativeType, setCreativeType] = useState("");
    console.log(creativeType)
    console.log(newUpload)

    type creativesList = {
        id: number,
        campaign_id: number,
        aws_link: string
        creative_type: string
        votes: number
        uploaded_at: string
    }
    const [creativesList, setCreativesList] = useState<creativesList[]>([]);
    console.log(creativesList);
    const [showingCreatives, setShowingCreatives] = useState(false);
    const APIURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const getCreatives = async () => {
        try {
            const response = await fetch(`${APIURL}/api/campaigns/get-creatives/${id.id}`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error (`Failed`)
            }

            setCreativesList(data.data)
        } catch (error) {
            return console.error(error)
        }
    }

    useEffect(() => {
        getCreatives();
    }, [id])

    const handleUpload = async () => {
        try {
            if (!newUpload) {
                throw new Error(`Didn't receive a file to upload`)
            };

            const response = await fetch(`${APIURL}/api/campaigns/creative-work/upload/${id.id}`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({fileName: newUpload.name, fileType: newUpload.type, fileSize: newUpload.size})
            })
            const {uploadURL, uniqueKey} = await response.json();

            const s3Response = await fetch(uploadURL, {
                method: "PUT",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: newUpload
            })

            if (s3Response.ok) {
              const dbResponse = await fetch(`${APIURL}/api/campaigns/save-creative/${id.id}`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({uniqueKey: uniqueKey, creativeType: creativeType})
              })
              const data = await dbResponse.json();
              console.log(data);
              setNewUpload(undefined);
              setCreativeType("");
            } else {
                throw new Error (`Failed`)
            }

        } catch (error) {
            console.error(error)
        }
    }

    const handleVote = async (creativeID: number) => {
        try {
            
            const response = await fetch(`${APIURL}/api/campaigns/creatives/vote/${creativeID}`, {
                method: "PUT",
                credentials: "include",
                headers: {"Content-Type": "application/json"}
            });
            const data = await response.json();

            if (!data.success) {
                throw new Error (`Failed`)
            }

            getCreatives();

        } catch (error) {
            return console.error(error)
        }
    };

    const handleDeleteCreative = async (creativeID: number) => {
        try {
            
            const response = await fetch(`${APIURL}/api/campaigns/creatives/delete/${creativeID}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error (`Failed`)
            }
            
            setDeletingCreative(null);
            console.log(data)
            getCreatives();

            

        } catch (error) {
            setDeletingCreative(null);
            return console.error(error)
        }
    }

    const [deletingCreative, setDeletingCreative] = useState<creativesList | null>(null);
    
    return (
        <>
            { deletingCreative && (
                <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-xl flex flex-col gap-4 max-w-sm w-full">
                        <p className="text-lg font-medium">Are you sure you would like to remove this creative?</p>
                        
                        <div className="flex gap-6 items-center justify-center">
                            <button onClick={() => setDeletingCreative(null)} className="opacity-80 cursor-pointer">Cancel</button>
                            <button onClick={() => handleDeleteCreative(deletingCreative.id)} className="underline text-rose-800 opacity-80 hover:opacity-100 duration-150 cursor-pointer">Delete</button>
                        </div>
                    
                    </div>
                </div>
            )

            }

            <div className="mt-6 bg-white p-5 rounded-xl border border-zinc-200/80 shadow-sm w-full max-w-md">
                <label htmlFor="upload-creative-work" className="block mb-4">
                    <span className="text-sm font-semibold text-zinc-800 block mb-2">Add creative</span>
                    <input 
                    type="file"
                    id="upload-creative-work"
                    className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200/80 block w-full cursor-pointer transition"
                    onChange={(e) => setNewUpload(e.target.files?.[0])}
                    />
                </label>

                <div className="mb-4">
                <label htmlFor="creative-type">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Creative Variant/Type</span>
                    <input 
                    type="text"
                    id="creative-type"
                    placeholder="A or B"
                    value={creativeType}
                    onChange={(e) => setCreativeType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                </label>
                </div>

                <button 
                className="w-full cursor-pointer font-semibold bg-indigo-600 px-4 py-2 text-sm text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
                onClick={handleUpload}>Upload</button>
            </div>

            <div className="mt-8">

            <button onClick={() => setShowingCreatives(prev => !prev)} className="mb-12 font-medium cursor-pointer text-indigo-500 underline opacity-90 hover:opacity-100 duration-150 text-lg">{showingCreatives ? "Close" : "View creatives"}</button>
            
            <div className="flex flex-col gap-6">
            { showingCreatives && ( 
            
            creativesList.map(creative => (
                <div key={creative.aws_link} className="flex flex-col gap-4 border border-zinc-200 rounded-xl p-4 bg-white shadow-sm w-full max-w-md overflow-hidden">

                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <p className="text-sm font-semibold text-zinc-800">Variant: {creative.creative_type}</p>
                    <button 
                    onClick={() => setDeletingCreative(creative)}
                    className="text-xs font-medium text-rose-600 hover:text-rose-700 cursor-pointer transition-colors">Remove</button>
                </div>

               <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                    <p className="text-xs font-semibold text-zinc-500">Votes received: {creative.votes}</p>
                    <button
                    onClick={() => handleVote(creative.id)}
                    className="cursor-pointer font-semibold bg-white border border-zinc-200 px-3 py-1 text-xs text-zinc-700 rounded-md hover:bg-zinc-50 transition-colors shadow-sm"
                    >Vote</button>
                </div>
            
                <div className="w-full rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50 flex items-center justify-center">
                    <img src={creative.aws_link} alt="Creative Preview" className="w-full h-auto object-contain max-h-96" />
                </div>
                </div>
            ))
        )
            }
            </div>

            </div>
        </>
    )
}