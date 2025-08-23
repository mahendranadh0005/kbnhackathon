import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Star, MapPin, Heart } from "lucide-react";
import { ChatMessage, Product } from "../types";
import { mockProducts } from "../data/mockData";

interface ChatBotProps {
  onProductSelect: (product: Product) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onProductSelect }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hi! I'm your Store Assistant. I can help you find products based on your dietary needs, budget, allergies, and preferences. What are you looking for today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getProductRecommendations = (query: string): Product[] => {
    const q = query.toLowerCase();
    if (q.includes("sweet") && q.includes("tasty") && q.includes("healthy")) {
      return mockProducts
        .filter((p) =>
          ["chikki", "protein", "sweet", "healthy", "natural"].some((tag) =>
            p.tags.includes(tag)
          )
        )
        .slice(0, 3);
    }
    if (
      q.includes("diet") ||
      q.includes("healthy") ||
      q.includes("nutrition")
    ) {
      return mockProducts
        .filter((p) =>
          p.tags.some((tag) =>
            ["healthy", "organic", "low-calorie", "protein", "fiber"].includes(
              tag
            )
          )
        )
        .slice(0, 3);
    }
    if (q.includes("allergy") || q.includes("allergic") || q.includes("cotton")) {
      return mockProducts
        .filter((p) => p.category === "clothing" && p.materials?.includes("cotton"))
        .slice(0, 3);
    }
    if (q.includes("budget") || q.includes("cheap") || q.includes("affordable")) {
      return mockProducts.filter((p) => p.price < 20).slice(0, 3);
    }
    if (q.includes("food") || q.includes("snack") || q.includes("eat")) {
      return mockProducts.filter((p) => p.category === "food").slice(0, 3);
    }
    if (q.includes("shirt") || q.includes("clothing") || q.includes("wear")) {
      return mockProducts.filter((p) => p.category === "clothing").slice(0, 3);
    }
    return mockProducts.slice(0, 3);
  };

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("sweet") && q.includes("tasty") && q.includes("healthy")) {
      return "Yum! Here's what I found that's sweet, tasty, and still healthy — the best of all worlds!";
    }
    if (q.includes("diet") && q.includes("healthy")) {
      return "Great choice! I found some healthy options that are available in our store.";
    }
    if (q.includes("allergy") && q.includes("cotton")) {
      return "I understand you have skin allergies. Here are some 100% cotton shirts that are gentle on sensitive skin.";
    }
    if (q.includes("budget")) {
      return "I'll help you find the best value products! Here are some affordable options.";
    }
    return "Based on your request, here are some products I recommend:";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1500));
    const recs = getProductRecommendations(inputText);
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: generateResponse(inputText),
      isUser: false,
      timestamp: new Date(),
      products: recs,
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-sky-50 to-teal-50 rounded-2xl shadow-2xl border border-indigo-100 h-[600px] flex overflow-hidden">
      {/* Left: Chat UI */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-600 via-sky-500 to-teal-500 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Smart Assistant</h3>
              <p className="text-sm text-indigo-100">Powered by AI • Always Available</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                  message.isUser
                    ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white"
                    : "bg-white/80 backdrop-blur-xl border border-indigo-100 text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.isUser ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                  <span className="text-xs opacity-75">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{message.text}</p>

                {/* Products */}
                {message.products && (
                  <div className="mt-3 space-y-3">
                    {message.products.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm hover:shadow-xl transition hover:scale-[1.02]"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-xl border border-indigo-100"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {product.name}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-sky-500 to-teal-400 bg-clip-text text-transparent">
                                ₹{product.price}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">
                                  {product.rating}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <MapPin className="w-3 h-3 text-indigo-500" />
                              <span className="text-xs text-gray-600">
                                {product.location}
                              </span>
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() => onProductSelect(product)}
                                className="flex items-center space-x-1 bg-gradient-to-r from-indigo-600 via-sky-500 to-teal-400 text-white px-2 py-1 rounded-lg text-xs hover:scale-105 transition"
                              >
                                <MapPin className="w-3 h-3" />
                                <span>Get Directions</span>
                              </button>
                              <button className="flex items-center space-x-1 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs hover:scale-105 transition">
                                <Heart className="w-3 h-3" />
                                <span>Save</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing animation */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/80 rounded-2xl px-4 py-2 border border-indigo-100">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-indigo-100 bg-white/70 backdrop-blur-lg">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about products, dietary needs, allergies, budget..."
              className="flex-1 px-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="hidden md:flex flex-none items-center justify-center bg-gradient-to-br from-indigo-50 via-sky-50 to-teal-50 p-6">
        <img
          src="https://www.indianext.co.in/wp-content/uploads/2022/03/5208996.jpg"
          alt="Chatbot illustration"
          className="max-w-full max-h-[80%] object-contain"
        />
      </div>
    </div>
  );
};

export default ChatBot;
