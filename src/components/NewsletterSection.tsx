"use client";

import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with email: ${email}`);
      setEmail("");
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <section className="newsletter-section bg-gray-50 py-14 text-center">
      <h2 className="text-3xl font-bold">Stay Updated</h2>
      <p className="text-gray-600 mt-4">Subscribe to our newsletter for exclusive deals</p>
      
      {/* Subscription Form */}
      <form onSubmit={handleSubmit} className="mt-6 flex justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="p-4 rounded-l-lg w-80 focus:outline-none border border-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-4 rounded-r-lg bg-pink-500 text-white font-semibold hover:bg-pink-600"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default NewsletterSection;
