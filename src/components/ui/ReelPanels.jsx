import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RadioScene from './RadioScene'
import './ReelPanels.css'

gsap.registerPlugin(ScrollTrigger)

const GENRES = [
  { id: 'romance', name: 'Romance', color: '#A98EE8', code: 'WTS-001', img: '/images/Gemini_Generated_Image_om3mjgom3mjgom3m (4).webp', title: 'A Moment in Time', ep: 'S1 E1', desc: 'Two strangers meet under the pouring rain.' },
  { id: 'thriller', name: 'Thriller', color: '#E85B5B', code: 'WTS-002', img: '/images/Gemini_Generated_Image_tw0hhytw0hhytw0h (1).webp', title: 'Dark Waters', ep: 'S1 E4', desc: 'When the tide comes in, the truth washes away.' },
  { id: 'mythology', name: 'Mythology', color: '#7CE8B5', code: 'WTS-003', img: '/images/Gemini_Generated_Image_9ekx2a9ekx2a9ekx.webp', title: 'Gods of the Valley', ep: 'Miniseries', desc: 'Ancient powers awaken in the modern Himalayas.' },
  { id: 'action', name: 'Action', color: '#E8A35B', code: 'WTS-004', img: '/images/Gemini_Generated_Image_tw0hhytw0hhytw0h (7).webp', title: 'Concrete Jungle', ep: 'S2 E3', desc: 'One night. One target. No way out.' },
  { id: 'mystery', name: 'Mystery', color: '#7A91E8', code: 'WTS-005', img: '/images/Gemini_Generated_Image_tw0hhytw0hhytw0h (5).webp', title: 'The Echo', ep: 'S1 E8', desc: 'A missing person. A sound that never stops.' },
  { id: 'drama', name: 'Drama', color: '#C2C6CC', code: 'WTS-006', img: '/images/Gemini_Generated_Image_om3mjgom3mjgom3m (7).webp', title: 'Broken Strings', ep: 'S3 E2', desc: 'Fame costs everything when the music stops.' },
  { id: 'comedy', name: 'Comedy', color: '#D982E8', code: 'WTS-007', img: '/images/Gemini_Generated_Image_om3mjgom3mjgom3m (8).webp', title: 'Half Baked', ep: 'S1 E5', desc: 'They opened a bakery. They don\'t know how to bake.' },
  { id: 'horror', name: 'Horror', color: '#E8E8E8', code: 'WTS-008', img: '/images/Gemini_Generated_Image_tw0hhytw0hhytw0h (8).webp', title: 'Room 404', ep: 'S1 E1', desc: 'Don\'t look under the bed. It\'s already there.' },
]

