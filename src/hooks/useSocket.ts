import { useEffect, useState } from "react"

export const useSocket =()=>{

    const [socket, setsocket] = useState<WebSocket|null>();
      const WS_URL = "ws://192.168.2.12:8080"

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