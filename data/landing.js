import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "50+",
    label: "Active Users",
  },
  {
    value: "₹1K+",
    label: "Transactions Tracked",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "5/5",
    label: "User Rating",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <Receipt className="h-8 w-8 text-blue-600" />,
    title: "Smart Receipt Scanner",
    description:
      "Extract data automatically from receipts using advanced AI technology",
  },

  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "InsightIQ Dashboard",
    description:
      "Dive deep into spending trends and uncover hidden patterns with smart, AI-driven analytics.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Unified Account Hub",
    description:
      "Bring every bank account and card together in one seamless, easy-to-use interface.",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Currency Compass",
    description:
      "Seamlessly handle multiple currencies with real-time rate conversions and live updates.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "AutoAdvisor",
    description:
      "Get personalized financial tips and automated recommendations based on your habits.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Budget Blueprint",
    description:
      "Craft, track, and optimize budgets effortlessly with intelligent, AI-backed guidance.",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Sign Up Instantly",
    description:
      "Create your FINOVA account in seconds—no paperwork, just a secure email or mobile OTP.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Link & Auto-Sync",
    description:
      "Connect your bank, UPI apps and wallets to automatically pull in transactions in real time.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Smart Insights & Goals",
    description:
      "Get AI-powered recommendations, set savings targets and watch your finances grow effortlessly.",
  },
];

// Testimonials Data
export const testimonialsData = [
  {
    name: "Neha Sharma",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/42.jpg",
    quote:
      "Finova has revolutionised the way I handle my business finances. The AI-driven insights helped me uncover savings I would’ve completely missed.",
  },
  {
    name: "Rohan Mehta",
    role: "Freelance Designer",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    quote:
      "The automatic receipt scanner is a game changer. I save hours every month and can now focus on my design work without getting bogged down by expenses.",
  },
  {
    name: "Priya Iyer",
    role: "Investment Consultant",
    image: "https://randomuser.me/api/portraits/women/50.jpg",
    quote:
      "I recommend Finova to my clients, especially those managing overseas portfolios. The multi-currency support and granular analytics are spot-on for global investors.",
  },
];
