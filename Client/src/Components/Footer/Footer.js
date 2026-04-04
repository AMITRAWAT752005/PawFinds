import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.png";

const Footer = (props) => {
  return (
    <footer className="footer">
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={logo} alt="PawFinds Logo" />
          <p>{props.title}</p>
        </Link>
      </div>
      <div className="below-footer">
        <p>
          You can reach me at{" "}
          <a className="mail-links" href="mailto:amitrawat5@gmail.com">
            amitrawat5@gmail.com
          </a>
        </p>
        <p>
          <a
            className="contact-links"
            href="https://linkedin.com/in/amitrawat"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="#"></i> Linkedin
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a
            className="contact-links"
            href="https://github.com/amitrawat"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="#"></i> GitHub
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a
            className="contact-links"
            href="https://instagram.com/amit_07"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="#"></i> Instagram
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a
            className="contact-links"
            href="https://wa.me/923019583959"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="#"></i> WhatsApp
          </a>
        </p>
        <p>&copy; 2025 Amit Rawat</p>
      </div>
    </footer>
  );
};

export default Footer;
