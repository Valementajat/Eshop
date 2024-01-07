import React from 'react';
import { Container, Divider, Link } from '@mui/material';
import "../css/style.css";

const UFooter = () => {
  return (
    <div className='bottom'>
      <Divider className='hrline' />
      <Container>
        <section className='sticky'>
          <div className='bottomleft'>
            <Link href="#" className="text-reset">
              About us
            </Link>
            <Link href="/login" className="text-reset">
              Contacts
            </Link>
            <Link href="#" className="text-reset">
              ASD
            </Link>
            <Link href="#" className="text-reset">
              ADS
            </Link>
            <Link href="#" className="text-reset">
              ASD
            </Link>
            <Link href="#" className="text-reset">
              ASD
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default UFooter;
