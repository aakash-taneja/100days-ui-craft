import './App.css'
import { ReactLenis, useLenis } from 'lenis/react'
import { useRef, useEffect } from 'react'

function App() {
  const imageRefs = useRef<(HTMLImageElement | HTMLVideoElement | null)[]>([])
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const assetRefs = useRef<(HTMLDivElement | null)[]>([])
  const mapRef = useRef<HTMLDivElement | null>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])

  const lenis = useLenis()

  const updateParallax = () => {
    imageRefs.current.forEach((img) => {
      if (!img) return
      
      const page = img.closest('.page')
      if (!page) return
      
      const rect = page.getBoundingClientRect()
      const scrollProgress = rect.top / window.innerHeight
      const translateY = -scrollProgress * 150
      img.style.transform = `translateY(${translateY}px) scale(1.5)`
    })
  }

  const updateMap = () => {
    if (!lenis) return

    const scrollY = lenis.scroll
    const totalHeight = document.body.scrollHeight - window.innerHeight
    const scrollProgress = scrollY / totalHeight

    contentRefs.current.forEach((content) => {
      if (!content) return
      const translateY = -scrollProgress * (contentRefs.current.length - 1) * 100
      content.style.transform = `translateY(${translateY}%)`
    })

    assetRefs.current.forEach((asset) => {
      if (!asset) return
      const translateY = -scrollProgress * (assetRefs.current.length - 1) * 100
      asset.style.transform = `translateY(${translateY}%)`
    })
  }

  const titleFadeObserver = () => {
    const map = mapRef.current
    if (!map) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const opacity = entry.intersectionRatio
        const blur = (1 - opacity) * 10

        const target = entry.target as HTMLElement
        target.style.opacity = opacity.toString()
        target.style.filter = `blur(${blur}px)`
      })
    }, {
      root: map,
      rootMargin: "-20px",
      threshold: [0, 0.25, 0.5, 0.75, 1]
    })

    contentRefs.current.forEach((content) => {
      if (!content) return
      content.querySelectorAll('.title1, .title2').forEach((title) => {
        observer.observe(title)
      })
    })

    return observer
  }

  const initSnapScroll = () => {
    if (!lenis) return

    let isSnapping = false
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null

    const snapToSection = (section: HTMLElement) => {
      if (!section || isSnapping) return
      
      isSnapping = true

      const safetyTimeout = setTimeout(() => {
        if (isSnapping) {
          isSnapping = false
        }
      }, 1000)
      
      const viewportHeight = window.innerHeight
      const sectionHeight = section.offsetHeight
      const centerPosition = section.offsetTop - (viewportHeight - sectionHeight) / 2
      
      lenis.scrollTo(centerPosition, {
        duration: 0.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          isSnapping = false
          clearTimeout(safetyTimeout)
        }
      })
    }

    const checkAndSnap = () => {
      const sections = pageRefs.current.filter((section): section is HTMLDivElement => section !== null)
      
      let mostVisibleSection: HTMLDivElement | null = null
      let maxVisibleArea = 0
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        
        const visibleArea = rect.height - Math.max(0, -rect.top) - Math.max(0, rect.bottom - viewportHeight)
        
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea
          mostVisibleSection = section
        }
      })
      
      if (mostVisibleSection) {
        const viewportHeight = window.innerHeight
        const section = mostVisibleSection as HTMLDivElement
        const targetPos = section.offsetTop - (viewportHeight - section.offsetHeight) / 2
        const difference = Math.abs(lenis.scroll - targetPos)
        
        if (difference > 1) {
          snapToSection(section)
        }
      }
    }

    const handleScroll = () => {
      if (isSnapping) return
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      scrollTimeout = setTimeout(checkAndSnap, 50)
    }

    lenis.on('scroll', handleScroll)

    return () => {
      lenis.off('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }

  useEffect(() => {
    const observer = titleFadeObserver()
    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!lenis) return
    const cleanup = initSnapScroll()
    return cleanup
  }, [lenis])

  useLenis(() => {
    updateParallax()
    updateMap()
  })

  return (
    <ReactLenis root options={{ infinite: true }}>
      <div 
        className="page"
        ref={(el) => { pageRefs.current[0] = el }}
      >
        <img 
          ref={(el) => { imageRefs.current[0] = el }}
          src="/women-1.jpg" 
          alt="logo" 
        />
      </div>
      <div className="page"
        ref={(el) => { pageRefs.current[1] = el }}
      >
        <video
          ref={(el) => { imageRefs.current[1] = el }}
          src="/coffee.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div 
        className="page"
        ref={(el) => { pageRefs.current[2] = el }}
      >
        <img 
          ref={(el) => { imageRefs.current[2] = el }}
          src="/wine-1.jpg" 
          alt="logo" 
        />
      </div>
      <div 
        className="page"
        ref={(el) => { pageRefs.current[3] = el }}
      >
        <img 
          ref={(el) => { imageRefs.current[3] = el }}
          src="/book-1.jpg" 
          alt="logo" 
        />
      </div>
      <div 
        className="page"
        ref={(el) => { pageRefs.current[4] = el }}
      >
        <img 
          ref={(el) => { imageRefs.current[4] = el }}
          src="/women-1.jpg" 
          alt="logo" 
        />
      </div>

      <div className="map" ref={mapRef}>
        <div 
          className="content"
          ref={(el) => { contentRefs.current[0] = el }}
        >
          <div className="corner top-left">01</div>
          <div className="corner top-right">04</div>
          <div className="corner bottom-left title1">Beach Bliss</div>
          <div className="corner bottom-right title2">Watermelon Smile</div>
        </div>
        <div 
          className="content"
          ref={(el) => { contentRefs.current[1] = el }}
        >
          <div className="corner top-left">02</div>
          <div className="corner top-right">04</div>
          <div className="corner bottom-left title1">Coffee Stop</div>
          <div className="corner bottom-right title2">Starbucks Corner</div>
        </div>
        <div 
          className="content"
          ref={(el) => { contentRefs.current[2] = el }}
        >
          <div className="corner top-left">03</div>
          <div className="corner top-right">04</div>
          <div className="corner bottom-left title1">Wine Selection</div>
          <div className="corner bottom-right title2">Bottle Choice</div>
        </div>
        <div 
          className="content"
          ref={(el) => { contentRefs.current[3] = el }}
        >
          <div className="corner top-left">04</div>
          <div className="corner top-right">04</div>
          <div className="corner bottom-left title1">Book Bazaar</div>
          <div className="corner bottom-right title2">Stacked Stories</div>
        </div>
        <div 
          className="content"
          ref={(el) => { contentRefs.current[4] = el }}
        >
          <div className="corner top-left">01</div>
          <div className="corner top-right">04</div>
          <div className="corner bottom-left title1">Beach Bliss</div>
          <div className="corner bottom-right title2">Watermelon Smile</div>
        </div>

        <div className="asset">
          <div 
            className="img"
            ref={(el) => { assetRefs.current[0] = el }}
          >
            <img src="/women-2.jpg" alt="logo" />
          </div>
          <div 
            className="img"
            ref={(el) => { assetRefs.current[1] = el }}
          >
            <img src="/coffee-2.jpg" alt="logo" />
          </div>
          <div 
            className="img"
            ref={(el) => { assetRefs.current[2] = el }}
          >
            <img src="/wine-2.jpg" alt="logo" />
          </div>
          <div 
            className="img"
            ref={(el) => { assetRefs.current[3] = el }}
          >
            <img src="/book-2.jpg" alt="logo" />
          </div>
          <div 
            className="img"
            ref={(el) => { assetRefs.current[4] = el }}
          >
            <img src="/women-2.jpg" alt="logo" />
          </div>
        </div>
      </div>
    </ReactLenis>
  )
}

export default App
