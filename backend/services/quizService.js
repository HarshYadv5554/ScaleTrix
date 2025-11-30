// Quiz questions and logic
const QUIZ_QUESTIONS = [
  {
    number: 1,
    question: "What is the size of your home?",
    options: [
      { key: "A", value: "Small (1-2 bedrooms, apartment)", score: { starter: 3, basic: 2, advanced: 1, standard: 0, professional: 0, premium: 0, enterprise: 0, ultimate: 0 } },
      { key: "B", value: "Medium (3-4 bedrooms, house)", score: { starter: 1, basic: 2, advanced: 3, standard: 2, professional: 1, premium: 0, enterprise: 0, ultimate: 0 } },
      { key: "C", value: "Large (5+ bedrooms, mansion)", score: { starter: 0, basic: 0, advanced: 1, standard: 2, professional: 3, premium: 2, enterprise: 3, ultimate: 3 } }
    ]
  },
  {
    number: 2,
    question: "What is your primary security concern?",
    options: [
      { key: "A", value: "Burglary/Theft", score: { starter: 2, basic: 3, advanced: 2, standard: 2, professional: 1, premium: 1, enterprise: 1, ultimate: 0 } },
      { key: "B", value: "Fire/Smoke detection", score: { starter: 1, basic: 1, advanced: 2, standard: 3, professional: 2, premium: 2, enterprise: 2, ultimate: 2 } },
      { key: "C", value: "Comprehensive protection (all threats)", score: { starter: 0, basic: 0, advanced: 1, standard: 1, professional: 2, premium: 3, enterprise: 3, ultimate: 3 } }
    ]
  },
  {
    number: 3,
    question: "Do you need remote monitoring capabilities?",
    options: [
      { key: "A", value: "Yes, I want to monitor from anywhere via app", score: { starter: 0, basic: 1, advanced: 2, standard: 3, professional: 3, premium: 3, enterprise: 3, ultimate: 3 } },
      { key: "B", value: "Basic notifications are enough", score: { starter: 3, basic: 3, advanced: 2, standard: 1, professional: 1, premium: 0, enterprise: 0, ultimate: 0 } },
      { key: "C", value: "Not necessary", score: { starter: 2, basic: 2, advanced: 1, standard: 1, professional: 0, premium: 0, enterprise: 0, ultimate: 0 } }
    ]
  },
  {
    number: 4,
    question: "What is your budget range?",
    options: [
      { key: "A", value: "Under ₹40,000", score: { starter: 3, basic: 2, advanced: 1, standard: 0, professional: 0, premium: 0, enterprise: 0, ultimate: 0 } },
      { key: "B", value: "₹40,000 - ₹1,25,000", score: { starter: 1, basic: 2, advanced: 3, standard: 3, professional: 2, premium: 1, enterprise: 0, ultimate: 0 } },
      { key: "C", value: "Above ₹1,25,000", score: { starter: 0, basic: 0, advanced: 1, standard: 1, professional: 2, premium: 3, enterprise: 3, ultimate: 3 } }
    ]
  },
  {
    number: 5,
    question: "Do you need professional monitoring services?",
    options: [
      { key: "A", value: "Yes, 24/7 professional monitoring", score: { starter: 0, basic: 0, advanced: 1, standard: 2, professional: 3, premium: 3, enterprise: 3, ultimate: 3 } },
      { key: "B", value: "Self-monitoring is fine", score: { starter: 3, basic: 3, advanced: 2, standard: 2, professional: 1, premium: 1, enterprise: 0, ultimate: 0 } },
      { key: "C", value: "Not sure yet", score: { starter: 2, basic: 2, advanced: 2, standard: 2, professional: 2, premium: 2, enterprise: 2, ultimate: 2 } }
    ]
  },
  {
    number: 6,
    question: "What type of installation do you prefer?",
    options: [
      { key: "A", value: "DIY installation (easy setup)", score: { starter: 3, basic: 3, advanced: 2, standard: 2, professional: 1, premium: 1, enterprise: 0, ultimate: 0 } },
      { key: "B", value: "Professional installation", score: { starter: 0, basic: 0, advanced: 1, standard: 2, professional: 3, premium: 3, enterprise: 3, ultimate: 3 } },
      { key: "C", value: "Either works", score: { starter: 2, basic: 2, advanced: 2, standard: 2, professional: 2, premium: 2, enterprise: 2, ultimate: 2 } }
    ]
  }
];

