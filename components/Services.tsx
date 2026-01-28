import React, { useEffect, useRef, useState } from 'react';
import { NavLink, ServicePackage } from '../types';
import { Check, Star, Heart, Camera, Baby, Cake, Ear, Gem, Flower } from 'lucide-react';

interface ServicesProps {
    scrollToSection: (sectionId: string) => void;
}

const Services: React.FC<ServicesProps> = ({ scrollToSection }) => {
    const [activeCategory, setActiveCategory] = useState('baby-shower');
    const watermarkRef = useRef<HTMLDivElement>(null);
    const bgImageRef = useRef<HTMLImageElement>(null);

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
            if (bgImageRef.current) {
                const offset = scrolled * 0.02;
                bgImageRef.current.style.transform = `translate3d(0, ${offset}px, 0) scale(1.1)`;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const categories = [
        { id: 'baby-shower', label: 'Baby Shower', icon: <Baby className="w-4 h-4" /> },
        { id: 'puberty', label: 'Puberty', icon: <Flower className="w-4 h-4" /> },
        { id: 'engagement', label: 'Engagement', icon: <Gem className="w-4 h-4" /> },
        { id: 'ear-piercing', label: 'Ear Piercing', icon: <Ear className="w-4 h-4" /> },
        { id: 'birthday', label: 'Birthday', icon: <Cake className="w-4 h-4" /> },
        { id: 'wedding', label: 'Wedding', icon: <Heart className="w-4 h-4" /> },
        { id: 'portrait', label: 'Portraits', icon: <Camera className="w-4 h-4" /> },
    ];

    const packagesData: Record<string, ServicePackage[]> = {
        'baby-shower': [
            {
                id: 'elite',
                name: 'ELITE',
                price: '₹50,000',
                description: 'The ultimate luxury experience.',
                features: [
                    'Traditional Photo',
                    'Traditional Video',
                    'Candid Photo',
                    'Candid Video & Drone',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Albums x 35 Sheets (12X30)',
                    'Traditional Video Edited - FULL HD',
                    'Baby Shower Film (3-5 Minutes)',
                    '1 Photo Frame (16X20)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'platinum',
                name: 'PLATINUM',
                price: '₹40,000',
                description: 'Comprehensive coverage for your special moments.',
                features: [
                    'Traditional Photo',
                    'Candid Photo & Video',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    'Premium Album 12x30 (30 Sheets)',
                    'Baby Shower Film (3-5 Mins)',
                    '1 Photo Frame (12x18)',
                    'Save the Date (Photo)'
                ]
            },

            {
                id: 'gold',
                name: 'GOLD',
                price: '₹25,000',
                description: 'Classic coverage focused on beautiful photography.',
                features: [
                    'Traditional Photo',
                    'Candid Photo',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    'Premium Album 12x30 (30 Sheets)',
                    '1 Photo Frame (12x15)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'silver',
                name: 'SILVER',
                price: '₹15,000',
                description: 'Essential photography package for intimate events.',
                features: [
                    'Traditional Photo',
                    'Unlimited HD Photos',
                    'HEADER:Deliverables',
                    'Premium Album 10x24 (25 Sheets)',
                    '1 Photo Frame (8x12)',
                    'Save the Date (Photo)'
                ]
            },

            {
                id: 'basic-video',
                name: 'Basic Video',
                price: '₹8,000',
                description: 'Pure videography coverage for any event.',
                features: [
                    'Traditional Video Coverage',
                    'Full HD Edited Output',
                    'Engagement / Baby Shower / Puberty'
                ]
            }
        ],
        'puberty': [
            {
                id: 'puberty-elite',
                name: 'ELITE',
                price: '₹50,000',
                description: 'Luxury coming-of-age celebration coverage.',
                features: [
                    'Traditional Photo',
                    'Traditional Video',
                    'Candid Photo',
                    'Candid Video & Drone',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 35 Sheets (12x30)',
                    'Traditional Video Edited - FULL HD',
                    'Puberty Film (3-5 Minutes)',
                    '1 Photo Frame (16X20)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'puberty-platinum',
                name: 'PLATINUM',
                price: '₹40,000',
                description: 'Premium cinematic coverage.',
                features: [
                    'Traditional Photo',
                    'Candid Photo',
                    'Candid Video',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 35 Sheets (12x30)',
                    'Puberty Film (3-5 Minutes)',
                    '1 Photo Frame (12x18)',
                    'Save the Date (Photo)'
                ]
            },

            {
                id: 'puberty-gold-plus',
                name: 'GOLD +',
                price: '₹30,000',
                description: 'Modern storytelling package.',
                features: [
                    'Traditional Photo',
                    'Candid Video',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 30 Sheets (12x30)',
                    'Puberty Film (3-5 Minutes)',
                    '1 Photo Frame (12x18)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'puberty-silver',
                name: 'SILVER',
                price: '₹15,000',
                description: 'Essential celebration memories.',
                features: [
                    'Traditional Photo',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 25 Sheets (10x24)',
                    '1 Photo Frame (8x12)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'puberty-bronze',
                name: 'BRONZE',
                price: '₹10,000',
                description: 'Standard photography package.',
                features: [
                    'Traditional Photo',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album Book x 10 Sheets (10x24)',
                    'Save the Date (Photo)'
                ]
            }
        ],
        'engagement': [
            {
                id: 'eng-elite',
                name: 'ELITE',
                price: '₹50,000',
                description: 'Complete luxury engagement coverage.',
                features: [
                    'Traditional Photo',
                    'Traditional Video',
                    'Candid Photo',
                    'Candid Video & Drone',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 30 Sheets (12x30)',
                    'Traditional Video Edited - FULL HD',
                    'Engagement Film (3-5 Minutes)',
                    'Photo Frames (1-16x20, 1-12x15)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'eng-platinum',
                name: 'PLATINUM',
                price: '₹40,000',
                description: 'Premium engagement storytelling.',
                features: [
                    'Traditional Photo',
                    'Candid Photo',
                    'Candid Video',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 35 Sheets (12x30)',
                    'Engagement Film (3-5 Minutes)',
                    '1 Photo Frame (12x18)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'eng-gold-plus',
                name: 'GOLD +',
                price: '₹30,000',
                description: 'Enhanced traditional and candid mix.',
                features: [
                    'Traditional Photo',
                    'Candid Video',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 30 Sheets (12x30)',
                    'Engagement Film (3-5 Minutes)',
                    '1 Photo Frame (12x18)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'eng-gold',
                name: 'GOLD',
                price: '₹25,000',
                description: 'Classic professional coverage.',
                features: [
                    'Traditional Photo',
                    'Candid Photo',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 30 Sheets (12x30)',
                    '1 Photo Frame (12x15)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'eng-silver',
                name: 'SILVER',
                price: '₹15,000',
                description: 'Essential engagement memories.',
                features: [
                    'Traditional Photo',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 25 Sheets (10x24)',
                    '1 Photo Frame (8x12)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'eng-bronze',
                name: 'BRONZE',
                price: '₹10,000',
                description: 'Standard engagement session.',
                features: [
                    'Traditional Photo',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album Book x 10 Sheets (10x24)',
                    'Save the Date (Photo)'
                ]
            }
        ],
        'ear-piercing': [
            {
                id: 'ep-platinum',
                name: 'PLATINUM',
                price: '₹40,000',
                description: 'Premium coverage for the special ceremony.',
                features: [
                    'Traditional Photo',
                    'Traditional Video',
                    'Candid Video',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 25 Sheets (12x30)',
                    'Ear Piercing Video Fully Edited',
                    'Ear Piercing Film (3-5 Minutes)',
                    '1 Photo Frame (1-16x20, 1-12x15 )',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'ep-gold-plus',
                name: 'GOLD +',
                price: '₹30,000',
                description: 'Modern storytelling focus.',
                features: [
                    'Traditional Photo',
                    'Candid Video',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 25 Sheets (10x24)',
                    'Ear Piercing Film (3 Minutes)',
                    '1 Photo Frame (1-12x18, 1-8x12 )',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'ep-gold',
                name: 'GOLD',
                price: '₹23,000',
                description: 'Traditional comprehensive coverage.',
                features: [
                    'Traditional Photo',
                    'Traditional Video',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 25 Sheets (10x24)',
                    'Ear Piercing Video Fully Edited',
                    '1 Photo Frame (12x18)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'ep-silver',
                name: 'SILVER',
                price: '₹15,000',
                description: 'Essential photography coverage.',
                features: [
                    'Traditional Photo',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 25 Sheets (10x24)',
                    '1 Photo Frame (8x12)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'ep-bronze',
                name: 'BRONZE',
                price: '₹10,000',
                description: 'Standard package.',
                features: [
                    'Traditional Photo',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album Book x 10 Sheets (10x24)',
                    'Save the Date (Photo)'
                ]
            }
        ],
        'birthday': [
            {
                id: 'birthday-gold',
                name: 'GOLD',
                price: '₹25,000',
                description: 'Premium coverage for your celebration.',
                features: [
                    'Traditional Photo',
                    'Candid Video',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 25 Sheets (10x24)',
                    'Birthday Film (3 Minutes)',
                    '1 Photo Frame (12X18)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'birthday-silver',
                name: 'SILVER',
                price: '₹15,000',
                description: 'Essential celebration package.',
                features: [
                    'Traditional Photo',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos',
                    '1 Premium Album x 25 Sheets (10x24)',
                    '1 Photo Frame (8x12)',
                    'Save the Date (Photo)'
                ]
            },

        ],
        'wedding': [
            {
                id: 'wedding-elite',
                name: 'ELITE',
                price: '₹2,00,000',
                description: 'The complete cinematic wedding experience.',
                features: [
                    'Traditional Photo x 2',
                    'Traditional Video x 2',
                    'Candid Photo',
                    'Candid Video x Drone',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos with AI Sharing',
                    '2 Premium Albums x 40 Sheets (12x30)',
                    '1 Ritual Album x 20 Sheets (10x24)',
                    '1 Outdoor Album x 20 Sheets (12x30)',
                    'Traditional Video Edited - FULL HD',
                    'Wedding Film (5-8 Minutes)',
                    'Outdoor PhotoShoot & Videoshoot (Fullday Session)',
                    'LCD SCREEN (Reception)',
                    'Photo Frame 7 (16X20-2, 12x18-3, 12x15-2)',
                    'Save the Date (Photo&Video)'
                ]
            },
            {
                id: 'wedding-platinum',
                name: 'PLATINUM',
                price: '₹1,60,000',
                description: 'Comprehensive luxury wedding coverage.',
                features: [
                    'Traditional Photo',
                    'Traditional Video x 2',
                    'Candid Photo',
                    'Candid Video x Drone',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos with AI Sharing',
                    '2 Premium Albums x 40 Sheets (12x30)',
                    '1 Ritual Album x 20 Sheets (10x24)',
                    '1 Outdoor Album x 15 Sheets (10x24)',
                    'Traditional Video Edited - FULL HD',
                    'Wedding Film (5-8 Minutes)',
                    'Outdoor PhotoShoot & Videoshoot (Halfday Session)',
                    'Photo Frame 7 (16X20-2, 12x18-3, 8x12-2)',
                    'Save the Date (Photo&Video)'
                ]
            },
            {
                id: 'wedding-gold',
                name: 'GOLD',
                price: '₹1,35,000',
                description: 'Perfect balance of traditional and candid moments.',
                features: [
                    'Traditional Photo',
                    'Traditional Video',
                    'Candid Photo',
                    'Candid Video',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos with AI Sharing',
                    '2 Premium Albums x 35 Sheets (12x30)',
                    '1 Ritual Album x 20 Sheets (10x24)',
                    '1 Outdoor Album x 10 Sheets (10x24)',
                    'Traditional Video Edited - FULL HD',
                    'Wedding Film (5-8 Minutes)',
                    'Outdoor PhotoShoot (Halfday Session)',
                    'Photo Frame 5 (16X20-2, 12x18-3)',
                    'Save the Date (Photo&Video)'
                ]
            },
            {
                id: 'wedding-silver',
                name: 'SILVER',
                price: '₹1,00,000',
                description: 'Essential premium coverage.',
                features: [
                    'Traditional Photo',
                    'Traditional Video',
                    'Candid Photo',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos with AI Sharing',
                    '2 Premium Albums x 30 Sheets (12x30)',
                    '1 Ritual Album x 20 Sheets (10x24)',
                    '1 Outdoor Album x 10 Sheets (10x24)',
                    'Traditional Video Edited - FULL HD',
                    'Outdoor PhotoShoot (Halfday Session)',
                    'Photo Frame 3 (12x18-2, 12x15-1)',
                    'Save the Date (Photo)'
                ]
            },
            {
                id: 'wedding-bronze',
                name: 'BRONZE',
                price: '₹75,000',
                description: 'Standard professional wedding package.',
                features: [
                    'Traditional Photo',
                    'Traditional Video',
                    'HEADER:Deliverables',
                    'Unlimited HD Photos with AI Sharing',
                    '2 Premium Albums x 25 Sheets (12x30)',
                    '1 Outdoor Album x 10 Sheets (10x24)',
                    'Traditional Video Edited - FULL HD',
                    'Outdoor PhotoShoot (Halfday Session)',
                    'Photo Frame 3 (12x18-2, 12x15-1)',
                    'Save the Date (Photo)'
                ]
            }
        ],
        'portrait': [
            {
                id: 'portrait-premium',
                name: 'EDITORIAL',
                price: '₹25,000',
                description: 'Magazine quality portrait session.',
                features: ['4 Hour Session', 'Unlimited Outfits', 'HEADER:Deliverables', '20 High-End Retouches', 'Makeup Artist Included', 'Studio & Outdoor']
            },
            {
                id: 'portrait-standard',
                name: 'STUDIO',
                price: '₹10,000',
                description: 'Professional portrait session in studio.',
                features: ['1 Hour Session', '2 Outfit Changes', 'HEADER:Deliverables', '5 Retouched Photos', 'Digital Gallery']
            }
        ]
    };

    const currentPackages = packagesData[activeCategory] || [];
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (key: string) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <section id={NavLink.SERVICES} className="py-24 md:py-32 bg-zinc-50 relative overflow-hidden">

            {/* Camera Background Image Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <img
                    ref={bgImageRef}
                    src="https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=1200&auto=format&fit=crop"
                    alt="Vintage Camera Background"
                    loading="lazy"
                    className="w-full h-full object-cover opacity-[0.03] grayscale will-change-transform origin-center"
                />
            </div>

            {/* Background Architectural Lines for Premium Feel */}
            <div className="absolute inset-0 pointer-events-none flex justify-center z-0">
                <div className="w-px h-full bg-zinc-200/50 hidden md:block absolute left-[10%]"></div>
                <div className="w-px h-full bg-zinc-200/50 hidden md:block absolute left-[90%]"></div>
                <div className="w-px h-full bg-zinc-200/50 hidden md:block"></div>
            </div>

            {/* Parallax Watermark */}
            <div
                ref={watermarkRef}
                className="absolute top-40 left-0 whitespace-nowrap opacity-5 pointer-events-none select-none will-change-transform z-0"
            >
                <span className="text-[80px] md:text-[200px] font-serif font-bold text-brand-600 leading-none">PACKAGES</span>
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="text-center mb-12 max-w-2xl mx-auto reveal-on-scroll">
                    <h2 className="text-brand-600 tracking-widest text-sm uppercase font-semibold mb-3">Curated Collections</h2>
                    <h3 className="text-4xl md:text-5xl font-serif text-black mb-6">Craft Your Moment</h3>
                    <div className="h-[1px] w-[55px] bg-[#C62828] mx-auto mb-6"></div>
                    <p className="text-zinc-800 font-light text-lg">
                        Expertly curated experiences that capture the emotion, detail, and magic of your day.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex justify-center mb-16 reveal-on-scroll">
                    <div className="inline-flex flex-wrap justify-center bg-white p-2 rounded-2xl md:rounded-full border border-zinc-200 shadow-sm gap-2 w-full md:w-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center space-x-2 flex-grow md:flex-grow-0 justify-center ${activeCategory === cat.id
                                    ? 'bg-brand-600 text-white shadow-md'
                                    : 'text-zinc-500 hover:text-black hover:bg-zinc-50'
                                    }`}
                            >
                                {cat.icon}
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Controls: view toggle and summary */}
                <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-zinc-600">Showing {currentPackages.length} packages</div>
                    <div className="inline-flex rounded-lg bg-white p-1 border">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1 text-xs font-semibold rounded ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-zinc-600'}`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 text-xs font-semibold rounded ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-zinc-600'}`}
                        >
                            List
                        </button>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {currentPackages.map((pkg, pkgIndex) => {
                            const idLower = pkg.id.toLowerCase();
                            const nameUpper = pkg.name.toUpperCase();
                            const isHighlight = idLower.includes('elite') || idLower.includes('platinum') || idLower.includes('premium') || idLower.includes('gold') || nameUpper.includes('ELITE') || nameUpper.includes('PLATINUM') || nameUpper.includes('PREMIUM') || nameUpper.includes('GOLD');
                            const key = `${pkg.id}-${pkgIndex}`;

                            return (
                                <div
                                    key={key}
                                    className={`relative group animate-fade-in-up flex flex-col h-full bg-white border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isHighlight
                                        ? 'border-brand-600/30 shadow-[0_10px_30px_rgba(220,38,38,0.08)] z-10'
                                        : 'border-zinc-200 shadow-sm hover:border-brand-600/20'
                                        }`}
                                >
                                    {(idLower.includes('elite') || nameUpper.includes('ELITE')) && (
                                        <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-20">Best Value</div>
                                    )}

                                    <div className="p-6 flex-grow">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-2xl font-serif font-bold mb-1 text-zinc-900 tracking-wide">{pkg.name}</h4>
                                                <p className="text-sm text-zinc-500">{pkg.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-light text-brand-600">{pkg.price}</div>
                                                <div className="text-xs text-zinc-400">Starting</div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <ul className="space-y-3">
                                                {pkg.features.slice(0, 3).map((feature, i) => (
                                                    feature.startsWith('HEADER:') ? (
                                                        <li key={`${key}-header-${i}`} className="text-brand-600 font-serif text-sm font-bold uppercase tracking-widest mt-2 mb-1">{feature.replace('HEADER:', '')}</li>
                                                    ) : (
                                                        <li key={`${key}-feature-${i}`} className="flex items-start text-zinc-600">
                                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0 ${isHighlight ? 'bg-brand-50 text-brand-600' : 'bg-zinc-100 text-zinc-400'}`}><Check className="w-3 h-3" /></span>
                                                            <span className="font-light text-sm tracking-wide">{feature}</span>
                                                        </li>
                                                    )
                                                ))}
                                            </ul>
                                            {pkg.features.length > 3 && (
                                                <div className="mt-4">
                                                    <button onClick={() => toggleExpand(key)} className="text-sm text-brand-600 font-semibold">
                                                        {expanded[key] ? 'Show Less' : `+ ${pkg.features.length - 3} more`}
                                                    </button>
                                                    {expanded[key] && (
                                                        <ul className="mt-3 space-y-2">
                                                            {pkg.features.slice(3).map((feature, i) => (
                                                                <li key={`${key}-more-${i}`} className="flex items-start text-zinc-600">
                                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0 ${isHighlight ? 'bg-brand-50 text-brand-600' : 'bg-zinc-100 text-zinc-400'}`}><Check className="w-3 h-3" /></span>
                                                                    <span className="font-light text-sm tracking-wide">{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 pt-0 mt-auto">
                                        <button onClick={() => {
                                            const categoryLabel = categories.find(c => c.id === activeCategory)?.label || activeCategory;
                                            const msg = `Hello Skycam. I would like information on the ${pkg.name} package for ${categoryLabel}, including availability and pricing.`;
                                            const url = `https://wa.me/918667518859?text=${encodeURIComponent(msg)}`;
                                            window.open(url, '_blank');
                                        }} className="w-full py-3 text-xs uppercase tracking-widest font-semibold transition-all border bg-brand-600 text-white border-brand-600 hover:bg-brand-700">Contact Us</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {currentPackages.map((pkg, pkgIndex) => {
                            const idLower = pkg.id.toLowerCase();
                            const nameUpper = pkg.name.toUpperCase();
                            const isHighlight = idLower.includes('elite') || idLower.includes('platinum') || idLower.includes('premium') || idLower.includes('gold') || nameUpper.includes('ELITE') || nameUpper.includes('PLATINUM') || nameUpper.includes('PREMIUM') || nameUpper.includes('GOLD');
                            const key = `${pkg.id}-${pkgIndex}`;

                            return (
                                <div key={key} className={`flex flex-col md:flex-row items-start bg-white border ${isHighlight ? 'border-brand-600/30 shadow-[0_8px_20px_rgba(220,38,38,0.06)]' : 'border-zinc-200 shadow-sm'} transition-all`}>
                                    <div className="p-6 md:w-1/3">
                                        <h4 className="text-2xl font-serif font-bold mb-1 text-zinc-900 tracking-wide">{pkg.name}</h4>
                                        <p className="text-sm text-zinc-500 mb-3">{pkg.description}</p>
                                        <div className="text-2xl font-light text-brand-600">{pkg.price}</div>
                                    </div>
                                    <div className="p-6 border-t md:border-t-0 md:border-l md:w-2/3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-zinc-600">{pkg.features.length} deliverables</div>
                                            <button onClick={() => toggleExpand(key)} className="text-sm text-brand-600 font-semibold">{expanded[key] ? 'Collapse' : 'View details'}</button>
                                        </div>
                                        {expanded[key] && (
                                            <ul className="mt-4 space-y-2">
                                                {pkg.features.map((feature, i) => (
                                                    feature.startsWith('HEADER:') ? (
                                                        <li key={`${key}-h-${i}`} className="text-brand-600 font-serif text-sm font-bold uppercase tracking-widest mt-2 mb-1">{feature.replace('HEADER:', '')}</li>
                                                    ) : (
                                                        <li key={`${key}-f-${i}`} className="flex items-start text-zinc-600">
                                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0 ${isHighlight ? 'bg-brand-50 text-brand-600' : 'bg-zinc-100 text-zinc-400'}`}><Check className="w-3 h-3" /></span>
                                                            <span className="font-light text-sm tracking-wide">{feature}</span>
                                                        </li>
                                                    )
                                                ))}
                                            </ul>
                                        )}
                                        <div className="mt-6">
                                            <button onClick={() => {
                                                const categoryLabel = categories.find(c => c.id === activeCategory)?.label || activeCategory;
                                                const msg = `Hello Skycam. I would like information on the ${pkg.name} package for ${categoryLabel}, including availability and pricing.`;
                                                const url = `https://wa.me/918667518859?text=${encodeURIComponent(msg)}`;
                                                window.open(url, '_blank');
                                            }} className="py-3 px-6 text-xs uppercase tracking-widest font-semibold transition-all border bg-brand-600 text-white border-brand-600 hover:bg-brand-700">Contact Us</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}



            </div>
        </section>
    );
};

export default Services;