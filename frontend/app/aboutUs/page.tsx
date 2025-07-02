"use client";
import React from "react";
import Logo from "@/components/logo";
import Navigationbar from "@/components/navbar";
import { Calendar,Star,Handshake,Check } from "lucide-react"

const team = [
  {
    name: "Matthew Khoo",
    role: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Ei Chaw",
    role: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Ethan",
    role: "Backend Developer, Frontend Developer, Team Morale Captain, Professional Diddler, Rizzlord",
    avatar: "https://hips.hearstapps.com/hmg-prod/images/snoop_dogg_photo_by_estevan_oriol_archive_photos_getty_455616412.jpg",
  },
  {
    name: "Kar Xing",
    role: "Professional Regard",
    avatar: "https://m.media-amazon.com/images/M/MV5BNTE1ODU3NTM1N15BMl5BanBnXkFtZTcwNTk0NDM4Nw@@._V1_.jpg",
  },
  {
    name: "Wai Zin Lin",
    role: "Team Leader",
    avatar: "https://upload.wikimedia.org/wiktionary/en/thumb/6/6c/Ernest_Khalimov.png/250px-Ernest_Khalimov.png",
    leader: true,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-primary-foreground flex flex-col">
      <Navigationbar />

      <main className="flex flex-col items-center pt-32 pb-16 px-4">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-24 h-24 mb-4" />
          <p className="text-lg text-secondary-foreground text-center max-w-2xl">
            Connecting you with Singapore's most exciting pop-up events, food festivals, and unique experiences. Discover, share, and enjoy the city with us!
          </p>
        </div>

        {/* Mission Statement */}
        <section className="bg-card rounded-2xl shadow-md p-8 mb-10 w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-accent mb-3">Our Mission</h2>
          <p className="text-base text-gray-700">
            Our mission is to make event discovery easy, fun, and accessible for everyone. We believe in building a vibrant community where people can find and share unforgettable moments.
          </p>
        </section>

        {/* What We Do */}
        <section className="w-full max-w-3xl mb-10">
          <h2 className="text-xl font-semibold text-primary mb-3">What We Do</h2>
          <ul className="grid md:grid-cols-2 gap-6">
            <li className="bg-highlight p-6 rounded-xl shadow-sm">
              <span className="text-accent text-2xl font-bold"></span>
              <h3 className="text-lg font-semibold mt-2 mb-1">Curated Events</h3>
              <p className="text-gray-700 text-sm">Hand-picked pop-ups, food fests, and hidden gems updated weekly.</p>
            </li>
            <li className="bg-highlight p-6 rounded-xl shadow-sm">
              <span className="text-accent text-2xl font-bold"></span>
              <h3 className="text-lg font-semibold mt-2 mb-1">Honest Reviews</h3>
              <p className="text-gray-700 text-sm">Real reviews from our community so you know what’s worth your time.</p>
            </li>
            <li className="bg-highlight p-6 rounded-xl shadow-sm">
              <span className="text-accent text-2xl font-bold"></span>
              <h3 className="text-lg font-semibold mt-2 mb-1">Community Driven</h3>
              <p className="text-gray-700 text-sm">Share your experiences, tips, and photos with fellow explorers.</p>
            </li>
            <li className="bg-highlight p-6 rounded-xl shadow-sm">
              <span className="text-accent text-2xl font-bold"></span>
              <h3 className="text-lg font-semibold mt-2 mb-1">Easy Planning</h3>
              <p className="text-gray-700 text-sm">Save your favourite events and get reminders so you never miss out.</p>
            </li>
          </ul>
        </section>

        {/* Our Team */}
        <section className="w-full max-w-3xl mb-10">
          <h2 className="text-xl font-semibold text-primary mb-3">Meet the Team</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center bg-card p-5 rounded-xl shadow-sm w-48"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mb-3"
                />
                <div className="font-bold text-accent">{member.name}</div>
                <div className="text-sm text-secondary-foreground">
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="w-full max-w-3xl mb-10">
          <h2 className="text-xl font-semibold text-primary mb-3">Our Values</h2>
          <ul className="flex flex-wrap gap-4">
            <li className="bg-card border border-primary px-4 py-2 rounded-full text-primary font-semibold">Inclusivity</li>
            <li className="bg-card border border-primary px-4 py-2 rounded-full text-primary font-semibold">Fun</li>
            <li className="bg-card border border-primary px-4 py-2 rounded-full text-primary font-semibold">Transparency</li>
            <li className="bg-card border border-primary px-4 py-2 rounded-full text-primary font-semibold">Community</li>
          </ul>
        </section>

        {/* Call to Action */}
        <section className="w-full max-w-3xl text-center mt-8">
          <h2 className="text-2xl font-bold text-accent mb-3">Ready to explore?</h2>
          <p className="mb-6 text-gray-700">Browse our latest events or join our community to share your own discoveries!</p>
          <a
            href="/"
            className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-full shadow hover:bg-accent transition"
          >
            Discover Events
          </a>
        </section>

        {/* Contact */}
        <section className="w-full max-w-3xl text-center mt-16">
          <h2 className="text-xl font-semibold text-primary mb-2">Contact Us</h2>
          <p className="text-gray-700 mb-2">Have questions or want to partner with us?</p>
          <a href="mailto:hello@yourplatform.com" className="text-accent underline hover:text-primary">
            hello@yourplatform.com
          </a>
        </section>
      </main>
    </div>
  );
}
