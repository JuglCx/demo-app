import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import apiConfig from "./api-config.json";
import chatbotConfig from "./chatbot-config.json";
import {
  Palette,
  Code2,
  BarChart3,
  Mail,
  MapPin,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import siteConfig from "./site-config.json";

const staticIcons = [Palette, Code2, BarChart3];

function SafeImage({
  src,
  alt,
  className,
  label,
}: {
  src?: string;
  alt: string;
  className?: string;
  label?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const siteName = siteConfig.siteName || "Website";
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

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary-color",
      siteConfig.themeColor
    );

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    setLoading(true);

    fetch(apiConfig.url, {
      method: "POST",
      headers: {
        Authorization: apiConfig.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_name: apiConfig.business_name,
        knowledge: apiConfig.knowledge,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (window.jugl) {
          new window.jugl.ChatBot({
            token: chatbotConfig.token,
            conversationId: data.conv_id,
            chatbotUrl: chatbotConfig.chatbotUrl,
            settings: chatbotConfig.settings,
          });
        }
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => setLoading(false));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              {siteConfig.siteName}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
            <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
              {siteConfig.hero.ctaText}
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white shadow-xl p-6 md:hidden flex flex-col gap-4"
            >
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Features</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">About</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Contact</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900 mb-6">
              {siteConfig.hero.title}
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              {siteConfig.hero.subtitle}
            </p>
            <button className="bg-primary text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2">
              {siteConfig.hero.ctaText}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <SafeImage
                src={siteConfig.hero.imageUrl}
                alt="Hero"
                label={`${siteConfig.siteName}`}
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {siteConfig.features.map((feature, index) => {
              const Icon = staticIcons[index % staticIcons.length];
              return (
                <motion.div
                  key={feature.id}
                  className="group p-8 rounded-3xl border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
            <SafeImage
              src={siteConfig.secondarySection.imageUrl}
              alt="About"
              label={`${siteConfig.siteName}`}
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6">
              {siteConfig.secondarySection.title}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              {siteConfig.secondarySection.description}
            </p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <SafeImage
              src={siteConfig.logoUrl}
              alt="Logo"
              label={siteConfig.siteName}
              className="w-6 h-6 rounded object-cover"
            />
            <span className="font-bold text-lg tracking-tight">
              {siteConfig.siteName}
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            {siteConfig.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
