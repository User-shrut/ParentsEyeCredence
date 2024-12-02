import React, { useState } from 'react';

const HelpSupp = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState("");

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle message sending logic
    console.log("Email:", email);
    console.log("Message:", message);
    console.log("Chat:", chat);
  };

  return (
    <div className="help-support-container">
      <div className="form-container">
        <div className="card animate-fade-in">
          <h1 className="title">Help and Support</h1>
          <p className="description">
            We're here to assist you! Please reach out to us using the form below:
          </p>

          {/* Contact Form */}
          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="input-field animate-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Message input */}
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                rows="4"
                className="input-field animate-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message"
                required
              />
            </div>

            <button type="submit" className="submit-btn animate-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Contact Details */}
      <div className="contact-details animate-fade-in">
        <h4>Contact Us</h4>
        <p>Email: credeancetracker@mail.com</p>
        <p>Phone: +91-9087654321</p>
        <p>Address: Krida chowk nagpur.</p>
      </div>

      {/* Inline CSS for styles */}
      <style jsx>{`
        .help-support-container {
          font-family: 'Arial', sans-serif;
          background-color: #f7f7f7;
          padding: 50px 20px;
          max-width: 2000px;
          margin: 0 auto;
          border-radius: 8px;
        }

        .form-container {
          margin-bottom: 40px;
        }

        .card {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
          opacity: 0;
        }

        .card.animate-fade-in {
          animation: fadeIn 1s forwards;
        }

        /* Simple Hover Effect on Card */
        .card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .title {
          font-size: 2.5em;
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }

        .description {
          text-align: center;
          color: #777;
          margin-bottom: 40px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          font-weight: bold;
          display: block;
          margin-bottom: 8px;
          color: #333;
        }

        .input-field {
          width: 100%;
          padding: 12px;
          font-size: 1em;
          border-radius: 6px;
          border: 1px solid #ccc;
          box-sizing: border-box;
          transition: border 0.3s ease;
          opacity: 0;
        }

        .input-field.animate-input {
          animation: fadeInUp 0.6s forwards;
        }

        .input-field:focus {
          border-color: #007bff;
          outline: none;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background-color: #007bff;
          color: white;
          font-size: 1.1em;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        /* Simple Hover Effect on Submit Button */
        .submit-btn:hover {
          background-color: #0056b3;
          transform: scale(1.05);
        }

        .contact-details {
          text-align: center;
          margin-top: 40px;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          opacity: 0;
        }

        .contact-details.animate-fade-in {
          animation: fadeIn 1.2s forwards;
        }

        /* Simple Hover Effect on Contact Info */
        .contact-details:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .contact-details h4 {
          margin-bottom: 20px;
          color: #333;
        }

        .contact-details p {
          font-size: 1.1em;
          color: #555;
          margin: 5px 0;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HelpSupp;
