import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, MessageSquare, Palette, PenTool } from "lucide-react";

const Services = () => {
  const services = [
    {
      title: "Brand Clarity Architecture",
      description: "Strategic foundations that define who you are and why it matters. Decision frameworks that scale with your ambition.",
      icon: Users
    },
    {
      title: "Naming + Messaging Systems",
      description: "Words that work. Language architecture that cuts through noise and creates lasting recall in crowded markets.",
      icon: MessageSquare
    },
    {
      title: "Identity + Narrative Development",
      description: "Visual and verbal identity systems that express strategy. Stories that resonate across every touchpoint.",
      icon: Palette
    },
    {
      title: "Brand Strategy + Creative Content",
      description: "Integrated campaigns that align strategic thinking with creative execution. Content systems that drive engagement and build lasting brand equity.",
      icon: PenTool
    }
  ];

  return (
    <section className="py-24 bg-gray-50 relative">
      {/* Floating effect with subtle shadows */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border border-gray-200 shadow-none bg-white hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <service.icon className="w-5 h-5 text-gray-600" />
                  <h3 className="text-xl font-medium text-gray-900 leading-tight">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed font-light">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;