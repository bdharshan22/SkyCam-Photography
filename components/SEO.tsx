import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

const SEO: React.FC<SEOProps> = ({
    title = "Skycam Photography | Capturing Timeless Moments",
    description = "Skycam Photography specializes in wedding, baby shower, puberty, and event photography in Hosur, Tamil Nadu. We craft visual narratives that resonate with elegance.",
    image = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
    url = "https://skycamphotography.com" // Replace with actual domain when deployed
}) => {
    const siteTitle = title === "Skycam Photography | Capturing Timeless Moments" ? title : `${title} | Skycam Photography`;

    // JSON-LD Structured Data for Local Business
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "PhotographyBusiness",
        "name": "Skycam Photography",
        "image": image,
        "description": description,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Hosur",
            "addressRegion": "Tamil Nadu",
            "addressCountry": "IN"
        },
        "telephone": "+918667518859",
        "priceRange": "₹₹",
        "url": url,
        "sameAs": [
            "https://www.instagram.com/skycamphotography01/"
        ]
    };

    // Site Navigation Schema
    const navSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
            {
                "@type": "SiteNavigationElement",
                "position": 1,
                "name": "Portfolio",
                "description": "Our photography portfolio showing weddings, events, and portraits.",
                "url": `${url}/#portfolio`
            },
            {
                "@type": "SiteNavigationElement",
                "position": 2,
                "name": "Services",
                "description": "Photography packages for weddings, baby showers, and events.",
                "url": `${url}/#services`
            },
            {
                "@type": "SiteNavigationElement",
                "position": 3,
                "name": "Contact",
                "description": "Get in touch with us for bookings and inquiries.",
                "url": `${url}/#contact`
            }
        ]
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Schema.org Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(navSchema)}
            </script>
        </Helmet>
    );
};

export default SEO;