export default function ReelPanels() {
  const containerRef = useRef(null)
  const bgRef = useRef(null)
  const trackRef = useRef(null)
  const wrapperRef = useRef(null)
  const uiLayerRef = useRef(null)
  const gateRef = useRef(null)
  const counterRef = useRef(null)
  const phoneRef = useRef(null)
  const ottInfoRef = useRef(null)
  const filmTlRef = useRef(null)
  const bgLayersRef = useRef(null)

  const phase1TextRef = useRef(null)
  const phase2TextRef = useRef(null)
  const statCardsRef = useRef(null)

  const diveFlashRef = useRef(null)

  const panel12Ref = useRef(null)
  const panel3Ref = useRef(null)
  const panel3BgRef = useRef(null)
  const panel4Ref = useRef(null)
  const panel5Ref = useRef(null)
  const castingFormRef = useRef(null)
  const blackOverlayRef = useRef(null)

  const [castingSubmitted, setCastingSubmitted] = useState(false)

  const handleTuneIn = () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = '#000';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);

    gsap.to(panel5Ref.current, {
      scale: 1.5,
      duration: 1.2,
      ease: 'power2.in',
    });

    gsap.to(overlay, {
      opacity: 1,
      duration: 1.2,
      ease: 'power2.in',
      onComplete: () => {
        window.open('https://walktalkradio.com', '_blank', 'noopener,noreferrer');
      }
    });
  };

  useEffect(() => {
    let update3D;

    let ctx = gsap.context(() => {
      const frames = gsap.utils.toArray('.film-frame')
      const segments = gsap.utils.toArray('.film-segment')
      
      gsap.set(diveFlashRef.current, { opacity: 0 })
      gsap.set(containerRef.current, { opacity: 0, pointerEvents: 'none' })
      gsap.set(panel12Ref.current, { opacity: 0 })
      gsap.set(phoneRef.current, { x: '50vw', y: '-50vh', rotation: 25, opacity: 0 })
      gsap.set(ottInfoRef.current, { opacity: 0, y: 20 })
      gsap.set('.film-frame', { scale: 1 })
      gsap.set('.ambient-bg-layer', { opacity: 0, scale: 1.05 })

      gsap.set(phase1TextRef.current, { opacity: 0, y: 30 })
      gsap.set(phase2TextRef.current, { opacity: 0, y: 30 })
      gsap.set('.stat-card', { opacity: 0, y: 20 })
      gsap.set(gateRef.current, { opacity: 0 })
      gsap.set(castingFormRef.current, { opacity: 0 })

      const wrapperWidth = window.innerWidth > 768 ? window.innerWidth * 1.5 : window.innerWidth * 2;
      
      gsap.set(wrapperRef.current, { 
        width: wrapperWidth, 
        height: '150vh', 
        rotation: -15, 
        xPercent: -50, 
        yPercent: -50,
        top: '50%',
        left: '50%',
        x: '80vw',
        y: '-10vh',
        overflow: 'visible'
      });

      const step = 264
      const centerOffset = wrapperWidth / 2 - step / 2

      const startIndex = 8;
      const startX = centerOffset - (startIndex * step);
      gsap.set(trackRef.current, { x: startX })

      const swirlObj = { factor: 1 };
      const isMobileDevice = window.innerWidth <= 768;

      let _frame3D = 0
      update3D = () => {
        // Once the swirl factor reaches zero (post-OTT transition) this is
        // permanently a no-op — avoids 24 gsap.set() calls per frame for nothing.
        // On mobile we skip 3D rotation entirely: preserve-3d creates a separate
        // GPU compositing layer per segment (24 layers) which exhausts mobile VRAM.
        if (swirlObj.factor <= 0.005 || isMobileDevice) return;
        if (++_frame3D % 2 !== 0) return
        if (!trackRef.current) return;
        const trackX = gsap.getProperty(trackRef.current, 'x');
        const wrapperCenter = wrapperWidth / 2;

        segments.forEach((segment, i) => {
           const localCenterX = i * step + step / 2;
           const absX = trackX + localCenterX;
           const dist = absX - wrapperCenter;
           const normalized = dist / (window.innerWidth / 2);

           const z = -Math.pow(Math.abs(normalized), 2.2) * 500 * swirlObj.factor;
           const rotY = -normalized * 35 * swirlObj.factor;

           gsap.set(segment, {
             z: z,
             rotationY: rotY,
             transformPerspective: 1200
           });
        });
      };
      
      gsap.ticker.add(update3D);

      const startGenreIndex = startIndex % GENRES.length;
      GENRES.forEach((_, i) => {
         if (i === startGenreIndex) {
            gsap.set(`.phone-layer-${i}`, { yPercent: 0, zIndex: 2 })
         } else {
            gsap.set(`.phone-layer-${i}`, { yPercent: 100, zIndex: 1 })
         }
      })

      filmTlRef.current = gsap.timeline({ repeat: -1, paused: true })

      for (let i = startIndex; i < startIndex + GENRES.length; i++) {
        const frame = frames[i];
        const genreIndex = i % GENRES.length;
        const nextGenreIndex = (i + 1) % GENRES.length;
        const nextX = centerOffset - ((i + 1) * step);

        filmTlRef.current.to(frame, { scale: 1.04, duration: 0.4, ease: 'power1.out' })
          .to(`.bg-layer-${genreIndex}`, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, '<')
          .to(counterRef.current, {
            onStart: () => { if(counterRef.current) counterRef.current.textContent = `0${genreIndex+1} / 08` },
            duration: 0.1
          }, '<');

        filmTlRef.current.to({}, { duration: 1.5 });
        filmTlRef.current.to(frame, { scale: 1, duration: 0.4, ease: 'power1.in' })
          .to(`.bg-layer-${genreIndex}`, { opacity: 0, scale: 1.05, duration: 0.8, ease: 'power2.in' }, '<');

        filmTlRef.current.to(trackRef.current, {
          x: nextX,
          duration: 1.2,
          ease: 'power3.inOut'
        });

        filmTlRef.current.set(`.phone-layer-${nextGenreIndex}`, { yPercent: 100, zIndex: 3 }, '<');
        filmTlRef.current.to(`.phone-layer-${genreIndex}`, { yPercent: -100, duration: 1.2, ease: 'power3.inOut' }, '<');
        filmTlRef.current.to(`.phone-layer-${nextGenreIndex}`, {
          yPercent: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          onComplete: () => {
             gsap.set(`.phone-layer-${genreIndex}`, { zIndex: 1 });
          }
        }, '<');

        if (i === startIndex + GENRES.length - 1) {
          filmTlRef.current.set(trackRef.current, { x: startX })
        }
      }

      filmTlRef.current.play()

      const spacer = document.querySelector('.scroll-spacer')
      const transTl = gsap.timeline({
        scrollTrigger: {
          trigger: spacer,
          start: 'top top',
          end: 'bottom top', // spans the entire 1500% pin of the interaction
          scrub: 2.5,
          onEnter:     () => {
            // Three.js stays alive — dive ScrollTrigger below will cut it at the right moment
            gsap.set(containerRef.current, { pointerEvents: 'all' });
          },
          onLeaveBack: () => {
            window._wtsSceneVisible = true;
            gsap.set(containerRef.current, { pointerEvents: 'none' });
            const sr = document.getElementById('studio-scene-root');
            if (sr) gsap.set(sr, { opacity: 1, clearProps: 'transform' });
            gsap.killTweensOf(diveFlashRef.current);
            gsap.set(diveFlashRef.current, { opacity: 0 });
          },
        }
      })

      // Start the narrative transitions AFTER the camera dive completes
      const startOffset = 0.5 

      transTl.to(containerRef.current, { opacity: 1, duration: 0.1 }, startOffset)
      transTl.to(panel12Ref.current, { opacity: 1, duration: 0.4 }, startOffset)
      transTl.to(wrapperRef.current, {
        x: '20vw',
        y: '20vh',
        duration: 0.8,
        ease: 'power2.out'
      }, startOffset)
      transTl.to(phase1TextRef.current, { opacity: 1, y: 0, duration: 0.6 }, startOffset + 0.1)
      transTl.to(phase1TextRef.current, { opacity: 0, y: -20, duration: 0.4 }, startOffset + 0.8)
      
      const phase2Label = 'phase2'
      transTl.add(phase2Label, startOffset + 0.8)
      transTl.to(wrapperRef.current, { x: '0vw', y: '0vh', duration: 0.8, ease: 'power2.inOut' }, phase2Label)
      transTl.to(phase2TextRef.current, { opacity: 1, y: 0, duration: 0.5 }, phase2Label)
      transTl.to('.stat-card', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, phase2Label)
      transTl.to(gateRef.current, { opacity: 1, duration: 0.4 }, phase2Label)
      transTl.to(phase2TextRef.current, { opacity: 0, y: -20, duration: 0.4 }, phase2Label + '+=0.8')
      transTl.to('.stat-card', { opacity: 0, y: -10, duration: 0.4 }, phase2Label + '+=0.8')

      const transLabel = 'ott-trans'
      transTl.add(transLabel, phase2Label + '+=0.8')
      transTl.to(uiLayerRef.current, { opacity: 0, duration: 0.2 }, transLabel)
      transTl.to(gateRef.current, { opacity: 0, duration: 0.2 }, transLabel)
      transTl.to(phoneRef.current, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'power4.inOut' }, transLabel)
      transTl.to(swirlObj, { factor: 0, duration: 0.4, ease: 'power2.inOut' }, transLabel)
      
      const phoneW = window.innerWidth > 768 ? 340 : 280;
      const phoneH = window.innerWidth > 768 ? 680 : 580;
      
      transTl.to(wrapperRef.current, {
        width: phoneW - 24,
        height: phoneH - 24,
        borderRadius: 36,
        rotation: 0,
        duration: 0.6,
        ease: 'power4.inOut',
        onStart: () => { gsap.set(wrapperRef.current, { overflow: 'hidden' }) }
      }, transLabel + '+=0.1')

      transTl.to(trackRef.current, { opacity: 0, duration: 0.4 }, transLabel + '+=0.3')
      transTl.to('.phone-content-container', { opacity: 1, duration: 0.4 }, transLabel + '+=0.3')
      transTl.to(ottInfoRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, transLabel + '+=0.4')
      transTl.to(bgRef.current, { backgroundColor: '#0B0B0B', duration: 0.8 }, transLabel)

      const ottParallax = window.innerWidth <= 768 ? -10 : -20;
      transTl.to(ottInfoRef.current, { y: ottParallax, duration: 0.8, ease: 'none' }, transLabel + '+=0.8')

      const panel3Label = 'panel3'
      transTl.add(panel3Label)
      transTl.to(panel12Ref.current, { xPercent: -100, duration: 0.8, ease: 'power3.inOut' }, panel3Label)
      transTl.set(panel12Ref.current, { opacity: 0 }, panel3Label + '+=0.8')
      transTl.to(panel3Ref.current, { xPercent: -100, duration: 0.8, ease: 'power3.inOut' }, panel3Label)
      transTl.fromTo('.panel-3 .uk-content-anchor > *, .panel-3 .uk-eyebrow-anchor, .panel-3 .uk-stat-anchor', 
        { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0, ease: 'power3.out' }, panel3Label + '+=0.2'
      )
      transTl.to('.panel-3 .uk-content-anchor, .panel-3 .uk-eyebrow-anchor, .panel-3 .uk-stat-anchor', { y: -20, duration: 0.8, ease: 'none' }, panel3Label + '+=0.8')

      const panel4Label = 'panel4'
      transTl.add(panel4Label)
      transTl.to('.panel-3 .uk-content-anchor, .panel-3 .uk-eyebrow-anchor, .panel-3 .uk-stat-anchor, .panel-3 .panel-overlay', { opacity: 0, duration: 0.5 }, panel4Label)
      transTl.to(panel3BgRef.current, { scale: 5, duration: 1, ease: 'power2.inOut' }, panel4Label)
      transTl.to(blackOverlayRef.current, { opacity: 1, duration: 0.5, ease: 'power2.in' }, panel4Label + '+=0.5')
      transTl.set(panel3Ref.current, { xPercent: -200, opacity: 0 }, panel4Label + '+=1.0')
      transTl.set(panel4Ref.current, { xPercent: -200 }, panel4Label + '+=1.0')
      transTl.to(blackOverlayRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' }, panel4Label + '+=1.0')
      transTl.fromTo('.panel-casting .cast-animate', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0, ease: 'power3.out' }, panel4Label + '+=0.8')
      transTl.to('.panel-casting .casting-left', { y: -10, duration: 0.3, ease: 'none' }, panel4Label + '+=1.4')

      const panel5Label = 'panel5'
      transTl.add(panel5Label)
      transTl.to('.panel-casting .cast-animate, .panel-casting .casting-tagline', { opacity: 0, duration: 0.5 }, panel5Label)
      transTl.to(blackOverlayRef.current, { opacity: 1, duration: 0.5, ease: 'power2.in' }, panel5Label + '+=0.5')
      transTl.set(panel4Ref.current, { xPercent: -300, opacity: 0 }, panel5Label + '+=1.0')
      transTl.set(panel5Ref.current, { xPercent: -300 }, panel5Label + '+=1.0')
      transTl.to(blackOverlayRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' }, panel5Label + '+=1.0')
      transTl.fromTo('.panel-radio .panel-content > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0, ease: 'power3.out' }, panel5Label + '+=0.8')
      transTl.to('.panel-radio .panel-content', { y: -10, duration: 0.3, ease: 'none' }, panel5Label + '+=1.4')

      const exitLabel = 'exit-panels'
      transTl.add(exitLabel)
      const exitProxy = { progress: 0 }
      transTl.to(exitProxy, {
        progress: 1,
        duration: 1.5,
        ease: 'power2.inOut',
        onStart:          () => { window._wtsSceneVisible = true },
        onReverseComplete: () => { window._wtsSceneVisible = false },
        onUpdate: () => { window._wtsExitProgress = exitProxy.progress; }
      }, exitLabel)

      // Restore the Three.js canvas — fade it back in and unwind the dive scale
      // so the CameraRig's zoom-out (t: 1→0) is actually visible.
      const sr = document.getElementById('studio-scene-root')
      transTl.set(diveFlashRef.current, { opacity: 0 }, exitLabel)
      transTl.to(sr, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, exitLabel)

      transTl.to(containerRef.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, exitLabel + '+=0.5')
      transTl.set(containerRef.current, { backgroundColor: 'transparent' }, exitLabel)

      const clipY = window.innerHeight * 0.05;
      const clipX = window.innerWidth > 768 ? window.innerWidth * 0.3 : window.innerWidth * 0.1;
      transTl.to(panel5Ref.current, {
        clipPath: `inset(${clipY}px ${clipX}px ${clipY}px ${clipX}px round 36px)`,
        scale: 0.85,
        duration: 1.2,
        ease: 'power3.inOut'
      }, exitLabel)
      transTl.to(panel5Ref.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }, exitLabel + '+=0.6')
      transTl.to(phoneRef.current, { opacity: 0, duration: 0.5 }, exitLabel)
      
      // Add a small empty hold at the very end to ensure everything has room to finish
      // before hitting the physical bottom of the scroll-spacer
      transTl.to({}, { duration: 1.0 })

      // ── DIVE TRANSITION ──────────────────────────────────────────────────────
      // Separate ScrollTrigger that covers only the first 5% of the spacer scroll
      // (matching CameraRig's dive window). Three.js renders the camera zoom here;
      // at the threshold we kill rendering, punch a flash, and the panel emerges.
      const diveEnd = () => '+=' + (spacer.offsetHeight - window.innerHeight) * 0.05

      ScrollTrigger.create({
        trigger: spacer,
        start: 'top top',
        end: diveEnd,
        scrub: 1,
        onUpdate: ({ progress }) => {
          // Desktop only: CSS scale amplifies the 3D camera zoom visually.
          // Use gsap.set so GSAP owns the property and can animate it back during exit.
          if (!isMobileDevice) {
            const sr = document.getElementById('studio-scene-root')
            if (sr) gsap.set(sr, { scale: 1 + progress * 0.55 })
          }
        },
        onLeave: () => {
          // Camera has reached the phone screen — cut Three.js and flash through
          window._wtsSceneVisible = false
          const sr = document.getElementById('studio-scene-root')
          if (sr) {
            if (!isMobileDevice) {
              gsap.to(sr, { opacity: 0, duration: 0.25, ease: 'power2.in' })
            } else {
              gsap.set(sr, { opacity: 0 })
            }
          }
          gsap.killTweensOf(diveFlashRef.current)
          gsap.to(diveFlashRef.current, {
            opacity: 1, duration: 0.25, ease: 'power2.in',
            onComplete: () => {
              gsap.to(diveFlashRef.current, { opacity: 0, duration: 0.45, ease: 'power2.out' })
            }
          })
        },
        onEnterBack: () => {
          window._wtsSceneVisible = true
          const sr = document.getElementById('studio-scene-root')
          if (sr) gsap.set(sr, { opacity: 1, clearProps: 'transform' })
          gsap.killTweensOf(diveFlashRef.current)
          gsap.set(diveFlashRef.current, { opacity: 0 })
        },
      })

    }, containerRef)

    return () => {
      if (update3D) gsap.ticker.remove(update3D)
      ctx.revert()
    }
  }, [])

  return (
    <>
    <div className="dive-flash" ref={diveFlashRef} />
    <section ref={containerRef} className="wts-panels-container">
      <div className="panel-1-2-content" ref={panel12Ref}>
        <div className="ambient-bg" ref={bgRef} />
        <div className="ambient-bg-container" ref={bgLayersRef}>
          {GENRES.map((g, i) => (
            <div key={i} className={`ambient-bg-layer bg-layer-${i}`} style={{ backgroundImage: `url("${g.img}")` }} />
          ))}
          <div className="ambient-bg-overlay" />
        </div>
        <div className="grain-overlay" />
        <div className="ui-layer" ref={uiLayerRef}>
          <div className="frame-counter" ref={counterRef}>01 / 08</div>
          <div className="phase1-text" ref={phase1TextRef}>
            <h1 className="phase1-title">The next billion screens are vertical.</h1>
            <p className="phase1-body">Vertical drama is the fastest-growing content format globally — 78% of mobile video is now consumed in portrait mode. India alone has 650M+ smartphone users, and Gen Z has never watched a film horizontally. WTS produces original vertical micro-dramas at cinematic quality — real locations, real direction, real craft — but engineered for a 9:16 world.</p>
          </div>
          <div className="drama-panel-text" ref={phase2TextRef}>
            <div className="drama-eyebrow">Vertical Micro-Drama</div>
            <h1 className="drama-title">Stories told<br/>in portrait.</h1>
            <p className="drama-body">We produce high-fidelity vertical dramas built natively for mobile — shot, edited, and paced for the new generation of storytelling.</p>
          </div>
          <div className="stat-cards-container" ref={statCardsRef}>
            <div className="stat-card">
              <div className="stat-value">650M+</div>
              <div className="stat-label">Indian smartphone<br/>users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">78%</div>
              <div className="stat-label">Mobile video<br/>watched vertically</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">3.2×</div>
              <div className="stat-label">Higher completion rate<br/>vs horizontal</div>
            </div>
          </div>
        </div>
        <div className="projector-gate" ref={gateRef}>
          <div className="gate-corner tl" /><div className="gate-corner tr" />
          <div className="gate-corner bl" /><div className="gate-corner br" />
        </div>
        <div className="filmstrip-wrapper" ref={wrapperRef}>
          <div className="phone-content-container">
            {GENRES.map((g, i) => (
              <div key={i} className={`phone-layer phone-layer-${i}`} style={{ backgroundImage: `url("${g.img}")` }}>
                <div className="phone-overlay" />
                <div className="ott-ui-container">
                  <div className="ott-top-bar"><span className="ott-logo">WTS ORIGINALS</span><span className="ott-nav">For You</span></div>
                  <div className="ott-bottom-area">
                    <div className="ott-content-info">
                      <div className="ott-genre-tag" style={{ color: g.color }}>{g.name}</div>
                      <h3 className="ott-series-title">{g.title}</h3>
                      <div className="ott-ep-info">{g.ep}</div>
                      <p className="ott-desc">{g.desc}</p>
                      <button className="ott-play-btn"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg>Watch Now</button>
                    </div>
                    <div className="ott-action-column"><div className="ott-action-btn"><div className="ott-icon-circle">+</div><span>List</span></div><div className="ott-action-btn"><div className="ott-icon-circle">➦</div><span>Share</span></div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="filmstrip-track" ref={trackRef}>
            {[...GENRES, ...GENRES, ...GENRES].map((g, i) => (
              <div className="film-segment" key={i} data-index={i}>
                <div className="film-rail top" />
                <div className="film-frame">
                  <div className="frame-image" style={{ backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.5)), url("${g.img}")` }} />
                  <div className="frame-code">{g.code}</div>
                </div>
                <div className="film-rail bottom" />
              </div>
            ))}
          </div>
        </div>
        <div className="iphone-mockup" ref={phoneRef}><div className="iphone-island" /></div>
        <div className="ott-panel-info" ref={ottInfoRef}>
          <div className="ott-slate">VERTICAL · ORIGINAL · ON DEMAND</div>
          <h2 className="ott-headline"><span>Drama made for </span><span>the way you watch.</span></h2>
          <p className="ott-body">Every title conceived, directed and produced in 9:16 — from the mountains of Uttarakhand to your screen.</p>
          <button className="ott-cta">Coming Soon</button>
        </div>
      </div>

      <div className="panel-3" ref={panel3Ref}>
        <video className="panel-3-bg panel-3-bg--video" ref={panel3BgRef} src="/6c38c89a-7ef7-4317-8a0b-09d210bf76e0.webm" poster="/images/929ba58c-75b3-4d6a-8453-c4184f6d174e.jpg" preload="auto" autoPlay loop muted playsInline />
        <img className="panel-3-bg panel-3-bg--img" src="/images/929ba58c-75b3-4d6a-8453-c4184f6d174e.jpg" alt="" />
        <div className="panel-overlay" style={{ zIndex: 3 }} />
        <div className="uk-eyebrow-anchor"><span className="uk-line"></span>STRATEGIC LOCATION</div>
        <div className="uk-content-anchor">
          <h2 className="panel-title uk-title"><span>The Mountain That</span><span>Becomes a <span className="uk-studio">Studio.</span></span></h2>
          <p className="uk-body">Uttarakhand is not a filming location. It is a genre library — every landscape a natural set, every culture a story, and every policy rupee a strategic advantage.</p>
        </div>
        <div className="uk-stat-anchor">28°N · 79°E — Uttarakhand</div>
      </div>

      <div className="panel-3 panel-casting" ref={panel4Ref}>
        <div className="casting-dot-bg" />
        <div className="casting-bg-beam" /><div className="casting-floor-mark" />
        <div className="casting-layout">
          <div className="casting-left">
            <div className="panel-eyebrow cast-animate">OPEN CASTING — WTS ORIGINALS</div>
            <h2 className="casting-headline cast-animate">Your face.<br />Our frame.<br />The world watching.</h2>
            <p className="casting-subhead cast-animate">We are looking for real performers for India's next generation of vertical drama.</p>
            <p className="casting-body cast-animate">WTS find people who carry something — a stillness, an intensity, a truth that the camera can't ignore.</p>
            <div className="casting-cta-wrapper cast-animate">
              <button
                className="casting-cta-clean"
                onClick={() => {
                  castingFormRef.current.classList.add('active');
                  gsap.to(castingFormRef.current, { opacity: 1, duration: 0.65, ease: 'power3.out' });
                }}
              >
                <span className="casting-cta-label">Register Your Interest</span>
                <span className="casting-cta-arrow">→</span>
              </button>
            </div>
          </div>
          <div className="casting-form-panel" ref={castingFormRef}>
            <button className="casting-form-close" onClick={() => {
              castingFormRef.current.classList.remove('active');
              gsap.to(castingFormRef.current, { opacity: 0, duration: 0.45, ease: 'power3.in' });
            }}>✕</button>
            {castingSubmitted ? (
              <div className="casting-success"><div className="casting-success-title">We've got you.</div><div className="casting-success-body">All submissions reviewed by the WTS casting team.</div></div>
            ) : (
              <form className="casting-form" onSubmit={(e) => { e.preventDefault(); setCastingSubmitted(true); }}>
                <div className="casting-field"><label>Full name</label><input type="text" placeholder="Your full name" required /></div>
                <div className="casting-field"><label>Age</label><input type="number" placeholder="Your age" required /></div>
                <div className="casting-field"><label>City</label><input type="text" placeholder="Your city" required /></div>
                <div className="casting-field"><label>Phone number</label><input type="tel" placeholder="+91 xxxxx xxxxx" required /></div>
                <div className="casting-field"><label>Tell us what you'd bring to a WTS story</label><input type="text" placeholder="One line about your talent..." required /></div>
                <div className="casting-field">
                  <label>Photo or short video (Optional)</label>
                  <div className="casting-file-wrapper">
                    <input type="file" id="casting-file" className="casting-file-input" />
                    <label htmlFor="casting-file" className="casting-file-label">Choose File</label>
                  </div>
                </div>
                <button type="submit" className="casting-submit">Register Your Interest →</button>
              </form>
            )}
          </div>
        </div>

        <div className="casting-tagline cast-animate">The next WTS face hasn't been discovered yet. It might be yours.</div>
      </div>

      <div className="panel-3 panel-radio" ref={panel5Ref}>
        <RadioScene />
        <div className="panel-overlay" style={{ background: 'linear-gradient(to top, #0D0800 30%, transparent 100%)' }} />
        <div className="panel-content">
          <div className="radio-eyebrow"><span className="radio-dot" />ON AIR</div>
          <h2 className="panel-title radio-title"><span>Where WTS</span> <span>speaks.</span></h2>
          <p className="radio-body">Stories don't end on screen. WalkTalk Radio is where our directors, writers, and talent come to talk.</p>
          <button className="radio-tune-btn" onClick={handleTuneIn}><span className="radio-dot" />Tune In Live</button>
        </div>
      </div>
      <div className="black-transition-overlay" ref={blackOverlayRef} />
    </section>
    </>
  )
}
