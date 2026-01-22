import { useGSAP } from "@gsap/react";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import Magnet from "./MagnetEffect";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const App = () => {
  const images = [
    {
      id: "first_image",
      src: "/5.jpg",
      w: 226,
      h: 212,
      left: "35vw",
      top: "24px",
      strength: 5,
    },
    {
      id: "second__image",
      src: "/1.jpg",
      w: 184,
      h: 134,
      left: "29vw",
      top: "17vh",
      strength: 2,
    },
    {
      id: "third__image",
      src: "/2.jpg",
      w: 124,
      h: 229,
      left: "0vw",
      top: "25vh",
      strength: 4,
    },
    {
      id: "fourth__image",
      src: "/3.jpg",
      w: 104,
      h: 87,
      left: "12vw",
      top: "50vh",
      strength: 4,
    },
    {
      id: "fifth__image",
      src: "/6.jpg",
      w: 213,
      h: 190,
      left: "21vw",
      top: "70vh",
      strength: 4,
    },
    {
      id: "sixth__image",
      src: "/7.jpg",
      w: 117,
      h: 102,
      left: "36vw",
      top: "65vh",
      strength: 4,
    },
    {
      id: "seventh__image",
      src: "/8.jpg",
      w: 165,
      h: 118,
      left: "55vw",
      top: "80vh",
      strength: 4,
    },
    {
      id: "eighth__image",
      src: "/9.jpg",
      w: 155,
      h: 171,
      left: "64vw",
      top: "10vh",
      strength: 4,
    },
    {
      id: "ninth__image",
      src: "/10.jpg",
      w: 123,
      h: 87,
      left: "89vw",
      top: "10vh",
      strength: 4,
    },
    {
      id: "tenth__image",
      src: "/11.jpg",
      w: 262,
      h: 290,
      left: "82vw",
      top: "30vh",
      strength: 4,
    },
    {
      id: "eleventh__image",
      src: "/4.jpg",
      w: 299,
      h: 213,
      left: "70vw",
      top: "69vh",
      strength: 4,
    },
  ];

  useLayoutEffect(() => {
    // Scroll lock to prevent layout jump during intro animation
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  useGSAP(() => {
    const imageIds = images.map((img) => `#${img.id}`);

    // Set initial styles
    gsap.set(imageIds, {
      top: "50vh",
      left: "50vw",
      scale: 0.5,
      opacity: 0,
    });

    gsap.set("#image_container", {
      width: 0,
      height: 0,
      scale: 0,
    });

    const tl = gsap.timeline({
      defaults: { duration: 1.5, ease: "power3.out" },
      onComplete: () => {
        // Restore scroll
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.body.style.height = "";

        // Initialize ScrollSmoother for smooth scrolling throughout
        ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.5,
          effects: true,
        });

        const scrollDistance = window.innerHeight * 4;

        // Init ScrollTrigger animations
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#parent_container",
            pin: true,
            start: "top top",
            end: `+=${scrollDistance}`,
            scrub: 1,
            pinSpacing: true,
          },
        });

        scrollTl
          .to("#text_content", { opacity: 0 }, "scroll")
          .to("#text_content_second", { y: -30 }, "scroll")
          .to(
            "#first_image",
            { y: "-30vw", x: "-10vw", scale: 2, overwrite: "auto" },
            "scroll"
          )
          .to(
            "#third__image",
            { y: -100, scale: 2, x: -200, overwrite: "auto" },
            "scroll"
          )
          .to("#tenth__image", { scale: 2.3, x: "50vw" }, "scroll")
          .to("#sixth__image", { scale: 1.8, x: "-40vw", y: "20vw" }, "scroll")
          .to("#ninth__image", { scale: 1.8, x: "10vw", y: "-20vw" }, "scroll")
          .to(
            "#eleventh__image",
            { scale: 1.8, x: "40vw", y: "10vw" },
            "scroll"
          )
          .to("#seventh__image", { scale: 2, x: "5vw", y: "20vw" }, "scroll")
          .to(
            "#eighth__image",
            { scale: 2, x: "30vw", y: "-20vw", duration: 3 },
            "scroll"
          )
          .to(
            "#second__image",
            { scale: 1.8, x: "-20vw", y: "-20vw", duration: 2 },
            "scroll"
          )
          .to(
            "#fourth__image",
            { scale: 1.8, x: "-20vw", y: "-20vw", duration: 3 },
            "scroll"
          )
          .to(
            "#fifth__image",
            { scale: 1.8, x: "-20vw", y: "20vw", duration: 2.5 },
            "scroll"
          )
          .to(
            "#image_container",
            {
              width: "100vw",
              height: "100vh",
              scale: 1,
              delay: 1,
              duration: 3,
            },
            "scroll"
          )
          .to(
            "#left_text",
            {
              x: "-40vw",
              delay: 1.05,
              duration: 4,
            },
            "scroll"
          )
          .to(
            "#right_text",
            {
              x: "40vw",
              delay: 1,
              duration: 3,
            },
            "scroll"
          );
      },
    });

    // Animate each image in sequence
    images.forEach((img, i) => {
      tl.to(
        `#${img.id}`,
        {
          top: img.top,
          left: img.left,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power1.inOut",
        },
        `a+=${2 * Math.random()}`
      );
    });
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {/* Hero/Telescope Section */}
        <div
          id="parent_container"
          className="flex justify-center items-center h-screen relative overflow-hidden bg-[#F4F3F0]"
        >
          <div></div>
          {/* Image layers */}
          {images.map((img) => (
            <div
              key={img.id}
              id={img.id}
              className="absolute"
              style={{ top: "50vh", left: "50vw" }}
            >
              <Magnet padding={20} magnetStrength={img.strength}>
                <img
                  src={img.src}
                  className="object-cover"
                  style={{ width: `${img.w}px`, height: `${img.h}px` }}
                />
              </Magnet>
            </div>
          ))}

          {/* Text content */}
          <div
            className="font-normal text-[52px] text-[#1A1915] absolute top-[40vh] text-center font-inter will-change-transform"
          >
            <div id="text_content">Real recommendations</div>
            <div
              id="text_content_second"
              className="flex items-center justify-center gap-x-1"
            >
              <span id="left_text">by real</span>
              <div id="image_container" className=" bg-[#594E47] absolute z-20">
                <img
                  className="w-full h-full object-cover"
                  src="/girl-png.webp"
                />
              </div>
              <span id="right_text" className="pl-2 w-[200px] bg-amber-200">
                people
              </span>
            </div>
          </div>
        </div>

        {/* Next Section */}
        <section
          id="next_section"
          className="min-h-screen bg-[#F4F3F0] flex justify-center items-center"
        >
          <h2 className="text-5xl md:text-7xl font-light text-white text-[#BDBCB8]">
            Discover More
          </h2>
        </section>
      </div>
    </div>
  );
};

export default App;