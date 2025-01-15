import { useEffect } from "react";
import { io } from "socket.io-client"
const App = () => {

  const socket = io("http://localhost:6345");

  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("connected",socket.id)
      
    })

    socket.on("welcome",(s)=>{console.log(s)})

    return ()=>{
      socket.disconnect();
    }
},[])

  return (
    <div>App</div>
  )
}

export default App