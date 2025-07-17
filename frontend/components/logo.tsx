// components/KiasuPlannerLogo.tsx
import Image from "next/image";

import logo from "@/public/KiasuPlanner.png";

export default function KiasuPlannerLogo() {
  return <Image alt="Kiasu Planner Logo" height={11} src={logo} width={125} />;
}
