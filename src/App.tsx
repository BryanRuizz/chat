import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Pusher from 'pusher-js';
import * as PusherPushNotifications from "@pusher/push-notifications-web";

// import { PusherPushNotifications } from "https://js.pusher.com/beams/1.0/push-notifications-cdn.js";

import '../src/coomponents/service-worker'

// import { setPusherClient } from 'react-pusher';
// import Pusher from 'pusher-js';

// import useSound from 'use-sound';
// import lol from 'lol.mp3'


interface Message {
  username: string;
  message: string;
}

function App() {
  // const [playsound] = useSound(lol)

  const [username, setUserName] = useState('username');

  const [messages, setMessages] = useState<Message[]>([]);

  const [message, setMessage] = useState("");
  let [allmessages, setAllMessages] = useState<any>([]);


  const [num, setNum] = useState<number>(0);
  useEffect(() => {
    // Enable pusher logging - don't include this in production
    //  Pusher.logToConsole = true;

    const pusher = new Pusher('efc5c18caf9f89f8e460', {
      cluster: 'mt1'
    });

    const channel = pusher.subscribe('banana-666');
    channel.bind('chat-event', function (data: any) {
      //  alert(JSON.stringify(data));
      // setMessages((prevMessages) => [...prevMessages, data]);
      // console.log(messages);
      allmessages.push(data);
      setMessages(allmessages);
    });
    setNum(1);
  }, [])

  // ---------------  esta funcion manda los datos al server quien usar el 
  //tigger para mandar los datos al canal y aqui mismo recibirlos en la suscripcion
  const somit = async (e: any) => {

    // console.log("Value :",e);
    await fetch('http://localhost:8000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        message: message
      })

    });

    // Pusher.trigger('my-channel', 'my-event', {message => 'hello world'})
    setMessage('')
  }
  console.log(messages);
  // console.log(username)
  // console.log(message)

  //---------------------------------> aqui va lo de las notificaciones



    
    // const beamsClient = new PusherPushNotifications.Client({
    //   instanceId: '6796c8ba-3f42-41a8-85a1-e34dc4eed764',
    // });
  
    // beamsClient.start()
    //   .then(() => beamsClient.addDeviceInterest('hello'))
    //   .then(() => console.log('Successfully registered and subscribed!'))
    //   .catch(console.error);
    


  return (
    <div className="App">
{/* <button className='btn btn-primary' onClick={()=>playsound()} >play</button> */}

      <div className='container'>
        <div className="list-group-item list-group-item-action active py-3 lh-sm" aria-current="true">
          <div className="d-flex w-100 align-items-center justify-content-between">
            <strong className="mb-1">List group</strong>

          </div>
          <input className='fs-5 fw-semibold' value={username}
            onChange={e => setUserName(e.target.value)} />
        </div>

        <div className="list-group list-group-flush border-bottom scrollarea">

          {messages.map(message => {

            return (
              <div className="list-group-item list-group-item-action py-3 lh-sm">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1" style={{ color: "black" }}>{message.username}</strong>

                </div>
                <div className="col-10 mb-1 small">{message.message}</div>
              </div>
            )
          })}


        </div>
      </div>
      <form onSubmit={e => somit(e)}>
        <input className='form-control' placeholder='wirte a mesagge' value={message}
          onChange={e => setMessage(e.target.value)}
        />

        {/* <button className='btn btn-primary'>Send</button> */}
      </form>

    </div>
  );
}

export default App;
