import "./UpcomingEvents.css";

const UpcomingEvents = () => {
  return (
    <div className="upcoming-container">
      <video autoPlay loop muted playsInline>
        <source
          src="https://res.cloudinary.com/drcxko8nl/video/upload/v1771023138/upcoming_wl51x1.mp4"
          type="video/mp4"
        />
      </video>

      <div className="overlay-text">
        <h1>Welcome To MUJ Events</h1>
        <p>Don't miss out on the college festivals and parties!</p>
      </div>
    </div>
  );
};

export default UpcomingEvents;
