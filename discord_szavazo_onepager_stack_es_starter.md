# Cél
Egy **egylapos** (one‑pager) weblap Discord bejelentkezéssel, kategorizált szavazás‑topikokkal, egyedi (topiconként 1 db) szavazattal Discord userenként, gyors szűrés/rendezés, és két oldalsó hirdetéshely.

---

## Ajánlott, “egyben tartható” stack
- **Next.js (App Router)** – front+back egy projektben, server actions/API route-okkal.
- **Auth**: **NextAuth** (Auth.js) + **Discord Provider**.
- **Adatbázis**: **SQLite** lokálisan (egyfájl), **Turso/libSQL** vagy **Neon/Vercel Postgres** prodra.
- **ORM**: **Prisma** (egyszerű séma, jó migrációk).
- **UI**: **Tailwind CSS** + opcionálisan **shadcn/ui** komponensek.
- **Telepítés**: **Vercel** (nagyon gyors, Next.js natív), Turso/Neon DB‑vel.

> Miért ez? Minden egy repo‑ban, kevés mozgó alkatrész, villámgyors fejlesztői élmény. A Discord login 10 perc, a szavazási logika 2 tábla és egy unique index.

---

## Adatmodell (Prisma)
```ts
// lib/auth.ts (v4)
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // @ts-ignore
      session.user.id = user.id;
      return session;
    },
  },
};

// Szerver oldali segéd a sessionhöz (v4):
export const getServerAuth = () => getServerSession(authOptions);
```

**API route handler** (v4):
```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Használat szerver oldalon** (példa a topics route‑ban):
```ts
// app/api/topics/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerAuth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, categoryId } = await req.json();
  const topic = await prisma.topic.create({
    data: {
      title,
      description,
      categoryId,
      createdById: session.user.id,
    },
  });

  return NextResponse.json(topic);
}
```

**Kliensoldali használat** (`signIn`, `signOut`, `useSession`):
```tsx
// app/providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

```tsx
// app/layout.tsx
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

```tsx
// Példa komponens
"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span>{session.user?.name}</span>
        <button onClick={() => signOut()}>Kilépés</button>
      </div>
    );
  }
  return <button onClick={() => signIn("discord")}>Discord belépés</button>;
}
```

**Típusbővítés** (hogy `session.user.id` típushelyes legyen):
```ts
// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
```

**.env példa**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=eredeti_hosszú_random
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
```


---

## Prisma kliens
```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
export const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = prisma;
```

---

## API végpontok
**Topic létrehozás** (kategóriával, NextAuth v4 – `getServerSession` wrapperrel):
```ts
// app/api/topics/route.ts (POST)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth"; // v4 helperünk

export async function POST(req: Request) {
  const session = await getServerAuth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, description, categoryId } = await req.json();
  const topic = await prisma.topic.create({
    data: {
      title,
      description,
      categoryId,
      createdById: session.user.id,
    },
  });
  return NextResponse.json(topic);
}
```

**Szavazás** (1/user/topic, +1 vagy -1 – v4):
```ts
// app/api/votes/route.ts (POST)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerAuth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { topicId, value } = await req.json(); // value: 1 vagy -1

  try {
    const vote = await prisma.vote.upsert({
      where: { topicId_userId: { topicId, userId: session.user.id } },
      create: { topicId, userId: session.user.id, value },
      update: { value },
    });
    return NextResponse.json(vote);
  } catch (e) {
    return NextResponse.json({ error: "Vote failed" }, { status: 400 });
  }
}
```

**Lista lekérdezés szűréssel/rendezéssel/kereséssel** (változatlan):
```ts
// app/api/topics/query/route.ts (POST)
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Sort =
  | { by: "ratio"; dir: "desc" | "asc" }
  | { by: "popularity"; dir: "desc" | "asc" } // szavazatszám
  | { by: "positive"; dir: "desc" | "asc" }
  | { by: "negative"; dir: "desc" | "asc" };

export async function POST(req: Request) {
  const { categoryId, search, sort }: { categoryId?: string; search?: string; sort?: Sort } = await req.json();

  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(search
      ? { title: { contains: search, mode: "insensitive" } }
      : {}),
  };

  const topics = await prisma.topic.findMany({
    where,
    include: {
      votes: true,
      category: true,
    },
  });

  const withStats = topics.map((t) => {
    const pos = t.votes.filter((v) => v.value > 0).length;
    const neg = t.votes.filter((v) => v.value < 0).length;
    const total = pos + neg;
    const ratio = total === 0 ? 0 : pos / total; // pozitív arány
    return { ...t, stats: { pos, neg, total, ratio } };
  });

  const s = sort || { by: "ratio", dir: "desc" } as Sort; // alap: pozitív arány csökkenő

  withStats.sort((a, b) => {
    const by = s.by;
    const dir = s.dir === "desc" ? -1 : 1;
    if (by === "ratio") return (a.stats.ratio - b.stats.ratio) * dir;
    if (by === "popularity") return (a.stats.total - b.stats.total) * dir;
    if (by === "positive") return (a.stats.pos - b.stats.pos) * dir;
    if (by === "negative") return (a.stats.neg - b.stats.neg) * dir;
    return 0;
  }).reverse();

  return NextResponse.json(withStats);
}
```

