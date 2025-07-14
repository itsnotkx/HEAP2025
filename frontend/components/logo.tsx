// components/KiasuPlannerLogo.tsx
import Image from "next/image";
import logo from "@/public/KiasuPlanner.png";

export default function KiasuPlannerLogo() {
  return <Image src={logo} alt="Kiasu Planner Logo" width={125} height={11} />;
}
