import { Metadata } from 'next';
import Script from 'next/script';

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const APPLE_APP_ID = "6748680628";

    return {
        title: `Share Clone ${id} - LinClone`,
        other: {
            "apple-itunes-app": `app-id=${APPLE_APP_ID}, app-argument=https://linclonelanding-page.vercel.app/share/clone/${id}`,
        },
    };
}

export default async function ShareClonePage({ params }: Props) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Opening LinClone...</h1>
            <p className="mb-8">If the app doesn't open automatically, please click the button below.</p>

            <Script id="app-redirect" strategy="afterInteractive">
                {`
          // Enhanced device detection including iPad-specific checks
          function isIPad() {
            var ua = navigator.userAgent;
            // Check for explicit iPad in user agent
            if (/iPad/i.test(ua)) return true;
            
            // iPadOS 13+ reports as Mac, so check for touch support
            if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
            
            return false;
          }
          
          function isIPhone() {
            return /iPhone|iPod/i.test(navigator.userAgent) && !isIPad();
          }
          
          function isAndroid() {
            return /Android/i.test(navigator.userAgent);
          }
          
          function isMobile() {
            return isIPhone() || isIPad() || isAndroid();
          }
          
          if (isMobile()) {
            var appStoreUrl = "https://apps.apple.com/app/linclone/id6748680628";
            var playStoreUrl = "https://play.google.com/store/apps/details?id=com.linclone.app";
            
            // Try to open the app using custom URL scheme
            var deepLinkUrl = "linclone://share/clone/${id}";
            
            if (isIPhone() || isIPad()) {
              // For iOS devices (iPhone and iPad)
              // First try the deep link
              window.location.href = deepLinkUrl;
              
              // If app doesn't open within 2 seconds, redirect to App Store
              setTimeout(function() {
                window.location.href = appStoreUrl;
              }, 2000);
            } else if (isAndroid()) {
              // For Android devices
              window.location.href = deepLinkUrl;
              
              setTimeout(function() {
                window.location.href = playStoreUrl;
              }, 2000);
            }
          }
        `}
            </Script>

            <div className="flex gap-4">
                <a
                    href="https://apps.apple.com/app/linclone/id6748680628"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Download on App Store
                </a>
                <a
                    href="https://play.google.com/store/apps/details?id=com.linclone.app"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                    Get it on Google Play
                </a>
            </div>
        </div>
    );
}
