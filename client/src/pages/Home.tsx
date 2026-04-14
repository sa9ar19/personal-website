import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

const SLIDES = [
  "/images/slider1.jpg",
  "/images/slider2.jpg",
  "/images/slider3.jpg",
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Slideshow Background */}
          <HeroSlideshow />

          {/* Dark overlay so text is readable */}
          <div className="absolute inset-0 bg-black/50 z-0" />

          <div className="container text-center relative z-10">
            <h1 className="animate-fade-up font-serif text-6xl sm:text-7xl font-semibold mb-6 text-white leading-tight">
              Welcome to Sa9ar's Journey
            </h1>
            <p className="animate-fade-up delay-100 text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              Explore my travels, treks, and stories through photography and
              writing. Each destination holds a unique tale waiting to be
              discovered.
            </p>
            <div className="animate-fade-up delay-200 flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/blog")}
                  className="px-8 py-3 border border-white/50 bg-white/10 text-white font-medium rounded hover:bg-white/20 transition-colors"
                >
                  Read Stories
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="px-8 py-3 border border-white/50 bg-white/10 text-white font-medium rounded hover:bg-white/20 transition-colors"
                >
                  About Me
                </button>
              </div>
              <button
                onClick={() => navigate("/gallery")}
                className="px-8 py-3 bg-white text-black font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Explore Gallery <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider-line my-16" />

        {/* Featured Section */}
        <section className="section-padding">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  About This Journey
                </p>
                <h2 className="font-serif text-4xl font-semibold mb-4 text-foreground">
                  Capturing Moments, Sharing Stories
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  This is my personal space where I document my adventures
                  through photography and writing. From mountain peaks to hidden
                  valleys, each photo carries a story, and every blog post
                  reflects my experiences and learnings from the road.
                </p>
                <button
                  onClick={() => navigate("/about")}
                  className="text-primary font-medium hover:opacity-70 transition-opacity flex items-center gap-2"
                >
                  Learn More About Me <ArrowRight size={16} />
                </button>
              </div>
              <div className="h-96 bg-gradient-to-br from-muted to-secondary rounded-lg flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <img src="/images/aboutMe.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              {[
                { number: "15+", label: "Destinations" },
                { number: "500+", label: "Photos" },
                { number: "40+", label: "Stories" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <p className="font-serif text-4xl font-semibold text-foreground mb-2">
                    {stat.number}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
