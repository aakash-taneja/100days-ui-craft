
import './App.css'

function App() {
  return (
    <>
      <section className="hero">
        <div className="sky-container">
          <img src="./sky.webp" alt="" />
        </div>
        <div className="hero-copy">
          <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut blanditiis nihil eaque earum officiis dolorem neque quis? Dolorum, ut atque sequi cumque enim dolorem dignissimos adipisci facere eos magnam libero, distinctio suscipit a. Autem repellendus dolor non facere corporis obcaecati incidunt nihil, dolorem doloribus eum explicabo magni enim accusantium velit! </h1>
        </div>

        <div className="window-container">
          <img src="./window.webp" alt="" />
        </div>

        <div className="hero-header">
          <div className="col">
            <h1>An aperture <br /> into stillness</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi earum, repellat aliquam itaque asperiores aperiam neque est provident consectetur odio ad voluptatum reiciendis qui dignissimos.</p>
          </div>
          <div className="col">
            <p>Lorem ipsum</p>
            <h1>An aperture <br /> into stillness</h1>
          </div>
        </div>
      </section>
      <section className="outro">
        <h1>end of view</h1>
      </section>
    </>
  )
}

export default App
