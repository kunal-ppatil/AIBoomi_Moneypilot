# 💰 MoneyPilot - AI-Powered Investment Planning Platform

A premium fintech web application that provides personalized investment planning using AI-powered insights, real-time calculations, and secure data persistence.

![MoneyPilot](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-18%2B-green)

## ✨ Features

### 🎯 Core Functionality
- **Multi-Step Wizard**: Intuitive 3-step process to collect financial data
- **Investment Readiness Score**: 4-factor analysis (Savings Rate, Emergency Fund, Monthly Surplus, Expense Control)
- **Smart Asset Allocation**: Age, risk profile, and investment horizon-based recommendations
- **Accurate SIP Calculations**: Realistic monthly investment amounts using compound interest formulas
- **Goal Tracking**: Multiple financial goals with feasibility analysis

### 🤖 AI-Powered Features
- **Personalized Explanations**: Learn More buttons provide 200-250 word detailed explanations
- **Deep Analysis**: Comprehensive 800-1000 word financial reports with specific recommendations
- **Action Plans**: AI-generated 3-step action plans tailored to user's situation

### 🔐 Security & Authentication
- **Supabase Authentication**: Secure email/password authentication
- **Row Level Security**: Database policies ensure users only access their own data
- **Session Management**: Persistent sessions with automatic logout
- **Environment Variables**: Secure API key management

### 💾 Data Persistence
- **Supabase Database**: Cloud-based PostgreSQL database
- **Real-time Sync**: Automatic data saving across wizard steps
- **Cross-device Access**: Access your data from any device

### 🎨 Premium Design
- **Glassmorphism UI**: Modern, premium fintech aesthetic
- **Dark Mode**: Eye-friendly dark theme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Engaging micro-interactions and transitions
- **3D Background**: Dynamic Three.js particle background

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)
- Gemini API key (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/moneypilot.git
cd moneypilot
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**
- Go to your Supabase project → SQL Editor
- Run the SQL schema from `supabase_schema.sql`
- Disable email confirmation: Authentication → Providers → Email → Turn off "Confirm email"

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3001` 🎉

## 📁 Project Structure

```
moneypilot/
├── src/
│   ├── config/
│   │   └── env.js              # Environment configuration
│   ├── logic/
│   │   └── calculator.js       # Advanced financial calculations
│   ├── services/
│   │   ├── ai.js              # Gemini AI integration
│   │   ├── supabase.js        # Supabase client & services
│   │   └── storage.js         # Legacy storage (deprecated)
│   ├── ui/
│   │   ├── wizard.js          # Multi-step wizard logic
│   │   └── results.js         # Results dashboard
│   ├── styles/
│   │   ├── main.css           # Global styles
│   │   ├── hero.css           # Landing page styles
│   │   └── results.css        # Results page styles
│   ├── main.js                # Landing page entry
│   └── app.js                 # App page entry
├── index.html                  # Landing page
├── app.html                    # Application page
├── supabase_schema.sql         # Database schema
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies
└── vite.config.js              # Vite configuration
```

## 🧮 Financial Calculations

### Investment Readiness Score (0-100)
Calculated from 4 factors:
- **Savings Rate** (0-30 points): Monthly surplus as % of income
- **Emergency Fund** (0-35 points): Months of expenses covered
- **Monthly Surplus** (0-20 points): Absolute surplus amount
- **Expense Control** (0-15 points): Expense ratio

### Asset Allocation Algorithm
```
Base Allocation (by risk profile):
- Conservative: 20% Equity, 65% Debt, 15% Gold
- Balanced: 50% Equity, 35% Debt, 15% Gold
- Aggressive: 75% Equity, 15% Debt, 10% Gold

Age Adjustments:
- Age < 30: +10% Equity, -10% Debt
- Age > 50: -15% Equity, +15% Debt

Horizon Adjustments:
- < 3 years: -20% Equity, +20% Debt
- > 10 years: +10% Equity, -10% Debt
```

### SIP Calculation
Uses compound interest formula:
```
P = FV / [((1+r)^n - 1) / r × (1+r)]

Where:
- P = Monthly SIP amount
- FV = Future Value (goal amount)
- r = Monthly return rate
- n = Number of months

Expected Returns:
- Conservative: 8% p.a.
- Balanced: 11% p.a.
- Aggressive: 13% p.a.
```

## 🔧 Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build Tool**: Vite
- **3D Graphics**: Three.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini 1.5 Flash
- **Hosting**: Vercel / Netlify (recommended)

## 🌐 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Environment Variables
Make sure to add these in your hosting platform:
- `VITE_GEMINI_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📊 Database Schema

### `financial_plans` Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- personal (JSONB) - age, income, expenses, savings
- goals (JSONB) - array of financial goals
- preferences (JSONB) - risk, experience, etc.
- created_at, updated_at (Timestamps)
```

### `calculation_results` Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- results (JSONB) - calculated results
- created_at, updated_at (Timestamps)
```

## 🔐 Security Features

- ✅ Environment variables for sensitive data
- ✅ Row Level Security (RLS) policies
- ✅ Secure authentication with Supabase
- ✅ HTTPS-only in production
- ✅ No sensitive data in client-side code
- ✅ API keys never committed to Git

## 🎨 Design Philosophy

MoneyPilot follows modern fintech design principles:
- **Premium Aesthetics**: Glassmorphism, gradients, and smooth animations
- **User-Centric**: Clear information hierarchy and intuitive flows
- **Trustworthy**: Professional design builds confidence
- **Accessible**: High contrast, readable fonts, clear CTAs

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Gemini AI** for powering intelligent financial insights
- **Supabase** for backend infrastructure
- **Three.js** for beautiful 3D backgrounds
- **Vite** for lightning-fast development

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for smarter financial planning**
