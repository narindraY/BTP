import Header from "../../Components/Header";
import PageTransition from "../../Components/ui/TransitionPage";
import bg from "../../assets/bg.png";
import About from "./About";
import Contact from "./Contact";
import List from "./List";

function HeroSection({ onScrollTo }) {
  return (
    <div className="bg-fixed bg-center bg-cover min-h-screen pt-20 flex items-center relative"style={{ backgroundImage: `url(${bg})` }}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-3xl ml-16 space-y-8">
        <h1 className="text-7xl text-white font-bold leading-tight">
          Structura <br />
          <span className="text-white/70 font-light">Construction</span>
        </h1>
        <p className="text-xl text-white/80 font-light max-w-lg leading-relaxed">De l'idée à l'ouvrage, nous structurons vos projets avec expertise et rigueur.</p>
        <div className="w-16 h-0.5 bg-white/40" />
        <div className="flex gap-4 pt-2">
          <button onClick={()=>onScrollTo("pub")} className="px-8 py-3.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--hoover)] hover:text-[var(--primary)] cursor-pointer hover:scale-105 transition duration-300 font-medium">
            Voir nos projets
          </button>
          <button onClick={() => onScrollTo("contact")}
            className="px-8 py-3.5 border border-white/40 bg-white/10 text-white rounded-lg hover:bg-white/20 cursor-pointer hover:scale-105 transition duration-300 font-medium backdrop-blur-sm">
            Nous contacter
          </button>
        </div>
    
      </div>
    </div>
  );
}

function PubSection() {
  return (
    <div id="pub" className="w-full py-5">
      <List />
    </div>
  );
}

function ServicesSection() {
  return (
    <div id="services" className="w-full py-5">
      <About />
    </div>
  );
}

function ContactSection() {
  return (
    <div id="contact" className="w-full py-5">
      <Contact />
    </div>
  );
}

function Client() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageTransition>
      <div className="w-full">
        <div className="fixed top-0 left-0 w-full z-50">
          <Header />
        </div>
        <HeroSection onScrollTo={scrollTo} />
        <PubSection />
        <ServicesSection />
        <ContactSection />
      </div>
    </PageTransition>
  );
}

export default Client;