import React, { useState, useRef, useEffect } from 'react';
import { Button, TextField, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmsIcon from '@mui/icons-material/Sms';
import './Chat.css';

const Chat = () => {
    const [question, setQuestion] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [typing, setTyping] = useState(false);
    const [assistantMessage, setAssistantMessage] = useState('');

    const chatWindowRef = useRef(null);

    // Function to format messages with clickable links
    const formatMessage = (message) => {
        const urlRegex = /(http:\/\/localhost:\d+\/tracking\/\d+)/g;
        return message.split(urlRegex).map((part, index) =>
            urlRegex.test(part) ? (
                <a
                    key={index}
                    href={part}
                    style={{
                        color: 'blue',
                        textDecoration: 'underline',
                        display: 'inline',
                        marginLeft: '5px',
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Click here to view tracking details
                </a>
            ) : (
                part
            )
        );
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [conversation, typing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Log the message when the request is being sent
        console.log('Sending request with question:', question);
        
        // Add the user's question to the conversation
        setConversation(prev => [...prev, { role: 'user', content: question }]);
    
        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Request successfully sent, waiting for response...');
    
            const data = await response.json();
            console.log('Response data:', data); // Debugging line to check response structure
    
            const assistantResponse = data.answer || "I'm sorry, I couldn't understand your request.";
    
            let index = 0;
            setTyping(true);
            let message = '';
    
            const interval = setInterval(() => {
                message += assistantResponse.charAt(index);
                setAssistantMessage(message);
                index += 1;
    
                if (index === assistantResponse.length) {
                    clearInterval(interval);
                    setTyping(false);
                    setConversation(prev => [...prev, { role: 'assistant', content: message }]);
                }
            }, 40);
        } catch (error) {
            console.error('Error fetching the chatbot response:', error);
        } finally {
            setQuestion('');
            setLoading(false);
        }
    };
    
    

    return (
        <div>
            <div className={`chat-icon ${chatOpen ? 'open' : ''}`} onClick={() => setChatOpen(!chatOpen)}>
                <SmsIcon style={{ color: 'white', fontSize: 30 }} />
            </div>

            {chatOpen && (
                <div className="chat-container">
                    <div className="chat-header">
                        <p>DialedIn</p>
                        <IconButton onClick={() => setChatOpen(false)} style={{ position: 'absolute', top: 5, right: 5, padding: 0 }}>
                            <CloseIcon style={{ color: '#fff' }} />
                        </IconButton>
                    </div>
                    <div className="chat-window" ref={chatWindowRef}>
                        {conversation.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.role}`}>
                                <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>{' '}
                                {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                            </div>
                        ))}
                        
                        {typing && (
                            <div className="chat-message assistant">
                                <strong>Assistant:</strong> {formatMessage(assistantMessage)}
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} className="chat-form">
                        <TextField
                            placeholder="Let me cook"
                            variant="outlined"
                            fullWidth
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            disabled={loading}
                            size="small"
                            inputProps={{ maxLength: 500 }}
                            autoComplete="off"
                            InputProps={{
                                style: {
                                    borderRadius: '20px',
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading || !question.trim()}
                            style={{ marginLeft: '10px', borderRadius: '20px' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chat;