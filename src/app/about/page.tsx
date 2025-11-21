'use client';

import { 
  Target, 
  Users, 
  Award, 
  Shield, 
  Globe, 
  TrendingUp,
  Heart,
  Zap,
  Eye,
  MapPin,
  Star,
  CheckCircle,
  Linkedin,
  Twitter,
  Mail
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "10K+", label: "Active Traders" },
    { icon: <Globe className="w-8 h-8" />, value: "$2.5B+", label: "Volume Traded" },
    { icon: <TrendingUp className="w-8 h-8" />, value: "99.9%", label: "Uptime" },
    { icon: <Award className="w-8 h-8" />, value: "24/7", label: "Support" }
  ];

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
    {
      name: "Team Member",
      role: "CEO & Co-Founder",
      description: "Leadership experience in fintech and trading platforms.",
      image: "👩‍💼",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Team Member",
      role: "CTO & Co-Founder", 
      description: "Technical expertise in distributed systems and trading infrastructure.",
      image: "👨‍💻",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Team Member",
      role: "Head of AI & Analytics",
      description: "Advanced degree and research experience in machine learning and quantitative analysis.",
      image: "👩‍🔬",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Team Member",
      role: "Head of Product",
      description: "Product development experience in financial technology and trading platforms.",
      image: "👨‍💼",
      social: { linkedin: "#", twitter: "#" }
    }
  ];


  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-background)' }}>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <Target className="w-10 h-10" style={{ color: 'var(--text-primary)' }} />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold gradient-shift leading-tight mb-6">
              About Sky
            </h1>
            
            <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--text-secondary)' }}>
              We're on a mission to democratize trading and make financial markets accessible to everyone, 
              backed by cutting-edge technology and unwavering commitment to our users.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="glass-morphism p-6 rounded-xl text-center hover:scale-105 transition-all duration-300">
                  <div className="flex justify-center mb-3" style={{ color: 'var(--text-accent)' }}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" style={{ color: 'var(--text-accent)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>Commission-free trading for all users</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" style={{ color: 'var(--text-accent)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>AI-powered insights and recommendations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" style={{ color: 'var(--text-accent)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>Comprehensive educational resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" style={{ color: 'var(--text-accent)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>24/7 customer support and community</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body p-8">
                  <div className="text-center mb-6">
                    <Eye className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-accent)' }} />
                    <h3 className="text-2xl font-bold text-gradient mb-2">Our Vision</h3>
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
                    <div className="flex justify-center mb-4" style={{ color: 'var(--text-accent)' }}>
                      {value.icon}
                    </div>
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

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gradient mb-4">Meet Our Team</h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Industry experts passionate about democratizing trading
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="card hover:scale-105 transition-all duration-300">
                  <div className="card-body text-center p-6">
                    <div className="text-6xl mb-4">{member.image}</div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-accent)' }}>
                      {member.role}
                    </p>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {member.description}
                    </p>
                    <div className="flex justify-center gap-3">
                      <a href={member.social.linkedin} className="p-2 glass-morphism rounded-lg hover:bg-white/10 transition-colors">
                        <Linkedin className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
                      </a>
                      <a href={member.social.twitter} className="p-2 glass-morphism rounded-lg hover:bg-white/10 transition-colors">
                        <Twitter className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
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
                  Ready to Join the Sky Community?
                </h3>
                <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                  Start your trading journey with the platform built by traders, for traders
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <button className="btn-primary px-8 py-3 text-lg hover:scale-105 transition-all duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <Star className="w-5 h-5" />
                      Start Trading Free
                    </span>
                  </button>
                  <button className="btn-secondary px-8 py-3 text-lg hover:scale-105 transition-all duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Contact Us
                    </span>
                  </button>
                </div>

                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--text-accent)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>San Francisco, CA</p>
                  </div>
                  <div className="text-center">
                    <Mail className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--text-accent)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>hello@sky-trading.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}