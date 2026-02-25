import { useEffect, useRef } from 'react';
import './App.css'
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenis = useLenis();
  const windowContainerRef = useRef<HTMLDivElement>(null);
  const skyContainerRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroHeaderRef = useRef<HTMLDivElement>(null);
  const skyMoveDistanceRef = useRef<number>(0);

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;
    const skyContainer = skyContainerRef.current;
    const heroCopy = heroCopyRef.current;
    const windowContainer = windowContainerRef.current;
    const heroHeader = heroHeaderRef.current;
    if (!skyContainer || !heroCopy || !windowContainer || !heroHeader) return;

    const skyContainerHeight = skyContainer.offsetHeight;
    const viewportHeight = window.innerHeight;
    skyMoveDistanceRef.current = skyContainerHeight - viewportHeight;

    gsap.set(heroCopy, { yPercent: 100 });

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: `+=${window.innerHeight * 3}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        let windowScale: number;
        if (progress <= 0.5) {
          windowScale = 1 + (progress / 0.5) * 4;
        } else {
          windowScale = 5;
        }
        if (windowContainer) gsap.set(windowContainer, { scale: windowScale });
        if (heroHeader) gsap.set(heroHeader, { scale: windowScale, z: progress * 500 });
        if (skyContainer) gsap.set(skyContainer, { y: -progress * skyMoveDistanceRef.current });

        let heroCopyY: number;
        if (progress <= 0.66) {
          heroCopyY = 100;
        } else if (progress >= 1) {
          heroCopyY = 0;
        } else {
          heroCopyY = 100 * (1 - (progress - 0.66) / 0.34);
        }
        gsap.set(heroCopy, { yPercent: heroCopyY });
      },
    });
    }, [lenis]);

    return (
      <ReactLenis root>
        <section className="hero">
          <div ref={skyContainerRef} className="sky-container">
            <img src="./sky.webp" alt="" />
          </div>
          <div ref={heroCopyRef} className="hero-copy">
            <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut blanditiis nihil eaque earum officiis dolorem neque quis? Dolorum, ut atque sequi cumque enim dolorem dignissimos adipisci facere eos magnam libero, distinctio suscipit a. Autem repellendus dolor non facere corporis obcaecati incidunt nihil, dolorem doloribus eum explicabo magni enim accusantium velit! </h1>
          </div>

          <div ref={windowContainerRef} className="window-container">
            <img src="./window.webp" alt="" />
          </div>

          <div ref={heroHeaderRef} className="hero-header">
            <div className="col">
              <h1>An aperture <br /> into stillness</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi earum, repellat aliquam itaque asperiores aperiam neque est provident consectetur odio ad voluptatum reiciendis qui dignissimos.</p>
            </div>
            <div className="col">
              <p>Lorem ipsum</p>
              <h1>An aperture <br /> into stillness</h1>
            </div>
          </div>
        </section>
        <section className="outro">
          <h1>end of view</h1>
        </section>
      </ReactLenis>
    )
  }

export default App
