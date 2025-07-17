// components/KiasuPlannerLogo.tsx
import Image from "next/image";
import logo from "@/public/KiasuPlanner.png";

interface KiasuPlannerLogoProps {
  className?: string;
}

export default function KiasuPlannerLogo({ className = "" }: KiasuPlannerLogoProps) {
  return (
    <div className={className}>
      <Image alt="Kiasu Planner Logo" height={11} src={logo} width={125} />
    </div>
  );
}
