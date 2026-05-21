import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [lang, setLang] = useState<"en" | "ta" | "hi">("en");

  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#0F0A1E] to-[#1E1B4B] text-white font-sans min-h-screen relative overflow-hidden" lang={lang}>
      <AnimatePresence>
        {!opened && <Gate onOpen={() => setOpened(true)} lang={lang} />}
      </AnimatePresence>

      {opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Hero lang={lang} />
          <Story lang={lang} />
          <Timeline lang={lang} />
          <RSVP lang={lang} />
          <Venue lang={lang} />
          <Gallery lang={lang} />
          <LiveStream lang={lang} />
          <Footer lang={lang} />
        </motion.div>
      )}

      <LanguageSwitcher lang={lang} setLang={setLang} />
    </div>
  );
}

function Gate({ onOpen, lang }: { onOpen: () => void, lang: string }) {
  const [isOpening, setIsOpening] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); 
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 2.5);
    } catch (e) {
      console.log("Audio not supported");
    }

    setTimeout(() => setShowContent(true), 1000);
  };

  const getClickText = () => {
    if (lang === "ta") return "✦ திறக்க கிளிக் செய்யவும் ✦";
    if (lang === "hi") return "✦ खोलने के लिए क्लिक करें ✦";
    return "✦ Click to open ✦";
  };

  const getEnterText = () => {
    if (lang === "ta") return "அழைப்பிதழை உள்ளிடவும் ✦";
    if (lang === "hi") return "निमंत्रण दर्ज करें ✦";
    return "Enter Invitation ✦";
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0A1E] perspective-[1500px]"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Doors */}
      <div className={`absolute inset-0 flex transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,1,0.5,1)] transform-style-3d ${isOpening ? 'pointer-events-none' : 'cursor-pointer'}`} onClick={handleClick}>
        <div className={`w-1/2 h-full bg-[#1E1B4B] border-r-4 border-[#D97706] origin-left transition-transform duration-[3000ms] flex justify-end items-center relative overflow-hidden shadow-[inset_-20px_0_50px_rgba(0,0,0,0.5)] ${isOpening ? '-rotate-y-105' : 'rotate-y-0'}`}>
          {/* Ornate Door Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="door-pattern-l" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#D97706" strokeWidth="2" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="#FCD34D" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#door-pattern-l)" />
            </svg>
          </div>
          <div className="w-48 h-48 border-4 border-[#D97706] rounded-full flex items-center justify-center mr-[-4px] relative z-10 bg-[#0F0A1E]">
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#FCD34D] fill-current drop-shadow-md">
               <path d="M50,10 C60,40 90,50 60,60 C50,90 40,60 10,50 C40,40 50,10 50,10 Z" />
            </svg>
          </div>
        </div>

        <div className={`w-1/2 h-full bg-[#1E1B4B] border-l-4 border-[#D97706] origin-right transition-transform duration-[3000ms] flex justify-start items-center relative overflow-hidden shadow-[inset_20px_0_50px_rgba(0,0,0,0.5)] ${isOpening ? 'rotate-y-105' : 'rotate-y-0'}`}>
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="door-pattern-r" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#D97706" strokeWidth="2" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="#FCD34D" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#door-pattern-r)" />
            </svg>
          </div>
          <div className="w-48 h-48 border-4 border-[#D97706] rounded-full flex items-center justify-center ml-[-4px] relative z-10 bg-[#0F0A1E]">
             <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#FCD34D] fill-current drop-shadow-md" style={{transform: "scaleX(-1)"}}>
               <path d="M50,10 C60,40 90,50 60,60 C50,90 40,60 10,50 C40,40 50,10 50,10 Z" />
            </svg>
          </div>
        </div>
      </div>

      {!isOpening && (
        <div className="absolute bottom-16 text-center animate-pulse pointer-events-none z-20">
          <p className="text-[#FCD34D] font-serif text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(252,211,77,0.8)]">{getClickText()}</p>
        </div>
      )}

      {/* Content behind doors */}
      {showContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          {/* Falling Petals */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(60)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-3 h-3 bg-white rounded-full opacity-80"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                  animation: `fall ${Math.random() * 3 + 3}s linear ${Math.random() * 2}s infinite`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              ></div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} className="text-center">
            <h1 className="font-serif text-5xl md:text-8xl text-[#FCD34D] drop-shadow-[0_0_20px_rgba(217,119,6,0.6)] tracking-wide">Priya & Arjun</h1>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }}>
              <p className="mt-8 text-2xl text-[#E2E8F0] font-sans tracking-widest">सर्वे भवन्तु सुखिनः</p>
              <p className="text-lg text-[#94A3B8] italic">May all beings be happy</p>
            </motion.div>
            
            <motion.button 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
              onClick={onOpen}
              className="mt-12 pointer-events-auto px-8 py-3 bg-transparent border-2 border-[#D97706] text-[#FCD34D] font-serif text-xl rounded-full hover:bg-[#D97706] hover:text-[#0F0A1E] transition-all duration-500 shadow-[0_0_15px_rgba(217,119,6,0.4)]"
            >
              {getEnterText()}
            </motion.button>
          </motion.div>
        </div>
      )}
      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh) rotate(720deg); }
        }
      `}</style>
    </motion.div>
  );
}

function Hero({ lang }: { lang: string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 180]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative py-20 px-4">
      {/* Mandala Background */}
      <motion.div style={{ rotate, y }} className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-20 pointer-events-none">
        <svg viewBox="0 0 400 400" className="w-[120vw] h-[120vw] max-w-[1000px] max-h-[1000px]">
          <circle cx="200" cy="200" r="180" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="10 10" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="#FCD34D" strokeWidth="1" />
          <path d="M200,20 L200,380 M20,200 L380,200 M72,72 L328,328 M72,328 L328,72" stroke="#D97706" strokeWidth="1" />
          {[...Array(16)].map((_, i) => (
             <path key={i} d="M200,60 Q230,130 200,200 Q170,130 200,60" fill="none" stroke="#FCD34D" strokeWidth="1" transform={`rotate(${i * 22.5} 200 200)`} />
          ))}
        </svg>
      </motion.div>

      <div className="relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="font-serif text-6xl md:text-9xl text-[#FCD34D] drop-shadow-[0_5px_15px_rgba(217,119,6,0.6)] mb-6"
        >
          Priya & Arjun
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-xl md:text-3xl text-[#E2E8F0] tracking-widest mb-3 font-medium uppercase"
        >
          {lang === "ta" ? "சனிக்கிழமை, டிசம்பர் 14, 2024" : lang === "hi" ? "शनिवार, 14 दिसंबर, 2024" : "Saturday, December 14, 2024"}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-lg md:text-2xl text-[#CBD5E1] font-serif italic"
        >
          {lang === "ta" ? "சென்னை, தமிழ்நாடு" : lang === "hi" ? "चेन्नई, तमिलनाडु" : "Chennai, Tamil Nadu"}
        </motion.p>
      </div>
      
      <div className="absolute bottom-10 animate-bounce">
        <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#FCD34D]">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
}

function Story({ lang }: { lang: string }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const tl = window.gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        end: () => "+=" + (containerRef.current as any)?.offsetWidth
      }
    });

    tl.to(".story-track", {
      xPercent: -80,
      ease: "none"
    });

    return () => {
      tl.kill();
    };
  }, []);

  const chapters = [
    { title: "How We Met", titleTa: "நாங்கள் எப்படி சந்தித்தோம்", desc: "A chance encounter that changed everything." },
    { title: "First Date", titleTa: "முதல் சந்திப்பு", desc: "Coffee, conversations, and a spark that wouldn't fade." },
    { title: "The Proposal", titleTa: "முன்மொழிவு", desc: "Under a canopy of stars, a promise forever." },
    { title: "Engagement", titleTa: "நிச்சயதார்த்தம்", desc: "Families united, hearts connected." },
    { title: "Wedding Day", titleTa: "திருமண நாள்", desc: "The beginning of our forever." }
  ];

  return (
    <section ref={containerRef} className="h-screen flex items-center overflow-hidden bg-[#0F0A1E] border-t border-[#D97706]/30 relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3B0764] to-[#0F0A1E]"></div>
      
      <div className="story-track flex gap-20 px-[10vw] w-[500vw]">
        {chapters.map((chap, i) => (
          <div key={i} className="w-[80vw] max-w-xl h-[60vh] shrink-0 border border-[#D97706] bg-[#1E1B4B]/90 p-12 rounded-lg flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-2 border border-[#D97706]/30 rounded opacity-50 pointer-events-none"></div>
            
            <svg viewBox="0 0 100 100" className="w-20 h-20 mb-8 text-[#FCD34D] fill-current group-hover:scale-110 transition-transform duration-500">
               <path d="M50,10 C60,40 90,50 60,60 C50,90 40,60 10,50 C40,40 50,10 50,10 Z" />
            </svg>

            <h3 className="font-serif text-4xl text-[#FCD34D] mb-6 relative z-10">
              {lang === "ta" ? chap.titleTa : chap.title}
            </h3>
            <p className="text-xl text-[#E2E8F0] relative z-10 font-sans italic">
              {chap.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Timeline({ lang }: { lang: string }) {
  const events = [
    { name: "Mehendi", nameTa: "மெஹந்தி", date: "Dec 11, 4:00 PM", venue: "Kapaleeshwarar Temple, Chennai", dress: "Green / Yellow" },
    { name: "Haldi", nameTa: "ஹல்தி", date: "Dec 12, 10:00 AM", venue: "Kapaleeshwarar Temple, Chennai", dress: "Yellow" },
    { name: "Sangeet", nameTa: "சங்கீத்", date: "Dec 12, 7:00 PM", venue: "Kapaleeshwarar Temple, Chennai", dress: "Glamorous" },
    { name: "Baraat", nameTa: "பராத்", date: "Dec 13, 5:00 PM", venue: "Kapaleeshwarar Temple, Chennai", dress: "Traditional" },
    { name: "Wedding Ceremony", nameTa: "திருமணம்", date: "Dec 14, 9:00 AM", venue: "Kapaleeshwarar Temple, Chennai", dress: "Traditional Silk" },
    { name: "Reception", nameTa: "வரவேற்பு", date: "Dec 14, 7:00 PM", venue: "Kapaleeshwarar Temple, Chennai", dress: "Formal" },
  ];

  return (
    <section className="py-32 px-4 max-w-5xl mx-auto border-t border-[#D97706]/30 bg-gradient-to-b from-[#1E1B4B] to-[#0F0A1E]">
      <h2 className="font-serif text-6xl text-center text-[#FCD34D] mb-24 drop-shadow-lg">Ceremonies</h2>
      <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-[#D97706]/0 before:via-[#D97706] before:to-[#D97706]/0">
        {events.map((ev, i) => (
          <motion.div 
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            key={i} 
            className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#D97706] bg-[#0F0A1E] text-[#FCD34D] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(217,119,6,0.6)] absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
              ✦
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] border border-[#D97706]/50 bg-[#1E1B4B]/80 backdrop-blur p-8 rounded-lg ml-auto md:ml-0 hover:bg-[#3B0764]/50 transition-colors shadow-xl">
              <h3 className="text-3xl font-serif text-[#FCD34D] mb-2">{lang === "ta" ? ev.nameTa : ev.name}</h3>
              <p className="text-xl text-[#E2E8F0] font-medium mb-3">{ev.date}</p>
              <p className="text-base text-[#CBD5E1] mb-5">{ev.venue}</p>
              <span className="inline-block px-4 py-1.5 bg-[#D97706]/20 border border-[#D97706]/50 rounded-full text-sm font-medium text-[#FCD34D] uppercase tracking-wider">Dress Code: {ev.dress}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function RSVP({ lang }: { lang: string }) {
  const schema = z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    guests: z.number().min(1),
    attending: z.enum(["Yes", "No", "Maybe"]),
    meal: z.enum(["Veg", "Non-Veg"])
  });

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: { name: "", phone: "", guests: 1, attending: "Yes", meal: "Veg" }
  });

  const [submitted, setSubmitted] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const formVals = watch();

  const onSubmit = (data: any) => {
    setSubmitted(true);
    
    setTimeout(() => {
      if (qrRef.current && window.QRCode) {
        qrRef.current.innerHTML = "";
        new window.QRCode(qrRef.current, {
          text: `Wedding-Entry:${data.name}-${data.guests}Guests`,
          width: 128,
          height: 128,
          colorDark : "#0F0A1E",
          colorLight : "#FCD34D",
        });
      }
    }, 100);
  };

  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Priya and Arjun Wedding//EN
BEGIN:VEVENT
UID:priyaarjunwedding@gmail.com
DTSTAMP:20240101T000000Z
DTSTART:20241214T033000Z
DTEND:20241214T153000Z
SUMMARY:Priya & Arjun's Wedding
LOCATION:Kapaleeshwarar Temple, Chennai
DESCRIPTION:Join us to celebrate the wedding of Priya and Arjun.
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'wedding.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-24 px-4 border-t border-[#D97706]/30 bg-[#0F0A1E] relative overflow-hidden">
      {/* Confetti */}
      {submitted && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(40)].map((_, i) => (
             <div 
               key={i} 
               className="absolute w-4 h-4 rounded-full bg-[#D97706]"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `-10%`,
                 animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                 transform: `rotate(${Math.random() * 360}deg)`,
                 opacity: 0.8
               }}
             ></div>
          ))}
        </div>
      )}

      <div className="max-w-xl mx-auto border-2 border-[#D97706] bg-[#1E1B4B] rounded-xl p-10 shadow-2xl relative z-10">
        <h2 className="font-serif text-5xl text-center text-[#FCD34D] mb-10">RSVP</h2>
        
        {submitted ? (
          <div className="text-center py-10">
            <h3 className="text-3xl font-serif text-[#FCD34D] mb-4">
              {lang === "ta" ? "நன்றி! உங்கள் பதில் பதிவு செய்யப்பட்டது" : "Thank you! Your response has been recorded."}
            </h3>
            <div className="mt-8 p-6 inline-block bg-[#FCD34D] rounded-lg">
              <div ref={qrRef} className="w-32 h-32 mx-auto"></div>
              <p className="mt-4 text-lg font-bold text-[#0F0A1E] uppercase">Entry Pass</p>
            </div>
            
            <div className="mt-10 flex gap-4 justify-center">
               <button onClick={handleDownloadICS} className="px-4 py-2 border border-[#D97706] rounded text-[#FCD34D] hover:bg-[#D97706]/20">
                 Add to Apple Calendar
               </button>
               <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Priya+%26+Arjun+Wedding&dates=20241214T033000Z/20241214T153000Z&details=Join+us+for+the+celebration&location=Kapaleeshwarar+Temple,+Chennai" target="_blank" rel="noreferrer" className="px-4 py-2 border border-[#D97706] rounded text-[#FCD34D] hover:bg-[#D97706]/20">
                 Add to Google Calendar
               </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label className="block text-[#CBD5E1] mb-2 text-lg">Name</label>
              <input {...register("name")} className="w-full bg-[#0F0A1E] border border-[#D97706]/50 rounded-lg px-4 py-3 text-white text-lg focus:border-[#FCD34D] focus:ring-1 focus:ring-[#FCD34D] outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-[#CBD5E1] mb-2 text-lg">Phone</label>
              <input {...register("phone")} type="tel" className="w-full bg-[#0F0A1E] border border-[#D97706]/50 rounded-lg px-4 py-3 text-white text-lg focus:border-[#FCD34D] outline-none transition-all" required />
            </div>
            
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-[#CBD5E1] mb-2 text-lg">Guests</label>
                <div className="flex items-center bg-[#0F0A1E] border border-[#D97706]/50 rounded-lg overflow-hidden">
                  <button type="button" onClick={() => setValue('guests', Math.max(1, formVals.guests - 1))} className="px-4 py-3 text-[#FCD34D] hover:bg-[#D97706]/20">-</button>
                  <input {...register("guests")} type="number" className="w-full bg-transparent text-center text-white outline-none" readOnly />
                  <button type="button" onClick={() => setValue('guests', formVals.guests + 1)} className="px-4 py-3 text-[#FCD34D] hover:bg-[#D97706]/20">+</button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[#CBD5E1] mb-2 text-lg">Meal</label>
                <div className="flex bg-[#0F0A1E] border border-[#D97706]/50 rounded-lg overflow-hidden p-1">
                  <button type="button" onClick={() => setValue('meal', 'Veg')} className={`flex-1 py-2 rounded ${formVals.meal === 'Veg' ? 'bg-[#D97706] text-[#0F0A1E] font-bold' : 'text-[#CBD5E1]'}`}>Veg</button>
                  <button type="button" onClick={() => setValue('meal', 'Non-Veg')} className={`flex-1 py-2 rounded ${formVals.meal === 'Non-Veg' ? 'bg-[#D97706] text-[#0F0A1E] font-bold' : 'text-[#CBD5E1]'}`}>Non-Veg</button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[#CBD5E1] mb-2 text-lg">Attending</label>
              <div className="flex bg-[#0F0A1E] border border-[#D97706]/50 rounded-lg overflow-hidden p-1">
                {['Yes', 'No', 'Maybe'].map(opt => (
                   <button key={opt} type="button" onClick={() => setValue('attending', opt as any)} className={`flex-1 py-2 rounded ${formVals.attending === opt ? 'bg-[#FCD34D] text-[#0F0A1E] font-bold' : 'text-[#CBD5E1] hover:bg-[#D97706]/10'}`}>{opt}</button>
                ))}
              </div>
            </div>
            
            <button type="submit" className="w-full bg-[#D97706] text-[#0F0A1E] font-bold text-xl py-4 rounded-lg hover:bg-[#FCD34D] transition-colors shadow-[0_0_15px_rgba(217,119,6,0.4)]">
              Submit Response
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Venue({ lang }: { lang: string }) {
  return (
    <section className="py-24 px-4 border-t border-[#D97706]/30 bg-[#1E1B4B]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="md:w-1/2 w-full">
          <div className="border-4 border-[#D97706] rounded-xl overflow-hidden shadow-2xl relative">
             <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-10"></div>
             <iframe 
               src="https://maps.google.com/maps?q=Kapaleeshwarar+Temple+Chennai&output=embed" 
               className="w-full h-96" 
               loading="lazy"
               title="Venue Map"
             ></iframe>
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col justify-center text-center md:text-left">
          <h2 className="font-serif text-6xl text-[#FCD34D] mb-6 drop-shadow-md">Venue</h2>
          <h3 className="text-3xl text-white mb-4">Kapaleeshwarar Temple</h3>
          <p className="text-xl text-[#CBD5E1] mb-8 leading-relaxed">
            Vadada Maada Veedhi,<br/>
            Mylapore, Chennai,<br/>
            Tamil Nadu 600004
          </p>
          
          {/* Gopuram Silhouette */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-32 h-40">
               <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#FCD34D]" strokeWidth="2">
                 <path d="M50 0 L90 80 L10 80 Z" className="drop-shadow-[0_0_5px_rgba(252,211,77,0.8)]"/>
                 <path d="M50 10 L80 80 M50 30 L70 80 M50 50 L60 80" />
                 <path d="M50 10 L20 80 M50 30 L30 80 M50 50 L40 80" />
                 <rect x="30" y="80" width="40" height="20" fill="#FCD34D" />
               </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery({ lang }: { lang: string }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wedding_photos');
    if (saved) {
      try { setPhotos(JSON.parse(saved)); } catch(e){}
    }
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newPhotos = [base64, ...photos].slice(0, 12);
        setPhotos(newPhotos);
        localStorage.setItem('wedding_photos', JSON.stringify(newPhotos));
      };
      reader.readAsDataURL(file);
    }
  };

  const placeholders = Array(12 - photos.length).fill(0);

  return (
    <section className="py-24 px-4 border-t border-[#D97706]/30 bg-[#0F0A1E]">
      <h2 className="font-serif text-5xl text-center text-[#FCD34D] mb-12">Shared Memories</h2>
      
      <div className="max-w-6xl mx-auto mb-10 text-center">
         <label className="cursor-pointer inline-block px-6 py-3 border-2 border-[#D97706] text-[#FCD34D] font-bold rounded-full hover:bg-[#D97706]/20 transition-colors">
           {lang === "ta" ? "புகைப்படங்களை பதிவேற்றுக" : "Upload Photo"}
           <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
         </label>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
        {photos.map((src, i) => (
          <div key={`photo-${i}`} className="border-2 border-[#D97706] rounded-lg overflow-hidden cursor-pointer relative group" onClick={() => setSelectedPhoto(src)}>
            <img src={src} alt="Guest memory" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute top-2 right-2 bg-[#0F0A1E]/80 text-[#FCD34D] text-xs px-2 py-1 rounded">New</div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="text-[#FCD34D]">+</span>
            </div>
          </div>
        ))}
        {placeholders.map((_, i) => (
          <div key={`place-${i}`} className="border border-[#D97706]/30 bg-[#1E1B4B] rounded-lg overflow-hidden relative group">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#D97706] stroke-current" fill="none">
                 <circle cx="50" cy="50" r="40" strokeWidth="2" strokeDasharray="5 5" />
                 <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" strokeWidth="1" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedPhoto(null)}
          >
             <img src={selectedPhoto} className="max-w-full max-h-full object-contain border-4 border-[#D97706] rounded" alt="Fullscreen" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function LiveStream({ lang }: { lang: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2024-12-14T12:00:00+05:30").getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 border-t border-[#D97706]/30 bg-[#1E1B4B] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMxRTFCNEIiPjwvcmVjdD48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMkQyOTY0Ij48L3JlY3Q+PC9zdmc+')]">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-5xl text-[#FCD34D] mb-4">Live Broadcast</h2>
        <p className="text-xl text-[#CBD5E1] mb-12">For our family and friends across the globe.</p>
        
        <div className="flex justify-center gap-6 mb-12">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#0F0A1E] border-2 border-[#D97706] rounded-lg flex items-center justify-center text-3xl font-serif text-[#FCD34D] shadow-[0_0_10px_rgba(217,119,6,0.3)]">
                {String(value).padStart(2, '0')}
              </div>
              <span className="mt-2 text-[#94A3B8] uppercase text-xs tracking-wider">{unit}</span>
            </div>
          ))}
        </div>

        <div className="aspect-video w-full border-4 border-[#D97706] bg-black flex flex-col items-center justify-center rounded-xl shadow-2xl relative overflow-hidden">
          <svg viewBox="0 0 24 24" width="64" height="64" className="text-[#D97706] mb-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <p className="text-2xl text-[#E2E8F0] font-serif">Stream begins shortly</p>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-500 text-sm font-bold uppercase tracking-widest">Offline</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ lang }: { lang: string }) {
  return (
    <footer className="py-20 bg-[#0F0A1E] border-t border-[#D97706]/50 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
         <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] fill-none stroke-[#FCD34D]" strokeWidth="0.5">
           {[...Array(12)].map((_, i) => (
             <polygon key={i} points="50,10 60,40 90,50 60,60 50,90 40,60 10,50 40,40" transform={`rotate(${i * 30} 50 50)`} />
           ))}
         </svg>
      </div>
      <div className="relative z-10">
        <h2 className="font-serif text-7xl text-[#FCD34D] mb-6 drop-shadow-lg">P ♡ A</h2>
        <p className="text-2xl text-[#E2E8F0] mb-8 tracking-widest uppercase font-serif">#PriyaWedArjun</p>
        
        <div className="flex justify-center gap-6 mb-12">
          <a href="#" className="w-12 h-12 rounded-full border border-[#D97706] flex items-center justify-center text-[#FCD34D] hover:bg-[#D97706]/20 transition-colors">
            W
          </a>
          <a href="#" className="w-12 h-12 rounded-full border border-[#D97706] flex items-center justify-center text-[#FCD34D] hover:bg-[#D97706]/20 transition-colors">
            X
          </a>
          <a href="#" className="w-12 h-12 rounded-full border border-[#D97706] flex items-center justify-center text-[#FCD34D] hover:bg-[#D97706]/20 transition-colors">
            IG
          </a>
        </div>

        <p className="text-[#94A3B8] text-sm tracking-widest uppercase">Made with 🤍 in India</p>
      </div>
    </footer>
  );
}

function LanguageSwitcher({ lang, setLang }: { lang: string, setLang: (l: "en" | "ta" | "hi") => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 bg-[#1E1B4B]/90 backdrop-blur border border-[#D97706] rounded-full flex overflow-hidden shadow-[0_0_15px_rgba(217,119,6,0.3)]">
      <button onClick={() => setLang("en")} className={`px-4 py-2 text-sm font-bold transition-colors ${lang === 'en' ? 'bg-[#D97706] text-[#0F0A1E]' : 'text-[#FCD34D] hover:bg-[#D97706]/20'}`}>EN</button>
      <div className="w-px bg-[#D97706]/50"></div>
      <button onClick={() => setLang("ta")} className={`px-4 py-2 text-sm font-bold transition-colors ${lang === 'ta' ? 'bg-[#D97706] text-[#0F0A1E]' : 'text-[#FCD34D] hover:bg-[#D97706]/20'}`}>தமிழ்</button>
      <div className="w-px bg-[#D97706]/50"></div>
      <button onClick={() => setLang("hi")} className={`px-4 py-2 text-sm font-bold transition-colors ${lang === 'hi' ? 'bg-[#D97706] text-[#0F0A1E]' : 'text-[#FCD34D] hover:bg-[#D97706]/20'}`}>हिन्दी</button>
    </div>
  );
}
