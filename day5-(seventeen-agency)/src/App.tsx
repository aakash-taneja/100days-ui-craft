import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const formatTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata'
      }
      return now.toLocaleTimeString('en-IN', options) + ' IST'
    }

    setCurrentTime(formatTime())
    const interval = setInterval(() => {
      setCurrentTime(formatTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <section className="contact-visual">
        <div className="contact-icon">
          <img src="./vite.svg" alt="contact icon" />
        </div>
      </section>
      <section className="contact-info">
        <div className="contact-info-row">
          <p>Address</p>
          <p>
            Rajapark
            Jaipur
            Rajasthan
            India</p>
        </div>
        <div className="contact-info-row">
          <p>Current Time</p>
          <p>{currentTime}</p>
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
          <p>Freelancer & Collaborator Enquiries</p>
          <p>thekaikrypto@gmail.com</p>
        </div>
        <div className="contact-info-row">
          <p>Github</p>
          <p>https://github.com/aakash-taneja</p>
        </div>
        <div className="contact-info-row">
          <p>LinkedIn</p>
          <p>https://www.linkedin.com/in/aakash-taneja/</p>
        </div>
      </section>
    </>
  )
}

export default App
