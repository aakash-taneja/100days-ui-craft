import { useEffect } from "react";
import "./App.css";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(CustomEase, SplitText);
CustomEase.create("hop", "0.85,0,0.15,1");

function App() {
  useEffect(() => {
    const counterProgress = document.querySelector(".counter h1");
    const counter = { value: 0 };

    const split = SplitText.create(".hero-header h1", {
      type: "words",
      mask: "words",
      wordsClass: "word",
    });

    const counterTl = gsap.timeline({ delay: 0.5 });
    const overlayTextTl = gsap.timeline({ delay: 0.75 });
    const revealTl = gsap.timeline({ delay: 0.5 });

    counterTl.to(counter, {
      value: 100,
      duration: 5,
      ease: "power2.out",
      onUpdate: () => {
        if (counterProgress) counterProgress.textContent = Math.floor(counter.value).toString();
      },
    });

    overlayTextTl
      .to(".overlay-text", {
        y: "0",
        duration: 0.75,
        ease: "hop",
      })
      .to(".overlay-text", {
        y: "-2rem",
        duration: 0.75,
        ease: "hop",
        delay: 0.75,
      })
      .to(".overlay-text", {
        y: "-4rem",
        duration: 0.75,
        ease: "hop",
        delay: 0.75,
      })
      .to(".overlay-text", {
        y: "-6rem",
        duration: 0.75,
        ease: "hop",
        delay: 1,
      });

    revealTl
      .to(".img", {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 1,
        ease: "hop",
      })
      .to(".hero-images", {
        gap: "0.75vw",
        duration: 1,
        delay: 0.5,
        ease: "hop",
      })
      .to(".img", {
        scale: 1,
        duration: 1,
        ease: "hop",
      }, "<").to(".img:not(.hero-img)", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        stagger: 0.1,
        ease: "hop",
      })
      .to(".hero-img", {
       scale:2,
       duration: 1,
       ease: "hop",
      })
      .to(".hero-overlay", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: "hop",
      })
      .to(".hero-header h1 .word", 
        {
       y:"0",
       duration: 0.75,
       stagger:0.1,
       ease:"power3.out",
      },
      "-=0.5"
    );
  }, []);

  return (
    <>
      <nav>
        <div className="nav-logo">
          <a href="/">Aakash Taneja</a>
        </div>
        <div className="nav-items">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-overlay">
          <div className="counter">
            <h1>0</h1>
          </div>

          <div className="overlay-text-container">
            <div className="overlay-text">
              <p>Unfold Emotion</p>
              <p>Welcome</p>
              <p>Aakash Taneja</p>
            </div>
          </div>
        </div>

        <div className="hero-images">
          <div className="img">
            <img src="/hero-1.jpg" alt="Hero Image" />
          </div>
          <div className="img">
            <img src="/hero-2.jpg" alt="Hero Image" />
          </div>
          <div className="img hero-img ">
            <img src="/hero-3.jpg" alt="Hero Image" />
          </div>
          <div className="img">
            <img src="/hero-4.jpg" alt="Hero Image" />
          </div>
          <div className="img">
            <img src="/hero-5.jpg" alt="Hero Image" />
          </div>
        </div>

        <div className="hero-header">
          <h1>Aakash Taneja</h1>
        </div>
      </section>
    </>
  )
}

export default App
