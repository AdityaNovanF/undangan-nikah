import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Pause, Send, Camera, ChevronDown, Quote, Copy, CheckCircle } from 'lucide-react';

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
  const audioRef = useRef(null);
  const mempelaiRef = useRef(null);
  const [mempelaiVisible, setMempelaiVisible] = useState(false);

  // Set Resepsi date: 2026-06-01
  const weddingDate = new Date('2026-06-01T10:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
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
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.12 }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll('[data-observe]').forEach(el => observer.observe(el));
    }, 200);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [isOpen]);

  // Auto berubah warna saat section mempelai masuk viewport
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (!mempelaiRef.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setMempelaiVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(mempelaiRef.current);
      return () => observer.disconnect();
    }, 200);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Auto-scroll jika 5 detik tidak ada interaksi
  useEffect(() => {
    if (!isOpen) return;
    let hasUserScrolled = false;
    let isAutoScrolling = false;
    let autoScrollTimer = null;
    let rafId = null;

    const onUserScroll = () => {
      if (isAutoScrolling) return; // abaikan scroll dari programmatic
      hasUserScrolled = true;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    };

    window.addEventListener('scroll', onUserScroll, { passive: true });
    // Juga deteksi touch/wheel sebagai interaksi user
    const onInteract = () => { hasUserScrolled = true; };
    window.addEventListener('wheel', onInteract, { passive: true });
    window.addEventListener('touchstart', onInteract, { passive: true });
    window.addEventListener('keydown', onInteract);

    autoScrollTimer = setTimeout(() => {
      if (hasUserScrolled) return;
      isAutoScrolling = true;
      // Matikan smooth scroll CSS agar scrollBy instan dan smooth dikontrol RAF
      document.documentElement.style.scrollBehavior = 'auto';
      const speed = 1.2; // px per frame
      const scrollStep = () => {
        if (hasUserScrolled) { isAutoScrolling = false; document.documentElement.style.scrollBehavior = ''; return; }
        window.scrollBy(0, speed);
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        if (window.scrollY >= maxScroll) { isAutoScrolling = false; document.documentElement.style.scrollBehavior = ''; return; }
        rafId = requestAnimationFrame(scrollStep);
      };
      rafId = requestAnimationFrame(scrollStep);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', onUserScroll);
      window.removeEventListener('wheel', onInteract);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('keydown', onInteract);
      clearTimeout(autoScrollTimer);
      if (rafId) cancelAnimationFrame(rafId);
      document.documentElement.style.scrollBehavior = '';
    };
  }, [isOpen]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play deferred"));
    }
    setIsPlaying(!isPlaying);
  };

  const openInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Autoplay blocked"));
      }
    }, 500);
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.message) {
      setRsvpList([formData, ...rsvpList]);
      setFormData({ name: '', message: '', status: 'Hadir' });
      setRsvpSubmitted(true);
      setTimeout(() => setRsvpSubmitted(false), 4000);
    }
  };

  // Gunakan WebP yang sudah dioptimasi (ukuran jauh lebih kecil)
  const photoAdit = "/mempelai-pria.webp";
  const photoIra = "/mempelai-wanita.webp";

  // Baca nama tamu dari URL: ?to=NamaTamu
  const guestName = new URLSearchParams(window.location.search).get('to') || '';

  const galleryImages = [
    "/galeri/g1.webp",
    "/galeri/g2.webp",
    "/galeri/g3.webp",
    "/galeri/g4.webp",
    "/galeri/g5.webp",
    "/galeri/g6.webp"
  ];

  if (!isOpen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900 text-white overflow-hidden font-serif">
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=60&w=1200&fm=webp" className="w-full h-full object-cover" alt="Latar Belakang Pernikahan" loading="eager" decoding="async" fetchpriority="high" />
        </div>
        <div className="relative z-10 text-center px-6 animate-fade-in">
          <div className="mb-6 flex justify-center">
            <Heart className="text-amber-200 animate-pulse" size={40} />
          </div>
          <p className="tracking-[0.5em] text-sm mb-4 uppercase text-amber-100">Undangan Resepsi Pernikahan</p>
          <h1 className="text-5xl md:text-7xl font-serif mb-10 tracking-tight">Adit & Ira</h1>

          {/* Nama tamu */}
          <div className="mb-8">
            <p className="text-stone-400 italic font-light tracking-widest text-sm mb-2">Kepada Yth.</p>
            {guestName ? (
              <>
                <div className="w-16 h-px bg-amber-400/50 mx-auto mb-3" />
                <p className="text-amber-100 font-serif text-xl md:text-2xl tracking-wide">{guestName}</p>
                <div className="w-16 h-px bg-amber-400/50 mx-auto mt-3" />
              </>
            ) : (
              <p className="text-stone-300 font-light tracking-widest">Bapak/Ibu/Saudara/i</p>
            )}
          </div>

          <button
            onClick={openInvitation}
            className="px-10 py-4 bg-amber-200 text-stone-900 rounded-full font-semibold hover:bg-amber-300 transition-all shadow-2xl flex items-center gap-2 mx-auto tracking-widest uppercase text-xs"
          >
            Buka Undangan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-serif text-stone-800 selection:bg-amber-100 overflow-x-hidden">
      <audio ref={audioRef} loop>
        <source src="/Cinta Terakhir  -  Ari Lasso.mp3" type="audio/x-mp3" />
      </audio>

      <button
        onClick={toggleMusic}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-500 ${isPlaying ? 'bg-amber-200 text-stone-800 animate-spin-slow' : 'bg-stone-800 text-white'}`}
      >
        {isPlaying ? <Music size={24} /> : <Pause size={24} />}
      </button>

      <header className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=55&w=1400&fm=webp"
            className="w-full h-screen object-cover opacity-20 fixed"
            alt="Pernikahan Mewah"
            loading="eager"
            decoding="async"
            fetchpriority="low"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FDFCF8]/30 to-[#FDFCF8]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="mb-10 animate-fade-in">
            <div className="w-px h-24 bg-stone-300 mx-auto mb-6"></div>
            <p className="uppercase tracking-[0.4em] text-sm text-stone-500">The Wedding Celebration of</p>
          </div>
          <h1 className="text-7xl md:text-9xl font-light mb-8 text-stone-900 tracking-tighter">
            Adit <br className="md:hidden" /> <span className="text-amber-600 font-serif">&</span> <br className="md:hidden" /> Ira
          </h1>
          <p className="text-lg md:text-xl italic text-stone-400 font-light tracking-[0.3em] uppercase mb-12">01 . 06 . 2026</p>

          <div className="flex justify-center gap-6 md:gap-12 text-stone-800 animate-slide-up">
            {[
              { val: timeLeft.days, label: 'Hari' },
              { val: timeLeft.hours, label: 'Jam' },
              { val: timeLeft.minutes, label: 'Menit' },
              { val: timeLeft.seconds, label: 'Detik' }
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-light text-amber-700">{unit.val ?? '00'}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] mt-2 text-stone-400">{unit.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-20 animate-bounce opacity-40">
            <ChevronDown size={32} className="mx-auto text-stone-400" />
          </div>
        </div>
      </header>

      <section className="py-32 px-6 bg-[#F9F7F2]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="flex justify-center mb-4">
            <Quote className="text-amber-200" size={50} />
          </div>
          <p className="text-xl md:text-2xl leading-relaxed italic text-stone-600 font-light">
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya."
          </p>
          <div className="w-16 h-px bg-amber-300 mx-auto my-6"></div>
          <p className="font-bold tracking-[0.3em] text-xs text-stone-400 uppercase">Q.S Ar-Rum: 21</p>
        </div>
      </section>

      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4 text-stone-800 font-serif">Mempelai Berbahagia</h2>
          <p className="text-stone-400 italic font-light tracking-widest">Maha Suci Allah yang telah menyatukan kami dalam ikatan suci</p>
        </div>

        <div ref={mempelaiRef} className="grid md:grid-cols-2 gap-32 items-center">
          <div className="group text-center flex flex-col items-center gap-8">
            <div className="relative w-72 h-96 bg-stone-200">
              <div className={`absolute inset-0 border-[0.5px] border-amber-300 transition-all duration-700 ${mempelaiVisible ? 'translate-x-0 translate-y-0' : 'translate-x-4 translate-y-4'}`}></div>
              <div
                className="relative z-10 w-full h-full transition-[filter] duration-1000"
                style={{ filter: mempelaiVisible ? 'grayscale(0%)' : 'grayscale(100%)', transform: 'translateZ(0)' }}
              >
                <img
                  src={photoAdit}
                  className="w-full h-full object-cover shadow-2xl rounded-sm"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                  alt="Aditya Novan Firmansyah"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-serif text-stone-800">Aditya Novan Firmansyah, S.Kom.</h3>
              <p className="text-stone-500 leading-relaxed italic font-light">
                Putra dari Bapak Riyanto <br /> & Ibu Nanik Sriningsih
              </p>
            </div>
          </div>

          <div className="group text-center flex flex-col items-center gap-8">
            <div className="relative w-72 h-96 bg-stone-200">
              <div className={`absolute inset-0 border-[0.5px] border-amber-300 transition-all duration-700 delay-200 ${mempelaiVisible ? 'translate-x-0 translate-y-0' : '-translate-x-4 translate-y-4'}`}></div>
              <div
                className="relative z-10 w-full h-full transition-[filter] duration-1000 delay-200"
                style={{ filter: mempelaiVisible ? 'grayscale(0%)' : 'grayscale(100%)', transform: 'translateZ(0)' }}
              >
                <img
                  src={photoIra}
                  className="w-full h-full object-cover shadow-2xl rounded-sm"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                  alt="Fitratun Nikmatul Khoiriyah"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-serif text-stone-800">Fitratun Nikmatul Khoiriyah, S.P.</h3>
              <p className="text-stone-500 leading-relaxed italic font-light">
                Putri dari Bapak Mustaqim <br /> & Ibu Patmiharsi
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#F9F7F2]" data-observe>
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="uppercase tracking-[0.4em] text-xs text-amber-600 mb-3">Perjalanan Cinta</p>
          <h2 className="text-4xl font-light font-serif text-stone-800 mb-4">Our Story</h2>
          <div className="w-12 h-px bg-amber-300 mx-auto"></div>
        </div>
        <div className="max-w-xl mx-auto relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-amber-100 -translate-x-1/2"></div>
          {[
            { year: '2017', title: 'Pertama Bertemu', desc: 'Satu kelas selama satu semester, hanya sekedar kenal — namun pertemuan itu menjadi awal dari segalanya.' },
            { year: 'Sep 2025', title: 'Saling Mengenal & Jatuh Cinta', desc: 'Kenalan lebih dekat, dari pertemuan ini tumbuh rasa yang terasa cocok dan tak terduga sebelumnya.' },
            { year: 'Jan 2026', title: 'Lamaran', desc: 'Janji telah dimulai, restu kedua keluarga pun telah menyertai untuk menyatukan jalinan yang suci.' },
            { year: 'Apr 2026', title: 'Menuju Pelaminan', desc: 'Hari yang ditunggu telah tiba, menyatukan dua hati dalam ikatan suci pernikahan, disaksikan semua dan insyaallah diridhoi oleh Allah SWT.' },
          ].map((item, i) => (
            <div key={i} className={`reveal-child relative flex items-start mb-10 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-5/12 ${i % 2 === 0 ? 'text-right pr-6' : 'text-left pl-6'}`}>
                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-600 font-bold">{item.year}</span>
                <h3 className="text-base font-serif text-stone-800 mt-1 mb-1">{item.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-light italic">{item.desc}</p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-300 border-2 border-amber-100 shadow mt-1"></div>
              <div className="w-5/12"></div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-28 px-6 bg-[#FDFCF8]" data-observe>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.4em] text-xs text-amber-600 mb-3">Jadwal Acara</p>
            <h2 className="text-4xl md:text-5xl font-light font-serif text-stone-800 mb-4">Waktu &amp; Tempat</h2>
            <div className="w-16 h-px bg-amber-200 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <div className="relative bg-stone-50 rounded-3xl p-10 border border-stone-100 text-center opacity-75">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-1">Telah Dilaksanakan</p>
              <h3 className="text-2xl font-serif text-stone-500 mb-5 mt-2">Akad Nikah</h3>
              <div className="w-8 h-px bg-stone-300 mx-auto mb-5"></div>
              <div className="space-y-3 text-stone-400 text-sm font-light">
                <p className="flex items-center justify-center gap-2"><Calendar size={13} /> Rabu, 8 April 2026</p>
                <p className="flex items-center justify-center gap-2"><MapPin size={13} /> Kediaman Mempelai Wanita, Mangaran, Situbondo</p>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 rounded-3xl p-10 border border-amber-100 shadow-lg text-center hover:-translate-y-1 transition-transform duration-500">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-300 rounded-full flex items-center justify-center shadow-md">
                <Heart size={13} className="text-white" fill="white" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-600 mb-1">Undangan Utama</p>
              <h3 className="text-2xl font-serif text-stone-800 mb-5 mt-2">Resepsi Pernikahan</h3>
              <div className="w-8 h-px bg-amber-300 mx-auto mb-5"></div>
              <div className="space-y-3 text-stone-600 font-light">
                <p className="flex items-center justify-center gap-2"><Calendar size={14} className="text-amber-600" /> Senin, 1 Juni 2026</p>
                <p className="flex items-center justify-center gap-2"><Clock size={14} className="text-amber-600" /> Pukul 13.00 - 16.00 WIB</p>
                <p className="flex items-center justify-center gap-2 text-sm"><MapPin size={14} className="text-amber-600" /> Bugeman, Kendit, Situbondo</p>
              </div>
              <button
                onClick={() => window.open('https://maps.app.goo.gl/qz2VgJUGS8oZBmvS7', '_blank')}
                className="mt-8 px-7 py-3 bg-stone-800 text-white rounded-full text-xs uppercase tracking-widest hover:bg-amber-700 transition-colors duration-300 shadow-md inline-flex items-center gap-2">
                <MapPin size={12} /> Navigasi Lokasi
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-5xl mx-auto" data-observe>
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.4em] text-xs text-amber-600 mb-3">Kenangan Kami</p>
          <h2 className="text-4xl font-light mb-4 font-serif text-stone-800">Galeri Kisah</h2>
          <div className="w-12 h-px bg-amber-300 mx-auto mb-3"></div>
          <p className="text-stone-400 italic text-sm">Potret kenangan bahagia kami</p>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-5">
          {galleryImages.map((src, i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl overflow-hidden group border-[0.5px] border-stone-100 shadow-md" style={{ transform: 'translateZ(0)' }}>
              <img
                src={src}
                alt={`Momen Bahagia ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                fetchpriority={i === 0 ? 'high' : 'low'}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-[#F9F7F2]" data-observe>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="uppercase tracking-[0.4em] text-xs text-amber-600 mb-3">Tanda Kasih</p>
          <h2 className="text-4xl font-light font-serif text-stone-800 mb-4">Hadiah Pernikahan</h2>
          <div className="w-12 h-px bg-amber-300 mx-auto mb-4"></div>
          <p className="text-stone-500 font-light italic text-sm max-w-md mx-auto">Doa restu Anda adalah hadiah terindah. Namun bila ingin berbagi kebahagiaan, berikut informasinya.</p>
        </div>
        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-8 border-t-4 shadow-sm text-center reveal-child hover:shadow-md transition-shadow duration-300" style={{ borderTopColor: '#F5CC00', borderRadius: '1rem' }}>
            <div className="h-12 flex items-center justify-center mb-2">
              <img src="/bank jago.png" alt="Bank Jago" className="h-10 object-contain" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-4">Bank Jago</p>
            <p className="text-xl font-serif text-stone-800 mb-1 tracking-wider">1061 6351 0120</p>
            <p className="text-stone-400 text-xs mb-5 font-light">a.n. Aditya Novan Firmansyah</p>
            <button
              onClick={() => copyToClipboard('106163510120', 'jago')}
              className="text-xs px-5 py-2 rounded-full border transition-colors inline-flex items-center gap-2"
              style={{ borderColor: '#F5CC00', color: '#B8960A', backgroundColor: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fffbe6'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              {copied === 'jago' ? <CheckCircle size={12} /> : <Copy size={12} />}
              {copied === 'jago' ? 'Tersalin!' : 'Salin Nomor'}
            </button>
          </div>
          <div className="bg-white rounded-2xl p-8 border-t-4 border-[#00AED6] shadow-sm text-center reveal-child hover:shadow-md transition-shadow duration-300" style={{ borderRadius: '1rem' }}>
            <div className="h-12 flex items-center justify-center mb-2">
              <img src="/gopay.png" alt="GoPay" className="h-10 object-contain" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-4">GoPay</p>
            <p className="text-xl font-serif text-stone-800 mb-1 tracking-wider">0852 1526 9015</p>
            <p className="text-stone-400 text-xs mb-5 font-light">a.n. Aditya Novan Firmansyah</p>
            <button
              onClick={() => copyToClipboard('085215269015', 'gopay')}
              className="text-xs px-5 py-2 rounded-full border transition-colors inline-flex items-center gap-2"
              style={{ borderColor: '#00AED6', color: '#00AED6', backgroundColor: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0fbfe'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              {copied === 'gopay' ? <CheckCircle size={12} /> : <Copy size={12} />}
              {copied === 'gopay' ? 'Tersalin!' : 'Salin Nomor'}
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#FDFCF8]" data-observe>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="space-y-7">
            <div>
              <p className="uppercase tracking-[0.4em] text-xs text-amber-600 mb-2">RSVP</p>
              <h2 className="text-4xl font-serif text-stone-800 tracking-tight">Konfirmasi Kehadiran</h2>
            </div>
            <p className="text-stone-500 leading-relaxed font-light text-sm">Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kehormatan yang sangat berarti bagi kami.</p>
            {rsvpSubmitted && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
                <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                <p className="text-emerald-700 text-sm font-light">Terima kasih! Ucapan Anda telah kami terima. 🌸</p>
              </div>
            )}
            <form onSubmit={handleRsvpSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b border-stone-300 py-3 focus:border-amber-600 outline-none transition-all font-light font-serif"
                required
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-stone-600 outline-none focus:border-amber-400 font-serif"
              >
                <option value="Hadir">Insya Allah Hadir</option>
                <option value="Tidak Hadir">Berhalangan Hadir</option>
              </select>
              <textarea
                rows="4"
                placeholder="Ucapan Selamat & Doa Restu"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-stone-600 outline-none focus:border-amber-400 font-light font-serif"
                required
              ></textarea>
              <button type="submit" className="w-full py-4 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-3 tracking-widest text-xs uppercase">
                Kirim Konfirmasi <Send size={14} />
              </button>
            </form>
          </div>

          <div className="bg-stone-50 p-10 rounded-[40px] border border-stone-100 shadow-inner">
            <h3 className="text-2xl font-serif mb-10 text-stone-700 italic border-b border-stone-200 pb-4">Doa & Restu</h3>
            <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
              {rsvpList.map((rsvp, idx) => (
                <div key={idx} className="animate-slide-up group">
                  <div className="flex justify-between items-center mb-3 text-serif">
                    <span className="font-semibold text-stone-800 text-sm tracking-wide">{rsvp.name}</span>
                    <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter ${rsvp.status === 'Hadir' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {rsvp.status}
                    </span>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed italic font-light group-hover:text-stone-800 transition-colors">"{rsvp.message}"</p>
                  <div className="w-full h-[0.5px] bg-stone-200 mt-6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-32 bg-stone-50 text-center border-t border-stone-200 relative">
        <div className="relative z-10">
          <p className="text-stone-400 tracking-[0.4em] uppercase text-[10px] mb-12 font-serif">Sampai Jumpa di Hari Bahagia Kami</p>
          <h4 className="text-6xl md:text-8xl font-light text-stone-900 mb-16 tracking-tighter font-serif">Adit <span className="font-serif italic text-amber-600 font-normal">&</span> Ira</h4>
          <div className="flex justify-center gap-10 text-stone-300 mb-16">
            <Heart size={24} strokeWidth={1} />
            <div className="w-px h-12 bg-stone-200"></div>
            <Camera size={24} strokeWidth={1} />
            <div className="w-px h-12 bg-stone-200"></div>
            <MapPin size={24} strokeWidth={1} />
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-[0.5em] font-serif">Created with love &copy; 2026</p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(50px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fade-in-left { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fade-in-right { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes zoom-in { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes shimmer { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes pulse-soft { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.06); opacity: 0.85; } }
        @keyframes petal-fall { 0% { opacity: 0; transform: translateY(-20px) rotate(0deg); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(120px) rotate(180deg); } }
        @keyframes line-grow { from { transform: scaleY(0); transform-origin: top; } to { transform: scaleY(1); transform-origin: top; } }
        .animate-fade-in { animation: fade-in 1.6s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-fade-in-left { animation: fade-in-left 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-fade-in-right { animation: fade-in-right 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-zoom-in { animation: zoom-in 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-spin-slow { animation: spin-slow 14s linear infinite; }
        .animate-slide-up { animation: slide-up 1s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        .animate-petal { animation: petal-fall 4s ease-in infinite; }
        .animate-line-grow { animation: line-grow 1.5s ease-out forwards; }
        [data-observe] { opacity: 0; transform: translateY(44px); transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1); }
        [data-observe].is-visible { opacity: 1; transform: translateY(0); }
        [data-observe].is-visible .reveal-child { animation: slide-up 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        [data-observe].is-visible .reveal-child:nth-child(1) { animation-delay: 0.08s; }
        [data-observe].is-visible .reveal-child:nth-child(2) { animation-delay: 0.18s; }
        [data-observe].is-visible .reveal-child:nth-child(3) { animation-delay: 0.28s; }
        [data-observe].is-visible .reveal-child:nth-child(4) { animation-delay: 0.38s; }
        [data-observe].is-visible .reveal-child:nth-child(5) { animation-delay: 0.48s; }
        .group:hover .reveal-child { transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d6b97b; border-radius: 10px; }
        html { scroll-behavior: smooth; }
        img { image-rendering: auto; }
      `}} />
    </div>
  );
};

export default App;
