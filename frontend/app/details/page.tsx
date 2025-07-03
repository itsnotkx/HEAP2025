"use client";
import React, { useState } from "react";

const event = {
  title: "McSpicy Museum",
  address: "Bugis Junction",
  time: "11am-9pm",
  priceInfo: "Free",
  dateRange: "13th–25th May",
  description:
    "PSA: Macdonners is giving out 50 free – yes, free – McSpicy burgers daily at 12pm and 5pm at the McSpicy Musuem pop-up. This is the week you want to forget about your diet and join fellow Macs fans to try a new flavour too: Smoky Chilli Mayo McSpicy. Apart from all the food, the museum will also have fun games and a photobooth.",
  imageUrl:
    "https://thesmartlocal.com/wp-content/uploads/2022/09/Aditi-Kashyap-TSL-Profile-Pic-min-scaled-96x96.jpg",
  officialLink: "https://eatbook.sg/mcdonalds-smoky-chilli-mayo-mcspicy/",
  moreLinks: [
    "https://thesmartlocal.com/read/things-to-do-this-weekend-singapore/",
  ],
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.443382964208!2d103.853!3d1.299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19a9b3c2d3b1%3A0x2e2e2e2e2e2e2e2e!2sBugis%20Junction!5e0!3m2!1sen!2ssg!4v1688426827619!5m2!1sen!2ssg",
};

const reviews = [
  {
    name: "Sarah Lim",
    date: "2025-05-14",
    rating: 5,
    text: "Absolutely loved the McSpicy Museum! The free burgers were amazing and the new Smoky Chilli Mayo McSpicy is a must-try. The games and photobooth made it a fun day out.",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Jason Tan",
    date: "2025-05-15",
    rating: 4.5,
    text: "Great pop-up event with a lively crowd. The only downside was the queue for the free burgers, but it was worth the wait. Would recommend to all McSpicy fans!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Aisha Rahman",
    date: "2025-05-16",
    rating: 4,
    text: "Fun experience and loved the photobooth! Wish there were more seating areas, but overall a fantastic event.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

// Star rating component with support for half-stars
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={"full" + i} className="w-5 h-5 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    );
  }
  if (hasHalf) {
    stars.push(
      <svg key="half" className="w-5 h-5 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="half-grad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"
          fill="url(#half-grad)"
        />
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </svg>
    );
  }
  // Fill up to 5 stars with empty stars
  for (let i = stars.length; i < 5; i++) {
    stars.push(
      <svg key={"empty" + i} className="w-5 h-5 text-gray-300 inline" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    );
  }
  return <span>{stars}</span>;
};

const address = event.address;
const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Bugis+Junction+Singapore";

const EventTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Description" | "Location" | "Review">("Location");

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md mt-0">
      {/* Tabs */}
      <div className="flex border-b">
        {["Description", "Location", "Review"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 px-2 text-lg font-medium
              ${activeTab === tab
                ? "border-b-2 border-red-500 text-red-700 bg-gray-100"
                : "text-gray-500 hover:text-red-600"}
            `}
            style={{ transition: "all 0.2s" }}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8 min-h-[320px] flex flex-col items-center">
        {activeTab === "Location" && (
          <>
            {/* Map */}
            <div className="w-full h-72 rounded-xl overflow-hidden border border-gray-200 mb-8 bg-white">
              <iframe
                title="Google Map"
                src={event.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {/* Action Buttons */}
            <div className="flex w-full justify-center gap-6">
              <button
                onClick={handleCopy}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-8 rounded-full transition"
              >
                Copy Address
              </button>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-8 rounded-full transition text-center"
              >
                View on Google Maps
              </a>
            </div>
          </>
        )}

        {activeTab === "Description" && (
          <div className="text-gray-700 text-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-red-700">{event.title}</h2>
            <div className="flex flex-wrap gap-4 mb-4 items-center">
              <span className="bg-yellow-200 text-yellow-800 px-4 py-1 rounded-full text-sm font-semibold">
                {event.time}
              </span>
              <span className="bg-green-200 text-green-800 px-4 py-1 rounded-full text-sm font-semibold">
                {event.priceInfo}
              </span>
              <span className="bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold">
                {event.dateRange}
              </span>
              <span className="text-gray-700 text-lg font-medium ml-auto">
                {event.address}
              </span>
            </div>
            <p className="mb-6">{event.description}</p>
            <a
              href={event.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full shadow transition mb-4"
            >
              Official Event Page
            </a>
            {event.moreLinks && event.moreLinks.length > 0 && (
              <div className="mt-6 mb-2">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  More Information
                </h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  {event.moreLinks.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-900"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "Review" && (
          <div className="w-full">
            <h2 className="text-2xl font-bold text-red-700 mb-6">Visitor Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="flex items-start bg-gray-50 rounded-xl p-6 shadow-sm"
                >
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-14 h-14 rounded-full mr-5 border-2 border-white shadow"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold text-lg mr-2">{review.name}</span>
                      <StarRating rating={review.rating} />
                    </div>
                    <div className="text-gray-500 text-sm mb-2">{review.date}</div>
                    <div className="text-gray-700">{review.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EventInfoPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-100 via-red-100 to-orange-100 flex flex-col">

      {/* Page Content */}
      <div className="pt-28 w-full flex flex-col items-center">
        {/* Large rectangular event image at the top */}
        <div className="w-full max-w-4xl h-64 md:h-96 overflow-hidden rounded-2xl shadow-lg mb-8">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tabbed Content */}
        <EventTabs />

        {/* White space below */}
        <div className="h-24" />
      </div>
    </div>
  );
};

export default EventInfoPage;
