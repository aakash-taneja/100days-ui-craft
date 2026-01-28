import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section className="hero">
        <div className="hero-img">
          <img src="./hero.webp" alt="hero" />
        </div>

        <div className="hero-header">
          <h1>Welcome to our website</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </div>

        <canvas className="hero-canvas"></canvas>


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
    </>
  )
}

export default App
