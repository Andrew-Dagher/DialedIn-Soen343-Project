import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chat = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true); // Controls quick reply visibility

  const chatWindowRef = useRef(null);

const formatMessage = (message) => {
  // Regex to detect both tracking and quotation links
  const urlRegex = /(http:\/\/localhost:\d+\/tracking\?packageId=[\w-]+|\/request-delivery\?data=[\w%.-]+)/g;

  return message.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      // Determine if it's a quotation or tracking link
      const isQuotationLink = part.startsWith('/request-delivery');
      const fullLink = part;

      return (
        <a
          key={index}
          href={fullLink}
          className="ml-1 text-teal-400 underline transition-colors hover:text-teal-300"
          target="_blank"
          rel="noopener noreferrer">
          {isQuotationLink ? 'Proceed to request delivery' : 'Click here to view tracking details'}
        </a>
      );
    }
    return part;
  });
};


  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [conversation, typing]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent default form behavior if an event exists
    if (!question.trim() || loading) return;
  
    setLoading(true);
    setConversation((prev) => [...prev, { role: 'user', content: question }]);
  
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
  
      const data = await response.json();
      const assistantResponse = data.answer || "I'm sorry, I couldn't understand your request.";
  
      // Check if the response contains a link
      const containsLink = /(http:\/\/localhost:\d+\/tracking\?packageId=[\w-]+|\/request-delivery\?data=[\w%.-]+)/g.test(assistantResponse);
  
      if (containsLink) {
        // If there's a link, skip the typing effect and display the message immediately
        setConversation((prev) => [...prev, { role: 'assistant', content: assistantResponse }]);
        setTyping(false); // Ensure typing effect is stopped
      } else {
        // Use the typing effect for other messages
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
            setConversation((prev) => [...prev, { role: 'assistant', content: message }]);
          }
        }, 40);
      }
    } catch (error) {
      console.error('Error fetching the chatbot response:', error);
    } finally {
      setQuestion('');
      setLoading(false);
    }
  };
  


const handleQuickReply = async (message) => {
  setShowQuickReplies(false); // Hide quick replies when a button is clicked
  setQuestion(message); // Set the predefined message in the input field

  // Wait for the state to update before calling handleSubmit
  setTimeout(() => {
    handleSubmit({ preventDefault: () => {} }); // Programmatically trigger handleSubmit
  }, 0);
};


  const handleInputChange = (e) => {
    setQuestion(e.target.value);

    // Hide quick replies when the user starts typing
    if (e.target.value.trim() !== '') {
      setShowQuickReplies(false);
    }
  };

  return (
    <div>
      {/* Chat Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className={`
          fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 
          flex items-center justify-center
          w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 
          rounded-full border-2 border-teal-400 bg-teal-400 
          text-white shadow-lg transition-all duration-200 
          hover:scale-105 hover:bg-teal-500 
          focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 
          ${chatOpen ? 'scale-110' : ''}
        `}
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className={`
          fixed z-50 
          sm:bottom-20 sm:right-5 sm:w-[600px] sm:h-[800px]
          bottom-0 right-0 w-full h-[85vh]
          flex flex-col rounded-t-2xl sm:rounded-2xl 
          border-t-2 sm:border-2 border-gray-800 
          bg-gray-950 shadow-xl
        `}>
          {/* Chat Header */}
          <div className="relative flex items-center justify-between rounded-t-2xl bg-teal-400 px-4 py-3">
            <h3 className="text-lg font-semibold text-white">DialedIn Assistant</h3>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-full p-1 text-white transition-colors hover:bg-teal-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatWindowRef}
            className="flex-1 space-y-4 overflow-y-auto p-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx global>{`
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
                    max-w-[75%] rounded-2xl px-4 py-2 
                    ${msg.role === 'user' 
                      ? 'bg-teal-400 text-white' 
                      : 'bg-gray-800 text-gray-100'
                    }
                    text-sm sm:text-base
                  `}
                >
                  <div className="leading-relaxed">
                    {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl bg-gray-800 px-4 py-2 text-sm sm:text-base text-gray-100">
                  <div className="leading-relaxed">{formatMessage(assistantMessage)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Reply Buttons */}
          {showQuickReplies && (
            <div className="flex flex-wrap gap-2 p-4 bg-gray-950">
              <button
                onClick={() => handleQuickReply("I want to track a package.")}
                className="rounded-xl bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                Track a Package
              </button>
              <button
                onClick={() => handleQuickReply("I need a delivery quote.")}
                className="rounded-xl bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                Delivery Quote
              </button>
              <button
                onClick={() => handleQuickReply("Can you help me with your services?")}
                className="rounded-xl bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                General Inquiry
              </button>
            </div>
          )}

          {/* Chat Input */}
          <form 
            onSubmit={handleSubmit} 
            className="flex gap-2 border-t-2 border-gray-800 p-4 bg-gray-950"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={question}
              onChange={handleInputChange}
              disabled={loading}
              maxLength={500}
              className="flex-1 rounded-xl border-2 border-gray-800 bg-gray-900 
                       px-4 py-2 text-sm sm:text-base text-gray-100 
                       placeholder-gray-500 transition-colors focus:border-teal-400 
                       focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="rounded-xl bg-teal-400 p-2 sm:p-3 text-white 
                       transition-colors hover:bg-teal-500 
                       focus:outline-none focus:ring-2 focus:ring-teal-400 
                       focus:ring-offset-2 disabled:cursor-not-allowed 
                       disabled:opacity-50"
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
