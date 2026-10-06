# Plan: A2it Dashboard → Multi-Tenant SaaS Platform

## Context

আজ `A2it.USA-dashboard` হলো একটা **single-company** app: একটা Express + MongoDB backend (`a2itUSA.dashboard.backend`) আর একটা Next.js App Router frontend (`a2itUSA.dashboard.frontend`), পুরোটাই একটা company (A2IT LLC)-র জন্য hardcoded।

লক্ষ্য: এটাকে একটা **multi-tenant SaaS** বানানো যেখানে 40 (পরে 1000+) company প্রত্যেকে নিজের website + admin dashboard পাবে, data একে অপরের থেকে সম্পূর্ণ isolated থাকবে।

সিদ্ধান্ত (confirmed):
- **Data isolation:** একটাই database, প্রতি document-এ `tenantId` + compound index (shared-DB multi-tenancy)।
- **Tenant URL:** প্রতি company নিজের **custom domain** (`abc.com`) ব্যবহার করবে — তাই প্রতি request-এ hostname দেখে tenant resolve করতে হবে। Onboarding-এর সুবিধার জন্য প্রতি tenant একটা free platform subdomain-ও পাবে (`abc.platform.com`), একই domain-matching দিয়ে।
- **Architecture style:** এখনকার Express monolith-ই থাকবে — **Modular Monolith + Multi-Tenant**। পরে প্রয়োজনে service আলাদা করা যাবে (gradual migration)।

### এখনকার মূল বাধা (exploration থেকে)
1. **কোনো model-এ `tenantId` নেই** — ১১টা live model, সব query শুধু `isActive`/`status`/`_id` দিয়ে filter করে, কোনো ownership scope নেই ([servicesController.js](a2itUSA.dashboard.backend/controllers/servicesController.js), live blog router [routes/blog.js](a2itUSA.dashboard.backend/routes/blog.js))।
2. **JWT-তে শুধু `{ userId, role }`** — tenant context নেই ([authController.js](a2itUSA.dashboard.backend/controllers/authController.js), [middleware/auth.js](a2itUSA.dashboard.backend/middleware/auth.js))।
3. **Global-unique constraints** যেগুলো multi-tenant ভাঙবে: `User.email`, `Role.name`, `*Category.name/slug`, `BlogPost.slug`, `PromotionalPage.slug`, `PricingPage.key` (singleton doc)।
4. **Single global DB connection** `global.mongoose`-এ cached ([config/db.js](a2itUSA.dashboard.backend/config/db.js)) — shared-DB approach-এ এটা ঠিকই আছে, বদলাতে হবে না।
5. **CORS hardcoded single-company allowlist** ([index.js:37-42](a2itUSA.dashboard.backend/index.js))।
6. **Frontend `output: "export"`** (static) → middleware/SSR নেই, তাই custom-domain→tenant resolution সম্ভব না এখনকার config-এ।
7. ব্র্যান্ড (A2IT LLC) hardcoded frontend metadata/JSON-LD-তে; backend base URL ৩২টা ফাইলে সরাসরি `process.env.NEXT_PUBLIC_API_URL` দিয়ে repeat করা, কোনো central API client নেই।

### Dead code (migration-এ ignore/মুছে ফেলা): 
`controllers/blogController.js`, `routes/blogs.js`, `config/connectMongoDB.js`, `models/usercollectionexercise.js`।

---

## Backend পরিবর্তন (`a2itUSA.dashboard.backend`)

### 1. Tenant model + Platform admin (নতুন)
- নতুন `models/Tenant.js`: `companyName`, `slug`, `domains: [String]` (custom + platform subdomain সব এখানে, lowercase, indexed), `logo`, `theme` (Mixed: colors/fonts), `template`, `contact` (phone/email/address — এখন যেগুলো hardcoded), `status` (`active`/`suspended`/`pending`), `plan`, `subscription` (ref), timestamps। `domains`-এ unique index।
- নতুন `models/Subscription.js`: `tenantId`, `plan` (`basic`/`business`/`premium`), `status` (`active`/`expired`/`cancelled`), `startDate`, `expiryDate`, `features` (Mixed)।
- User model-এ `role` enum-এ `superadmin` যোগ (platform owner, tenant-বিহীন) — নতুন tenant তৈরি/manage করে। Tenant-এর নিজের admin = `admin`, staff = `moderator`।

### 2. প্রতি model-এ `tenantId` (pattern, সব live model-এ এক)
প্রতিটা content model-এ যোগ হবে:
```js
tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true }
```
প্রভাবিত model: `User`, `Role`, `Service`, `ServiceCategory`, `Portfolio`, `PortfolioCategory`, `PromotionalPage`, `PricingPage`, `Employee`, `BlogPost`, `BlogCategory` ([models/](a2itUSA.dashboard.backend/models/))।

