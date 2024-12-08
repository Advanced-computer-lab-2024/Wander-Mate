import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const TourismGovernerFooter = () => {
  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // Ensures the body spans the full height
    margin: "0",
  };

  const mainStyles = {
    flex: 1, // Pushes the footer to the bottom if the content is small
  };

  const footerStyles = {
    backgroundColor: "#1a202c", // Tailwind's bg-gray-800 equivalent
    color: "white",
    padding: "2rem 1rem", // Tailwind's py-8 and px-4
  };

  const linkStyles = {
    color: "#a0aec0", // Tailwind's text-gray-400 equivalent
    textDecoration: "none",
  };

  const hoverLinkStyles = {
    color: "white",
  };

  const iconStyles = {
    color: "#a0aec0",
    fontSize: "1.5rem",
  };

  return (
    <div style={containerStyles}>
      {/* Main content */}
      <main style={mainStyles}>
        {/* Replace this with your actual page content */}
      </main>

      {/* Footer */}
      <footer style={footerStyles}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start", // Align items to the top of their container
            flexWrap: "wrap",
            gap: "1rem", // Adds space between columns
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
              About WanderMate
            </h3>
            <p>Your Traveling Best Mate</p>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
              Quick Links
            </h3>
            <ul style={{ listStyleType: "none", padding: "0" }}>
              <li>
                <Link
                  to="/contact"
                  style={linkStyles}
                  onMouseOver={(e) =>
                    (e.target.style.color = hoverLinkStyles.color)
                  }
                  onMouseOut={(e) => (e.target.style.color = linkStyles.color)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  style={linkStyles}
                  onMouseOver={(e) =>
                    (e.target.style.color = hoverLinkStyles.color)
                  }
                  onMouseOut={(e) => (e.target.style.color = linkStyles.color)}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
              Connect With Us
            </h3>
            <div style={{ display: "flex", gap: "1rem" }}>
              <a
                href="https://www.facebook.com/profile.php?id=61570101207724&mibextid=LQQJ4d&mibextid=LQQJ4d"
                style={iconStyles}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="mdi:facebook" />
              </a>
              <a
                href="https://www.instagram.com/wander__mate?igsh=a2UxNWFiYXcxZWw2"
                style={iconStyles}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="mdi:instagram" />
              </a>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute", // This positions the element relative to its nearest positioned ancestor

            left: "50%",
            transform: "translateX(-40%)", // Centers it horizontally
            textAlign: "center",
          }}
        >
          <p>&copy; 2024 WanderMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TourismGovernerFooter;
