import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Clubs.css';

const clubs = [
  // 💻 Technical Clubs
  {
    name: 'IEEE Student Branch',
    tags: '#antenna #research',
    description: 'IEEE APS deals with antenna and propagation research.',
    category: 'Technical',
  },
  {
    name: 'ACM MUJ Student Chapter',
    tags: '#coding #developer',
    description: 'Promotes computing and technical excellence.',
    category: 'Technical',
  },
  {
    name: 'Cyber Space',
    tags: '#cybersecurity #ethicalhacking',
    description: 'Focuses on cybersecurity and ethical hacking.',
    category: 'Technical',
  },
  {
    name: 'IEEE MTTS Student Chapter',
    tags: '#microwave #theory',
    description: 'Focuses on microwave theory and technology.',
    category: 'Technical',
  },
  {
    name: 'IEEE MUJ Women in Engineering',
    tags: '#womenintech #empowerment',
    description: 'A student-led technical community.',
    category: 'Technical',
  },
  {
    name: 'LearnIT',
    tags: '#coding #development',
    description: 'Dedicated to software development and coding.',
    category: 'Technical',
  },
  {
    name: 'Turing Sapiens',
    tags: '#ai #ml',
    description: 'Focuses on AI, ML, and problem-solving.',
    category: 'Technical',
  },
  {
    name: 'ANOVA',
    tags: '#data #analytics',
    description: 'Data science and analytics club.',
    category: 'Technical',
  },
  {
    name: 'AIML Community',
    tags: '#ai #ml',
    description: 'Community dedicated to AI and machine learning.',
    category: 'Technical',
  },
  {
    name: 'Cosmos - The Science Club',
    tags: '#science #projects',
    description: 'Exploring science through hands-on projects.',
    category: 'Technical',
  },
  {
    name: 'IEEE RAS',
    tags: '#robotics #automation',
    description: 'For robotics enthusiasts.',
    category: 'Technical',
  },
  {
    name: 'Google Developer Student Clubs',
    tags: '#google #development',
    description: 'Fosters developer skills and innovation.',
    category: 'Technical',
  },

  // 🎭 Non-Technical Clubs
  {
    name: 'Aperture',
    tags: '#photography #cinematography',
    description: 'Photography and cinematography club of MUJ.',
    category: 'Non-Technical',
  },
  {
    name: 'Cactus - Socio Cultural',
    tags: '#cultural #socialevents',
    description: 'Fosters cultural and social creativity.',
    category: 'Non-Technical',
  },
  {
    name: 'Finance Club',
    tags: '#investment #stockmarkets',
    description: 'Explore finance, investing, and economics.',
    category: 'Non-Technical',
  },
  {
    name: 'Litmus - Cultural',
    tags: '#literature #poetry',
    description: 'Promotes literature, poetry, and expression.',
    category: 'Non-Technical',
  },
  {
    name: 'Coreografia',
    tags: '#dance #cultural',
    description: 'Official dance club of MUJ.',
    category: 'Non-Technical',
  },
  {
    name: 'Humans of Manipal Jaipur',
    tags: '#inspiringstories #community',
    description: 'Sharing inspiring stories of MUJ.',
    category: 'Non-Technical',
  },
  {
    name: 'Olympism',
    tags: '#sportsmanship #olympics',
    description: 'Promotes sportsmanship and Olympic spirit.',
    category: 'Non-Technical',
  },
  {
    name: 'The Music Club',
    tags: '#music #musicians',
    description: 'For passionate singers and instrumentalists.',
    category: 'Non-Technical',
  },
  {
    name: 'Yes!+ Student Chapter',
    tags: '#mindfulness #personalgrowth',
    description: 'Promotes mindfulness and personal growth.',
    category: 'Non-Technical',
  },
  {
    name: 'Cinefilia',
    tags: '#theater #filmmaking',
    description: 'Dramatics and filmmaking society.',
    category: 'Non-Technical',
  },
  {
    name: 'Glitch!',
    tags: '#art #technology',
    description: 'Blending creativity, art and tech.',
    category: 'Non-Technical',
  },
  {
    name: 'Abhigya',
    tags: '#knowledge #debates',
    description: 'Encourages knowledge-sharing and debate.',
    category: 'Non-Technical',
  },
  {
    name: 'Alternative Dispute Resolution Cell',
    tags: '#law #disputeresolution',
    description: 'For legal discussions and conflict resolution.',
    category: 'Non-Technical',
  }
];

const Clubs = () => {
  const [filter, setFilter] = useState('All');

  const filteredClubs =
    filter === 'All' ? clubs : clubs.filter((club) => club.category === filter);

  return (
    <div className="clubs-page">
      {/* ✅ Banner */}
      <div className="clubs-banner">
        <img src="/images/banner/clubs-banner.jpg" alt="Clubs Banner" />
      </div>

      {/* ✅ Heading and Subheading */}
      <h2 className="clubs-title">MUJ Clubs</h2>
      <p className="clubs-subtitle">
        Explore the various student clubs at Manipal University Jaipur!
      </p>

      {/* ✅ Filter Buttons */}
      <div className="filter-buttons">
        <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>
          All Clubs
        </button>
        <button
          className={filter === 'Technical' ? 'active' : ''}
          onClick={() => setFilter('Technical')}
        >
          Technical Clubs
        </button>
        <button
          className={filter === 'Non-Technical' ? 'active' : ''}
          onClick={() => setFilter('Non-Technical')}
        >
          Non-Technical Clubs
        </button>
      </div>

      {/* ✅ Clubs Grid */}
      <div className="clubs-grid">
        {filteredClubs.map((club, index) => (
          <div className="club-card" key={index}>
            <h3>{club.name}</h3>
            <p className="club-tags">{club.tags}</p>
            <p className="club-description">{club.description}</p>
            <Link to="/join-community">
  <button className="club-join-btn">Join Club Now</button>
</Link>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Clubs;