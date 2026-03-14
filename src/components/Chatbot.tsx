import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY });

export default function Chatbot() {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = ai.chats.create({
        model: "gemini-3.1-pro-preview",
        config: {
          systemInstruction: "You are a helpful AI assistant. You can help users with questions about image editing, the app, or general topics.",
        }
      });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatRef.current.sendMessageStream({ message: userMsg });
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of response) {
        fullText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullText;
          return newMessages;
        });
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Bot className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="font-medium text-stone-900">AI Assistant</h2>
          <p className="text-xs text-stone-500">Powered by Gemini 3.1 Pro</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
            <Bot className="w-12 h-12 opacity-20" />
            <p>How can I help you today?</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-stone-800 text-white' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-stone-800 text-white rounded-tr-sm' 
                  : 'bg-stone-50 border border-stone-100 text-stone-800 rounded-tl-sm'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                ) : (
                  <div className="markdown-body text-sm prose prose-stone max-w-none prose-p:leading-relaxed prose-pre:bg-stone-800 prose-pre:text-stone-100">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-stone-50 border border-stone-100 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-stone-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
