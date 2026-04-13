import React, { useEffect, useState } from 'react';
import { NavLink } from '../types';
import { Check, Star, Heart, Sparkles, Gem, ArrowRight, MousePointerClick, ArrowUpRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { premiumPackages, standaloneServices } from '../data/packages';

interface ServicesProps {
    scrollToSection: (sectionId: string) => void;
}

const Services: React.FC<ServicesProps> = ({ scrollToSection }) => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const navigate = useNavigate();
    const sectionRef = React.useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-visible');
            });
        }, { threshold: 0.05 });
        if (sectionRef.current) {
            sectionRef.current.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
        }
        return () => observer.disconnect();
    }, []);

    return (
        <section id={NavLink.SERVICES} ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-surface-950 min-h-screen noise-overlay">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute inset-0 grid-bg opacity-20" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto reveal-on-scroll">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-brand-500/20 bg-brand-500/5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">Luxury Packages</span>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-serif font-bold mb-6 text-white leading-tight">
                        Crafting Visual{' '}
                        <span className="text-gradient-gold">Stories</span>
                    </h2>
                    <p className="text-zinc-400 font-light text-lg md:text-xl leading-relaxed">
                        From intimate portraits to grand celebrations — choose the perfect coverage for your moment.
                    </p>
                </div>

                {/* ============================================ */}
                {/* PREMIUM PRICING CARDS */}
                {/* ============================================ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-28 items-start">
                    {premiumPackages.map((pkg) => {
                        const isGold = pkg.id === 'tier-gold';
                        return (
                            <div
                                key={pkg.id}
                                onMouseEnter={() => setHoveredCard(pkg.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className={`reveal-on-scroll relative group rounded-2xl transition-all duration-500 flex flex-col h-full ${isGold
                                    ? 'bg-gradient-to-b from-surface-800 to-surface-950 border-2 border-brand-500/30 shadow-2xl shadow-brand-900/20 md:scale-105 md:-translate-y-4 z-20 glow-gold mt-6 md:mt-0'
                                    : 'glass-card z-10'
                                }`}
                            >
                                {isGold && <div className="absolute inset-0 bg-brand-500/3 rounded-2xl blur-2xl -z-10" />}
                                {isGold && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-brand-600 to-brand-400 text-black text-[10px] font-black uppercase tracking-widest px-5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                                            <Star className="w-3 h-3 fill-black" /> Most Chosen
                                        </span>
                                    </div>
                                )}

                                <div className="p-8 md:p-10 flex flex-col h-full">
                                    <div className="mb-8">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 ${
                                            isGold ? 'bg-brand-500 text-black' : 'bg-white/5 text-zinc-400 border border-white/5 group-hover:bg-brand-500/10 group-hover:text-brand-400 group-hover:border-brand-500/20'
                                        }`}>
                                            {pkg.icon}
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold text-white mb-1">{pkg.name}</h3>
                                        <p className={`text-xs font-medium uppercase tracking-[0.2em] mb-3 ${isGold ? 'text-brand-400' : 'text-zinc-500'}`}>
                                            {pkg.subtitle}
                                        </p>
                                        <p className="text-zinc-400 text-sm leading-relaxed">{pkg.description}</p>
                                    </div>

                                    <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-1">Pricing</p>
                                        <p className="text-lg font-bold text-gradient-gold">{pkg.price}</p>
                                    </div>

                                    <div className="space-y-3 mb-8 flex-grow">
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] border-b border-white/5 pb-2">What's Included</p>
                                        <ul className="space-y-2">
                                            {pkg.features.map((f, idx) => (
                                                <li key={idx} className="flex items-start text-[13px] text-zinc-300 group/item">
                                                    <Check className={`w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 ${isGold ? 'text-brand-500' : 'text-zinc-600 group-hover:text-brand-500'} transition-colors`} />
                                                    <span className="group-hover/item:text-white transition-colors">{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-auto pt-5 border-t border-white/5">
                                        <p className="text-xs text-zinc-500 mb-4 flex items-center gap-1.5">
                                            <Heart className="w-3 h-3" /> Ideal for: <span className="text-zinc-300">{pkg.idealFor}</span>
                                        </p>
                                        <div className="flex flex-col gap-2.5">
                                            <button
                                                onClick={() => {
                                                    const msg = `Hi Skycam! I'm interested in the *${pkg.name} - ${pkg.subtitle}* package. Could you provide a quote?`;
                                                    window.open(`https://wa.me/918667518859?text=${encodeURIComponent(msg)}`, '_blank');
                                                }}
                                                className={`w-full py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group/btn ${isGold
                                                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                                                    : 'bg-white text-black hover:bg-zinc-100'
                                                }`}
                                            >
                                                Book Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/service/${pkg.id}`)}
                                                className="w-full py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
                                            >
                                                View Full Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ============================================ */}
                {/* STANDALONE SERVICES */}
                {/* ============================================ */}
                <div className="reveal-on-scroll">
                    <div className="text-center mb-14">
                        <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">
                            More <span className="text-gradient-gold">Services</span>
                        </h3>
                        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
                            Specialized offerings you can book individually or add to any package.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {standaloneServices.map((service, i) => (
                            <div key={service.id} className={`reveal-on-scroll group glass-card rounded-2xl p-7 flex flex-col hover:border-brand-500/20`}>
                                <div className="flex items-start justify-between mb-5">
                                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-brand-400 group-hover:border-brand-500/20 group-hover:bg-brand-500/10 transition-all duration-300">
                                        {service.icon}
                                    </div>
                                    {service.startingPrice && (
                                        <span className="text-xs font-bold text-gradient-gold">from {service.startingPrice}</span>
                                    )}
                                </div>

                                <h4 className="text-base font-serif font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                                    {service.title}
                                </h4>
                                <p className="text-zinc-500 text-sm leading-relaxed mb-5 flex-grow">
                                    {service.description}
                                </p>

                                <ul className="space-y-1.5 mb-5">
                                    {service.features.slice(0, 4).map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-xs text-zinc-400">
                                            <Check className="w-3 h-3 text-zinc-600 group-hover:text-brand-500 transition-colors" />
                                            {f}
                                        </li>
                                    ))}
                                    {service.features.length > 4 && (
                                        <li className="text-xs text-zinc-600">+ {service.features.length - 4} more</li>
                                    )}
                                </ul>

                                {service.id === 'drone-videography' ? (
                                    <Link
                                        to="/drone-videography"
                                        className="mt-auto w-full py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-xl border border-brand-500/20 bg-brand-500/5 text-brand-400 hover:bg-brand-500/10 transition-all flex items-center justify-center gap-1.5"
                                    >
                                        View Drone Page <ArrowUpRight size={12} />
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => {
                                            const msg = `Hi! I'm interested in your ${service.title} service. Can I get more details?`;
                                            window.open(`https://wa.me/918667518859?text=${encodeURIComponent(msg)}`, '_blank');
                                        }}
                                        className="mt-auto w-full py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-1.5"
                                    >
                                        Enquire Now <ArrowUpRight size={12} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Signals */}
                <div className="mt-20 glass-card rounded-2xl p-8 reveal-on-scroll">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { label: 'Professional Drone Pilot', value: 'DGCA Certified' },
                            { label: 'Cinematic Equipment', value: '4K / 8K' },
                            { label: 'Delivery Guarantee', value: 'On-Time' },
                            { label: 'Happy Clients', value: '500+' }
                        ].map((stat, i) => (
                            <div key={i} className="group">
                                <p className="text-xl font-serif font-bold text-gradient-gold mb-1">{stat.value}</p>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] group-hover:text-zinc-300 transition-colors">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;