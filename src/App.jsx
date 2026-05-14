import { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Pause, Send, Camera, ChevronDown, Quote, Copy, CheckCircle, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [copied, setCopied] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpList, setRsvpList] = useState([
    { name: "Keluarga Besar", message: "Selamat menempuh hidup baru Adit & Ira! Semoga samawa.", status: "Hadir" }
  ]);
  const [formData, setFormData] = useState({ name: '', message: '', status: 'Hadir' });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const audioRef = useRef(null);
  const mempelaiRef = useRef(null);
  const [mempelaiVisible, setMempelaiVisible] = useState(false);

  const weddingDate = new Date('2026-06-01T10:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll('[data-observe]').forEach(el => observer.observe(el));
    }, 200);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (!mempelaiRef.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { setMempelaiVisible(true); observer.disconnect(); }
        },
        { threshold: 0.15 }
      );
      observer.observe(mempelaiRef.current);
      return () => observer.disconnect();
    }, 200);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const toggleMusic = () => {
    if (isPlaying) { audioRef.current.pause(); }
    else { audioRef.current.play().catch(() => {}); }
    setIsPlaying(!isPlaying);
  };

  const openInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
    setTimeout(() => { if (audioRef.current) audioRef.current.play().catch(() => {}); }, 500);
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.message) {
      setRsvpList([formData, ...rsvpList]);

      // Kirim notifikasi ke WhatsApp
      const waNumber = "6285215269015";
      const waMessage = `📩 *RSVP Undangan Resepsi*%0A%0A👤 Nama: ${encodeURIComponent(formData.name)}%0A📋 Status: ${encodeURIComponent(formData.status)}%0A💬 Pesan: ${encodeURIComponent(formData.message)}`;
      const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${waMessage}`;

      // Buka WhatsApp di tab baru (tidak mengganggu halaman undangan)
      window.open(waUrl, '_blank');

      setFormData({ name: '', message: '', status: 'Hadir' });
      setRsvpSubmitted(true);
      setTimeout(() => setRsvpSubmitted(false), 4000);
    }
  };

  const openLightbox = (index) => { setLightboxIndex(index); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  const touchStartX = useRef(0);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextImage() : prevImage(); }
  };

  const photoAdit = "/mempelai-pria.webp";
  const photoIra = "/mempelai-wanita.webp";
  const guestName = new URLSearchParams(window.location.search).get('to') || '';

  const galleryImages = [
    "/galeri/g1.webp", "/galeri/g2.webp", "/galeri/g3.webp",
    "/galeri/g4.webp", "/galeri/g5.webp", "/galeri/g6.webp"
  ];

  // Google Maps - embed with pin marker at exact location
  const mapEmbedUrl = "https://www.google.com/maps?q=-7.737101,113.944502&z=17&output=embed";
  const mapDirectUrl = "https://www.google.com/maps/place/7%C2%B044'13.6%22S+113%C2%B056'40.2%22E/@-7.7370571,113.9444732,19z/data=!4m4!3m3!8m2!3d-7.737101!4d113.944502";


  // Decorative floating elements
  const FloatingElements = ({ variant = 'light' }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-petal opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${7 + Math.random() * 5}s`,
          }}
        >
          {i % 3 === 0 ? (
            <Sparkles size={10 + Math.random() * 6} className={variant === 'light' ? 'text-amber-300/40' : 'text-amber-200/50'} />
          ) : (
            <Heart size={10 + Math.random() * 8} className={variant === 'light' ? 'text-rose-200/40' : 'text-amber-200/40'} fill="currentColor" />
          )}
        </div>
      ))}
    </div>
  );

  // ==================== COVER PAGE ====================
  if (!isOpen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden font-serif">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=60&w=1200&fm=webp" className="w-full h-full object-cover" alt="" loading="eager" decoding="async" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80"></div>
        </div>
        <FloatingElements variant="dark" />

        {/* Decorative corners */}
        <div className="absolute top-6 left-6 w-16 h-16 border-t border-l border-amber-300/30 sm:w-24 sm:h-24"></div>
        <div className="absolute top-6 right-6 w-16 h-16 border-t border-r border-amber-300/30 sm:w-24 sm:h-24"></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b border-l border-amber-300/30 sm:w-24 sm:h-24"></div>
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r border-amber-300/30 sm:w-24 sm:h-24"></div>

        <div className="relative z-10 text-center px-6 animate-fade-in max-w-lg text-white">
          <div className="mb-6 flex justify-center">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-amber-300/30 animate-ping-slow"></div>
              <Heart className="text-amber-300" size={32} fill="currentColor" />
            </div>
          </div>

          <p className="tracking-[0.4em] text-[9px] sm:text-[10px] mb-4 uppercase text-amber-200/90 font-light">The Wedding of</p>

          <div className="relative py-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"></div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight leading-none">
              <span className="block">Adit</span>
              <span className="text-amber-300 text-3xl sm:text-4xl italic font-normal my-2 block">&</span>
              <span className="block">Ira</span>
            </h1>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"></div>
          </div>

          <p className="text-white/50 text-xs italic mt-4 mb-8 tracking-[0.3em]">Senin, 1 Juni 2026</p>

          {/* Nama tamu */}
          <div className="mb-10 py-4">
            <p className="text-white/40 italic font-light tracking-[0.2em] text-[10px] mb-3 uppercase">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            {guestName ? (
              <div className="relative inline-block">
                <p className="text-amber-100 font-serif text-xl sm:text-2xl tracking-wide px-6 py-2">{guestName}</p>
                <div className="absolute left-0 top-1/2 w-4 h-px bg-amber-300/50"></div>
                <div className="absolute right-0 top-1/2 w-4 h-px bg-amber-300/50"></div>
              </div>
            ) : (
              <p className="text-white/60 font-light tracking-widest text-sm">Tamu Undangan</p>
            )}
          </div>

          <button
            onClick={openInvitation}
            className="group relative px-10 py-4 rounded-full font-medium transition-all duration-500 flex items-center gap-3 mx-auto tracking-[0.2em] uppercase text-[10px] sm:text-xs overflow-hidden bg-gradient-to-r from-amber-200 to-amber-300 text-stone-900 hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] active:scale-95"
          >
            <span className="relative z-10">Buka Undangan</span>
            <ChevronDown size={14} className="relative z-10 animate-bounce" />
          </button>
        </div>
      </div>
    );
  }


  // ==================== MAIN CONTENT ====================
  return (
    <div className="min-h-screen bg-[#FFFDF9] font-serif text-stone-800 selection:bg-amber-100 overflow-x-hidden">
      <audio ref={audioRef} loop>
        <source src="/Cinta Terakhir  -  Ari Lasso.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Toggle */}
      <button
        onClick={toggleMusic}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center ${isPlaying ? 'bg-gradient-to-br from-amber-200 to-amber-300 text-stone-800 animate-spin-slow' : 'bg-stone-900 text-amber-200 border border-amber-300/20'}`}
        aria-label={isPlaying ? 'Pause musik' : 'Putar musik'}
      >
        {isPlaying ? <Music size={18} /> : <Pause size={18} />}
      </button>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in-fast" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/60 hover:text-white z-10 p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Tutup">
            <X size={24} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-3 sm:left-6 text-white/60 hover:text-white z-10 p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Sebelumnya">
            <ChevronLeft size={28} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-3 sm:right-6 text-white/60 hover:text-white z-10 p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Selanjutnya">
            <ChevronRight size={28} />
          </button>
          <div className="max-w-[92vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <img src={galleryImages[lightboxIndex]} alt={`Galeri ${lightboxIndex + 1}`} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            {galleryImages.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === lightboxIndex ? 'bg-amber-300 w-6' : 'bg-white/30 hover:bg-white/50'}`} />
            ))}
          </div>
        </div>
      )}

      {/* ==================== HERO ==================== */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=55&w=1400&fm=webp"
            className="w-full h-full object-cover opacity-12"
            style={{ transform: `translateY(${scrollY * 0.25}px) scale(1.15)` }}
            alt="" loading="eager" decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/30 via-[#FFFDF9]/50 to-[#FFFDF9]"></div>
        </div>
        <FloatingElements variant="light" />

        <div className="relative z-10 text-center px-4 max-w-4xl w-full">
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <div className="w-px h-12 sm:h-20 bg-gradient-to-b from-transparent to-amber-300/60 mx-auto mb-4 animate-line-grow"></div>
            <p className="uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[9px] sm:text-[11px] text-stone-400 font-light">The Wedding Celebration of</p>
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-extralight mb-4 sm:mb-6 text-stone-900 tracking-tighter leading-none animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Adit <span className="text-amber-500 font-serif italic text-4xl sm:text-6xl md:text-7xl align-middle">&</span> Ira
          </h1>

          <div className="flex items-center justify-center gap-4 mb-10 sm:mb-14 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-amber-300/60"></div>
            <p className="text-xs sm:text-sm italic text-stone-400 font-light tracking-[0.2em]">01 Juni 2026</p>
            <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-amber-300/60"></div>
          </div>

          {/* Countdown */}
          <div className="flex justify-center gap-3 sm:gap-5 md:gap-8 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            {[
              { val: timeLeft.days, label: 'Hari' },
              { val: timeLeft.hours, label: 'Jam' },
              { val: timeLeft.minutes, label: 'Menit' },
              { val: timeLeft.seconds, label: 'Detik' }
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-md border border-amber-100/80 shadow-[0_4px_30px_rgba(0,0,0,0.04)] flex items-center justify-center mb-2 sm:mb-3 group-hover:border-amber-300/60 transition-colors duration-300">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-light text-stone-800 tabular-nums">{String(unit.val ?? 0).padStart(2, '0')}</span>
                </div>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium">{unit.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 animate-float">
            <ChevronDown size={24} className="mx-auto text-amber-400/60" />
          </div>
        </div>
      </header>


      {/* ==================== QUOTE ==================== */}
      <section className="py-20 sm:py-28 px-6 bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F1]" data-observe>
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative inline-block mb-6">
            <Quote className="text-amber-200" size={36} />
          </div>
          <p className="text-base sm:text-lg md:text-xl leading-[1.9] italic text-stone-600 font-light px-2 mb-6">
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya."
          </p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-amber-300/60"></div>
            <Sparkles size={12} className="text-amber-300" />
            <div className="w-8 h-px bg-amber-300/60"></div>
          </div>
          <p className="font-semibold tracking-[0.3em] text-[10px] text-amber-600/80 uppercase">Q.S Ar-Rum: 21</p>
        </div>
      </section>

      {/* ==================== MEMPELAI ==================== */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto" data-observe>
        <div className="text-center mb-14 sm:mb-20">
          <p className="uppercase tracking-[0.4em] text-[9px] sm:text-[10px] text-amber-600 mb-3 font-medium">Bismillahirrahmanirrahim</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight mb-4 text-stone-800">Mempelai Berbahagia</h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto"></div>
        </div>

        <div ref={mempelaiRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 md:gap-24 items-start">
          {/* Pria */}
          <div className="text-center flex flex-col items-center">
            <div className={`relative mb-6 sm:mb-8 transition-all duration-1000 ${mempelaiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="w-52 h-68 sm:w-60 sm:h-80 md:w-68 md:h-[22rem] relative">
                <div className="absolute -inset-3 border border-amber-200/40 rounded-[2rem]"></div>
                <div className="absolute -inset-1.5 bg-gradient-to-b from-amber-100/20 to-transparent rounded-[1.6rem]"></div>
                <img
                  src={photoAdit}
                  className="w-full h-full object-cover rounded-[1.4rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative z-10"
                  style={{ filter: mempelaiVisible ? 'grayscale(0%)' : 'grayscale(100%)', transition: 'filter 1.2s ease' }}
                  alt="Aditya Novan Firmansyah" loading="eager" decoding="async"
                />
              </div>
            </div>
            <div className={`space-y-2 sm:space-y-3 transition-all duration-1000 delay-300 ${mempelaiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-stone-800">Aditya Novan Firmansyah, S.Kom.</h3>
              <p className="text-stone-400 leading-relaxed italic font-light text-xs sm:text-sm">
                Putra dari Bapak Riyanto & Ibu Nanik Sriningsih
              </p>
            </div>
          </div>

          {/* Separator mobile */}
          <div className="flex items-center justify-center md:hidden -my-4">
            <div className="w-10 h-px bg-amber-200"></div>
            <div className="w-10 h-10 rounded-full border border-amber-200 flex items-center justify-center mx-3">
              <Heart size={16} className="text-amber-400" fill="currentColor" />
            </div>
            <div className="w-10 h-px bg-amber-200"></div>
          </div>

          {/* Wanita */}
          <div className="text-center flex flex-col items-center">
            <div className={`relative mb-6 sm:mb-8 transition-all duration-1000 delay-200 ${mempelaiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="w-52 h-68 sm:w-60 sm:h-80 md:w-68 md:h-[22rem] relative">
                <div className="absolute -inset-3 border border-amber-200/40 rounded-[2rem]"></div>
                <div className="absolute -inset-1.5 bg-gradient-to-b from-amber-100/20 to-transparent rounded-[1.6rem]"></div>
                <img
                  src={photoIra}
                  className="w-full h-full object-cover rounded-[1.4rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative z-10"
                  style={{ filter: mempelaiVisible ? 'grayscale(0%)' : 'grayscale(100%)', transition: 'filter 1.2s ease 0.2s' }}
                  alt="Fitratun Nikmatul Khoiriyah" loading="eager" decoding="async"
                />
              </div>
            </div>
            <div className={`space-y-2 sm:space-y-3 transition-all duration-1000 delay-500 ${mempelaiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-stone-800">Fitratun Nikmatul Khoiriyah, S.P.</h3>
              <p className="text-stone-400 leading-relaxed italic font-light text-xs sm:text-sm">
                Putri dari Bapak Mustaqim & Ibu Patmiharsi
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ==================== LOVE STORY ==================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-[#FBF8F1] to-[#FFFDF9]" data-observe>
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <p className="uppercase tracking-[0.4em] text-[9px] sm:text-[10px] text-amber-600 mb-3 font-medium">Perjalanan Cinta</p>
          <h2 className="text-3xl sm:text-4xl font-extralight font-serif text-stone-800 mb-4">Our Love Story</h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto"></div>
        </div>
        <div className="max-w-lg mx-auto relative">
          <div className="absolute left-5 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-200 via-amber-100 to-transparent sm:-translate-x-1/2"></div>
          {[
            { year: '2017', title: 'Awal Pertemuan', desc: 'Dipertemukan dalam satu kelas selama satu semester. Hanya sekadar saling kenal, namun takdir telah menuliskan cerita yang lebih indah.' },
            { year: 'Sep 2025', title: 'Jatuh Cinta', desc: 'Pertemuan kembali yang tak disangka, menumbuhkan rasa yang begitu cocok — sebuah keajaiban yang tak pernah terbayangkan sebelumnya.' },
            { year: 'Jan 2026', title: 'Melamar Cinta', desc: 'Dengan restu kedua keluarga, janji suci pun dimulai. Sebuah langkah penuh keyakinan untuk menyatukan dua hati dalam satu tujuan.' },
            { year: 'Jun 2026', title: 'Hari Bahagia', desc: 'Akhirnya, hari yang dinantikan tiba. Dua jiwa disatukan dalam ikatan suci pernikahan, atas ridho Allah SWT.' },
          ].map((item, i) => (
            <div key={i} className="reveal-child relative mb-8 sm:mb-12">
              {/* Mobile layout */}
              <div className="block sm:hidden pl-12 relative">
                <div className="absolute left-[14px] top-1 w-3.5 h-3.5 rounded-full bg-amber-300 border-[3px] border-[#FBF8F1] shadow z-10"></div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-50 shadow-sm">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-amber-600 font-bold">{item.year}</span>
                  <h3 className="text-sm font-serif text-stone-800 mt-1 mb-1">{item.title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
              {/* Desktop layout */}
              <div className={`hidden sm:flex items-start w-full ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-[45%] ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-amber-50 shadow-sm inline-block ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-amber-600 font-bold">{item.year}</span>
                    <h3 className="text-base font-serif text-stone-800 mt-1 mb-1">{item.title}</h3>
                    <p className="text-stone-500 text-xs leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-amber-300 border-[3px] border-[#FBF8F1] shadow mt-2"></div>
                <div className="w-[45%]"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== EVENT + MAP ==================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FFFDF9]" data-observe>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="uppercase tracking-[0.4em] text-[9px] sm:text-[10px] text-amber-600 mb-3 font-medium">Jadwal & Lokasi</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight font-serif text-stone-800 mb-4">Waktu & Tempat</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-stretch">
            {/* Event Cards */}
            <div className="lg:col-span-2 flex flex-col gap-5 sm:gap-6">
              {/* Akad */}
              <div className="relative bg-stone-50/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-stone-100 text-center opacity-50">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-stone-200 rounded-full">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-stone-500 font-medium">Selesai</span>
                </div>
                <h3 className="text-lg sm:text-xl font-serif text-stone-500 mb-4 mt-2">Akad Nikah</h3>
                <div className="space-y-2 text-stone-400 text-xs sm:text-sm font-light">
                  <p className="flex items-center justify-center gap-2"><Calendar size={12} /> Rabu, 8 April 2026</p>
                  <p className="flex items-center justify-center gap-2"><MapPin size={12} /> Mangaran, Situbondo</p>
                </div>
              </div>

              {/* Resepsi */}
              <div className="relative bg-gradient-to-br from-white via-amber-50/50 to-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-[0_8px_40px_rgba(217,169,56,0.08)] text-center flex-1">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-300 to-amber-400 rounded-full shadow-md">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-white font-bold flex items-center gap-1">
                    <Heart size={8} fill="white" /> Undangan
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-stone-800 mb-5 mt-3">Resepsi Pernikahan</h3>
                <div className="w-10 h-px bg-amber-200 mx-auto mb-5"></div>
                <div className="space-y-3 text-stone-600 font-light text-sm">
                  <p className="flex items-center justify-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0"><Calendar size={12} className="text-amber-600" /></span>
                    Senin, 1 Juni 2026
                  </p>
                  <p className="flex items-center justify-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0"><Clock size={12} className="text-amber-600" /></span>
                    13.00 - 16.00 WIB
                  </p>
                  <p className="flex items-center justify-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0"><MapPin size={12} className="text-amber-600" /></span>
                    Bugeman, Kendit, Situbondo
                  </p>
                </div>
                <button
                  onClick={() => window.open(mapDirectUrl, '_blank')}
                  className="mt-6 px-6 py-2.5 bg-stone-900 text-white rounded-full text-[10px] uppercase tracking-[0.15em] hover:bg-amber-700 active:scale-95 transition-all duration-300 shadow-lg inline-flex items-center gap-2 font-medium">
                  <MapPin size={11} /> Buka di Google Maps
                </button>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-stone-100 shadow-[0_8px_40px_rgba(0,0,0,0.06)] min-h-[300px] sm:min-h-[400px] lg:min-h-0">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Resepsi - Bugeman, Kendit, Situbondo"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>


      {/* ==================== GALLERY ==================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F1]" data-observe>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="uppercase tracking-[0.4em] text-[9px] sm:text-[10px] text-amber-600 mb-3 font-medium">Kenangan Kami</p>
            <h2 className="text-3xl sm:text-4xl font-extralight mb-4 font-serif text-stone-800">Galeri Kisah</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mb-3"></div>
            <p className="text-stone-400 italic text-xs sm:text-sm font-light">Potret kenangan bahagia kami berdua</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            {galleryImages.map((src, i) => (
              <div
                key={i}
                className="reveal-child aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer relative shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1"
                onClick={() => openLightbox(i)}
              >
                <img
                  src={src}
                  alt={`Momen ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <Camera size={16} className="text-white/80" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== GIFT ==================== */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-[#FBF8F1]" data-observe>
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <p className="uppercase tracking-[0.4em] text-[9px] sm:text-[10px] text-amber-600 mb-3 font-medium">Tanda Kasih</p>
          <h2 className="text-3xl sm:text-4xl font-extralight font-serif text-stone-800 mb-4">Hadiah Pernikahan</h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mb-4"></div>
          <p className="text-stone-400 font-light italic text-xs sm:text-sm max-w-sm mx-auto">Doa restu Anda adalah hadiah terindah. Namun bila ingin berbagi kebahagiaan:</p>
        </div>
        <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Bank Jago */}
          <div className="reveal-child bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-center hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400 border border-amber-50">
            <div className="w-12 h-12 rounded-2xl bg-[#F5CC00]/10 flex items-center justify-center mx-auto mb-3">
              <img src="/bank jago.png" alt="Bank Jago" className="h-7 object-contain" />
            </div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 mb-2 font-medium">Bank Jago</p>
            <p className="text-lg font-serif text-stone-800 mb-0.5 tracking-wider font-medium">1061 6351 0120</p>
            <p className="text-stone-400 text-[10px] mb-4 font-light">a.n. Aditya Novan Firmansyah</p>
            <button
              onClick={() => copyToClipboard('106163510120', 'jago')}
              className="text-[10px] px-5 py-2 rounded-full bg-[#F5CC00]/10 text-[#B8960A] hover:bg-[#F5CC00]/20 active:scale-95 transition-all inline-flex items-center gap-1.5 font-medium">
              {copied === 'jago' ? <CheckCircle size={11} /> : <Copy size={11} />}
              {copied === 'jago' ? 'Tersalin!' : 'Salin'}
            </button>
          </div>
          {/* GoPay */}
          <div className="reveal-child bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-center hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400 border border-sky-50">
            <div className="w-12 h-12 rounded-2xl bg-[#00AED6]/10 flex items-center justify-center mx-auto mb-3">
              <img src="/gopay.png" alt="GoPay" className="h-7 object-contain" />
            </div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 mb-2 font-medium">GoPay</p>
            <p className="text-lg font-serif text-stone-800 mb-0.5 tracking-wider font-medium">0852 1526 9015</p>
            <p className="text-stone-400 text-[10px] mb-4 font-light">a.n. Aditya Novan Firmansyah</p>
            <button
              onClick={() => copyToClipboard('085215269015', 'gopay')}
              className="text-[10px] px-5 py-2 rounded-full bg-[#00AED6]/10 text-[#00AED6] hover:bg-[#00AED6]/20 active:scale-95 transition-all inline-flex items-center gap-1.5 font-medium">
              {copied === 'gopay' ? <CheckCircle size={11} /> : <Copy size={11} />}
              {copied === 'gopay' ? 'Tersalin!' : 'Salin'}
            </button>
          </div>
        </div>
      </section>


      {/* ==================== RSVP ==================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FFFDF9]" data-observe>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="uppercase tracking-[0.4em] text-[9px] sm:text-[10px] text-amber-600 mb-3 font-medium">Ucapan & Doa</p>
            <h2 className="text-3xl sm:text-4xl font-extralight font-serif text-stone-800 mb-4">Konfirmasi Kehadiran</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Form */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-stone-50">
              <p className="text-stone-400 leading-relaxed font-light text-xs sm:text-sm mb-6">Kehadiran dan doa restu Anda merupakan kehormatan yang sangat berarti bagi kami.</p>
              {rsvpSubmitted && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 mb-5 animate-slide-up">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <p className="text-emerald-700 text-xs font-light">Terima kasih! Ucapan Anda telah kami terima.</p>
                </div>
              )}
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50/80 border border-stone-100 rounded-xl px-4 py-3.5 focus:border-amber-300 focus:bg-white outline-none transition-all font-light text-sm placeholder:text-stone-300"
                    required
                  />
                </div>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-stone-50/80 border border-stone-100 rounded-xl px-4 py-3.5 text-stone-600 outline-none focus:border-amber-300 focus:bg-white transition-all text-sm"
                >
                  <option value="Hadir">Insya Allah Hadir</option>
                  <option value="Tidak Hadir">Berhalangan Hadir</option>
                </select>
                <textarea
                  rows="3"
                  placeholder="Ucapan & Doa Restu..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-stone-50/80 border border-stone-100 rounded-xl px-4 py-3.5 text-stone-600 outline-none focus:border-amber-300 focus:bg-white transition-all font-light text-sm resize-none placeholder:text-stone-300"
                  required
                ></textarea>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 tracking-[0.1em] text-xs uppercase shadow-lg">
                  Kirim Ucapan <Send size={13} />
                </button>
              </form>
            </div>

            {/* Messages */}
            <div className="bg-gradient-to-b from-stone-50 to-white rounded-[2rem] p-6 sm:p-8 border border-stone-100">
              <h3 className="text-lg sm:text-xl font-serif mb-6 text-stone-700 flex items-center gap-2">
                <Heart size={16} className="text-amber-400" fill="currentColor" />
                Doa & Restu
              </h3>
              <div className="space-y-5 max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                {rsvpList.map((rsvp, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 border border-stone-50 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-stone-800 text-xs tracking-wide">{rsvp.name}</span>
                      <span className={`text-[8px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${rsvp.status === 'Hadir' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {rsvp.status}
                      </span>
                    </div>
                    <p className="text-stone-500 text-xs leading-relaxed italic font-light">"{rsvp.message}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative py-20 sm:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-stone-950">
          <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=20&w=800&fm=webp" className="w-full h-full object-cover opacity-[0.06]" alt="" loading="lazy" />
        </div>
        <FloatingElements variant="dark" />
        <div className="relative z-10 px-6">
          <div className="mb-6">
            <Heart size={24} className="text-amber-400/60 mx-auto" fill="currentColor" />
          </div>
          <p className="text-stone-500 tracking-[0.3em] uppercase text-[8px] sm:text-[9px] mb-6 font-medium">Sampai Jumpa di Hari Bahagia Kami</p>
          <h4 className="text-4xl sm:text-6xl md:text-7xl font-extralight text-white mb-4 tracking-tighter">
            Adit <span className="italic text-amber-400 font-normal">&</span> Ira
          </h4>
          <p className="text-stone-500 text-xs italic tracking-wider mb-10">01 . 06 . 2026</p>
          <div className="flex justify-center gap-8 text-stone-600 mb-12">
            <Heart size={16} strokeWidth={1.5} className="hover:text-amber-400 transition-colors cursor-pointer" />
            <Camera size={16} strokeWidth={1.5} className="hover:text-amber-400 transition-colors cursor-pointer" />
            <MapPin size={16} strokeWidth={1.5} className="hover:text-amber-400 transition-colors cursor-pointer" />
          </div>
          <div className="w-12 h-px bg-stone-700 mx-auto mb-4"></div>
          <p className="text-[8px] text-stone-700 uppercase tracking-[0.4em]">Made with love &copy; 2026</p>
        </div>
      </footer>


      {/* ==================== STYLES ==================== */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-soft { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.06); opacity: 0.85; } }
        @keyframes petal-fall { 0% { opacity: 0; transform: translateY(-20px) rotate(0deg) translateX(0); } 10% { opacity: 0.6; } 100% { opacity: 0; transform: translateY(100vh) rotate(360deg) translateX(30px); } }
        @keyframes line-grow { from { transform: scaleY(0); transform-origin: top; } to { transform: scaleY(1); transform-origin: top; } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes ping-slow { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }

        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-fade-in-fast { animation: fade-in-fast 0.25s ease-out both; }
        .animate-spin-slow { animation: spin-slow 14s linear infinite; }
        .animate-slide-up { animation: slide-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        .animate-petal { animation: petal-fall 9s ease-in infinite; }
        .animate-line-grow { animation: line-grow 1.5s ease-out forwards; }
        .animate-float { animation: float 3.5s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 2.5s ease-out infinite; }

        [data-observe] { opacity: 0; transform: translateY(36px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
        [data-observe].is-visible { opacity: 1; transform: translateY(0); }
        [data-observe].is-visible .reveal-child { animation: slide-up 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        [data-observe].is-visible .reveal-child:nth-child(1) { animation-delay: 0.04s; }
        [data-observe].is-visible .reveal-child:nth-child(2) { animation-delay: 0.1s; }
        [data-observe].is-visible .reveal-child:nth-child(3) { animation-delay: 0.16s; }
        [data-observe].is-visible .reveal-child:nth-child(4) { animation-delay: 0.22s; }
        [data-observe].is-visible .reveal-child:nth-child(5) { animation-delay: 0.28s; }
        [data-observe].is-visible .reveal-child:nth-child(6) { animation-delay: 0.34s; }

        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5c87b; border-radius: 10px; }

        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        img { image-rendering: auto; }

        /* Glass morphism support */
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-sm { backdrop-filter: blur(8px); }
          .backdrop-blur-md { backdrop-filter: blur(12px); }
        }
      `}} />
    </div>
  );
};

export default App;