---

## NextAuth v4 – pontos checklist + fájlstruktúra
```
app/
  api/
    auth/
      [...nextauth]/
        route.ts            # NextAuth endpoint (v4 configből)
  layout.tsx                # SessionProvider beágyazása
  providers.tsx             # <SessionProvider>
lib/
  auth.ts                   # authOptions + getServerAuth wrapper (v4)
  prisma.ts
next-auth.d.ts              # Session típusbővítés
.env.local                  # NEXTAUTH_* + DISCORD_*
```

**1) `lib/auth.ts` – v4 konfiguráció és helper**
```ts
// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // @ts-ignore
      session.user.id = user.id;
      return session;
    },
  },
};

// v4 endpoint handlerhez (App Router route.ts)
export const nextAuthHandler = NextAuth(authOptions);

// v4 server helper (API route-okban használjuk)
export const getServerAuth = () => getServerSession(authOptions);
```

**2) `app/api/auth/[...nextauth]/route.ts` – endpoint**
```ts
// app/api/auth/[...nextauth]/route.ts
export { nextAuthHandler as GET, nextAuthHandler as POST } from "@/lib/auth";
```

**3) Kliens oldali provider**
```tsx
// app/providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```
```tsx
// app/layout.tsx
import { Providers } from "./providers";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**4) Típusbővítés**
```ts
// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
```

**5) .env**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=eredeti_hosszú_random
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
```

**6) Telepítendő csomagok**
```bash
npm i next-auth@^4 @next-auth/prisma-adapter
```

---

## Egyoldalas UI (App Router – `app/page.tsx`) (App Router – `app/page.tsx`)
```tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [sort, setSort] = useState({ by: "ratio", dir: "desc" } as any);
  const [categories, setCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await fetch("/api/topics/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, search, sort }),
    });
    setTopics(await res.json());
  };

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => { fetchData(); }, [search, categoryId, sort]);

  const handleVote = async (topicId: string, value: number) => {
    await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, value }),
    });
    fetchData();
  };

  return (
    <div className="min-h-screen grid grid-cols-12 gap-4 p-4">
      {/* Bal oldali reklám */}
      <aside className="hidden md:block col-span-2 sticky top-4 h-[80vh] border rounded-lg flex items-center justify-center">
        Reklám
      </aside>

      {/* Tartalom */}
      <main className="col-span-12 md:col-span-8 flex flex-col gap-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Szavazó</h1>
          <div>
            {session ? (
              <div className="flex items-center gap-2">
                {/* @ts-ignore */}
                <span className="text-sm">{session.user?.name}</span>
                <button className="px-3 py-1 border rounded" onClick={() => signOut()}>Kilépés</button>
              </div>
            ) : (
              <button className="px-3 py-1 border rounded" onClick={() => signIn("discord")}>Discord belépés</button>
            )}
          </div>
        </header>

        <section className="flex flex-wrap gap-2 items-center">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Keresés…" value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="border rounded px-3 py-2" value={categoryId || ""} onChange={e=>setCategoryId(e.target.value || undefined)}>
            <option value="">Összes kategória</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="border rounded px-3 py-2" value={`${sort.by}:${sort.dir}`} onChange={e=>{
            const [by, dir] = e.target.value.split(":");
            setSort({ by, dir });
          }}>
            <option value="ratio:desc">Pozitív arány ↓ (alap)</option>
            <option value="ratio:asc">Pozitív arány ↑</option>
            <option value="popularity:desc">Népszerűség ↓</option>
            <option value="popularity:asc">Népszerűség ↑</option>
            <option value="positive:desc">Pozitív szavazat ↓</option>
            <option value="negative:desc">Negatív szavazat ↓</option>
          </select>
        </section>

        {session && (
          <TopicForm categories={categories} onCreated={fetchData} />
        )}

        <ul className="grid gap-3">
          {topics.map(t => (
            <li key={t.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="text-sm opacity-80">{t.category?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 border rounded" onClick={()=>handleVote(t.id, 1)}>+1</button>
                  <button className="px-2 py-1 border rounded" onClick={()=>handleVote(t.id, -1)}>-1</button>
                </div>
              </div>
              <p className="text-sm mt-2">{t.description}</p>
              <div className="text-xs mt-2 opacity-70">👍 {t.stats.pos} | 👎 {t.stats.neg} | arány {(t.stats.ratio*100).toFixed(0)}%</div>
            </li>
          ))}
        </ul>
      </main>

      {/* Jobb oldali reklám */}
      <aside className="hidden md:block col-span-2 sticky top-4 h-[80vh] border rounded-lg flex items-center justify-center">
        Reklám
      </aside>
    </div>
  );
}

function TopicForm({ categories, onCreated }: { categories: any[]; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const submit = async () => {
    await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, categoryId }),
    });
    setTitle(""); setDescription("");
    onCreated();
  };

  return (
    <div className="border rounded-lg p-3 flex flex-wrap gap-2 items-center">
      <input className="border rounded px-3 py-2 flex-[2] min-w-[200px]" placeholder="Új topic címe" value={title} onChange={e=>setTitle(e.target.value)} />
      <input className="border rounded px-3 py-2 flex-[3] min-w-[200px]" placeholder="Leírás (opcionális)" value={description} onChange={e=>setDescription(e.target.value)} />
      <select className="border rounded px-3 py-2" value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
        <option value="" disabled>Válassz kategóriát</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button className="px-3 py-2 border rounded" onClick={submit}>Indítás</button>
    </div>
  );
}
```

