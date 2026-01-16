import { useRef, useEffect, useState } from 'react'

function App() {
  const videoRef = useRef(null);
  const maskRefs = useRef([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isOverBox, setIsOverBox] = useState(false);

  const drawClipped = (ctx, video, rect) => {
    // Calculate aspect ratios
    const videoAspect = video.videoWidth / video.videoHeight;
    const windowAspect = window.innerWidth / window.innerHeight;
    
    // Calculate how the video would be displayed to cover the entire window
    let displayWidth, displayHeight, displayX, displayY;
    
    if (videoAspect > windowAspect) {
      // Video is wider - fit to height, center horizontally
      displayHeight = window.innerHeight;
      displayWidth = displayHeight * videoAspect;
      displayX = (window.innerWidth - displayWidth) / 2;
      displayY = 0;
    } else {
      // Video is taller - fit to width, center vertically
      displayWidth = window.innerWidth;
      displayHeight = displayWidth / videoAspect;
      displayX = 0;
      displayY = (window.innerHeight - displayHeight) / 2;
    }
    
    // Calculate the scale factor between video dimensions and display dimensions
    const scaleX = video.videoWidth / displayWidth;
    const scaleY = video.videoHeight / displayHeight;
    
    // Calculate which portion of the video corresponds to the mask position
    const sourceX = (rect.left - displayX) * scaleX;
    const sourceY = (rect.top - displayY) * scaleY;
    const sourceWidth = rect.width * scaleX;
    const sourceHeight = rect.height * scaleY;
    
    // Draw the corresponding portion of the video to the canvas
    ctx.drawImage(
      video,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      rect.width,
      rect.height
    );
  };

  useEffect(() => {
    const video = videoRef.current;
    const masks = maskRefs.current;

    if (!video || masks.length === 0) return;

    let animationFrameId;

    // Global mouse move listener for cursor coordinates
    const handleGlobalMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over any mask box
      const isOverAnyBox = masks.some((mask) => {
        if (!mask) return false;
        const rect = mask.getBoundingClientRect();
        return (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
      });
      
      setIsOverBox(isOverAnyBox);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);

    const updateCoordinates = (mask, rect) => {
      const coordDisplay = mask.querySelector(".coord-display");
      if (coordDisplay) {
        let x = Math.round(rect.left);
        let y = Math.round(rect.top);

        x = Math.abs(x).toString().padStart(4, "0");
        y = Math.abs(y).toString().padStart(4, "0");

        coordDisplay.textContent = `X: ${x}px Y: ${y}px`;
      }
    };

    const draw = () => {
      if (video.readyState < 2) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      masks.forEach((mask) => {
        if (!mask) return;
        const canvas = mask.querySelector("canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const rect = mask.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        drawClipped(ctx, video, rect);
        updateCoordinates(mask, rect);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleLoadedData = () => {
      video.play();
      draw();
    };

    video.addEventListener("loadeddata", handleLoadedData);

    // Set up dragging for each mask with smooth interpolation
    const dragHandlers = masks.map((mask) => {
      if (!mask) return null;

      let isDragging = false;
      let offsetX, offsetY;
      let currentX = 0;
      let currentY = 0;
      let targetX = 0;
      let targetY = 0;
      const handlerObj = { animationFrameId: null };

      // Get initial position
      const rect = mask.getBoundingClientRect();
      currentX = rect.left;
      currentY = rect.top;
      targetX = currentX;
      targetY = currentY;

      // Smooth interpolation function
      const smoothUpdate = () => {
        if (!isDragging) {
          handlerObj.animationFrameId = null;
          return;
        }

        // Interpolation factor (0.15 = smooth, lower = smoother but slower, higher = snappier)
        const lerpFactor = 0.15;
        
        // Smoothly interpolate current position toward target
        currentX += (targetX - currentX) * lerpFactor;
        currentY += (targetY - currentY) * lerpFactor;

        // Apply the position
        mask.style.left = currentX + "px";
        mask.style.top = currentY + "px";
        
        // Update coordinates
        const coordDisplay = mask.querySelector(".coord-display");
        if (coordDisplay) {
          coordDisplay.textContent = `X: ${Math.round(currentX)} Y: ${Math.round(currentY)}`;
        }

        // Continue animation
        handlerObj.animationFrameId = requestAnimationFrame(smoothUpdate);
      };

      const handleMouseDown = (e) => {
        isDragging = true;
        mask.style.cursor = "grabbing";
        const rect = mask.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        // Set initial positions
        currentX = rect.left;
        currentY = rect.top;
        targetX = currentX;
        targetY = currentY;
        
        // Start smooth animation loop
        if (!handlerObj.animationFrameId) {
          smoothUpdate();
        }
      };

      const handleMouseMove = (e) => {
        if (isDragging) {
          // Update target position (the element will smoothly move toward this)
          targetX = e.clientX - offsetX;
          targetY = e.clientY - offsetY;
        }
      };

      const handleMouseUp = () => {
        isDragging = false;
        mask.style.cursor = "grab";
        if (handlerObj.animationFrameId) {
          cancelAnimationFrame(handlerObj.animationFrameId);
          handlerObj.animationFrameId = null;
        }
      };

      mask.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return {
        mask,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handlerObj,
      };
    });

    // Cleanup function
    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      dragHandlers.forEach((handler) => {
        if (!handler) return;
        handler.mask.removeEventListener("mousedown", handler.handleMouseDown);
        document.removeEventListener("mousemove", handler.handleMouseMove);
        document.removeEventListener("mouseup", handler.handleMouseUp);
        if (handler.handlerObj?.animationFrameId) {
          cancelAnimationFrame(handler.handlerObj.animationFrameId);
        }
      });
    };
  }, []);

  return (
    <>
      <div className='hero h-screen w-full bg-black'>
        <video 
          ref={videoRef}
          src="/clip-1.mp4" 
          autoPlay 
          muted 
          loop 
          className='hidden' 
        />
        <div 
          ref={(el) => (maskRefs.current[0] = el)}
          className="mask-box fixed w-[60vw] h-[35vw] top-[10vh] left-[10vw] cursor-grab"
        >
          <canvas></canvas>
          <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
            <div className="coord-display bg-black/70 text-white text-xs px-2 py-1 rounded font-mono" style={{ position: 'absolute', top: '8px', left: '8px' }}>
              X: 0 Y: 0
            </div>
          </div>
        </div>

        <div 
          ref={(el) => (maskRefs.current[1] = el)}
          className="mask-box fixed w-[17vw] h-[9vw] top-[5vh] left-[5vw] cursor-grab"
        >
          <canvas></canvas>
          <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
            <div className="coord-display bg-black/70 text-white text-xs px-2 py-1 rounded font-mono" style={{ position: 'absolute', top: '8px', left: '8px' }}>
              X: 0 Y: 0
            </div>
          </div>
        </div>

        <div 
          ref={(el) => (maskRefs.current[2] = el)}
          className="mask-box fixed w-[35vw] h-[19vw] top-[5vh] right-[5vw] cursor-grab"
        >
          <canvas></canvas>
          <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
            <div className="coord-display bg-black/70 text-white text-xs px-2 py-1 rounded font-mono" style={{ position: 'absolute', top: '8px', left: '8px' }}>
              X: 0 Y: 0
            </div>
          </div>
        </div>

        <div 
          ref={(el) => (maskRefs.current[3] = el)}
          className="mask-box fixed w-[38vw] h-[22vw] top-[50vh] left-[5vw] cursor-grab"
        >
          <canvas></canvas>
          <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
            <div className="coord-display bg-black/70 text-white text-xs px-2 py-1 rounded font-mono" style={{ position: 'absolute', top: '8px', left: '8px' }}>
              X: 0 Y: 0
            </div>
          </div>
        </div>

        {/* Cursor coordinate display */}
        <div 
          className="fixed bg-black/70 text-white text-xs px-3 py-2 rounded font-mono pointer-events-none z-50"
          style={{
            left: `${cursorPos.x + 10}px`,
            top: `${cursorPos.y + 10}px`,
          }}
        >
          {isOverBox ? (
            <span>grab</span>
          ) : (
            <span>X: {cursorPos.x}px<br />Y: {cursorPos.y}px</span>
          )}
        </div>
      </div>
    </>
  )
}

export default App
