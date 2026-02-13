// src/components/Calendar.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';

const events = {
  '2025-08-01': 'Music Fest',
  '2025-08-05': 'Tech Talk',
  '2025-08-12': 'Dance Battle',
};

function EventCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const formatDate = date =>
    date.toISOString().split('T')[0]; // format to yyyy-mm-dd

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={({ date }) =>
          events[formatDate(date)] ? 'highlight' : null
        }
      />
      {selectedDate && events[formatDate(selectedDate)] && (
        <div className="event-details">
          <h3>Event on {selectedDate.toDateString()}</h3>
          <p>{events[formatDate(selectedDate)]}</p>
        </div>
      )}
    </div>
  );
}

export default EventCalendar;
