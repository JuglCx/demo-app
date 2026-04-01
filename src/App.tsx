/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  LucideIcon
} from "lucide-react";
import siteConfig from "./site-config.json";

const IconMap: Record<string, LucideIcon> = {
  Palette,
  Code2,
  BarChart3,
  Mail,
  MapPin,
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Set theme color
    document.documentElement.style.setProperty("--primary-color", siteConfig.themeColor);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

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
        console.log("API success:", data);

        if (window.jugl) {
          const chatbot = new window.jugl.ChatBot({
            token: chatbotConfig.token,
            conversationId: data.conv_id,
            chatbotUrl: chatbotConfig.chatbotUrl,
            settings: chatbotConfig.settings,
          });

          console.log("Chatbot initialized:", chatbot);
        } else {
          console.error("Jugl SDK not loaded");
        }
      })
      .catch((err) => console.error("API error:", err));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src={siteConfig.logoUrl} 
              alt="Logo" 
              className="w-8 h-8 rounded-lg object-cover"
              referrerPolicy="no-referrer"
            />
            <span className={`font-bold text-xl tracking-tight ${scrolled ? "text-slate-900" : "text-slate-900"}`}>
              {siteConfig.siteName}
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
            <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
              {siteConfig.hero.ctaText}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
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
              <button className="bg-primary text-white px-5 py-3 rounded-xl text-lg font-medium">
                {siteConfig.hero.ctaText}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900 mb-6">
              {siteConfig.hero.title}
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              {siteConfig.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all group">
                {siteConfig.hero.ctaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={siteConfig.hero.imageUrl} 
                alt="Hero" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
<section id="features" className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
      <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {siteConfig.features.map((feature, index) => {
        const Icon = IconMap[feature.icon] || Palette;
        return (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group p-8 rounded-3xl border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <Icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
              <img 
                src={siteConfig.about.imageUrl} 
                alt="About" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <h2 className="text-4xl font-bold mb-6">{siteConfig.about.title}</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              {siteConfig.about.content}
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-primary mb-1">10+</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Years Exp</div>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-primary mb-1">200+</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Projects</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">{siteConfig.contact.title}</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Email us at</div>
                      <div className="text-lg font-medium">{siteConfig.contact.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Visit us</div>
                      <div className="text-lg font-medium">{siteConfig.contact.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              <form className="space-y-4 bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                ></textarea>
                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img 
              src={siteConfig.logoUrl} 
              alt="Logo" 
              className="w-6 h-6 rounded object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="font-bold text-lg tracking-tight">{siteConfig.siteName}</span>
          </div>
          <p className="text-slate-500 text-sm">
            {siteConfig.footer.copyright}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
