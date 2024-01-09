import React, { Component } from "react";
import { Typography, Divider, Box } from "@mui/material";

class ContactForm extends Component {
  render() {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="30vh"
      >
        <div>
          <Typography variant="h5" gutterBottom>
            Contact Coffee2Go
          </Typography>
          <Typography variant="body1">
            Address: 123 Coffee Street, Alcoy, Spain
          </Typography>
          <Typography variant="body1">Phone: +34 123 456 789</Typography>
          <Typography variant="body1">Email: info@coffee2go.com</Typography>
          <Divider style={{ margin: "20px 0" }} />
          {/* Add more Material-UI components or sections as needed */}
        </div>
      </Box>
    );
  }
}

export default ContactForm;
