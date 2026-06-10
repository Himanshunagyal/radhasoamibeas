export const languages = {
  en: 'English',
  hi: 'हिंदी',
  pa: 'ਪੰਜਾਬੀ',
};

export const defaultLang = 'en';

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About RSSB',
    'nav.masters': 'Masters',
    'nav.satsang': 'Satsang',
    'nav.centers': 'Satsang Centers',
    'nav.books': 'Books',
    'nav.shabads': 'Shabads',
    'nav.quotes': 'Quotes',
    'nav.ask': 'Ask AI',
    'nav.faq': 'FAQ',
    'hero.tagline': 'Science of the Soul',
    'hero.subtitle': 'Devotional resource for Radha Soami Satsang Beas seekers worldwide',
    'hero.explore': 'Explore Teachings',
    'quotes.title': 'Daily Quote',
    'quotes.share': 'Share',
    'quotes.download': 'Download Image',
    'chat.placeholder': 'Ask about RSSB teachings...',
    'chat.send': 'Send',
    'chat.title': 'Ask the Sangat',
    'chat.greeting': 'Sat Naam Ji 🙏 How can I help you today?',
    'footer.disclaimer': 'This is an independent devotional website. Not affiliated with the official RSSB organization.',
  },
  hi: {
    'nav.home': 'होम',
    'nav.about': 'RSSB के बारे में',
    'nav.masters': 'महात्मा',
    'nav.satsang': 'सत्संग',
    'nav.centers': 'सत्संग केंद्र',
    'nav.books': 'पुस्तकें',
    'nav.shabads': 'शबद',
    'nav.quotes': 'उद्धरण',
    'nav.ask': 'AI से पूछें',
    'nav.faq': 'सामान्य प्रश्न',
    'hero.tagline': 'आत्मा का विज्ञान',
    'hero.subtitle': 'राधा स्वामी सत्संग ब्यास के साधकों के लिए भक्ति संसाधन',
    'hero.explore': 'शिक्षाएं देखें',
    'quotes.title': 'आज का उद्धरण',
    'quotes.share': 'साझा करें',
    'quotes.download': 'छवि डाउनलोड करें',
    'chat.placeholder': 'RSSB शिक्षाओं के बारे में पूछें...',
    'chat.send': 'भेजें',
    'chat.title': 'संगत से पूछें',
    'chat.greeting': 'सत नाम जी 🙏 मैं आपकी कैसे सहायता कर सकता हूँ?',
    'footer.disclaimer': 'यह एक स्वतंत्र भक्ति वेबसाइट है। आधिकारिक RSSB संगठन से संबद्ध नहीं।',
  },
  pa: {
    'nav.home': 'ਘਰ',
    'nav.about': 'RSSB ਬਾਰੇ',
    'nav.masters': 'ਮਹਾਤਮਾ',
    'nav.satsang': 'ਸਤਸੰਗ',
    'nav.centers': 'ਸਤਸੰਗ ਕੇਂਦਰ',
    'nav.books': 'ਕਿਤਾਬਾਂ',
    'nav.shabads': 'ਸ਼ਬਦ',
    'nav.quotes': 'ਹਵਾਲੇ',
    'nav.ask': 'AI ਨੂੰ ਪੁੱਛੋ',
    'nav.faq': 'ਸਵਾਲ',
    'hero.tagline': 'ਆਤਮਾ ਦਾ ਵਿਗਿਆਨ',
    'hero.subtitle': 'ਰਾਧਾ ਸੁਆਮੀ ਸਤਸੰਗ ਬਿਆਸ ਦੇ ਭਗਤਾਂ ਲਈ ਭਗਤੀ ਸਰੋਤ',
    'hero.explore': 'ਸਿੱਖਿਆਵਾਂ ਦੇਖੋ',
    'quotes.title': 'ਅੱਜ ਦਾ ਹਵਾਲਾ',
    'quotes.share': 'ਸਾਂਝਾ ਕਰੋ',
    'quotes.download': 'ਤਸਵੀਰ ਡਾਊਨਲੋਡ ਕਰੋ',
    'chat.placeholder': 'RSSB ਸਿੱਖਿਆਵਾਂ ਬਾਰੇ ਪੁੱਛੋ...',
    'chat.send': 'ਭੇਜੋ',
    'chat.title': 'ਸੰਗਤ ਨੂੰ ਪੁੱਛੋ',
    'chat.greeting': 'ਸਤ ਨਾਮ ਜੀ 🙏 ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
    'footer.disclaimer': 'ਇਹ ਇੱਕ ਸੁਤੰਤਰ ਭਗਤੀ ਵੈੱਬਸਾਈਟ ਹੈ। ਅਧਿਕਾਰਤ RSSB ਸੰਗਠਨ ਨਾਲ ਸੰਬੰਧਿਤ ਨਹੀਂ।',
  },
} as const;

export type Lang = keyof typeof ui;

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
