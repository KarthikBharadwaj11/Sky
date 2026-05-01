'use client';

import { useState } from 'react';
import {
  Mail,
  Phone,
  Search,
  ChevronRight,
  FileText,
  Video,
  BookOpen,
  Users,
  Shield,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const supportOptions = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      action: "Send Email"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone Support",
      description: "Speak directly with a support specialist",
      action: "Call Now"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'account', name: 'Account & Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'trading', name: 'Trading', icon: <Zap className="w-4 h-4" /> },
    { id: 'technical', name: 'Technical Issues', icon: <FileText className="w-4 h-4" /> },
    { id: 'billing', name: 'Billing & Plans', icon: <Users className="w-4 h-4" /> }
  ];


  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="pt-48 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
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
                  disabled
                  className="w-full pl-12 py-4 text-lg rounded-xl glass-morphism cursor-not-allowed opacity-50"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(124,58,237,0.4), transparent)' }} /></div>

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {supportOptions.map((option, index) => (
                <div key={index} className="card hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="card-body text-center p-6">
                    <div className="flex justify-center mb-4" style={{ color: 'var(--text-accent)' }}>
                      {option.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      {option.title}
                    </h3>
                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                      {option.description}
                    </p>
                    <button className="w-full py-3 rounded-lg font-semibold transition-all duration-300 btn-secondary hover:scale-105">
                      {option.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(124,58,237,0.4), transparent)' }} /></div>

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


            {/* FAQ Items */}
            <div className="max-w-4xl mx-auto">
              <div className="glass-morphism rounded-xl p-12 text-center">
                <p className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Coming Soon</p>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>We're putting together answers to your most common questions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <div className="max-w-4xl mx-auto px-4"><div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(124,58,237,0.4), transparent)' }} /></div>

      {/* Resources Section */}
      <section className="py-16">
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