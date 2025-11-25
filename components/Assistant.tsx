import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { getSmartAdvice } from '../services/geminiService';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export const Assistant: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Xin chào! Tôi là trợ lý ảo phong thủy. Bạn cần tư vấn gì về ngày lành tháng tốt, vận mệnh hay việc nên làm hôm nay?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        const replyText = await getSmartAdvice(input);
        
        const botMsg: Message = { id: Date.now() + 1, text: replyText, sender: 'bot' };
        setMessages(prev => [...prev, botMsg]);
        setTyping(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700 m-4">
            <div className="bg-indigo-600 p-4 flex items-center justify-center relative">
                <Sparkles className="text-yellow-300 w-5 h-5 absolute left-4" />
                <h2 className="text-white font-bold">Trợ Lý Phong Thủy</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-100' : 'bg-green-100'}`}>
                                {msg.sender === 'user' ? <User className="w-5 h-5 text-indigo-600" /> : <Bot className="w-5 h-5 text-green-600" />}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                                msg.sender === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-200 dark:shadow-none' 
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                {typing && (
                    <div className="flex justify-start">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 flex space-x-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Hỏi về ngày tốt, tuổi hợp..."
                        className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};