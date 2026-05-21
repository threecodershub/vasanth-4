import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Sun, Moon, Heart, Share2, Copy, Check, Printer, Calendar, Download, ChevronLeft, ChevronRight, Music, VolumeX, MessageCircleHeart } from "lucide-react";

declare global { 
  interface Window { 
    gsap: any; 
    ScrollTrigger: any; 
    QRCode: any; 
  } 
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [lang, setLang] = useState<"en" | "ta" | "hi">("en");
  const [theme, setTheme] = useState<"dark" | "day">("dark");

  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }
  }, []);

  return (
    <div 
      className="text-foreground font-sans min-h-screen relative overflow-hidden transition-colors duration-500 bg-background" 
      lang={lang}
      data-theme={theme}
      style={{ backgroundColor: theme === 'day' ? '#F5F0FF' : 'transparent' }}
    >
      {/* Background gradients via Tailwind - handled differently for day/night so we use style/classes carefully. */}
      {theme === "dark" && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0A1E] to-[#1E1B4B] pointer-events-none -z-10" />
      )}

      <AnimatePresence>
        {!opened && <Gate onOpen={() => setOpened(true)} lang={lang} theme={theme} />}
      </AnimatePresence>

      {opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Hero lang={lang} theme={theme} />
          <Story lang={lang} theme={theme} />
          <Timeline lang={lang} theme={theme} />
          <MuhurthamSpecial lang={lang} theme={theme} />
          <FamilyBlessings lang={lang} theme={theme} />
          <GuestWishes lang={lang} theme={theme} />
          <RSVP lang={lang} theme={theme} />
          <Venue lang={lang} theme={theme} />
          <Gallery lang={lang} theme={theme} />
          <LiveStream lang={lang} theme={theme} />
          <SmartSharing lang={lang} theme={theme} />
          <Footer lang={lang} theme={theme} />
        </motion.div>
      )}

      <LanguageThemeSwitcher lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
    </div>
  );
}

