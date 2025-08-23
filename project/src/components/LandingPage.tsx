import React from "react";
import { motion } from "framer-motion";
import {
  Store,
  ArrowRight,
  ShoppingBag,
  BarChart3,
  Users,
  Sparkles,
  Heart,
  Globe,
  Star,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  Play
} from "lucide-react";

interface LandingPageProps {
  onViewChange: (view: "landing" | "customer" | "owner") => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onViewChange }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-violet-50 text-gray-900 overflow-x-hidden relative">
      {/* Animated Background Elements */}

        <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-200/40 to-blue-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-32 w-72 h-72 bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-r from-emerald-200/40 to-cyan-200/40 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Removed the grid pattern */}
        {/* Now it's just a plain gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-cyan-50 to-violet-50"></div>
        </div>


      {/* Premium Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-white/80 border-b border-cyan-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="font-black text-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">
                  SelePath
                </span>
                <div className="text-xs text-gray-500 font-medium">Smart Store</div>
              </div>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              {["Home", "Features", "Testimonials", "Contact"].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium relative group"
                >
                  {item}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></div>
                </motion.a>
              ))}
            </div>
            
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 rounded-full text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Revolutionary Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-300/50 px-4 py-2 rounded-full text-cyan-700 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Smart Shopping Experience</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-6xl lg:text-7xl font-black leading-tight"
              >
                Shopping
                <br />
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">
                  Reimagined
                </span>
              </motion.h1>
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-600 leading-relaxed max-w-lg"
            >
              Experience the future of retail with AI-powered navigation, real-time analytics, and seamless store management that transforms how you shop and sell.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-pink-500 to-orange-400 px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 flex items-center justify-center space-x-3"
                onClick={() => onViewChange("customer")}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Customer Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group border-2 border-gray-300 hover:border-cyan-400 px-8 py-4 rounded-2xl font-bold transition-all duration-500 flex items-center justify-center space-x-3 hover:bg-white/80 backdrop-blur-sm"
                onClick={() => onViewChange("owner")}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Store Management</span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center space-x-8 pt-8"
            >
              {[
                { label: "Active Stores", value: "1,200+" },
                { label: "Happy Customers", value: "50K+" },
                { label: "Success Rate", value: "99.9%" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <motion.div
              {...floatingAnimation}
              className="relative"
            >
              <div className="w-full max-w-lg mx-auto">
                <div className="relative">
                  {/* Main Phone Mockup */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-200">
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 backdrop-blur-xl border border-cyan-200">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                            <Store className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">SelePath Store</div>
                            <div className="text-sm text-gray-600">Smart Shopping</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {[ShoppingBag, BarChart3, Users, Zap].map((Icon, i) => (
                            <div key={i} className="bg-white/80 rounded-xl p-4 border border-gray-200 hover:border-cyan-400/50 transition-all cursor-pointer group shadow-sm">
                              <Icon className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                              <div className="text-xs text-gray-700 font-medium">Feature {i + 1}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Cards */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Heart className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-4 -left-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <TrendingUp className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section id="features" className="relative py-32 px-6 bg-gradient-to-br from-white/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-300/50 px-6 py-3 rounded-full text-cyan-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              Why Choose
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-transparent bg-clip-text"> SelePath</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience cutting-edge technology that revolutionizes retail operations and customer experiences
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: ShoppingBag,
                title: "AI-Powered Shopping",
                desc: "Smart recommendations, voice search, and personalized experiences that adapt to your preferences",
                gradient: "from-cyan-500 to-blue-600",
                bgGradient: "from-cyan-50 to-blue-50"
              },
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                desc: "Advanced dashboard with live insights, predictive analytics, and comprehensive business intelligence",
                gradient: "from-purple-500 to-pink-600",
                bgGradient: "from-purple-50 to-pink-50"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "Bank-level security, encrypted transactions, and complete data protection for peace of mind",
                gradient: "from-emerald-500 to-cyan-600",
                bgGradient: "from-emerald-50 to-cyan-50"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative overflow-hidden bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 hover:border-cyan-400/50 transition-all duration-500 shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-cyan-700 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{feature.desc}</p>
                  
                  <div className="mt-6 flex items-center text-cyan-600 font-semibold group-hover:text-cyan-700 transition-colors">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-cyan-100/50 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-tl from-cyan-200/30 to-transparent rounded-full blur-3xl"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black mb-6">
              Loved by
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 text-transparent bg-clip-text"> Thousands</span>
            </h2>
            <p className="text-xl text-gray-600">Join the revolution that's transforming retail experiences</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid lg:grid-cols-3 gap-8"
          >
            {[
              {
                quote: "SelePath completely transformed our shopping experience. The AI recommendations are incredibly accurate and the interface is simply beautiful!",
                author: "Sarah Johnson",
                role: "Retail Manager",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=150&h=150&fit=crop&crop=face"
              },
              {
                quote: "The analytics dashboard gives us insights we never had before. Our sales have increased by 40% since implementing SelePath.",
                author: "Michael Chen",
                role: "Store Owner",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
              },
              {
                quote: "As a customer, I love how personalized and smooth the shopping experience is. It's like having a personal shopping assistant!",
                author: "Emily Rodriguez",
                role: "Happy Customer",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 hover:border-yellow-400/50 transition-all duration-500 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full border-2 border-yellow-400/50"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
                <Sparkles className="absolute top-4 right-4 w-6 h-6 text-yellow-400 animate-pulse" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-5xl lg:text-6xl font-black">
              Ready to
              <span className="bg-gradient-to-r from-cyan-600 to-purple-600 text-transparent bg-clip-text"> Transform</span>
              <br />Your Business?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers and store owners who have revolutionized their retail experience with SelePath.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 flex items-center justify-center space-x-3 text-white"
                onClick={() => onViewChange("customer")}
              >
                <Play className="w-6 h-6" />
                <span>Start Your Journey</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 hover:border-purple-400 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 hover:bg-white/80 backdrop-blur-sm"
                onClick={() => onViewChange("owner")}
              >
                View Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer id="contact" className="relative bg-gradient-to-br from-gray-900 to-black border-t border-gray-200 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg flex items-center justify-center">
                  <Store className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="font-black text-3xl bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                    SelePath
                  </span>
                  <div className="text-gray-400 text-sm">Smart Store Solutions</div>
                </div>
              </div>
              <p className="text-gray-300 text-lg mb-8 max-w-md">
                Revolutionizing retail with AI-powered shopping experiences and comprehensive store management solutions.
              </p>
              <div className="flex space-x-4">
                {[Globe, Heart, Users].map((Icon, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center cursor-pointer transition-all"
                  >
                    <Icon className="w-5 h-5 text-gray-400 hover:text-cyan-400 transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Solutions</h3>
              <ul className="space-y-3">
                {["Smart Shopping", "Store Analytics", "Inventory Management", "Customer Insights", "Payment Processing"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group">
                      <CheckCircle className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">support@selepath.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">TEAM SEM - 1369</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">+91 94918 33489</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 SelePath. All rights reserved. Built with ❤️ for the future of retail.
            </p>
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              {["Privacy", "Terms", "Security", "Support"].map((item, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;