import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const GENRES = [
  { id: 'romance', name: 'Romance', color: '#A98EE8', code: 'WTS-001', img: '/images/Gemini_Generated_Image_om3mjgom3mjgom3m (4).png', title: 'A Moment in Time', ep: 'S1 E1', desc: 'Two strangers meet under the pouring rain.' },
  { id: 'thriller', name: 'Thriller', color: '#E85B5B', code: 'WTS-002', img: '/images/Gemini_Generated_Image_tw0hhytw0hhytw0h (1).png', title: 'Dark Waters', ep: 'S1 E4', desc: 'When the tide comes in, the truth washes away.' },
  { id: 'mythology', name: 'Mythology', color: '#7CE8B5', code: 'WTS-003', img: '/images/Gemini_Generated_Image_9ekx2a9ekx2a9ekx.webp', title: 'Gods of the Valley', ep: 'Miniseries', desc: 'Ancient powers awaken in the modern Himalayas.' },
  { id: 'action', name: 'Action', color: '#E8A35B', code: 'WTS-004', img: '/images/Gemini_Generated_Image_tw0hhytw0hhytw0h (7).png', title: 'Concrete Jungle', ep: 'S2 E3', desc: 'One night. One target. No way out.' },
  { id: 'mystery', name: 'Mystery', color: '#7A91E8', code: 'WTS-005', img: '/images/Gemini_Generated_Image_tw0hhytw0hhytw0h (5).png', title: 'The Echo', ep: 'S1 E8', desc: 'A missing person. A sound that never stops.' },
  { id: 'drama', name: 'Drama', color: '#C2C6CC', code: 'WTS-006', img: '/images/Gemini_Generated_Image_om3mjgom3mjgom3m (7).png', title: 'Broken Strings', ep: 'S3 E2', desc: 'Fame costs everything when the music stops.' },
  { id: 'comedy', name: 'Comedy', color: '#D982E8', code: 'WTS-007', img: '/images/Gemini_Generated_Image_om3mjgom3mjgom3m (8).png', title: 'Half Baked', ep: 'S1 E5', desc: 'They opened a bakery. They don\'t know how to bake.' },
  { id: 'horror', name: 'Horror', color: '#E8E8E8', code: 'WTS-008', img: '/images/Gemini_Generated_Image_tw0hhytw0hhytw0h (8).png', title: 'Room 404', ep: 'S1 E1', desc: 'Don\'t look under the bed. It\'s already there.' },
]