// Product recommendations - All prices above ₹10,000
const PRODUCTS = {
  starter: {
    name: "SecureHome Starter Package",
    price: 15999,
    description: "Entry-level security for small spaces",
    features: [
      "1 Door/Window Sensor",
      "1 Motion Detector",
      "1 Smart Hub",
      "Mobile App Access",
      "Basic Alerts",
      "DIY Installation"
    ]
  },
  basic: {
    name: "SecureHome Basic Package",
    price: 24999,
    description: "Essential security for small homes",
    features: [
      "2 Door/Window Sensors",
      "1 Motion Detector",
      "1 Smart Hub",
      "Mobile App Access",
      "Basic Alerts",
      "Email Notifications"
    ]
  },
  advanced: {
    name: "SecureHome Advanced Package",
    price: 39999,
    description: "Enhanced protection for growing families",
    features: [
      "4 Door/Window Sensors",
      "2 Motion Detectors",
      "1 Security Camera",
      "1 Smart Hub",
      "Mobile App with Live View",
      "Cloud Storage (3 days)",
      "Smart Home Integration"
    ]
  },
  standard: {
    name: "SecureHome Standard Package",
    price: 74999,
    description: "Comprehensive protection for medium homes",
    features: [
      "6 Door/Window Sensors",
      "3 Motion Detectors",
      "2 Security Cameras",
      "1 Smart Hub",
      "Mobile App with Live View",
      "Cloud Storage (7 days)",
      "Smart Home Integration",
      "Professional Installation Available"
    ]
  },
  professional: {
    name: "SecureHome Professional Package",
    price: 99999,
    description: "Professional-grade security solution",
    features: [
      "8 Door/Window Sensors",
      "4 Motion Detectors",
      "3 HD Security Cameras",
      "1 Advanced Smart Hub",
      "Professional Monitoring (6 months)",
      "Mobile App with AI Features",
      "Cloud Storage (14 days)",
      "Full Smart Home Integration",
      "Smoke/CO Detectors"
    ]
  },
  premium: {
    name: "SecureHome Premium Package",
    price: 166999,
    description: "Ultimate security solution for large properties",
    features: [
      "12 Door/Window Sensors",
      "6 Motion Detectors",
      "4 HD Security Cameras",
      "1 Advanced Smart Hub",
      "Professional Monitoring (1 year)",
      "Mobile App with AI Features",
      "Cloud Storage (30 days)",
      "Full Smart Home Integration",
      "Smoke/CO Detectors",
      "Water Leak Sensors"
    ]
  },
  enterprise: {
    name: "SecureHome Enterprise Package",
    price: 199999,
    description: "Enterprise-level security for estates",
    features: [
      "16 Door/Window Sensors",
      "8 Motion Detectors",
      "6 HD Security Cameras",
      "2 Advanced Smart Hubs",
      "24/7 Professional Monitoring (1 year)",
      "Mobile App with Advanced AI",
      "Cloud Storage (60 days)",
      "Full Smart Home Integration",
      "Smoke/CO Detectors",
      "Water Leak Sensors",
      "Environmental Sensors",
      "Professional Installation Included"
    ]
  },
  ultimate: {
    name: "SecureHome Ultimate Package",
    price: 249999,
    description: "The most comprehensive security solution",
    features: [
      "20 Door/Window Sensors",
      "10 Motion Detectors",
      "8 4K Security Cameras",
      "2 Advanced Smart Hubs",
      "24/7 Premium Professional Monitoring (2 years)",
      "Mobile App with AI & Analytics",
      "Cloud Storage (90 days)",
      "Full Smart Home Integration",
      "Smoke/CO Detectors",
      "Water Leak Sensors",
      "Environmental Sensors",
      "Panic Button",
      "Professional Installation & Setup",
      "Dedicated Support"
    ]
  }
};

