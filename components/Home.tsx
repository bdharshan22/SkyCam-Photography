import React from 'react';
import Hero from './Hero';
import Portfolio from './Portfolio';
import About from './About';
import Services from './Services';
import Testimonials from './Testimonials';
import Contact from './Contact';
import { useOutletContext } from 'react-router-dom';

interface ContextType {
    scrollToSection: (id: string) => void;
}

const Home: React.FC = () => {
    const { scrollToSection } = useOutletContext<ContextType>();
    return (
        <>
            <Hero scrollToSection={scrollToSection} />
            <About />
            <Portfolio />
            <Services scrollToSection={scrollToSection} />
            <Testimonials />
            <Contact />
        </>
    );
};

export default Home;
