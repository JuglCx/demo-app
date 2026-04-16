import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Palette,
  Code2,
  BarChart3,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

const staticIcons = [Palette, Code2, BarChart3];

function SafeImage({
  src,
  alt,
  className,
  label,
  siteName,
}: {
  src?: string;
  alt: string;
  className?: string;
  label?: string;
  siteName: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const fallbackText = label || `${siteName} Preview`;

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  if (!imgSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 font-semibold text-center px-4 ${className}`}
      >
        <div>
          <div className="text-2xl font-bold text-slate-700 mb-2">
            {siteName.charAt(0)}
          </div>
          <div className="text-sm">{fallbackText}</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setImgSrc("")}
    />
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  const [apiConfig, setApiConfig] = useState<any>(null);
  const [chatbotConfig, setChatbotConfig] = useState<any>(null);
  const [siteConfig, setSiteConfig] = useState<any>(null);

  useEffect(() => {
    const pageName = window.location.pathname.split("/")[1] || "page1";

    async function loadConfigs() {
      try {
        const [api, chatbot, site] = await Promise.all([
          fetch(`/${pageName}/api-config.json`).then((r) => r.json()),
          fetch(`/${pageName}/chatbot-config.json`).then((r) => r.json()),
          fetch(`/${pageName}/site-config.json`).then((r) => r.json()),
        ]);

        setApiConfig(api);
        setChatbotConfig(chatbot);
        setSiteConfig(site);

        document.documentElement.style.setProperty(
          "--primary-color",
          site.themeColor
        );

        const response = await fetch(api.url, {
          method: "POST",
          headers: {
            Authorization: api.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            business_name: api.business_name,
            knowledge: api.knowledge,
          }),
        });

        const data = await response.json();

        if (window.jugl) {
          new window.jugl.ChatBot({
            token: chatbot.token,
            conversationId: data.conv_id,
            chatbotUrl: chatbot.chatbotUrl,
            settings: chatbot.settings,
          });
        }
      } catch (error) {
        console.error("Failed to load configs:", error);
      } finally {
        setLoading(false);
      }
    }

    loadConfigs();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!siteConfig) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-[var(--primary-color)]"></div>
          <p className="mt-4 text-sm text-slate-600 font-medium">
            Building AI Chat...
          </p>
        </div>
      )}

      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SafeImage
              src={siteConfig.logoUrl}
              alt="Logo"
              label={siteConfig.siteName}
              siteName={siteConfig.siteName}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              {siteConfig.siteName}
            </span>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold">
            {siteConfig.hero.title}
          </h1>
          <p className="text-lg text-slate-600 mt-4">
            {siteConfig.hero.subtitle}
          </p>
          <button className="bg-primary text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 mt-8">
            {siteConfig.hero.ctaText}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}