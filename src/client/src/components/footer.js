import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Divider, Container, AppBar, Toolbar } from '@mui/material';
import '../css/style.css';

const Ufooter = () => {
  return (
    <AppBar position="static" color="default" className="footer">
      <Toolbar>
        <Container>
          <Typography variant="body1" className="bottomleft">
            <Link to="/About" className="me-4 text-reset">
              About us
            </Link>
            <Link to="/Contacts" className="me-4 text-reset">
              Contacts
            </Link>
          </Typography>
          <Divider />
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Ufooter;
