// src/pages/Home.js
import './Home.css';
import Navbar from '../components/Navbar';
import UpcomingEvents from '../components/UpcomingEvents';
import EventCard from '../components/EventCard';
import FeaturedEvents from '../components/FeaturedEvents'; // Newly added
import AllEvents from '../components/AllEvents';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <UpcomingEvents />

      {/* NEW Featured Events Section from Screenshot */}
      <FeaturedEvents />

      {/* All Events */}
      <AllEvents />

    </div>
  );
};

export default Home;
