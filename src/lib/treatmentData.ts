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

type TreatableDiseases = Exclude<DiseaseType, 'healthy' | 'uncertain'>;

export const treatmentData: Record<Language, Record<TreatableDiseases, TreatmentInfo>> = {
  en: {
    redRust: {
      steps: [
        { title: 'Early detection', description: 'Look for reddish-brown pustules or spots on tea leaves, typically on the lower surface' },
        { title: 'Remove infected leaves', description: 'Carefully pluck all leaves showing rusty, powdery appearance and collect them' },
        { title: 'Improve air circulation', description: 'Regular pruning improves air flow and reduces humidity around plants' },
        { title: 'Apply copper fungicide', description: 'Spray copper-based fungicides on remaining healthy leaves' },
      ],
      timing: 'Early morning (6-8 AM) when leaves are dry. Favors warm, humid weather (18-25°C). Repeat spray every 10-14 days.',
      lowCostInputs: [
        'Copper-based fungicides (Bordeaux mixture 1%)',
        'Neem oil spray (5ml per liter)',
        'Wood ash dusting',
        'Baking soda spray (1 tsp per liter)',
      ],
      preventionTips: [
        'Maintain proper spacing between plants',
        'Avoid overhead irrigation',
        'Regular pruning for air circulation',
        'Remove fallen leaves regularly',
        'High humidity and poor air circulation increase risk',
      ],
    },
    algalLeafSpot: {
      steps: [
        { title: 'Identify affected areas', description: 'Look for grayish-green, velvety patches on leaves' },
        { title: 'Improve light penetration', description: 'Prune shade trees to reduce humidity and increase light' },
        { title: 'Apply copper-based spray', description: 'Use copper oxychloride spray after rain' },
        { title: 'Remove heavily infected leaves', description: 'Hand-pick severely affected leaves' },
      ],
      timing: 'Apply treatment during dry weather. Best done after monsoon season.',
      lowCostInputs: [
        'Copper oxychloride (3g per liter)',
        'Lime sulfur solution',
        'Neem oil with copper mix',
      ],
      preventionTips: [
        'Ensure proper shade management',
        'Avoid water logging',
        'Improve drainage in tea beds',
        'Regular monitoring during wet season',
      ],
    },
    birdsEyeSpot: {
      steps: [
        { title: 'Scout for circular spots', description: 'Look for small spots with light-colored centers (eye-like appearance)' },
        { title: 'Remove infected material', description: 'Prune and remove affected leaves and twigs' },
        { title: 'Apply fungicide treatment', description: 'Use mancozeb or copper-based fungicides' },
        { title: 'Improve sanitation', description: 'Clean up fallen debris around plants' },
      ],
      timing: 'Apply fungicide before monsoon and during early infection signs.',
      lowCostInputs: [
        'Mancozeb (2.5g per liter)',
        'Copper hydroxide spray',
        'Trichoderma bio-fungicide',
      ],
      preventionTips: [
        'Maintain plant vigor through proper nutrition',
        'Avoid injury to plants during pruning',
        'Use disease-free planting material',
        'Practice crop rotation where possible',
      ],
    },
    grayBlight: {
      steps: [
        { title: 'Identify gray patches', description: 'Look for silvery-gray spots spreading on leaves' },
        { title: 'Remove affected shoots', description: 'Prune and destroy infected branches' },
        { title: 'Apply protective spray', description: 'Use hexaconazole or copper fungicide' },
        { title: 'Reduce humidity', description: 'Improve air circulation by thinning' },
      ],
      timing: 'Spray during dry periods. Repeat every 7-10 days during outbreak.',
      lowCostInputs: [
        'Hexaconazole (1ml per liter)',
        'Copper hydroxide spray',
        'Sulfur dust application',
      ],
      preventionTips: [
        'Avoid dense planting',
        'Maintain proper shade percentage',
        'Remove weeds around tea bushes',
        'Ensure good drainage',
      ],
    },
    blisterBlight: {
      steps: [
        { title: 'Act within 24 hours', description: 'This disease spreads rapidly - immediate action is critical' },
        { title: 'Stop plucking affected area', description: 'Avoid harvesting from infected sections for 2 weeks' },
        { title: 'Remove blistered leaves', description: 'Hand-pick all leaves showing pale white or cream-colored patches with blister-like raised areas' },
        { title: 'Apply protective spray', description: 'Use copper hydroxide, sulfur, or fungicides. Remove shade trees to prevent leaf wetness' },
      ],
      timing: 'Apply spray before rain (if forecast) or early morning. Critical during cool, humid months (Oct-Feb). Spreads rapidly at 15-25°C with continuous leaf wetness.',
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
        'Prevent leaf wetness - most damaging in wet season',
      ],
    },
    anthracnose: {
      steps: [
        { title: 'Identify dark lesions', description: 'Look for brown-black sunken spots on leaves' },
        { title: 'Remove infected tissue', description: 'Prune and burn affected branches and leaves' },
        { title: 'Apply systemic fungicide', description: 'Use carbendazim or mancozeb spray' },
        { title: 'Boost plant immunity', description: 'Apply balanced fertilizer to strengthen plants' },
      ],
      timing: 'Treat at first sign of infection. Repeat spray every 10-14 days.',
      lowCostInputs: [
        'Carbendazim (1g per liter)',
        'Mancozeb spray',
        'Trichoderma viride application',
        'Neem cake fertilizer',
      ],
      preventionTips: [
        'Avoid wounding plants during operations',
        'Maintain plant nutrition',
        'Remove alternate hosts near tea',
        'Use resistant varieties if available',
      ],
    },
    brownBlight: {
      steps: [
        { title: 'Act immediately', description: 'This disease is highly destructive and spreads rapidly' },
        { title: 'Identify and remove', description: 'Remove all leaves with dark brown or black circular spots with concentric rings. Centers may have grayish appearance' },
        { title: 'Improve drainage', description: 'Thrives in wet, waterlogged soil with poor drainage. Improve drainage immediately' },
        { title: 'Apply systemic fungicide', description: 'Use copper oxychloride (3g per liter) spray' },
      ],
      timing: 'Spray during dry weather, preferably late afternoon (4-6 PM). Repeat every 7-10 days until controlled. Common in areas with heavy rainfall and high humidity.',
      lowCostInputs: [
        'Copper oxychloride powder',
        'Trichoderma viride (bio-fungicide)',
        'Garlic-chili extract spray',
        'Cow urine dilution (1:10)',
      ],
      preventionTips: [
        'Ensure good drainage in tea beds - essential for prevention',
        'Avoid working when plants are wet',
        'Use disease-free planting material',
        'Balanced fertilization (avoid excess nitrogen)',
        'Waterlogged soil promotes this disease',
      ],
    },
  },
  as: {
    redRust: {
      steps: [
        { title: 'আগতীয়া চিনাক্তকৰণ', description: 'চাহ পাতত ৰঙচুৱা-বাদামী পাষ্টুল বা দাগ বিচাৰক, সাধাৰণতে তলৰ পৃষ্ঠত' },
        { title: 'সংক্ৰমিত পাত আঁতৰাওক', description: 'মামৰীয়া, পাউদাৰীয়া চেহেৰা দেখুওৱা সকলো পাত সাৱধানে ছিঙি সংগ্ৰহ কৰক' },
        { title: 'বায়ু চলাচল উন্নত কৰক', description: 'নিয়মীয়া ছাঁটনিয়ে বায়ু প্ৰবাহ উন্নত কৰে আৰু গছৰ চাৰিওফালে আৰ্দ্ৰতা হ্ৰাস কৰে' },
        { title: 'তামৰ ভেঁকুৰনাশক প্ৰয়োগ কৰক', description: 'বাকী সুস্থ পাতত তামযুক্ত ভেঁকুৰনাশক স্প্ৰে কৰক' },
      ],
      timing: 'পুৱা সোনকালে (৬-৮ বজা) যেতিয়া পাত শুকান থাকে। উষ্ণ, আৰ্দ্ৰ বতৰত (১৮-২৫°C) হয়। প্ৰতি ১০-১৪ দিনত পুনৰ স্প্ৰে কৰক।',
      lowCostInputs: [
        'তামযুক্ত ভেঁকুৰনাশক (বৰ্ডো মিশ্ৰণ ১%)',
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
    algalLeafSpot: {
      steps: [
        { title: 'আক্ৰান্ত অঞ্চল চিনাক্ত কৰক', description: 'পাতত ধূসৰ-সেউজীয়া মখমলীয়া দাগ বিচাৰক' },
        { title: 'পোহৰ প্ৰৱেশ উন্নত কৰক', description: 'আৰ্দ্ৰতা হ্ৰাস কৰিবলৈ ছাঁ গছ কাটক' },
        { title: 'তামযুক্ত স্প্ৰে প্ৰয়োগ কৰক', description: 'বৰষুণৰ পিছত কপাৰ অক্সিক্ল\'ৰাইড স্প্ৰে ব্যৱহাৰ কৰক' },
        { title: 'বেছি সংক্ৰমিত পাত আঁতৰাওক', description: 'বেছি আক্ৰান্ত পাত হাতেৰে ছিঙক' },
      ],
      timing: 'শুকান বতৰত চিকিৎসা প্ৰয়োগ কৰক। বাৰিষাৰ পিছত কৰাটো ভাল।',
      lowCostInputs: [
        'কপাৰ অক্সিক্ল\'ৰাইড (প্ৰতি লিটাৰত ৩ গ্ৰাম)',
        'চূণ চালফাৰ দ্ৰৱণ',
        'নিম তেল আৰু তাম মিশ্ৰণ',
      ],
      preventionTips: [
        'সঠিক ছাঁ ব্যৱস্থাপনা নিশ্চিত কৰক',
        'পানী জমা হোৱা এৰাই চলক',
        'চাহ বিচনাত নিষ্কাশন উন্নত কৰক',
        'বৰষুণৰ বতৰত নিয়মীয়া নিৰীক্ষণ',
      ],
    },
    birdsEyeSpot: {
      steps: [
        { title: 'ঘূৰণীয়া দাগ বিচাৰক', description: 'পোহৰ ৰঙৰ কেন্দ্ৰ থকা সৰু দাগ বিচাৰক' },
        { title: 'সংক্ৰমিত অংশ আঁতৰাওক', description: 'আক্ৰান্ত পাত আৰু ডাল কাটক আৰু আঁতৰাওক' },
        { title: 'ভেঁকুৰনাশক প্ৰয়োগ কৰক', description: 'মেনক\'জেব বা তামযুক্ত ভেঁকুৰনাশক ব্যৱহাৰ কৰক' },
        { title: 'পৰিষ্কাৰ-পৰিচ্ছন্নতা উন্নত কৰক', description: 'গছৰ চাৰিওফালে সৰি পৰা আৱৰ্জনা পৰিষ্কাৰ কৰক' },
      ],
      timing: 'বাৰিষাৰ আগত আৰু সংক্ৰমণৰ প্ৰাৰম্ভিক লক্ষণত ভেঁকুৰনাশক প্ৰয়োগ কৰক।',
      lowCostInputs: [
        'মেনক\'জেব (প্ৰতি লিটাৰত ২.৫ গ্ৰাম)',
        'কপাৰ হাইড্ৰক্সাইড স্প্ৰে',
        'ট্ৰাইক\'ডাৰ্মা জৈৱ-ভেঁকুৰনাশক',
      ],
      preventionTips: [
        'সঠিক পুষ্টিৰে গছৰ শক্তি বজাই ৰাখক',
        'ছাঁটনিৰ সময়ত গছত আঘাত এৰাই চলক',
        'ৰোগমুক্ত ৰোপণ সামগ্ৰী ব্যৱহাৰ কৰক',
        'সম্ভৱ হ\'লে শস্য পৰিৱৰ্তন কৰক',
      ],
    },
    grayBlight: {
      steps: [
        { title: 'ধূসৰ দাগ চিনাক্ত কৰক', description: 'পাতত বিয়পি থকা ৰূপালী-ধূসৰ দাগ বিচাৰক' },
        { title: 'আক্ৰান্ত ডাল আঁতৰাওক', description: 'সংক্ৰমিত ডাল কাটক আৰু ধ্বংস কৰক' },
        { title: 'সুৰক্ষামূলক স্প্ৰে প্ৰয়োগ কৰক', description: 'হেক্সাক\'নাজ\'ল বা তামৰ ভেঁকুৰনাশক ব্যৱহাৰ কৰক' },
        { title: 'আৰ্দ্ৰতা হ্ৰাস কৰক', description: 'গছ পাতল কৰি বায়ু চলাচল উন্নত কৰক' },
      ],
      timing: 'শুকান সময়ত স্প্ৰে কৰক। প্ৰাদুৰ্ভাৱৰ সময়ত প্ৰতি ৭-১০ দিনত পুনৰাবৃত্তি কৰক।',
      lowCostInputs: [
        'হেক্সাক\'নাজ\'ল (প্ৰতি লিটাৰত ১ মিলি)',
        'কপাৰ হাইড্ৰক্সাইড স্প্ৰে',
        'চালফাৰ ধূলি প্ৰয়োগ',
      ],
      preventionTips: [
        'ঘন ৰোপণ এৰাই চলক',
        'সঠিক ছাঁৰ শতাংশ বজাই ৰাখক',
        'চাহ জোপাৰ চাৰিওফালে অপতৃণ আঁতৰাওক',
        'ভাল নিষ্কাশন নিশ্চিত কৰক',
      ],
    },
    blisterBlight: {
      steps: [
        { title: '২৪ ঘণ্টাৰ ভিতৰত কাৰ্য কৰক', description: 'এই ৰোগ দ্ৰুত বিয়পে - তাৎক্ষণিক পদক্ষেপ অতি গুৰুত্বপূৰ্ণ' },
        { title: 'আক্ৰান্ত অঞ্চলৰ পৰা ছিঙা বন্ধ কৰক', description: '২ সপ্তাহৰ বাবে সংক্ৰমিত অংশৰ পৰা চপোৱা এৰাই চলক' },
        { title: 'ফোঁহা থকা পাত আঁতৰাওক', description: 'ফেঁকুৰি সদৃশ উঠা অংশ থকা শেঁতা বগা বা ক্ৰীম ৰঙৰ দাগ দেখুওৱা সকলো পাত হাতেৰে ছিঙক' },
        { title: 'সুৰক্ষামূলক স্প্ৰে প্ৰয়োগ কৰক', description: 'কপাৰ হাইড্ৰক্সাইড, চালফাৰ বা ভেঁকুৰনাশক ব্যৱহাৰ কৰক। পাত তিতা হোৱা ৰোধ কৰিবলৈ ছাঁ গছ আঁতৰাওক' },
      ],
      timing: 'বৰষুণৰ আগত (যদি পূৰ্বানুমান থাকে) বা পুৱা সোনকালে স্প্ৰে প্ৰয়োগ কৰক। শীতল, আৰ্দ্ৰ মাহত (অক্টো-ফেব) গুৰুত্বপূৰ্ণ। অবিৰত পাত তিতি থাকিলে ১৫-২৫°C ত দ্ৰুত বিয়পে।',
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
    anthracnose: {
      steps: [
        { title: 'গাঢ় ক্ষত চিনাক্ত কৰক', description: 'পাতত বাদামী-ক\'লা বহি যোৱা দাগ বিচাৰক' },
        { title: 'সংক্ৰমিত অংশ আঁতৰাওক', description: 'আক্ৰান্ত ডাল আৰু পাত কাটক আৰু জ্বলাওক' },
        { title: 'প্ৰণালীবদ্ধ ভেঁকুৰনাশক প্ৰয়োগ কৰক', description: 'কাৰ্বেণ্ডাজিম বা মেনক\'জেব স্প্ৰে ব্যৱহাৰ কৰক' },
        { title: 'গছৰ ৰোগ প্ৰতিৰোধ ক্ষমতা বঢ়াওক', description: 'গছ শক্তিশালী কৰিবলৈ সুষম সাৰ প্ৰয়োগ কৰক' },
      ],
      timing: 'সংক্ৰমণৰ প্ৰথম লক্ষণত চিকিৎসা কৰক। প্ৰতি ১০-১৪ দিনত স্প্ৰে পুনৰাবৃত্তি কৰক।',
      lowCostInputs: [
        'কাৰ্বেণ্ডাজিম (প্ৰতি লিটাৰত ১ গ্ৰাম)',
        'মেনক\'জেব স্প্ৰে',
        'ট্ৰাইক\'ডাৰ্মা ভিৰিডি প্ৰয়োগ',
        'নিম খলিহৈ সাৰ',
      ],
      preventionTips: [
        'কাম-কাজৰ সময়ত গছত আঘাত এৰাই চলক',
        'গছৰ পুষ্টি বজাই ৰাখক',
        'চাহৰ ওচৰৰ বিকল্প পোষক আঁতৰাওক',
        'উপলব্ধ হ\'লে প্ৰতিৰোধী জাত ব্যৱহাৰ কৰক',
      ],
    },
    brownBlight: {
      steps: [
        { title: 'তাৎক্ষণিক পদক্ষেপ লওক', description: 'এই ৰোগ অতি ধ্বংসাত্মক আৰু দ্ৰুত বিয়পে' },
        { title: 'চিনাক্ত আৰু আঁতৰাওক', description: 'সকেন্দ্ৰিক বৃত্ত থকা গাঢ় বাদামী বা ক\'লা ঘূৰণীয়া দাগ থকা সকলো পাত আঁতৰাওক। কেন্দ্ৰ ধূসৰ হ\'ব পাৰে' },
        { title: 'নিষ্কাশন উন্নত কৰক', description: 'দুৰ্বল নিষ্কাশন থকা সেমেকা, পানী জমা মাটিত বৃদ্ধি পায়। তাৎক্ষণিকভাৱে নিষ্কাশন উন্নত কৰক' },
        { title: 'প্ৰণালীবদ্ধ ভেঁকুৰনাশক প্ৰয়োগ কৰক', description: 'কপাৰ অক্সিক্ল\'ৰাইড (প্ৰতি লিটাৰত ৩ গ্ৰাম) স্প্ৰে ব্যৱহাৰ কৰক' },
      ],
      timing: 'শুকান বতৰত স্প্ৰে কৰক, বিশেষকৈ আবেলি (৪-৬ বজা)। নিয়ন্ত্ৰণ নোহোৱালৈকে প্ৰতি ৭-১০ দিনত পুনৰাবৃত্তি কৰক। অধিক বৰষুণ আৰু উচ্চ আৰ্দ্ৰতা থকা অঞ্চলত সাধাৰণ।',
      lowCostInputs: [
        'কপাৰ অক্সিক্ল\'ৰাইড পাউদাৰ',
        'ট্ৰাইক\'ডাৰ্মা ভিৰিডি (জৈৱ-ভেঁকুৰনাশক)',
        'নহৰু-জলকীয়া নিষ্কাশন স্প্ৰে',
        'গৰুৰ মূত্ৰ পানী মিহলি (১:১০)',
      ],
      preventionTips: [
        'চাহ বিচনাত ভাল নিষ্কাশন নিশ্চিত কৰক - প্ৰতিৰোধৰ বাবে অপৰিহাৰ্য',
        'গছ তিতা থাকিলে কাম কৰা এৰাই চলক',
        'ৰোগমুক্ত ৰোপণ সামগ্ৰী ব্যৱহাৰ কৰক',
        'সুষম সাৰ প্ৰয়োগ (অতিৰিক্ত নাইট্ৰ\'জেন এৰাই চলক)',
      ],
    },
  },
  hi: {
    redRust: {
      steps: [
        { title: 'शीघ्र पहचान', description: 'चाय की पत्तियों पर लाल-भूरे दाने या धब्बे देखें, आमतौर पर निचली सतह पर' },
        { title: 'संक्रमित पत्तियां हटाएं', description: 'जंग जैसी, पाउडर जैसी दिखने वाली सभी पत्तियों को सावधानी से तोड़कर इकट्ठा करें' },
        { title: 'हवा का संचार बेहतर करें', description: 'नियमित छंटाई से हवा का प्रवाह बेहतर होता है और पौधों के आसपास नमी कम होती है' },
        { title: 'कॉपर फफूंदनाशक लगाएं', description: 'बाकी स्वस्थ पत्तियों पर तांबा आधारित फफूंदनाशक का छिड़काव करें' },
      ],
      timing: 'सुबह जल्दी (6-8 बजे) जब पत्तियां सूखी हों। गर्म, नम मौसम (18-25°C) में होता है। हर 10-14 दिन में दोहराएं।',
      lowCostInputs: [
        'तांबा आधारित फफूंदनाशक (बोर्डो मिश्रण 1%)',
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
    algalLeafSpot: {
      steps: [
        { title: 'प्रभावित क्षेत्रों की पहचान करें', description: 'पत्तियों पर धूसर-हरे मखमली धब्बे देखें' },
        { title: 'प्रकाश प्रवेश में सुधार करें', description: 'नमी कम करने के लिए छाया के पेड़ों की छंटाई करें' },
        { title: 'तांबा आधारित स्प्रे लगाएं', description: 'बारिश के बाद कॉपर ऑक्सीक्लोराइड स्प्रे का उपयोग करें' },
        { title: 'अधिक संक्रमित पत्तियां हटाएं', description: 'गंभीर रूप से प्रभावित पत्तियां हाथ से तोड़ें' },
      ],
      timing: 'सूखे मौसम में उपचार करें। मानसून के बाद करना सबसे अच्छा है।',
      lowCostInputs: [
        'कॉपर ऑक्सीक्लोराइड (3g प्रति लीटर)',
        'चूना सल्फर घोल',
        'नीम तेल और तांबा मिश्रण',
      ],
      preventionTips: [
        'उचित छाया प्रबंधन सुनिश्चित करें',
        'जलभराव से बचें',
        'चाय की क्यारियों में जल निकासी सुधारें',
        'गीले मौसम में नियमित निगरानी',
      ],
    },
    birdsEyeSpot: {
      steps: [
        { title: 'गोलाकार धब्बे खोजें', description: 'हल्के रंग के केंद्र वाले छोटे धब्बे देखें' },
        { title: 'संक्रमित सामग्री हटाएं', description: 'प्रभावित पत्तियों और टहनियों की छंटाई करें और हटाएं' },
        { title: 'फफूंदनाशक उपचार करें', description: 'मैनकोज़ेब या तांबा आधारित फफूंदनाशक का उपयोग करें' },
        { title: 'स्वच्छता में सुधार करें', description: 'पौधों के आसपास गिरे मलबे को साफ करें' },
      ],
      timing: 'मानसून से पहले और संक्रमण के शुरुआती संकेतों पर फफूंदनाशक लगाएं।',
      lowCostInputs: [
        'मैनकोज़ेब (2.5g प्रति लीटर)',
        'कॉपर हाइड्रॉक्साइड स्प्रे',
        'ट्राइकोडर्मा जैव-फफूंदनाशक',
      ],
      preventionTips: [
        'उचित पोषण से पौधों की शक्ति बनाए रखें',
        'छंटाई के दौरान पौधों को चोट से बचाएं',
        'रोग-मुक्त रोपण सामग्री का उपयोग करें',
        'जहां संभव हो फसल चक्र अपनाएं',
      ],
    },
    grayBlight: {
      steps: [
        { title: 'धूसर धब्बे पहचानें', description: 'पत्तियों पर फैलते चांदी-धूसर धब्बे देखें' },
        { title: 'प्रभावित शाखाएं हटाएं', description: 'संक्रमित शाखाओं की छंटाई करें और नष्ट करें' },
        { title: 'सुरक्षात्मक स्प्रे लगाएं', description: 'हेक्साकोनाज़ोल या कॉपर फफूंदनाशक का उपयोग करें' },
        { title: 'नमी कम करें', description: 'पतला करके हवा का संचार बेहतर करें' },
      ],
      timing: 'सूखी अवधि में स्प्रे करें। प्रकोप के दौरान हर 7-10 दिन में दोहराएं।',
      lowCostInputs: [
        'हेक्साकोनाज़ोल (1ml प्रति लीटर)',
        'कॉपर हाइड्रॉक्साइड स्प्रे',
        'सल्फर धूल अनुप्रयोग',
      ],
      preventionTips: [
        'घनी रोपाई से बचें',
        'उचित छाया प्रतिशत बनाए रखें',
        'चाय की झाड़ियों के आसपास खरपतवार हटाएं',
        'अच्छी जल निकासी सुनिश्चित करें',
      ],
    },
    blisterBlight: {
      steps: [
        { title: '24 घंटे के भीतर कार्रवाई करें', description: 'यह बीमारी तेजी से फैलती है - तत्काल कार्रवाई महत्वपूर्ण है' },
        { title: 'प्रभावित क्षेत्र से तुड़ाई बंद करें', description: '2 सप्ताह के लिए संक्रमित भागों से कटाई न करें' },
        { title: 'फफोले वाली पत्तियां हटाएं', description: 'फफोले जैसे उभरे क्षेत्रों के साथ हल्के सफेद या क्रीम रंग के धब्बे दिखाने वाली सभी पत्तियां हाथ से तोड़ें' },
        { title: 'सुरक्षात्मक स्प्रे लगाएं', description: 'कॉपर हाइड्रॉक्साइड, सल्फर या फफूंदनाशक का उपयोग करें। पत्तियों को गीला होने से रोकने के लिए छाया के पेड़ हटाएं' },
      ],
      timing: 'बारिश से पहले (यदि पूर्वानुमान हो) या सुबह जल्दी स्प्रे करें। ठंडे, नम महीनों (अक्टू-फरवरी) में महत्वपूर्ण। लगातार पत्ती गीलेपन के साथ 15-25°C पर तेजी से फैलता है।',
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
    anthracnose: {
      steps: [
        { title: 'गहरे घाव पहचानें', description: 'पत्तियों पर भूरे-काले धंसे धब्बे देखें' },
        { title: 'संक्रमित ऊतक हटाएं', description: 'प्रभावित शाखाओं और पत्तियों की छंटाई करें और जलाएं' },
        { title: 'प्रणालीगत फफूंदनाशक लगाएं', description: 'कार्बेंडाज़िम या मैनकोज़ेब स्प्रे का उपयोग करें' },
        { title: 'पौधों की प्रतिरक्षा बढ़ाएं', description: 'पौधों को मजबूत करने के लिए संतुलित उर्वरक लगाएं' },
      ],
      timing: 'संक्रमण के पहले संकेत पर उपचार करें। हर 10-14 दिन में स्प्रे दोहराएं।',
      lowCostInputs: [
        'कार्बेंडाज़िम (1g प्रति लीटर)',
        'मैनकोज़ेब स्प्रे',
        'ट्राइकोडर्मा विरिडी अनुप्रयोग',
        'नीम खली उर्वरक',
      ],
      preventionTips: [
        'संचालन के दौरान पौधों को घायल करने से बचें',
        'पौधों का पोषण बनाए रखें',
        'चाय के पास वैकल्पिक मेज़बान हटाएं',
        'उपलब्ध हो तो प्रतिरोधी किस्में उपयोग करें',
      ],
    },
    brownBlight: {
      steps: [
        { title: 'तुरंत कार्रवाई करें', description: 'यह बीमारी अत्यधिक विनाशकारी है और तेजी से फैलती है' },
        { title: 'पहचानें और हटाएं', description: 'सकेंद्रित वलयों के साथ गहरे भूरे या काले गोलाकार धब्बे वाली सभी पत्तियां हटाएं। केंद्र धूसर हो सकते हैं' },
        { title: 'जल निकासी सुधारें', description: 'खराब जल निकासी वाली गीली, जलभराव मिट्टी में पनपता है। तुरंत जल निकासी सुधारें' },
        { title: 'प्रणालीगत फफूंदनाशक लगाएं', description: 'कॉपर ऑक्सीक्लोराइड (3g प्रति लीटर) स्प्रे का उपयोग करें' },
      ],
      timing: 'सूखे मौसम में छिड़काव करें, अधिमानतः देर शाम (4-6 बजे)। नियंत्रण तक हर 7-10 दिन दोहराएं। भारी वर्षा और उच्च नमी वाले क्षेत्रों में आम।',
      lowCostInputs: [
        'कॉपर ऑक्सीक्लोराइड पाउडर',
        'ट्राइकोडर्मा विरिडी (जैव-फफूंदनाशक)',
        'लहसुन-मिर्च अर्क स्प्रे',
        'गाय का मूत्र पतला (1:10)',
      ],
      preventionTips: [
        'चाय की क्यारियों में अच्छी जल निकासी सुनिश्चित करें - रोकथाम के लिए आवश्यक',
        'पौधे गीले होने पर काम करने से बचें',
        'रोग-मुक्त रोपण सामग्री का उपयोग करें',
        'संतुलित उर्वरक (अतिरिक्त नाइट्रोजन से बचें)',
      ],
    },
  },
};

export function getTreatmentInfo(disease: DiseaseType, language: Language): TreatmentInfo | null {
  if (disease === 'healthy' || disease === 'uncertain') {
    return null;
  }
  return treatmentData[language][disease as TreatableDiseases];
}