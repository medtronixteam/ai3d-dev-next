import React from "react";
import "./cards.css";

const Cards = ({ position }) => {
  const cardsData = [
    {
      icon: "V",
      name: "Victoria Akyea",
      country: "USA",
      text: "It’s been a pleasure working and collaborating with Arslan and the AI 3D Scanning team! They are an amazingly innovative team that eagerly tackle even complex projects in any sector with ease. ",
      variant: "left-top",
    },
    {
      icon: "G",
      name: "Ganeshkumar",
      country: "Singapore",
      text: "Really an awesome person to work with, fast replies , quality work and hardworking",
      variant: "left-bottom",
    },
    {
      icon: "S",
      name: "Shakesfuture",
      country: "United States",
      text: "5 stars all around great guy to work with will work with again",
      variant: "right-top",
    },
    {
      icon: "Z",
      name: "Zheyu X",
      country: "Australia",
      text: "Ahmad and his team are very hard workers producing for me excellent results. I can always run ideas past Ahmad to see if they can be done. Most times they can be done. He is very proffessional and i will be using many many more times. ",
      variant: "right-bottom",
    },
  ];

  const topCards = [cardsData[0], cardsData[2]];
  const bottomCards = [cardsData[1], cardsData[3]]
  const selectedCards = position === "top" ? topCards : bottomCards

  return (
    <div className="cards-wrapper-service">
      {selectedCards.map((card, index) => (
        <div key={index} className={`card-container-service ${card.variant}`}>
          <span className="card-icon-service">{card.icon}</span>
          <div className="card-content-service">
            <h1>
              {card.name} <span className="country">{card.country}</span>
            </h1>
            <p>{card.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
