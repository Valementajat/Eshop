// fotter 
import React from 'react';
import { Link } from "react-router-dom";
import '../css/style.css';
import ContactForm from '../components/Contacts';

    const Ufooter = () => {
  return (
    <div class = 'bottom'><hr class='hrline'/>
    
      <section class='sticky' >
      
        <div class='bottomleft'>
        <Link to="/About">
          <a href='' className='me-4 text-reset'>
            About us
          </a></Link>
          <Link to="../compnents/Contacts">
          <a href='' className='me-4 text-reset'>
           contacts 
          </a></Link>
          <a href='' className='me-4 text-reset'>
          ASD
          </a>
          <a href='' className='me-4 text-reset'>
ADS
          </a>
          <a href='' className='me-4 text-reset'>
           ASD
          </a>
        
          <a href='' className='me-4 text-reset'>
            ASD
          </a>
        </div>
    
      </section>
</div>
  );
}

export default  Ufooter;