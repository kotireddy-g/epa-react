import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Lightbulb, Brain, TrendingUp, Users, Target, CheckCircle, 
  BarChart, Briefcase, GraduationCap, Rocket,
  Play, ArrowRight, ChevronDown, DollarSign, Network,
  FileText, Calendar, TrendingDown, Eye, EyeOff
} from 'lucide-react';
import { authApi } from '../services/authApi';

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // Authentication state - preserved from original
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Signup state
  const [signName, setSignName] = useState('');
  const [signEmail, setSignEmail] = useState('');
  const [signPassword, setSignPassword] = useState('');
  const [signConfirmPassword, setSignConfirmPassword] = useState('');
  const [signCountryCode, setSignCountryCode] = useState('+91');
  const [signPhone, setSignPhone] = useState('');
  const [signLinkedIn, setSignLinkedIn] = useState('');
  const [signLocation, setSignLocation] = useState('');
  const [signDOB, setSignDOB] = useState('');
  const [signGender, setSignGender] = useState('NA');
  const [signProfTitle, setSignProfTitle] = useState('');
  const [signCompany, setSignCompany] = useState('');
  const [signIndustry, setSignIndustry] = useState('');
  const [signYearsExp, setSignYearsExp] = useState('');
  const [signBusinessType, setSignBusinessType] = useState('');
  const [signCompanySize, setSignCompanySize] = useState('');
  const [signFundingStage, setSignFundingStage] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signError, setSignError] = useState('');

  // Email verification state
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);

  // Password visibility state
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useScroll();

  const journeySteps = [
    { icon: Lightbulb, label: 'Idea', color: 'yellow' },
    { icon: Brain, label: 'Validation', color: 'blue' },
    { icon: FileText, label: 'Plan', color: 'green' },
    { icon: Rocket, label: 'Execute', color: 'purple' },
    { icon: Target, label: 'Success', color: 'red' }
  ];

  const validationCards = [
    { icon: Users, title: 'Persona Validation', desc: "Who's your real customer?" },
    { icon: DollarSign, title: 'Financial Validation', desc: 'Is it scalable?' },
    { icon: Lightbulb, title: 'Idea Validation', desc: 'Is it unique & feasible?' },
    { icon: Network, title: 'Network Validation', desc: 'Who supports you?' }
  ];

  const audienceCards = [
    { icon: Briefcase, title: 'Startup Owners', desc: 'Turn concepts into pitch-ready plans' },
    { icon: Users, title: 'Professionals & Leaders', desc: 'Validate strategies before execution' },
    { icon: GraduationCap, title: 'Job Seekers', desc: 'Create innovation portfolios for employers' },
    { icon: Brain, title: 'Entrepreneurs', desc: 'Track multiple projects with AI precision' }
  ];

  const pillars = [
    { title: 'AI-Driven Clarity', desc: 'Deep insights, not just feedback' },
    { title: 'Actionable Planning', desc: 'From concept to execution roadmap' },
    { title: 'Real-Time Tracking', desc: 'Monitor progress with AI guidance' },
    { title: 'Measurable Outcomes', desc: 'Learn and optimize continuously' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % journeySteps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [journeySteps.length]);

  // Authentication logic - preserved from original
  const handleLogin = async () => {
    setLoginError('');
    setIsLoggingIn(true);

    try {
      await authApi.login({
        username: loginEmail,
        password: loginPassword,
      });
      
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
      onLogin();
    } catch (error: any) {
      // Check if error is due to unverified email/LinkedIn
      if (error.message && error.message.includes('verify')) {
        // Show verification modal for email
        setVerifyEmail(loginEmail);
        setShowLoginModal(false);
        setShowVerifyEmailModal(true);
        setLoginError('');
      } else {
        setLoginError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async () => {
    setSignError('');
    // Validate required fields (LinkedIn is optional, Location is mandatory)
    if (!signName || !signEmail || !signPassword || !signConfirmPassword || !signPhone || 
        !signProfTitle || !signIndustry || !signYearsExp || !signBusinessType || 
        !signCompanySize || !signFundingStage || !signLocation) {
      setSignError('Please fill all required fields');
      return;
    }
    if (signPassword !== signConfirmPassword) {
      setSignError('Passwords do not match');
      return;
    }
    try {
      setIsSigningUp(true);
      const [first_name, ...rest] = signName.trim().split(' ');
      const last_name = rest.join(' ') || '-';
      const registerPayload = {
        email: signEmail,
        password: signPassword,
        confirm_password: signConfirmPassword,
        first_name,
        last_name,
        phone_number: `${signCountryCode}${signPhone}`,
        linkedin_profile: signLinkedIn,
        profile: {
          fullname: signName,
          date_of_birth: signDOB || '1990-01-01',
          gender: signGender.toLowerCase,
          professional_title: signProfTitle,
          company: signCompany || '',
          industry: signIndustry,
          years_of_experience: parseInt(signYearsExp) || 0,
          businessType: signBusinessType,
          companySize: signCompanySize,
          fundingStage: signFundingStage,
          location: signLocation,
        },
      } as any;
      await authApi.register(registerPayload);
      // On success, show email verification modal
      setVerifyEmail(signEmail);
      setShowSignUpModal(false);
      setShowVerifyEmailModal(true);
    } catch (e: any) {
      setSignError(e.message || 'Signup failed. Please try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleVerifyEmail = async () => {
    setVerifyError('');
    if (!otpCode || otpCode.length !== 6) {
      setVerifyError('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      setIsVerifying(true);
      await authApi.verifyEmail({ email: verifyEmail, otp_code: otpCode });
      setShowVerifyEmailModal(false);
      setShowLoginModal(true);
      setOtpCode('');
    } catch (e: any) {
      setVerifyError(e.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setVerifyError('');
    try {
      setIsResendingOTP(true);
      await authApi.resendOTP({ email: verifyEmail });
      alert('OTP has been resent to your email');
    } catch (e: any) {
      setVerifyError(e.message || 'Failed to resend OTP');
    } finally {
      setIsResendingOTP(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <motion.h1 
                className="text-2xl text-black cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                ExecutionPlanner
              </motion.h1>
              <span className="text-xs text-gray-600">From Idea to Impact. Powered by AI.</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-700 hover:text-red-600 transition-colors">How It Works</a>
              <a href="#validation" className="text-gray-700 hover:text-red-600 transition-colors">Validation</a>
              <a href="#who-its-for" className="text-gray-700 hover:text-red-600 transition-colors">Who It's For</a>
              <a href="#why-us" className="text-gray-700 hover:text-red-600 transition-colors">Why Us</a>
            </nav>

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
                Start Free
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-red-50 rounded-full mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-sm text-red-600">AI-Powered Execution Platform</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl text-black mb-6 leading-tight">
              Your Idea Deserves a Plan.{' '}
              <span className="text-red-600">Let AI Show You the Path to Success.</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-4">
              You dream. AI executes.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              From your first spark of inspiration to your final milestone — ExecutionPlanner helps you build, validate, plan, and track your journey like never before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 gap-2"
                onClick={() => setShowSignUpModal(true)}
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 gap-2 border-black hover:bg-black hover:text-white"
              >
                <Play className="w-5 h-5" />
                See How It Works
              </Button>
            </div>
          </motion.div>

          {/* Right - Animated Journey */}
          <motion.div
            className="relative h-[500px] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Transformation Animation */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Idea Bulb to Dashboard Animation */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Lightbulb className="w-32 h-32 text-yellow-500 fill-yellow-200" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-yellow-100 blur-3xl opacity-50" />
                  </div>
                </div>
              </motion.div>

              {/* Journey Steps */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 500 500">
                  <circle
                    cx="250"
                    cy="250"
                    r="180"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
                
                {journeySteps.map((step, index) => {
                  const angle = (index * 72 - 90) * (Math.PI / 180);
                  const x = 250 + 180 * Math.cos(angle);
                  const y = 250 + 180 * Math.sin(angle);
                  
                  return (
                    <motion.div
                      key={index}
                      className="absolute"
                      style={{
                        left: `${(x / 500) * 100}%`,
                        top: `${(y / 500) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      animate={{
                        scale: activeStep === index ? 1.3 : 1,
                        opacity: activeStep === index ? 1 : 0.6
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                        activeStep === index ? 'bg-red-600' : 'bg-white border-2 border-gray-200'
                      }`}>
                        <step.icon className={`w-8 h-8 ${
                          activeStep === index ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="absolute top-full mt-2 whitespace-nowrap text-center w-full">
                        <span className="text-xs text-gray-700">{step.label}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-6">
              Most Great Ideas Fail — Not Because They're Bad,{' '}
              <span className="text-red-500">But Because They're Unplanned.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Chaos */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gray-900 p-8 rounded-2xl border border-red-900 relative overflow-hidden">
                <TrendingDown className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-2xl mb-4 text-red-400">Without ExecutionPlanner</h3>
                <ul className="space-y-3 text-gray-400">
                  <li>❌ 90% of startups fail due to poor planning</li>
                  <li>❌ Unclear validation and weak strategy</li>
                  <li>❌ Scattered notes and missed opportunities</li>
                  <li>❌ No structured path from idea to execution</li>
                </ul>
              </div>
            </motion.div>

            {/* Right - Clarity */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-8 rounded-2xl relative overflow-hidden">
                <TrendingUp className="w-16 h-16 text-white mb-4" />
                <h3 className="text-2xl mb-4">With ExecutionPlanner</h3>
                <ul className="space-y-3">
                  <li>✓ AI-driven validation and insights</li>
                  <li>✓ Clear execution roadmap with milestones</li>
                  <li>✓ Real-time progress tracking</li>
                  <li>✓ Turn inspiration into measurable action</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Journey Section */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-black mb-6">
              An Intelligent Companion That Grows Your Idea Step-by-Step
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ExecutionPlanner isn't just an app — it's your AI-powered Execution Partner
            </p>
          </motion.div>

          <div className="space-y-12">
            {[
              { icon: Lightbulb, title: 'Write Your Idea', desc: 'Capture your concept in your words', color: 'yellow' },
              { icon: Brain, title: 'AI Analysis', desc: 'Get instant feedback on strengths, weaknesses, and opportunities', color: 'purple' },
              { icon: CheckCircle, title: 'Validation Engine', desc: 'Validate through Persona, Financial, Network & Market checks', color: 'green' },
              { icon: FileText, title: 'Business Plan Builder', desc: 'Turn validated ideas into Lean Canvas Models with AI templates', color: 'blue' },
              { icon: Calendar, title: 'Execution Planner', desc: 'Map out milestones, sprints, and daily actions with AI', color: 'indigo' },
              { icon: BarChart, title: 'Progress Tracker', desc: 'Measure implementation and get continuous feedback', color: 'orange' },
              { icon: Target, title: 'Outcome Analyzer', desc: 'Track what worked and optimize your next move', color: 'red' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex items-center gap-8 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-24 h-24 rounded-full bg-${item.color}-100 flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-12 h-12 text-${item.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl text-black mb-2">{item.title}</h3>
                  <p className="text-lg text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowSignUpModal(true)}>
              Try AI Analysis Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* AI Analysis Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-black mb-6">
              Not Just Feedback. <span className="text-red-600">Deep AI Insights.</span>
            </h2>
            <p className="text-xl text-gray-600">Our AI doesn't just grade your idea — it understands it.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                'Identifies clarity gaps and missing logic',
                'Highlights key strengths for investors',
                'Suggests refinements for better market fit',
                'Explains why clarity matters'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">{item}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-200"
            >
              <Brain className="w-16 h-16 text-purple-600 mb-4" />
              <h3 className="text-xl text-black mb-4">AI Analysis Dashboard</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Clarity Score</span>
                  <span className="text-green-600">92%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 w-[92%]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Market Fit</span>
                  <span className="text-blue-600">85%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[85%]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Feasibility</span>
                  <span className="text-purple-600">88%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 w-[88%]" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Validation Section */}
      <section id="validation" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-black mb-6">
              Test Before You Build. <span className="text-red-600">Validate with Precision.</span>
            </h2>
            <p className="text-xl text-gray-600">Before you risk time or money, validate across four key dimensions</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {validationCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-red-600 hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                  <card.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl text-black mb-3">{card.title}</h3>
                <p className="text-gray-600">{card.desc}</p>
                <div className="mt-6 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-600"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.random() * 30 + 70}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Plan Builder Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-black mb-6">
              Turn Your Validated Idea Into an <span className="text-red-600">Actionable Plan</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              'Define your problem, solution, and value proposition',
              'Identify key partners, channels, and revenue streams',
              'Generate investor-ready visuals instantly'
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center mb-4 text-xl">
                  {index + 1}
                </div>
                <p className="text-lg text-gray-700">{item}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowSignUpModal(true)}>
              Generate My Lean Canvas
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Execution Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-black mb-6">
              Execution <span className="text-red-600">Without Confusion</span>
            </h2>
            <p className="text-xl text-gray-600">Plan tasks, assign actions, and track every milestone</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-100 to-white p-8 rounded-2xl shadow-xl border-2 border-gray-200"
          >
            <div className="grid grid-cols-3 gap-4">
              {['To Do', 'In Progress', 'Completed'].map((status, index) => (
                <div key={index} className="bg-white p-4 rounded-lg">
                  <h4 className="text-sm text-gray-700 mb-3">{status}</h4>
                  <div className="space-y-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="h-2 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-gray-200 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Outcome Insights Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-black mb-6">
              Measure Progress. <span className="text-red-600">Master Growth.</span>
            </h2>
            <p className="text-xl text-gray-600">Track positives, negatives, and outcomes with AI-powered insights</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { label: 'Completed', value: '87%', color: 'green' },
              { label: 'In Progress', value: '42%', color: 'yellow' },
              { label: 'Pending', value: '13%', color: 'red' }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className={`text-4xl text-${stat.color}-600 mb-2`}>{stat.value}</div>
                <div className="text-gray-700">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section id="who-its-for" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-black mb-6">
              Built for Every Dreamer Who <span className="text-red-600">Dares to Execute</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {audienceCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-black to-gray-900 text-white p-8 rounded-2xl hover:scale-105 transition-transform"
              >
                <card.icon className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl mb-3">{card.title}</h3>
                <p className="text-gray-400">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ExecutionPlanner Section */}
      <section id="why-us" className="py-24 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-6">
              Because Every Step Counts Between <span className="text-red-500">Idea and Success</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-600 mx-auto mb-4 flex items-center justify-center text-2xl">
                  {index + 1}
                </div>
                <h3 className="text-xl mb-2">{pillar.title}</h3>
                <p className="text-gray-400">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-2xl text-red-500 italic">
              "Think it. Plan it. Execute it. Learn it. With ExecutionPlanner."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl text-black mb-6">
              Your Next Big Move <span className="text-red-600">Starts Here</span>
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              Let AI turn your ideas into a success roadmap.
            </p>
            <p className="text-lg text-gray-600 mb-12">
              No more confusion. No more wasted potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white text-lg px-8"
                onClick={() => setShowSignUpModal(true)}
              >
                Start for Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 border-black hover:bg-black hover:text-white"
              >
                Watch Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                onClick={() => setShowSignUpModal(true)}
              >
                See AI in Action
              </Button>
            </div>

            {/* Success Rocket Animation */}
            <motion.div
              className="mt-16 relative h-32"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {journeySteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-2">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-gray-600">{step.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl mb-4">ExecutionPlanner</h3>
              <p className="text-gray-400 text-sm">From Idea to Impact. Powered by AI.</p>
            </div>
            <div>
              <h4 className="mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-red-500">Features</a></li>
                <li><a href="#" className="hover:text-red-500">Pricing</a></li>
                <li><a href="#" className="hover:text-red-500">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-red-500">About</a></li>
                <li><a href="#" className="hover:text-red-500">Blog</a></li>
                <li><a href="#" className="hover:text-red-500">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-red-500">Privacy</a></li>
                <li><a href="#" className="hover:text-red-500">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 ExecutionPlanner. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal - with authentication logic preserved */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="!w-[500px] !h-auto !max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Welcome Back</DialogTitle>
            <DialogDescription>Login to continue your execution journey</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {loginError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {loginError}
              </div>
            )}
            <div>
              <Label htmlFor="login-email" className="mb-2 block">Email</Label>
              <Input 
                id="login-email" 
                type="email" 
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                disabled={isLoggingIn}
              />
            </div>
            <div>
              <Label htmlFor="login-password" className="mb-2 block">Password</Label>
              <div className="relative">
                <Input 
                  id="login-password" 
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoggingIn}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoggingIn) {
                      handleLogin();
                    }
                  }}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white" 
              onClick={handleLogin}
              disabled={isLoggingIn || !loginEmail || !loginPassword}
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
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

          <div className="space-y-3 mt-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="signup-name" className="mb-1 block text-sm">Full Name *</Label>
                <Input id="signup-name" type="text" placeholder="John Doe" value={signName} onChange={e=>setSignName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="signup-email" className="mb-1 block text-sm">Email *</Label>
                <Input id="signup-email" type="email" placeholder="john@example.com" value={signEmail} onChange={e=>setSignEmail(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="signup-password" className="mb-1 block text-sm">Password *</Label>
                <div className="relative">
                  <Input 
                    id="signup-password" 
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    value={signPassword} 
                    onChange={e=>setSignPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="signup-confirm-password" className="mb-1 block text-sm">Confirm Password *</Label>
                <div className="relative">
                  <Input 
                    id="signup-confirm-password" 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    value={signConfirmPassword} 
                    onChange={e=>setSignConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="mb-1 block text-sm">Country Code *</Label>
                <Input value={signCountryCode} onChange={e=>setSignCountryCode(e.target.value)} placeholder="+91" />
              </div>
              <div className="col-span-2">
                <Label className="mb-1 block text-sm">Phone *</Label>
                <Input value={signPhone} onChange={e=>setSignPhone(e.target.value)} placeholder="9876543210" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 block text-sm">Professional Title *</Label>
                <Input placeholder="Founder, CEO, etc." value={signProfTitle} onChange={e=>setSignProfTitle(e.target.value)} />
              </div>
              <div>
                <Label className="mb-1 block text-sm">Industry *</Label>
                <Input placeholder="Technology, Healthcare, etc." value={signIndustry} onChange={e=>setSignIndustry(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 block text-sm">Years of Experience *</Label>
                <Input type="number" placeholder="5" value={signYearsExp} onChange={e=>setSignYearsExp(e.target.value)} />
              </div>
              <div>
                <Label className="mb-1 block text-sm">Business Type *</Label>
                <Input placeholder="SaaS, E-commerce, etc." value={signBusinessType} onChange={e=>setSignBusinessType(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 block text-sm">Company Size *</Label>
                <select className="w-full border rounded-md p-2 text-sm" value={signCompanySize} onChange={e=>setSignCompanySize(e.target.value)}>
                  <option value="">Select size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div>
                <Label className="mb-1 block text-sm">Funding Stage *</Label>
                <select className="w-full border rounded-md p-2 text-sm" value={signFundingStage} onChange={e=>setSignFundingStage(e.target.value)}>
                  <option value="">Select stage</option>
                  <option value="Bootstrapped">Bootstrapped</option>
                  <option value="Pre-seed">Pre-seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B+">Series B+</option>
                </select>
              </div>
            </div>
            <div>
              <Label className="mb-1 block text-sm">Company (Optional)</Label>
              <Input placeholder="Your company name" value={signCompany} onChange={e=>setSignCompany(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-sm">LinkedIn Profile (Optional)</Label>
              <Input placeholder="https://linkedin.com/in/yourprofile" value={signLinkedIn} onChange={e=>setSignLinkedIn(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-sm">Location *</Label>
              <Input placeholder="City, State, Country" value={signLocation} onChange={e=>setSignLocation(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 block text-sm">Date of Birth (Optional)</Label>
                <Input type="date" value={signDOB} onChange={e=>setSignDOB(e.target.value)} />
              </div>
              <div>
                <Label className="mb-1 block text-sm">Gender (Optional)</Label>
                <select className="w-full border rounded-md p-2 text-sm" value={signGender} onChange={e=>setSignGender(e.target.value)}>
                  <option value="NA">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            {signError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{signError}</div>}
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white" 
              onClick={handleSignup}
              disabled={isSigningUp}
            >
              {isSigningUp ? 'Signing up...' : 'Sign Up'}
            </Button>
            <p className="text-xs text-gray-500 text-center">* Required fields</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Verification Modal */}
      <Dialog open={showVerifyEmailModal} onOpenChange={setShowVerifyEmailModal}>
        <DialogContent className="!w-[450px] !max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              We've sent a 6-digit OTP to {verifyEmail}. Please enter it below to verify your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="otp-code" className="mb-2 block">Enter OTP Code</Label>
              <Input 
                id="otp-code" 
                type="text" 
                placeholder="Enter 6-digit code" 
                value={otpCode} 
                onChange={e=>setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            {verifyError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{verifyError}</div>}
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              onClick={handleVerifyEmail}
              disabled={isVerifying || otpCode.length !== 6}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </Button>
            <Button 
              variant="outline"
              className="w-full" 
              onClick={handleResendOTP}
              disabled={isResendingOTP}
            >
              {isResendingOTP ? 'Resending...' : 'Resend OTP'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
