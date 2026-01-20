import { useEffect } from "react";
import "./index.css";
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const lenis = useLenis();

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

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ".ws",
      start: "top bottom",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const galleryWrapper = document.querySelector(".gallery-wrapper") as HTMLElement;
        const sideCols = document.querySelectorAll(".col:not(.main)") as NodeListOf<HTMLElement>;
        const mainImg = document.querySelector(".img.main video") as HTMLElement;

        const scale = 1 + self.progress * 2.65;
        const yTranslate = self.progress * 300;
        const mainImgScale = 2 - self.progress * 0.85;

        if (galleryWrapper) {
          galleryWrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }

        sideCols.forEach((col) => {
          col.style.transform = `translateY(${yTranslate}px)`;
        });

        if (mainImg) {
          mainImg.style.transform = `scale(${mainImgScale})`;
        }
      },
    });
  });

  return (
    <ReactLenis root >
      <section className="sticky">
        <div className="gallery-wrapper">
          <div className="col side-1">
            <div className="img">
              <img src="/img1.jpg" alt="img1" />
            </div>
            <div className="img">
              <img src="/img2.jpg" alt="img2" />
            </div>
            <div className="img">
              <img src="/img3.jpg" alt="img3" />
            </div>
          </div>
          <div className="col side-2">
            <div className="img" style={{ flex: 7 }}>
              <img src="/img4.jpg" alt="img4" />
            </div>
            <div className="img" style={{ flex: 3 }}>
              <img src="/img5.jpg" alt="img5" />
            </div>
          </div>
          <div className="col main">
            <div className="img">
              <img src="/img7.jpg" alt="img7" />
            </div>
            <div className="img main">
              <video src="/hero-vid.mp4" autoPlay muted loop playsInline />
            </div>
            <div className="img">
              <img src="/img9.jpg" alt="img9" />
            </div>
          </div>
          <div className="col side-3">
            <div className="img" style={{ flex: 3 }}>
              <img src="/img10.jpg" alt="img10" />
            </div>
            <div className="img" style={{ flex: 7 }}>
              <img src="/img11.jpg" alt="img11" />
            </div>
          </div>
          <div className="col side-4">
            <div className="img">
              <img src="/img1.jpg" alt="img1" />
            </div>
            <div className="img">
              <img src="/img2.jpg" alt="img2" />
            </div>
            <div className="img">
              <img src="/img3.jpg" alt="img3" />
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <section className="hero">
          <div className="hero-img">
            <video src="/hero-vid.mp4" autoPlay muted loop playsInline />
          </div>
          <div className="header">
            <h1>Heure</h1>
            <h1>Bleue</h1>
          </div>
        </section>
        <section className="intro">
          <div className="tagline">
            <p>Creative images for all artisans</p>
          </div>
          <div className="divider"></div>
          <div className="intro-header">
            <h1>du bean</h1>
            <h1>et du bon</h1>
          </div>
        </section>
        <section className="ws"></section>
        <section className="outro">
          <h2>Straight to the heart,</h2>
          <h2>the shortest way to</h2>
          <h2>convince.</h2>
        </section>

      </div>
    </ReactLenis>
  );
}

export default App;
