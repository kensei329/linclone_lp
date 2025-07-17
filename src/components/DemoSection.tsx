'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, PlayIcon, UserIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftRightIcon, MicrophoneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  typing?: boolean;
}

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-4">
    <div className="flex space-x-1">
      <motion.div
        className="w-2 h-2 bg-purple-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-purple-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-purple-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
      />
    </div>
    <span className="text-gray-500 text-sm ml-2">AI Clone is typing...</span>
  </div>
);

// Message bubble component
const MessageBubble = ({ message, index }: { message: Message; index: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!message.isUser && message.text) {
      setIsTyping(true);
      setDisplayedText('');
      
      let currentIndex = 0;
      const typingSpeed = 50; // milliseconds per character
      
      const timer = setInterval(() => {
        if (currentIndex < message.text.length) {
          setDisplayedText(message.text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, typingSpeed);

      return () => clearInterval(timer);
    } else {
      setDisplayedText(message.text);
    }
  }, [message.text, message.isUser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        delay: index * 0.1 
      }}
      className={`flex w-full ${message.isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            message.isUser 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {message.isUser ? (
            <UserIcon className="w-5 h-5 text-white" />
          ) : (
            <SparklesIcon className="w-5 h-5 text-white" />
          )}
        </motion.div>

        {/* Message content */}
        <motion.div
          className={`relative px-4 py-3 rounded-2xl shadow-lg ${
            message.isUser
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-800'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <p className="text-sm leading-relaxed">
            {displayedText}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
          
          {/* Message tail */}
          <div
            className={`absolute top-3 w-3 h-3 transform rotate-45 ${
              message.isUser
                ? 'right-[-6px] bg-gradient-to-br from-blue-500 to-blue-600'
                : 'left-[-6px] bg-white border-l border-b border-gray-200'
            }`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function DemoSection() {
  const { t } = useClientTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Demo conversation flow
  const demoConversation = [
    { text: "Hello! I'm excited to try LinClone. How does it work?", isUser: true },
    { text: "Hi there! Welcome to LinClone! I'm your AI clone demo. I can understand and respond just like a real person. What would you like to know about creating your own AI clone?", isUser: false },
    { text: "That's amazing! Can you really sound like me?", isUser: true },
    { text: "Absolutely! With just a few voice samples, I can learn your speaking patterns, tone, and even your personality quirks. I'll be able to engage with your fans 24/7, just as you would!", isUser: false },
    { text: "How do I get started?", isUser: true },
    { text: "It's super simple! Just record a 10-minute conversation with me, and I'll learn everything I need to become your digital twin. Ready to begin your journey?", isUser: false }
  ];

  const startDemo = async () => {
    setDemoStarted(true);
    setMessages([]);
    
    for (let i = 0; i < demoConversation.length; i++) {
      const message = demoConversation[i];
      
      // Add delay between messages
      await new Promise(resolve => setTimeout(resolve, i === 0 ? 500 : 2000));
      
      if (!message.isUser) {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsTyping(false);
      }
      
      setMessages(prev => [...prev, {
        id: Date.now() + i,
        text: message.text,
        isUser: message.isUser,
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          "That's a great question! I'm designed to learn from your unique communication style.",
          "I can help you engage with your audience even when you're not available!",
          "The more we chat, the better I become at mimicking your personality.",
          "Would you like to know more about any specific feature?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: randomResponse,
          isUser: false,
          timestamp: new Date()
        }]);
      }, 1500);
    }, 500);
  };

  return (
    <section id="demo-section" className="py-32 bg-gradient-to-br from-white via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-6 py-3 mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 text-sm font-semibold">
              Interactive Demo
            </span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
              {t('demo.title')}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('demo.subtitle')}
          </p>
        </motion.div>

        {/* Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Chat Interface */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">LinClone AI Demo</h3>
                    <p className="text-purple-100 text-sm">Your AI Clone • Always Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-3 h-3 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <span className="text-white text-sm">Online</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {!demoStarted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <PlayIcon className="w-8 h-8 text-white ml-1" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Ready to see LinClone in action?
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Experience a real conversation with an AI clone. See how natural and engaging it can be!
                  </p>
                  <motion.button
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startDemo}
                  >
                    Start Demo Conversation
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <MessageBubble key={message.id} message={message} index={index} />
                    ))}
                  </AnimatePresence>
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            {demoStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="border-t border-gray-200 p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <motion.button
                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MicrophoneIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Features showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {[
              { icon: "🎯", title: "Natural Responses", desc: "Human-like conversation flow" },
              { icon: "⚡", title: "Instant Replies", desc: "No waiting, immediate engagement" },
              { icon: "🧠", title: "Learning AI", desc: "Gets better with every interaction" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
                                 whileHover={{ y: -5, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 