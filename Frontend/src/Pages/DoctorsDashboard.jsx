import React from 'react'
import DashHeader from '../components/DoctorDashboard/DashHeader'
import CardsCollection from '../components/DoctorDashboard/CardsCollection'
import Footer from '../components/Navbar/Footer'
import HeroSection from '../components/DoctorDashboard/HeroSection'
const DoctorsDashboard = () => {
  return (
    <div>
        


        <DashHeader/>
        <CardsCollection/>
        <HeroSection/>
        <Footer/>
    </div>
  )
}

export default DoctorsDashboard