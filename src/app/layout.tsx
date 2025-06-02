import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Using Geist as per project setup
import Head from 'next/head'; // Import Head for placing tags in <head>
import Script from 'next/script'; // Import Script for optimized script loading
import './globals1.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { PlayerProvider } from '@/contexts/PlayerContext';

const geistSans = Geist({ // Using Geist Sans
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Using Geist Mono
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KeyFind - Stream Premium Content', // Updated title
  description: 'Watch premium videos and read exclusive articles', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <Head>
        {/* BBC Sounds CSS Files - Loaded directly in Head */}
        <link
          rel="stylesheet"
          href="https://static.files.bbci.co.uk/sounds/web/sounds-web/css/sounds.b5f058e20032d7f8020f.css"
        />
        <link
          rel="stylesheet"
          href="https://static.files.bbci.co.uk/orbit/bde9d3f679d1dd3f8768859cc949031d/css/orbit-ltr.min.css"
        />
        {/* The following is a duplicate from your example, usually one is enough */}
        {/* <link
          rel="stylesheet"
          href="https://static.files.bbci.co.uk/sounds/web/sounds-web/css/sounds.b5f058e20032d7f8020f.css"
        /> */}
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <PlayerProvider>
            {children}
            <Toaster />
          </PlayerProvider>
        </AuthProvider>

        {/* BBC Sounds JavaScript Files - Using next/script for better control */}
        {/* These are placed before the closing </body> tag */}
        <Script src="https://nav.files.bbci.co.uk/orbit/3.0.0-536.85fa13b8/js/api.min.js" strategy="beforeInteractive" />
        <Script src="https://static.files.bbci.co.uk/sounds/web/sounds-web/js/vendor.b5f058e20032d7f8020f.js" strategy="beforeInteractive" />
        {/* main.js and sounds.js might depend on vendor.js, so load them after */}
        <Script src="https://static.files.bbci.co.uk/sounds/web/sounds-web/js/main.b5f058e20032d7f8020f.js" strategy="lazyOnload" />
        <Script src="https://static.files.bbci.co.uk/sounds/web/sounds-web/js/sounds.b5f058e20032d7f8020f.js" strategy="lazyOnload" />
        
        {/* BBC Modules - These often depend on the main scripts */}
        <Script src="https://static.files.bbci.co.uk/account/id-cta/738/js/id-cta.js" strategy="lazyOnload" />
        <Script src="https://mybbc.files.bbci.co.uk/notification-ui/5.2.0/js/notifications.js" strategy="lazyOnload" />
        <Script src="https://static.files.bbci.co.uk/reverb/3.9.2/reverb.js" strategy="lazyOnload" />
        <Script src="https://static.files.bbci.co.uk/cookies/0.0.5-223.cc07cea/js/cookies.js" strategy="lazyOnload" />
        <Script src="https://static.files.bbci.co.uk/ukomtracking/1.1.2/js/ukomtracking.js" strategy="lazyOnload" />
        
        {/* Analytics - Often safe to load lazily */}
        <Script src="https://sa.bbc.co.uk/bbc/bbc/s?name=sounds.play.episode&ml_name=webmodule&ml_version=3.9.2&language=en&pal_route=episode&app_name=sounds&app_version=3.9.2&prod_name=sounds&bbc_site=sounds" strategy="lazyOnload" />
        
        {/* Initialize BBC Modules - This should run after the dependent scripts are loaded */}
        <Script id="bbc-module-init" strategy="lazyOnload">
          {`
            if (typeof require !== 'undefined') {
              try {
                require(['orb/api'], function(orbApi) {
                  if (orbApi && typeof orbApi.init === 'function') orbApi.init();
                });
              } catch (e) { console.error("Error initializing orbApi:", e); }

              try {
                require(['idcta/idcta-1'], function(idcta) {
                  if (idcta && typeof idcta.init === 'function') idcta.init();
                });
              } catch (e) { console.error("Error initializing idcta:", e); }

              try {
                require(['reverb/reverb-3'], function(reverb) {
                  if (reverb && typeof reverb.init === 'function') reverb.init();
                });
              } catch (e) { console.error("Error initializing reverb:", e); }
            } else {
              console.warn("RequireJS (or equivalent) not loaded by BBC scripts, manual initialization might be needed or some features may not work.");
            }
          `}
        </Script>
        
        {/* Optimizely and other post-content scripts */}
        <Script src="https://cdn.optimizely.com/js/4802190303.js" strategy="lazyOnload" />
        <Script id="bbc-page-setup" strategy="lazyOnload">
          {`
            window.bbcpage = window.bbcpage || {};
            window.bbcpage.loadModule = window.bbcpage.loadModule || function(deps) {
              return new Promise(function (resolve, reject) {
                if (typeof require !== 'undefined') {
                  require(deps, function () {
                    resolve.apply(this, arguments);
                  }, function(err) {
                    console.error("Error loading BBC module:", deps, err);
                    reject(err);
                  });
                } else {
                  console.warn("RequireJS not available for bbcpage.loadModule for deps:", deps);
                  reject(new Error("RequireJS not available"));
                }
              });
            };
          `}
        </Script>
      </body>
    </html>
  );
}
