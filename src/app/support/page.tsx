'use client';

import { useState } from 'react';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  Search,
  ChevronDown,
  ChevronRight,
  Headphones,
  FileText,
  Video,
  BookOpen,
  Users,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const supportOptions = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 Available",
      action: "Start Chat",
      highlight: true
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support", 
      description: "Send us a detailed message about your issue",
      availability: "Response in 2-4 hours",
      action: "Send Email"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone Support",
      description: "Speak directly with a support specialist", 
      availability: "Mon-Fri 9AM-6PM EST",
      action: "Call Now"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Call",
      description: "Screen sharing for complex technical issues",
      availability: "By Appointment",
      action: "Schedule"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'account', name: 'Account & Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'trading', name: 'Trading', icon: <Zap className="w-4 h-4" /> },
    { id: 'technical', name: 'Technical Issues', icon: <FileText className="w-4 h-4" /> },
    { id: 'billing', name: 'Billing & Plans', icon: <Users className="w-4 h-4" /> }
  ];

  const faqs = [
    {
      category: 'account',
      question: "How do I create a Sky trading account?",
      answer: "Creating an account is simple! Click 'Get Started' on our homepage, provide your email, create a password, and verify your email address. You can start trading immediately after verification."
    },
    {
      category: 'account', 
      question: "How do I enable two-factor authentication?",
      answer: "Go to Settings > Security in your account dashboard. Click 'Enable 2FA' and follow the steps to link your authenticator app. We recommend Google Authenticator or Authy for maximum security."
    },
    {
      category: 'trading',
      question: "What are the trading fees on Sky?",
      answer: "Sky offers commission-free stock trading! You only pay regulatory fees required by exchanges (typically $0.01-0.03 per trade). There are no hidden fees or monthly subscription costs."
    },
    {
      category: 'trading',
      question: "How does copy trading work?",
      answer: "Copy trading lets you automatically replicate trades from successful traders. Choose a trader to follow, set your investment amount and risk parameters, and our system will copy their trades proportionally to your account."
    },
    {
      category: 'trading',
      question: "What is the minimum deposit to start trading?",
      answer: "There's no minimum deposit required! You can start trading with any amount. However, we recommend starting with at least $100 to have meaningful trading opportunities."
    },
    {
      category: 'technical',
      question: "Why can't I log in to my account?",
      answer: "Check that you're using the correct email and password. If you've forgotten your password, click 'Forgot Password' on the login page. If issues persist, clear your browser cache or try a different browser."
    },
    {
      category: 'technical',
      question: "The platform is running slowly. What should I do?",
      answer: "Try refreshing the page, clearing your browser cache, or switching to a different browser. For optimal performance, we recommend using Chrome, Firefox, or Safari with a stable internet connection."
    },
    {
      category: 'billing',
      question: "Are there any subscription fees?",
      answer: "No! Sky is completely free to use. We don't charge subscription fees, account maintenance fees, or hidden costs. You only pay regulatory fees on executed trades."
    },
    {
      category: 'billing',
      question: "How do I withdraw my funds?",
      answer: "Go to your account dashboard, click 'Withdraw', choose your preferred method (bank transfer, debit card), enter the amount, and confirm. Withdrawals typically process within 1-3 business days."
    }
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const searchedFaqs = filteredFaqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-background)' }}>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <Headphones className="w-10 h-10" style={{ color: 'var(--text-primary)' }} />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold gradient-shift leading-tight mb-6">
              We're Here to Help
            </h1>
            
            <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--text-secondary)' }}>
              Get support when you need it, how you need it. Our team is standing by to help you succeed.
            </p>
            
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="form-input pl-12 py-4 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gradient mb-4">Get Instant Support</h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Choose the best way to reach our support team
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportOptions.map((option, index) => (
                <div 
                  key={index} 
                  className={`card hover:scale-105 transition-all duration-300 cursor-pointer ${
                    option.highlight ? 'border-2' : ''
                  }`}
                  style={option.highlight ? { borderColor: 'var(--primary-blue)' } : {}}
                >
                  <div className="card-body text-center p-6">
                    <div className="flex justify-center mb-4" style={{ color: 'var(--text-accent)' }}>
                      {option.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      {option.title}
                    </h3>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {option.description}
                    </p>
                    <div className="mb-4">
                      <span className="glass-morphism px-3 py-1 rounded-full text-sm" style={{ color: 'var(--text-accent)' }}>
                        {option.availability}
                      </span>
                    </div>
                    <button 
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                        option.highlight ? 'btn-primary' : 'btn-secondary'
                      } hover:scale-105`}
                    >
                      {option.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gradient mb-4">Frequently Asked Questions</h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Find quick answers to common questions
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? 'btn-primary' 
                      : 'glass-morphism hover:bg-white/5'
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4 max-w-4xl mx-auto">
              {searchedFaqs.map((faq, index) => (
                <div key={index} className="glass-morphism rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--text-accent)' }}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6" style={{ color: 'var(--text-secondary)' }}>
                      <div className="pt-4 border-t border-white/10">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {searchedFaqs.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    No articles found matching your search.
                  </p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="btn-secondary mt-4"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <div className="card-body text-center p-8">
                <h3 className="text-3xl font-bold text-gradient mb-4">
                  Still Need Help?
                </h3>
                <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                  Our support team is here to help you with any questions or issues
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="glass-morphism p-4 rounded-lg">
                    <Mail className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-accent)' }} />
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Email</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>support@sky-trading.com</p>
                  </div>
                  <div className="glass-morphism p-4 rounded-lg">
                    <Phone className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-accent)' }} />
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Phone</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>1-800-SKY-HELP</p>
                  </div>
                  <div className="glass-morphism p-4 rounded-lg">
                    <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-accent)' }} />
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Hours</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>24/7 Support</p>
                  </div>
                </div>

                <button className="btn-primary px-8 py-3 text-lg hover:scale-105 transition-all duration-300">
                  <span className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Start Live Chat
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gradient mb-4">Additional Resources</h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Explore more ways to get help and learn
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card hover:scale-105 transition-all duration-300">
                <div className="card-body text-center p-6">
                  <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-accent)' }} />
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Learning Center
                  </h3>
                  <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Comprehensive guides and tutorials to master trading
                  </p>
                  <button className="btn-secondary w-full flex items-center justify-center gap-2">
                    Visit Learning Center
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="card hover:scale-105 transition-all duration-300">
                <div className="card-body text-center p-6">
                  <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-accent)' }} />
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Community Forum
                  </h3>
                  <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Connect with other traders and share experiences
                  </p>
                  <button className="btn-secondary w-full flex items-center justify-center gap-2">
                    Join Community
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="card hover:scale-105 transition-all duration-300">
                <div className="card-body text-center p-6">
                  <Video className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-accent)' }} />
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Video Tutorials
                  </h3>
                  <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Step-by-step video guides for all platform features
                  </p>
                  <button className="btn-secondary w-full flex items-center justify-center gap-2">
                    Watch Videos
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}