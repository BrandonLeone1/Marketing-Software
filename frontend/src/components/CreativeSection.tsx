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

    const getCreatives = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/campaigns/get-creatives/${id.id}`, {
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

            const response = await fetch(`http://localhost:5000/api/campaigns/creative-work/upload/${id.id}`, {
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
              const dbResponse = await fetch(`http://localhost:5000/api/campaigns/save-creative/${id.id}`, {
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
            
            const response = await fetch(`http://localhost:5000/api/campaigns/creatives/vote/${creativeID}`, {
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
            
            const response = await fetch(`http://localhost:5000/api/campaigns/creatives/delete/${creativeID}`, {
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
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg flex flex-col gap-4">
                        <p className="text-lg font-medium">Are you sure you would like to remove this creative?</p>
                        
                        <div className="flex gap-6 items-center justify-center">
                            <button onClick={() => setDeletingCreative(null)} className="opacity-80 cursor-pointer">Cancel</button>
                            <button onClick={() => handleDeleteCreative(deletingCreative.id)} className="underline text-rose-800 opacity-80 hover:opacity-100 duration-150 cursor-pointer">Delete</button>
                        </div>
                    
                    </div>
                </div>
            )

            }

            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm w-fit">
                <label htmlFor="upload-creative-work"><span className="text-xl">Add creative</span>
                    <input 
                    type="file"
                    id="upload-creative-work"
                    className="border p-2 border-slate-300 rounded-lg mt-2 opacity-70 block cursor-pointer hover:bg-slate-100 duration-150 w-fit"
                    onChange={(e) => setNewUpload(e.target.files?.[0])}
                    />
                </label>

                <div className="mt-3">
                <label htmlFor="creative-type"><span className="text-lg opacity-80">Type?</span>
                    <input 
                    type="text"
                    id="creative-type"
                    placeholder="A or B"
                    value={creativeType}
                    onChange={(e) => setCreativeType(e.target.value)}
                    className="border p-2 rounded-lg mt-3 w-fit block opacity-70 border-slate-300"
                    />
                </label>
                </div>

                <button 
                className="mt-3 cursor-pointer font-medium bg-indigo-500 px-4 py-1 rounded text-white hover:opacity-90 duration-150"
                onClick={handleUpload}>Upload</button>
            </div>

            <div className="mt-8">

            <button onClick={() => setShowingCreatives(prev => !prev)} className="mb-12 font-medium cursor-pointer text-indigo-500 underline opacity-70 hover:opacity-100 duration-150 text-lg">{showingCreatives ? "Close" : "View creatives"}</button>
            
            <div className="flex flex-col gap-6">
            { showingCreatives && ( 
            
            creativesList.map(creative => (
                <div key={creative.aws_link} className="flex flex-col gap-4 border p-4 rounded-lg border-slate-200">

                <div className="flex gap-2 items-center mb-3">
                    <p className="text-xl font-medium">Type: {creative.creative_type}</p>
                    <button 
                    onClick={() => setDeletingCreative(creative)}
                    className="text opacity-70 text-rose-800 underline cursor-pointer hover:opacity-100">Remove creative?</button>
                </div>

               
                <p className="">Current votes: {creative.votes}</p>
                <button
                onClick={() => handleVote(creative.id)}
                className="mt-3 cursor-pointer font-medium bg-indigo-500 px-4 py-1 rounded text-white hover:opacity-90 duration-150 w-fit"
                >Vote</button>
            

                <img src={creative.aws_link} />
               
                </div>
            ))
        )
            }
            </div>

            </div>
        </>
    )
}