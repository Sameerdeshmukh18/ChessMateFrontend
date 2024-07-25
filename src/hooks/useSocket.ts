import { useEffect, useState } from "react"

export const useSocket =()=>{

    const [socket, setsocket] = useState<WebSocket|null>();
      const WS_URL = "wss://chessmatebackend-production.up.railway.app/"

    useEffect(() => {

        const ws= new WebSocket(WS_URL)
        ws.onopen = () =>{
            console.log("connected");
            setsocket(ws)
        }
        ws.onclose=() =>{
            console.log("disconnected")
            setsocket(null)
        } 

        return ()=>{
            ws.close();
        }

      
    }, [])

    return socket;

}