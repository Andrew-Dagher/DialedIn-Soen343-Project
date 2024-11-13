import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chat = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');

  const chatWindowRef = useRef(null);

  const formatMessage = message => {
    const urlRegex = /(http:\/\/localhost:\d+\/tracking\/\d+)/g;
    return message.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          className="text-teal-400 underline ml-1 hover:text-teal-300 transition-colors"
          target="_blank"
          rel="noopener noreferrer">
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (!question.trim() || loading) return;
    
    setLoading(true);
    console.log('Sending request with question:', question);
    setConversation(prev => [...prev, { role: 'user', content: question }]);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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
      {/* Chat Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className={`
          fixed bottom-5 right-5 z-50 p-4
          rounded-full bg-teal-400 text-white
          shadow-lg transition-all duration-200
          hover:bg-teal-500 hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2
          ${chatOpen ? 'scale-110' : ''}
        `}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[500px] w-[380px] flex-col rounded-2xl bg-gray-950 shadow-xl border-2 border-gray-800">
          {/* Chat Header */}
          <div className="relative flex items-center justify-between rounded-t-2xl bg-teal-400 px-4 py-3">
            <h3 className="text-lg font-semibold text-white">DialedIn Assistant</h3>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-full p-1 text-white hover:bg-teal-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatWindowRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx global>{`
              /* Hide scrollbar for Chrome, Safari and Opera */
              .overflow-y-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[75%] rounded-2xl px-4 py-2 text-sm
                    ${msg.role === 'user' 
                      ? 'bg-teal-400 text-white' 
                      : 'bg-gray-800 text-gray-100'
                    }
                  `}
                >
                  <div className="font-medium mb-1">
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="leading-relaxed">
                    {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl bg-gray-800 px-4 py-2 text-sm text-gray-100">
                  <div className="font-medium mb-1">Assistant</div>
                  <div className="leading-relaxed">
                    {formatMessage(assistantMessage)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form 
            onSubmit={handleSubmit}
            className="border-t-2 border-gray-800 p-4 flex gap-2"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              maxLength={500}
              className="
                flex-1 rounded-xl bg-gray-900 px-4 py-2
                text-sm text-gray-100 placeholder-gray-500
                border-2 border-gray-800 
                focus:border-teal-400 focus:outline-none
                transition-colors
              "
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="
                rounded-xl bg-teal-400 p-2
                text-white transition-colors
                hover:bg-teal-500 disabled:opacity-50
                disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 
                focus:ring-teal-400 focus:ring-offset-2
              "
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;