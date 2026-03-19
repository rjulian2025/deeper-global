import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Hero from "@/components/Hero";
import ServiceArchitecture from "@/components/ServiceArchitecture";
import StrategicGrowthExplained from "@/components/StrategicGrowthExplained";
import Problem from "@/components/Problem";
import Shift from "@/components/Shift";
import HowIWork from "@/components/HowIWork";
import Partnership from "@/components/Partnership";
import Engagements from "@/components/Engagements";
import Proof from "@/components/Proof";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import CommonQuestions from "@/components/CommonQuestions";
import FinalCTA from "@/components/FinalCTA";

export default function HomePageContent() {
  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <Hero />
        <ServiceArchitecture />
        <StrategicGrowthExplained />
        <Problem />
        <Shift />
        <HowIWork />
        <Partnership />
        <Engagements />
        <Proof />
        <WhoThisIsFor />
        <CommonQuestions />
        <FinalCTA />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
