import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from '../types';
import { Check, Star, Camera, Video, Aperture, Heart, Sparkles, Gem, ArrowRight, MousePointerClick } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { premiumPackages } from '../data/packages';

interface ServicesProps {
    scrollToSection: (sectionId: string) => void;
}

const Services: React.FC<ServicesProps> = ({ scrollToSection }) => {
    const watermarkRef = useRef<HTMLDivElement>(null);
    const bgImageRef = useRef<HTMLImageElement>(null);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Reveal observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(el => observer.observe(el));

        // Parallax logic
        const handleScroll = () => {
            const scrolled = window.scrollY;
            if (watermarkRef.current) {
                watermarkRef.current.style.transform = `translateX(${scrolled * -0.1}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleExpand = (key: string) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const enhancements = [
        { name: 'Product Photography', icon: <Aperture /> },
        { name: 'Modeling / Portfolio', icon: <Camera /> },
        { name: 'Extended Drone Coverage', icon: <Video /> },
        { name: 'Custom Branding Frames', icon: <Sparkles /> },
        { name: 'Multi-day Coverage', icon: <Check /> },
        { name: 'Custom Packages', icon: <Heart /> }
    ];

    return (
        <section id={NavLink.SERVICES} className="py-24 md:py-32 relative overflow-hidden bg-zinc-950 text-white min-h-screen">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
            </div>

            {/* Parallax Watermark */}
            <div
                ref={watermarkRef}
                className="absolute top-20 left-0 whitespace-nowrap opacity-[0.03] pointer-events-none select-none z-0"
            >
                <span className="text-[150px] md:text-[300px] font-serif font-bold text-white leading-none">PACKAGES</span>
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto reveal-on-scroll">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-brand-400" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">Luxury Packages</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-serif font-medium mb-8 leading-tight">
                        Crafting Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-200">Stories</span>
                    </h2>
                    <p className="text-zinc-400 font-light text-lg md:text-xl leading-relaxed">
                        We don't just capture moments; we create cinematic experiences. Choose the perfect tier for your event.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-start">
                    {premiumPackages.map((pkg) => {
                        const isGold = pkg.id === 'tier-gold';
                        const isHovered = hoveredCard === pkg.id;

                        return (
                            <div
                                key={pkg.id}
                                onMouseEnter={() => setHoveredCard(pkg.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className={`reveal-on-scroll relative group rounded-3xl transition-all duration-500 flex flex-col h-full ${isGold
                                    ? 'bg-gradient-to-b from-zinc-900 via-zinc-900 to-black border-2 border-brand-500/50 shadow-2xl shadow-brand-900/20 scale-105 md:-translate-y-4 z-20'
                                    : 'bg-white/5 backdrop-blur-md border border-white/10 hover:border-brand-500/30 hover:bg-white/10 z-10'
                                    }`}
                            >
                                {/* Gold Glow Effect */}
                                {isGold && <div className="absolute inset-0 bg-brand-500/5 rounded-3xl blur-xl -z-10"></div>}

                                {isGold && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-brand-600 to-brand-400 text-black text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                                            <Star className="w-3 h-3 fill-black" /> Most Chosen
                                        </span>
                                    </div>
                                )}

                                <div className="p-8 md:p-10 flex flex-col h-full">
                                    <div className="mb-8">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${isGold ? 'bg-brand-500 text-black' : 'bg-white/10 text-white group-hover:bg-brand-500 group-hover:text-black'
                                            }`}>
                                            {pkg.icon}
                                        </div>
                                        <h3 className="text-3xl font-serif font-bold text-white mb-2">{pkg.name}</h3>
                                        <p className={`text-sm font-medium uppercase tracking-widest mb-4 ${isGold ? 'text-brand-400' : 'text-zinc-500'}`}>
                                            {pkg.subtitle}
                                        </p>
                                        <p className="text-zinc-400 text-sm leading-relaxed min-h-[60px]">
                                            {pkg.description}
                                        </p>
                                    </div>

                                    <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Starting From</p>
                                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                                            {pkg.price}
                                        </p>
                                    </div>

                                    <div className="space-y-4 mb-8 flex-grow">
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">Included Services</p>
                                        <ul className="space-y-3">
                                            {pkg.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start text-sm text-zinc-300 group/item">
                                                    <Check className={`w-5 h-5 mr-3 shrink-0 ${isGold ? 'text-brand-500' : 'text-zinc-600 group-hover:text-brand-500'} transition-colors`} />
                                                    <span className="group-hover/item:text-white transition-colors">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/10">
                                        <p className="text-xs text-zinc-500 mb-4 flex items-center gap-2">
                                            <Heart className="w-3 h-3" /> Ideal for: <span className="text-zinc-300">{pkg.idealFor}</span>
                                        </p>
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={() => {
                                                    const msg = `Hi Skycam! I'm interested in the *${pkg.name} - ${pkg.subtitle}* package. Could you provide a quote?`;
                                                    window.open(`https://wa.me/918667518859?text=${encodeURIComponent(msg)}`, '_blank');
                                                }}
                                                className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group/btn ${isGold
                                                    ? 'bg-brand-500 text-black hover:bg-brand-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                                                    : 'bg-white text-black hover:bg-zinc-200'
                                                    }`}
                                            >
                                                Book Now
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>

                                            <button
                                                onClick={() => navigate(`/service/${pkg.id}`)}
                                                className="w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Custom Enhancements Section */}
                <div className="max-w-5xl mx-auto reveal-on-scroll">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl md:text-4xl font-serif font-medium text-white mb-4">Custom Enhancements</h3>
                                <p className="text-zinc-400">Every story is unique. Add these extras to any package.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {enhancements.map((item, idx) => (
                                    <div key={idx} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand-500/30 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-zinc-400 group-hover:text-brand-400 group-hover:scale-110 transition-all">
                                            {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-5 h-5" })}
                                        </div>
                                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white">{item.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => window.open(`https://wa.me/918667518859?text=${encodeURIComponent("Hi! I'd like to request a custom quote.")}`, '_blank')}
                                    className="inline-flex items-center gap-2 text-brand-400 text-sm font-bold uppercase tracking-widest hover:text-brand-300 transition-colors"
                                >
                                    <MousePointerClick className="w-4 h-4" /> Request Custom Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Signals Footer */}
                <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-black/20 rounded-2xl p-6 backdrop-blur-sm">
                    {[
                        { label: 'Professional Drone Pilot', value: 'Certified' },
                        { label: 'Cinematic Equipment', value: '4K/8K Ready' },
                        { label: 'Delivery Guarantee', value: 'On-Time' },
                        { label: 'Happy Clients', value: '500+' }
                    ].map((stat, i) => (
                        <div key={i}>
                            <p className="text-2xl font-serif text-brand-500 mb-1">{stat.value}</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Services;