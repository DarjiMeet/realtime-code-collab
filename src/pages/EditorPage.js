import React,{ useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate,useParams } from "react-router-dom";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../Socket";
import Actions from "../Actions";
import toast from "react-hot-toast";

const EditorPage = () => {
    const socketRef = useRef(null)
    const codeRef = useRef(null)
    const location = useLocation()
    const {roomId} = useParams()

    const navigate = useNavigate()

    useEffect(()=>{
        const init = async ()=>{
            socketRef.current = await initSocket()

            socketRef.current.on('connect_error',(err)=>handleErrors(err))
            socketRef.current.on('connect_failed',(err)=>handleErrors(err))

            function handleErrors(e){
                toast.error("Socket connection failed, try again later.")
                navigate('/')
            }

            socketRef.current.emit(Actions.JOIN,{
                roomId,
                username:location.state?.username
            })
            
            socketRef.current.on(Actions.JOINED,({clients,username,socketId})=>{
                if(username !== location.state?.username){
                    toast.success(`${username} joined the room`)
                    console.log(`${username} joined `)
                }
                setClients(clients)
                socketRef.current.emit(Actions.SYNC_CODE,
                    {
                        code:codeRef.current,
                        socketId
                    }
                )
            })

            socketRef.current.on(Actions.DISCONNECTED,({socketId,username})=>{
                toast.success(`${username} left the room`)
                setClients((prev)=>{
                    return prev.filter(client=>client.socketId!==socketId)
                })
            })
        }
        init()

        return ()=>{
            socketRef.current.disconnect()
            socketRef.current.off(Actions.JOINED)
            socketRef.current.off(Actions.DISCONNECTED)
        }
    },[])

    const [clients, setClients] = useState([])

    const copyRoomId = async()=>{
        try {
            
            await navigator.clipboard.writeText(roomId)
            toast.success('Room ID copied!')

        } catch (error) {
            toast.error('Could not copy the Room ID')
            console.error(error)
        }
    }

    const leaveRoom = ()=>{
        navigate('/')
    }

    if(!location.state){
        <Navigate to="/"/>
    }

    return ( 

    <div className="
        grid 
        grid-cols-2
        sm:grid-cols-4
        md:grid-cols-5
        lg:grid-cols-6
        xl:grid-cols-7
        
    ">
  
        <div className="bg-black max-h-screen text-white border-r-2">
            <div className="m-4 h-screen fixed overflow-scroll scrollbar-hide">
                <img src="/code-sync.png" className="w-[70px] md:w-[150px] h-auto " alt="logo"/>
                <div className="mt-8 text-sm sm:text-lg font-semibold">Connected</div>
                <div className="grid grid-cols-2 ">
                    {clients.map((client)=>(
                        <Client
                            key={client.socketId}
                            username={client.username}
                        />
                    ))}
                </div>
                
                <div className="relative h-[120px] mt-4">
                    <div className="flex flex-col absolute bottom-0 ">
                        <button onClick={copyRoomId} className="bg-white text-black text-sm hover:opacity-70 font-semibold pt-2 pb-2 pl-3 pr-4 lg:pl-7 lg:pr-7 rounded-xl">
                            Copy Room ID
                        </button>
                        <button  onClick={leaveRoom} className="mt-5 bg-red-700 text-white hover:opacity-70 text-sm font-semibold pt-2 pb-2 pl-3 pr-4 lg:pl-8 lg:pr-8 rounded-xl">Leave</button>
                    </div>
                        
                </div>
                
                
            </div>
        </div>
        
        
        <div className="col-span-1 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 #1c1e29  h-screen">
            <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current = code}}/>
        </div>

        

    </div>
     );
}
 
export default EditorPage;