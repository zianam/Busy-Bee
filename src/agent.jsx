import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({});
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: input,
      });
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'ai', text: interaction.output_text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, there was an error. Please try again.' }]);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-screen h-screen flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">✨ AI Chat</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:bg-white/20 w-8 h-8 flex items-center justify-center rounded"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <p className="text-2xl mb-2">👋</p>
              <p>Welcome to AI Chat!</p>
              <p className="text-sm mt-2">Chat with AI to get insights about your moments.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 disabled:bg-gray-400 transition font-semibold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}