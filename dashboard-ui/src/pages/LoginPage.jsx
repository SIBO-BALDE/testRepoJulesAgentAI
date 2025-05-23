// src/pages/LoginPage.jsx
import React, { useState } from 'react';
// import apiClient from '../services/api'; // No longer directly needed
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService'; // Use the authService
import { setAuthToken } from '../utils/jwt'; // Still used for MOCK response, ideally authService handles this

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use the actual hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // The actual call to authService.login would be:
      // await login({ email, password }); 
      // authService.login is expected to handle setAuthToken on success.
      // For now, we'll simulate the API call and token handling as per the example
      // to ensure the UI flow works without a live backend.
      
      console.log('LoginPage: Simulating login call with', { email, password });
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // MOCK_SUCCESS_RESPONSE as per example, simulating what backend might return
      // and what authService.login would process.
      const MOCK_SUCCESS_RESPONSE = { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsIm5hbWUiOiJUZXN0IFVzZXIiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MzUxNjIzOTAyMn0.dummyTokenForUITesting" };
      
      // Simulate what authService.login would do: call API, get token, set token.
      // Here, we are bypassing the actual authService.login call for the mock.
      // If we were calling `await login({ email, password });` and it was not mocked internally,
      // then it would make the actual API call.
      setAuthToken(MOCK_SUCCESS_RESPONSE.token); // Manually set token from mock response
      
      console.log('Login successful, navigating to dashboard.');
      navigate('/dashboard');

    } catch (err) {
      console.error('Login failed:', err);
      // err.message could come from authService re-throw if an actual API call failed
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-700">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
