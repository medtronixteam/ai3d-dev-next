import React, { useState, useEffect } from 'react';
import CustomNavbar from './CustomNavbar/CustomNavbar';
import './Home.css';
import Video from './Video/Video';
import Chatbox from './ChatBox/ChatBox';
import CardSection from './section2/CardSection';
import B2B from './section4/B2B';
import Image3D from './section7/Image3D';
import B2c from './section3/B2c';
// import B2B from './section4/B2B';
import LogoSlider from './LogoSlider/LogoSlider';
import Card from './section5/Card';
import Business3D from './section6/Business3D';
import ExecutiveTeam from './ExecutiveTeam/ExecutiveTeam';
import CardSlider from './Team/CardSlider';
import RoadMap from './Roadmap/RoadMap';
import Footer from './section9/Footer';
import CustomLoader from '../../components/loader/CustomLoader';

const Home = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate 1s load
    return () => clearTimeout(timer);
  }, []);
  if (loading) return <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center'}}><CustomLoader /></div>;
  return (
    <>
      <CustomNavbar />
      <Chatbox />
      {/* <Banner /> */}
      <Video />
      <CardSection />
      <B2B />
      <Image3D />
      <B2c />
      <LogoSlider />
      <Card />
      {/* <AiModal /> */}
      <Business3D/>
      <ExecutiveTeam />
      <CardSlider />
      <RoadMap />
      <Footer />
    </>
  );
};

export default Home; 