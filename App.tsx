import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";

import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { NavLink } from "./types";
import { api } from "./services/api";
import LoadingScreen from "./components/LoadingScreen";
import OfflineScreen from "./components/OfflineScreen";
import { HelmetProvider } from 'react-helmet-async';
import SEO from "./components/SEO";

const App: React.FC = () => {
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
    const minLoadingMs = 1500; // ensure loading screen is visible at least this long
    const start = performance.now();

    const onReady = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, minLoadingMs - elapsed);
      const timeout = setTimeout(() => setIsLoading(false), remaining);
      // clear timeout if component unmounts
      return () => clearTimeout(timeout);
    };

    if (document.readyState === 'complete') {
      onReady();
    } else {
      window.addEventListener('load', onReady);
      // fallback: ensure we don't wait forever
      const fallback = setTimeout(onReady, 5000);
      return () => {
        window.removeEventListener('load', onReady);
        clearTimeout(fallback);
      };
    }
  }, []);

  // Progress measurement: monitor image resources and simulate progress
  useEffect(() => {
    let ticking = false;
    const imgs = Array.from(document.images || []);
    const total = imgs.length;
    setTotalResources(total);

    let loaded = imgs.filter((img: HTMLImageElement) => img.complete).length;
    setLoadedResources(loaded);

    const updateProgress = () => {
      // combine resource ratio and a time-based simulated progress
      const resourceRatio = total > 0 ? loaded / total : 0;
      // resource contributes up to 90%, rest is simulated
      const target = Math.min(90, Math.round(resourceRatio * 90));
      setProgress((p) => Math.max(p, target));
    };

    // listeners
    const onLoadOrError = () => {
      loaded += 1;
      setLoadedResources(loaded);
      updateProgress();
    };

    imgs.forEach((img: HTMLImageElement) => {
      if (!img.complete) {
        img.addEventListener('load', onLoadOrError);
        img.addEventListener('error', onLoadOrError);
      }
    });

    // simulated increment so UI feels responsive
    const sim = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return p;
        return p + Math.random() * 3; // small random step
      });
    }, 250);

    // when everything loaded, push to 100 after a small delay
    const checkDone = () => {
      if (total === 0 || loaded >= total) {
        setProgress(100);
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    // try check after window load as well
    window.addEventListener('load', checkDone);

    // initial update
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



  return (
    <HelmetProvider>
      <SEO />
      <div className="bg-white min-h-screen relative">
        {isLoading && <LoadingScreen progress={Math.round(progress)} />}
        {!isOnline && <OfflineScreen onRetry={() => window.location.reload()} />}
        <Navbar
          activeLink={activeLink}
          scrollToSection={scrollToSection}
        />
        <main>
          <Hero scrollToSection={scrollToSection} />
          <Portfolio />

          <Services scrollToSection={scrollToSection} />
          <Contact />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default App;