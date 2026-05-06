'use client';

import {
  Shield,
  Heart,
  Zap,
  Eye,
  Mail,
  Star
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Security First",
      description: "We employ bank-level security measures to protect your funds and data with advanced encryption and regulatory compliance."
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "User-Centric",
      description: "Every feature we build puts our users first, focusing on intuitive design and powerful functionality that drives success."
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Innovation",
      description: "We continuously push the boundaries of trading technology with AI-powered insights and cutting-edge tools."
    },
    {
      icon: <Eye className="w-12 h-12" />,
      title: "Transparency",
      description: "Complete transparency in pricing, performance, and operations. No hidden fees, no surprises - just honest trading."
    }
  ];

  const team = [
    { name: "Sushma Srinivas", role: "Founder & CEO" },
    { name: "Prakash Nair", role: "CTO" },
    { name: "Karthik Surya", role: "IT Manager" },
  ];


  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="pt-48 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold gradient-shift leading-tight mb-6">
              About Sky
            </h1>
            
            <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--text-secondary)' }}>
              Sky empowers the modern trader by fusing cutting-edge AI insights with a collaborative community. By removing the barriers to sophisticated trading, we provide every trader—at every level—with the intelligence and tools they need to thrive.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(124,58,237,0.4), transparent)' }} /></div>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
                  Our Mission
                </h2>
                <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                  At Sky, we believe that everyone should have access to professional-grade trading tools and education, 
                  regardless of their experience level or account size.
                </p>
                <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                  We're building the future of trading by combining artificial intelligence, social learning, 
                  and intuitive design to create a platform that empowers traders to achieve their financial goals.
                </p>
                <ul className="list-disc list-inside space-y-3">
                  <li style={{ color: 'var(--text-primary)' }}>Commission-free trading for all users</li>
                  <li style={{ color: 'var(--text-primary)' }}>AI-powered insights and recommendations</li>
                  <li style={{ color: 'var(--text-primary)' }}>Comprehensive educational resources</li>
                  <li style={{ color: 'var(--text-primary)' }}>24/7 customer support and community</li>
                </ul>
              </div>
              
              <div className="card">
                <div className="card-body p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-4xl font-bold text-gradient mb-2">Our Vision</h3>
                  </div>
                  <p className="text-lg text-center" style={{ color: 'var(--text-secondary)' }}>
                    To become the world's most trusted and innovative trading platform, 
                    where millions of users achieve financial freedom through intelligent, 
                    accessible, and transparent trading tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(124,58,237,0.4), transparent)' }} /></div>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gradient mb-4">Our Values</h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="card hover:scale-105 transition-all duration-300">
                  <div className="card-body text-center p-6">
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      {value.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4"><div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(124,58,237,0.4), transparent)' }} /></div>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gradient mb-4">Our Team</h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                The people building Sky
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="card hover:scale-105 transition-all duration-300">
                  <div className="card-body text-center p-8">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                      <span className="text-xl font-bold text-white">
                        {member.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-accent)' }}>
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <div className="max-w-4xl mx-auto px-4"><div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(124,58,237,0.4), transparent)' }} /></div>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <div className="card-body text-center p-8">
                <h3 className="text-3xl font-bold text-gradient mb-4">
                  Ready to Join the Sky Community?
                </h3>
                <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                  Start your trading journey with the platform built by traders, for traders
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <button className="btn-primary px-8 py-3 text-lg hover:scale-105 transition-all duration-300">
                    Start Trading
                  </button>
                  <button className="btn-secondary px-8 py-3 text-lg hover:scale-105 transition-all duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Contact Us
                    </span>
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