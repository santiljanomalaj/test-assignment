import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EditDocument() {
  const [socket, setSocket] = useState(null)
  const [data, setData] = useState({
    text: '',
    content: '',
    version: null,
    username: ''
  })
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const { id } = useParams();

  // Send updates to the server when the textareas are edited
  const handleTextareaChange = (event) => {
    const { name, value } = event.target;
    if (name === 'text') {
      setData({ ...data, text: value, id, username })
    } else if (name === 'content') {
      setData({ ...data, content: value, id, username })
    }

    // if (socket) {
    //   socket.send(JSON.stringify({ ...data, id, username }));
    // }
    return true
  };

  useEffect(() => {
    // Get the username from local storage or prompt the user to enter it
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    } else {
      const input = prompt("Enter your username:")
      if (input) {
        setUsername(input)
        localStorage.setItem("username", input)
      }
    }

    // Connect to the WebSocket server with the username as a query parameter
    const newSocket = new WebSocket(`ws://${window.location.hostname}:5678/ws/doc/${id}/edit`)
    setSocket(newSocket)

    newSocket.onopen = () => console.log("WebSocket connected")
    newSocket.onclose = () => console.log("WebSocket disconnected")

    // Clean up event listeners and close the websocket connection on component unmount
    return () => {
      newSocket.close()
    }
  }, [id])


  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const res = JSON.parse(event.data)
        console.log(res)
        if (res.message) {
          setMessage(res.message + res.version)
        } else {
          setData({ ...data, ...res })
          setMessage('')
        }
      }
    }
  }, [socket])

  useEffect(() => {
    // Send the updated values to the server
    if (socket && data.username && data.id) {
      console.log(data)
      socket.send(JSON.stringify(data));
    }
  }, [data])


  return (
    <div style={{
      width: '50vw',
      margin: '50px auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h4 style={{ color: 'red' }}>{message}</h4>
      <label htmlFor='textarea1' style={{
        textAlign: 'left'
      }}>Text:</label>
      <textarea style={{
        width: '100%',
        margin: '10px auto',
        resize: 'none'
      }} id="textarea1" name="text" value={data.text} onChange={handleTextareaChange}></textarea>
      <label htmlFor='textarea2' style={{
        textAlign: 'left'
      }}>Content:</label>
      <textarea style={{
        width: '100%',
        margin: '10px auto',
        resize: 'none',
        height: '40vh'
      }} id="textarea2" name="content" value={data.content} onChange={handleTextareaChange}></textarea>
    </div>
  );
}

export default EditDocument;
