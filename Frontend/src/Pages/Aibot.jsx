import React from 'react'
import Header from '../components/AiBot/Header'
import Chat from '../components/AiBot/Chat'
import Testimonial from '../components/AiBot/Testimonials'
import Footer from '../components/Navbar/Footer'
import MedicalAIChat from '../components/aifeatures/medicalai'
const Aibot = () => {
  return (
    <div>
        


<Header/>
<MedicalAIChat/>
<Testimonial/>
<Footer/>

    </div>
  )
}

export default Aibot