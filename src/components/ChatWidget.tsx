import { useState, useRef, useEffect } from 'react';

interface Message { role: 'user' | 'assistant'; content: string; }
interface ChatWidgetProps { fullPage?: boolean; lang?: 'en' | 'hi' | 'pa'; }

export default function ChatWidget({ fullPage = false }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Sat Naam Ji 🙏 How can I help you today? Ask me about RSSB teachings, meditation, books, satsang centers, or the spiritual path.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(fullPage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.slice(1) }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Sat Naam Ji 🙏 Unable to respond right now. Please try again.' }]);
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const ChatUI = () => (
    <div style={{ display:'flex', flexDirection:'column', height: fullPage ? '70vh' : '384px', background:'white' }}>
      {/* Header */}
      <div style={{ background:'#8B1A1A', color:'white', padding:'0.75rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span style={{ fontSize:'1.25rem' }}>🙏</span>
          <div>
            <p style={{ fontWeight:600, fontSize:'0.875rem', margin:0 }}>Ask the Sangat</p>
            <p style={{ fontSize:'0.7rem', color:'#fca5a5', margin:0 }}>RSSB AI Guide</p>
          </div>
        </div>
        {!fullPage && <button onClick={() => setIsOpen(false)} style={{ background:'none', border:'none', color:'#fca5a5', fontSize:'1.5rem', cursor:'pointer', lineHeight:1 }}>×</button>}
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'1rem', display:'flex', flexDirection:'column', gap:'0.75rem', background:'#FDF8F0' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', justifyContent: msg.role==='user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth:'85%', borderRadius:'1rem', padding:'0.5rem 1rem', fontSize:'0.875rem', lineHeight:1.5,
              background: msg.role==='user' ? '#8B1A1A' : 'white',
              color: msg.role==='user' ? 'white' : '#1f2937',
              borderBottomRightRadius: msg.role==='user' ? '0.25rem' : '1rem',
              borderBottomLeftRadius: msg.role==='user' ? '1rem' : '0.25rem',
              boxShadow: msg.role==='assistant' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', justifyContent:'flex-start' }}>
            <div style={{ background:'white', borderRadius:'1rem', borderBottomLeftRadius:'0.25rem', padding:'0.75rem 1rem', boxShadow:'0 1px 3px rgba(0,0,0,0.1)', display:'flex', gap:'4px' }}>
              {[0,150,300].map(d => <span key={d} style={{ width:8, height:8, background:'#8B1A1A', borderRadius:'50%', display:'block', animation:`bounce 1s ${d}ms infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop:'1px solid #e5e7eb', padding:'0.75rem', background:'white', display:'flex', gap:'0.5rem' }}>
        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about RSSB teachings..."
          disabled={loading}
          style={{ flex:1, border:'1px solid #d1d5db', borderRadius:'9999px', padding:'0.5rem 1rem', fontSize:'0.875rem', outline:'none' }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{ background:'#8B1A1A', border:'none', color:'white', borderRadius:'50%', width:40, height:40, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, opacity: loading || !input.trim() ? 0.5 : 1 }}
        >
          ➤
        </button>
      </div>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
    </div>
  );

  if (fullPage) return <ChatUI />;

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}
          style={{ position:'fixed', bottom:24, right:24, background:'#8B1A1A', color:'white', border:'none', borderRadius:'50%', width:56, height:56, fontSize:'1.5rem', cursor:'pointer', boxShadow:'0 4px 15px rgba(0,0,0,0.3)', zIndex:50 }}
          title="Ask AI Guide">🙏</button>
      )}
      {isOpen && (
        <div style={{ position:'fixed', bottom:24, right:24, width: 'min(380px, calc(100vw - 2rem))', borderRadius:'1rem', boxShadow:'0 10px 40px rgba(0,0,0,0.2)', overflow:'hidden', zIndex:50, border:'1px solid #fecaca' }}>
          <ChatUI />
        </div>
      )}
    </>
  );
}
