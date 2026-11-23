import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

const BASE_URL = "https://liongroupmaharashtra.vercel.app";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export const ROUTE_SEO_DATA = {
  "/": {
    title: {
      en: "Lion Group Maharashtra Rajya | Social Service & Community Organization",
      mr: "लायन ग्रुप महाराष्ट्र राज्य | समाजसेवा व लोककल्याण संस्था"
    },
    description: {
      en: "Lion Group Maharashtra Rajya is a community organization focused on social service, public welfare, community activities and bringing people together across Maharashtra.",
      mr: "लायन ग्रुप महाराष्ट्र राज्य ही समाजसेवा, लोककल्याण, सामाजिक उपक्रम आणि महाराष्ट्रातील जनतेला एकत्र आणण्यासाठी कार्यरत असलेली अग्रगण्य संस्था आहे."
    },
    canonical: `${BASE_URL}/`
  },
  "/about": {
    title: {
      en: "About Us | Lion Group Maharashtra Rajya",
      mr: "आमच्याबद्दल | लायन ग्रुप महाराष्ट्र राज्य"
    },
    description: {
      en: "Learn about Lion Group Maharashtra Rajya, our mission, vision, history, and commitment to public welfare and community development across Maharashtra.",
      mr: "लायन ग्रुप महाराष्ट्र राज्य संस्थेची स्थापना, उद्दिष्टे, ध्येय आणि समाजसेवेची परंपरा याविषयी सविस्तर माहिती जाणून घ्या."
    },
    canonical: `${BASE_URL}/about`
  },
  "/leadership": {
    title: {
      en: "Leadership & Executive Committee | Lion Group Maharashtra Rajya",
      mr: "संस्था नेतृत्व व कार्यकारिणी | लायन ग्रुप महाराष्ट्र राज्य"
    },
    description: {
      en: "Meet the state executive leadership and district committee heads of Lion Group Maharashtra Rajya.",
      mr: "लायन ग्रुप महाराष्ट्र राज्य मुख्य कार्यकारिणी आणि विविध जिल्ह्यांतील समर्पित पदाधिकारी व मार्गदर्शक."
    },
    canonical: `${BASE_URL}/leadership`
  },
  "/members": {
    title: {
      en: "Members Directory | Lion Group Maharashtra Rajya",
      mr: "सदस्य यादी | लायन ग्रुप महाराष्ट्र राज्य"
    },
    description: {
      en: "Browse the directory of active members and volunteers of Lion Group Maharashtra Rajya.",
      mr: "लायन ग्रुप महाराष्ट्र राज्यच्या अधिकृत आणि सक्रिय सदस्यांची संपूर्ण यादी व माहिती."
    },
    canonical: `${BASE_URL}/members`
  },
  "/be-a-member": {
    title: {
      en: "Join Us - Be A Member | Lion Group Maharashtra Rajya",
      mr: "सदस्य व्हा - नोंदणी | लायन ग्रुप महाराष्ट्र राज्य"
    },
    description: {
      en: "Become a member of Lion Group Maharashtra Rajya. Join our network of social workers and volunteers dedicated to community service and youth empowerment.",
      mr: "लायन ग्रुप महाराष्ट्र राज्यमध्ये सामील होऊन समाजसेवेच्या कार्यात हातभार लावा. आजच सदस्यत्वासाठी नोंदणी करा."
    },
    canonical: `${BASE_URL}/be-a-member`
  },
  "/join": {
    title: {
      en: "Join Lion Group Maharashtra Rajya | Online Membership",
      mr: "सदस्य व्हा - ऑनलाईन नोंदणी | लायन ग्रुप महाराष्ट्र राज्य"
    },
    description: {
      en: "Apply online for membership of Lion Group Maharashtra Rajya and join a statewide community of changemakers.",
      mr: "लायन ग्रुप महाराष्ट्र राज्यच्या सदस्यत्वासाठी ऑनलाईन अर्ज करा आणि समाजसेवेत सहभागी व्हा."
    },
    canonical: `${BASE_URL}/be-a-member`
  },
  "/activities": {
    title: {
      en: "Social Activities & Initiatives | Lion Group Maharashtra Rajya",
      mr: "सामाजिक उपक्रम व कार्य | लायन ग्रुप महाराष्ट्र राज्य"
    },
    description: {
      en: "Explore our social service initiatives including blood donation camps, tree plantation, free healthcare checkups, and disaster relief across Maharashtra.",
      mr: "रक्तदान शिबिरे, वृक्षारोपण, मोफत आरोग्य शिबिरे व आपत्ती साहाय्य अशा विविध समाजोपयोगी उपक्रमांची सविस्तर माहिती."
    },
    canonical: `${BASE_URL}/activities`
  },
  "/events": {
    title: {
      en: "Events & Programs | Lion Group Maharashtra Rajya",
      mr: "नियोजित व पार पडलेले कार्यक्रम | लायन ग्रुप महाराष्ट्र राज्य"
    },
    description: {
      en: "Stay updated on upcoming and completed community events, social conventions, blood donation drives, and youth programs organized by Lion Group Maharashtra.",
      mr: "लायन ग्रुप महाराष्ट्र राज्यतर्फे आयोजित आगामी व संपन्न सामाजिक कार्यक्रम आणि संमेलने."
    },
    canonical: `${BASE_URL}/events`
  },
  "/gallery": {
    title: {
      en: "Photo Gallery | Lion Group Maharashtra Rajya",
      mr: "छायाचित्र दालन | लायन ग्रुप महाराष्ट्र राज्य"
    },
    description: {
      en: "Browse photos and visual highlights from social welfare campaigns, gatherings, and community service projects by Lion Group Maharashtra Rajya.",
      mr: "लायन ग्रुपच्या विविध सामाजिक उपक्रम, शिबिरे आणि संमेलनांची क्षणचित्रे."
    },
    canonical: `${BASE_URL}/gallery`
  },
  "/donate": {
    title: {
      en: "Donate & Support | Lion Group Maharashtra Rajya",
      mr: "देणगी व मदत | लायन ग्रुप महाराष्ट्र राज्य"
    },
    description: {
      en: "Support the humanitarian and social welfare causes of Lion Group Maharashtra Rajya. Your contributions help fund medical relief, education, and social drives.",
      mr: "लायन ग्रुप महाराष्ट्र राज्यच्या सामाजिक व लोककल्याणकारी कार्यासाठी आपले बहुमूल्य योगदान द्या."
    },
    canonical: `${BASE_URL}/donate`
  },
  "/contact": {
    title: {
      en: "Contact Us & Emergency Helpline | Lion Group Maharashtra Rajya",
      mr: "संपर्क व आपत्कालीन हेल्पलाइन | लायन ग्रुप महाराष्ट्र राज्य"
    },
    description: {
      en: "Contact Lion Group Maharashtra Rajya headquarters, reach our emergency blood donation helpline, or send an inquiry.",
      mr: "लायन ग्रुप महाराष्ट्र राज्य मुख्य कार्यालय, आपत्कालीन रक्त हेल्पलाइन क्रमांक आणि संपर्क तपशील."
    },
    canonical: `${BASE_URL}/contact`
  }
};

