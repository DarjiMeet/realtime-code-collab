import React, { useState } from "react"
import { nanoid } from 'nanoid'
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const Home = () => {

    const navigate = useNavigate()

    const [roomId, setRoomId] = useState('')
    const [username,setUserName] = useState('')

    const createNewRoom = (e)=>{
        e.preventDefault()
        const id = nanoid()
        setRoomId(id)
        toast.success('Created new room')
    }

    const joinRoom = ()=>{
        if(!roomId || !username){
            toast.error('Room ID or UserName is required.')
            return
        }

        // Redirect
        navigate(`/editor/${roomId}`,{
            state:{
                username,
            }
        })
    }

    const handleInputEnter =(e)=>{
        if(e.code === 'Enter'){
            joinRoom()
        }
    }
    return ( 
        <div className="flex items-center justify-center  w-full h-screen bg-gray-950">
            <div className="
                flex 
                flex-col 
                border-2 
                border-black 
                bg-slate-800 
                text-white 
                p-3 
                w-[200px]
                md:w-[300px]
                lg:w-[500px]
                lg:p-5
                rounded-2xl">

                <img src="/code-sync.png"  className="w-[200px] h-auto" alt="code-sync-logo"/>
                <h4 className="mt-4">Paste invitaion Room ID</h4>
                
                <div className="flex flex-col mt-4">
                    <input 
                        type="text"  
                        className="rounded-md p-2 text-sm text-black font-semibold" 
                        placeholder="Room ID"
                        onChange={(e)=>setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input 
                        type="text" 
                        className="mt-4 rounded-md p-2 text-sm text-black font-semibold" 
                        placeholder="UserName"
                        onChange={(e)=>setUserName(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    
                    <div className="flex flex-row-reverse  mt-4">
                        <button onClick={joinRoom} className=" bg-green-600  p-2 text-sm rounded-md w-[60px] hover:opacity-70">
                            Join
                        </button>
                    </div>
                    
                    <span className="flex items-center justify-center">
                        Create room &nbsp;
                        <button onClick={createNewRoom} className="text-sm underline text-green-600 hover:opacity-90">new room</button>
                    </span>
                </div>
               
            </div>
          
      </div>
     );
}
 
export default Home;