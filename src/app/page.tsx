import { InstallApp } from "@/components/InstallApp";
import { fullPlan } from "@/data/plans/full";

export default function Home() {
  return <InstallApp plan={fullPlan} />;
}
