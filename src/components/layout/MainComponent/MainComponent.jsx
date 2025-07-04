// src/components/MainComponent/MainComponent.jsx
import React from 'react';
import styles from './MainComponent.module.css'; // For future styles
import Hero from '../Hero/Hero'; // Import the Hero component
import MenuSection from '../../features/Menu/MenuSection/MenuSection'; // Import the MenuSection component
import Testimonials from '../../features/Testimonials/Testimonials'; // Import the Testimonials component
import About from '../../features/About/About'; // Import the About component

function MainComponent() {
    return (
        <main className={styles.mainContent}> 
            <Hero /> {/* Render the Hero component */}
            <MenuSection /> {/* Render the MenuSection component */}
            <Testimonials /> {/* Render the Testimonials component */}
            <About /> {/* Render the About component */}
            {/* Other sections will be added here later */}
        </main>
    );
}

export default MainComponent;
