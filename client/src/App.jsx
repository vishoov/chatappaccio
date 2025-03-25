import React from 'react';
import { io } from 'socket.io-client';
import { useEffect, useMemo, useState } from 'react';

const App = () => {
  const socket = useMemo(() => io('http://localhost:3000'), []);

  const [socketId, setSocketId] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');


  const handleSubmit= (e)=>{
    e.preventDefault();
    const message = e.target[0].value;
    console.log(message);
    const reciever = e.target[1].value;

    //socket.emit would send the even called message to the server 
    socket.emit('message', {message, reciever});
    e.target[0].value = '';
    setRoom("");
  }

  const joinRoom = (e)=>{
    e.preventDefault();
    
    
    socket.emit('join-room', room);
    e.target[0].value = '';
  }



  useEffect(()=>{
    socket.on('connect', ()=>{
      setSocketId(socket.id); 
      console.log(`Connected with server's socket id ${socketId}`);
    })

    socket.on('fwd-message', (msg)=>{
      setMessages([...messages, msg]);
    })

    return ()=>{
      socket.off('connect');
      
    }
  })

  return (
    <div>
        <h1>Welcome to our chat application</h1>
        <h1>{socketId}</h1>
        <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter your message" />
        <input type="text" placeholder="Reciever's id" />
        <button type="submit">Send</button>

        
        </form>

        <form onSubmit={joinRoom} onChange={(e)=>setRoom(e.target.value)}>
        <input type="text" placeholder="Room's id" />
        <button type="submit">Join Room</button>
        </form>

        {/* messages will be displayed here */}
        <ul>
          {messages.map((msg, index)=>{
            
            return <li key={index}>{msg}</li>

          })}
        </ul>
        


    </div>
  )
}

export default App