function Gate({ onOpen, lang, theme }: { onOpen: () => void; lang: string; theme: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [webglReady, setWebglReady] = useState<boolean | null>(null);
  const threeRef = useRef<any>({});

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

  // Test WebGL support before initializing Three.js
  const testWebGL = () => {
    try {
      const testCanvas = document.createElement("canvas");
      const ctx = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      return !!ctx;
    } catch (_) {
      return false;
    }
  };

  useEffect(() => {
    const supported = testWebGL();
    setWebglReady(supported);
    if (!supported) return;

    const THREE = (window as any).THREE;
    if (!THREE || !mountRef.current) { setWebglReady(false); return; }

    const mount = mountRef.current;
    let renderer: any = null;
    let animId = 0;

    const onResize = () => {
      if (!renderer) return;
      const nw = mount.clientWidth; const nh = mount.clientHeight;
      threeRef.current.camera.aspect = nw / nh;
      threeRef.current.camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    try {
    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;

    // ── Scene ──────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === "day" ? 0xF5F0FF : 0x0A0618);
    scene.fog = new THREE.FogExp2(theme === "day" ? 0xF5F0FF : 0x0A0618, 0.06);

    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.set(0, 0, 4.5);
    threeRef.current.camera = camera;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ── Lighting ───────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x2D1B69, 1.2));

    const goldLight = new THREE.PointLight(0xD97706, 4, 18);
    goldLight.position.set(0, 3, 3);
    goldLight.castShadow = true;
    scene.add(goldLight);

    const rimLight = new THREE.PointLight(0xFCD34D, 2.5, 12);
    rimLight.position.set(0, -1, 2);
    scene.add(rimLight);

    const purpleLight = new THREE.PointLight(0x6D28D9, 2, 20);
    purpleLight.position.set(0, 0, -3);
    scene.add(purpleLight);

    // ── Door canvas texture ────────────────────────────────────────────
    const makeDoorTexture = () => {
      const cv = document.createElement("canvas");
      cv.width = 512; cv.height = 1024;
      const ctx = cv.getContext("2d")!;

      const bg = ctx.createLinearGradient(0, 0, 512, 1024);
      bg.addColorStop(0, "#1A1650");
      bg.addColorStop(0.5, "#251F70");
      bg.addColorStop(1, "#1A1650");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 512, 1024);

      // Outer gold frame
      ctx.strokeStyle = "#D97706"; ctx.lineWidth = 14;
      ctx.strokeRect(18, 18, 476, 988);
      ctx.strokeStyle = "#FCD34D"; ctx.lineWidth = 4;
      ctx.strokeRect(32, 32, 448, 960);

      // Diagonal diamond grid
      ctx.strokeStyle = "rgba(217,119,6,0.25)"; ctx.lineWidth = 1;
      for (let y = 50; y < 970; y += 90) {
        for (let x = 50; x < 460; x += 90) {
          ctx.beginPath();
          ctx.moveTo(x + 45, y);
          ctx.lineTo(x + 90, y + 45);
          ctx.lineTo(x + 45, y + 90);
          ctx.lineTo(x, y + 45);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x + 45, y + 45, 10, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(252,211,77,0.18)"; ctx.stroke();
          ctx.strokeStyle = "rgba(217,119,6,0.25)";
        }
      }

      // Lotus helper
      const lotus = (cx: number, cy: number, r: number) => {
        ctx.save(); ctx.translate(cx, cy);
        for (let i = 0; i < 8; i++) {
          ctx.save(); ctx.rotate((i * Math.PI) / 4);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(r * 0.55, -r * 0.5, 0, -r);
          ctx.quadraticCurveTo(-r * 0.55, -r * 0.5, 0, 0);
          ctx.fillStyle = "rgba(217,119,6,0.18)";
          ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
          ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        ctx.beginPath(); ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = "#FCD34D"; ctx.fill();
        ctx.restore();
      };
      lotus(256, 160, 55);
      lotus(256, 512, 65);
      lotus(256, 860, 55);

      // Peacock arc motif
      ctx.strokeStyle = "rgba(109,40,217,0.35)"; ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(256, 350);
        ctx.quadraticCurveTo(256 + (i - 2) * 45, 420, 256 + (i - 2) * 65, 490);
        ctx.stroke();
      }

      return new THREE.CanvasTexture(cv);
    };

    const tex = makeDoorTexture();

    // ── Door meshes ────────────────────────────────────────────────────
    const DW = 1.55; const DH = 4.4; const DD = 0.13;
    const doorGeo = new THREE.BoxGeometry(DW, DH, DD);

    const doorMat = (t: any) => new THREE.MeshStandardMaterial({
      map: t, metalness: 0.35, roughness: 0.65,
    });

    // Left pivot at left edge of left door (x = -DW)
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-DW, 0, 0);
    scene.add(leftPivot);
    const leftDoor = new THREE.Mesh(doorGeo, doorMat(tex));
    leftDoor.position.set(DW / 2, 0, 0);
    leftDoor.castShadow = true; leftDoor.receiveShadow = true;
    leftPivot.add(leftDoor);

    // Right pivot at right edge of right door (x = +DW)
    const rightPivot = new THREE.Group();
    rightPivot.position.set(DW, 0, 0);
    scene.add(rightPivot);
    const rightDoor = new THREE.Mesh(doorGeo, doorMat(tex));
    rightDoor.position.set(-DW / 2, 0, 0);
    rightDoor.castShadow = true; rightDoor.receiveShadow = true;
    rightPivot.add(rightDoor);

    // ── Gold frame ─────────────────────────────────────────────────────
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xD97706, metalness: 0.85, roughness: 0.15 });
    const addBox = (ww: number, hh: number, dd: number, x: number, y: number, z: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(ww, hh, dd), frameMat);
      m.position.set(x, y, z);
      scene.add(m);
    };
    addBox(DW * 2 + 0.15, 0.18, DD + 0.06, 0, DH / 2 + 0.09, 0);   // top
    addBox(DW * 2 + 0.15, 0.18, DD + 0.06, 0, -DH / 2 - 0.09, 0);  // bottom
    addBox(0.15, DH + 0.36, DD + 0.06, -DW - 0.075, 0, 0);           // left side
    addBox(0.15, DH + 0.36, DD + 0.06, DW + 0.075, 0, 0);            // right side
    addBox(0.09, DH, DD + 0.03, 0, 0, 0.03);                          // center seam

    // Gold door knobs
    const knobMat = new THREE.MeshStandardMaterial({ color: 0xFCD34D, metalness: 0.95, roughness: 0.05 });
    const knobGeo = new THREE.SphereGeometry(0.11, 20, 20);
    const lk = new THREE.Mesh(knobGeo, knobMat);
    lk.position.set(-0.16, 0, DD / 2 + 0.11); scene.add(lk);
    const rk = new THREE.Mesh(knobGeo, knobMat);
    rk.position.set(0.16, 0, DD / 2 + 0.11); scene.add(rk);

    // ── Ganesha plane behind doors ─────────────────────────────────────
    const ganeshaMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const ganeshaPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), ganeshaMat);
    ganeshaPlane.position.set(0, 0.2, -0.6);
    scene.add(ganeshaPlane);
    new THREE.TextureLoader().load("/ganesha.png", (t: any) => {
      ganeshaMat.map = t; ganeshaMat.needsUpdate = true;
    });

    // Glow ring behind Ganesha
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xD97706, transparent: true, opacity: 0, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(new THREE.RingGeometry(1.55, 1.75, 64), ringMat);
    ringMesh.position.set(0, 0.2, -0.7);
    scene.add(ringMesh);

    // ── Particle systems ───────────────────────────────────────────────
    const PC = 280;
    const pPos = new Float32Array(PC * 3);
    const pVel: number[] = [];
    for (let i = 0; i < PC; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 1] = Math.random() * 8 + 4;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      pVel.push((Math.random() - 0.5) * 0.012, -(0.015 + Math.random() * 0.02), 0);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xFFFAE0, size: 0.06, transparent: true, opacity: 0, sizeAttenuation: true });
    scene.add(new THREE.Points(pGeo, pMat));

    const FC = 120;
    const fPos = new Float32Array(FC * 3);
    for (let i = 0; i < FC; i++) {
      fPos[i * 3] = (Math.random() - 0.5) * 10;
      fPos[i * 3 + 1] = -Math.random() * 5 - 3;
      fPos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    const fGeo = new THREE.BufferGeometry();
    fGeo.setAttribute("position", new THREE.BufferAttribute(fPos, 3));
    const fMat = new THREE.PointsMaterial({ color: 0xFF6B00, size: 0.09, transparent: true, opacity: 0, sizeAttenuation: true });
    scene.add(new THREE.Points(fGeo, fMat));

    // ── Animation loop ─────────────────────────────────────────────────
    let opening = false;
    let progress = 0;
    let particlesOn = false;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Idle atmosphere
      if (!opening) {
        camera.position.y = Math.sin(t * 0.35) * 0.06;
        goldLight.intensity = 4 + Math.sin(t * 1.4) * 0.7;
        rimLight.intensity = 2.5 + Math.sin(t * 0.9) * 0.4;
      }

      // Opening sequence
      if (opening && progress < 1) {
        progress = Math.min(1, progress + 0.0042); // ~4s
        const e = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const target = Math.PI * 0.84;
        leftPivot.rotation.y = -e * target;
        rightPivot.rotation.y = e * target;

        // Camera gently drifts closer
        camera.position.z = 4.5 - e * 0.7;
        camera.position.y = e * 0.15;

        // Ganesha + glow ring fade in
        ganeshaMat.opacity = Math.min(1, (progress - 0.25) * 1.8);
        ringMat.opacity = Math.min(0.6, (progress - 0.25) * 1.0);
        ringMesh.rotation.z = t * 0.3;

        // Light explosion as doors open
        goldLight.intensity = 4 + e * 6;
        purpleLight.intensity = 2 + e * 3;

        // Activate particles from 30% open
        if (progress > 0.3) {
          pMat.opacity = Math.min(0.9, (progress - 0.3) * 1.6);
          fMat.opacity = Math.min(0.85, (progress - 0.3) * 1.4);
          particlesOn = true;
        }
      }

      // Update particles
      if (particlesOn) {
        const pp = pGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < PC; i++) {
          pp[i * 3] += pVel[i * 3] + Math.sin(t + i * 0.5) * 0.003;
          pp[i * 3 + 1] += pVel[i * 3 + 1];
          if (pp[i * 3 + 1] < -5) { pp[i * 3 + 1] = 7; pp[i * 3] = (Math.random() - 0.5) * 12; }
        }
        pGeo.attributes.position.needsUpdate = true;

        const fp = fGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < FC; i++) {
          fp[i * 3 + 1] += 0.025 + Math.random() * 0.01;
          fp[i * 3] += Math.sin(t + i) * 0.005;
          if (fp[i * 3 + 1] > 5) { fp[i * 3 + 1] = -4; fp[i * 3] = (Math.random() - 0.5) * 10; }
        }
        fGeo.attributes.position.needsUpdate = true;
      }

      // Ganesha gentle float
      ganeshaPlane.position.y = 0.2 + Math.sin(t * 0.5) * 0.04;
      ganeshaPlane.rotation.z = Math.sin(t * 0.25) * 0.012;

      renderer.render(scene, camera);
    };
    animate();

    threeRef.current.startOpening = () => { opening = true; };
    window.addEventListener("resize", onResize);

    } catch (err) {
      console.warn("Three.js init failed, using CSS fallback", err);
      setWebglReady(false);
      try {
        if (renderer && mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      } catch (_) {}
    }

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      try {
        if (renderer) {
          renderer.dispose();
          if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        }
      } catch (_) {}
    };
  }, [theme]);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Richer temple bell — multiple harmonics
    try {
      const ac = new (window.AudioContext || (window as any).webkitAudioContext)();
      [220, 440, 660, 880, 1100].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.5 / (i + 1), ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 4);
        osc.connect(gain); gain.connect(ac.destination);
        osc.start(ac.currentTime + i * 0.04);
        osc.stop(ac.currentTime + 4);
      });
    } catch (_) {}

    threeRef.current.startOpening?.();
    setTimeout(() => setShowContent(true), 2000);
  };

  const bgCol = theme === "day" ? "#F5F0FF" : "#0A0618";
  const doorCol = theme === "day" ? "#EDE9FF" : "#1E1B4B";

  return (
    <motion.div className="fixed inset-0 z-50" style={{ backgroundColor: bgCol }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>

      {/* ── Three.js mount (shown when WebGL ready or still loading) ── */}
      {webglReady !== false && (
        <div ref={mountRef} className="absolute inset-0 cursor-pointer" onClick={handleClick} />
      )}

      {/* ── CSS fallback gate (shown when WebGL fails) ── */}
      {webglReady === false && (
        <div className={`absolute inset-0 flex ${isOpening ? 'pointer-events-none' : 'cursor-pointer'}`} onClick={handleClick}
          style={{ perspective: "1500px" }}>
          {/* Left door */}
          <div className="w-1/2 h-full border-r-4 border-[#D97706] relative overflow-hidden shadow-[inset_-20px_0_50px_rgba(0,0,0,0.5)]"
            style={{
              backgroundColor: doorCol,
              transformOrigin: "left center",
              transform: isOpening ? "rotateY(-88deg)" : "rotateY(0deg)",
              transition: "transform 3s cubic-bezier(0.25,1,0.5,1)",
              transformStyle: "preserve-3d",
            }}>
            <div className="absolute inset-0 opacity-25">
              <svg width="100%" height="100%"><defs><pattern id="dp-l" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#D97706" strokeWidth="2"/><circle cx="50" cy="50" r="20" fill="none" stroke="#FCD34D" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#dp-l)"/></svg>
            </div>
            {/* Ganesha silhouette on left door */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <img src="/ganesha.png" alt="" className="w-48 h-48 object-contain" style={{ filter: "sepia(1) hue-rotate(15deg) saturate(2)" }} />
            </div>
          </div>
          {/* Right door */}
          <div className="w-1/2 h-full border-l-4 border-[#D97706] relative overflow-hidden shadow-[inset_20px_0_50px_rgba(0,0,0,0.5)]"
            style={{
              backgroundColor: doorCol,
              transformOrigin: "right center",
              transform: isOpening ? "rotateY(88deg)" : "rotateY(0deg)",
              transition: "transform 3s cubic-bezier(0.25,1,0.5,1)",
              transformStyle: "preserve-3d",
            }}>
            <div className="absolute inset-0 opacity-25">
              <svg width="100%" height="100%"><defs><pattern id="dp-r" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#D97706" strokeWidth="2"/><circle cx="50" cy="50" r="20" fill="none" stroke="#FCD34D" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#dp-r)"/></svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <img src="/ganesha.png" alt="" className="w-48 h-48 object-contain" style={{ filter: "sepia(1) hue-rotate(15deg) saturate(2)" }} />
            </div>
          </div>
        </div>
      )}

      {/* Click prompt — shown for both Three.js and CSS mode */}
      {!isOpening && (
        <div className="absolute bottom-16 w-full text-center animate-pulse pointer-events-none z-20">
          <p className="text-[#FCD34D] font-serif text-2xl tracking-widest drop-shadow-[0_0_12px_rgba(252,211,77,0.9)]">
            {getClickText()}
          </p>
          <p className="text-[#94A3B8] text-sm mt-2 tracking-[0.3em] font-sans">
            {lang === "ta" ? "தெய்வீக அழைப்பு" : lang === "hi" ? "एक दिव्य निमंत्रण" : "A divine invitation awaits"}
          </p>
        </div>
      )}

      {/* HTML overlay after doors open */}
      {showContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          {/* CSS petal shower */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-8%",
                  width: `${7 + Math.random() * 9}px`,
                  height: `${7 + Math.random() * 9}px`,
                  background: i % 4 === 0 ? "#FFF" : i % 4 === 1 ? "#FCD34D" : i % 4 === 2 ? "#D97706" : "#FBBF24",
                  borderRadius: "50% 0 50% 0",
                  animation: `fall ${3 + Math.random() * 4}s linear ${Math.random() * 2}s infinite`,
                  opacity: 0.75,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-center px-6"
          >
            <p className="text-[#FCD34D] font-serif text-sm md:text-base tracking-[0.45em] uppercase mb-5 opacity-80">
              ॐ गणेशाय नमः
            </p>
            <h1 className="font-serif text-5xl md:text-8xl text-[#FCD34D] drop-shadow-[0_0_35px_rgba(217,119,6,0.9)] tracking-wide">
              Priya &amp; Arjun
            </h1>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1.2 }}>
              <p className="mt-7 text-xl md:text-2xl text-[#E2E8F0] font-sans tracking-widest">
                सर्वे भवन्तु सुखिनः
              </p>
              <p className="text-base text-[#94A3B8] italic mt-1">May all beings be happy</p>
            </motion.div>
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}
              onClick={onOpen}
              className="mt-12 pointer-events-auto px-10 py-4 bg-transparent border-2 border-[#D97706] text-[#FCD34D] font-serif text-xl rounded-full hover:bg-[#D97706] hover:text-[#0F0A1E] transition-all duration-500 shadow-[0_0_30px_rgba(217,119,6,0.5)] backdrop-blur-sm"
            >
              {getEnterText()}
            </motion.button>
          </motion.div>
        </div>
      )}

      <style>{`
        @keyframes fall { to { transform: translateY(112vh) rotate(720deg); } }
      `}</style>
    </motion.div>
  );
}

