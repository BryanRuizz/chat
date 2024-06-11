import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

interface Message {
  username: string;
  message: string;
}

const App: React.FC = () => {
  const [username, setUserName] = useState<string>('username');
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const pusher = new Pusher('efc5c18caf9f89f8e460', {
      cluster: 'mt1',
      forceTLS: true,
      // logToConsole: true,
    });

    const channel = pusher.subscribe('banana-666');
    
    const handleMessage = (data: Message) => {
      setMessages(prevMessages => {
        const newMessages = new Map(prevMessages);
        newMessages.set(data.username, data);
        return newMessages;
      });
    };

    channel.bind('chat-event', handleMessage);

    return () => {
      channel.unbind('chat-event', handleMessage);
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:8000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        message: message
      })
    });
    setMessage('');
  }

  return (
    <div className="App">
      <div className='container'>
        <div className="list-group-item list-group-item-action active py-3 lh-sm" aria-current="true">
          <div className="d-flex w-100 align-items-center justify-content-between">
            <strong className="mb-1">List group</strong>
          </div>
          <input
            className='fs-5 fw-semibold'
            value={username}
            onChange={e => setUserName(e.target.value)}
          />
        </div>

        <div className="list-group list-group-flush border-bottom scrollarea">
          {Array.from(messages.values()).map((message, index) => (
            <div key={index} className="list-group-item list-group-item-action py-3 lh-sm">
              <div className="d-flex w-100 align-items-center justify-content-between">
                <strong className="mb-1" style={{ color: "black" }}>{message.username}</strong>
              </div>
              <div className="col-10 mb-1 small">{message.message}</div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={submit}>
        <input
          className='form-control'
          placeholder='Write a message'
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}

export default App;
