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
    images?: string[]; // Adding placeholders for future images
}

export const premiumPackages: PackageFeatures[] = [
    {
        id: 'tier-silver',
        name: 'SILVER',
        subtitle: 'Essential Elegance',
        price: 'Contact for Quote',
        description: 'For intimate events & refined simplicity. Perfect for small functions and personal shoots.',
        detailedDescription: 'The Silver package is designed for clients who value simplicity and clear, beautiful storytelling. It covers the essentials with high professionalism, ensuring your intimate moments are preserved forever. Ideal for birthdays, small gatherings, and portrait sessions where the focus is on the subject and the moment.',
        icon: <Camera className="w-6 h-6" />,
        idealFor: 'Small events, birthdays, personal shoots',
        features: [
            'Traditional Photography',
            'Candid Photography',
            'Traditional Videography',
            'Professional Color Correction',
            'Online Gallery Delivery',
            'High-Resolution Edits'
        ]
    },
    {
        id: 'tier-gold',
        name: 'GOLD',
        subtitle: 'Signature Cinematic',
        price: 'Contact for Quote',
        description: 'Our most chosen package. A perfect blend of traditional coverage and modern cinematic storytelling.',
        detailedDescription: 'The Gold package is our signature offering, striking the perfect balance between comprehensive coverage and artistic flair. It includes everything needed to tell a complete story of your special day, from drone shots to cinematic highlights. This is the preferred choice for weddings and engagement ceremonies.',
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
            'Cloud + Drive Delivery'
        ]
    },
    {
        id: 'tier-platinum',
        name: 'PLATINUM',
        subtitle: 'Elite Aerial Experience',
        price: 'Contact for Quote',
        description: 'The ultimate luxury storytelling package with full-day coverage and premium deliverables.',
        detailedDescription: 'The Platinum package is for those who want it all. It pushes the boundaries of wedding photography/videography with advanced equipment, larger teams, and premium deliverables like live telecasting and instant photo booths. It ensures every single second of your grand event is captured from every angle.',
        icon: <Gem className="w-6 h-6" />,
        idealFor: 'Luxury weddings, large-scale events, resorts',
        features: [
            'Full Photography Coverage',
            'Cinematic Videography (Full-Day)',
            'Advanced Drone Photo & Video',
            'Cinematic Film + Reels',
            '360° Spinning Video Recorder',
            'Selfie Booth & Instant Photo Booth',
            'Live Telecast with LED Wall',
            'Premium Retouching & Grading',
            'Priority Editing & Fast Delivery'
        ]
    }
];