const updateMetaTag = (attrName, attrValue, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const updateCanonical = (url) => {
  if (!url) return;
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", url);
};

export const applySEO = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  noindex = false
}) => {
  if (title) {
    document.title = title;
    updateMetaTag("name", "title", title);
    updateMetaTag("property", "og:title", title);
    updateMetaTag("name", "twitter:title", title);
  }

  if (description) {
    updateMetaTag("name", "description", description);
    updateMetaTag("property", "og:description", description);
    updateMetaTag("name", "twitter:description", description);
  }

  if (canonical) {
    updateCanonical(canonical);
    updateMetaTag("property", "og:url", canonical);
  }

  if (image) {
    updateMetaTag("property", "og:image", image);
    updateMetaTag("name", "twitter:image", image);
  }

  updateMetaTag("property", "og:type", "website");
  updateMetaTag("name", "twitter:card", "summary_large_image");
  updateMetaTag("name", "robots", noindex ? "noindex, follow" : "index, follow");
};

export const SEO = ({
  title,
  description,
  canonical,
  image,
  noindex
}) => {
  const location = useLocation();
  const { lang } = useLanguage();

  useEffect(() => {
    // If explicit props were provided, use them
    if (title || description || canonical) {
      applySEO({
        title,
        description,
        canonical: canonical || `${BASE_URL}${location.pathname}`,
        image,
        noindex
      });
      return;
    }

    // Otherwise, check route-based defaults
    const routeConfig = ROUTE_SEO_DATA[location.pathname];
    if (routeConfig) {
      const activeTitle = routeConfig.title[lang] || routeConfig.title.en;
      const activeDesc = routeConfig.description[lang] || routeConfig.description.en;
      applySEO({
        title: activeTitle,
        description: activeDesc,
        canonical: routeConfig.canonical,
        image: DEFAULT_IMAGE,
        noindex: false
      });
    }
  }, [location.pathname, lang, title, description, canonical, image, noindex]);

  return null;
};
