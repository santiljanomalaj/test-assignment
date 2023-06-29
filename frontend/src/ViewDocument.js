import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ViewDocument() {
  const [socket, setSocket] = useState(null)
  const [text, setText] = useState('');
  const [content, setContent] = useState('');
  const { id } = useParams();

  useEffect(() => {
    // Connect to the WebSocket server with the username as a query parameter
    const newSocket = new WebSocket(`ws://${window.location.hostname}:5678/ws/doc/${id}/view`)
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
        const data = JSON.parse(event.data)
        setText(data.text)
        setContent(data.content)
      }
    }
  }, [socket])

  return (
    <div style={{
      width: '50vw',
      margin: '50px auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <label htmlFor='textarea1' style={{
        textAlign: 'left'
      }}>Text:</label>
      <textarea readOnly style={{
        width: '100%',
        margin: '10px auto',
        resize: 'none'
      }} id="textarea1" name="text" value={text}></textarea>
      <label htmlFor='textarea2' style={{
        textAlign: 'left'
      }}>Content:</label>
      <textarea readOnly style={{
        width: '100%',
        margin: '10px auto',
        resize: 'none',
        height: '40vh'
      }} id="textarea2" name="content" value={content}></textarea>
    </div>
  );
}

export default ViewDocument;
