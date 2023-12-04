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
        console.log(email, token);
        // Make an API call to your backend to verify the token
        const res = await emailVerification({ email: email, token: token });
        // Update state or handle the response as needed
        setLoading(false); // Set loading to false when the verification is complete
        // Update message state based on the verification status
        setMessage('Verification successful');
      } catch (error) {
        setLoading(false); // Set loading to false in case of an error
        // Handle error and update message state accordingly
        setMessage('Verification failed');
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
              <p>Verification failed. Please try again or contact support.</p>
              {/* Additional content for failed verification */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
