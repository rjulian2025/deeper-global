import { Toaster } from "@/components/ui/toaster";
import DesignExploration from "./pages/DesignExploration";
import HomepageElementalVoid from "./pages/HomepageElementalVoid";
import HomepageElementalVoidV2 from "./pages/HomepageElementalVoidV2";
import HomepageEditorial from "./pages/HomepageEditorial";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import GlobalSchema from "@/components/GlobalSchema";
import Index from "./pages/Index";
import About from "./pages/About";
import AIContentLanding from "./pages/AIContentLanding";
import Contact from "./pages/Contact";
import MeetTheStrategist from "./pages/MeetTheStrategist";
import Packages from "./pages/Packages";
import BrandClaritySession from "./pages/BrandClaritySession";
import SignalCall from "./pages/SignalCall";
import BlogIndex from "./pages/BlogIndex";
import BlogClarityInAI from "./pages/BlogClarityInAI";
import BlogStrategyIsTheNewLogo from "./pages/BlogStrategyIsTheNewLogo";
import BlogScaleWithoutLosingSoul from "./pages/BlogScaleWithoutLosingSoul";
import BlogWhatIsAClaritySystem from "./pages/BlogWhatIsAClaritySystem";
import BlogBrandStrategyInSyntheticEra from "./pages/BlogBrandStrategyInSyntheticEra";
import BlogBrandArchetypesAIEra from "./pages/BlogBrandArchetypesAIEra";
import BlogClarityOperatingSystem from "./pages/BlogClarityOperatingSystem";
import BlogMadBuddha from "./pages/BlogMadBuddha";
import BlogSecondBrainArchitecture from "./pages/BlogSecondBrainArchitecture";
import CaseStudyLoopo from "./pages/CaseStudyLoopo";
import Clients from "./pages/Clients";
import AtlantaBrandStrategy from "./pages/AtlantaBrandStrategy";
import RickJulian from "./pages/RickJulian";
import StrategicAnswersIndex from "./pages/strategic-answers/StrategicAnswersIndex";
import FractionalCMOvsAgency from "./pages/strategic-answers/FractionalCMOvsAgency";
import FractionalCMOCost from "./pages/strategic-answers/FractionalCMOCost";
import WhenToHireFractionalCMO from "./pages/strategic-answers/WhenToHireFractionalCMO";
import IsFractionalCMOWorthIt from "./pages/strategic-answers/IsFractionalCMOWorthIt";
import FractionalCMOSaaSGuide from "./pages/strategic-answers/FractionalCMOSaaSGuide";
import WhyGrowthStalls from "./pages/strategic-answers/WhyGrowthStalls";
import WhyRebrandsFail from "./pages/strategic-answers/WhyRebrandsFail";
import AlignSalesAndMarketing from "./pages/strategic-answers/AlignSalesAndMarketing";
import GTMSystemNotCampaign from "./pages/strategic-answers/GTMSystemNotCampaign";
import InstalledLeadershipModel from "./pages/strategic-answers/InstalledLeadershipModel";
import WhatDoesACBODo from "./pages/strategic-answers/WhatDoesACBODo";
import BrandStrategyFailsWithoutLeadership from "./pages/strategic-answers/BrandStrategyFailsWithoutLeadership";
import BrandPositioningVsBrandMarketing from "./pages/strategic-answers/BrandPositioningVsBrandMarketing";
import W9Download from "./pages/W9Download";
import NotFound from "./pages/NotFound";

