import { useEffect, useRef, useState } from "react";
import "./App.css";

import io from "socket.io-client";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
console.log(SERVER_URL);

function App() {
   const [message, setMessage] = useState({});
   const [room, setRoom] = useState({ currentRoom: "", lastRoom: "" });
   const [messages, setMessages] = useState([]);
   const [socket, setSocket] = useState(null);

   //  const socketRef = useRef();
   //  const setupSocket = () => {
   //     socketRef.current = io("http://localhost:8080/chat");
   //     socketRef.current.on("RECEIVE_MESSAGE", (data) => {
   //        setMessages((prev) => [...prev, data]);
   //     });
   //  };
   useEffect(() => {
      // setupSocket();
      setSocket(io.connect(SERVER_URL + "/chat"));

      return () => {
         //  socketRef.current.disconnect();
         // socket.disconnect()
      };
   }, []);

   const handleJoinRoom = () => {
      setRoom((prev) => ({ ...prev, lastRoom: prev.currentRoom }));
      socket.emit("JOIN_ROOM", room);
   };

   const handleSendMessage = () => {
      const messagePayload = { ...message, room: room.currentRoom };
      socket.emit("SEND_MESSAGE", messagePayload);
   };

   useEffect(() => {
      if (socket) {
         socket.on("RECEIVE_MESSAGE", (data) => {
            setMessages((prev) => [...prev, data.message]);
         });

         //  return () => {
         // socket.disconnect();
         //  };
      }
   }, [socket]);

   return (
      <div className="App">
         <div>
            <input
               placeholder="Room"
               onChange={(e) => {
                  setRoom((prev) => ({ ...prev, currentRoom: e.target.value }));
               }}
            />
            <button onClick={handleJoinRoom}>Join Room</button>
         </div>

         <div>
            <input placeholder="Message..." onChange={(e) => setMessage((prev) => ({ ...prev, message: e.target.value }))} />
            <button onClick={handleSendMessage}>Send Message</button>
         </div>

         <div>
            <ul>
               {messages.map((message) => (
                  <li>{message}</li>
               ))}
            </ul>
         </div>
      </div>
   );
}

export default App;
