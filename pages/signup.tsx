"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import '../src/app/globals.css';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        router.push('/login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="John"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-pink-500 text-white py-2 rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600'
            }`}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
