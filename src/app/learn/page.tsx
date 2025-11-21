'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  BarChart3, 
  DollarSign,
  Star,
  Brain,
  Lightbulb,
  Target,
  Zap,
  Eye,
  ArrowRight,
  RotateCcw,
  Play,
  Award,
  ChevronRight,
  BookOpen,
  PieChart,
  LineChart
} from 'lucide-react';

export default function LearnPage() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('basics');

  const flashcards = [
    {
      id: 1,
      front: {
        title: "What is a Stock?",
        icon: <TrendingUp className="w-12 h-12" />,
        color: "from-blue-500 to-cyan-500"
      },
      back: {
        content: "A stock represents a share of ownership in a company. When you buy a stock, you become a partial owner and may receive dividends and voting rights.",
        example: "If Apple has 1 billion shares and you own 100 shares, you own 0.00001% of Apple!"
      }
    },
    {
      id: 2,
      front: {
        title: "Bull vs Bear Market",
        icon: <BarChart3 className="w-12 h-12" />,
        color: "from-green-500 to-emerald-500"
      },
      back: {
        content: "🐂 Bull Market: Prices rising, investor confidence high, economy growing. 🐻 Bear Market: Prices falling 20%+ from highs, pessimism, economic uncertainty.",
        example: "The 2020-2021 period was a bull market with stocks hitting record highs!"
      }
    },
    {
      id: 3,
      front: {
        title: "Market Cap",
        icon: <DollarSign className="w-12 h-12" />,
        color: "from-purple-500 to-pink-500"
      },
      back: {
        content: "Market Capitalization = Share Price × Number of Outstanding Shares. It shows the total value of all company shares.",
        example: "Apple at $180/share with 15.7B shares = $2.8 Trillion market cap!"
      }
    },
    {
      id: 4,
      front: {
        title: "Dividends",
        icon: <Star className="w-12 h-12" />,
        color: "from-orange-500 to-red-500"
      },
      back: {
        content: "Cash payments companies make to shareholders from profits. Usually paid quarterly. Dividend yield = Annual dividend ÷ Stock price.",
        example: "If a $100 stock pays $4/year in dividends, that's a 4% dividend yield!"
      }
    },
    {
      id: 5,
      front: {
        title: "P/E Ratio",
        icon: <Target className="w-12 h-12" />,
        color: "from-indigo-500 to-blue-500"
      },
      back: {
        content: "Price-to-Earnings ratio compares stock price to earnings per share. Lower P/E might mean undervalued, higher P/E might mean overvalued.",
        example: "Stock at $50 with $2.50 earnings per share = P/E of 20"
      }
    },
    {
      id: 6,
      front: {
        title: "Copy Trading",
        icon: <Users className="w-12 h-12" />,
        color: "from-teal-500 to-green-500"
      },
      back: {
        content: "Automatically copy trades from experienced traders. You set the amount and risk level, and their trades are replicated in your account proportionally.",
        example: "If a trader buys $1000 of Apple and you allocated $500 to copy them, you'd buy $50 of Apple (5% of their trade)"
      }
    }
  ];

  const funFacts = [
    { icon: "📈", fact: "The stock market has historically returned about 10% annually over the long term" },
    { icon: "⚡", fact: "Modern stock trades execute in microseconds - faster than you can blink!" },
    { icon: "🌍", fact: "The New York Stock Exchange is worth more than the entire GDP of most countries" },
    { icon: "🤖", fact: "About 80% of stock trading is now done by algorithms and computers" },
    { icon: "📱", fact: "You can start trading with as little as $1 thanks to fractional shares" }
  ];

  const quickTips = [
    {
      title: "Start Small",
      description: "Begin with small amounts while you learn. You can always invest more later!",
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      title: "Diversify",
      description: "Don't put all your eggs in one basket. Spread investments across different stocks.",
      icon: <PieChart className="w-6 h-6" />
    },
    {
      title: "Think Long-term",
      description: "Time in the market beats timing the market. Patient investors usually win.",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "Keep Learning",
      description: "Markets change constantly. Stay curious and keep educating yourself!",
      icon: <Brain className="w-6 h-6" />
    }
  ];

  const riskLevels = [
    {
      level: "Conservative",
      risk: "Low Risk",
      color: "bg-green-900/30 text-green-300 border-green-500/30",
      description: "Stable companies, dividends, bonds",
      example: "Blue-chip stocks like Coca-Cola, utilities"
    },
    {
      level: "Moderate",
      risk: "Medium Risk",
      color: "bg-yellow-900/30 text-yellow-300 border-yellow-500/30",
      description: "Balanced growth and stability",
      example: "S&P 500 index funds, established tech companies"
    },
    {
      level: "Aggressive", 
      risk: "High Risk",
      color: "bg-red-900/30 text-red-300 border-red-500/30",
      description: "Growth stocks, startups, emerging markets",
      example: "Small-cap stocks, cryptocurrency, IPOs"
    }
  ];

  const handleCardFlip = (cardId: number) => {
    setFlippedCard(flippedCard === cardId ? null : cardId);
  };

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-opacity duration-1000" style={{ background: 'var(--gradient-primary)' }}>
              <Brain className="w-10 h-10" style={{ color: 'var(--text-primary)' }} />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold gradient-shift leading-tight mb-6">
            Learn Trading the Fun Way! 🚀
          </h1>
          
          <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Interactive flashcards, fun facts, and bite-sized lessons to make you a trading pro!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="glass-morphism px-6 py-3 rounded-full">
              <span className="text-2xl mr-2">🎯</span>
              <span style={{ color: 'var(--text-primary)' }}>Interactive Learning</span>
            </div>
            <div className="glass-morphism px-6 py-3 rounded-full">
              <span className="text-2xl mr-2">⚡</span>
              <span style={{ color: 'var(--text-primary)' }}>Quick & Fun</span>
            </div>
            <div className="glass-morphism px-6 py-3 rounded-full">
              <span className="text-2xl mr-2">🎮</span>
              <span style={{ color: 'var(--text-primary)' }}>Gamified</span>
            </div>
          </div>
        </div>

        {/* Interactive Flashcards */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">💡 Trading Flashcards</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Click any card to reveal the answer! Master the basics one flip at a time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {flashcards.map((card) => (
              <div
                key={card.id}
                className="h-64"
              >
                {/* Commented out flip container - showing static front side */}
                {/* <div className="card-flip-inner"> */}
                  {/* Front of card - now static */}
                  <div className={`bg-gradient-to-br ${card.front.color} glow-effect hover:scale-105 transition-all duration-300 text-center h-full rounded-20 flex flex-col justify-center items-center p-6`}>
                    <div className="text-white mb-4">
                      {card.front.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{card.front.title}</h3>
                    <div className="mt-auto flex items-center gap-2 text-white/80 text-sm">
                      {/* <RotateCcw className="w-4 h-4" /> */}
                      {/* Click to flip */}
                    </div>
                  </div>

                  {/* Back of card - commented out */}
                  {/* <div className="card-flip-back card hover:scale-105 transition-all duration-300">
                    <div className="h-full flex flex-col justify-center text-center">
                      <p className="mb-4 leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                        {card.back.content}
                      </p>
                      <div className="glass-morphism p-4 rounded-lg mt-4">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-accent)' }}>
                          💡 Example: {card.back.example}
                        </p>
                      </div>
                    </div>
                  </div> */}
                {/* </div> */}
              </div>
            ))}
          </div>
        </section>

        {/* Fun Facts Ticker */}
        <section className="mb-20">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gradient mb-4">🎉 Fun Trading Facts</h2>
          </div>
          
          <div className="glass-morphism rounded-2xl p-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funFacts.map((fact, index) => (
                <div key={index} className="text-center p-6 rounded-xl hover:bg-white/5 transition-all duration-300">
                  <div className="text-4xl mb-4">{fact.icon}</div>
                  <p style={{ color: 'var(--text-secondary)' }}>{fact.fact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Risk Levels Visual */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">⚖️ Risk Levels Explained</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Different risk levels for different goals and comfort zones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {riskLevels.map((risk, index) => (
              <div key={index} className="card hover:scale-105 transition-all duration-300">
                <div className="card-body p-8 text-center">
                  <div className="text-4xl mb-4">
                    {index === 0 ? '🛡️' : index === 1 ? '⚖️' : '🚀'}
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {risk.level}
                  </h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${risk.color} mb-4 inline-block`}>
                    {risk.risk}
                  </span>
                  <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {risk.description}
                  </p>
                  <div className="glass-morphism p-3 rounded-lg">
                    <p className="text-sm" style={{ color: 'var(--text-accent)' }}>
                      Examples: {risk.example}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Tips Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">🎯 Quick Pro Tips</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {quickTips.map((tip, index) => (
              <div key={index} className="card hover:scale-105 transition-all duration-300 group">
                <div className="card-body p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg glow-effect group-hover:scale-110 transition-transform" style={{ background: 'var(--gradient-primary)' }}>
                      <div style={{ color: 'var(--text-primary)' }}>
                        {tip.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {tip.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Chart Types */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">📊 Chart Types Made Simple</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="card-body p-8 text-center">
                <LineChart className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-accent)' }} />
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  📈 Line Charts
                </h3>
                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Shows price movement over time. Simple and clean for spotting trends.
                </p>
                <div className="glass-morphism p-4 rounded-lg">
                  <p className="text-sm" style={{ color: 'var(--text-accent)' }}>
                    💡 Best for: Long-term trend analysis
                  </p>
                </div>
              </div>
            </div>

            <div className="card hover:scale-105 transition-all duration-300">
              <div className="card-body p-8 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-accent)' }} />
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  🕯️ Candlestick Charts
                </h3>
                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Shows open, high, low, and close prices. Like X-ray vision for stocks!
                </p>
                <div className="glass-morphism p-4 rounded-lg">
                  <p className="text-sm" style={{ color: 'var(--text-accent)' }}>
                    💡 Best for: Detailed technical analysis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Learning Hub */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">🎬 Video Learning Hub</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Visual learning with animated explanations and expert insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Animated Concepts */}
            <div className="card hover:scale-105 transition-all duration-300 group">
              <div className="card-body p-6">
                <div className="relative mb-4">
                  <div className="w-full h-40 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    NEW
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  📊 How Markets Work
                </h3>
                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Animated 3-minute explanation of supply, demand, and price movement
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Duration: 3:24</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">Beginner</span>
                </div>
              </div>
            </div>

            {/* Expert Interview */}
            <div className="card hover:scale-105 transition-all duration-300 group">
              <div className="card-body p-6">
                <div className="relative mb-4">
                  <div className="w-full h-40 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  🎤 Warren Buffett's Wisdom
                </h3>
                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Key insights from the legendary investor's best advice
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Duration: 8:15</span>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">All Levels</span>
                </div>
              </div>
            </div>

            {/* Technical Analysis */}
            <div className="card hover:scale-105 transition-all duration-300 group">
              <div className="card-body p-6">
                <div className="relative mb-4">
                  <div className="w-full h-40 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  📈 Reading Chart Patterns
                </h3>
                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Learn to identify support, resistance, and trend patterns
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Duration: 12:30</span>
                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Advanced</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Learning Games */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">🎮 Interactive Learning</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Learn by doing with our interactive simulations and games
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Trading Simulator */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="card-body p-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--gradient-primary)' }}>
                    <Zap className="w-10 h-10" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    📊 Trading Simulator
                  </h3>
                  <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Practice trading with $100,000 virtual money using real market data
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: 'var(--text-accent)' }}>$100K</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Virtual Cash</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>Real Data</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Live Prices</div>
                    </div>
                  </div>
                  <button className="btn-primary w-full">Start Trading Practice</button>
                </div>
              </div>
            </div>

            {/* Quiz Challenge */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="card-body p-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--gradient-secondary)' }}>
                    <Brain className="w-10 h-10" style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    🧠 Knowledge Quiz
                  </h3>
                  <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Test your knowledge and earn badges as you progress through levels
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: 'var(--text-accent)' }}>50+</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>12</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Badges</div>
                    </div>
                  </div>
                  <button className="btn-primary w-full">Start Quiz Challenge</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Paths */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">🗺️ Learning Paths</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Structured learning journeys from beginner to expert
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Beginner Path */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="card-body p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Beginner Path</h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>8 lessons • 2 hours</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>What are stocks?</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>How to read prices</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Making your first trade</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Risk management basics</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                    <span style={{ color: 'var(--text-accent)' }}>25%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                <button className="btn-secondary w-full">Continue Learning</button>
              </div>
            </div>

            {/* Intermediate Path */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="card-body p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Intermediate Path</h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>12 lessons • 4 hours</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Technical analysis</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Chart patterns</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Fundamental analysis</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Portfolio strategies</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                    <span style={{ color: 'var(--text-accent)' }}>0%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                <button className="btn-secondary w-full opacity-50 cursor-not-allowed" disabled>
                  Complete Beginner First
                </button>
              </div>
            </div>

            {/* Expert Path */}
            <div className="card hover:scale-105 transition-all duration-300">
              <div className="card-body p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Expert Path</h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>15 lessons • 6 hours</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Advanced strategies</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Options trading</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Risk management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Professional tactics</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                    <span style={{ color: 'var(--text-accent)' }}>0%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                <button className="btn-secondary w-full opacity-50 cursor-not-allowed" disabled>
                  Complete Previous Paths
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Achievement System */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">🏆 Your Achievements</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Unlock badges and track your learning progress
            </p>
          </div>

          <div className="card max-w-4xl mx-auto">
            <div className="card-body p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>First Steps</h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Complete your first lesson</p>
                </div>

                <div className="text-center opacity-50">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-gray-600">
                    <Brain className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-bold" style={{ color: 'var(--text-secondary)' }}>Knowledge Seeker</h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Complete 5 lessons</p>
                </div>

                <div className="text-center opacity-50">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-gray-600">
                    <Target className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-bold" style={{ color: 'var(--text-secondary)' }}>Quiz Master</h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Score 90% on a quiz</p>
                </div>

                <div className="text-center opacity-50">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-gray-600">
                    <Award className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-bold" style={{ color: 'var(--text-secondary)' }}>Trading Pro</h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Complete expert path</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="card max-w-4xl mx-auto">
            <div className="card-body text-center p-12">
              <div className="text-6xl mb-6">🎓</div>
              <h2 className="text-4xl font-bold text-gradient mb-6">
                Ready to Put Your Knowledge to Work?
              </h2>
              <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
                You've learned the basics! Now it's time to start your trading journey with Sky.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="btn-primary px-10 py-4 text-lg hover:scale-105 transition-all duration-300">
                  <span className="flex items-center justify-center gap-3">
                    <Play className="w-6 h-6" />
                    Start Trading Now
                    <ArrowRight className="w-6 h-6" />
                  </span>
                </button>
                
                <button className="btn-secondary px-10 py-4 text-lg hover:scale-105 transition-all duration-300">
                  <span className="flex items-center justify-center gap-3">
                    <BookOpen className="w-6 h-6" />
                    Practice Mode
                    <ChevronRight className="w-6 h-6" />
                  </span>
                </button>
              </div>
              
              <div className="mt-8 text-sm" style={{ color: 'var(--text-muted)' }}>
                💡 Start with virtual money to practice risk-free!
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}