Global-unique field গুলো compound unique-এ বদলাবে, যেমন:
```js
// User.js — email ক্ষেত্রে unique:true তুলে দিয়ে
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });
```
একই pattern: `Role {tenantId,name}`, `ServiceCategory/PortfolioCategory {tenantId,name}`, `BlogPost {tenantId,slug}`, `BlogCategory {tenantId,slug}`, `PromotionalPage {tenantId,slug}`, `PricingPage {tenantId,key}`। BlogPost-এর unique-slug generator ([routes/blog.js](a2itUSA.dashboard.backend/routes/blog.js)-এ `pre("save")`) `tenantId` দিয়ে scope করতে হবে।

### 3. Tenant resolution + auth scoping (নতুন middleware)
- নতুন `middleware/resolveTenant.js`: request header (frontend থেকে পাঠানো `X-Tenant-Host` বা `Origin`) থেকে hostname নিয়ে `Tenant.findOne({ domains: host })` করে `req.tenant` সেট করবে; না পেলে 404 "site not found"। Public read endpoint-গুলো এটা দিয়ে scope হবে।
- `middleware/auth.js` আপডেট: JWT payload-এ `tenantId` যোগ ([authController.js](a2itUSA.dashboard.backend/controllers/authController.js)-এর `generateToken`-এ), verify-এর পর `req.tenantId = decoded.tenantId`। Login-এ `User.findOne({ email, tenantId })` — resolved tenant দিয়ে scope (একই email দুই company-তে থাকতে পারে)।
- `superadmin` role tenant-scope bypass করবে (platform-level routes-এর জন্য)।

### 4. Query scoping — সবচেয়ে বড় কাজ (lowest-touch approach)
প্রতিটা controller-এ হাতে filter লেখা আছে, কোনো shared layer নেই। দুই স্তরে সুরক্ষা:
- **Mongoose plugin** `plugins/tenantScope.js` — সব tenant-model-এ apply; একটা helper দেয় যাতে query সহজে scope করা যায়, আর `new Model()`-এ `tenantId` না থাকলে save আটকায় (defense-in-depth)।
- প্রতিটা controller + live `routes/blog.js`-এর `find/findOne/findById/countDocuments/create/update/delete` আপডেট করে `req.tenantId` (বা public হলে `req.tenant._id`) filter যোগ করা হবে। `findById(id)` → `findOne({ _id: id, tenantId })` করতে হবে যাতে এক tenant অন্যের doc edit/delete করতে না পারে। Representative ফাইল: [servicesController.js](a2itUSA.dashboard.backend/controllers/servicesController.js), [portfolioController.js](a2itUSA.dashboard.backend/controllers/portfolioController.js), [pricingPageController.js](a2itUSA.dashboard.backend/controllers/pricingPageController.js), inline [routes/blog.js](a2itUSA.dashboard.backend/routes/blog.js)। PricingPage singleton `findOne({key})` → `findOne({ tenantId, key })`।

### 5. Platform-level routes (নতুন)
- `routes/tenants.js` + `controllers/tenantsController.js`: superadmin-এর জন্য tenant CRUD, domain যোগ/মুছা, status toggle, এবং নতুন tenant provision করার সময় একটা seed (default service/category/pricing doc সহ প্রথম admin user) তৈরি।
- `routes/subscriptions.js`: plan assign/renew, expiry check। Resolve middleware subscription `expired` হলে website-এ "Subscription expired, please renew" response দেবে।

### 6. CORS + infra
- [index.js](a2itUSA.dashboard.backend/index.js)-এর hardcoded CORS allowlist → dynamic origin function যা Tenant collection-এর registered domain গুলোর সাথে match করে (+ platform admin origin)।
- Committed `.env`-এর live secrets (Mongo URI, JWT, SMTP, Cloudinary) **rotate** করতে হবে; fallback hardcoded Mongo string [config/db.js:17-19](a2itUSA.dashboard.backend/config/db.js) মুছে ফেলতে হবে।
- Cloudinary folder per-tenant: `CLOUDINARY_FOLDER_ROOT/<tenantId>/...`।

---

## Frontend পরিবর্তন (`a2itUSA.dashboard.frontend`)

### 1. Static export বাদ → SSR + middleware (custom domain-এর পূর্বশর্ত)
- [next.config.js](a2itUSA.dashboard.frontend/next.config.js) থেকে `output: "export"` সরানো; `images.unoptimized` প্রয়োজনমতো রাখা যায়। এটা ছাড়া hostname-ভিত্তিক tenant resolution সম্ভব না।
- নতুন `middleware.js` (frontend root): incoming request-এর `host` header পড়ে, backend-এর resolve endpoint (বা edge-cached map) দিয়ে tenant যাচাই করে request-এ tenant host পাস করবে (header/cookie), আর unknown host হলে একটা "site not found"/landing-এ পাঠাবে।
- Public page-গুলোর build-time `generateStaticParams` (blog/services `[slug]`) → runtime SSR fetch-এ বদলাতে হবে (per-tenant dynamic content static enumerate করা যায় না)।

