import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Copy, Printer, Check, Music, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── YouTube IFrame API types ────────────────────────────────────────────────
declare global {
  interface Window {
    YT: {
      Player: new (id: string, config: {
        width: number;
        height: number;
        videoId: string;
        playerVars: Record<string, number | string>;
        events: {
          onReady?: (e: {
            target: YTPlayerInstance;
          }) => void;
          onStateChange?: (e: {
            data: number;
          }) => void;
        };
      }) => YTPlayerInstance;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}
interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
  destroy: () => void;
}

// ─── Letter content ──────────────────────────────────────────────────────────
interface LetterContent {
  date: string;
  salutation: string;
  body1: string;
  body2: string;
  body3: string;
  closing: string;
  signature: string;
  ps: string;
}
const DEFAULT_CONTENT: LetterContent = {
  date: new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }),
  salutation: 'My Dearest Hunhun,',
  body1: "Happy 6th month baby ko, it's been half a year na, it feels so fast and slow at the same time no? These past 6 months have been the best time of my life. I know it's not the smoothest road but i would choose it every single time bebe and it's not because i'm settling but because i can really see a future with you in it bebe.",
  body2: "I'm sorry for being so sensitive these past few months bebe (mas maarte pa sa'yo e), i'll try to fix that po. Bawi po ako ng gifts sa susunod ha. I'm so grateful to share my life with you bebe. Thank you for being so understanding of me, for always making an effort even tho it's not that easy for you and for loving me wholeheartedly bebe. ",
  body3: 'You are my favorite person, my safe place and my constant. Just thinking of you makes me feel at ease and makes me smile. I love you so much my hunhun more than words could ever say. Happy halfsarry baby. ',
  closing: 'Forever Yours,',
  signature: 'Rien',
  ps: ''
};

// ─── Small SVG wax seal ──────────────────────────────────────────────────────
const WaxSeal = ({
  cracking
}: {
  cracking: boolean;
}) => <div className={cn('w-12 h-12 flex items-center justify-center', cracking && 'seal-cracking')} style={{
  transformOrigin: 'center'
}}>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" fill="#C97B84" />
      <circle cx="24" cy="24" r="20" fill="#D4878F" />
      <circle cx="24" cy="24" r="17" fill="#C97B84" stroke="#B86B74" strokeWidth="0.5" />
      {/* Decorative border ring */}
      {Array.from({
      length: 16
    }).map((_, i) => {
      const angle = i / 16 * Math.PI * 2;
      const x = 24 + 18.5 * Math.cos(angle);
      const y = 24 + 18.5 * Math.sin(angle);
      return <circle key={`dot-${i}`} cx={x} cy={y} r="1.2" fill="#B86B74" />;
    })}
      {/* Heart shape */}
      <path d="M24 33 C24 33 13 26.5 13 19.5 C13 16 15.8 13.5 19 13.5 C21 13.5 23 14.7 24 16 C25 14.7 27 13.5 29 13.5 C32.2 13.5 35 16 35 19.5 C35 26.5 24 33 24 33Z" fill="#FFFDF9" fillOpacity="0.9" />
    </svg>
  </div>;

// ─── Floating heart particle ─────────────────────────────────────────────────
interface HeartParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}
const HEART_PARTICLES: HeartParticleData[] = [{
  id: 1,
  x: 12,
  y: 30,
  size: 14,
  delay: 0,
  duration: 3.2
}, {
  id: 2,
  x: 88,
  y: 50,
  size: 10,
  delay: 0.8,
  duration: 2.8
}, {
  id: 3,
  x: 20,
  y: 70,
  size: 8,
  delay: 1.4,
  duration: 3.6
}, {
  id: 4,
  x: 78,
  y: 20,
  size: 12,
  delay: 0.4,
  duration: 3.0
}, {
  id: 5,
  x: 50,
  y: 12,
  size: 9,
  delay: 1.8,
  duration: 2.6
}, {
  id: 6,
  x: 92,
  y: 78,
  size: 11,
  delay: 0.6,
  duration: 3.4
}];

