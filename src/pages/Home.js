// src/pages/Home.js
import './Home.css';
import Navbar from '../components/Navbar';
import UpcomingEvents from '../components/UpcomingEvents';
import EventCard from '../components/EventCard';
import FeaturedEvents from '../components/FeaturedEvents'; // Newly added

import ExploreSection from "../components/ExploreSection";
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <UpcomingEvents />
      <FeaturedEvents />
      <ExploreSection />
      

      




    </div>
  );
};

export default Home;
