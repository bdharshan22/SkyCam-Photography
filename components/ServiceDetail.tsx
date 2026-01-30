import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { premiumPackages } from '../data/packages';
import { ArrowLeft, Check, Star, Camera, Video, Heart, Calendar, MessageCircle, Share2, ArrowRight } from 'lucide-react';

const ServiceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const pkg = premiumPackages.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!pkg) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <h2 className="text-3xl font-serif mb-4">Package Not Found</h2>
                <button onClick={() => navigate('/')} className="text-brand-500 hover:text-brand-400 flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Home
                </button>
            </div>
        );
    }

    const isGold = pkg.id === 'tier-gold';

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-brand-500 selection:text-white pt-20">
            {/* Hero Section */}
            <div className="relative py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className={`absolute -top-20 -right-20 w-96 h-96 rounded-full blur-[100px] ${isGold ? 'bg-amber-500' : 'bg-brand-500'}`}></div>
                    <div className="absolute top-40 left-0 w-72 h-72 bg-blue-500 rounded-full blur-[100px] opacity-50"></div>
                </div>

                <div className="container mx-auto relative z-10 max-w-5xl">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>

                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="flex-1">
                            {pkg.isPopular && (
                                <span className="inline-block px-4 py-1 rounded-full bg-brand-500 text-black text-xs font-bold uppercase tracking-widest mb-6">
                                    Most Popular Choice
                                </span>
                            )}
                            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">{pkg.name}</h1>
                            <p className="text-2xl text-brand-400 font-light mb-6">{pkg.subtitle}</p>
                            <p className="text-zinc-300 text-lg leading-relaxed max-w-2xl">
                                {pkg.detailedDescription || pkg.description}
                            </p>
                        </div>
                        <div className="w-full md:w-auto bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 min-w-[300px]">
                            <p className="text-sm text-zinc-500 uppercase tracking-widest mb-2">Starting Price</p>
                            <p className="text-3xl font-bold text-white mb-6">{pkg.price}</p>
                            <button
                                onClick={() => {
                                    const msg = `Hi Skycam! I'm interested in the *${pkg.name}* package details.`;
                                    window.open(`https://wa.me/918667518859?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                                className={`w-full py-4 text-sm font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${isGold ? 'bg-brand-500 text-black hover:bg-brand-400' : 'bg-white text-black hover:bg-zinc-200'
                                    }`}
                            >
                                Book Now <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Details */}
            <div className="container mx-auto px-6 py-12 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Features List */}
                    <div>
                        <h3 className="text-2xl font-serif mb-8 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-brand-500">
                                <Check size={16} />
                            </span>
                            What's Included
                        </h3>
                        <ul className="space-y-4">
                            {pkg.features.map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-brand-500/30 transition-colors">
                                    <Check className="text-brand-500 shrink-0 mt-1" size={20} />
                                    <span className="text-zinc-300">{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Ideal For & Additional Info */}
                    <div className="space-y-8">
                        <div className="bg-zinc-900 rounded-3xl p-8 border border-white/5">
                            <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                                <Heart className="text-red-500" size={20} /> Ideal For
                            </h3>
                            <p className="text-zinc-400 leading-relaxed mb-6">
                                {pkg.idealFor}
                            </p>
                            <div className="h-px bg-white/10 w-full mb-6"></div>
                            <div className="flex gap-4">
                                <div className="text-center flex-1 p-4 rounded-xl bg-black/40">
                                    <Camera className="mx-auto mb-2 text-zinc-500" size={24} />
                                    <span className="text-xs uppercase text-zinc-500 font-bold">Photos</span>
                                </div>
                                <div className="text-center flex-1 p-4 rounded-xl bg-black/40">
                                    <Video className="mx-auto mb-2 text-zinc-500" size={24} />
                                    <span className="text-xs uppercase text-zinc-500 font-bold">Videos</span>
                                </div>
                                <div className="text-center flex-1 p-4 rounded-xl bg-black/40">
                                    <Calendar className="mx-auto mb-2 text-zinc-500" size={24} />
                                    <span className="text-xs uppercase text-zinc-500 font-bold">Events</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Box */}
                        <div className="bg-gradient-to-br from-brand-900/20 to-black rounded-3xl p-8 border border-brand-500/20">
                            <h3 className="text-xl font-serif mb-2">Need Customization?</h3>
                            <p className="text-zinc-400 text-sm mb-6">We can tailor this package to your specific needs.</p>
                            <button
                                onClick={() => {
                                    const msg = `Hi Skycam! I'd like to customize the *${pkg.name}* package.`;
                                    window.open(`https://wa.me/918667518859?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                                className="text-brand-400 font-bold uppercase text-xs tracking-widest hover:text-brand-300 flex items-center gap-2"
                            >
                                <MessageCircle size={16} /> Chat with us
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
