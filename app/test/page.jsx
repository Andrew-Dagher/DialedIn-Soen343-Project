"use client";

import React, { useState } from 'react';
import axios from 'axios';

const TestPage = () => {
  const [testMessage, setTestMessage] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [testDocuments, setTestDocuments] = useState([]);

  const handleTestMessageChange = (e) => {
    setTestMessage(e.target.value);
  };

  const submitTestMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/test', { message: testMessage });
      setServerResponse(`Message created: ${response.data.data.message}`);
      setTestMessage('');
    } catch (error) {
      console.error('Error submitting test message:', error);
      setServerResponse('Failed to create message');
    }
  };

  const fetchTestMessages = async () => {
    try {
      const response = await axios.get('/api/test');
      setTestDocuments(response.data.data);
    } catch (error) {
      console.error('Error fetching test messages:', error);
      setServerResponse('Failed to fetch messages');
    }
  };

  return (
    <div className="container">
      <h2>Test MongoDB Connection</h2>
      <form onSubmit={submitTestMessage}>
        <input
          type="text"
          placeholder="Enter test message"
          value={testMessage}
          onChange={handleTestMessageChange}
        />
        <button type="submit">Submit Message</button>
      </form>
      <p>{serverResponse}</p>
      <button onClick={fetchTestMessages}>Fetch Messages</button>
      <ul>
        {testDocuments.map((doc) => (
          <li key={doc._id}>{doc.message}</li>
        ))}
      </ul>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        form {
          margin: 20px 0;
        }
        input {
          padding: 8px;
          margin-right: 10px;
        }
        button {
          padding: 8px 16px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default TestPage;