class QuizService {
  static getQuestion(questionNumber) {
    return QUIZ_QUESTIONS.find(q => q.number === questionNumber);
  }

  static getTotalQuestions() {
    return QUIZ_QUESTIONS.length;
  }

  static formatQuestion(questionNumber) {
    const question = this.getQuestion(questionNumber);
    if (!question) return null;

    let message = `*Question ${question.number}/6:*\n\n${question.question}\n\n`;
    question.options.forEach(option => {
      message += `${option.key}. ${option.value}\n`;
    });
    message += `\nPlease reply with the letter (A, B, or C)`;

    return message;
  }

  static calculateRecommendation(answers) {
    const scores = {
      starter: 0,
      basic: 0,
      advanced: 0,
      standard: 0,
      professional: 0,
      premium: 0,
      enterprise: 0,
      ultimate: 0
    };

    answers.forEach((answer, index) => {
      const question = QUIZ_QUESTIONS[index];
      const selectedOption = question.options.find(opt => opt.key === answer);
      
      if (selectedOption) {
        scores.starter += selectedOption.score.starter || 0;
        scores.basic += selectedOption.score.basic || 0;
        scores.advanced += selectedOption.score.advanced || 0;
        scores.standard += selectedOption.score.standard || 0;
        scores.professional += selectedOption.score.professional || 0;
        scores.premium += selectedOption.score.premium || 0;
        scores.enterprise += selectedOption.score.enterprise || 0;
        scores.ultimate += selectedOption.score.ultimate || 0;
      }
    });

    // Determine recommendation based on highest score
    let recommendation = 'starter';
    let maxScore = scores.starter;

    const productKeys = ['starter', 'basic', 'advanced', 'standard', 'professional', 'premium', 'enterprise', 'ultimate'];
    
    productKeys.forEach(key => {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        recommendation = key;
      }
    });

    const product = PRODUCTS[recommendation];
    
    // Generate reason based on product tier
    const reasons = [];
    if (recommendation === 'ultimate' || recommendation === 'enterprise') {
      reasons.push("Your requirements indicate you need the most comprehensive security coverage");
      reasons.push("You prefer premium professional monitoring and installation");
      reasons.push("Your budget allows for the most advanced features and support");
    } else if (recommendation === 'premium' || recommendation === 'professional') {
      reasons.push("Your home size and needs match our high-end packages");
      reasons.push("You want professional-grade security with advanced features");
      reasons.push("You value comprehensive protection and monitoring");
    } else if (recommendation === 'standard' || recommendation === 'advanced') {
      reasons.push("Your home size and needs match our mid-range packages");
      reasons.push("You want a good balance of features and value");
      reasons.push("You need reliable security with modern capabilities");
    } else {
      reasons.push("Perfect for your home size and budget");
      reasons.push("Essential security features at an affordable price");
      reasons.push("Great starting point for home security");
    }

    return {
      product: product,
      reason: reasons.join(". ") + ".",
      scores: scores
    };
  }

  static formatRecommendation(recommendation) {
    const { product, reason } = recommendation;
    
    let message = `*🏠 Your Personalized Security Recommendation*\n\n`;
    message += `*${product.name}*\n`;
    message += `💰 Price: ₹${product.price.toLocaleString('en-IN')}\n\n`;
    message += `*Why this package?*\n${reason}\n\n`;
    message += `*Features included:*\n`;
    product.features.forEach(feature => {
      message += `✓ ${feature}\n`;
    });
    message += `\nThank you for taking our quiz! 🎉\n`;
    message += `Reply *START* anytime to take the quiz again.`;

    return message;
  }
}

export default QuizService;
