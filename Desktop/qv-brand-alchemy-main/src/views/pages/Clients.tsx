import CTAFooter from "@/components/CTAFooter";
const featuredWork = [
  {
    image: "/lovable-uploads/loopo-brand.png",
    client: "Loopo",
    category: "Technology"
  },
  {
    image: "/lovable-uploads/fathom-cruise.png",
    client: "Fathom",
    category: "Tourism & Hospitality"
  },
  {
    image: "/lovable-uploads/hanson-brick-campaign.png",
    client: "Hanson Brick",
    category: "Construction"
  }
];

const clientCategories = [
  {
    title: "Technology",
    clients: ["Konica Minolta", "Loopo", "Castrol", "ATT", "SAP", "Microsoft", "ForRent.com", "IBM", "SONY", "SEEBURGER", "Cloud Sherpas", "Proclivity Systems", "ASUG", "Candid Partners", "MATTER", "Reactor"]
  },
  {
    title: "Food & Beverage",
    clients: ["Coca-Cola", "Sprite", "Mello Yello", "Minute Maid", "Fiji Water", "Hardees", "Fuddruckers", "McDonald's", "Burger King", "Sunkist"]
  },
  {
    title: "Tourism & Hospitality",
    clients: ["Carnival", "Marriott", "Fathom", "Days Inn", "Holiday Inn", "Country Hearth Inn", "The Islands of the Bahamas", "Antigua & Barbuda", "Las Palmas Resorts", "City of Atlanta"]
  },
  {
    title: "Shelter",
    clients: ["I.D. Store", "Miele", "TOTO", "Mohawk Carpets", "Hansgrohe", "Greased Lightning", "Baci Mirrors", "Giabo"]
  },
  {
    title: "Sports",
    clients: ["The Super Bowl", "Atlanta Braves", "Atlanta Hawks", "The Olympics", "The Paralympics", "Reebok"]
  },
  {
    title: "Financial",
    clients: ["AXA", "MetLife", "Wachovia", "Liberty Mutual Bank", "United Federal", "Suntrust"]
  },
  {
    title: "Government",
    clients: ["United States Marine Corps", "Centers for Disease Control", "Georgia Innocence Project", "The American Cancer Society", "Atlanta Aphasia Association", "Georgia Department of Human Resources"]
  },
  {
    title: "Construction",
    clients: ["Georgia Pacific", "Hanson Brick", "REX Synfelt", "Kodi Klip", "Vanderlande Industries", "Kronberg Wall Architects"]
  }
];

const Clients = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6 font-medium">Our Portfolio</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal leading-tight mb-8">
            Our Esteemed <span className="italic font-light">Clients</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl">
            Partnerships That Define Success
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Featured Work Gallery */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-12 italic">Featured Work</h2>
          
          {/* Masonry-style grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWork.map((work, index) => (
              <div 
                key={work.client}
                className={`group relative overflow-hidden rounded-lg shadow-lg ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className={`relative ${index === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                  <img 
                    src={work.image}
                    alt={`${work.client} project`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-background/60 text-xs tracking-widest uppercase mb-2">{work.category}</p>
                    <h3 className="font-serif text-xl md:text-2xl text-background">{work.client}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Client Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {clientCategories.map((category) => (
              <div key={category.title}>
                <h2 className="font-serif text-xl md:text-2xl text-foreground mb-6 pb-3 border-b border-border italic">
                  {category.title}
                </h2>
                <ul className="space-y-2">
                  {category.clients.map((client) => (
                    <li key={client} className="text-muted-foreground font-light text-sm md:text-base">
                      {client}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTAFooter />
    </div>
  );
};

export default Clients;
