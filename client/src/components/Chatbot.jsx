import { useState, useRef, useEffect, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, X, Send } from 'lucide-react';

const Chatbot = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'model', text: "Hi there! I'm Coinly's AI assistant. How can I help you with your finances today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Only show for logged in users
  if (!user) return null;

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Exclude the initial greeting from the history sent to Gemini
      // Gemini strictly requires the first message in the history array to be from the 'user'
      const historyForGemini = messages.slice(1);

      const res = await API.post('/chat', {
        prompt: userMessage,
        history: historyForGemini
      });
      setMessages(prev => [...prev, { sender: 'model', text: res.data.message }]);
    } catch (err) {
      console.error(err);
      // Display the actual error message from the backend if available
      const errorMsg = err.response?.data?.error 
        ? `API Error: ${err.response.data.error}`
        : (err.response?.data?.message || 'Sorry, I am having trouble connecting right now.');
      setMessages(prev => [...prev, { sender: 'model', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '30px', right: '30px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--teal), #3B726A)',
          color: 'var(--bg)', border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(73, 139, 129, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, transition: 'transform 0.2s',
          transform: isOpen ? 'scale(0)' : 'scale(1)'
        }}
      >
        <MessageSquare size={28} />
      </button>

      <div style={{
        position: 'fixed', bottom: '30px', right: '30px',
        width: '350px', height: '500px', maxWidth: 'calc(100vw - 40px)',
        background: 'var(--surface)', borderRadius: '24px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column',
        zIndex: 9999, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: isOpen ? 'all' : 'none'
      }}>
        <div style={{
          padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255,255,255,0.02)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(73, 139, 129, 0.2)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              ✨
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--cream)' }}>Coinly AI</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--teal)', fontWeight: '700' }}>Online</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? 'var(--teal)' : 'rgba(255,255,255,0.05)',
              color: msg.sender === 'user' ? 'var(--bg)' : 'var(--cream)',
              padding: '12px 16px', borderRadius: '16px',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.sender === 'model' ? '4px' : '16px',
              maxWidth: '85%', fontSize: '14px', lineHeight: '1.5'
            }}>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', color: 'var(--muted)', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', fontSize: '14px' }}>
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            style={{
              flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              color: 'var(--cream)', padding: '12px 16px', borderRadius: '12px', outline: 'none'
            }}
          />
          <button type="submit" disabled={isLoading} style={{
            background: 'var(--teal)', border: 'none', color: 'var(--bg)',
            width: '44px', height: '44px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1
          }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
