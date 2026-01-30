import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingScreen from "../components/LoadingScreen";
import OfflineScreen from "../components/OfflineScreen";
import { NavLink } from "../types";
import { api } from "../services/api";

const PublicLayout: React.FC = () => {
    const [activeLink, setActiveLink] = useState<string>(NavLink.HOME);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
    const [progress, setProgress] = useState<number>(0);
    const [totalResources, setTotalResources] = useState<number>(0);
    const [loadedResources, setLoadedResources] = useState<number>(0);

    // Increment visit counter on mount
    useEffect(() => {
        api.incrementVisits();
    }, []);

    // loading state: wait for window load or a short timeout
    useEffect(() => {
        // Force load after 2.5s max to prevent hanging on mobile
        const safetyTimeout = setTimeout(() => {
            setProgress(100);
        }, 800);

        return () => clearTimeout(safetyTimeout);
    }, []);

    // Progress measurement
    useEffect(() => {
        const imgs = Array.from(document.images || []);
        const total = imgs.length;
        setTotalResources(total);

        let loaded = imgs.filter((img: HTMLImageElement) => img.complete).length;
        setLoadedResources(loaded);

        const updateProgress = () => {
            // Calculate real progress but bias it towards completion
            const resourceRatio = total > 0 ? loaded / total : 1;
            const target = Math.max(10, Math.round(resourceRatio * 100)); // Start at 10%
            setProgress((p) => Math.max(p, target));
        };

        const onLoadOrError = () => {
            loaded += 1;
            setLoadedResources(loaded);
            updateProgress();
        };

        imgs.forEach((img: HTMLImageElement) => {
            if (!img.complete) {
                img.addEventListener('load', onLoadOrError);
                // Treat error as loaded to not block
                img.addEventListener('error', onLoadOrError);
            }
        });

        // Fast simulated progress to keep it feeling responsive
        const sim = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) return 100; // Locked at 100
                if (p >= 90 && loaded < total) return p; // Wait a bit at 90% if real resources aren't done
                return Math.min(99, p + Math.random() * 20 + 5);
            });
        }, 50); // Faster updates

        const checkDone = () => {
            setProgress(100);
        };

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

    // online/offline listeners
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

    // Intersection Observer
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

    const footerRef = React.useRef<HTMLDivElement>(null);
    const [footerHeight, setFooterHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            if (footerRef.current) {
                setFooterHeight(footerRef.current.offsetHeight);
            }
        };

        // Initial measurement
        updateHeight();

        // Observe resize
        const observer = new ResizeObserver(updateHeight);
        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen relative">
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

            {/* Main Content with shadow acts as the "curtain" */}
            <main
                className="relative z-10 bg-white dark:bg-black w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                style={{ marginBottom: `${footerHeight}px` }}
            >
                <Outlet context={{ scrollToSection }} />
            </main>

            {/* Sticky Fixed Footer */}
            <div
                ref={footerRef}
                className="fixed bottom-0 left-0 w-full -z-10"
            >
                <Footer />
            </div>
        </div>
    );
};

export default PublicLayout;
