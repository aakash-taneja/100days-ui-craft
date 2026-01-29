import './App.css'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './shader.js'
import gsap from 'gsap'
import { ReactLenis, useLenis } from "lenis/react";
// import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

function App() {
  const lenis = useLenis();

  const canvas = useRef<HTMLCanvasElement>(null);
  const hero = useRef<HTMLDivElement>(null);

  const config = {
    color: "#ebf5df",
    spread: 0.5,
    speed: 2,
  }

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
    };
  }, [lenis]);

  useEffect(() => {
    if (!canvas.current || !hero.current) return;
    if (!lenis || !hero.current) return;

    // === Setup ===
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.current,
      alpha: true,
      antialias: false,
    });

    function hexToRgb(hex: string) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
        : { r: 0, g: 0, b: 0 };
    }

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    resize();

    window.addEventListener("resize", resize);

    const rgb = hexToRgb(config.color);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(hero.current.offsetWidth, hero.current.offsetHeight),
        },
        uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
        uSpread: { value: config.spread },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let scrollProgress = 0;

    function animate() {
      material.uniforms.uProgress.value = scrollProgress;
    
      material.uniforms.uResolution.value.set(
        hero.current!.offsetWidth,
        hero.current!.offsetHeight
      );
    
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    

    animate();

    lenis.on("scroll", () => {
      if (!hero.current) return;
    
      const rect = hero.current.getBoundingClientRect();
      const progress = 1 - rect.bottom / rect.height;
    
      scrollProgress = THREE.MathUtils.clamp(
        progress * config.speed,
        0,
        1
      );
    });
    window.addEventListener("resize", ()=>{
      if (!hero.current) return;
      material.uniforms.uResolution.value.set(
        hero.current.offsetWidth,
        hero.current.offsetHeight
      );
    });
    

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", ()=>{
        material.uniforms.uResolution.value.set(
          hero.current!.offsetWidth,
          hero.current!.offsetHeight
        );
      });
      renderer.dispose();
    };
  }, [lenis])

  return (
    <ReactLenis root>
      <section className="hero" ref={hero}>
        <div className="hero-img">
          <img src="./hero.webp" alt="hero" />
        </div>

        <div className="hero-header">
          <h1>Welcome to our website</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </div>

        <canvas className="hero-canvas" ref={canvas}></canvas>


        <div className="hero-content">
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat voluptatum dolores accusamus optio debitis sit illum tenetur voluptate ab dolor nam impedit nobis aut molestiae nulla, alias pariatur itaque magni.
          </h2>
        </div>
      </section>

      <section className="about">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non adipisci odit nihil esse! Reiciendis eaque omnis fugiat maiores repellendus cupiditate et? Nihil, impedit doloremque? Aliquam accusantium asperiores similique accusamus perferendis omnis quaerat excepturi itaque maiores at? Voluptatum quam culpa, minus sapiente reiciendis tempora eligendi iure nesciunt provident quibusdam dolore nulla?
        </p>
      </section>
    </ReactLenis>
  )
}

export default App
