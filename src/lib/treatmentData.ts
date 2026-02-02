import { DiseaseType } from './diseaseAnalyzer';
import { Language } from './translations';

export interface TreatmentStep {
  title: string;
  description: string;
}

export interface TreatmentInfo {
  steps: TreatmentStep[];
  timing: string;
  lowCostInputs: string[];
  preventionTips: string[];
}

export const treatmentData: Record<Language, Record<Exclude<DiseaseType, 'healthy' | 'uncertain'>, TreatmentInfo>> = {
  en: {
    redRust: {
      steps: [
        { title: 'Remove infected leaves', description: 'Carefully pluck and collect all leaves showing rust spots' },
        { title: 'Improve air circulation', description: 'Prune overcrowded branches to allow better airflow' },
        { title: 'Apply copper fungicide', description: 'Spray Bordeaux mixture (1%) on remaining healthy leaves' },
        { title: 'Dispose safely', description: 'Burn or bury infected leaves away from the garden' },
      ],
      timing: 'Early morning (6-8 AM) when leaves are dry. Avoid rainy days. Repeat spray every 10-14 days.',
      lowCostInputs: [
        'Bordeaux mixture (copper sulfate + lime)',
        'Neem oil spray (5ml per liter)',
        'Wood ash dusting',
        'Baking soda spray (1 tsp per liter)',
      ],
      preventionTips: [
        'Maintain proper spacing between plants',
        'Avoid overhead irrigation',
        'Regular pruning for air circulation',
        'Remove fallen leaves regularly',
      ],
    },
    brownBlight: {
      steps: [
        { title: 'Identify and remove', description: 'Remove all leaves with brown/black spots immediately' },
        { title: 'Reduce moisture', description: 'Avoid watering leaves directly; use drip irrigation if possible' },
        { title: 'Apply fungicide', description: 'Use copper oxychloride (3g per liter) spray' },
        { title: 'Monitor closely', description: 'Check plants daily for 2 weeks for new infections' },
      ],
      timing: 'Spray during dry weather, preferably late afternoon (4-6 PM). Repeat every 7-10 days until controlled.',
      lowCostInputs: [
        'Copper oxychloride powder',
        'Trichoderma viride (bio-fungicide)',
        'Garlic-chili extract spray',
        'Cow urine dilution (1:10)',
      ],
      preventionTips: [
        'Ensure good drainage in tea beds',
        'Avoid working when plants are wet',
        'Use disease-free planting material',
        'Balanced fertilization (avoid excess nitrogen)',
      ],
    },
    blisterBlight: {
      steps: [
        { title: 'Stop plucking affected area', description: 'Avoid harvesting from infected sections for 2 weeks' },
        { title: 'Remove blistered leaves', description: 'Hand-pick all leaves showing white/pale blisters' },
        { title: 'Apply protective spray', description: 'Use copper hydroxide or hexaconazole spray' },
        { title: 'Shade management', description: 'Ensure proper shade tree maintenance' },
      ],
      timing: 'Apply spray before rain (if forecast) or early morning. Critical during cool, humid months (Oct-Feb).',
      lowCostInputs: [
        'Copper hydroxide (2g per liter)',
        'Sulfur dust for dry application',
        'Pseudomonas fluorescens (bio-agent)',
        'Turmeric powder paste (for small areas)',
      ],
      preventionTips: [
        'Maintain 50-60% shade cover',
        'Proper drainage to reduce humidity',
        'Regular monitoring during monsoon',
        'Avoid dense planting',
      ],
    },
  },
  as: {
    redRust: {
      steps: [
        { title: 'সংক্ৰমিত পাত আঁতৰাওক', description: 'মামৰৰ দাগ থকা সকলো পাত সাৱধানে ছিঙি সংগ্ৰহ কৰক' },
        { title: 'বায়ু চলাচল উন্নত কৰক', description: 'ভাল বায়ু প্ৰবাহৰ বাবে ঘন ডালবোৰ কাটক' },
        { title: 'তামৰ ভেঁকুৰনাশক প্ৰয়োগ কৰক', description: 'বাকী সুস্থ পাতত বৰ্ডো মিশ্ৰণ (১%) স্প্ৰে কৰক' },
        { title: 'নিৰাপদে নিষ্কাশন কৰক', description: 'সংক্ৰমিত পাতবোৰ বাগিচাৰ পৰা আঁতৰত জ্বলাই বা পুতি থওক' },
      ],
      timing: 'পুৱা সোনকালে (৬-৮ বজা) যেতিয়া পাত শুকান থাকে। বৰষুণৰ দিন এৰাই চলক। প্ৰতি ১০-১৪ দিনত পুনৰ স্প্ৰে কৰক।',
      lowCostInputs: [
        'বৰ্ডো মিশ্ৰণ (কপাৰ চালফেট + চূণ)',
        'নিম তেল স্প্ৰে (প্ৰতি লিটাৰত ৫ মিলি)',
        'কাঠৰ ছাই ছটিওৱা',
        'বেকিং চোডা স্প্ৰে (প্ৰতি লিটাৰত ১ চামুচ)',
      ],
      preventionTips: [
        'গছৰ মাজত সঠিক ব্যৱধান ৰাখক',
        'ওপৰৰ পৰা জলসিঞ্চন এৰাই চলক',
        'বায়ু চলাচলৰ বাবে নিয়মীয়া ছাঁটনি',
        'সৰি পৰা পাত নিয়মীয়াকৈ আঁতৰাওক',
      ],
    },
    brownBlight: {
      steps: [
        { title: 'চিনাক্ত আৰু আঁতৰাওক', description: 'বাদামী/ক\'লা দাগ থকা সকলো পাত তৎক্ষণাত আঁতৰাওক' },
        { title: 'আৰ্দ্ৰতা কমাওক', description: 'পাতত পোনপটীয়াকৈ পানী দিয়া এৰাই চলক; সম্ভৱ হ\'লে ড্ৰিপ জলসিঞ্চন ব্যৱহাৰ কৰক' },
        { title: 'ভেঁকুৰনাশক প্ৰয়োগ কৰক', description: 'কপাৰ অক্সিক্ল\'ৰাইড (প্ৰতি লিটাৰত ৩ গ্ৰাম) স্প্ৰে ব্যৱহাৰ কৰক' },
        { title: 'নিবিড়ভাৱে নিৰীক্ষণ কৰক', description: 'নতুন সংক্ৰমণৰ বাবে ২ সপ্তাহ প্ৰতিদিনে গছ পৰীক্ষা কৰক' },
      ],
      timing: 'শুকান বতৰত স্প্ৰে কৰক, বিশেষকৈ আবেলি (৪-৬ বজা)। নিয়ন্ত্ৰণ নোহোৱালৈকে প্ৰতি ৭-১০ দিনত পুনৰাবৃত্তি কৰক।',
      lowCostInputs: [
        'কপাৰ অক্সিক্ল\'ৰাইড পাউদাৰ',
        'ট্ৰাইক\'ডাৰ্মা ভিৰিডি (জৈৱ-ভেঁকুৰনাশক)',
        'নহৰু-জলকীয়া নিষ্কাশন স্প্ৰে',
        'গৰুৰ মূত্ৰ পানী মিহলি (১:১০)',
      ],
      preventionTips: [
        'চাহ বিচনাত ভাল নিষ্কাশন নিশ্চিত কৰক',
        'গছ তিতা থাকিলে কাম কৰা এৰাই চলক',
        'ৰোগমুক্ত ৰোপণ সামগ্ৰী ব্যৱহাৰ কৰক',
        'সুষম সাৰ প্ৰয়োগ (অতিৰিক্ত নাইট্ৰ\'জেন এৰাই চলক)',
      ],
    },
    blisterBlight: {
      steps: [
        { title: 'আক্ৰান্ত অঞ্চলৰ পৰা ছিঙা বন্ধ কৰক', description: '২ সপ্তাহৰ বাবে সংক্ৰমিত অংশৰ পৰা চপোৱা এৰাই চলক' },
        { title: 'ফোঁহা থকা পাত আঁতৰাওক', description: 'বগা/শেঁতা ফোঁহা দেখুওৱা সকলো পাত হাতেৰে ছিঙক' },
        { title: 'সুৰক্ষামূলক স্প্ৰে প্ৰয়োগ কৰক', description: 'কপাৰ হাইড্ৰক্সাইড বা হেক্সাক\'নাজ\'ল স্প্ৰে ব্যৱহাৰ কৰক' },
        { title: 'ছাঁ ব্যৱস্থাপনা', description: 'সঠিক ছাঁ গছৰ ৰক্ষণাবেক্ষণ নিশ্চিত কৰক' },
      ],
      timing: 'বৰষুণৰ আগত (যদি পূৰ্বানুমান থাকে) বা পুৱা সোনকালে স্প্ৰে প্ৰয়োগ কৰক। শীতল, আৰ্দ্ৰ মাহত (অক্টো-ফেব) গুৰুত্বপূৰ্ণ।',
      lowCostInputs: [
        'কপাৰ হাইড্ৰক্সাইড (প্ৰতি লিটাৰত ২ গ্ৰাম)',
        'শুকান প্ৰয়োগৰ বাবে চালফাৰ ধূলি',
        'চুড\'ম\'নাছ ফ্ল\'ৰেচেন্স (জৈৱ-এজেণ্ট)',
        'হালধি পাউদাৰ পেষ্ট (সৰু অঞ্চলৰ বাবে)',
      ],
      preventionTips: [
        '৫০-৬০% ছাঁ আৱৰণ বজাই ৰাখক',
        'আৰ্দ্ৰতা হ্ৰাসৰ বাবে সঠিক নিষ্কাশন',
        'বাৰিষাৰ সময়ত নিয়মীয়া নিৰীক্ষণ',
        'ঘন ৰোপণ এৰাই চলক',
      ],
    },
  },
  hi: {
    redRust: {
      steps: [
        { title: 'संक्रमित पत्तियां हटाएं', description: 'जंग के धब्बे वाली सभी पत्तियों को सावधानी से तोड़कर इकट्ठा करें' },
        { title: 'हवा का संचार बेहतर करें', description: 'बेहतर वायु प्रवाह के लिए घनी शाखाओं की छंटाई करें' },
        { title: 'कॉपर फफूंदनाशक लगाएं', description: 'बाकी स्वस्थ पत्तियों पर बोर्डो मिश्रण (1%) का छिड़काव करें' },
        { title: 'सुरक्षित रूप से निपटान करें', description: 'संक्रमित पत्तियों को बगीचे से दूर जलाएं या दबाएं' },
      ],
      timing: 'सुबह जल्दी (6-8 बजे) जब पत्तियां सूखी हों। बारिश के दिन छोड़ें। हर 10-14 दिन में दोहराएं।',
      lowCostInputs: [
        'बोर्डो मिश्रण (कॉपर सल्फेट + चूना)',
        'नीम तेल स्प्रे (5ml प्रति लीटर)',
        'लकड़ी की राख छिड़काव',
        'बेकिंग सोडा स्प्रे (1 चम्मच प्रति लीटर)',
      ],
      preventionTips: [
        'पौधों के बीच उचित दूरी बनाए रखें',
        'ऊपर से सिंचाई से बचें',
        'हवा के संचार के लिए नियमित छंटाई',
        'गिरी हुई पत्तियां नियमित रूप से हटाएं',
      ],
    },
    brownBlight: {
      steps: [
        { title: 'पहचानें और हटाएं', description: 'भूरे/काले धब्बे वाली सभी पत्तियां तुरंत हटाएं' },
        { title: 'नमी कम करें', description: 'पत्तियों पर सीधे पानी देने से बचें; संभव हो तो ड्रिप सिंचाई का उपयोग करें' },
        { title: 'फफूंदनाशक लगाएं', description: 'कॉपर ऑक्सीक्लोराइड (3g प्रति लीटर) स्प्रे का उपयोग करें' },
        { title: 'बारीकी से निगरानी करें', description: 'नए संक्रमण के लिए 2 सप्ताह तक प्रतिदिन पौधों की जांच करें' },
      ],
      timing: 'सूखे मौसम में छिड़काव करें, अधिमानतः देर शाम (4-6 बजे)। नियंत्रण तक हर 7-10 दिन दोहराएं।',
      lowCostInputs: [
        'कॉपर ऑक्सीक्लोराइड पाउडर',
        'ट्राइकोडर्मा विरिडी (जैव-फफूंदनाशक)',
        'लहसुन-मिर्च अर्क स्प्रे',
        'गाय का मूत्र पतला (1:10)',
      ],
      preventionTips: [
        'चाय की क्यारियों में अच्छी जल निकासी सुनिश्चित करें',
        'पौधे गीले होने पर काम करने से बचें',
        'रोग-मुक्त रोपण सामग्री का उपयोग करें',
        'संतुलित उर्वरक (अतिरिक्त नाइट्रोजन से बचें)',
      ],
    },
    blisterBlight: {
      steps: [
        { title: 'प्रभावित क्षेत्र से तुड़ाई बंद करें', description: '2 सप्ताह के लिए संक्रमित भागों से कटाई न करें' },
        { title: 'फफोले वाली पत्तियां हटाएं', description: 'सफेद/हल्के फफोले दिखाने वाली सभी पत्तियां हाथ से तोड़ें' },
        { title: 'सुरक्षात्मक स्प्रे लगाएं', description: 'कॉपर हाइड्रॉक्साइड या हेक्साकोनाज़ोल स्प्रे का उपयोग करें' },
        { title: 'छाया प्रबंधन', description: 'उचित छाया वृक्ष रखरखाव सुनिश्चित करें' },
      ],
      timing: 'बारिश से पहले (यदि पूर्वानुमान हो) या सुबह जल्दी स्प्रे करें। ठंडे, नम महीनों (अक्टू-फरवरी) में महत्वपूर्ण।',
      lowCostInputs: [
        'कॉपर हाइड्रॉक्साइड (2g प्रति लीटर)',
        'सूखे छिड़काव के लिए सल्फर धूल',
        'स्यूडोमोनास फ्लोरेसेंस (जैव-एजेंट)',
        'हल्दी पाउडर पेस्ट (छोटे क्षेत्रों के लिए)',
      ],
      preventionTips: [
        '50-60% छाया कवर बनाए रखें',
        'नमी कम करने के लिए उचित जल निकासी',
        'मानसून के दौरान नियमित निगरानी',
        'घनी रोपाई से बचें',
      ],
    },
  },
};

export function getTreatmentInfo(disease: DiseaseType, language: Language): TreatmentInfo | null {
  if (disease === 'healthy' || disease === 'uncertain') {
    return null;
  }
  return treatmentData[language][disease];
}
