// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const categories = [
    "PvP",
    "Quests",
    "World",
    "Dungeons",
    "Raids",
    "Systems",
    "UI",
    "Addons",
    "Classes",
    "Races",
    "Talents",
    "Graphics",
    "Lore",
    "Professions",
    "Other",
];

async function main() {
    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },         // Category.name legyen @unique (nálad az)
            update: {},              // ha már létezik, nem módosítunk semmit
            create: { name },        // különben létrehozzuk
        });
    }
    console.log(`Seed kész: ${categories.length} kategória.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
