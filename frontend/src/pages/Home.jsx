import React, { useRef } from 'react';
import HeroSection from "../components/HeroSection"
import Navbar from '../components/Navbar';

function Home() {


  return (
    <div className="scroll-container">
    
      <HeroSection/>
      <Navbar/>
    </div>
  );
}

export default Home;
