import React from "react";

const Menu: React.FC = () => {
  const handleMapClick = () => {
    // Add your logic for handling the "Map" button click here
    console.log("Map button clicked");
  };

  const handleAboutUsClick = () => {
    // Add your logic for handling the "About Us" button click here
    console.log("About Us button clicked");
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={handleMapClick}>
        Map
      </button>
      <button style={styles.button} onClick={handleAboutUsClick}>
        About Us
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  button: {
    margin: "0 10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#6200ea",
    color: "#fff",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#3700b3",
  },
};

export default Menu;
