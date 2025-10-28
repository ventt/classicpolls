This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

Recent open reports:
``` sql
SELECT
  r.id AS report_id,
  r.reason,
  r.details,
  r.status,
  r.createdAt AS reported_at,
  r.handledBy,
  r.handledAt,
  r.note,
  t.id AS topic_id,
  t.title AS topic_title,
  t.createdAt AS topic_created,
  c.name AS category_name,
  u.id AS reporter_id,
  u.name AS reporter_name,
  u.email AS reporter_email,
  (SELECT COUNT(*) FROM "Report" rr WHERE rr."topicId" = t.id AND rr.status = 'OPEN') AS open_reports_for_topic,
  (SELECT COUNT(*) FROM "Vote" v WHERE v."topicId" = t.id AND v.value > 0) AS upvotes,
  (SELECT COUNT(*) FROM "Vote" v WHERE v."topicId" = t.id AND v.value < 0) AS downvotes
FROM "Report" r
LEFT JOIN "Topic" t ON t.id = r."topicId"
LEFT JOIN "Category" c ON c.id = t."categoryId"
LEFT JOIN "User" u ON u.id = r."reporterId"
WHERE r.status = 'OPEN'
ORDER BY r."createdAt" DESC
LIMIT 200;
```

Topics with most open reports (aggregated)

``` sql
SELECT
  t.id AS topic_id,
  t.title,
  t."createdById",
  COUNT(r.*) FILTER (WHERE r.status = 'OPEN') AS open_reports,
  COUNT(r.*) AS total_reports,
  COALESCE(votes.pos,0) AS upvotes,
  COALESCE(votes.neg,0) AS downvotes
FROM "Topic" t
LEFT JOIN "Report" r ON r."topicId" = t.id
LEFT JOIN (
  SELECT "topicId",
    COUNT(*) FILTER (WHERE value > 0) AS pos,
    COUNT(*) FILTER (WHERE value < 0) AS neg
  FROM "Vote"
  GROUP BY "topicId"
) votes ON votes."topicId" = t.id
GROUP BY t.id, votes.pos, votes.neg
HAVING COUNT(r.*) FILTER (WHERE r.status = 'OPEN') > 0
ORDER BY open_reports DESC, total_reports DESC
LIMIT 100;
```