function RadioScene() {
  const generateBars = (count, offset, scale) => {
    return Array.from({ length: count }, (_, i) => {
      const base = 25
        + Math.sin(i * 0.1 + offset) * 15
        + Math.cos(i * 0.3 + offset) * 10
        + Math.sin(i * 0.8 + offset) * 5
      return (Math.abs(base) + 5) * scale
    })
  }

  // 360 SMIL-animated rects → 90 CSS-animated rects (4× fewer, GPU composited)
  const layers = [
    { id: 'back',  bars: generateBars(40, 0,  0.5), blur: 8, opacity: 0.3, duration: 40, scale: 1.0  },
    { id: 'mid',   bars: generateBars(30, 20, 0.8), blur: 3, opacity: 0.6, duration: 25, scale: 1.05 },
    { id: 'front', bars: generateBars(20, 40, 1.2), blur: 0, opacity: 1.0, duration: 15, scale: 1.1  },
  ]

  return (
    <div className="scene-radio-full">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FF007F" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF8A00" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>

      {layers.map((layer) => (
        <div
          key={layer.id}
          style={{
            position: 'absolute', inset: 0,
            opacity: layer.opacity,
            filter: `blur(${layer.blur}px)`,
            transform: `scale(${layer.scale})`,
            display: 'flex', alignItems: 'center',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              width: '200%', height: '100%', flexShrink: 0,
              animation: `panWave ${layer.duration}s linear infinite alternate`,
            }}
          >
            {layer.bars.map((h, i) => {
              const x = (i / layer.bars.length) * 100
              const w = (100 / layer.bars.length) * 0.6
              return (
                <rect
                  key={i}
                  x={x}
                  y={50 - h / 2}
                  width={w}
                  height={h}
                  fill="url(#waveGrad)"
                  rx={w / 2}
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animationName: 'radioBarPulse',
                    animationDuration: `${3 + Math.abs(Math.sin(i)) * 2}s`,
                    animationDelay: `${-(i * 0.18) % 3}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDirection: 'alternate',
                  }}
                />
              )
            })}
          </svg>
        </div>
      ))}
    </div>
  )
}

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
  const ottScreenRef = useRef(null)
  const filmTlRef = useRef(null)
  const bgLayersRef = useRef(null)

  // New refs for text phases
  const phase1TextRef = useRef(null)
  const phase2TextRef = useRef(null)
  const statCardsRef = useRef(null)

  // Refs for extended scroll panels
  const panel12Ref = useRef(null)
  const panel3Ref = useRef(null)
  const panel3BgRef = useRef(null)
  const panel4Ref = useRef(null)
  const blackOverlayRef = useRef(null)

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

    gsap.to(panel4Ref.current, {
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
      
      gsap.set(phoneRef.current, { x: '50vw', y: '-50vh', rotation: 25, opacity: 0 })
      gsap.set(ottInfoRef.current, { opacity: 0, y: 20 })
      gsap.set('.film-frame', { scale: 1 })
      gsap.set('.ambient-bg-layer', { opacity: 0, scale: 1.05 })

      // Initial Phase Text States
      gsap.set(phase1TextRef.current, { opacity: 0, y: 30 })
      gsap.set(phase2TextRef.current, { opacity: 0, y: 30 })
      gsap.set('.stat-card', { opacity: 0, y: 20 })
      gsap.set(gateRef.current, { opacity: 0 })

      const wrapperWidth = window.innerWidth > 768 ? window.innerWidth * 1.5 : window.innerWidth * 2;
      
      // Set initial state of wrapper (diagonal, entering from right middle)
      gsap.set(wrapperRef.current, { 
        width: wrapperWidth, 
        height: '150vh', 
        rotation: -15, 
        xPercent: -50, 
        yPercent: -50,
        top: '50%',
        left: '50%',
        x: '80vw', // Start off right
        y: '-10vh',
        overflow: 'visible' // Necessary to allow 3D overflow
      });

      const step = 264 // Segment width (220px frame + 44px gap)
      const centerOffset = wrapperWidth / 2 - step / 2

      // 1. AUTO-PLAYING INFINITE FILMSTRIP
      const startIndex = 8; // Start at the second set of genres (Main 0)
      const startX = centerOffset - (startIndex * step);
      gsap.set(trackRef.current, { x: startX }) // Start exactly at Main 0

      // 3D Swirl Factor (animated to 0 during OTT transition)
      const swirlObj = { factor: 1 };

      let _frame3D = 0
      update3D = () => {
        // Run at ~30fps (skip every other 60fps tick)
        if (++_frame3D % 2 !== 0) return
        if (!trackRef.current) return;
        const trackX = gsap.getProperty(trackRef.current, 'x');
        const wrapperCenter = wrapperWidth / 2;

        segments.forEach((segment, i) => {
           // Center of the segment in the track's coordinate system
           const localCenterX = i * step + step / 2;
           // Absolute center of the segment in the wrapper's coordinate system
           const absX = trackX + localCenterX;
           const dist = absX - wrapperCenter;
           
           const normalized = dist / (window.innerWidth / 2);

           // 3D Swirl Math
           // Parabolic Z curve to push edges deep back
           const z = -Math.pow(Math.abs(normalized), 2.2) * 500 * swirlObj.factor;
           // Rotation Y to face inward
           const rotY = -normalized * 35 * swirlObj.factor;
           
           gsap.set(segment, {
             z: z,
             rotationY: rotY,
             transformPerspective: 1200
           });
        });
      };
      
      gsap.ticker.add(update3D);

      // Initialize phone-layer positions for the reel scroll effect
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

        filmTlRef.current.to({}, { duration: 1.5 }); // Hold

        filmTlRef.current.to(frame, { scale: 1, duration: 0.4, ease: 'power1.in' })
          .to(`.bg-layer-${genreIndex}`, { opacity: 0, scale: 1.05, duration: 0.8, ease: 'power2.in' }, '<');

        filmTlRef.current.to(trackRef.current, {
          x: nextX,
          duration: 1.2,
          ease: 'power3.inOut'
        });

        // SIMULTANEOUS VERTICAL SCROLL inside the phone
        filmTlRef.current.set(`.phone-layer-${nextGenreIndex}`, { yPercent: 100, zIndex: 3 }, '<');
        
        filmTlRef.current.to(`.phone-layer-${genreIndex}`, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power3.inOut'
        }, '<');
        
        filmTlRef.current.to(`.phone-layer-${nextGenreIndex}`, {
          yPercent: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          onComplete: () => {
             gsap.set(`.phone-layer-${genreIndex}`, { zIndex: 1 });
          }
        }, '<');

        // Instant reset to start to make the loop seamless
        if (i === startIndex + GENRES.length - 1) {
          filmTlRef.current.set(trackRef.current, { x: startX })
        }
      }

      // Play immediately
      filmTlRef.current.play()

      // 2. SCROLL TRIGGER FOR PHASES & OTT TRANSITION
      const transTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1000%',
          pin: true,
          scrub: 1.5,
          onEnter:     () => { window._wtsSceneVisible = false },
          onLeaveBack: () => { window._wtsSceneVisible = true  },
        }
      })

      // -- SCROLL PHASE 1: Strip enters, Phase 1 Text appears
      transTl.to(wrapperRef.current, {
        x: '20vw', // Move to bottom middle
        y: '20vh',
        duration: 1.5,
        ease: 'power2.out'
      }, 0)
      transTl.to(phase1TextRef.current, { opacity: 1, y: 0, duration: 1 }, 0.5)
      
      // Parallax hold
      transTl.to(phase1TextRef.current, { y: -30, duration: 1.5, ease: 'none' }, 1.5)
      transTl.to({}, { duration: 1.5 }, 1.5) // Hold Phase 1

      // -- SCROLL PHASE 2: Strip moves to center, Phase 1 hides, Phase 2 Text & Cards appear
      const phase2Label = 'phase2'
      transTl.add(phase2Label)
      
      transTl.to(phase1TextRef.current, { opacity: 0, y: -20, duration: 0.8 }, phase2Label)
      transTl.to(wrapperRef.current, {
        x: '0vw',
        y: '0vh',
        duration: 1.5,
        ease: 'power2.inOut'
      }, phase2Label)
      
      transTl.to(phase2TextRef.current, { opacity: 1, y: 0, duration: 0.8 }, phase2Label + '+=0.5')
      transTl.to('.stat-card', { 
        opacity: 1, 
        y: 0, 
        stagger: 0.15, 
        duration: 0.8,
        ease: 'power2.out'
      }, phase2Label + '+=0.5')
      transTl.to(gateRef.current, { opacity: 1, duration: 0.8 }, phase2Label + '+=0.8')

      // Parallax hold
      transTl.to(phase2TextRef.current, { y: -30, duration: 1.5, ease: 'none' }, phase2Label + '+=1.3')
      transTl.to('.stat-card', { y: -20, duration: 1.5, ease: 'none' }, phase2Label + '+=1.3')
      transTl.to({}, { duration: 1.5 }, phase2Label + '+=1.3') // Hold Phase 2

      // -- SCROLL PHASE 3: OTT Transition
      const transLabel = 'ott-trans'
      transTl.add(transLabel)

      // Fade out panel 1 UI elements
      transTl.to(uiLayerRef.current, { opacity: 0, duration: 0.5 }, transLabel)
      transTl.to(gateRef.current, { opacity: 0, duration: 0.5 }, transLabel)

      // Phone slides in diagonally
      transTl.to(phoneRef.current, {
        x: 0, y: 0, rotation: 0, opacity: 1, 
        duration: 2, 
        ease: 'power4.inOut'
      }, transLabel)

      // Flatten the 3D swirl before clipping
      transTl.to(swirlObj, { factor: 0, duration: 1, ease: 'power2.inOut' }, transLabel)
      
      // Wrapper shrinks to mask the filmstrip exactly to the phone screen
      const phoneW = window.innerWidth > 768 ? 340 : 280;
      const phoneH = window.innerWidth > 768 ? 680 : 580;
      
      transTl.to(wrapperRef.current, {
        width: phoneW - 24, // inner screen width
        height: phoneH - 24, // inner screen height
        borderRadius: 36,
        rotation: 0, // Animate back to upright
        duration: 2,
        ease: 'power4.inOut',
        onStart: () => {
           // Apply overflow hidden to mask the flat strip
           gsap.set(wrapperRef.current, { overflow: 'hidden' })
        }
      }, transLabel + '+=0.5')

      // Fade out the physical filmstrip track and fade in the 9:16 phone content
      transTl.to(trackRef.current, { opacity: 0, duration: 1 }, transLabel + '+=1.5')
      transTl.to('.phone-content-container', { opacity: 1, duration: 1 }, transLabel + '+=1.5')
      
      // Fade in OTT info panel text
      transTl.to(ottInfoRef.current, { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }, transLabel + '+=2')
      
      // Darken the base environment
      transTl.to(bgRef.current, { backgroundColor: '#0B0B0B', duration: 2 }, transLabel)

      // Parallax hold — reduced travel on mobile so text stays in viewport
      const ottParallax = window.innerWidth <= 768 ? -18 : -40;
      transTl.to(ottInfoRef.current, { y: ottParallax, duration: 2, ease: 'none' }, transLabel + '+=3.5')
      transTl.to({}, { duration: 2 }, transLabel + '+=3.5') // Hold OTT phase before transitioning to Panel 3

      // -- SCROLL PHASE 4: Transition to Panel 3 (Uttarakhand)
      const panel3Label = 'panel3'
      transTl.add(panel3Label)
      
      transTl.to(panel12Ref.current, { xPercent: -100, duration: 2, ease: 'power3.inOut' }, panel3Label)
      // Hide completely once offscreen so the wide rotated filmstrip doesn't bleed back into the window
      transTl.set(panel12Ref.current, { opacity: 0 }, panel3Label + '+=2')
      
      transTl.to(panel3Ref.current, { xPercent: -100, duration: 2, ease: 'power3.inOut' }, panel3Label)
      
      // Animate content of Panel 3
      transTl.fromTo('.panel-3 .uk-content-anchor > *, .panel-3 .uk-eyebrow-anchor, .panel-3 .uk-stat-anchor', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }, 
        panel3Label + '+=0.5'
      )
      
      // Parallax hold
      transTl.to('.panel-3 .uk-content-anchor, .panel-3 .uk-eyebrow-anchor, .panel-3 .uk-stat-anchor', 
        { y: -30, duration: 1.5, ease: 'none' }, 
        panel3Label + '+=1.5'
      )
      transTl.to({}, { duration: 1.5 }, panel3Label + '+=1.5') // Hold Panel 3

      // -- SCROLL PHASE 5: Transition to Panel 4 (Zoom into office gate)
      const panel4Label = 'panel4'
      transTl.add(panel4Label)
      
      // Zoom background and fade out content of Panel 3
      transTl.to('.panel-3 .uk-content-anchor, .panel-3 .uk-eyebrow-anchor, .panel-3 .uk-stat-anchor, .panel-3 .panel-overlay', { opacity: 0, duration: 0.5 }, panel4Label)
      transTl.to(panel3BgRef.current, { scale: 5, duration: 1, ease: 'power2.inOut' }, panel4Label)
      
      // Fade to black
      transTl.to(blackOverlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.in' }, panel4Label + '+=0.6')
      
      // Snap Panel 4 into position while black (exactly at the end of the zoom)
      // We also set opacity: 0 on panel 3 to guarantee it doesn't bleed its scaled background into the left edge
      transTl.set(panel3Ref.current, { xPercent: -200, opacity: 0 }, panel4Label + '+=1')
      transTl.set(panel4Ref.current, { xPercent: -200 }, panel4Label + '+=1')
      
      // Fade out from black immediately
      transTl.to(blackOverlayRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' }, panel4Label + '+=1')

      // Animate content of Panel 4 concurrently with the fade out
      transTl.fromTo('.panel-4 .panel-content > *', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 
        panel4Label + '+=1'
      )
      
      // Parallax hold
      transTl.to('.panel-4 .panel-content', { y: -30, duration: 1.2, ease: 'none' }, panel4Label + '+=1.8')
      transTl.to({}, { duration: 2.5 }, panel4Label + '+=1.8') // Hold Panel 4 — increased for slower scroll-away

      // -- SCROLL PHASE 6: Exit to 3D Scene
      const exitLabel = 'exit-panels'
      transTl.add(exitLabel)
      
      const exitProxy = { progress: 0 }
      transTl.to(exitProxy, {
        progress: 1,
        duration: 2.5,
        ease: 'power3.inOut',
        onStart: () => { window._wtsSceneVisible = true },
        onUpdate: () => {
          window._wtsExitProgress = exitProxy.progress;
        }
      }, exitLabel)
      
      // Immediately make the container transparent to reveal 3D scene
      transTl.set(containerRef.current, { backgroundColor: 'transparent' }, exitLabel)
      
      // Rapidly fade out the black transition veil
      const transitionOverlay = document.querySelector('.scene-transition-overlay')
      if (transitionOverlay) {
        transTl.to(transitionOverlay, { opacity: 0, duration: 0.5 }, exitLabel)
      }

      // Visually shrink Panel 4 to look like it's becoming the phone screen
      // We clip its sides and scale it down to match the pulling-away iPhone
      const clipY = window.innerHeight * 0.05;
      const clipX = window.innerWidth > 768 ? window.innerWidth * 0.3 : window.innerWidth * 0.1;
      
      transTl.to(panel4Ref.current, { 
        clipPath: `inset(${clipY}px ${clipX}px ${clipY}px ${clipX}px round 36px)`,
        scale: 0.85,
        duration: 2.5, 
        ease: 'power3.inOut' 
      }, exitLabel)
      
      // Fade out Panel 4 shortly after it starts shrinking, seamlessly handing off to the 3D iPhone
      transTl.to(panel4Ref.current, { opacity: 0, duration: 1, ease: 'power2.out' }, exitLabel + '+=0.8')
      
      // Also fade out the 2D phone mockup so it doesn't overlap the 3D phone
      transTl.to(phoneRef.current, { opacity: 0, duration: 0.5 }, exitLabel)

    }, containerRef)

    return () => {
      if (update3D) gsap.ticker.remove(update3D)
      ctx.revert()
    }
  }, [])

  return (
    <section ref={containerRef} className="wts-panels-container">
      <style>{`
        .wts-panels-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #0B0B0B;
          color: white;
        }

        .panel-1-2-content {
          position: absolute; inset: 0; width: 100%; height: 100%; will-change: transform;
        }

        .panel-3, .panel-4 {
          position: absolute; top: 0; left: 100%; width: 100%; height: 100%; 
          will-change: transform; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden;
        }
        .panel-3 { 
          background-color: #040E08; 
          z-index: 20; 
        }
        .panel-3-bg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover;
          object-position: center;
          transform-origin: 25% 60%;
          z-index: 1;
          will-change: transform;
        }
        /* Static image hidden on desktop; video hidden on mobile */
        .panel-3-bg--img { display: none; }
        .panel-4 {
          left: 200%; background: #0D0800; z-index: 20;
          clip-path: inset(0px 0px 0px 0px round 0px);
          will-change: clip-path, transform, opacity;
        }

        @media (max-width: 768px) {
          .panel-3-bg {
            transform-origin: center center;
          }
          .panel-3-bg--video { display: none; }
          .panel-3-bg--img   { display: block; }
        }

        .black-transition-overlay {
          position: absolute;
          inset: 0;
          background-color: #000;
          z-index: 50;
          opacity: 0;
          pointer-events: none;
        }

        .ambient-bg {
          position: absolute; inset: 0;
          background: #0B0B0B;
          transition: background 0.1s;
        }

        .ambient-bg-container {
          position: absolute; inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        .ambient-bg-layer {
          position: absolute; inset: -5%; /* slightly larger to avoid blur edges */
          width: 110%; height: 110%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          filter: blur(12px);
          will-change: opacity, transform;
          transform: scale(1.05);
        }

        .ambient-bg-overlay {
          position: absolute; inset: 0;
          background: rgba(11, 11, 11, 0.8);
          z-index: 2;
        }

        .grain-overlay {
          position: absolute; inset: 0;
          background-image: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
          opacity: 0.05;
          pointer-events: none;
          z-index: 3;
        }

        /* --- UI LAYER --- */
        .ui-layer {
          position: absolute; inset: 0;
          z-index: 10;
          pointer-events: none;
        }

        .wts-logo {
          position: absolute;
          top: clamp(24px, 4vh, 40px);
          left: clamp(24px, 4vw, 48px);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.15em;
        }

        .frame-counter {
          position: absolute;
          bottom: clamp(24px, 4vh, 40px);
          right: clamp(24px, 4vw, 48px);
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.6);
        }

        /* --- PHASE 1 TEXT --- */
        .phase1-text {
          position: absolute;
          top: 25vh;
          left: clamp(24px, 5vw, 64px);
          max-width: 540px;
          z-index: 15;
        }

        .phase1-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 400;
          line-height: 1.1;
          color: #fff;
          margin-bottom: 24px;
        }

        .phase1-body {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(14px, 1.4vw, 16px);
          line-height: 1.6;
          color: rgba(255,255,255,0.6);
        }

        /* --- PHASE 2 TEXT --- */
        .drama-panel-text {
          position: absolute;
          top: 15vh;
          left: clamp(24px, 5vw, 64px);
          max-width: 400px;
          z-index: 15;
          text-align: left;
        }

        .drama-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 16px;
        }

        .drama-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(48px, 6vw, 76px);
          font-weight: 400;
          line-height: 1.05;
          color: #fff;
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }

        .drama-body {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(13px, 1.3vw, 15px);
          line-height: 1.75;
          color: rgba(255,255,255,0.5);
        }

        /* --- STAT CARDS --- */
        .stat-cards-container {
          position: absolute;
          bottom: 12vh;
          right: clamp(24px, 5vw, 64px);
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          z-index: 15;
          max-width: 90vw;
        }

        .stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 16px 20px;
          backdrop-filter: blur(10px);
          width: 180px;
        }

        .stat-value {
          font-family: 'DM Sans', sans-serif;
          font-size: 28px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          line-height: 1.4;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 1024px) {
          .stat-cards-container {
            bottom: 5vh;
            right: clamp(16px, 3vw, 32px);
            gap: 12px;
          }
          .stat-card {
            width: 150px;
            padding: 12px 16px;
          }
          .stat-value { font-size: 22px; }
          .stat-label { font-size: 10px; }
        }

        @media (max-width: 768px) {
          .stat-cards-container {
            flex-wrap: wrap;
            bottom: 8vh;
            left: 24px;
            right: 24px;
            justify-content: center;
          }
        }

        /* ── MOBILE TEXT PANELS 1 & 2 ───────────────────────────────────────
           The filmstrip occupies the lower ~55 % of the screen on mobile.
           Anchoring both text blocks at top keeps them clear of the strip,
           the phone mockup, and the OTT info panel. */
        @media (max-width: 767px) {
          .phase1-text {
            top: 7vh;
            bottom: auto;
            left: 16px;
            right: 16px;
            max-width: none;
            background: linear-gradient(135deg, rgba(4,4,14,0.86) 0%, rgba(6,6,22,0.78) 100%);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border: 1px solid rgba(255,255,255,0.09);
            border-radius: 16px;
            padding: 18px 20px;
          }
          .phase1-title {
            font-size: clamp(26px, 7vw, 36px);
            font-weight: 500;
            margin-bottom: 10px;
          }
          .phase1-body {
            font-size: 13px;
            line-height: 1.55;
            color: rgba(255,255,255,0.82);
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .drama-panel-text {
            top: 7vh;
            bottom: auto;
            left: 16px;
            right: 16px;
            max-width: none;
            background: linear-gradient(135deg, rgba(4,4,14,0.86) 0%, rgba(6,6,22,0.78) 100%);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border: 1px solid rgba(255,255,255,0.09);
            border-radius: 16px;
            padding: 18px 20px;
          }
          .drama-eyebrow {
            color: rgba(255,255,255,0.65);
          }
          .drama-title {
            font-size: clamp(32px, 8vw, 44px);
            font-weight: 500;
            margin-bottom: 10px;
          }
          .drama-body {
            font-size: 13px;
            color: rgba(255,255,255,0.78);
          }

          .stat-cards-container {
            bottom: 3.5vh;
            gap: 8px;
          }
          .stat-card {
            width: 108px;
            padding: 10px 12px;
          }
          .stat-value { font-size: 20px; }
          .stat-label { font-size: 9px; }
        }

        /* --- PROJECTOR GATE --- */
        .projector-gate {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(-15deg);
          width: clamp(180px, 17vw, 240px);
          height: clamp(180px, 17vw, 240px);
          pointer-events: none;
          z-index: 5;
        }

        .gate-corner {
          position: absolute;
          width: 24px; height: 24px;
          border: 1px solid rgba(255,255,255,0.4);
        }
        .gate-corner.tl { top: -20px; left: -20px; border-right: none; border-bottom: none; }
        .gate-corner.tr { top: -20px; right: -20px; border-left: none; border-bottom: none; }
        .gate-corner.bl { bottom: -20px; left: -20px; border-right: none; border-top: none; }
        .gate-corner.br { bottom: -20px; right: -20px; border-left: none; border-top: none; }

        /* --- FILMSTRIP (3D Segmented) --- */
        .filmstrip-wrapper {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          z-index: 4;
          will-change: width, height, border-radius, transform;
          /* overflow will be changed to hidden during OTT transition via JS */
          overflow: visible; 
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .filmstrip-track {
          display: flex;
          align-items: center;
          will-change: transform;
          position: relative;
          transform-style: preserve-3d;
        }

        .film-segment {
          position: relative;
          width: 264px; /* 220px frame + 44px gap */
          height: 292px; /* 220px frame + 36px top + 36px bottom rail padding */
          background: #000;
          flex-shrink: 0;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
        }

        .film-frame {
          position: relative;
          width: 220px;
          height: 220px;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          will-change: transform, scale;
        }

        .frame-image {
          width: 100%; height: 100%;
          background-size: cover;
          background-position: center;
        }

        .frame-code {
          position: absolute;
          top: -28px; left: 0;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.5);
          transform: rotate(-90deg);
          transform-origin: left bottom;
        }

        .film-rail {
          position: absolute;
          left: 0; right: 0;
          height: 16px;
          /* Segment width is 264, which is exactly 11 cycles of 24px! Seamless tiling */
          background-image: repeating-linear-gradient(to right, #fff 0, #fff 12px, transparent 12px, transparent 24px);
          animation: sprocketMove 0.6s linear infinite;
          will-change: background-position;
        }
        .film-rail.top { top: 8px; }
        .film-rail.bottom { bottom: 8px; }

        @keyframes sprocketMove {
          from { background-position: 0 0; }
          to { background-position: -24px 0; }
        }

        .phone-content-container {
          position: absolute;
          inset: 0;
          z-index: 1; /* Behind track */
          opacity: 0; /* Hidden until OTT transition */
          pointer-events: none;
          overflow: hidden; /* Crop sliding layers */
        }

        .phone-layer {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          background-size: cover;
          background-position: center;
          will-change: transform;
          display: flex;
          flex-direction: column;
        }

        .phone-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 60%, rgba(0,0,0,0.6) 100%);
          z-index: 1; pointer-events: none;
        }

        /* --- OTT UI ELEMENTS --- */
        .ott-ui-container {
          position: relative; z-index: 2;
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: 24px 20px 32px;
        }

        .ott-top-bar {
          display: flex; justify-content: space-between; align-items: center;
          font-family: 'DM Sans', sans-serif;
        }
        
        .ott-logo {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }
        
        .ott-nav {
          font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.8);
          border-bottom: 2px solid white; padding-bottom: 4px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        .ott-bottom-area {
          display: flex; justify-content: space-between; align-items: flex-end;
        }

        .ott-content-info {
          flex: 1; padding-right: 16px;
        }

        .ott-genre-tag {
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 8px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        }

        .ott-series-title {
          font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 400;
          line-height: 1.1; margin-bottom: 6px; text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        }

        .ott-ep-info {
          font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.7);
          margin-bottom: 12px; letter-spacing: 0.05em;
        }

        .ott-desc {
          font-family: 'DM Sans', sans-serif; font-size: 13px; line-height: 1.5;
          color: rgba(255,255,255,0.85); margin-bottom: 16px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .ott-play-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; color: black; padding: 10px 20px;
          border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: transform 0.2s; border: none;
        }
        .ott-play-btn:hover { transform: scale(1.05); }

        .ott-action-column {
          display: flex; flex-direction: column; gap: 16px; align-items: center;
        }

        .ott-action-btn {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
          color: rgba(255,255,255,0.8); cursor: pointer;
        }

        .ott-icon-circle {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; border: 1px solid rgba(255,255,255,0.2);
          transition: background 0.2s;
        }
        .ott-action-btn:hover .ott-icon-circle { background: rgba(255,255,255,0.3); }

        /* --- IPHONE MOCKUP --- */
        .iphone-mockup {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: clamp(280px, 340px, 340px);
          height: clamp(580px, 680px, 680px);
          border-radius: 48px;
          border: 12px solid #1A1A1A;
          box-shadow: 0 0 0 2px #333, inset 0 0 0 1px #000, 0 30px 60px rgba(0,0,0,0.5);
          z-index: 8;
          pointer-events: none;
        }
        
        .iphone-island {
          position: absolute;
          top: 10px; left: 50%;
          transform: translateX(-50%);
          width: 90px; height: 26px;
          background: #000;
          border-radius: 13px;
        }

        /* --- OTT CONTENT --- */
        .ott-panel-info {
          position: absolute;
          left: clamp(40px, 10vw, 120px);
          top: 38%;
          transform: translateY(-50%);
          max-width: 380px;
          z-index: 10;
        }

        .ott-slate {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.4);
          margin-bottom: 16px;
        }

        .ott-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 400;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .ott-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255,255,255,0.6);
          margin-bottom: 32px;
        }

        .ott-cta {
          padding: 14px 32px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          letter-spacing: 0.05em;
          color: #fff;
          background: transparent;
          cursor: pointer;
          transition: background 0.3s, color 0.3s;
        }
        .ott-cta:hover {
          background: #fff;
          color: #000;
        }

        @media (max-width: 768px) {
          /* Phone CSS dimensions now match GSAP shrink target (280×580) */
          .iphone-mockup {
            width: 280px;
            height: 580px;
            top: 50%; /* Aligned with filmstrip-wrapper center set by GSAP */
          }
          .ott-panel-info {
            left: 16px;
            right: 16px;
            top: 22px;
            bottom: auto;
            transform: none;
            text-align: center;
            max-width: none;
          }
          .ott-headline {
            font-size: clamp(18px, 5vw, 22px);
            line-height: 1.1;
            margin-bottom: 6px;
          }
          .ott-slate {
            font-size: 9px;
            letter-spacing: 0.12em;
            margin-bottom: 5px;
          }
          .ott-body {
            display: none;
          }
          .ott-cta {
            padding: 7px 16px;
            font-size: 11px;
          }
          /* Panel 3 — Uttarakhand */
          .uk-content-anchor {
            top: auto;
            bottom: 100px;
            left: 20px;
            right: 20px;
            transform: none;
            text-align: left;
            max-width: none;
          }
          .uk-title {
            font-size: clamp(34px, 8.5vw, 52px) !important;
          }
          .uk-body {
            font-size: 13px;
            max-width: 100%;
            margin-left: 0;
          }
          .uk-eyebrow-anchor {
            top: 72px;
            left: 20px;
          }
          .uk-stat-anchor {
            bottom: 20px;
            left: 20px;
            font-size: 10px;
          }
        }

        /* --- RESTORED PANEL 3 & 4 STYLES --- */
        .panel-content {
          position: relative; z-index: 4;
          padding: 0 clamp(28px, 6vw, 80px) clamp(40px, 6vh, 72px);
          max-width: 640px;
        }

        .panel-eyebrow {
          font-family: 'DM Sans', sans-serif; font-size: clamp(9px, 1vw, 11px); font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 14px;
        }

        .panel-title {
          font-family: 'Cormorant Garamond', serif; font-size: clamp(42px, 6vw, 76px); font-weight: 400;
          line-height: 1.05; color: #fff; margin-bottom: 20px; letter-spacing: -0.01em;
        }

        .panel-body {
          font-family: 'DM Sans', sans-serif; font-size: clamp(13px, 1.3vw, 15px); line-height: 1.75;
          color: rgba(255,255,255,0.5); max-width: 420px; margin-bottom: 28px;
        }

        .panel-cta {
          display: inline-flex; align-items: center; gap: 10px; padding: 10px 22px;
          border: 0.5px solid rgba(255,255,255,0.18); border-radius: 999px; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500; letter-spacing: 0.06em; color: #fff; background: rgba(255,255,255,0.05);
          cursor: pointer; transition: background 0.25s, border-color 0.25s; text-decoration: none;
        }
        .panel-cta:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }

        .cta-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        .panel-num {
          position: absolute; top: 32px; right: clamp(28px, 5vw, 60px);
          font-family: 'Cormorant Garamond', serif; font-size: clamp(80px, 12vw, 140px); font-weight: 300;
          color: rgba(255,255,255,0.03); line-height: 1; z-index: 1; user-select: none; pointer-events: none;
        }
        
        .panel-overlay { position: absolute; inset: 0; z-index: 3; }

        /* --- UTTARAKHAND PANEL SPECIFICS --- */
        .uk-eyebrow-anchor {
          position: absolute;
          top: clamp(40px, 8vh, 80px);
          left: clamp(28px, 6vw, 80px);
          display: flex; align-items: center; gap: 12px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 500; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.9);
          text-shadow: 0 1px 4px rgba(0,0,0,1), 0 2px 12px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.8);
          z-index: 5;
        }

        .uk-line { width: 24px; height: 1px; background: rgba(255,255,255,0.8); box-shadow: 0 1px 4px rgba(0,0,0,1), 0 2px 12px rgba(0,0,0,0.9); }

        .uk-stat-anchor {
          position: absolute;
          bottom: clamp(40px, 8vh, 80px);
          left: clamp(28px, 6vw, 80px);
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.15em;
          color: rgba(255,255,255,0.8);
          text-shadow: 0 1px 4px rgba(0,0,0,1), 0 2px 12px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.8);
          z-index: 5;
        }

        .uk-content-anchor {
          position: absolute;
          top: 45%; right: clamp(28px, 6vw, 80px);
          transform: translateY(-50%);
          text-align: right;
          max-width: 600px;
          z-index: 5;
        }

        .uk-title {
          font-size: clamp(40px, 5.5vw, 76px);
          line-height: 1.1; margin-bottom: 24px;
          text-shadow: 0 2px 8px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.9), 0 8px 32px rgba(0,0,0,0.8), 0 16px 64px rgba(0,0,0,0.6);
        }

        .uk-studio {
          font-size: clamp(56px, 8.5vw, 110px);
          display: inline-block;
          margin-top: -10px;
          background: linear-gradient(to right, #F6B84A, #E4663E);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: none;
          filter: drop-shadow(0 4px 16px rgba(0,0,0,0.8));
        }

        .uk-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.6;
          color: rgba(255,255,255,0.95);
          margin-left: auto; max-width: 480px;
          text-shadow: 0 1px 4px rgba(0,0,0,1), 0 2px 12px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.8);
        }

        .scene-radio-full { 
          position: absolute; inset: 0; z-index: 1;
          width: 100%; height: 100%;
          mix-blend-mode: screen;
          overflow: hidden;
        }

        @keyframes panWave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes radioBarPulse {
          from { transform: scaleY(0.35); }
          to   { transform: scaleY(1.85); }
        }

        /* --- RADIO PANEL SPECIFICS --- */
        .radio-eyebrow {
          display: flex; align-items: center; gap: 12px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 500; letter-spacing: 0.2em;
          color: #E2A94E;
          margin-bottom: 24px;
        }

        .radio-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #E26A4E;
          box-shadow: 0 0 8px #E26A4E;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        .radio-title {
          font-size: clamp(64px, 10vw, 140px);
          line-height: 1.0; margin-bottom: 24px;
          text-shadow: 0 4px 32px rgba(0,0,0,0.8);
        }

        .radio-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; line-height: 1.6;
          color: rgba(255,255,255,0.7);
          max-width: 500px;
        }

        .radio-tune-btn {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 16px 36px;
          background: rgba(226, 106, 78, 0.05);
          border: 1px solid rgba(226, 106, 78, 0.4);
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #FFFFFF;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          margin-top: 40px;
          backdrop-filter: blur(8px);
        }

        .radio-tune-btn:hover {
          background: rgba(226, 106, 78, 0.15);
          border-color: rgba(226, 106, 78, 0.8);
          color: #fff;
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(226, 106, 78, 0.3);
        }

        .radio-tune-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: skewX(-20deg);
          animation: tuneShine 4s infinite;
        }

        .radio-tune-btn .radio-dot {
          width: 6px; height: 6px;
          box-shadow: 0 0 12px #E26A4E;
        }

        @keyframes tuneShine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }

        /* ── MOBILE PANEL 4 (Radio) ─────────────────────────────────── */
        @media (max-width: 767px) {
          .panel-content {
            padding: 0 20px 36px;
          }
          .radio-title {
            font-size: clamp(48px, 13vw, 64px) !important;
            line-height: 1.0;
            margin-bottom: 16px;
          }
          .radio-body {
            font-size: 13px;
            max-width: 100%;
          }
          .radio-tune-btn {
            padding: 13px 28px;
            font-size: 12px;
            margin-top: 28px;
          }
          .radio-eyebrow {
            font-size: 10px;
          }
        }

      `}</style>

      <div className="panel-1-2-content" ref={panel12Ref}>
        <div className="ambient-bg" ref={bgRef} />
      
      <div className="ambient-bg-container" ref={bgLayersRef}>
        {GENRES.map((g, i) => (
          <div 
            key={i} 
            className={`ambient-bg-layer bg-layer-${i}`} 
            style={{ backgroundImage: `url("${g.img}")` }}
          />
        ))}
        <div className="ambient-bg-overlay" />
      </div>

      <div className="grain-overlay" />

      <div className="ui-layer" ref={uiLayerRef}>
        <div className="wts-logo">WTS</div>
        <div className="frame-counter" ref={counterRef}>01 / 08</div>
        
        {/* Phase 1 Text */}
        <div className="phase1-text" ref={phase1TextRef}>
          <h1 className="phase1-title">The next billion screens are vertical.</h1>
          <p className="phase1-body">
            Vertical drama is the fastest-growing content format globally — 78% of mobile video is now consumed in portrait mode. India alone has 650M+ smartphone users, and Gen Z has never watched a film horizontally. WTS produces original vertical micro-dramas at cinematic quality — real locations, real direction, real craft — but engineered for a 9:16 world. Not repurposed. Built vertical from frame one.
          </p>
        </div>

        {/* Phase 2 Text */}
        <div className="drama-panel-text" ref={phase2TextRef}>
          <div className="drama-eyebrow">Vertical Micro-Drama</div>
          <h1 className="drama-title">Stories told<br/>in portrait.</h1>
          <p className="drama-body">We produce high-fidelity vertical dramas built natively for mobile — shot, edited, and paced for the new generation of storytelling.</p>
        </div>

        {/* Phase 2 Stat Cards */}
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
        <div className="gate-corner tl" />
        <div className="gate-corner tr" />
        <div className="gate-corner bl" />
        <div className="gate-corner br" />
      </div>

      <div className="filmstrip-wrapper" ref={wrapperRef}>
        <div className="phone-content-container">
          {GENRES.map((g, i) => (
            <div 
              key={i} 
              className={`phone-layer phone-layer-${i}`} 
              style={{ backgroundImage: `url("${g.img}")` }}
            >
              <div className="phone-overlay" />
              
              <div className="ott-ui-container">
                <div className="ott-top-bar">
                  <span className="ott-logo">WTS ORIGINALS</span>
                  <span className="ott-nav">For You</span>
                </div>
                
                <div className="ott-bottom-area">
                  <div className="ott-content-info">
                    <div className="ott-genre-tag" style={{ color: g.color }}>{g.name}</div>
                    <h3 className="ott-series-title">{g.title}</h3>
                    <div className="ott-ep-info">{g.ep}</div>
                    <p className="ott-desc">{g.desc}</p>
                    <button className="ott-play-btn">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg>
                      Watch Now
                    </button>
                  </div>
                  
                  <div className="ott-action-column">
                    <div className="ott-action-btn">
                      <div className="ott-icon-circle">+</div>
                      <span>List</span>
                    </div>
                    <div className="ott-action-btn">
                      <div className="ott-icon-circle">➦</div>
                      <span>Share</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="filmstrip-track" ref={trackRef}>
          {/* Loop array of genres to create continuous 3D segments */}
          {[...GENRES, ...GENRES, ...GENRES].map((g, i) => (
            <div className="film-segment" key={i} data-index={i}>
              <div className="film-rail top" />
              
              <div className="film-frame">
                <div className="frame-image" style={{ 
                  backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.5)), url("${g.img}")`,
                }} />
                <div className="frame-code">{g.code}</div>
              </div>

              <div className="film-rail bottom" />
            </div>
          ))}
        </div>
      </div>

      <div className="iphone-mockup" ref={phoneRef}>
        <div className="iphone-island" />
      </div>

        <div className="ott-panel-info" ref={ottInfoRef}>
          <div className="ott-slate">VERTICAL · ORIGINAL · ON DEMAND</div>
          <h2 className="ott-headline">
            <span style={{ display: 'block' }}>Drama made for</span>
            <span style={{ display: 'block' }}>the way you watch.</span>
          </h2>
          <p className="ott-body">Every title conceived, directed and produced in 9:16 — from the mountains of Uttarakhand to your screen. No cropping. No compromise.</p>
          <button className="ott-cta">Coming Soon</button>
        </div>
      </div>

      <div className="panel-3" ref={panel3Ref}>
        <video
          className="panel-3-bg panel-3-bg--video"
          ref={panel3BgRef}
          src="/6c38c89a-7ef7-4317-8a0b-09d210bf76e0.webm"
          poster="/images/929ba58c-75b3-4d6a-8453-c4184f6d174e.jpg"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Static fallback shown on mobile where video may not autoplay */}
        <img
          className="panel-3-bg panel-3-bg--img"
          src="/images/929ba58c-75b3-4d6a-8453-c4184f6d174e.jpg"
          alt=""
          aria-hidden="true"
        />
        <div className="panel-overlay" style={{ zIndex: 3 }} />
        
        <div className="uk-eyebrow-anchor">
          <span className="uk-line"></span>
          STRATEGIC LOCATION
        </div>

        <div className="uk-content-anchor">
          <h2 className="panel-title uk-title">
            <span style={{ display: 'block' }}>The Mountain That</span>
            <span style={{ display: 'block' }}>Becomes a <span className="uk-studio">Studio.</span></span>
          </h2>
          <p className="uk-body">Uttarakhand is not a filming location. It is a genre library — every landscape a natural set, every culture a story, and every policy rupee a strategic advantage.</p>
        </div>

        <div className="uk-stat-anchor">
          28°N · 79°E — Uttarakhand
        </div>
      </div>

      <div className="panel-4" ref={panel4Ref}>
        <RadioScene />
        <div className="panel-overlay" style={{ background: 'linear-gradient(to top, #0D0800 30%, transparent 100%)' }} />
        <div className="panel-content">
          <div className="radio-eyebrow">
            <span className="radio-dot" />
            ON AIR
          </div>
          <h2 className="panel-title radio-title">
            <span style={{ display: 'block' }}>Where WTS</span>
            <span style={{ display: 'block' }}>speaks.</span>
          </h2>
          <p className="radio-body">Stories don't end on screen. WalkTalk Radio is where our directors, writers, and talent come to talk — long-form conversations, music, and narrative audio from the WTS universe.</p>
          <button className="radio-tune-btn" onClick={handleTuneIn}>
            <span className="radio-dot" />
            Tune In Live
          </button>
        </div>
      </div>
      
      <div className="black-transition-overlay" ref={blackOverlayRef} />
    </section>
  )
}
