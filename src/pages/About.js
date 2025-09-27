import React from "react";
import { Container } from "react-bootstrap";

const About = () => {
  return (
    <Container className="mt-5">
      <h1>About Us</h1>
      <p>
        Welcome to the <strong>Food Donation App</strong>! Our mission is to
        reduce food waste and help those in need by connecting donors and
        receivers. Donors can share surplus food, and receivers can easily
        request and collect food.
      </p>
      <p>
        In urban cities, food wastage is a major problem, while many people
        still struggle with hunger. This app aims to connect people or
        restaurants with excess food to those in need, ensuring food is donated
        instead of wasted. The app provides a platform for donors and receivers
        to easily communicate and arrange food donations.
      </p>
      <p>
        <strong>Objectives:</strong>
        <p>Reduce Food Waste – Help restaurants, cafes,
        and households donate excess food instead of throwing it away. Support
        Needy People – Provide easy access to food for underprivileged or
        homeless people in urban areas. Create Awareness – Educate urban
        citizens about food wastage and encourage food donation. Efficient
        Distribution – Use app-based logistics to ensure donated food reaches
        the right people in time.</p>
      </p>
      <p>
        Together, we can make a difference in the fight against hunger and food
        wastage. Thank you for being part of this initiative!
      </p>
    </Container>
  );
};

export default About;
