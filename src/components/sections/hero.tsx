import Link from "next/link";
import { useEffect, useState } from "react";
import { getHomeNetworkData } from "@/actions/lines";
import { getCurrentUser } from "@/lib/session";
import { ArrowRight, MapPin, Radio, Ticket, UserPlus } from "lucide-react";

export default async function HeroSection() {
  const [networkData, setNetworkData] = useState({ lineCount: 0, activeLines: [] });
  const [user, setUser] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  // Charger les données au montage
  useEffect(() => {
    const loadData = async () => {
      const data = await getHomeNetworkData();
      setNetworkData(data);
      const userData = await getCurrentUser();
      setUser(userData);
    };

    loadData();
  }, []);

  // Gestion de l'animation de survol
  const handleCardMouseEnter = (index: number) => {
    setActiveCard(index);
    setIsHovering(true);
  };

  const handleCardMouseLeave = () => {
    setActiveCard(null);
    setIsHovering(false);
  };

  const services = [
    {
      icon: Radio,
      label: "Radio & annonces",
      description: "Musique en continu et messages d'arrêt avec signal sonore.",
      gradient: "from-primary/10 to-primary/5",
      color: "text-primary",
    },
    {
      icon: Ticket,
      label: "Billets",
      description: "Émission de trajet unique, pass journée ou semaine.",
      gradient: "from-accent-light to-white",
      color: "text-accent",
    },
    {
      icon: UserPlus,
      label: "Communauté",
      description: "Rejoignez notre communauté de conducteurs et contrôleurs.",
      gradient: "from-success/10 to-success/5",
      color: "text-success",
    },
    {
      icon: MapPin,
      label: "Exploration",
      description: "Découvrez les arrêts populaires et les lieux incontournables.",
      gradient: "from-warning/10 to-warning/5",
      color: "text-warning",
    },
  ];

  return (
    <section className="relative pt-20 pb-24">
      {/* Fond animé */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 overflow-hidden">
          <canvas id="hero-canvas" className="w-full h-full" />
        </div>

        {/* Éléments décoratifs flottants */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 right-1/2 -translate-x-1/2 w-36 h-36 bg-accent/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/4 right-10 w-20 h-20 bg-success/5 rounded-full blur-2xl animate-float-fast" />
          <div className="absolute bottom-1/4 left-10 w-24 h-24 bg-warning/5 rounded-full blur-2xl animate-float-slower" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre principal avec animation de frappe */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-700 to-accent-500 mb-6">
            Clear<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-500">Bus</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Le réseau de transport immersif pour votre serveur Arma 3 RP
          </p>
        </div>

        {/* Statistiques dynamiques */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-12">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`relative group rounded-xl bg-background/80 backdrop-blur p-6 border border-border/20 hover:bg-background/95 hover:-translate-y-1 transition-all duration-500`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="absolute inset-0 -z-0 rounded-xl bg-gradient-to-br from-transparent via-black/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-0 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary-600">
                  {/* Icônes dynamiques selon l'index */}
                  {[1, 2, 3, 4].map((i, idx) => (
                    idx + 1 === index ? (
                      <span key={i} className="text-2xl">
                        {[📻, 🎫, 👥, 📍][idx]}
                      </span>
                    ) : null
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-foreground">
                  {[10, 24, 156, 8][index - 1]}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {[ "Lignes actives", "Arrêts total", "Utilisateurs", "Billetts actifs"][index - 1]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Présentation des services avec interaction */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className={cn(
                "group relative isolation rounded-2xl bg-background/80 backdrop-blur p-8 border border-border/20",
                "hover:bg-background/95 hover:-translate-y-2 transition-all duration-700",
                "hover:shadow-[0_25px_50px_-12px_rgb(0,0,0,0.25)]",
                activeCard === index && "scale-105",
                service.color
              )}
              onMouseEnter={() => handleCardMouseEnter(index)}
              onMouseLeave={() => handleCardMouseLeave}
            >
              {/* Overlay animé */}
              <div className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-transparent via-black/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-0 flex flex-col items-center text-center space-y-6">
                {/* Icône avec effet de pulsation */}
                <div className="relative w-16 h-16 flex items-center justify-center rounded-xl mb-4">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${service.gradient} opacity-20 blur-3xl`}></div>

                  <div className="relative z-0 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">
                    <service.icon className={`h-5 w-5 ${service.color}`} />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground">
                  {service.label}
                </h3>

                <p className="text-sm text-muted-foreground max-w-md">
                  {service.description}
                </p>

                <Link
                  href="#"
                  className={cn(
                    "mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary-600 hover:bg-primary/20 transition-all duration-300",
                    "active"
                  )}
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Appel à l'action principal */}
        <div className="mt-16 text-center">
          <Link
            href="/lignes"
            className={cn(
              "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg",
              "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800",
              "text-white hover:shadow-2xl transition-all duration-500",
              "transform-gpu",
              "active"
            )}
          >
            Explorer le réseau
            <ArrowRight className="ml-3 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <p className="mt-8 text-sm text-muted-foreground">
            Déjà {networkData.lineCount} lignes disponibles pour votre immersion RP
          </p>
        </div>
      </div>
    </section>
  );
}