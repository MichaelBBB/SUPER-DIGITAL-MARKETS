09:24:29.128 Running build in Washington, D.C., USA (East) – iad1
09:24:29.129 Build machine configuration: 2 cores, 8 GB
09:24:29.170 Cloning github.com/MichaelBBB/SUPER-DIGITAL-MARKETS (Branch: main, Commit: 891db0c)
09:24:29.171 Skipping build cache, deployment was triggered without cache.
09:24:29.586 Cloning completed: 416.000ms
09:24:29.929 Running "vercel build"
09:24:29.947 Vercel CLI 59.3.0
09:24:30.134 Installing dependencies...
09:24:33.347 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
09:24:33.850 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
09:24:34.044 npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
09:24:45.435 
09:24:45.436 added 527 packages in 15s
09:24:45.436 
09:24:45.436 170 packages are looking for funding
09:24:45.436   run `npm fund` for details
09:24:45.437 npm warn allow-scripts 2 packages have install scripts not yet covered by allowScripts:
09:24:45.439 npm warn allow-scripts   sharp@0.34.5 (install: node install/check.js || npm run build)
09:24:45.439 npm warn allow-scripts   unrs-resolver@1.11.1 (postinstall: napi-postinstall unrs-resolver 1.11.1 check)
09:24:45.439 npm warn allow-scripts
09:24:45.440 npm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.
09:24:45.485 Detected Next.js version: 15.5.18
09:24:45.506 Running "npm run build"
09:24:45.607 
09:24:45.608 > super-digital@0.1.0 build
09:24:45.608 > next build
09:24:45.608 
09:24:46.398 Attention: Next.js now collects completely anonymous telemetry regarding usage.
09:24:46.399 This information is used to shape Next.js' roadmap and prioritize features.
09:24:46.399 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
09:24:46.399 https://nextjs.org/telemetry
09:24:46.400 
09:24:46.481    ▲ Next.js 15.5.18
09:24:46.481 
09:24:46.559    Creating an optimized production build ...
09:24:54.238 Failed to compile.
09:24:54.238 
09:24:54.239 ./src/app/api/peach-checkout/route.ts
09:24:54.239 Module parse failed: Identifier 'NextResponse' has already been declared (85:9)
09:24:54.239 File was processed with these loaders:
09:24:54.240  * ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/index.js
09:24:54.241  * ./node_modules/next/dist/build/webpack/loaders/next-swc-loader.js
09:24:54.241 You may need an additional loader to handle the result of these loaders.
09:24:54.241 |     }
09:24:54.242 | } // src/app/api/peach-checkout/route.ts
09:24:54.242 > import { NextResponse } from 'next/server';
09:24:54.242 | export async function POST(request) {
09:24:54.242 |     // Never let this function crash - always return valid JSON
09:24:54.242 
09:24:54.242 Import trace for requested module:
09:24:54.242 ./src/app/api/peach-checkout/route.ts
09:24:54.242 
09:24:54.244 
09:24:54.244 > Build failed because of webpack errors
09:24:54.282 Error: Command "npm run build" exited with 1