### 2. Tenant-aware API layer
- নতুন central `lib/api/client.js`: base URL + বর্তমান host-কে `X-Tenant-Host` header হিসেবে প্রতি request-এ পাঠাবে (server component-এ incoming host, client-এ `window.location.host`)। এখনকার ছড়ানো `process.env.NEXT_PUBLIC_API_URL` fetch গুলো ([authFetch.js](a2itUSA.dashboard.frontend/lib/api/authFetch.js) + ৩২টা ফাইল) ধীরে ধীরে এই client-এ migrate হবে; `authFetch` এটার উপরে auth header যোগ করবে।

### 3. Dynamic branding (hardcoded A2IT LLC সরানো)
- [app/layout.js](a2itUSA.dashboard.frontend/app/layout.js)-এর metadata, JSON-LD, phone/email, canonical domain — সব resolved tenant থেকে আসবে (`generateMetadata` async করে tenant fetch)।
- Theme (color/font/logo) tenant object থেকে CSS variable হিসেবে inject।

### 4. Auth + dashboard
- [context/AuthContext.js](a2itUSA.dashboard.frontend/context/AuthContext.js): login response/`/me`-তে এখন tenant আসবে; token-এ tenantId থাকায় dashboard-এর সব call আপনাআপনি scope হবে। [ProtectedLayoutClient.js](a2itUSA.dashboard.frontend/app/dashboard/ProtectedLayoutClient.js) client-guard-ই থাকছে, কিন্তু SSR হওয়ায় চাইলে server-side guard-ও যোগ করা যায়।
- `superadmin`-এর জন্য নতুন `/admin` (বা `/platform`) section: tenant list, provision, subscription/plan, domain manage। এখনকার `/dashboard` tenant-admin-এর থাকবে।

---

## Phasing (recommended execution order)

1. **Phase 1 — Backend foundation:** `Tenant`/`Subscription` model, সব model-এ `tenantId` + compound index, `resolveTenant` middleware, JWT-তে tenantId, এক module (e.g. Services) end-to-end scope করে pattern দাঁড় করানো।
2. **Phase 2 — Backend query scoping:** বাকি সব controller + blog router scope, platform tenant/subscription routes, dynamic CORS, secret rotation, migration script (existing A2IT data-কে প্রথম tenant-এ assign)।
3. **Phase 3 — Frontend:** static export বাদ, middleware + tenant-aware API client, dynamic branding/theme, public page গুলো SSR-এ।
4. **Phase 4 — Platform admin + onboarding:** superadmin UI, tenant provisioning flow, custom-domain যোগ + SSL (hosting-এ), subscription-expiry UX।

---

## Verification

- **Backend isolation (সবচেয়ে গুরুত্বপূর্ণ):** দুটো test tenant seed করে — Tenant A-র token দিয়ে Tenant B-র document `GET`/`PUT`/`DELETE` করার চেষ্টা; প্রতিটা 404/403 হতে হবে, কখনো cross-tenant data ফেরত আসবে না। প্রতি scoped endpoint-এর জন্য manual বা একটা ছোট integration script (`scripts/`-এ)।
- **Resolution:** দুটো আলাদা host header দিয়ে একই public endpoint hit করলে আলাদা tenant-এর content আসছে কিনা; unknown host → "site not found"; suspended/expired tenant → renew message।
- **Migration:** script চালানোর পর existing A2IT data প্রথম tenant-এ বসেছে, পুরোনো URL-এ site আগের মতোই render হচ্ছে — regression check।
- **Frontend:** `next build` (static export ছাড়া) পাস; dev-এ `/etc/hosts` দিয়ে দুটো fake domain map করে দুই tenant-এর ভিন্ন branding/content যাচাই; dashboard login করে শুধু নিজের tenant-এর data দেখা যাচ্ছে কিনা।
- End-to-end: এক tenant provision → login → একটা service/blog তৈরি → সেই tenant-এর domain-এ public site-এ সেটা দেখা যাচ্ছে, অন্য tenant-এর site-এ নয়।

### ঝুঁকি / মনে রাখার মতো
- Query scoping একটা জায়গায় মিস করলেই data leak — তাই Mongoose plugin দিয়ে default-deny + প্রতি endpoint manual verify দুটোই দরকার।
- Static export বাদ দেওয়ায় hosting/SEO/performance behaviour বদলাবে (এখন pure static CDN, পরে SSR)।
- Custom-domain SSL automation hosting platform-নির্ভর (Vercel/অন্য) — Phase 4-এ আলাদা করে নামানো ভালো।