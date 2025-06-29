"use client";
import { Button } from "@heroui/button";
type ScrollButtonProps = {
  className?: string;
  targetId: string;
};

export default function ScrollButton({ className, targetId}: ScrollButtonProps) {
  const scrollToEvents = () => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Button onPress={scrollToEvents} className={className}>
      Get Started
    </Button>
  );
}