export type Language = 'en' | 'as' | 'hi';

export const translations = {
  en: {
    // App
    appName: 'Tea-Shield',
    tagline: 'Protect Your Tea Garden',
    
    // Home
    welcomeTitle: 'Tea Leaf Disease Detection',
    welcomeSubtitle: 'Take a photo or upload an image of your tea leaf to detect diseases',
    capturePhoto: 'Capture Photo',
    uploadImage: 'Upload Image',
    howItWorks: 'How It Works',
    step1Title: 'Take Photo',
    step1Desc: 'Capture a clear image of the tea leaf',
    step2Title: 'Analysis',
    step2Desc: 'Our system analyzes color patterns',
    step3Title: 'Results',
    step3Desc: 'Get diagnosis with treatment plan',
    
    // Diseases
    redRust: 'Red Rust',
    brownBlight: 'Brown Blight',
    blisterBlight: 'Blister / White Blight',
    healthy: 'Healthy',
    uncertain: 'Uncertain',
    
    // Results
    analysisResults: 'Analysis Results',
    detectedDisease: 'Detected Disease',
    severity: 'Severity',
    severityLow: 'Low',
    severityMedium: 'Medium',
    severityHigh: 'High',
    confidence: 'Confidence',
    infectedArea: 'Infected Area',
    
    // Treatment
    treatmentPlan: 'Treatment Plan',
    timing: 'Best Timing',
    lowCostInputs: 'Low-Cost Inputs',
    preventionTips: 'Prevention Tips',
    step: 'Step',
    
    // Advice
    advice: 'Recommended Action',
    adviceHighConfidence: 'You can act immediately based on this result.',
    adviceMediumConfidence: 'Recheck the leaf after 2-3 days for confirmation.',
    adviceLowConfidence: 'Please take another photo or consult an expert.',
    
    // Actions
    analyzeAnother: 'Analyze Another',
    askChatbot: 'Ask Assistant',
    retake: 'Retake Photo',
    
    // Camera
    cameraTitle: 'Position the Leaf',
    cameraHint: 'Make sure the leaf is well-lit and in focus',
    capture: 'Capture',
    cancel: 'Cancel',
    
    // Chatbot
    chatbotTitle: 'Assistant',
    chatbotWelcome: 'Hello! I am here to help you understand your results. Ask me anything!',
    typeMessage: 'Type your question...',
    send: 'Send',
    
    // Language
    language: 'Language',
    
    // Weather
    weather: 'Today\'s Weather',
    weatherGood: 'Good for tea plants',
    weatherModerate: 'Monitor your plants',
    weatherBad: 'Risk of disease spread',
    temperature: 'Temperature',
    humidity: 'Humidity',
    conditions: 'Conditions',
    teaAdvice: 'Tea Garden Advice',
    
    // Errors
    noLeafDetected: 'No leaf detected in the image. Please try again.',
    processingError: 'Error processing image. Please try again.',
    uncertainResult: 'Uncertain — Please recheck the image',
    
    // Info
    leafPixels: 'Leaf pixels analyzed',
    processingTime: 'Processing time',
  },
  
  as: {
    // App
    appName: 'টি-শ্বিল্ড',
    tagline: 'আপোনাৰ চাহ বাগিচা সুৰক্ষিত কৰক',
    
    // Home
    welcomeTitle: 'চাহ পাতৰ ৰোগ চিনাক্তকৰণ',
    welcomeSubtitle: 'ৰোগ চিনাক্ত কৰিবলৈ আপোনাৰ চাহ পাতৰ ফটো তুলক বা আপলোড কৰক',
    capturePhoto: 'ফটো তোলক',
    uploadImage: 'ছবি আপলোড কৰক',
    howItWorks: 'কেনেকৈ কাম কৰে',
    step1Title: 'ফটো তোলক',
    step1Desc: 'চাহ পাতৰ স্পষ্ট ছবি তোলক',
    step2Title: 'বিশ্লেষণ',
    step2Desc: 'আমাৰ ব্যৱস্থাই ৰঙৰ আৰ্হি বিশ্লেষণ কৰে',
    step3Title: 'ফলাফল',
    step3Desc: 'চিকিৎসা পৰিকল্পনাসহ নিদান পাওক',
    
    // Diseases
    redRust: 'ৰঙা মামৰ',
    brownBlight: 'বাদামী ব্লাইট',
    blisterBlight: 'ব্লিষ্টাৰ / বগা ব্লাইট',
    healthy: 'স্বাস্থ্যকৰ',
    uncertain: 'অনিশ্চিত',
    
    // Results
    analysisResults: 'বিশ্লেষণৰ ফলাফল',
    detectedDisease: 'চিনাক্ত ৰোগ',
    severity: 'গুৰুত্ব',
    severityLow: 'কম',
    severityMedium: 'মধ্যম',
    severityHigh: 'বেছি',
    confidence: 'আত্মবিশ্বাস',
    infectedArea: 'সংক্ৰমিত অঞ্চল',
    
    // Treatment
    treatmentPlan: 'চিকিৎসা পৰিকল্পনা',
    timing: 'উত্তম সময়',
    lowCostInputs: 'কম খৰচী সামগ্ৰী',
    preventionTips: 'প্ৰতিৰোধ টিপছ',
    step: 'পদক্ষেপ',
    
    // Advice
    advice: 'পৰামৰ্শিত কাৰ্য',
    adviceHighConfidence: 'আপুনি এই ফলাফলৰ ওপৰত ভিত্তি কৰি তৎক্ষণাত কাম কৰিব পাৰে।',
    adviceMediumConfidence: 'নিশ্চিতকৰণৰ বাবে ২-৩ দিনৰ পিছত পাত পুনৰ পৰীক্ষা কৰক।',
    adviceLowConfidence: 'অনুগ্ৰহ কৰি আন এখন ফটো তুলক বা বিশেষজ্ঞৰ পৰামৰ্শ লওক।',
    
    // Actions
    analyzeAnother: 'আন এটা বিশ্লেষণ',
    askChatbot: 'সহায়কক সুধক',
    retake: 'পুনৰ ফটো তোলক',
    
    // Camera
    cameraTitle: 'পাত স্থাপন কৰক',
    cameraHint: 'পাতত ভাল পোহৰ আছে আৰু ফোকাছত আছে নিশ্চিত কৰক',
    capture: 'কেপচাৰ',
    cancel: 'বাতিল',
    
    // Chatbot
    chatbotTitle: 'সহায়ক',
    chatbotWelcome: 'নমস্কাৰ! মই আপোনাক আপোনাৰ ফলাফল বুজাত সহায় কৰিবলৈ ইয়াত আছোঁ। মোক যিকোনো কথা সুধক!',
    typeMessage: 'আপোনাৰ প্ৰশ্ন লিখক...',
    send: 'পঠাওক',
    
    // Language
    language: 'ভাষা',
    
    // Weather
    weather: 'আজিৰ বতৰ',
    weatherGood: 'চাহ গছৰ বাবে ভাল',
    weatherModerate: 'আপোনাৰ গছ নিৰীক্ষণ কৰক',
    weatherBad: 'ৰোগ বিয়পাৰ আশংকা',
    temperature: 'তাপমাত্ৰা',
    humidity: 'আৰ্দ্ৰতা',
    conditions: 'অৱস্থা',
    teaAdvice: 'চাহ বাগিচাৰ পৰামৰ্শ',
    
    // Errors
    noLeafDetected: 'ছবিত কোনো পাত ধৰা পৰা নাই। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।',
    processingError: 'ছবি প্ৰক্ৰিয়াকৰণত ত্ৰুটি। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।',
    uncertainResult: 'অনিশ্চিত — অনুগ্ৰহ কৰি ছবি পুনৰ পৰীক্ষা কৰক',
    
    // Info
    leafPixels: 'বিশ্লেষণ কৰা পাতৰ পিক্সেল',
    processingTime: 'প্ৰক্ৰিয়াকৰণ সময়',
  },
  
  hi: {
    // App
    appName: 'टी-शील्ड',
    tagline: 'अपने चाय बागान की सुरक्षा करें',
    
    // Home
    welcomeTitle: 'चाय पत्ती रोग पहचान',
    welcomeSubtitle: 'रोग का पता लगाने के लिए अपनी चाय पत्ती की फोटो लें या अपलोड करें',
    capturePhoto: 'फोटो लें',
    uploadImage: 'छवि अपलोड करें',
    howItWorks: 'यह कैसे काम करता है',
    step1Title: 'फोटो लें',
    step1Desc: 'चाय पत्ती की स्पष्ट छवि लें',
    step2Title: 'विश्लेषण',
    step2Desc: 'हमारी प्रणाली रंग पैटर्न का विश्लेषण करती है',
    step3Title: 'परिणाम',
    step3Desc: 'उपचार योजना के साथ निदान प्राप्त करें',
    
    // Diseases
    redRust: 'लाल जंग',
    brownBlight: 'भूरा ब्लाइट',
    blisterBlight: 'ब्लिस्टर / सफेद ब्लाइट',
    healthy: 'स्वस्थ',
    uncertain: 'अनिश्चित',
    
    // Results
    analysisResults: 'विश्लेषण परिणाम',
    detectedDisease: 'पहचाना गया रोग',
    severity: 'गंभीरता',
    severityLow: 'कम',
    severityMedium: 'मध्यम',
    severityHigh: 'अधिक',
    confidence: 'विश्वास',
    infectedArea: 'संक्रमित क्षेत्र',
    
    // Treatment
    treatmentPlan: 'उपचार योजना',
    timing: 'सबसे अच्छा समय',
    lowCostInputs: 'कम लागत वाली सामग्री',
    preventionTips: 'रोकथाम सुझाव',
    step: 'चरण',
    
    // Advice
    advice: 'अनुशंसित कार्रवाई',
    adviceHighConfidence: 'आप इस परिणाम के आधार पर तुरंत कार्रवाई कर सकते हैं।',
    adviceMediumConfidence: 'पुष्टि के लिए 2-3 दिन बाद पत्ती की दोबारा जांच करें।',
    adviceLowConfidence: 'कृपया एक और फोटो लें या किसी विशेषज्ञ से परामर्श करें।',
    
    // Actions
    analyzeAnother: 'एक और विश्लेषण',
    askChatbot: 'सहायक से पूछें',
    retake: 'फिर से फोटो लें',
    
    // Camera
    cameraTitle: 'पत्ती को रखें',
    cameraHint: 'सुनिश्चित करें कि पत्ती अच्छी रोशनी में और फोकस में है',
    capture: 'कैप्चर',
    cancel: 'रद्द करें',
    
    // Chatbot
    chatbotTitle: 'सहायक',
    chatbotWelcome: 'नमस्ते! मैं आपके परिणामों को समझने में आपकी मदद करने के लिए यहां हूं। मुझसे कुछ भी पूछें!',
    typeMessage: 'अपना प्रश्न लिखें...',
    send: 'भेजें',
    
    // Language
    language: 'भाषा',
    
    // Weather
    weather: 'आज का मौसम',
    weatherGood: 'चाय पौधों के लिए अच्छा',
    weatherModerate: 'अपने पौधों की निगरानी करें',
    weatherBad: 'रोग फैलने का खतरा',
    temperature: 'तापमान',
    humidity: 'नमी',
    conditions: 'स्थिति',
    teaAdvice: 'चाय बागान सलाह',
    
    // Errors
    noLeafDetected: 'छवि में कोई पत्ती नहीं मिली। कृपया पुनः प्रयास करें।',
    processingError: 'छवि प्रोसेसिंग में त्रुटि। कृपया पुनः प्रयास करें।',
    uncertainResult: 'अनिश्चित — कृपया छवि की दोबारा जांच करें',
    
    // Info
    leafPixels: 'विश्लेषित पत्ती पिक्सेल',
    processingTime: 'प्रोसेसिंग समय',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key] || translations.en[key];
}
