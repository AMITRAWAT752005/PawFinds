import React from "react";
import developerPng from "./images/developer-png.png";

const Contact = () => {
  return (
    <div className="contactUs-main-container">
      <div className="contactUs-left-para">
        <h3>Let's get in touch</h3>
        <i class="fa fa-envelope"></i>
        <a class="mail-links" href="mailto:amitrawat5@gmail.com">
          amitrawat5@gmail.com
        </a>

        <i class="fa fa-linkedin"></i>
        <a class="mail-links" href="https://linkedin.com/in/amitrawat">
          User Name: amitrawat
        </a>

        <i class="fa fa-github"></i>
        <a class="mail-links" href="https://github.com/amitrawat">
          amitrawat
        </a>

        <i class="fa fa-instagram"></i>
        <a class="mail-links" href="https://instagram.com/amit_07">
          @amit_07
        </a>

        <i class="fa fa-phone"></i>
        <a class="mail-links" href="tel:+923019583959">
          +92 301 9583959
        </a>
      </div>
      <div className="contactUs-pic">
        <img src={developerPng} alt="Profile"/>
      </div>
    </div>
  );
};

export default Contact;
