import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section
        className="h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
        }}
      >
        <div className="bg-black/50 p-10 rounded-xl text-center text-white">
          <h1 className="text-5xl font-bold mb-4">CAG</h1>
          <p className="mb-6 text-lg">
            Jelajahi gunung impianmu dengan mudah
          </p>

          <Link
            to="/gunung"
            className="bg-green-600 px-6 py-3 rounded-lg"
          >
            Jelajahi Gunung
          </Link>
        </div>
      </section>
    </div>
  );
}