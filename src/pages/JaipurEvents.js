import React from "react";
import "./JaipurEvents.css";
import culturalfestImg from '../assets/images 2/culturalfest.jpg';
import musicfestImg from '../assets/images 2/musicfest.jpg';
import heritagewalkImg from '../assets/images 2/heritagewalk.jpg';
import lightsoundImg from '../assets/images 2/lightsound.jpg';
import handicraftsImg from '../assets/images 2/handicrafts.jpg';
import chokhidhaaniImg from '../assets/images 2/chokhidhaani.jpg';
import vintagerallyImg from '../assets/images 2/vintagerally.jpg';
import scienceexpoImg from '../assets/images 2/scienceexpo.jpg';
import foodfiestaImg from '../assets/images 2/foodfiesta.jpg';


const JaipurEvents = () => {
  const events = [
    {
      title: "Jaipur Literature Fest",
      description: "A grand celebration of literature and ideas.",
      location: "Diggi Palace, Jaipur",
      image: culturalfestImg,
    },
    {
      title: "Jaipur Music Festival",
      description: "Live music under the stars.",
      location: "Albert Hall Museum",
      image: musicfestImg,
    },
    {
      title: "Heritage Walk",
      description: "Guided walking tour of the Pink City.",
      location: "Hawa Mahal to City Palace",
      image: heritagewalkImg,
    },
    {
      title: "Light & Sound Show",
      description: "History comes alive at Amer Fort.",
      location: "Amer Fort",
      image: lightsoundImg,
    },
    {
      title: "Handicrafts Bazaar",
      description: "Explore local artisans and crafts.",
      location: "Jawahar Kala Kendra",
      image: handicraftsImg,
    },
    {
      title: "Cultural Evening",
      description: "Folk music, dance, and regional food.",
      location: "Chokhi Dhani",
      image: chokhidhaaniImg,
    },
    {
      title: "Vintage Car Rally",
      description: "A parade of heritage automobiles.",
      location: "JLN Marg",
      image: vintagerallyImg,
    },
    {
      title: "Science Expo",
      description: "For young minds and curious souls.",
      location: "Birla Auditorium",
      image: scienceexpoImg,
    },
    {
      title: "Food Fiesta",
      description: "A non-seafood paradise for all ages.",
      location: "Jawahar Circle",
      image: foodfiestaImg,
    },
  ];
  

  return (
    <div className="jaipur-events">
      {/* Banner Image */}
      <div className="banner-container">
        <img
          src="/images/banner/jaipur-banner.jpg"
          alt="Jaipur Banner"
          className="jaipur-banner"
        />
      </div>
  
      {/* Section Title */}
      <h2 className="section-title">Events in Jaipur</h2>
  
      {/* Event Cards */}
      <div className="event-card-container">
        {events.map((event, index) => (
          <div className="event-card" key={index}>
            <img src={event.image} alt={event.title} className="event-image" />
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p className="location">{event.location}</p>
            <button className="book-now-btn">Book Now</button>
          </div>
        ))}
   
        {/* Map Section */}
{/* Map Section */}
<div className="map-container">
  <iframe
    title="Jaipur Map"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.492257145577!2d75.8069117753573!3d26.91309157667482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db304f6f1ed65%3A0x9dbbb3c7c33a5291!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
    width="100%"
    height="400"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>


      </div>
    </div>
  );
};

export default JaipurEvents;
