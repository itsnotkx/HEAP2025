"use client";
import React from "react";
import Logo from "@/components/logo";
import Navigationbar from "@/components/navbar";

// FAQ data for easier updates and mapping
const faqs = [
  {
    question: "How often are events updated?",
    answer: "We update events every Monday at 00:00 SGT (UTC +8).",
  },
  {
    question: "How do I report an issue?",
    answer: (
      <>
        Email us at{" "}
        <a
          href="mailto:kx.khoo.2024@computing.smu.edu.sg"
          className="text-accent underline"
        >
          kx.khoo.2024@computing.smu.edu.sg
        </a>{" "}
        with details.
      </>
    ),
  },
  {
    question: "Can I suggest a feature?",
    answer: (
      <>
        Absolutely! We love feedback. Drop us an email at{" "}
        <a
          href="mailto:kx.khoo.2024@computing.smu.edu.sg"
          className="text-accent underline"
        >
          kx.khoo.2024@computing.smu.edu.sg
        </a>{" "}
        or use our{" "}
        <a
          href="https://forms.gle/your-suggestion-box-link"
          className="text-accent underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          suggestion box
        </a>
        .
      </>
    ),
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background text-primary-foreground flex flex-col">
      <Navigationbar />
      <main className="flex flex-col items-center pt-32 pb-16 px-4">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <Logo className="h-40 w-auto mb-4" aria-label="Site logo" />
          <h1 className="text-3xl font-bold mb-2 text-accent">Support</h1>
          <p className="text-lg text-secondary-foreground text-center max-w-2xl">
            Still Kancheong? We're here for you. Check our FAQs below or contact us directly!
          </p>
        </div>

        {/* FAQ Section */}
        <section
          className="bg-card rounded-2xl shadow-md p-8 mb-10 w-full max-w-3xl"
          aria-labelledby="faq-heading"
        >
          <h2 id="faq-heading" className="text-2xl font-bold text-accent mb-4">
            Frequently Asked Questions
          </h2>
          <ul className="space-y-4 text-gray-700">
            {faqs.map((faq, idx) => (
              <li key={idx}>
                <strong>{faq.question}</strong>
                <br />
                {faq.answer}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact Section */}
        <section
          className="w-full max-w-3xl text-center mt-8"
          aria-labelledby="contact-heading"
        >
          <h2 className="text-xl font-semibold text-primary mb-2" id="contact-heading">
            Still need help?
          </h2>
          <p className="text-gray-700 mb-2">
            Contact our team and we’ll get back to you as soon as possible.
          </p>
          <a
            href="mailto:kx.khoo.2024@computing.smu.edu.sg"
            className="text-accent underline hover:text-primary"
          >
            kx.khoo.2024@computing.smu.edu.sg
          </a>
        </section>
      </main>
    </div>
  );
}