> A kategória listát kiszolgálja egy egyszerű GET route: `app/api/categories/route.ts` ami `findMany()`‑t hív.

---

## Stílus és hirdetéshelyek
- A két **aside** oszlop fix magasságú sticky konténer – tetszőleges reklám script/iframe behelyezhető.
- Tailwind‑del könnyen reszponzív: a hirdetés mobilon elrejthető (`hidden md:block`).

---

## Lokális futtatás
```bash
pnpm dlx create-next-app@latest
# TypeScript, App Router, Tailwind: igen
pnpm add next-auth @prisma/client prisma
pnpm prisma init
# schema beállítás, majd:
pnpm prisma migrate dev --name init
pnpm dev
```

---

## Telepítés (Vercel + Turso/Neon)
1. DB létrehozás (Turso/Neon). `DATABASE_URL` megadása.
2. Discord OAuth app beállítás, Redirect URL: `https://<domain>/api/auth/callback/discord`.
3. Vercelre import, env változók felvétele (`NEXTAUTH_*`, `DISCORD_*`, `DATABASE_URL`).

---

## Docker Compose (PostgreSQL – saját DB)

### 1) `docker-compose.yml`
```yaml
version: "3.9"
services:
  db:
    image: postgres:16-alpine
    container_name: votes_db
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: votes
    ports:
      - "5432:5432"
    volumes:
      - votes_data:/var/lib/postgresql/data
      - ./docker/db/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d votes"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  pgadmin:
    image: dpage/pgadmin4
    container_name: votes_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@local
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    restart: unless-stopped

volumes:
  votes_data:
  pgadmin_data:
```
> `pgAdmin` opcionális, de kényelmes GUI: http://localhost:5050

### 2) `.env.local` (fejlesztés)
```env
DATABASE_URL="postgresql://app:app@localhost:5432/votes?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=eredeti_hosszú_random
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
```
> **Fontos:** Ha a Next.js appot **szintén Dockerben** futtatod ugyanebben a compose‑ban, a host `localhost` helyett **`db`** legyen: `postgresql://app:app@db:5432/votes?schema=public`.

### 3) Prisma datasource
```prisma
// prisma/schema.prisma
 datasource db {
   provider = "postgresql"
   url      = env("DATABASE_URL")
 }
```

### 4) Indítás, migrációk és seed
```bash
# DB és (opcionális) pgAdmin
docker compose up -d db pgadmin

# Prisma migrációk (a projekt gyökeréből)
pnpm prisma migrate dev --name init

# (opcionális) seed
pnpm prisma db seed

# app
pnpm dev
```

**Seed példa**
```ts
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categories = ["Tech", "Gaming", "Zene", "Sport"]; 
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

main().finally(() => prisma.$disconnect());
```
`package.json`:
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "devDependencies": {
    "ts-node": "^10.9.2"
  }
}
```
> Ha nem akarsz TypeScript seedet, lehet sima JS is (`node prisma/seed.js`).

### 5) Minimális kategória endpoint (lista)
```ts
// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}
```

### 6) Hasznos tippek
- **Perzisztens adatok**: a `votes_data` volume megőrzi a DB‑t container újraépítésnél is.
- **Jogosultság**: prodon ne használj egyszerű `app/app` user‑t; hozz létre erősebb jelszót és külön **app** szerepkört.
- **Backup**: `pg_dump -h localhost -U app votes > backup.sql`.
- **Indexek**: a `@@unique([topicId, userId])` garantálja az 1 szavazat/topik/user szabályt.

---

## Bővítési ötletek
- Rate limit a szavazás API‑n (pl. `upstash/ratelimit`).
- Moderáció (topic törlés/lezárás).
- Közvetlen Discord integráció (webhook értesítések új topicnál).
- SSR/Edge cache a listához (revalidate taggelés, gyors rendezések).

