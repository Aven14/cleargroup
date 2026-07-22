import Link from "next/link";

import { getHomeNetworkData } from "@/actions/lines";
import { prisma } from "@/lib/prisma";

interface SecurityShiftWithUser {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    roles: string[];
  };
  startedAt: Date;
}

interface DriverShiftWithUser {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    roles: string[];
  };
  startedAt: Date;
}



const divisions = [

  {

    title: "ClearBus",

    desc: "Entreprise de transport en commun de Vice City. Radio FM, lignes, tickets, publicités et informations voyageurs.",

    color: "from-primary/10 to-primary/5",

    icon: (

      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>

        <path strokeLinecap="round" d="M4 7h16c0.55 0 1 0.45 1 1v8c0 0.55-0.45 1-1 1h-1c-0.55 0-1-0.45-1-1v-1H6v1c0 0.55-0.45 1-1 1H4c-0.55 0-1-0.45-1-1V8c0-0.55 0.45-1 1-1z" />

        <rect x="6" y="9" width="3" height="2" rx="0.5" fill="#194A78" />

        <rect x="10.5" y="9" width="3" height="2" rx="0.5" fill="#194A78" />

        <rect x="15" y="9" width="3" height="2" rx="0.5" fill="#194A78" />

      </svg>

    ),

    href: "/clearbus",

  },

  {

    title: "ClearSecurity",

    desc: "Entreprise de sécurité privée intervenant sur Vice City. Surveillance, sécurité événementielle, patrouilles et contrôle d'accès.",

    color: "from-accent-light to-white",

    icon: (

      <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>

        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />

      </svg>

    ),

    href: "/clearsecurity",

  },

];



export default async function HomePage() {

  const { lineCount } = await getHomeNetworkData();

  // Récupérer tout le personnel en service
  const activeShifts = await prisma.securityServiceShift.findMany({
    where: {
      endedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          roles: true,
        },
      },
    },
  });

  const activeDriverShifts = await prisma.driverShift.findMany({
    where: {
      endedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          roles: true,
        },
      },
      line: {
        select: {
          number: true,
          name: true,
        },
      },
    },
  });

  const activeStaff = [
    ...activeShifts.map((shift: SecurityShiftWithUser) => ({
      id: shift.user.id,
      firstname: shift.user.firstname,
      lastname: shift.user.lastname,
      roles: shift.user.roles,
      type: 'SECURITY' as const,
      startedAt: shift.startedAt,
    })),
    ...activeDriverShifts.map((shift: DriverShiftWithUser) => ({
      id: shift.user.id,
      firstname: shift.user.firstname,
      lastname: shift.user.lastname,
      roles: shift.user.roles,
      type: 'DRIVER' as const,
      startedAt: shift.startedAt,
    })),
  ];

  return (

    <div className="page-enter mx-auto max-w-6xl px-4">

      <section className="panel-highlight relative mb-12 overflow-hidden p-8 md:p-12">

        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />



        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">

          <div>

            <span className="inline-flex items-center gap-2 rounded-md bg-primary-light px-3 py-1 text-xs font-semibold text-primary">

              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />

              Groupe de services · Vice City

            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">

              Clear

              <span className="text-gradient-brand">Group</span>

            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">

              ClearGroup regroupe plusieurs entreprises spécialisées dans les services urbains de Vice City.

            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <Link href="/nos-entreprises" className="btn-primary">

                Nos entreprises

              </Link>

              <Link href="/a-propos" className="btn-secondary">

                À propos

              </Link>

            </div>

          </div>



          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-md bg-primary p-5 text-white shadow-elevated">

              <p className="text-4xl font-extrabold">2</p>

              <p className="mt-1 text-sm text-white/80">

                divisions actives

              </p>

            </div>

            <div className="rounded-md bg-surface p-5 shadow-card">

              <p className="text-4xl font-extrabold text-primary">{lineCount}</p>

              <p className="mt-1 text-sm text-muted">

                lignes de bus

              </p>

            </div>

          </div>

        </div>

      </section>



      <section className="mb-12">

        <h2 className="mb-6 text-xl font-bold text-ink">Nos entreprises</h2>

        <div className="grid gap-4 md:grid-cols-2">

          {divisions.map((d) => (

            <Link

              key={d.title}

              href={d.href}

              className={`panel-soft bg-gradient-to-br p-8 ${d.color} transition hover:shadow-card-hover`}

            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface shadow-card">

                {d.icon}

              </div>

              <h3 className="font-bold text-ink">{d.title}</h3>

              <p className="mt-2 text-sm text-muted">{d.desc}</p>

              <p className="mt-4 text-xs font-medium text-primary">Découvrir →</p>

            </Link>

          ))}

        </div>

      </section>



      <section>

        <h2 className="mb-6 text-xl font-bold text-ink">Personnel en service</h2>

        {activeStaff.length === 0 ? (

          <div className="panel-soft p-8 text-center text-muted">

            Aucun personnel en service

          </div>

        ) : (

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">

            {activeStaff.map((staff) => (

              <div

                key={staff.id}

                className="panel-soft p-6"

              >

                <p className="font-semibold text-ink">

                  {staff.firstname} {staff.lastname}

                </p>

                <p className="text-sm text-muted">

                  {staff.type === 'SECURITY' ? 'ClearSecurity' : 'ClearBus'}

                </p>

                <div className="mt-2 flex flex-wrap gap-1">

                  {staff.roles.map((role: string) => (

                    <span

                      key={role}

                      className="px-2 py-0.5 bg-primary-light/50 rounded text-xs text-muted"

                    >

                      {role}

                    </span>

                  ))}

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>

  );

}

