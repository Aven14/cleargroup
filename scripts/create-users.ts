import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function createUsers() {
  const users = [
    {
      email: "admin@a4l.fr",
      password: "admin",
      firstname: "Admin",
      lastname: "A4L",
      roles: ["ADMIN"],
    },
    {
      email: "security@a4l.fr",
      password: "security",
      firstname: "Agent",
      lastname: "Sécurité",
      roles: ["SECURITY"],
    },
    {
      email: "driver@a4l.fr",
      password: "driver",
      firstname: "Chauffeur",
      lastname: "Bus",
      roles: ["DRIVER"],
    },
    {
      email: "ambulancier@a4l.fr",
      password: "ambulance",
      firstname: "Ambulancier",
      lastname: "Rescue",
      roles: ["AMBULANCIER"],
    },
    {
      email: "mecanicien@a4l.fr",
      password: "mecano",
      firstname: "Mécanicien",
      lastname: "DP",
      roles: ["MECANICIEN"],
    },
  ];

  for (const user of users) {
    try {
      const passwordHash = await hashPassword(user.password);
      
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          passwordHash,
          firstname: user.firstname,
          lastname: user.lastname,
          roles: user.roles as any,
        },
      });

      console.log(`✅ Utilisateur créé: ${user.email} (${user.password})`);
    } catch (error) {
      console.error(`❌ Erreur pour ${user.email}:`, error);
    }
  }

  console.log("\n🎉 Création terminée !");
  console.log("\nIdentifiants de connexion:");
  users.forEach(u => {
    console.log(`  ${u.email} : ${u.password}`);
  });
}

createUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
