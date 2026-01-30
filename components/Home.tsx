import React from 'react';
import Hero from './Hero';
import Portfolio from './Portfolio';
import Services from './Services';
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
            <Portfolio />
            <Services scrollToSection={scrollToSection} />
            <Contact />
        </>
    );
};

export default Home;