function Hero({ lang, theme }: { lang: string, theme: string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 180]);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    const targetDate = new Date("2024-12-14T00:00:00+05:30").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      setIsPlaying(false);
    } else {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        // Add a gentle vibrato for a slightly "flute" like sound
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 5;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscillatorRef.current = osc;
        setIsPlaying(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative py-20 px-4">
      {/* Music Toggle */}
      <button 
        onClick={toggleMusic} 
        className="absolute top-8 right-8 z-30 p-3 rounded-full border border-[#D97706] bg-[#1E1B4B]/50 backdrop-blur text-[#FCD34D] hover:bg-[#D97706]/20 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)]"
        title="Toggle Music"
      >
        {isPlaying ? <Music size={24} /> : <VolumeX size={24} />}
      </button>

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

      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="font-serif text-6xl md:text-9xl text-[#FCD34D] drop-shadow-[0_5px_15px_rgba(217,119,6,0.6)] mb-6"
        >
          Priya & Arjun
        </motion.h1>
        
        {/* Countdown */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
          className="flex gap-4 md:gap-8 my-8"
        >
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1E1B4B]/80 backdrop-blur border border-[#D97706]/50 rounded-lg flex items-center justify-center text-2xl md:text-3xl font-serif text-[#FCD34D] shadow-[0_0_10px_rgba(217,119,6,0.2)]">
                {String(value).padStart(2, '0')}
              </div>
              <span className={`mt-2 ${theme==='day'?'text-[#1E1B4B]':'text-[#94A3B8]'} uppercase text-[10px] md:text-xs tracking-widest`}>{unit}</span>
            </div>
          ))}
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className={`text-xl md:text-3xl ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'} tracking-widest mb-3 font-medium uppercase`}
        >
          {lang === "ta" ? "சனிக்கிழமை, டிசம்பர் 14, 2024" : lang === "hi" ? "शनिवार, 14 दिसंबर, 2024" : "Saturday, December 14, 2024"}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className={`text-lg md:text-2xl ${theme==='day'?'text-[#1E1B4B]':'text-[#CBD5E1]'} font-serif italic`}
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

