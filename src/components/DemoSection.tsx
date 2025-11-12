'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { PlayIcon, UserIcon, SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  typing?: boolean;
}

type FAQOption = {
  id: string;
  question: string;
  answer: string;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createMessage = (text: string, isUser: boolean): Message => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  text,
  isUser,
  timestamp: new Date(),
});

// Typing indicator component
const TypingIndicator = ({ message }: { message: string }) => (
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
    <span className="text-gray-500 text-sm ml-2">{message}</span>
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

const pickRandom = <T,>(items: T[], count: number): T[] => {
  if (items.length <= count) {
    return [...items];
  }

  const pool = [...items];
  const selection: T[] = [];

  while (selection.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    selection.push(pool.splice(index, 1)[0]);
  }

  return selection;
};

export default function DemoSection() {
  const { t, i18n } = useClientTranslation();
  const language = i18n.language;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [askedQuestionIds, setAskedQuestionIds] = useState<string[]>([]);
  const [faqOptions, setFaqOptions] = useState<FAQOption[]>([]);
  const [displayOptions, setDisplayOptions] = useState<FAQOption[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const introConversation = useMemo(
    () => [
      { text: t('demo.intro.user'), isUser: true },
      { text: t('demo.intro.ai'), isUser: false },
    ],
    [t]
  );

  const dynamicResponses = useMemo(() => {
    const resource = i18n.getResource(language, 'translation', 'demo.dynamicResponses');
    if (Array.isArray(resource)) {
      return resource as string[];
    }
    return [];
  }, [language, i18n]);

  const getNextOptions = useCallback(
    (askedIds: string[]) => {
      if (!faqOptions.length) return [];
      const unused = faqOptions.filter(option => !askedIds.includes(option.id));
      const source = unused.length > 0 ? unused : faqOptions;
      return pickRandom(source, Math.min(3, source.length));
    },
    [faqOptions]
  );

  const getAiResponse = useCallback(
    (userMessage: string) => {
      const pool = dynamicResponses.length ? dynamicResponses : [t('demo.faq.completed')];
      if (!pool.length) return '';

      const lower = userMessage.toLowerCase();
      const heuristics = [
        { matches: ['process', 'flow', 'create', '作り方', '流れ'], index: 0 },
        { matches: ['voice', 'tone', 'personality', 'character', '個性', '声'], index: 1 },
        { matches: ['fan', 'follower', 'engage', 'community', 'ファン', 'フォロワー'], index: 2 },
      ];

      for (const rule of heuristics) {
        if (dynamicResponses[rule.index] && rule.matches.some((keyword) => lower.includes(keyword))) {
          return dynamicResponses[rule.index];
        }
      }

      const randomIndex = Math.floor(Math.random() * pool.length);
      return pool[randomIndex];
    },
    [dynamicResponses, t]
  );

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setAskedQuestionIds([]);
    setDisplayOptions([]);
    setShowOptions(false);
    const resource = i18n.getResource(language, 'translation', 'demo.faq.options');
    if (Array.isArray(resource)) {
      setFaqOptions(resource as FAQOption[]);
    } else {
      setFaqOptions([]);
    }
  }, [language, i18n]);

  useEffect(() => {
    if (faqOptions.length) {
      setDisplayOptions(getNextOptions([]));
    } else {
      setDisplayOptions([]);
    }
  }, [faqOptions, getNextOptions]);

  const startDemo = async () => {
    if (demoStarted) return;

    setDemoStarted(true);
    setMessages([]);
    setAskedQuestionIds([]);
    setShowOptions(false);

    for (let i = 0; i < introConversation.length; i++) {
      const step = introConversation[i];
      await delay(i === 0 ? 500 : 1600);

      if (step.isUser) {
        setMessages(prev => [...prev, createMessage(step.text, true)]);
      } else {
        setIsTyping(true);
        await delay(900);
        setMessages(prev => [...prev, createMessage(step.text, false)]);
        setIsTyping(false);
      }
    }

    setDisplayOptions(getNextOptions([]));
    setShowOptions(true);
  };

  const handleOptionSelect = async (option: FAQOption) => {
    if (isTyping || askedQuestionIds.includes(option.id)) return;
    const updatedAsked = [...askedQuestionIds, option.id];

    setAskedQuestionIds(updatedAsked);
    setMessages(prev => [...prev, createMessage(option.question, true)]);
    setShowOptions(true);
    setDisplayOptions(getNextOptions(updatedAsked));

    await delay(400);
    setIsTyping(true);
    await delay(1100);
    setMessages(prev => [...prev, createMessage(option.answer, false)]);
    setIsTyping(false);
  };

  const handleShowMoreQuestions = useCallback(() => {
    setDisplayOptions(getNextOptions(askedQuestionIds));
    setShowOptions(true);
  }, [askedQuestionIds, getNextOptions]);

  const handleSendMessage = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping || !demoStarted) return;

    setMessages(prev => [...prev, createMessage(trimmed, true)]);
    setInputValue('');
    setShowOptions(true);

    await delay(400);
    setIsTyping(true);
    await delay(1100);
    const response = getAiResponse(trimmed);
    if (response) {
      setMessages(prev => [...prev, createMessage(response, false)]);
    }
    setDisplayOptions(getNextOptions(askedQuestionIds));
    setIsTyping(false);
  }, [askedQuestionIds, demoStarted, getAiResponse, inputValue, isTyping, getNextOptions]);

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
              {t('demo.headerBadge')}
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
                  <h3 className="text-white font-semibold">{t('demo.chatHeader.title')}</h3>
                  <p className="text-purple-100 text-sm">{t('demo.chatHeader.subtitle')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-3 h-3 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                <span className="text-white text-sm">{t('demo.chatHeader.online')}</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white"
            >
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
                    {t('demo.readyTitle')}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    {t('demo.readySubtitle')}
                  </p>
                  <motion.button
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startDemo}
                  >
                    {t('demo.startButton')}
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <MessageBubble key={message.id} message={message} index={index} />
                    ))}
                  </AnimatePresence>
                  {isTyping && <TypingIndicator message={t('demo.typing')} />}
                </>
              )}
            </div>

            {showOptions && (
              <div className="border-t border-gray-200 p-6 bg-white/70 space-y-4">
                <p className="text-gray-700 text-sm">
                  {displayOptions.length > 0 ? t('demo.faq.prompt') : t('demo.faq.completed')}
                </p>
                {displayOptions.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                    {displayOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        type="button"
                        whileHover={{ scale: isTyping ? 1 : 1.03 }}
                        whileTap={{ scale: isTyping ? 1 : 0.97 }}
                        onClick={() => handleOptionSelect(option)}
                        disabled={isTyping}
                        className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                          isTyping
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                      >
                        {option.question}
                      </motion.button>
                    ))}
                  </div>
                )}
                <div className="flex justify-center">
                  <motion.button
                    type="button"
                    whileHover={{ scale: isTyping ? 1 : 1.02 }}
                    whileTap={{ scale: isTyping ? 1 : 0.98 }}
                    onClick={handleShowMoreQuestions}
                    disabled={isTyping || !faqOptions.length}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                      isTyping || !faqOptions.length
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    {t('demo.faq.more')}
                  </motion.button>
                </div>
              </div>
            )}

            {demoStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-t border-gray-200 p-4 bg-white/80"
              >
                <div className="flex items-center gap-3">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={1}
                    placeholder={t('demo.inputPlaceholder')}
                    className="flex-1 resize-none px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900 placeholder:text-gray-900"
                  />
                  <motion.button
                    type="button"
                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60"
                    whileHover={{ scale: inputValue.trim() && !isTyping ? 1.1 : 1 }}
                    whileTap={{ scale: inputValue.trim() && !isTyping ? 0.9 : 1 }}
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
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
              { icon: "💬", title: t('demo.cards.natural.title'), desc: t('demo.cards.natural.desc') },
              { icon: "⚡", title: t('demo.cards.instant.title'), desc: t('demo.cards.instant.desc') },
              { icon: "🎧", title: t('demo.cards.learning.title'), desc: t('demo.cards.learning.desc') }
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