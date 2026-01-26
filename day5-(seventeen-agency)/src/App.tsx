import { useState, useEffect, useRef } from "react";
import "./App.css";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenis = useLenis();
  const iconRef = useRef<HTMLImageElement>(null);
  const contactInfoRef = useRef<HTMLElement>(null);
  const baseRowIconMapRef = useRef<string[] | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const ICONS = [
    "./icon1.png",
    "./icon2.png",
    "./icon3.png",
    "./icon4.png",
    "./icon5.png",
    "./icon6.png",
    "./icon7.png",
  ];

  function setIcon(src: string) {
    if (!iconRef.current) return;
    iconRef.current.src = src;
  }

  /* =============================
     Lenis ↔ GSAP Sync
  ============================== */
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

  /* =============================
     Scroll + Cloning + Animations
  ============================== */
  useEffect(() => {
    if (!lenis) return;

    const contactInfo = contactInfoRef.current;
    if (!contactInfo || !contactInfo.parentElement) return;

    const contactRowMaxGap =
      window.innerWidth < 1000 ? 5 : 10;

    /* -------- Capture base rows BEFORE cloning -------- */
    const baseRows = Array.from(
      contactInfo.querySelectorAll(".contact-info-row")
    );
    const baseRowCount = baseRows.length;
    if (!baseRowIconMapRef.current) {
      baseRowIconMapRef.current = Array.from(
        { length: baseRowCount },
        () => ICONS[Math.floor(Math.random() * ICONS.length)]
      );
    }
    
    

    /* -------- Clone blocks -------- */
    for (let i = 0; i < 10; i++) {
      const clone = contactInfo.cloneNode(true) as HTMLElement;
      clone.removeAttribute("ref");
      contactInfo.parentElement.appendChild(clone);
    }

    const contactRows = document.querySelectorAll(
      ".contact-info-row"
    );

    /* -------- Normalize logical identity -------- */
    contactRows.forEach((row, i) => {
      (row as HTMLElement).dataset.baseIndex = String(
        i % baseRowCount
      );
    });

    /* -------- Gap Animations (per row) -------- */
    contactRows.forEach((row) => {
      ScrollTrigger.create({
        trigger: row,
        start: "top center+=100",
        end: "top center-=100",
        scrub: true,
        onUpdate: (self) => {
          const gap =
            1 +
            (contactRowMaxGap - 1) *
              Math.sin(self.progress * Math.PI);
          (row as HTMLElement).style.gap = `${gap}rem`;
        },
      });
    });

    /* -------- SINGLE Global Center Tracker -------- */
    let lastBaseIndex: string | null = null;

    ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: true,

      onUpdate: () => {
        const viewportCenter =
          window.innerHeight / 2;

        let closestRow: HTMLElement | null = null;
        let closestDistance = Infinity;

        contactRows.forEach((row) => {
          const rect = row.getBoundingClientRect();
          const rowCenter =
            rect.top + rect.height / 2;
          const distance = Math.abs(
            rowCenter - viewportCenter
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestRow = row as HTMLElement;
          }
        });

        if (!closestRow) return;

        const baseIndex =
          (closestRow as HTMLElement).dataset.baseIndex!;

        if (baseIndex === lastBaseIndex) return;

        lastBaseIndex = baseIndex;

        setIcon(
          baseRowIconMapRef.current![Number(baseIndex)]
        );
        
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());

      const parent = contactInfo.parentElement;
      if (parent) {
        while (parent.children.length > 1) {
          parent.removeChild(parent.lastChild!);
        }
      }
    };
  }, [lenis]);

  /* =============================
     Live Clock
  ============================== */
  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      return (
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    };

    const updateTime = () => {
      const time = formatTime();
      setCurrentTime(time);
      document
        .querySelectorAll(".time-display")
        .forEach((el) => {
          el.textContent = time;
        });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ReactLenis root options={{ infinite: true }}>
      <section className="contact-visual">
        <div className="contact-icon">
          <img
            ref={iconRef}
            src="./icon1.png"
            alt="contact icon"
          />
        </div>
      </section>

      <section
        className="contact-info"
        ref={contactInfoRef}
      >
        <div className="contact-info-row">
          <p>Address</p>
          <p>Rajapark Jaipur Rajasthan India</p>
        </div>

        <div className="contact-info-row">
          <p>Current Time</p>
          <p className="time-display">
            {currentTime}
          </p>
        </div>

        <div className="contact-info-row">
          <p>General Enquiries</p>
          <p>aakashtaneja12@gmail.com</p>
        </div>

        <div className="contact-info-row">
          <p>New Business Enquiries</p>
          <p>aakash@lighthouse.storage</p>
        </div>

        <div className="contact-info-row">
          <p>Job Enquiries</p>
          <p>thekaikrypto@gmail.com</p>
        </div>

        <div className="contact-info-row">
          <p>Freelancer & Collaborator</p>
          <p>thekaikrypto@gmail.com</p>
        </div>

        <div className="contact-info-row">
          <p>Github</p>
          <p>github.com/aakash-taneja</p>
        </div>

        <div className="contact-info-row">
          <p>LinkedIn</p>
          <p>linkedin.com/in/aakash-taneja</p>
        </div>
      </section>
    </ReactLenis>
  );
}

export default App;
