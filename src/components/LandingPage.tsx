import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Eye, Brain, FileText, Zap, Play, Box, Shield, Rocket, ArrowLeftRight, CheckCircle2, TrendingUp, Users, Target, Lightbulb, Briefcase, Package, ShoppingCart, Award } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePillar, setActivePillar] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const pillars = [
    { icon: Eye, title: 'See Clearly', description: 'Validate your vision with structured thinking', position: 'top' },
    { icon: Brain, title: 'Think Deeply', description: 'Strategic analysis for smart decisions', position: 'right' },
    { icon: FileText, title: 'Plan Smoothly', description: 'Break down complexity into actionable steps', position: 'bottom' },
    { icon: Zap, title: 'Move Boldly', description: 'Execute with confidence and track progress', position: 'left' }
  ];

  const stages = [
    { name: 'IDEA', icon: Lightbulb },
    { name: 'VISION', icon: Eye },
    { name: 'PROJECT', icon: Briefcase },
    { name: 'PRODUCT', icon: Package },
    { name: 'CAREER', icon: Award }
  ];

  const flowSteps = [
    { icon: Box, title: 'Foundation', color: 'red' },
    { icon: Shield, title: 'Validation', color: 'red' },
    { icon: Rocket, title: 'Execution', color: 'red' },
    { icon: ArrowLeftRight, title: 'Feedback', color: 'red' }
  ];

  const aboutCards = [
    {
      title: 'Founder',
      content: "We've been in the trenches where vision meets chaos. So we built a system that makes execution repeatable. This is built for the builder in you."
    },
    {
      title: 'Vision',
      content: "A world where anyone can act on their ideas. Where tools turn into transformations. Where goals don't die with good intentions."
    },
    {
      title: 'Mission',
      content: "We're here to make execution a daily habit. With simplicity, structure, and self-belief. Your big leap starts with a small loop."
    },
    {
      title: 'Value Proposition',
      content: "From chaos to clarity in minutes. From overwhelm to outcomes that ship. From guesswork to guided action."
    }
  ];

  // Circular animation rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePillar((prev) => (prev + 1) % pillars.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Stage cycling animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    setShowLoginModal(false);
    onLogin();
  };

  // Calculate positions for pillars on circle
  const getPillarPosition = (index: number) => {
    const angle = (index * 90 - 90) * (Math.PI / 180);
    const radius = 42; // percentage
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle)
    };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex flex-col">
              <motion.h1 
                className="text-2xl text-black"
                whileHover={{ scale: 1.05 }}
              >
                Execution Planner
              </motion.h1>
              <span className="text-xs text-gray-600">The Best Way How</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#pillars" className="text-gray-700 hover:text-red-600 transition-colors">Pillars</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-red-600 transition-colors">How It Works</a>
              <a href="#why-now" className="text-gray-700 hover:text-red-600 transition-colors">Why Now</a>
              <a href="#services" className="text-gray-700 hover:text-red-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors">About</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setShowLoginModal(true)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                Login
              </Button>
              <Button 
                onClick={() => setShowSignUpModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-20 px-6 bg-gradient-to-b from-gray-50 to-white"
        style={{ opacity, scale }}
      >
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl text-black mb-6 leading-tight">
              The Best Way How to{' '}
              <span className="text-red-600">Turn Ideas into Results</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Execution Planner helps founders and leaders move from idea to execution with clarity, confidence, and continuous feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white text-lg px-8"
                onClick={() => setShowSignUpModal(true)}
              >
                Try Free for 30 Days
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 gap-2 border-black hover:bg-black hover:text-white"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Right - Circular Animation */}
          <motion.div
            className="relative h-[500px] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Central Circle with Text */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePillar}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="text-center px-6"
                  >
                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Value Tag</div>
                    <h3 className="text-2xl text-white mb-2">Best Way<br/>Execution</h3>
                    <p className="text-xs text-gray-300">From fuzzy to focused</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Circular Dashed Path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
              <circle
                cx="250"
                cy="250"
                r="210"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
            </svg>

            {/* Pillars around circle */}
            {pillars.map((pillar, index) => {
              const pos = getPillarPosition(index);

              return (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  animate={{
                    scale: activePillar === index ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`flex items-center gap-3 ${
                    index === 0 ? 'flex-col' : 
                    index === 1 ? 'flex-row' : 
                    index === 2 ? 'flex-col' : 
                    'flex-row-reverse'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      activePillar === index 
                        ? 'bg-red-600 scale-110' 
                        : 'bg-red-50'
                    }`}>
                      <pillar.icon className={`w-6 h-6 transition-colors ${
                        activePillar === index ? 'text-white' : 'text-red-600'
                      }`} />
                    </div>
                    <div className={`bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 whitespace-nowrap ${
                      index === 0 || index === 2 ? 'text-center' : ''
                    }`}>
                      <p className="text-sm text-black">{pillar.title}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Moving Orb with Bulb Icon - larger size */}
            <motion.div
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              <div 
                className="absolute w-12 h-12 rounded-full bg-red-600 shadow-2xl flex items-center justify-center"
                style={{
                  top: '-210px',
                  left: '-24px'
                }}
              >
                <Lightbulb className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                <div className="absolute inset-0 rounded-full bg-red-600 blur-md opacity-50" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Pillars Section */}
      <section id="pillars" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl text-center text-black mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Four Pillars of Execution
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-red-600 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                  <pillar.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl text-black mb-3">{pillar.title}</h3>
                <p className="text-gray-600">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl text-center text-black mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>

          <div className="max-w-6xl mx-auto">
            {/* Stage List on Left + Flow Steps */}
            <div className="flex items-start gap-8">
              {/* Left Side - Stage List */}
              <motion.div
                className="flex-shrink-0 space-y-3"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {stages.map((stage, index) => {
                  const StageIcon = stage.icon;
                  return (
                    <AnimatePresence key={stage.name} mode="wait">
                      <motion.div
                        className={`px-6 py-3 rounded-lg border-2 transition-all ${
                          activeStage === index
                            ? 'bg-yellow-100 border-yellow-500 shadow-md'
                            : 'bg-white border-gray-200'
                        }`}
                        animate={{
                          scale: activeStage === index ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-3">
                          <StageIcon className={`w-5 h-5 ${
                            activeStage === index ? 'text-yellow-600' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm ${
                            activeStage === index ? 'text-black' : 'text-gray-600'
                          }`}>
                            {stage.name}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  );
                })}
              </motion.div>

              {/* Right Side - Flow Steps */}
              <div className="flex-1">
                <div className="relative">
                  <div className="grid grid-cols-4 gap-6">
                    {flowSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        className="relative"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                      >
                        {/* Box with Icon Only */}
                        <div className="bg-white p-8 rounded-3xl border-2 border-gray-300 hover:border-red-600 transition-all duration-300 h-40 flex items-center justify-center relative">
                          <step.icon className="w-16 h-16 text-black" />
                        </div>

                        {/* Solid line from center top */}
                        {index < flowSteps.length - 1 && (
                          <>
                            <svg 
                              className="absolute top-1/2 left-full w-6 overflow-visible"
                              style={{ zIndex: 1, height: '2px', marginTop: '-40px' }}
                            >
                              <line
                                x1="0"
                                y1="0"
                                x2="24"
                                y2="0"
                                stroke="#000"
                                strokeWidth="2"
                              />
                            </svg>
                            {index === 0 && (
                              <span className="absolute top-1/4 left-full ml-8 text-xs text-black whitespace-nowrap">
                                Validation
                              </span>
                            )}
                            {index === 1 && (
                              <span className="absolute top-1/4 left-full ml-8 text-xs text-black whitespace-nowrap">
                                Strategy Loop
                              </span>
                            )}
                            {index === 2 && (
                              <span className="absolute top-1/4 left-full ml-8 text-xs text-black whitespace-nowrap">
                                Outcome Loop
                              </span>
                            )}
                          </>
                        )}

                        {/* Animated dashed line from center bottom */}
                        {index < flowSteps.length - 1 && (
                          <>
                            <svg 
                              className="absolute top-1/2 left-full w-6 overflow-visible"
                              style={{ zIndex: 1, height: '2px', marginTop: '40px' }}
                            >
                              <motion.line
                                x1="0"
                                y1="0"
                                x2="24"
                                y2="0"
                                stroke="#666"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                initial={{ strokeDashoffset: 0 }}
                                animate={{ strokeDashoffset: -8 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: 'linear'
                                }}
                              />
                            </svg>
                            <span className="absolute top-3/4 left-full ml-8 text-xs text-gray-600 whitespace-nowrap">
                              {index === 0 ? 'Enhance Vision' : index === 1 ? 'Update Loop' : 'Feedback'}
                            </span>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Execution Speed Loop - Both sides arrow */}
                  <motion.div
                    className="mt-12 flex items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    {/* Left Arrow */}
                    <svg width="60" height="20" className="rotate-180">
                      <defs>
                        <marker
                          id="arrowhead-left"
                          markerWidth="10"
                          markerHeight="10"
                          refX="5"
                          refY="5"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 5, 0 10" fill="#000" />
                        </marker>
                      </defs>
                      <line
                        x1="10"
                        y1="10"
                        x2="60"
                        y2="10"
                        stroke="#000"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        markerEnd="url(#arrowhead-left)"
                      />
                    </svg>

                    {/* Text */}
                    <span className="text-black px-6 py-2 text-sm whitespace-nowrap">
                      PREPARED EXECUTION SPEED LOOP
                    </span>

                    {/* Right Arrow */}
                    <svg width="60" height="20">
                      <defs>
                        <marker
                          id="arrowhead-right"
                          markerWidth="10"
                          markerHeight="10"
                          refX="5"
                          refY="5"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 5, 0 10" fill="#000" />
                        </marker>
                      </defs>
                      <line
                        x1="0"
                        y1="10"
                        x2="50"
                        y2="10"
                        stroke="#000"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        markerEnd="url(#arrowhead-right)"
                      />
                    </svg>

                    {/* Animated dots */}
                    <div className="absolute bottom-0 flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-red-600"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section id="why-now" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl text-center text-black mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why This App Matters Now
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'AI-Driven Planning',
                description: 'Leverage intelligent insights to make data-driven decisions faster than ever.'
              },
              {
                icon: CheckCircle2,
                title: 'Faster Validation',
                description: 'Validate your ideas quickly with structured frameworks and proven methodologies.'
              },
              {
                icon: Target,
                title: 'Measurable Results',
                description: 'Track progress with clear metrics and adapt your strategy in real-time.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-red-600 hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl text-black mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl text-center text-black mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Services
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Coming Soon
          </motion.p>
        </div>
      </section>

      {/* About Section - 4 Cards */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl text-center text-black mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            About Execution Planner
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {aboutCards.map((card, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-2xl shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-white text-xl">{index + 1}</span>
                  </div>
                  <h3 className="text-2xl">{card.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{card.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl mb-4">Execution Planner</h3>
          <p className="text-gray-400 mb-6">The Best Way How to Turn Ideas into Results</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-red-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-red-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="!w-[500px] !h-auto !max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Welcome Back</DialogTitle>
            <DialogDescription>Login to continue your execution journey</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" placeholder="Enter your email" />
            </div>
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input id="login-password" type="password" placeholder="Enter your password" />
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={showSignUpModal} onOpenChange={setShowSignUpModal}>
        <DialogContent className="!w-[500px] !h-auto !max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Start Your Journey</DialogTitle>
            <DialogDescription>Create an account to begin turning ideas into results</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="signup-name">Full Name</Label>
              <Input id="signup-name" type="text" placeholder="Enter your name" />
            </div>
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" placeholder="Enter your email" />
            </div>
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" placeholder="Create a password" />
            </div>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white" 
              onClick={() => {
                setShowSignUpModal(false);
                onLogin();
              }}
            >
              Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