function Story({ lang, theme }: { lang: string, theme: string }) {
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

  const bgStyle = theme === 'day' ? { backgroundColor: '#EDE9FF' } : { backgroundColor: 'rgba(30, 27, 75, 0.9)' };

  return (
    <section ref={containerRef} className="h-screen flex items-center overflow-hidden border-t border-[#D97706]/30 relative" style={{ backgroundColor: theme === 'day' ? '#F5F0FF' : '#0F0A1E' }}>
      {theme === "dark" && <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3B0764] to-[#0F0A1E]"></div>}
      
      <div className="story-track flex gap-20 px-[10vw] w-[500vw]">
        {chapters.map((chap, i) => (
          <div key={i} className="w-[80vw] max-w-xl h-[60vh] shrink-0 border border-[#D97706] p-12 rounded-lg flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group" style={bgStyle}>
            <div className="absolute inset-2 border border-[#D97706]/30 rounded opacity-50 pointer-events-none"></div>
            
            <svg viewBox="0 0 100 100" className="w-20 h-20 mb-8 text-[#FCD34D] fill-current group-hover:scale-110 transition-transform duration-500">
               <path d="M50,10 C60,40 90,50 60,60 C50,90 40,60 10,50 C40,40 50,10 50,10 Z" />
            </svg>

            <h3 className="font-serif text-4xl text-[#FCD34D] mb-6 relative z-10">
              {lang === "ta" ? chap.titleTa : chap.title}
            </h3>
            <p className={`text-xl ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'} relative z-10 font-sans italic`}>
              {chap.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Timeline({ lang, theme }: { lang: string, theme: string }) {
  const events = [
    { name: "Mehendi", nameTa: "மெஹந்தி", date: "Dec 11, 4:00 PM", venue: "Kapaleeshwarar Temple, Chennai", dress: "Green / Yellow" },
    { name: "Haldi", nameTa: "ஹல்தி", date: "Dec 12, 10:00 AM", venue: "Kapaleeshwarar Temple, Chennai", dress: "Yellow" },
    { name: "Sangeet", nameTa: "சங்கீத்", date: "Dec 12, 7:00 PM", venue: "Kapaleeshwarar Temple, Chennai", dress: "Glamorous" },
    { name: "Muhurtham", nameTa: "முகூர்த்தம்", date: "Dec 14, 9:00 AM", venue: "Kapaleeshwarar Temple, Chennai", dress: "Traditional Silk" },
    { name: "Lunch Reception", nameTa: "மதிய வரவேற்பு", date: "Dec 14, 1:00 PM", venue: "Kapaleeshwarar Temple, Chennai", dress: "Formal / Traditional" },
  ];

  return (
    <section className="py-32 px-4 max-w-5xl mx-auto border-t border-[#D97706]/30">
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
            <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] border border-[#D97706]/50 ${theme==='day'?'bg-[#EDE9FF]':'bg-[#1E1B4B]/80'} backdrop-blur p-8 rounded-lg ml-auto md:ml-0 hover:bg-[#3B0764]/10 transition-colors shadow-xl`}>
              <h3 className="text-3xl font-serif text-[#FCD34D] mb-2">{lang === "ta" ? ev.nameTa : ev.name}</h3>
              <p className={`text-xl ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'} font-medium mb-3`}>{ev.date}</p>
              <p className={`text-base ${theme==='day'?'text-[#1E1B4B]/80':'text-[#CBD5E1]'} mb-5`}>{ev.venue}</p>
              <span className="inline-block px-4 py-1.5 bg-[#D97706]/20 border border-[#D97706]/50 rounded-full text-sm font-medium text-[#D97706] md:text-[#FCD34D] uppercase tracking-wider">Dress Code: {ev.dress}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function MuhurthamSpecial({ lang, theme }: { lang: string, theme: string }) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="py-32 px-4 relative overflow-hidden flex justify-center items-center"
      style={{ backgroundColor: theme === 'day' ? '#F5F0FF' : '#0F0A1E' }}
    >
      {/* Background Pulse */}
      {theme === "dark" && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3B0764_0%,_#0F0A1E_70%)] animate-pulse" style={{ animationDuration: '4s' }}></div>
      )}
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className={`relative z-10 w-full max-w-4xl p-1 md:p-2 rounded-2xl ${theme==='day'?'bg-[#EDE9FF]':'bg-[#0F0A1E]'} shadow-[0_0_40px_rgba(217,119,6,0.3)] shimmer-border`}
      >
        <div className="border-4 border-double border-[#D97706] rounded-xl p-8 md:p-16 flex flex-col items-center text-center relative overflow-hidden">
          
          <div className="absolute top-0 w-full flex justify-center mt-[-10px]">
            {/* Swaying Bell */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#FCD34D] fill-current drop-shadow-md origin-top animate-[sway_3s_ease-in-out_infinite_alternate]">
              <path d="M50 0 L50 20 M30 60 Q50 30 70 60 L70 70 L30 70 Z M45 70 L55 70 L55 80 Q50 85 45 80 Z" stroke="#D97706" strokeWidth="4" />
            </svg>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#FCD34D] mt-16 mb-4 uppercase tracking-widest">
            {lang === "ta" ? "முகூர்த்தம்" : "Muhurtham"}
          </h2>
          
          <p className="font-serif text-3xl md:text-6xl text-[#D97706] font-bold my-8">
            December 14, 2024 at 9:30 AM IST
          </p>
          <p className={`text-xl ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'} uppercase tracking-widest mb-10`}>
            Saturday (Shubha Muhurtham)
          </p>

          <h3 className="font-serif text-3xl md:text-5xl text-[#FCD34D] mb-2">கல்யாண வாழ்த்துக்கள்</h3>
          <p className={`text-lg ${theme==='day'?'text-[#1E1B4B]':'text-[#CBD5E1]'} italic mb-10`}>Blessings for a Prosperous Marriage</p>

          <h3 className="font-sans text-3xl md:text-4xl text-[#FCD34D] mb-2">ॐ सह नाववतु</h3>
          <p className={`text-lg ${theme==='day'?'text-[#1E1B4B]':'text-[#CBD5E1]'} italic mb-12`}>May we be protected together</p>

          <div className="flex gap-8 justify-center">
            {/* Lotus */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#D97706] fill-current animate-[float_4s_ease-in-out_infinite]">
              <path d="M50 100 Q40 60 10 50 Q40 40 50 0 Q60 40 90 50 Q60 60 50 100 Z" />
            </svg>
            {/* Diya */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#FCD34D] fill-current animate-[float_4s_ease-in-out_infinite_0.5s]">
               <path d="M20 50 Q50 90 80 50 L20 50 Z" />
               <path d="M50 45 Q40 20 50 10 Q60 20 50 45 Z" fill="#D97706" />
            </svg>
            {/* Banana Leaf - symbolic */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#D97706] fill-current animate-[float_4s_ease-in-out_infinite_1s]">
               <path d="M10 90 Q30 30 90 10 Q70 70 10 90 Z" />
               <path d="M10 90 L90 10" stroke="#0F0A1E" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </motion.div>
      <style>{`
        @keyframes sway {
          0% { transform: rotate(-15deg); }
          100% { transform: rotate(15deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .shimmer-border {
          background: linear-gradient(90deg, transparent, rgba(217,119,6,0.5), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </motion.section>
  );
}

function FamilyBlessings({ lang, theme }: { lang: string, theme: string }) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="py-24 px-4 relative bg-[#0F0A1E]"
      style={{ backgroundColor: theme === 'day' ? '#F5F0FF' : '#0F0A1E' }}
    >
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, #D97706 2px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="font-serif text-4xl md:text-5xl text-center text-[#FCD34D] mb-4">
          With the Blessings of Our Families
        </h2>
        <h3 className="font-serif text-2xl text-center text-[#D97706] mb-16">
          குடும்பத்தாரின் ஆசீர்வாதத்துடன்
        </h3>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Bride's Family */}
          <div className={`border-2 border-[#D97706] rounded-xl p-8 relative flex flex-col items-center text-center ${theme==='day'?'bg-[#EDE9FF]':'bg-[#1E1B4B]'} shadow-xl`}>
            <div className="absolute -top-6 bg-[#0F0A1E] p-2 rounded-full border-2 border-[#D97706]" style={{ backgroundColor: theme==='day'?'#F5F0FF':'#0F0A1E' }}>
               <svg viewBox="0 0 24 24" width="24" height="24" className="text-[#FCD34D]" fill="currentColor"><path d="M2 22h20v-2H2v2zm9-4h2v-5h5l-6-6-6 6h5v5z"/></svg>
            </div>
            <h3 className="font-serif text-3xl text-[#FCD34D] mt-4 mb-6 border-b border-[#D97706]/30 pb-4 w-full">Bride's Family</h3>
            
            <div className="space-y-4 w-full">
              <div>
                <p className="text-[#D97706] text-sm uppercase tracking-wider mb-1">Grandparents</p>
                <p className={`font-serif text-lg ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'}`}>Shri Ramasamy & Smt. Meenakshi <span className="text-xs text-[#94A3B8]">(Paternal)</span></p>
                <p className={`font-serif text-lg ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'}`}>Shri Krishnan & Smt. Kamakshi <span className="text-xs text-[#94A3B8]">(Maternal)</span></p>
              </div>
              <div className="pt-4 border-t border-[#D97706]/20">
                <p className="text-[#D97706] text-sm uppercase tracking-wider mb-1">Parents</p>
                <p className={`font-serif text-xl ${theme==='day'?'text-[#1E1B4B]':'text-[#FCD34D]'}`}>Shri Subramaniam Iyer & Smt. Vijayalakshmi</p>
              </div>
              <div className="pt-6">
                <p className="text-[#94A3B8] text-sm italic">Proudly hosted by Subramaniam Iyer family</p>
              </div>
            </div>
          </div>

          {/* Groom's Family */}
          <div className={`border-2 border-[#D97706] rounded-xl p-8 relative flex flex-col items-center text-center ${theme==='day'?'bg-[#EDE9FF]':'bg-[#1E1B4B]'} shadow-xl`}>
            <div className="absolute -top-6 bg-[#0F0A1E] p-2 rounded-full border-2 border-[#D97706]" style={{ backgroundColor: theme==='day'?'#F5F0FF':'#0F0A1E' }}>
               <svg viewBox="0 0 24 24" width="24" height="24" className="text-[#FCD34D]" fill="currentColor"><path d="M2 22h20v-2H2v2zm9-4h2v-5h5l-6-6-6 6h5v5z"/></svg>
            </div>
            <h3 className="font-serif text-3xl text-[#FCD34D] mt-4 mb-6 border-b border-[#D97706]/30 pb-4 w-full">Groom's Family</h3>
            
            <div className="space-y-4 w-full">
              <div>
                <p className="text-[#D97706] text-sm uppercase tracking-wider mb-1">Grandparents</p>
                <p className={`font-serif text-lg ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'}`}>Shri Venkataraman & Smt. Saraswathi <span className="text-xs text-[#94A3B8]">(Paternal)</span></p>
                <p className={`font-serif text-lg ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'}`}>Shri Balakrishnan & Smt. Parvathi <span className="text-xs text-[#94A3B8]">(Maternal)</span></p>
              </div>
              <div className="pt-4 border-t border-[#D97706]/20">
                <p className="text-[#D97706] text-sm uppercase tracking-wider mb-1">Parents</p>
                <p className={`font-serif text-xl ${theme==='day'?'text-[#1E1B4B]':'text-[#FCD34D]'}`}>Shri Anand Kumar & Smt. Kavitha</p>
              </div>
              <div className="pt-6">
                <p className="text-[#94A3B8] text-sm italic">Proudly hosted by Anand Kumar family</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="font-serif text-2xl md:text-3xl text-[#FCD34D] italic">"Two souls, two families, one divine union."</p>
        </div>
      </div>
    </motion.section>
  );
}

function GuestWishes({ lang, theme }: { lang: string, theme: string }) {
  const [wishes, setWishes] = useState([
    { id: 1, name: "Anitha Rajan", text: "Wishing you both a lifetime of love, laughter, and togetherness. May your bond grow stronger each day!", hearts: 8, liked: false },
    { id: 2, name: "Karthik Selvam", text: "Priya akka and Arjun anna — you two are simply perfect together. Sending all our love from Coimbatore!", hearts: 12, liked: false },
    { id: 3, name: "Meera Nair", text: "Two kind souls, one beautiful journey. May God bless your union with joy and peace always.", hearts: 5, liked: false },
    { id: 4, name: "Raj & Preethi", text: "From our family to yours — we are overjoyed to celebrate this beautiful beginning. Best wishes!", hearts: 9, liked: false },
    { id: 5, name: "Sundaram Uncle", text: "Kalyanam valazha vaazhtu kuvikindrom! May this sacred union bring both families much happiness.", hearts: 15, liked: false },
    { id: 6, name: "Divya Krishnaswamy", text: "Seeing you both together, even the stars look jealous! Congratulations on your divine wedding.", hearts: 7, liked: false }
  ]);

  const [newName, setNewName] = useState("");
  const [newText, setNewText] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim()) return;

    setWishes([{
      id: Date.now(),
      name: newName,
      text: newText,
      hearts: Math.floor(Math.random() * 10) + 3,
      liked: false,
      photo: photoPreview
    } as any, ...wishes]);

    setNewName("");
    setNewText("");
    setPhotoPreview(null);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const toggleHeart = (id: number) => {
    setWishes(wishes.map(w => {
      if (w.id === id) {
        return { ...w, liked: !w.liked, hearts: w.liked ? w.hearts - 1 : w.hearts + 1 };
      }
      return w;
    }));
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-50px" }}
      className="py-24 px-4 border-t border-[#D97706]/30 relative"
      style={{ backgroundColor: theme === 'day' ? '#F5F0FF' : '#1E1B4B' }}
    >
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 flex justify-center items-center">
          {[...Array(30)].map((_, i) => (
             <div 
               key={i} 
               className="absolute w-2 h-2 md:w-4 md:h-4 bg-[#FCD34D]"
               style={{
                 left: `50%`,
                 top: `50%`,
                 animation: `burst 1s ease-out forwards`,
                 transform: `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 200}px)`,
                 opacity: 0
               }}
             ></div>
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-5xl text-center text-[#FCD34D] mb-4">Wishes Wall</h2>
        <h3 className="font-serif text-2xl text-center text-[#D97706] mb-12">வாழ்த்துச் சுவர்</h3>

        <div className="grid lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-1">
            <div className={`p-6 border border-[#D97706] rounded-xl shadow-xl sticky top-24 ${theme==='day'?'bg-[#EDE9FF]':'bg-[#0F0A1E]'}`}>
              <h3 className="font-serif text-2xl text-[#FCD34D] mb-6 flex items-center gap-2">
                <MessageCircleHeart className="text-[#D97706]"/> Leave a Wish
              </h3>
              <form onSubmit={submitWish} className="space-y-4">
                <div>
                  <input type="text" placeholder="Your Name" value={newName} onChange={e => setNewName(e.target.value)} required maxLength={50}
                    className={`w-full p-3 rounded-lg border border-[#D97706]/50 focus:border-[#FCD34D] outline-none ${theme==='day'?'bg-white text-[#1E1B4B]':'bg-[#1E1B4B] text-white'}`}
                  />
                </div>
                <div>
                  <textarea placeholder="Your wishes for the couple..." value={newText} onChange={e => setNewText(e.target.value)} required maxLength={200} rows={4}
                    className={`w-full p-3 rounded-lg border border-[#D97706]/50 focus:border-[#FCD34D] outline-none resize-none ${theme==='day'?'bg-white text-[#1E1B4B]':'bg-[#1E1B4B] text-white'}`}
                  />
                  <div className="text-right text-xs text-[#D97706] mt-1">{newText.length}/200</div>
                </div>
                <div>
                  <label className={`block w-full p-3 rounded-lg border border-dashed border-[#D97706]/50 text-center cursor-pointer hover:bg-[#D97706]/10 transition-colors ${theme==='day'?'bg-white':'bg-[#1E1B4B]'}`}>
                    <span className="text-[#D97706] text-sm flex items-center justify-center gap-2">
                      <CameraIcon /> {photoPreview ? "Photo Selected (Click to change)" : "Add an Optional Photo"}
                    </span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {photoPreview && (
                    <div className="mt-2 w-20 h-20 mx-auto rounded-lg overflow-hidden border border-[#D97706]">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <button type="submit" className="w-full py-3 bg-[#D97706] text-[#0F0A1E] font-bold rounded-lg hover:bg-[#FCD34D] transition-colors shadow-[0_0_15px_rgba(217,119,6,0.4)]">
                  Send Wishes
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            <AnimatePresence>
              {wishes.map((wish) => (
                <motion.div 
                  key={wish.id}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className={`p-6 border border-[#D97706]/50 rounded-xl hover:scale-[1.02] transition-transform ${theme==='day'?'bg-gradient-to-br from-[#EDE9FF] to-white':'bg-gradient-to-br from-[#3B0764] to-[#1E1B4B]'}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {wish.photo ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D97706] shrink-0">
                        <img src={wish.photo} className="w-full h-full object-cover" alt={wish.name} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#0F0A1E] border border-[#D97706] flex justify-center items-center text-[#FCD34D] font-serif text-xl shrink-0 shadow-inner">
                        {wish.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif text-lg text-[#FCD34D]">{wish.name}</h4>
                      <p className="text-xs text-[#94A3B8]">Guest</p>
                    </div>
                  </div>
                  <p className={`text-sm ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'} italic leading-relaxed mb-4`}>
                    "{wish.text}"
                  </p>
                  <div className="flex justify-end">
                    <button onClick={() => toggleHeart(wish.id)} className="flex items-center gap-2 text-sm">
                      <Heart size={18} className={`transition-colors ${wish.liked ? 'fill-red-500 text-red-500' : 'text-[#D97706]'}`} />
                      <span className="text-[#94A3B8]">{wish.hearts}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes burst {
          0% { transform: scale(0) rotate(0); opacity: 1; }
          100% { transform: scale(1.5) rotate(180deg) translate(50px, -50px); opacity: 0; }
        }
      `}</style>
    </motion.section>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  );
}

function RSVP({ lang, theme }: { lang: string, theme: string }) {
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
    <section className="py-24 px-4 border-t border-[#D97706]/30 relative overflow-hidden" style={{ backgroundColor: theme === 'day' ? '#F5F0FF' : '#0F0A1E' }}>
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

      <div className={`max-w-xl mx-auto border-2 border-[#D97706] rounded-xl p-10 shadow-2xl relative z-10 ${theme==='day'?'bg-[#EDE9FF]':'bg-[#1E1B4B]'}`}>
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
               <button onClick={handleDownloadICS} className={`px-4 py-2 border border-[#D97706] rounded text-[#D97706] md:text-[#FCD34D] hover:bg-[#D97706]/20 font-medium ${theme==='day'?'bg-white':'bg-[#0F0A1E]'}`}>
                 Add to Apple Calendar
               </button>
               <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Priya+%26+Arjun+Wedding&dates=20241214T033000Z/20241214T153000Z&details=Join+us+for+the+celebration&location=Kapaleeshwarar+Temple,+Chennai" target="_blank" rel="noreferrer" className={`px-4 py-2 border border-[#D97706] rounded text-[#D97706] md:text-[#FCD34D] hover:bg-[#D97706]/20 font-medium ${theme==='day'?'bg-white':'bg-[#0F0A1E]'}`}>
                 Add to Google Calendar
               </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label className={`block ${theme==='day'?'text-[#1E1B4B]':'text-[#CBD5E1]'} mb-2 text-lg`}>Name</label>
              <input {...register("name")} className={`w-full border border-[#D97706]/50 rounded-lg px-4 py-3 text-lg focus:border-[#FCD34D] focus:ring-1 focus:ring-[#FCD34D] outline-none transition-all ${theme==='day'?'bg-white text-[#1E1B4B]':'bg-[#0F0A1E] text-white'}`} required />
            </div>
            <div>
              <label className={`block ${theme==='day'?'text-[#1E1B4B]':'text-[#CBD5E1]'} mb-2 text-lg`}>Phone</label>
              <input {...register("phone")} type="tel" className={`w-full border border-[#D97706]/50 rounded-lg px-4 py-3 text-lg focus:border-[#FCD34D] outline-none transition-all ${theme==='day'?'bg-white text-[#1E1B4B]':'bg-[#0F0A1E] text-white'}`} required />
            </div>
            
            <div className="flex gap-6">
              <div className="flex-1">
                <label className={`block ${theme==='day'?'text-[#1E1B4B]':'text-[#CBD5E1]'} mb-2 text-lg`}>Guests</label>
                <div className={`flex items-center border border-[#D97706]/50 rounded-lg overflow-hidden ${theme==='day'?'bg-white':'bg-[#0F0A1E]'}`}>
                  <button type="button" onClick={() => setValue('guests', Math.max(1, formVals.guests - 1))} className="px-4 py-3 text-[#D97706] hover:bg-[#D97706]/20 font-bold">-</button>
                  <input {...register("guests")} type="number" className={`w-full bg-transparent text-center outline-none ${theme==='day'?'text-[#1E1B4B]':'text-white'}`} readOnly />
                  <button type="button" onClick={() => setValue('guests', formVals.guests + 1)} className="px-4 py-3 text-[#D97706] hover:bg-[#D97706]/20 font-bold">+</button>
                </div>
              </div>
              <div className="flex-1">
                <label className={`block ${theme==='day'?'text-[#1E1B4B]':'text-[#CBD5E1]'} mb-2 text-lg`}>Meal</label>
                <div className={`flex border border-[#D97706]/50 rounded-lg overflow-hidden p-1 ${theme==='day'?'bg-white':'bg-[#0F0A1E]'}`}>
                  <button type="button" onClick={() => setValue('meal', 'Veg')} className={`flex-1 py-2 rounded ${formVals.meal === 'Veg' ? 'bg-[#D97706] text-[#0F0A1E] font-bold' : (theme==='day'?'text-[#1E1B4B]':'text-[#CBD5E1]')}`}>Veg</button>
                  <button type="button" onClick={() => setValue('meal', 'Non-Veg')} className={`flex-1 py-2 rounded ${formVals.meal === 'Non-Veg' ? 'bg-[#D97706] text-[#0F0A1E] font-bold' : (theme==='day'?'text-[#1E1B4B]':'text-[#CBD5E1]')}`}>Non-Veg</button>
                </div>
              </div>
            </div>

            <div>
              <label className={`block ${theme==='day'?'text-[#1E1B4B]':'text-[#CBD5E1]'} mb-2 text-lg`}>Attending</label>
              <div className={`flex border border-[#D97706]/50 rounded-lg overflow-hidden p-1 ${theme==='day'?'bg-white':'bg-[#0F0A1E]'}`}>
                {['Yes', 'No', 'Maybe'].map(opt => (
                   <button key={opt} type="button" onClick={() => setValue('attending', opt as any)} className={`flex-1 py-2 rounded ${formVals.attending === opt ? 'bg-[#FCD34D] text-[#0F0A1E] font-bold' : ((theme==='day'?'text-[#1E1B4B]':'text-[#CBD5E1]') + ' hover:bg-[#D97706]/10')}`}>{opt}</button>
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

function Venue({ lang, theme }: { lang: string, theme: string }) {
  const mapUrl = "https://maps.google.com/maps?q=Kapaleeshwarar+Temple+Chennai&output=embed";
  const mapLink = "https://maps.app.goo.gl/kapaleeshwarar";
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qrRef.current && window.QRCode) {
      qrRef.current.innerHTML = "";
      new window.QRCode(qrRef.current, {
        text: mapLink,
        width: 100,
        height: 100,
        colorDark : theme === "day" ? "#1E1B4B" : "#0F0A1E",
        colorLight : theme === "day" ? "#FCD34D" : "#FCD34D",
      });
    }
  }, [theme]);

  return (
    <section className="py-24 px-4 border-t border-[#D97706]/30" style={{ backgroundColor: theme === 'day' ? '#EDE9FF' : '#1E1B4B' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="md:w-1/2 w-full">
          <div className="border-4 border-[#D97706] rounded-xl overflow-hidden shadow-2xl relative">
             <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-10"></div>
             <iframe 
               src={mapUrl} 
               className="w-full h-96" 
               loading="lazy"
               title="Venue Map"
             ></iframe>
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col justify-center text-center md:text-left">
          <h2 className="font-serif text-6xl text-[#FCD34D] mb-6 drop-shadow-md">Venue</h2>
          <h3 className={`text-3xl ${theme==='day'?'text-[#1E1B4B]':'text-white'} mb-4 font-bold`}>Kapaleeshwarar Temple</h3>
          <p className={`text-xl ${theme==='day'?'text-[#1E1B4B]/80':'text-[#CBD5E1]'} mb-6 leading-relaxed`}>
            Vadada Maada Veedhi,<br/>
            Mylapore, Chennai,<br/>
            Tamil Nadu 600004
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 justify-center md:justify-start">
            <a href={mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#D97706] text-[#0F0A1E] font-bold rounded-full hover:bg-[#FCD34D] transition-colors shadow-lg">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Get Directions
            </a>
            
            <div className="flex items-center gap-4 bg-[#FCD34D] p-2 rounded-lg">
               <div ref={qrRef} className="w-[100px] h-[100px]"></div>
               <p className="text-xs text-[#0F0A1E] font-bold uppercase w-20 text-left">Scan for Map</p>
            </div>
          </div>

          <div className={`p-4 border-l-4 border-[#D97706] ${theme==='day'?'bg-white':'bg-[#0F0A1E]'} rounded-r-lg text-left`}>
             <p className={`text-sm ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'}`}><strong>Parking:</strong> Valet parking available at the East Gopuram entrance.</p>
             <p className={`text-sm ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'} mt-1`}><strong>Accommodation:</strong> Guest rooms booked at Hotel Savera, Mylapore.</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}

function Gallery({ lang, theme }: { lang: string, theme: string }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

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

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null && selectedIdx > 0) setSelectedIdx(selectedIdx - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null && selectedIdx < photos.length - 1) setSelectedIdx(selectedIdx + 1);
  };

  return (
    <section className="py-24 px-4 border-t border-[#D97706]/30" style={{ backgroundColor: theme === 'day' ? '#F5F0FF' : '#0F0A1E' }}>
      <h2 className="font-serif text-5xl text-center text-[#FCD34D] mb-12">Shared Memories</h2>
      
      <div className="max-w-6xl mx-auto mb-10 text-center">
         <label className="cursor-pointer inline-block px-6 py-3 border-2 border-[#D97706] text-[#D97706] md:text-[#FCD34D] font-bold rounded-full hover:bg-[#D97706]/20 transition-colors">
           {lang === "ta" ? "புகைப்படங்களை பதிவேற்றுக" : "Upload Photo"}
           <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
         </label>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
        {photos.map((src, i) => (
          <div key={`photo-${i}`} className="border-2 border-[#D97706] rounded-lg overflow-hidden cursor-pointer relative group" onClick={() => setSelectedIdx(i)}>
            <img src={src} alt="Guest memory" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            {i === 0 && <div className="absolute top-2 right-2 bg-[#0F0A1E]/80 text-[#FCD34D] text-xs px-2 py-1 rounded">New</div>}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="text-[#FCD34D]">+</span>
            </div>
          </div>
        ))}
        {placeholders.map((_, i) => (
          <div key={`place-${i}`} className={`border border-[#D97706]/30 rounded-lg overflow-hidden relative group ${theme==='day'?'bg-[#EDE9FF]':'bg-[#1E1B4B]'}`}>
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
        {selectedIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedIdx(null)}
          >
             <img src={photos[selectedIdx]} className="max-w-full max-h-[85vh] object-contain border-4 border-[#D97706] rounded" alt="Fullscreen" />
             
             {selectedIdx > 0 && (
               <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-[#0F0A1E]/80 border border-[#D97706] text-[#FCD34D] rounded-full hover:bg-[#D97706]/50 transition-colors">
                 <ChevronLeft size={32} />
               </button>
             )}
             
             {selectedIdx < photos.length - 1 && (
               <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-[#0F0A1E]/80 border border-[#D97706] text-[#FCD34D] rounded-full hover:bg-[#D97706]/50 transition-colors">
                 <ChevronRight size={32} />
               </button>
             )}
             
             <button onClick={() => setSelectedIdx(null)} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white font-sans text-xl">
               ✕
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function LiveStream({ lang, theme }: { lang: string, theme: string }) {
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

  const patternColor = theme === 'day' ? '%23EDE9FF' : '%232D2964';
  const bgColor = theme === 'day' ? '#F5F0FF' : '#1E1B4B';
  const bgImage = `url('data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="${bgColor}"/><rect width="1" height="1" fill="${decodeURIComponent(patternColor)}"/></svg>`)}')`;

  return (
    <section className="py-24 px-4 border-t border-[#D97706]/30" style={{ backgroundColor: bgColor, backgroundImage: bgImage }}>
      <div className="max-w-5xl mx-auto text-center bg-[#0F0A1E]/80 backdrop-blur p-8 rounded-xl border border-[#D97706]/30">
        <h2 className="font-serif text-5xl text-[#FCD34D] mb-4">Live Broadcast</h2>
        <p className="text-xl text-[#CBD5E1] mb-12">For our family and friends across the globe.</p>
        
        <div className="flex justify-center gap-4 md:gap-6 mb-12">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0F0A1E] border-2 border-[#D97706] rounded-lg flex items-center justify-center text-2xl md:text-3xl font-serif text-[#FCD34D] shadow-[0_0_10px_rgba(217,119,6,0.3)]">
                {String(value).padStart(2, '0')}
              </div>
              <span className="mt-2 text-[#94A3B8] uppercase text-[10px] md:text-xs tracking-wider">{unit}</span>
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

function SmartSharing({ lang, theme }: { lang: string, theme: string }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const htmlContent = `
      <html>
        <head><title>Priya & Arjun's Wedding Invitation</title></head>
        <body style="font-family: serif; text-align: center; padding: 50px; background: #0F0A1E; color: #FCD34D;">
          <h1 style="font-size: 50px; color: #D97706;">Priya & Arjun</h1>
          <h2>Invite you to their wedding</h2>
          <p>December 14, 2024 at 9:30 AM</p>
          <p>Kapaleeshwarar Temple, Chennai</p>
          <p style="margin-top: 40px; font-style: italic;">We look forward to your presence!</p>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleQR = () => {
    setShowQR(true);
    setTimeout(() => {
      if (qrRef.current && window.QRCode) {
        qrRef.current.innerHTML = "";
        new window.QRCode(qrRef.current, {
          text: window.location.href,
          width: 200,
          height: 200,
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

  const actions = [
    {
      icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.052 0C5.495 0 .104 5.391.101 11.95c-.002 2.098.544 4.14 1.584 5.945L0 24l6.335-1.66c1.737.95 3.686 1.45 5.71 1.451h.004c6.558 0 11.95-5.392 11.953-11.951A11.82 11.82 0 0 0 20.464 3.485"/></svg>,
      label: "WhatsApp",
      sub: "Share invite",
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent("Join us for Priya & Arjun's Wedding on December 14, 2024 at Kapaleeshwarar Temple, Chennai! " + window.location.href)}`, "_blank")
    },
    {
      icon: copied ? <Check className="text-green-500" /> : <Copy className="text-[#D97706]" />,
      label: "Copy Link",
      sub: copied ? "Copied!" : "Share URL",
      onClick: handleCopy
    },
    {
      icon: <Download className="text-[#D97706]" />,
      label: "PDF Invite",
      sub: "Download",
      onClick: handleDownloadPDF
    },
    {
      icon: <Printer className="text-[#D97706]" />,
      label: "QR Card",
      sub: "Digital pass",
      onClick: handleQR
    },
    {
      icon: <Calendar className="text-[#D97706]" />,
      label: "Google",
      sub: "Calendar",
      onClick: () => window.open("https://calendar.google.com/calendar/render?action=TEMPLATE&text=Priya+%26+Arjun+Wedding&dates=20241214T033000Z/20241214T153000Z&details=Join+us+for+the+celebration&location=Kapaleeshwarar+Temple,+Chennai", "_blank")
    },
    {
      icon: <Calendar className="text-[#D97706]" />,
      label: "Apple",
      sub: "Calendar",
      onClick: handleDownloadICS
    },
    {
      icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.052 0C5.495 0 .104 5.391.101 11.95c-.002 2.098.544 4.14 1.584 5.945L0 24l6.335-1.66c1.737.95 3.686 1.45 5.71 1.451h.004c6.558 0 11.95-5.392 11.953-11.951A11.82 11.82 0 0 0 20.464 3.485"/></svg>,
      label: "RSVP Direct",
      sub: "via WhatsApp",
      onClick: () => window.open(`https://wa.me/919876543210?text=${encodeURIComponent("RSVP for Priya & Arjun Wedding: I will be attending!")}`, "_blank")
    }
  ];

  return (
    <section className={`py-24 px-4 border-t border-[#D97706]/30 bg-gradient-to-b ${theme==='day'?'from-[#F5F0FF] to-[#EDE9FF]':'from-[#0F0A1E] to-[#1E1B4B]'}`}>
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-5xl text-[#FCD34D] mb-4">Share the Joy</h2>
        <h3 className="font-serif text-2xl text-[#D97706] mb-8">மகிழ்ச்சியை பகிரவும்</h3>

        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-[#D97706] to-transparent w-32"></div>
          <Share2 className="text-[#FCD34D]" />
          <div className="h-px bg-gradient-to-l from-transparent via-[#D97706] to-transparent w-32"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {actions.map((act, i) => (
            <motion.button 
              key={i}
              whileHover={{ scale: 1.05 }}
              onClick={act.onClick}
              className={`flex flex-col items-center justify-center p-4 border border-[#D97706]/50 rounded-xl hover:bg-[#D97706]/10 hover:border-[#FCD34D] hover:shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all ${theme==='day'?'bg-white':'bg-[#0F0A1E]'}`}
            >
              <div className="mb-3 p-3 rounded-full bg-[#D97706]/10">
                {act.icon}
              </div>
              <span className={`text-sm font-bold ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'}`}>{act.label}</span>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider">{act.sub}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowQR(false)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className={`p-8 border-4 border-[#D97706] rounded-xl text-center max-w-sm w-full ${theme==='day'?'bg-white':'bg-[#0F0A1E]'}`}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-serif text-3xl text-[#FCD34D] mb-6">Your Digital Invite</h3>
            <div className="inline-block p-4 bg-[#FCD34D] rounded-lg mb-6">
              <div ref={qrRef} className="w-[200px] h-[200px]"></div>
            </div>
            <p className={`text-sm ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'} mb-6`}>Scan this code to open the invitation on any device.</p>
            <button onClick={() => setShowQR(false)} className="px-6 py-2 border border-[#D97706] text-[#FCD34D] rounded-full hover:bg-[#D97706]/20">Close</button>
          </motion.div>
        </div>
      )}
    </section>
  );
}

function Footer({ lang, theme }: { lang: string, theme: string }) {
  return (
    <footer className="py-20 border-t border-[#D97706]/50 text-center relative overflow-hidden" style={{ backgroundColor: theme === 'day' ? '#F5F0FF' : '#0F0A1E' }}>
      <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
         <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] fill-none stroke-[#FCD34D]" strokeWidth="0.5">
           {[...Array(12)].map((_, i) => (
             <polygon key={i} points="50,10 60,40 90,50 60,60 50,90 40,60 10,50 40,40" transform={`rotate(${i * 30} 50 50)`} />
           ))}
         </svg>
      </div>
      <div className="relative z-10">
        <h2 className="font-serif text-7xl text-[#FCD34D] mb-6 drop-shadow-lg">P ♡ A</h2>
        <p className={`text-2xl ${theme==='day'?'text-[#1E1B4B]':'text-[#E2E8F0]'} mb-8 tracking-widest uppercase font-serif`}>#PriyaWedArjun</p>
        
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

function LanguageThemeSwitcher({ lang, setLang, theme, setTheme }: { lang: string, setLang: (l: "en" | "ta" | "hi") => void, theme: string, setTheme: (t: "dark" | "day") => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-40 ${theme==='day'?'bg-white/90':'bg-[#1E1B4B]/90'} backdrop-blur border border-[#D97706] rounded-full flex overflow-hidden shadow-[0_0_15px_rgba(217,119,6,0.3)]`}>
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'day' : 'dark')} 
        className={`px-4 py-2 flex items-center justify-center transition-colors border-r border-[#D97706]/50 ${theme==='day'?'text-[#D97706] hover:bg-[#EDE9FF]':'text-[#FCD34D] hover:bg-[#D97706]/20'}`}
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <button onClick={() => setLang("en")} className={`px-4 py-2 text-sm font-bold transition-colors ${lang === 'en' ? 'bg-[#D97706] text-[#0F0A1E]' : (theme==='day'?'text-[#D97706] hover:bg-[#EDE9FF]':'text-[#FCD34D] hover:bg-[#D97706]/20')}`}>EN</button>
      <div className="w-px bg-[#D97706]/50"></div>
      <button onClick={() => setLang("ta")} className={`px-4 py-2 text-sm font-bold transition-colors ${lang === 'ta' ? 'bg-[#D97706] text-[#0F0A1E]' : (theme==='day'?'text-[#D97706] hover:bg-[#EDE9FF]':'text-[#FCD34D] hover:bg-[#D97706]/20')}`}>தமிழ்</button>
      <div className="w-px bg-[#D97706]/50"></div>
      <button onClick={() => setLang("hi")} className={`px-4 py-2 text-sm font-bold transition-colors ${lang === 'hi' ? 'bg-[#D97706] text-[#0F0A1E]' : (theme==='day'?'text-[#D97706] hover:bg-[#EDE9FF]':'text-[#FCD34D] hover:bg-[#D97706]/20')}`}>हिन्दी</button>
    </div>
  );
}
