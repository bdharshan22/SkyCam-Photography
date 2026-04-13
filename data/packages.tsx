import React from 'react';
import { Check, Star, Camera, Video, Aperture, Heart, Sparkles, Gem } from 'lucide-react';

export interface PackageFeatures {
    id: string;
    name: string;
    subtitle: string;
    price: string;
    description: string;
    icon: React.ReactNode;
    idealFor: string;
    features: string[];
    isPopular?: boolean;
    detailedDescription?: string;
    images?: string[];
}

export const premiumPackages: PackageFeatures[] = [
    {
        id: 'tier-silver',
        name: 'SILVER',
        subtitle: 'Essential Elegance',
        price: 'Contact for Quote',
        description: 'For intimate events & refined simplicity. Perfect for small functions and personal shoots.',
        detailedDescription: 'The Silver package is designed for clients who value simplicity and clear, beautiful storytelling. It covers the essentials with high professionalism, ensuring your intimate moments are preserved forever. Ideal for birthdays, small gatherings, and portrait sessions.',
        icon: <Camera className="w-6 h-6" />,
        idealFor: 'Small events, birthdays, personal shoots',
        features: [
            'Traditional Photography',
            'Candid Photography',
            'Traditional Videography',
            'Professional Color Correction',
            'Online Gallery Delivery',
            'High-Resolution Edits',
            '100+ Edited Photos',
            'USB Drive Delivery'
        ]
    },
    {
        id: 'tier-gold',
        name: 'GOLD',
        subtitle: 'Signature Cinematic',
        price: 'Contact for Quote',
        description: 'Our most chosen package. A perfect blend of traditional coverage and modern cinematic storytelling.',
        detailedDescription: 'The Gold package is our signature offering, striking the perfect balance between comprehensive coverage and artistic flair. It includes everything needed to tell a complete story of your special day — from drone shots to cinematic highlights.',
        icon: <Star className="w-6 h-6" />,
        isPopular: true,
        idealFor: 'Weddings, engagements, corporate events',
        features: [
            'Traditional + Candid Photography',
            'Traditional + Candid Videography',
            'Drone Videography (4K)',
            'Outdoor Photo & Video Shoot',
            'Cinematic Highlight Film',
            'Advanced Color Grading',
            'Cloud + Drive Delivery',
            '300+ Edited Photos',
            'Instagram Reels (3)',
            'Pre-Wedding Consultation'
        ]
    },
    {
        id: 'tier-platinum',
        name: 'PLATINUM',
        subtitle: 'Elite Aerial Experience',
        price: 'Contact for Quote',
        description: 'The ultimate luxury storytelling package with full-day coverage and premium deliverables.',
        detailedDescription: 'The Platinum package is for those who want it all. It pushes the boundaries with advanced equipment, larger teams, and premium deliverables like live telecasting and instant photo booths.',
        icon: <Gem className="w-6 h-6" />,
        idealFor: 'Luxury weddings, large-scale events, resorts',
        features: [
            'Full Photography Coverage (All Day)',
            'Cinematic Videography (Full Day)',
            'Advanced Drone Photo & Video (4K/8K)',
            'Cinematic Film + Instagram Reels (5)',
            '360° Spinning Video Recorder',
            'Selfie Booth & Instant Photo Booth',
            'Live Telecast with LED Wall',
            'Premium Retouching & Grading',
            'Priority Editing & Fast Delivery',
            '500+ Edited Photos + Raw Files',
            'Custom Wedding Album (40 Pages)',
            'Second Photographer Included'
        ]
    }
];

// Additional stand-alone services
export interface StandaloneService {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    startingPrice?: string;
}

export const standaloneServices: StandaloneService[] = [
    {
        id: 'drone-videography',
        title: 'Drone Videography',
        description: 'Professional aerial coverage using DJI drones. Perfect for venue reveals, landscape shots, and cinematic event footage.',
        icon: <Video className="w-5 h-5" />,
        startingPrice: '₹5,000',
        features: ['4K/8K Aerial Video', 'Aerial Photos (48MP)', 'HyperLapse & TimeLapse', 'Venue Reveal Shots', 'DGCA Certified Pilot']
    },
    {
        id: 'product-photography',
        title: 'Product Photography',
        description: 'E-commerce and catalog-ready product shots with professional lighting and styling for brands and businesses.',
        icon: <Aperture className="w-5 h-5" />,
        startingPrice: '₹3,000',
        features: ['White Background', 'Lifestyle Shots', 'Flat Lay', 'Social Media Ready', 'Retouching Included']
    },
    {
        id: 'pre-wedding-shoot',
        title: 'Pre-Wedding Shoot',
        description: 'Cinematic pre-wedding films and photo sessions at stunning outdoor locations of your choice.',
        icon: <Heart className="w-5 h-5" />,
        startingPrice: '₹8,000',
        features: ['Outdoor Location Shoot', 'Cinematic Film', 'Drone Coverage', 'Outfit Change (2-3)', 'Instagram Reel']
    },
    {
        id: 'portfolio-modeling',
        title: 'Portfolio & Modeling Shoots',
        description: 'Professional portfolio creation for aspiring models, actors, and influencers with studio and outdoor options.',
        icon: <Sparkles className="w-5 h-5" />,
        startingPrice: '₹5,000',
        features: ['Studio + Outdoor', 'Professional Styling Tips', '50+ Retouched Photos', 'Composite Card Ready', 'Same-Day Preview']
    },
    {
        id: 'live-streaming',
        title: 'Live Streaming & LED Wall',
        description: 'Real-time live telecast of your event on LED walls or online platforms for remote guests.',
        icon: <Video className="w-5 h-5" />,
        startingPrice: '₹15,000',
        features: ['Multi-Camera Setup', 'Full HD/4K Streaming', 'LED Wall Display', 'YouTube/Facebook Live', 'Replay Recording']
    },
    {
        id: 'photo-booth',
        title: 'Photo Booth & 360° Spinner',
        description: 'Fun interactive photo booths and viral 360° spinning video platforms for events and parties.',
        icon: <Camera className="w-5 h-5" />,
        startingPrice: '₹8,000',
        features: ['Instant Print', '360° Spin Videos', 'Custom Backdrops', 'Props Included', 'Social Media Sharing']
    }
];