// ─── Decorative border inside letter ────────────────────────────────────────
const DecorativeBorder = () => <div className="absolute inset-4 border-[1px] border-[#E8A0A0]/30 pointer-events-none rounded-sm">
    <div className="absolute inset-1 border-[1px] border-[#E8A0A0]/15 rounded-sm" />
  </div>;

// ─── Corner ornament ─────────────────────────────────────────────────────────
const CornerOrnament = ({
  className
}: {
  className?: string;
}) => <div className={cn('absolute w-16 h-16 pointer-events-none opacity-35', className)}>
    <svg viewBox="0 0 100 100" fill="none" stroke="#E8A0A0" strokeWidth="1">
      <path d="M10,90 Q30,70 50,90 T90,90" />
      <path d="M10,10 L10,30 Q30,30 30,10 Z" />
      <circle cx="15" cy="15" r="2" fill="#E8A0A0" />
    </svg>
  </div>;

// ─── Phase type ───────────────────────────────────────────────────────────────
type Phase = 'idle' | 'cracking' | 'opening' | 'letter';

// ─── Main component ───────────────────────────────────────────────────────────
export const LoveLetterTemplate: React.FC = () => {
  const [phase, setPhase] = React.useState<Phase>('idle');
  const [content, setContent] = React.useState<LetterContent>(DEFAULT_CONTENT);
  const [copied, setCopied] = React.useState(false);
  const [musicPlaying, setMusicPlaying] = React.useState(false);
  const [ytReady, setYtReady] = React.useState(false);
  const playerRef = React.useRef<YTPlayerInstance | null>(null);
  const ytContainerRef = React.useRef<HTMLDivElement>(null);

  // ── Inject YouTube IFrame API ──
  // ── Inject YouTube IFrame API ──
React.useEffect(() => {
  // If YT is already loaded globally (from a past hot-reload/refresh), just turn it on
  if (window.YT && window.YT.Player) {
    setYtReady(true);
    return;
  }

  // Set up the global callback for when the script finishes downloading
  window.onYouTubeIframeAPIReady = () => {
    setYtReady(true);
  };

  // If the script element doesn't exist yet, create and inject it
  if (!document.getElementById('yt-api-script')) {
    const script = document.createElement('script');
    script.id = 'yt-api-script';
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  }
}, []);

// ── Create player once API is ready ──
React.useEffect(() => {
  if (!ytReady) return;
  if (playerRef.current) return;

  // Make sure the DOM element actually exists before mounting
  const el = document.getElementById('yt-player');
  if (!el) return;

  playerRef.current = new window.YT.Player('yt-player', {
    width: 1,
    height: 1,
    videoId: '0SqtBZNwF0M',
    playerVars: {
      autoplay: 1,
      controls: 0,
      loop: 1,
      playlist: '0SqtBZNwF0M',
      rel: 0,
      modestbranding: 1
    },
    events: {
      onReady: (event) => {
        const player = event.target as any;
        player.playVideo();
        player.setVolume(100);
      },
      onStateChange: e => {
        if (window.YT?.PlayerState) {
          setMusicPlaying(e.data === window.YT.PlayerState.PLAYING);
        }
      }
    }
  });

  return () => {
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      playerRef.current.destroy();
      playerRef.current = null;
    }
  };
}, [ytReady]);

  // ── Envelope click handler ──
  const handleEnvelopeClick = () => {
    if (phase !== 'idle') return;

    // Phase 1: crack seal
    setPhase('cracking');
    setTimeout(() => {
      // Phase 2: flap opens
      setPhase('opening');
      setTimeout(() => {
        // Phase 3: show letter
        setPhase('letter');

        // Start music on user gesture
        try {
          playerRef.current?.playVideo();
        } catch (_) {
          // silently ignore if not ready
        }
      }, 900);
    }, 560);
  };
  const toggleMusic = () => {
    if (!playerRef.current) return;
    if (musicPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };
  const updateContent = (key: keyof LetterContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleCopy = () => {
    const text = `${content.date}\n\n${content.salutation}\n\n${content.body1}\n\n${content.body2}\n\n${content.body3}\n\n${content.closing}\n${content.signature}\n\nP.S. ${content.ps}`.trim();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const handlePrint = () => window.print();

  // Flap CSS transforms
  const flapRotation = phase === 'opening' || phase === 'letter' ? 'rotateX(-180deg)' : 'rotateX(0deg)';
  const flapTransition = 'transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  return <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 selection:bg-[#E8A0A0]/20" style={{
    background: '#FDF6F0'
  }}>
      {/* Hidden YouTube player container */}
      <div ref={ytContainerRef} style={{
      position: 'fixed',
      left: '-9999px',
      top: '-9999px',
      width: 1,
      height: 1,
      opacity: 0,
      pointerEvents: 'none'
    }} aria-hidden="true">
        <div id="yt-player" />
      </div>

      {/* ── Envelope Scene ── */}
      <AnimatePresence>
        {(phase === 'idle' || phase === 'cracking' || phase === 'opening') && <motion.div key="envelope-scene" initial={{
        opacity: 0,
        scale: 0.92
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.82,
        transition: {
          duration: 0.5,
          ease: 'easeIn'
        }
      }} transition={{
        duration: 0.6,
        ease: 'easeOut'
      }} className="flex flex-col items-center gap-8">
            {/* Floating heart particles */}
            <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
              {HEART_PARTICLES.map(p => <div key={p.id} style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `heartFloat ${p.duration}s ease-in-out ${p.delay}s infinite`
          }}>
                  <Heart style={{
              width: p.size,
              height: p.size,
              color: '#E8A0A0',
              fill: '#E8A0A0',
              opacity: 0.35
            }} />
                </div>)}
            </div>

            {/* Envelope wrapper — applies float animation when idle */}
            <button onClick={handleEnvelopeClick} className={cn('relative focus:outline-none cursor-pointer', phase === 'idle' && 'envelope-float')} style={{
          width: 320,
          height: 220
        }} aria-label="Open envelope">
              {/* Envelope body */}
              <div className="relative w-full h-full rounded-sm overflow-visible" style={{
            background: '#FFFDF9',
            boxShadow: '0 20px 60px rgba(180,120,120,0.22), 0 4px 16px rgba(180,120,120,0.12)'
          }}>
                {/* Bottom V fold lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 220" preserveAspectRatio="none" style={{
              zIndex: 1
            }}>
                  {/* Left bottom fold */}
                  <line x1="0" y1="220" x2="160" y2="130" stroke="#E8A0A0" strokeWidth="0.8" strokeOpacity="0.35" />
                  {/* Right bottom fold */}
                  <line x1="320" y1="220" x2="160" y2="130" stroke="#E8A0A0" strokeWidth="0.8" strokeOpacity="0.35" />
                  {/* Left top fold */}
                  <line x1="0" y1="0" x2="160" y2="130" stroke="#E8A0A0" strokeWidth="0.8" strokeOpacity="0.2" />
                  {/* Right top fold */}
                  <line x1="320" y1="0" x2="160" y2="130" stroke="#E8A0A0" strokeWidth="0.8" strokeOpacity="0.2" />
                </svg>

                {/* Subtle envelope side shading */}
                <div className="absolute inset-0 rounded-sm pointer-events-none" style={{
              background: 'linear-gradient(180deg, rgba(232,160,160,0.06) 0%, transparent 40%)'
            }} />

                {/* Flap — 3D perspective container */}
                <div className="absolute top-0 left-0 w-full" style={{
              height: '55%',
              perspective: 600,
              perspectiveOrigin: '50% 0%',
              zIndex: 10
            }}>
                  <div style={{
                width: '100%',
                height: '100%',
                transformOrigin: 'top center',
                transform: flapRotation,
                transition: flapTransition,
                backfaceVisibility: 'hidden'
              }}>
                    {/* Flap shape — triangle pointing down */}
                    <svg width="320" height="121" viewBox="0 0 320 121" fill="none" style={{
                  display: 'block'
                }}>
                      <path d="M0,0 L320,0 L160,121 Z" fill="#F5E8E4" />
                      <path d="M0,0 L320,0 L160,121 Z" stroke="#E8A0A0" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
                    </svg>
                  </div>
                </div>

                {/* Wax seal — centered on flap join */}
                <div className="absolute z-20 pointer-events-none" style={{
              top: '42%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
                  <WaxSeal cracking={phase === 'cracking'} />
                </div>
              </div>
            </button>

            {/* Label */}
            <motion.p initial={{
          opacity: 0,
          y: 8
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4,
          duration: 0.6
        }} style={{
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          color: '#C9848A',
          fontSize: '1rem',
          letterSpacing: '0.04em'
        }}>
              Click to open
            </motion.p>
          </motion.div>}
      </AnimatePresence>

      {/* ── Letter Card ── */}
      <AnimatePresence>
        {phase === 'letter' && <motion.div key="letter-scene" initial={{
        opacity: 0,
        y: 60,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} transition={{
        duration: 0.85,
        ease: [0.25, 0.46, 0.45, 0.94]
      }} className="flex flex-col items-center w-full">
            {/* Letter card */}
            <div className="print-area relative w-full bg-[#FFFDF9] overflow-hidden" style={{
          maxWidth: 680,
          padding: 'clamp(2.5rem, 5vw, 5rem)',
          boxShadow: '0 32px 80px rgba(180,120,120,0.18), 0 8px 24px rgba(180,120,120,0.10)'
        }}>
              <DecorativeBorder />
              <CornerOrnament className="top-8 left-8 rotate-0" />
              <CornerOrnament className="top-8 right-8 rotate-90" />
              <CornerOrnament className="bottom-8 left-8 -rotate-90" />
              <CornerOrnament className="bottom-8 right-8 rotate-180" />

              <div className="relative z-10 flex flex-col space-y-8">
                {/* Header seal */}
                <div className="flex justify-center mb-4">
                  <motion.div initial={{
                scale: 0,
                rotate: -10
              }} animate={{
                scale: 1,
                rotate: 0
              }} transition={{
                delay: 0.3,
                duration: 0.5,
                type: 'spring',
                stiffness: 180
              }} className="w-14 h-14 bg-[#D4878F] rounded-full flex items-center justify-center shadow-md" style={{
                boxShadow: '0 4px 16px rgba(201,123,132,0.35)'
              }} whileHover={{
                scale: 1.06
              }}>
                    <Heart className="text-white fill-white w-6 h-6" />
                  </motion.div>
                </div>

                {/* Date */}
                <div className="text-right">
                  <span contentEditable suppressContentEditableWarning onBlur={e => updateContent('date', e.currentTarget.textContent || '')} className="text-[#8B7E74] italic text-sm outline-none hover:bg-[#E8A0A0]/8 px-2 py-1 rounded transition-colors" style={{
                fontFamily: '"Lora", serif'
              }}>
                    {content.date}
                  </span>
                </div>

                {/* Salutation */}
                <h1 contentEditable suppressContentEditableWarning onBlur={e => updateContent('salutation', e.currentTarget.textContent || '')} className="outline-none hover:bg-[#E8A0A0]/8 px-2 py-1 rounded transition-colors" style={{
              fontFamily: '"Dancing Script", cursive',
              fontSize: 'clamp(2rem, 5vw, 2.8rem)',
              color: '#3D2B2B',
              lineHeight: 1.2
            }}>
                  {content.salutation}
                </h1>

                {/* Body paragraphs */}
                <div className="space-y-6" style={{
              color: '#4A3F3F',
              fontFamily: '"Lora", serif',
              lineHeight: 1.85,
              fontSize: '1.05rem'
            }}>
                  <p contentEditable suppressContentEditableWarning onBlur={e => updateContent('body1', e.currentTarget.textContent || '')} className="outline-none hover:bg-[#E8A0A0]/8 px-2 py-1 rounded transition-colors min-h-[1em]">
                    {content.body1}
                  </p>
                  <p contentEditable suppressContentEditableWarning onBlur={e => updateContent('body2', e.currentTarget.textContent || '')} className="outline-none hover:bg-[#E8A0A0]/8 px-2 py-1 rounded transition-colors min-h-[1em]">
                    {content.body2}
                  </p>
                  <p contentEditable suppressContentEditableWarning onBlur={e => updateContent('body3', e.currentTarget.textContent || '')} className="outline-none hover:bg-[#E8A0A0]/8 px-2 py-1 rounded transition-colors min-h-[1em]">
                    {content.body3}
                  </p>
                </div>

                {/* Divider */}
                <div className="flex justify-center items-center py-2 space-x-4" style={{
              opacity: 0.3
            }}>
                  <div className="h-[1px] w-12 bg-[#E8A0A0]" />
                  <Heart className="w-3 h-3 text-[#E8A0A0]" />
                  <div className="h-[1px] w-12 bg-[#E8A0A0]" />
                </div>

                {/* Closing & signature */}
                <div className="space-y-4">
                  <p contentEditable suppressContentEditableWarning onBlur={e => updateContent('closing', e.currentTarget.textContent || '')} className="outline-none hover:bg-[#E8A0A0]/8 px-2 py-1 rounded transition-colors inline-block" style={{
                fontFamily: '"Dancing Script", cursive',
                fontSize: '1.25rem',
                color: '#3D2B2B'
              }}>
                    {content.closing}
                  </p>
                  <div className="pt-2">
                    <span contentEditable suppressContentEditableWarning onBlur={e => updateContent('signature', e.currentTarget.textContent || '')} className="outline-none hover:bg-[#E8A0A0]/8 px-2 py-1 rounded transition-colors border-b border-[#E8A0A0]/30 min-w-[150px] inline-block" style={{
                  fontFamily: '"Dancing Script", cursive',
                  fontSize: '1.6rem',
                  color: '#C97B84'
                }}>
                      {content.signature}
                    </span>
                  </div>
                </div>

                {/* P.S. */}
                <div className="mt-4 pt-6 border-t border-[#E8A0A0]/15">
                  <p className="text-sm italic" style={{
                fontFamily: '"Lora", serif',
                color: '#8B7E74'
              }}>
                    <span>{'P.S. '}</span>
                    <span contentEditable suppressContentEditableWarning onBlur={e => updateContent('ps', e.currentTarget.textContent || '')} className="ml-1 outline-none hover:bg-[#E8A0A0]/8 px-1 py-0.5 rounded transition-colors">
                      {content.ps}
                    </span>
                  </p>
                </div>

                {/* Footer hearts */}
                <div className="flex justify-center space-x-2 pt-4">
                  {[1, 2, 3, 4, 5].map(i => <Heart key={i} className="w-2 h-2 text-[#E8A0A0]/40 fill-current" />)}
                </div>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* ── Floating music pill ── */}
      <AnimatePresence>
        {phase === 'letter' && <motion.div key="music-pill" initial={{
        opacity: 0,
        y: 20,
        scale: 0.9
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.85
      }} transition={{
        delay: 1.1,
        duration: 0.5
      }} className="no-print fixed bottom-6 right-6 z-50">
            <button onClick={toggleMusic} className="flex items-center gap-3 px-4 py-2.5 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95" style={{
          background: 'rgba(255,253,249,0.95)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(232,160,160,0.4)',
          boxShadow: '0 8px 32px rgba(201,123,132,0.2)'
        }}>
              <span className={cn(musicPlaying && 'notes-pulse')} style={{
            display: 'flex',
            alignItems: 'center',
            color: '#C97B84'
          }}>
                <Music className="w-4 h-4" />
              </span>
              <span className="text-xs" style={{
            fontFamily: '"Lora", serif',
            color: '#5C4D4D',
            maxWidth: 140,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
                <span>Now Playing: </span>
                <span className="italic">Be With You</span>
              </span>
              <span style={{
            color: '#C97B84',
            display: 'flex',
            alignItems: 'center'
          }}>
                {musicPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </span>
            </button>
          </motion.div>}
      </AnimatePresence>

      {/* ── Background decorative icons ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{
      zIndex: -1
    }} aria-hidden="true">
        <div className="absolute top-[10%] left-[5%] text-[#E8A0A0]/8 transform -rotate-12">
          <Mail size={120} strokeWidth={0.5} />
        </div>
        <div className="absolute bottom-[10%] right-[5%] text-[#E8A0A0]/8 transform rotate-12">
          <Heart size={160} strokeWidth={0.5} />
        </div>
      </div>
    </div>;
};