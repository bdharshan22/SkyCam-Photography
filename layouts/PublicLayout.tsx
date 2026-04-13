import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingScreen from "../components/LoadingScreen";
import OfflineScreen from "../components/OfflineScreen";
import WhatsAppFloat from "../components/WhatsAppFloat";
import { NavLink } from "../types";
import { api } from "../services/api";

const PublicLayout: React.FC = () => {
    const [activeLink, setActiveLink] = useState<string>(NavLink.HOME);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        api.incrementVisits();
    }, []);

    // Loading progress
    useEffect(() => {
        const safetyTimeout = setTimeout(() => {
            setProgress(100);
        }, 800);
        return () => clearTimeout(safetyTimeout);
    }, []);

    useEffect(() => {
        const imgs = Array.from(document.images || []);
        const total = imgs.length;
        let loaded = imgs.filter((img: HTMLImageElement) => img.complete).length;

        const updateProgress = () => {
            const resourceRatio = total > 0 ? loaded / total : 1;
            const target = Math.max(10, Math.round(resourceRatio * 100));
            setProgress((p) => Math.max(p, target));
        };

        const onLoadOrError = () => {
            loaded += 1;
            updateProgress();
        };

        imgs.forEach((img: HTMLImageElement) => {
            if (!img.complete) {
                img.addEventListener('load', onLoadOrError);
                img.addEventListener('error', onLoadOrError);
            }
        });

        const sim = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) return 100;
                if (p >= 90 && loaded < total) return p;
                return Math.min(99, p + Math.random() * 20 + 5);
            });
        }, 50);

        const checkDone = () => setProgress(100);

        if (document.readyState === 'complete') {
            checkDone();
        } else {
            window.addEventListener('load', checkDone);
        }

        updateProgress();

        return () => {
            imgs.forEach((img: HTMLImageElement) => {
                img.removeEventListener('load', onLoadOrError);
                img.removeEventListener('error', onLoadOrError);
            });
            clearInterval(sim);
            window.removeEventListener('load', checkDone);
        };
    }, []);

    // Online/offline
    useEffect(() => {
        const onOnline = () => setIsOnline(true);
        const onOffline = () => setIsOnline(false);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    // Section observer
    useEffect(() => {
        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, {
            root: null,
            rootMargin: "-50% 0px -50% 0px",
            threshold: 0,
        });

        const sections = document.querySelectorAll("section");
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen relative bg-surface-950 flex flex-col">
            {isLoading && (
                <LoadingScreen
                    progress={Math.round(progress)}
                    onComplete={() => setIsLoading(false)}
                />
            )}
            {!isOnline && <OfflineScreen onRetry={() => window.location.reload()} />}
            <Navbar
                activeLink={activeLink}
                scrollToSection={scrollToSection}
            />

            <main className="relative z-10 bg-surface-950 w-full flex-1">
                <Outlet context={{ scrollToSection }} />
            </main>

            <Footer />

            {/* WhatsApp Floating Button */}
            <WhatsAppFloat />
        </div>
    );
};

export default PublicLayout;
