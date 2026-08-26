09:34:14.711 Running build in Washington, D.C., USA (East) – iad1
09:34:14.712 Build machine configuration: 2 cores, 8 GB
09:34:14.751 Cloning github.com/MichaelBBB/SUPER-DIGITAL-MARKETS (Branch: main, Commit: b776c7b)
09:34:14.752 Skipping build cache, deployment was triggered without cache.
09:34:15.148 Cloning completed: 397.000ms
09:34:15.456 Running "vercel build"
09:34:15.472 Vercel CLI 59.3.0
09:34:15.686 Installing dependencies...
09:34:18.162 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
09:34:18.582 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
09:34:18.651 npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
09:34:27.456 
09:34:27.457 added 527 packages in 12s
09:34:27.458 
09:34:27.458 170 packages are looking for funding
09:34:27.459   run `npm fund` for details
09:34:27.459 npm warn allow-scripts 2 packages have install scripts not yet covered by allowScripts:
09:34:27.460 npm warn allow-scripts   sharp@0.34.5 (install: node install/check.js || npm run build)
09:34:27.460 npm warn allow-scripts   unrs-resolver@1.11.1 (postinstall: napi-postinstall unrs-resolver 1.11.1 check)
09:34:27.460 npm warn allow-scripts
09:34:27.460 npm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.
09:34:27.503 Detected Next.js version: 15.5.18
09:34:27.508 Running "npm run build"
09:34:27.669 
09:34:27.670 > super-digital@0.1.0 build
09:34:27.670 > next build
09:34:27.670 
09:34:28.856 Attention: Next.js now collects completely anonymous telemetry regarding usage.
09:34:28.857 This information is used to shape Next.js' roadmap and prioritize features.
09:34:28.857 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
09:34:28.857 https://nextjs.org/telemetry
09:34:28.857 
09:34:28.957    ▲ Next.js 15.5.18
09:34:28.961 
09:34:29.100    Creating an optimized production build ...
09:34:40.941  ✓ Compiled successfully in 9.5s
09:34:40.944    Linting and checking validity of types ...
09:34:45.109    Collecting page data ...
09:34:46.362    Generating static pages (0/20) ...
09:34:47.120    Generating static pages (5/20) 
09:34:47.122    Generating static pages (10/20) 
09:34:47.178    Generating static pages (15/20) 
09:34:47.279  ✓ Generating static pages (20/20)
09:34:47.580    Finalizing page optimization ...
09:34:47.580    Collecting build traces ...
09:34:51.621 
09:34:51.624 Route (app)                                      Size  First Load JS
09:34:51.624 ┌ ○ /                                         2.78 kB         109 kB
09:34:51.624 ├ ○ /_not-found                                 148 B         103 kB
09:34:51.624 ├ ○ /admin/sales                              1.22 kB         104 kB
09:34:51.624 ├ ƒ /api                                        148 B         103 kB
09:34:51.624 ├ ƒ /api/checkout                               148 B         103 kB
09:34:51.624 ├ ƒ /api/create-payment                         148 B         103 kB
09:34:51.624 ├ ƒ /api/peach-checkout                         148 B         103 kB
09:34:51.624 ├ ƒ /api/peach/create-checkout                  148 B         103 kB
09:34:51.624 ├ ƒ /api/sales                                  148 B         103 kB
09:34:51.624 ├ ƒ /api/webhooks/peach                         148 B         103 kB
09:34:51.624 ├ ○ /checkout                                  3.2 kB         109 kB
09:34:51.624 ├ ○ /checkout/components/app/payment-methods  3.18 kB         109 kB
09:34:51.624 ├ ƒ /payment                                   3.4 kB         109 kB
09:34:51.626 ├ ○ /payment/success                            553 B         106 kB
09:34:51.626 ├ ○ /products                                 3.37 kB         109 kB
09:34:51.626 ├ ○ /robots.txt                                 148 B         103 kB
09:34:51.626 ├ ○ /sitemap.xml                                148 B         103 kB
09:34:51.626 └ ○ /success                                  2.31 kB         108 kB
09:34:51.626 + First Load JS shared by all                  102 kB
09:34:51.627   ├ chunks/255-4f84124391a7dac4.js            46.2 kB
09:34:51.627   ├ chunks/4bd1b696-c023c6e3521b1417.js       54.2 kB
09:34:51.627   └ other shared chunks (total)               1.92 kB
09:34:51.627 
09:34:51.628 
09:34:51.628 ○  (Static)   prerendered as static content
09:34:51.628 ƒ  (Dynamic)  server-rendered on demand
09:34:51.628 
09:34:51.764 Traced Next.js server files in: 42.219ms
09:34:51.967 Created all serverless functions in: 202.437ms
09:34:52.001 Collected static files (public/, static/, .next/static): 29.528ms
09:34:52.123 Build Completed in /vercel/output [36s]
09:34:52.143 Deploying outputs...
