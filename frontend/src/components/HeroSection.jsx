import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import heroLayer1 from '../assets/hero-img-layer-1.png';
import heroLayer2 from '../assets/hero-img-layer-2.png';
import Logo from '../assets/LogoTWM.svg';
import TheWellLogo from '../assets/The-Well-Logo.png';

import ps5Logo from "../assets/ps5-logo.png";
import xboxLogo from "../assets/xbox-logo.png";
import pcLogo from "../assets/pc-logo.png";


import '../styles/HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const containerRef = useRef(null);
  const logoInitialRef = useRef(null);
  const logoMaskRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const gradientRef = useRef(null);
  const maskImageRef = useRef(null);
  const maskWhiteRef = useRef(null);
  const finalLogoRef = useRef(null);
  const platformLogosRef = useRef(null);

  const ps5LogoRef = useRef(null);
  const pcLogoRef = useRef(null);
  const xboxLogoRef = useRef(null);

  const descriptionSectionRef = useRef(null);



  useEffect(() => {

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=2000', // wysokość animacji
        scrub: true,
        pin: true,
      }
    });

   const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=700', // wysokość animacji
        scrub: true,
        pin: false,
      }
    });

      const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=500', // wysokość animacji
        scrub: true,
        pin: false,
      }
    });


    // Etap 2: pojawia się maska
    tl.fromTo(logoMaskRef.current, {
      opacity: 0,
      scale: 10
    }, 
    {
      opacity: 1,
      scale: 1,
      duration: 2,
    }, "<"); // zaczyna się równolegle z końcem logo


    // Etap 1: logo znika szybko
    tl3.to(logoInitialRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.2
    });


     tl3.fromTo(gradientRef.current, {
      opacity: 0
      }, 
      {
      opacity: 1,
      duration: 0.5
      });
    
      tl.to(maskWhiteRef.current, {
  opacity: 1,
  duration: 0.7
});


    tl.fromTo(finalLogoRef.current, {
        opacity: 0,
        scale: 0.8
    },
     {
        opacity: 1,
        scale: 2,
        duration: 0.6,
        ease: "power2.out"
    });

tl.fromTo(platformLogosRef.current, {
  opacity: 0,
  y: 40
}, {
  opacity: 1,
  y: 0,
  duration: 0.2,
  ease: 'power2.out'
});

    tl.fromTo(descriptionSectionRef.current, {
  opacity: 0,
  y: 40
}, {
  opacity: 1,
  y: 0,
  duration: 0.2,
  ease: 'power2.out'
});

    
  }, []);

  return (
    <div className="hero-container" ref={containerRef}>

              {/* Warstwy tła */}
      <img src={heroLayer1} alt="Layer 1" className="background-image layer1" ref={layer1Ref} />
      <img src={heroLayer2} alt="Layer 2" className="background-image layer2" ref={layer2Ref} />

      {/* Logo UI na środku */}
      <img src={Logo} alt="Logo UI" className="logo-initial" ref={logoInitialRef} />


      {/* Maska logo */}
      <div className="logo-mask" ref={logoMaskRef}>
        <div className="masked-image-wrapper">  
   

  <div
    className="masked-image masked-image-photo"
    style={{ backgroundImage: `url(${heroLayer1})` }}
    ref={(el) => (maskImageRef.current = el)}
  />
  <div
    className="masked-image masked-image-white"
    ref={(el) => (maskWhiteRef.current = el)}
  />


</div>
      </div>
       
       


               <img
         src={TheWellLogo}
         alt="The Well Meant Logo"
         className="final-logo"
         ref={finalLogoRef}
       />      

       
        <div className="platform-logos" ref={platformLogosRef}>
            <img src={ps5Logo} alt="PS5" ref={ps5LogoRef}/>
             <img src={pcLogo} alt="PC" ref={pcLogoRef} />
             <img src={xboxLogo} alt="Xbox" ref={xboxLogoRef} />
        </div>


      
        <div className="description-section" ref={descriptionSectionRef}>
            <h2 className="gradient-heading"></h2>
            <p className="gradient-paragraph">
         
            </p>
       </div>
   

      {/* Gradient */}
      <div className="gradient-overlay" ref={gradientRef} />

      
    </div>



        
  );
};

export default HeroSection;
