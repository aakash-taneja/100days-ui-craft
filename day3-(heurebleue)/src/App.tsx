
import "./index.css";

export function App() {
  return (
    <>
      <section className="sticky">
        <div className="gallery-wrapper">
          <div className="col side-1">
            <div className="img">
              <img src="/img1.jpg" alt="img" />
            </div>
            <div className="img">
              <img src="/img2.jpg" alt="img" />
            </div>
            <div className="img">
              <img src="/img3.jpg" alt="img" />
            </div>
          </div>
          <div className="col side-2">
            <div className="img">
              <img src="/img4.jpg" alt="img" />
            </div>
            <div className="img">
              <img src="/img5.jpg" alt="img" />
            </div>
            <div className="img">
              <img src="/img6.jpg" alt="img" />
            </div>
          </div>
          <div className="col main">
          <div className="img">
              <img src="/img7.jpg" alt="img" />
            </div>
            <div className="img main">
              <img src="/img8.jpg" alt="img" />
            </div>
            <div className="img">
              <img src="/img9.jpg" alt="img" />
            </div>
          </div>
          <div className="col side-3">
          <div className="img">
              <img src="/img10.jpg" alt="img" />
            </div>
            <div className="img">
              <img src="/img11.jpg" alt="img" />
            </div>
            <div className="img">
              <img src="/img12.jpg" alt="img" />
            </div>
          </div>
          <div className="col side-4">
            <div className="img">
              <img src="/img1.jpg" alt="img" />
            </div>
            <div className="img">
              <img src="/img2.jpg" alt="img" />
            </div>
            <div className="img">
              <img src="/img3.jpg" alt="img" />
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <section className="hero">
          <div className="hero-img">
            <img src="/hero.jpg" alt="img" />
          </div>
          <div className="header">
            <h1>serene</h1>
            <h1>drift</h1>
          </div>
        </section>
        <section className="intro">
          <div className="tagline">
            <p>Inspired visual for creators of calm and beauty</p>
          </div>
          <div className="divider"></div>
          <div className="intro-header">
            <h1>elevating</h1>
            <h1>serenity</h1>
          </div>
        </section>
        <section className="ws"></section>
        <section className="outro">
          <h1>crafted calm</h1>
          <h1>and beauty</h1>
        </section>
        <section className="footer">
          <div className="footer-bg">
            <img src="/footer.jpg" alt="footer" />
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
