import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VerifyEmail as emailVerification } from '../api/Api';

const VerifyEmail = () => {
  const [message, setMessage] = useState(''); // Message to display based on verification status
  const [loading, setLoading] = useState(true); // Flag to indicate loading state
  const { email, token } = useParams(); // Retrieve 'email' and 'token' parameters from the URL

  useEffect(() => {
    const verifyToken = async () => {
      try {
       
        // Make an API call to your backend to verify the token
        const res = await emailVerification(email, token);
        // Update state or handle the response as needed
        setLoading(false); // Set loading to false when the verification is complete
        // Update message state based on the verification status received from the backend
        setMessage(res.data.message); // Assuming the response contains a 'message' field
      } catch (error) {
      
        setLoading(false); // Set loading to false in case of an error
        if (error.response) {
          // The request was made and the server responded with a status code
          if (error.response.status === 401) {
            setMessage('Account already activated');
          } else if (error.response.status === 402) {
            setMessage('Invalid verification details');
          } else {
            setMessage('Error verifying email');
          } 
        } else {
          // Something happened in setting up the request that triggered an error
          setMessage('An error occurred while processing the request');
        }
      }
    };

    verifyToken();
  }, [email, token]);

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {message === 'Verification successful' ? (
            <>
              <p>Verification successful! Your account is now activated.</p>
              {/* Additional content for successful verification */}
            </>
          ) : (
            <>
              <p>{message}</p>
              {/* Additional content for other verification states */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