// Answers Knowledge Base
import AnswersIndex from "./pages/answers/AnswersIndex";
import WhatBrandStrategyActuallyIs from "./pages/answers/WhatBrandStrategyActuallyIs";
import WhatCreativeDirectionControls from "./pages/answers/WhatCreativeDirectionControls";
import BrandingVsMarketing from "./pages/answers/BrandingVsMarketing";
import WhenRebrandIsWrong from "./pages/answers/WhenRebrandIsWrong";
import FounderLedVsCommitteeLed from "./pages/answers/FounderLedVsCommitteeLed";
import WhatBreaksWhenBrandsScale from "./pages/answers/WhatBreaksWhenBrandsScale";
import BrandStrategyVsBrandIdentity from "./pages/answers/BrandStrategyVsBrandIdentity";
import CreativeDirectionVsDesign from "./pages/answers/CreativeDirectionVsDesign";
import RebrandVsRefresh from "./pages/answers/RebrandVsRefresh";
import AIBrandingVsHumanJudgment from "./pages/answers/AIBrandingVsHumanJudgment";
import HowToTellIfBrandIsProblem from "./pages/answers/HowToTellIfBrandIsProblem";
import PolishedButWeak from "./pages/answers/PolishedButWeak";
import HiredAgencyNothingChanged from "./pages/answers/HiredAgencyNothingChanged";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <GlobalSchema />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai-content" element={<AIContentLanding />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/meet-the-strategist" element={<MeetTheStrategist />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/consultation" element={<BrandClaritySession />} />
            <Route path="/signal-call" element={<SignalCall />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/clarity-in-the-age-of-ai" element={<BlogClarityInAI />} />
            <Route path="/blog/strategy-is-the-new-logo" element={<BlogStrategyIsTheNewLogo />} />
            <Route path="/blog/scale-without-losing-soul" element={<BlogScaleWithoutLosingSoul />} />
            <Route path="/blog/what-is-a-clarity-system" element={<BlogWhatIsAClaritySystem />} />
            <Route path="/blog/brand-strategy-in-synthetic-era" element={<BlogBrandStrategyInSyntheticEra />} />
            <Route path="/blog/brand-archetypes-ai-era" element={<BlogBrandArchetypesAIEra />} />
            <Route path="/blog/clarity-operating-system" element={<BlogClarityOperatingSystem />} />
            <Route path="/blog/mad-buddha" element={<BlogMadBuddha />} />
            <Route path="/blog/second-brain-architecture" element={<BlogSecondBrainArchitecture />} />
            <Route path="/case-study/loopo" element={<CaseStudyLoopo />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/atlanta-brand-strategy" element={<AtlantaBrandStrategy />} />
            <Route path="/rick-julian" element={<RickJulian />} />
            <Route path="/strategic-answers" element={<StrategicAnswersIndex />} />
            <Route path="/strategic-answers/fractional-cmo-vs-agency" element={<FractionalCMOvsAgency />} />
            <Route path="/strategic-answers/fractional-cmo-cost" element={<FractionalCMOCost />} />
            <Route path="/strategic-answers/when-to-hire-fractional-cmo" element={<WhenToHireFractionalCMO />} />
            <Route path="/strategic-answers/is-fractional-cmo-worth-it" element={<IsFractionalCMOWorthIt />} />
            <Route path="/strategic-answers/fractional-cmo-saas-guide" element={<FractionalCMOSaaSGuide />} />
            <Route path="/strategic-answers/why-growth-stalls" element={<WhyGrowthStalls />} />
            <Route path="/strategic-answers/why-rebrands-fail" element={<WhyRebrandsFail />} />
            <Route path="/strategic-answers/align-sales-and-marketing" element={<AlignSalesAndMarketing />} />
            <Route path="/strategic-answers/gtm-system-not-campaign" element={<GTMSystemNotCampaign />} />
            <Route path="/strategic-answers/installed-leadership-model" element={<InstalledLeadershipModel />} />
            <Route path="/strategic-answers/what-does-a-cbo-do" element={<WhatDoesACBODo />} />
            <Route path="/strategic-answers/brand-strategy-fails-without-leadership" element={<BrandStrategyFailsWithoutLeadership />} />
            <Route path="/strategic-answers/brand-positioning-vs-brand-marketing" element={<BrandPositioningVsBrandMarketing />} />
            
            {/* Answers Knowledge Base */}
            <Route path="/answers" element={<AnswersIndex />} />
            <Route path="/answers/what-brand-strategy-actually-is" element={<WhatBrandStrategyActuallyIs />} />
            <Route path="/answers/what-creative-direction-controls" element={<WhatCreativeDirectionControls />} />
            <Route path="/answers/branding-vs-marketing" element={<BrandingVsMarketing />} />
            <Route path="/answers/when-rebrand-is-wrong" element={<WhenRebrandIsWrong />} />
            <Route path="/answers/founder-led-vs-committee-led" element={<FounderLedVsCommitteeLed />} />
            <Route path="/answers/what-breaks-when-brands-scale" element={<WhatBreaksWhenBrandsScale />} />
            <Route path="/answers/brand-strategy-vs-brand-identity" element={<BrandStrategyVsBrandIdentity />} />
            <Route path="/answers/creative-direction-vs-design" element={<CreativeDirectionVsDesign />} />
            <Route path="/answers/rebrand-vs-refresh" element={<RebrandVsRefresh />} />
            <Route path="/answers/ai-branding-vs-human-judgment" element={<AIBrandingVsHumanJudgment />} />
            <Route path="/answers/how-to-tell-if-brand-is-problem" element={<HowToTellIfBrandIsProblem />} />
            <Route path="/answers/polished-but-weak" element={<PolishedButWeak />} />
            <Route path="/answers/hired-agency-nothing-changed" element={<HiredAgencyNothingChanged />} />
            
            <Route path="/w9" element={<W9Download />} />
            
            {/* Internal Design Exploration */}
            <Route path="/design-exploration" element={<DesignExploration />} />
            <Route path="/design-exploration/elemental-void" element={<HomepageElementalVoid />} />
            <Route path="/design-exploration/elemental-void-v2" element={<HomepageElementalVoidV2 />} />
            <Route path="/design-exploration/editorial" element={<HomepageEditorial />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
