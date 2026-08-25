21:27:42.791 Running build in Washington, D.C., USA (East) – iad1
21:27:42.791 Build machine configuration: 2 cores, 8 GB
21:27:42.831 Cloning github.com/MichaelBBB/SUPER-DIGITAL-MARKETS (Branch: main, Commit: a8491bb)
21:27:42.832 Skipping build cache, deployment was triggered without cache.
21:27:44.108 Cloning completed: 1.277s
21:27:44.452 Running "vercel build"
21:27:44.470 Vercel CLI 59.3.0
21:27:44.642 Installing dependencies...
21:27:47.440 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
21:27:47.965 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
21:27:48.014 npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
21:27:57.053 
21:27:57.053 added 527 packages in 12s
21:27:57.053 
21:27:57.053 170 packages are looking for funding
21:27:57.053   run `npm fund` for details
21:27:57.054 npm warn allow-scripts 2 packages have install scripts not yet covered by allowScripts:
21:27:57.054 npm warn allow-scripts   sharp@0.34.5 (install: node install/check.js || npm run build)
21:27:57.054 npm warn allow-scripts   unrs-resolver@1.11.1 (postinstall: napi-postinstall unrs-resolver 1.11.1 check)
21:27:57.054 npm warn allow-scripts
21:27:57.055 npm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.
21:27:57.097 Detected Next.js version: 15.5.18
21:27:57.104 Running "npm run build"
21:27:57.249 
21:27:57.249 > super-digital@0.1.0 build
21:27:57.250 > next build
21:27:57.250 
21:27:57.986 Attention: Next.js now collects completely anonymous telemetry regarding usage.
21:27:57.986 This information is used to shape Next.js' roadmap and prioritize features.
21:27:57.986 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
21:27:57.986 https://nextjs.org/telemetry
21:27:57.986 
21:27:58.093    ▲ Next.js 15.5.18
21:27:58.094 
21:27:58.217    Creating an optimized production build ...
21:28:03.612 Failed to compile.
21:28:03.613 
21:28:03.614 ./src/app/payment/page.tsx
21:28:03.614 Module not found: Can't resolve './CheckoutForm'
21:28:03.614 
21:28:03.614 https://nextjs.org/docs/messages/module-not-found
21:28:03.614 
21:28:03.627 
21:28:03.627 > Build failed because of webpack errors
21:28:03.665 Error: Command "npm run build" exited with 1
