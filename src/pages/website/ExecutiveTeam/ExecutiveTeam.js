import React from "react";
import "./ExecutiveTeam.css";
import Mrjoel from "../../../assets/images/Mr_joel.png";
import Ceo from "../../../assets/images/Ceo.png";
import { AiFillLinkedin } from "react-icons/ai";

const ExecutiveTeam = () => {
  const teamMembers = [
    {
      name: "Arslan Ahmed",
      position: "CEO",
      image: Ceo,
      linkedin: "https://www.linkedin.com/in/arslan-ahmad-4b123a1b5/", 
    },
    {
      name: "Dr Joel Hillier",
      position: "US Advisor & Partner",
      image: Mrjoel,
      linkedin: "https://www.linkedin.com/in/joelhillier",
    },
  ];

  return (
    <div className="container executive-team-section" id="team">
      <span className="sub-heading">Our Leadership</span>
      <h2 className="section-title">Meet Our Executive Team</h2>
      <div className="team-members">
        {teamMembers.slice(0, 3).map((member, index) => (
          <div className="team-card" key={index}>
            <div className="image-container">
              <img
                src={member.image}
                alt={member.name}
                className="team-image"
                loading="lazy"
              />
            </div>
            <h3 className="team-name">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                {member.name} <AiFillLinkedin id="linkedin-icon"/>
              </a>
            </h3>
            <p className="team-position">{member.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutiveTeam;
