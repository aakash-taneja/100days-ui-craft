import React, { useRef, useEffect } from 'react'
import './App.css'
import Core from 'smooothy'

function App() {

  const wrapperRef = useRef(null);
  const slidesData = [
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts. Every setback is a setup for a comeback.", username: "@john_doe", color: '#FFFF00' },
    { text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.", username: "@jane_smith", color: '#55DB9C' },
    { text: "Believe you can and you're halfway there. Your limitation—it's only your imagination. Push yourself, because no one else is going to do it for you.", username: "@mike_wilson", color: '#E9CCFF' },
    { text: "It does not matter how slowly you go as long as you do not stop. The journey of a thousand miles begins with a single step. Keep moving forward.", username: "@sarah_jones", color: '#FB4903' },
    { text: "Everything you've ever wanted is on the other side of fear. Don't be afraid to give up the good to go for the great. Take risks and embrace the unknown.", username: "@alex_brown", color: '#FFFFFF' },
    { text: "The future belongs to those who believe in the beauty of their dreams. Dream big, work hard, stay focused, and surround yourself with good people.", username: "@emma_davis", color: '#4DA2FF' },
    { text: "In the middle of difficulty lies opportunity. Challenges are what make life interesting and overcoming them is what makes life meaningful.", username: "@chris_taylor", color: '#E9CCFF' },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall. Strength doesn't come from what you can do, it comes from overcoming the things you once thought you couldn't.", username: "@lisa_martin", color: '#FB4903' },
    { text: "Your time is limited, don't waste it living someone else's life. Have the courage to follow your heart and intuition. They somehow already know what you truly want to become.", username: "@david_lee", color: '#55DB9C' },
    { text: "The only impossible journey is the one you never begin. Start where you are, use what you have, do what you can. Progress, not perfection, is what matters.", username: "@amy_chen", color: '#FFB347' },
  ];

  useEffect(()=>{
    const wrapper:any = wrapperRef.current;
    if (!wrapper) return;

    const slides = [...(wrapper).children];

    const preventSelect = (e: any) => e.preventDefault();
    wrapper.addEventListener('selectstart', preventSelect);
    wrapper.style.userSelect = 'none';
    wrapper.style.webkitUserSelect = 'none';
    wrapper.style.touchAction = 'pan-y';


    const slider = new Core(wrapper, {
      infinite: false,
      snap: false,
      variableWidth: true,
      lerpFactor: 0.02,
      speedDecay: 0.97,
      bounceLimit: 0,
      setOffset: ({ itemWidth, totalWidth}) =>{
        const gap = window.innerWidth * 0.02;
        const lastSlideOffset = (slidesData.length -1) * (itemWidth + gap);
        return totalWidth - lastSlideOffset;
      },
      onUpdate: (instance)=>{
        const vwOffset = window.innerWidth * .1

        slides.forEach((slide, i)=>{
          const slideWidth = slide.offsetWidth;
          const slideLeft = slide.offsetLeft + instance.current;
          const bgColor = slidesData[i].color;

          const isLast = i === slidesData.length -1;

          if (slideLeft < 0 && !isLast){
            const ratio = Math.min(1, Math.abs(slideLeft) / slideWidth);
            slide.style.cssText = `
              background-color: ${bgColor};
              border: 2px solid rgba(0,0,0,0.6);
              transform-origin: left 80%;
              transform: translateX(${instance.current + Math.abs(slideLeft) + ratio * vwOffset}px) rotate(${-15 * ratio}deg) scale(${1 - ratio * 0.4});
              position: relative;
              z-index: ${i + 1};
            `
          } else {
            slide.style.cssText = `
              background-color: ${bgColor};
              border: 2px solid rgba(0, 0, 0, 0.6);
              transform: translateX(${instance.current}px);
              z-index: ${i + 1};
            `
          }
        })
      }
    })

    let animId:any;
    let wasDragging = false;
    let momentum = 0;
    const MOMENTUM_MULTIPLIER = 10;
    const MOMENTUM_DECAY = 0.96;

    function animate (){
      slider.update();

      if (slider.isDragging) {
        wasDragging = true;
        momentum = 0;
      } else if (wasDragging) {
        momentum = slider.speed * MOMENTUM_MULTIPLIER;
        wasDragging = false;
        
      }
      if ( Math.abs(momentum) > .5) {
        slider.target += momentum;
        momentum *= MOMENTUM_DECAY;
        slider.target = Math.max(slider.maxScroll, Math.min(0,slider.target));
      }

      animId = requestAnimationFrame(animate);
    }

    animate();

    return ()=>{
      cancelAnimationFrame(animId);
      wrapper.removeEventListener('selectstart', preventSelect);
      slider.destroy();
    }
  }, [])

  return (
    <div className='w-full h-screen flex items-center gap-[2vw]'>
      <div className='w-1/2 h-full flex flex-col items-start px-[4vw] justify-center'>
        <h2 className='text-[14vw] uppercase leading-[.8] font-bold'>Star <br /> Inspired</h2>
        <p className='text-[1.5vw] font-sans font-medium text-black/60 mt-[2vw] w-[60%]'>A collection of wisdom from great minds to fuel your daily motivation</p>
      </div>

      <div className='w-1/2 h-full overflow-clip relative'>
        <div ref={wrapperRef} className='flex h-full items-center will-change-transform'>
          {slidesData.map((slide, index) => {
            return <div
              key={index}
              className={`shrink-0 pointer-events-none w-[30vw] h-[40vw] rounded-[2vw] flex flex-col justify-between p-[2vw] ${index < slidesData.length -1 ? 'mr-[2vw]' : ''}`}
              style={{
                backgroundColor: slide.color,
                border: '2px solid rgba(0, 0, 0, 0.6)'
              }}
            >
              <p className='text-[2vw] font-sans font-medium leading-tight text-black'>{slide.text}</p>
              <p className='text-[1.5vw] font-sans font-medium text-black/60'>{slide.username}</p>
            </div>
          })}
        </div>
      </div>
    </div>

    
  )
}

export default App
