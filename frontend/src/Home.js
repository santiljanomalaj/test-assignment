import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = ({ history }) => {
  const [document, setDocument] = useState([])
  const [maxId, setMaxId] = useState(0)

  useEffect(() => {
    axios.get(`http://${window.location.hostname}:8000/documents`)
      .then(response => {
        let max = 0;
        response.data.map(item => {
          if (max < item.id) {
            max = item.id
          }
          return item
        })
        setMaxId(max)
        setDocument(response.data)
      })
      .catch(error => console.log(error));
  }, [])

  const handleCreateButton = () => {
    window.location.href = `doc/${maxId + 1}/edit`;
  }

  const handleViewDocument = (id) => {
    window.location.href = `doc/${id}/view`;
  }

  const handleEditDocument = (id) => {
    window.location.href = `doc/${id}/edit`;
  }
  return (
    <div style={{width: '95vw', margin: 'auto'}}>
      <div style={{
        display: 'flex',
        justifyContent: 'end',
        margin: '10px'
      }}>
        <button style={{
          padding: '5px 10px',
          borderRadius: '5px',
          backgroundColor: 'greenyellow',
          fontWeight: 'bold'
        }} onClick={handleCreateButton}>Create document</button>
      </div>
      <table style={{width: '98.5%', margin: '10px'}} border={1}>
        <thead>
          <tr>
            <th>Text</th>
            <th>Content</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            document.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{item.text}</td>
                  <td>{item.content}</td>
                  <td>
                    <button onClick={() => { handleViewDocument(item.id) }}>view</button>
                    <button onClick={() => { handleEditDocument(item.id) }}>edit</button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default Home;
