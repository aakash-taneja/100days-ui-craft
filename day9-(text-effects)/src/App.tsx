import { useEffect } from 'react'
import './App.css'
import gsap from "gsap";

function App() {
  useEffect(() => {
    let currentScroll = 0;
    let isScrollingDown = true;
    let lastScrollTime = 0;
    let speedTimeout: ReturnType<typeof setTimeout>;
    const SCROLL_SPEED_FACTOR = 0.15;   // how much scroll delta boosts marquee speed
    const MAX_SPEED = 3;               // max timeScale when scrolling fast
    const IDLE_MS = 120;               // ms after scroll stops to return to base speed

    const marqueeInner = document.querySelector<HTMLElement>('.marquee-inner');
    const arrowElements = document.querySelectorAll('.arrow');

    if (!marqueeInner) return;

    const tween = gsap.to(marqueeInner, {
      xPercent: -50,
      repeat: -1,
      duration: 8,
      ease: 'none',
    });

    const onScroll = () => {
      const now = Date.now();
      const scrollY = window.pageYOffset;
      const delta = Math.abs(scrollY - currentScroll);
      const dt = (now - lastScrollTime) || 1;
      lastScrollTime = now;

      if (scrollY > currentScroll) {
        isScrollingDown = true;
      } else {
        isScrollingDown = false;
      }

      // Speed up marquee based on scroll velocity; decay back to 1 when idle
      clearTimeout(speedTimeout);
      const speedBoost = Math.min((delta / dt) * SCROLL_SPEED_FACTOR, MAX_SPEED - 1);
      const timeScale = (isScrollingDown ? 1 : -1) * (1 + speedBoost);

      gsap.to(tween, { timeScale, duration: 0.2, ease: 'power2.out' });

      speedTimeout = setTimeout(() => {
        gsap.to(tween, {
          timeScale: isScrollingDown ? 1 : -1,
          duration: 0.4,
          ease: 'power2.out',
        });
      }, IDLE_MS);

      arrowElements.forEach((arrow) => {
        if (isScrollingDown) {
          arrow.classList.remove('active');
        } else {
          arrow.classList.add('active');
        }
      });

      currentScroll = scrollY;
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(speedTimeout);
      tween.kill();
    };
  }, [])

  return (
    <>
     <section className="spacer"></section>
     <section className="marquee">
      <div className="marquee-inner">
        {/* First set – animating inner by -50% reveals the second set seamlessly */}
        <div className="marquee-part">
          Get Slush
          <div className="arrow">
            <img src="/arrow-down.png" alt="arrow" />
          </div>
        </div>
        <div className="marquee-part">
          Get Slush
          <div className="arrow">
            <img src="/arrow-down.png" alt="arrow" />
          </div>
        </div>
        <div className="marquee-part">
          Get Slush
          <div className="arrow">
            <img src="/arrow-down.png" alt="arrow" />
          </div>
        </div>
        <div className="marquee-part">
          Get Slush
          <div className="arrow">
            <img src="/arrow-down.png" alt="arrow" />
          </div>
        </div>
        <div className="marquee-part">
          Get Slush
          <div className="arrow">
            <img src="/arrow-down.png" alt="arrow" />
          </div>
        </div>
        {/* Duplicate set for seamless infinite loop */}
        <div className="marquee-part">
          Get Slush
          <div className="arrow">
            <img src="/arrow-down.png" alt="arrow" />
          </div>
        </div>
        <div className="marquee-part">
          Get Slush
          <div className="arrow">
            <img src="/arrow-down.png" alt="arrow" />
          </div>
        </div>
        <div className="marquee-part">
          Get Slush
          <div className="arrow">
            <img src="/arrow-down.png" alt="arrow" />
          </div>
        </div>
        <div className="marquee-part">
          Get Slush
          <div className="arrow">
            <img src="/arrow-down.png" alt="arrow" />
          </div>
        </div>
        <div className="marquee-part">
          Get Slush
          <div className="arrow">
            <img src="/arrow-down.png" alt="arrow" />
          </div>
        </div>
      </div>
     </section>
     <section className="spacer"></section>
    </>
  )
}

export default App
