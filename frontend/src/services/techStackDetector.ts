import type { TechStackFinding } from '../types';

/**
 * Tech Stack Detection Engine.
 * Complete 1:1 port of detectTechStack() from HEARTCODE.html lines 2983-3283.
 * All 200+ technology fingerprints across all categories preserved exactly.
 */
export function detectTechStack(html: string): TechStackFinding[] {
  const techs: TechStackFinding[] = [];

  function add(cat: string, name: string, icon: string, evidence: string) {
    if (!techs.find((t) => t.name === name)) {
      techs.push({ cat, name, icon, evidence });
    }
  }

  /* ── CMS ── */
  if (/wp-content|wp-includes|wordpress/i.test(html)) add('CMS', 'WordPress', '📰', 'wp-content / wp-includes path');
  if (/drupal|Drupal\.settings/i.test(html)) add('CMS', 'Drupal', '💧', 'Drupal.settings global');
  if (/joomla|\/components\/com_/i.test(html)) add('CMS', 'Joomla', '🔵', 'Joomla component path');
  if (/ghost-url|ghost\.io|content\.ghost\.io/i.test(html)) add('CMS', 'Ghost', '👻', 'Ghost CMS API/CDN');
  if (/contentful\.com|@contentful/i.test(html)) add('CMS', 'Contentful', '📦', 'Contentful CDN or SDK');
  if (/sanity\.io|@sanity\/client/i.test(html)) add('CMS', 'Sanity', '🟢', 'Sanity.io CMS');
  if (/strapi|strapi-admin/i.test(html)) add('CMS', 'Strapi', '🎮', 'Strapi headless CMS');
  if (/prismic\.io|@prismicio/i.test(html)) add('CMS', 'Prismic', '🔷', 'Prismic CMS');
  if (/builder\.io|@builder\.io/i.test(html)) add('CMS', 'Builder.io', '🏗', 'Builder.io visual CMS');
  if (/storyblok\.com|@storyblok/i.test(html)) add('CMS', 'Storyblok', '🟩', 'Storyblok headless CMS');
  if (/payload-cms|@payloadcms/i.test(html)) add('CMS', 'Payload CMS', '📦', 'Payload headless CMS');
  if (/hygraph\.com|graphcms\.com/i.test(html)) add('CMS', 'Hygraph', '📊', 'Hygraph (GraphCMS)');
  if (/typo3|TYPO3\.lang/i.test(html)) add('CMS', 'TYPO3', '🔴', 'TYPO3 CMS');
  if (/kirby-panel|getkirby\.com/i.test(html)) add('CMS', 'Kirby', '🌀', 'Kirby CMS');
  if (/craft\.cms|CraftCMS/i.test(html)) add('CMS', 'Craft CMS', '⚒', 'Craft CMS');

  /* ── E-COMMERCE ── */
  if (/shopify\.com|Shopify\.theme|cdn\.shopify/i.test(html)) add('E-Commerce', 'Shopify', '🛍', 'Shopify CDN/theme');
  if (/woocommerce|wc-cart|woocommerce-page/i.test(html)) add('E-Commerce', 'WooCommerce', '🛒', 'WooCommerce WordPress plugin');
  if (/magento|Mage\.Cookies|mage\/cookies/i.test(html)) add('E-Commerce', 'Magento', '🟠', 'Magento e-commerce');
  if (/bigcommerce\.com|stencil\.|BigCommerce/i.test(html)) add('E-Commerce', 'BigCommerce', '🟦', 'BigCommerce platform');
  if (/saleor\.api|saleor-dashboard/i.test(html)) add('E-Commerce', 'Saleor', '🟢', 'Saleor commerce API');
  if (/medusajs\.com|@medusajs/i.test(html)) add('E-Commerce', 'Medusa.js', '🛒', 'Medusa.js commerce');
  if (/commercetools\.com|@commercetools/i.test(html)) add('E-Commerce', 'commercetools', '⚙️', 'commercetools platform');

  /* ── PAGE BUILDERS ── */
  if (/elementor|elementor-widget/i.test(html)) add('Page Builder', 'Elementor', '📐', 'Elementor page builder');
  if (/divi-builder|et_builder/i.test(html)) add('Page Builder', 'Divi Builder', '🎨', 'Elegant Themes Divi');
  if (/beaverbuilder|fl-builder/i.test(html)) add('Page Builder', 'Beaver Builder', '🦫', 'WP Beaver Builder');
  if (/framer\.com\/m|FramerApp/i.test(html)) add('Page Builder', 'Framer', '🎬', 'Framer visual builder');
  if (/webflow\.com|wf-form|WebflowBadge/i.test(html)) add('Page Builder', 'Webflow', '🌊', 'Webflow CMS/builder');
  if (/wix\.com|wixsite\.com|wix-thunderbolt/i.test(html)) add('Page Builder', 'Wix', '🟡', 'Wix website builder');
  if (/squarespace\.com|sqsp/i.test(html)) add('Page Builder', 'Squarespace', '⬛', 'Squarespace builder');

  /* ── JS FRAMEWORKS ── */
  if (/__NEXT_DATA__|next\/dist|_next\/static/i.test(html)) add('Framework', 'Next.js', '▲', 'Next.js __NEXT_DATA__ global');
  if (/nuxt-link|__NUXT__|_nuxt\//i.test(html)) add('Framework', 'Nuxt.js', '💚', 'Nuxt.js __NUXT__ global');
  if (/ng-version|angular\.min|@angular\/core/i.test(html)) add('Framework', 'Angular', '🔴', 'Angular ng-version attribute');
  if (/data-reactroot|react-dom|__react_fiber/i.test(html)) add('Framework', 'React', '⚛', 'React root / fiber');
  if (/vue\.min|__vue__|VueRouter|@vue\/|createApp/i.test(html)) add('Framework', 'Vue.js', '💚', 'Vue createApp / global');
  if (/svelte-|__svelte|SvelteKit/i.test(html)) add('Framework', 'Svelte / SvelteKit', '🧡', 'Svelte component marker');
  if (/ember\.min|Ember\.Application|@ember\//i.test(html)) add('Framework', 'Ember.js', '🐹', 'Ember Application');
  if (/backbone\.min|Backbone\.Router/i.test(html)) add('Framework', 'Backbone.js', '🦴', 'Backbone.Router');
  if (/\bqwik\b|@builder\.io\/qwik/i.test(html)) add('Framework', 'Qwik', '⚡', 'Qwik framework');
  if (/astro-island|astro:page-load/i.test(html)) add('Framework', 'Astro', '🚀', 'Astro island component');
  if (/remix-island|@remix-run/i.test(html)) add('Framework', 'Remix', '💿', 'Remix web framework');
  if (/solid-js|solid-start|SolidJS/i.test(html)) add('Framework', 'SolidJS', '🔵', 'SolidJS framework');
  if (/lit-html|@lit\/|LitElement/i.test(html)) add('Framework', 'Lit', '🔥', 'Lit web components');
  if (/htmx\.org|hx-get|hx-post|hx-swap/i.test(html)) add('Framework', 'HTMX', '🌐', 'HTMX attributes');
  if (/alpinejs|x-data=|x-bind=|Alpine\./i.test(html)) add('Framework', 'Alpine.js', '🏔', 'Alpine.js x-data directive');
  if (/stimulus-|data-controller=.*stimulus/i.test(html)) add('Framework', 'Stimulus', '🎮', 'Stimulus controller');
  if (/inertiajs|@inertiajs/i.test(html)) add('Framework', 'Inertia.js', '🔗', 'Inertia.js adapter');

  /* ── CSS FRAMEWORKS ── */
  if (/tailwindcss|cdn\.tailwindcss|class="[^"]*(?:flex|grid|px-|py-)[^"]*"/i.test(html)) add('Library', 'Tailwind CSS', '💨', 'Tailwind utility classes');
  if (/bootstrap\.min|bootstrap\.css|bootstrap\.bundle/i.test(html)) add('Library', 'Bootstrap', '🅱', 'Bootstrap CSS/JS bundle');
  if (/materialize\.min|materialize-css/i.test(html)) add('Library', 'Materialize CSS', '🎨', 'Materialize framework');
  if (/bulma\.min|bulma\.css/i.test(html)) add('Library', 'Bulma', '💪', 'Bulma CSS framework');
  if (/foundation\.min|foundation\.css/i.test(html)) add('Library', 'Foundation', '🏛', 'Zurb Foundation');
  if (/chakra-ui|@chakra-ui/i.test(html)) add('Library', 'Chakra UI', '⚡', 'Chakra UI components');
  if (/shadcn|shadcn-ui|@shadcn/i.test(html)) add('Library', 'shadcn/ui', '🎨', 'shadcn/ui components');
  if (/radix-ui|@radix-ui/i.test(html)) add('Library', 'Radix UI', '🔵', 'Radix UI primitives');
  if (/mui\.com|@mui\/|material-ui/i.test(html)) add('Library', 'Material UI', '🔷', 'Material UI (MUI) component');
  if (/ant-design|antd\.min|@ant-design/i.test(html)) add('Library', 'Ant Design', '🐜', 'Ant Design component library');
  if (/mantine\.dev|@mantine\//i.test(html)) add('Library', 'Mantine', '💙', 'Mantine UI components');
  if (/daisyui|daisy-ui/i.test(html)) add('Library', 'DaisyUI', '🌼', 'DaisyUI components');

  /* ── JS LIBRARIES ── */
  if (/jquery\.min|jQuery\.fn|jquery-\d/i.test(html)) add('Library', 'jQuery', '💲', 'jQuery core library');
  if (/lodash\.min|_\.forEach|lodash\//i.test(html)) add('Library', 'Lodash', '🔧', 'Lodash utility library');
  if (/axios\.min|axios\.create|axios\/dist/i.test(html)) add('Library', 'Axios', '📡', 'Axios HTTP client');
  if (/moment\.min|moment\.js|moment\.format/i.test(html)) add('Library', 'Moment.js', '⏰', 'Moment.js date library');
  if (/dayjs\.min|dayjs\//i.test(html)) add('Library', 'Day.js', '📅', 'Day.js date library');
  if (/chart\.js|chartjs|Chart\.register/i.test(html)) add('Library', 'Chart.js', '📊', 'Chart.js data visualisation');
  if (/d3\.min|d3-selection|d3\.select/i.test(html)) add('Library', 'D3.js', '📈', 'D3 data-driven docs');
  if (/gsap\.min|TweenMax|gsap\.to/i.test(html)) add('Library', 'GSAP', '🎯', 'GSAP animation library');
  if (/three\.min|THREE\.Scene|three\/build/i.test(html)) add('Library', 'Three.js', '🎲', 'Three.js 3D library');
  if (/swiper\.min|Swiper\.|swiper-container/i.test(html)) add('Library', 'Swiper', '👆', 'Swiper touch slider');
  if (/socket\.io|io\(\)|socket-io/i.test(html)) add('Library', 'Socket.io', '🔌', 'Socket.io WebSocket');
  if (/react-query|@tanstack\/react-query/i.test(html)) add('Library', 'TanStack Query', '🔄', 'TanStack React Query');
  if (/zustand|useStore|create\(.*set =>/i.test(html)) add('Library', 'Zustand', '🐻', 'Zustand state manager');
  if (/redux-toolkit|@reduxjs\/toolkit|configureStore/i.test(html)) add('Library', 'Redux Toolkit', '🔴', 'Redux Toolkit state');
  if (/react-hook-form|useForm\(\)|@hookform/i.test(html)) add('Library', 'React Hook Form', '📋', 'React Hook Form');
  if (/zod\.min|z\.object|z\.string\(\)/i.test(html)) add('Library', 'Zod', '⚡', 'Zod schema validation');
  if (/framer-motion|motion\.div|AnimatePresence/i.test(html)) add('Library', 'Framer Motion', '🎬', 'Framer Motion animations');

  /* ── ANALYTICS ── */
  if (/google-analytics|ga\('send'|gtag\(|analytics\.js/i.test(html)) add('Analytics', 'Google Analytics', '📊', 'GA/gtag snippet');
  if (/googletagmanager\.com|GTM-[A-Z0-9]+/i.test(html)) add('Analytics', 'Google Tag Manager', '🏷', 'GTM container');
  if (/plausible\.io|Plausible\./i.test(html)) add('Analytics', 'Plausible', '📊', 'Plausible analytics');
  if (/fathom-analytics|useFathom/i.test(html)) add('Analytics', 'Fathom', '📈', 'Fathom analytics');
  if (/posthog\.com|posthog\.identify|@posthog\//i.test(html)) add('Analytics', 'PostHog', '🦔', 'PostHog product analytics');
  if (/mixpanel\.com|mixpanel\.track/i.test(html)) add('Analytics', 'Mixpanel', '📊', 'Mixpanel event tracking');
  if (/segment\.com|analytics\.identify|@segment\//i.test(html)) add('Analytics', 'Segment', '🔵', 'Segment CDP');
  if (/amplitude\.com|amplitude\.init/i.test(html)) add('Analytics', 'Amplitude', '📉', 'Amplitude analytics');
  if (/clarity\.ms|microsoft.*clarity|clarityProjectId/i.test(html)) add('Analytics', 'Microsoft Clarity', '🔵', 'MS Clarity heatmaps');
  if (/hotjar\.com|hj\('|hotjar/i.test(html)) add('Analytics', 'Hotjar', '🔥', 'Hotjar heatmap');

  /* ── BACKEND / HOSTING ── */
  if (/firebase\.app|firebase-app|initializeApp/i.test(html)) add('Backend', 'Firebase', '🔥', 'Firebase SDK');
  if (/supabase\.co|@supabase\/supabase/i.test(html)) add('Backend', 'Supabase', '⚡', 'Supabase client');
  if (/pocketbase\.io|PocketBase\./i.test(html)) add('Backend', 'PocketBase', '📦', 'PocketBase backend');
  if (/convex\.dev|@convex-dev/i.test(html)) add('Backend', 'Convex', '🔄', 'Convex real-time DB');
  if (/appwrite\.io|@appwrite\//i.test(html)) add('Backend', 'Appwrite', '✏️', 'Appwrite backend');
  if (/hasura\.io|hasura-graphql/i.test(html)) add('Backend', 'Hasura', '🔷', 'Hasura GraphQL engine');
  if (/graphql\.|ApolloClient|@apollo\/client/i.test(html)) add('Backend', 'GraphQL / Apollo', '🔮', 'GraphQL or Apollo Client');
  if (/trpc\.io|@trpc\/client/i.test(html)) add('Backend', 'tRPC', '🔗', 'tRPC typesafe API');
  if (/vercel\.com|_vercel|VERCEL_/i.test(html)) add('Backend', 'Vercel', '▲', 'Vercel deployment');
  if (/netlify\.com|netlify-identity|NETLIFY/i.test(html)) add('Backend', 'Netlify', '💚', 'Netlify deployment');
  if (/cloudflare\.com|cf-ray|__cfwaitingroom/i.test(html)) add('Backend', 'Cloudflare', '🔶', 'Cloudflare CDN/Workers');
  if (/amazonaws\.com|s3\.amazonaws/i.test(html)) add('Backend', 'AWS', '☁️', 'Amazon Web Services');

  /* ── AUTH ── */
  if (/clerk\.dev|@clerk\/|clerk-js/i.test(html)) add('Auth', 'Clerk', '🔐', 'Clerk auth provider');
  if (/auth0\.com|auth0-js|@auth0\//i.test(html)) add('Auth', 'Auth0', '🔒', 'Auth0 identity platform');
  if (/next-auth|@auth\/core|NextAuth/i.test(html)) add('Auth', 'NextAuth.js', '🔑', 'NextAuth / Auth.js');
  if (/magic\.link|magic-sdk|MagicProvider/i.test(html)) add('Auth', 'Magic Link', '✨', 'Magic passwordless auth');
  if (/okta\.com|okta-auth|OktaAuth/i.test(html)) add('Auth', 'Okta', '🔵', 'Okta identity platform');
  if (/cognito|aws-amplify.*auth|CognitoUser/i.test(html)) add('Auth', 'AWS Cognito', '🔐', 'AWS Cognito auth');
  if (/keycloak|Keycloak\.|keycloak-js/i.test(html)) add('Auth', 'Keycloak', '🔑', 'Keycloak OAuth');
  if (/lucia-auth|@lucia-auth/i.test(html)) add('Auth', 'Lucia Auth', '🔒', 'Lucia auth library');

  /* ── PAYMENTS ── */
  if (/stripe\.com\/v3|Stripe\(/i.test(html)) add('Payments', 'Stripe', '💳', 'Stripe.js v3');
  if (/paypal\.com\/sdk|paypal\.Buttons/i.test(html)) add('Payments', 'PayPal', '💳', 'PayPal SDK');
  if (/braintreegateway\.com|braintree-web/i.test(html)) add('Payments', 'Braintree', '💳', 'Braintree payments');
  if (/square\.com\/pay|squareup\.com\/payments/i.test(html)) add('Payments', 'Square', '🟦', 'Square payments');
  if (/adyen\.com|AdyenCheckout/i.test(html)) add('Payments', 'Adyen', '🟢', 'Adyen payment gateway');
  if (/paddle\.com|paddle-js|Paddle\.Setup/i.test(html)) add('Payments', 'Paddle', '🏓', 'Paddle billing');
  if (/lemon\.squeezy|lemonsqueezy/i.test(html)) add('Payments', 'Lemon Squeezy', '🍋', 'Lemon Squeezy billing');
  if (/gumroad\.com|gumroad-script/i.test(html)) add('Payments', 'Gumroad', '💚', 'Gumroad e-commerce');

  /* ── FONTS ── */
  if (/fonts\.googleapis\.com/i.test(html)) {
    const fonts = (html.match(/family=([^&"'\s<>]+)/gi) || [])
      .map((f) => decodeURIComponent(f.replace('family=', '').split(':')[0].replace(/\+/g, ' ')))
      .filter(Boolean);
    add('Fonts', 'Google Fonts', '🔤', fonts.length ? fonts.slice(0, 5).join(', ') : 'Google Fonts CDN');
  }
  if (/use\.typekit\.net|typekit\.com/i.test(html)) add('Fonts', 'Adobe Fonts', '🅰', 'Adobe Fonts CDN');
  if (/fonts\.bunny\.net/i.test(html)) add('Fonts', 'Bunny Fonts', '🐰', 'Bunny Fonts CDN');
  if (/rsms\.me\/inter|inter-font/i.test(html)) add('Fonts', 'Inter Font', '🔤', 'Inter typeface CDN');
  if (/fontawesome\.com|fa-solid|fa-brands|fontawesome/i.test(html)) add('Fonts', 'Font Awesome', '⭐', 'Font Awesome icons');
  if (/lucide\.dev|lucide-react|lucide-icons/i.test(html)) add('Fonts', 'Lucide Icons', '✨', 'Lucide icon library');
  if (/heroicons\.com|@heroicons/i.test(html)) add('Fonts', 'Heroicons', '🦸', 'Heroicons SVG icons');
  if (/phosphoricons\.com|@phosphor-icons/i.test(html)) add('Fonts', 'Phosphor Icons', '⚗️', 'Phosphor icons');
  if (/remixicon\.com|ri-home|remixicon/i.test(html)) add('Fonts', 'Remix Icons', '🎨', 'Remix icon library');
  if (/tabler\.io\/icons|@tabler\/icons/i.test(html)) add('Fonts', 'Tabler Icons', '📐', 'Tabler icon library');

  /* ── SECURITY ── */
  if (/recaptcha\.net|recaptcha\/api|grecaptcha/i.test(html)) add('Security', 'Google reCAPTCHA', '🛡', 'reCAPTCHA script');
  if (/hcaptcha\.com|hcaptcha/i.test(html)) add('Security', 'hCaptcha', '🛡', 'hCaptcha challenge');
  if (/cloudflare\.com\/turnstile|cf-turnstile/i.test(html)) add('Security', 'Cloudflare Turnstile', '🛡', 'Turnstile CAPTCHA');
  if (/arcjet\.com|arcjet-protect/i.test(html)) add('Security', 'Arcjet', '🛡', 'Arcjet security');

  /* ── MAPS / GEO ── */
  if (/maps\.googleapis\.com|google\.maps|google-maps-api/i.test(html)) add('Maps', 'Google Maps', '🗺', 'Google Maps API');
  if (/leaflet\.js|L\.map\(|leaflet\.css/i.test(html)) add('Maps', 'Leaflet', '🗺', 'Leaflet map library');
  if (/openstreetmap\.org|nominatim/i.test(html)) add('Maps', 'OpenStreetMap', '🗺', 'OSM/Nominatim API');
  if (/mapbox\.com|mapboxgl\.|mapbox-gl/i.test(html)) add('Maps', 'Mapbox', '🗺', 'Mapbox GL JS');
  if (/here\.com|HERE\.Map|platform\.here\.com/i.test(html)) add('Maps', 'HERE Maps', '🗺', 'HERE Maps API');
  if (/maptiler\.com|MapTilerClient/i.test(html)) add('Maps', 'MapTiler', '🗺', 'MapTiler SDK');

  /* ── VIDEO / MEDIA ── */
  if (/youtube\.com\/embed|youtubeapi|youtube-player/i.test(html)) add('Media', 'YouTube Embed', '▶️', 'YouTube video embed');
  if (/vimeo\.com\/video|player\.vimeo\.com/i.test(html)) add('Media', 'Vimeo', '🎬', 'Vimeo video embed');
  if (/wistia\.com|wistia\.net/i.test(html)) add('Media', 'Wistia', '🎥', 'Wistia video player');
  if (/videojs\.com|video-js|VideoJS/i.test(html)) add('Media', 'Video.js', '🎬', 'Video.js player');
  if (/cloudinary\.com|cloudinary-core/i.test(html)) add('Media', 'Cloudinary', '☁️', 'Cloudinary media CDN');
  if (/imagekit\.io|ImageKit\./i.test(html)) add('Media', 'ImageKit', '🖼', 'ImageKit media CDN');
  if (/imgix\.net|imgix\.com/i.test(html)) add('Media', 'Imgix', '🖼', 'Imgix image CDN');
  if (/mux\.com|mux-player|@mux\/mux/i.test(html)) add('Media', 'Mux Video', '🎬', 'Mux video API');

  /* ── MONITORING ── */
  if (/sentry\.io|Sentry\.init|@sentry\//i.test(html)) add('Monitoring', 'Sentry', '🐞', 'Sentry error tracking');
  if (/bugsnag\.com|Bugsnag\.start/i.test(html)) add('Monitoring', 'Bugsnag', '🐛', 'Bugsnag error tracking');
  if (/datadog-rum|DD_RUM|datadoghq\.com/i.test(html)) add('Monitoring', 'Datadog RUM', '🐕', 'Datadog real-user monitoring');
  if (/newrelic\.com|newrelic-browser/i.test(html)) add('Monitoring', 'New Relic', '🟢', 'New Relic APM');
  if (/rollbar\.com|Rollbar\.init/i.test(html)) add('Monitoring', 'Rollbar', '🔴', 'Rollbar error tracking');

  /* ── NOTIFICATIONS / COMMS ── */
  if (/onesignal\.com|OneSignal\.init/i.test(html)) add('Notifications', 'OneSignal', '🔔', 'OneSignal push notifications');
  if (/firebase.*messaging|getToken.*firebase/i.test(html)) add('Notifications', 'Firebase Cloud Messaging', '🔔', 'FCM push notifications');
  if (/sendgrid\.com|sgMailer|@sendgrid/i.test(html)) add('Notifications', 'SendGrid', '📧', 'SendGrid email API');
  if (/mailchimp\.com|mc\.us\d+|mailchimp/i.test(html)) add('Notifications', 'Mailchimp', '🐵', 'Mailchimp embed/API');
  if (/convertkit\.com|ck\.js|convertkit/i.test(html)) add('Notifications', 'ConvertKit', '📬', 'ConvertKit email');
  if (/resend\.com|@resend\/node/i.test(html)) add('Notifications', 'Resend', '📨', 'Resend email API');

  /* ── AI / ML APIs ── */
  if (/openai\.com|openai-api|ChatCompletion/i.test(html)) add('AI / ML', 'OpenAI API', '🤖', 'OpenAI API calls');
  if (/anthropic\.com|@anthropic-ai/i.test(html)) add('AI / ML', 'Anthropic (Claude)', '🤖', 'Anthropic API');
  if (/gemini-api|generativelanguage\.googleapis/i.test(html)) add('AI / ML', 'Google Gemini', '🤖', 'Gemini API');
  if (/cohere\.ai|cohere-ai/i.test(html)) add('AI / ML', 'Cohere', '🤖', 'Cohere NLP API');
  if (/huggingface\.co|@huggingface/i.test(html)) add('AI / ML', 'Hugging Face', '🤗', 'Hugging Face model');
  if (/replicate\.com|@replicate\/client/i.test(html)) add('AI / ML', 'Replicate', '🔁', 'Replicate AI API');
  if (/together\.ai|togetherai/i.test(html)) add('AI / ML', 'Together AI', '🤝', 'Together.ai inference');
  if (/groq\.com|groq-sdk/i.test(html)) add('AI / ML', 'Groq', '⚡', 'Groq inference API');
  if (/langchain|LangChain\.|@langchain/i.test(html)) add('AI / ML', 'LangChain', '🔗', 'LangChain framework');
  if (/pinecone\.io|PineconeClient/i.test(html)) add('AI / ML', 'Pinecone', '🌲', 'Pinecone vector DB');

  return techs;
}

export default detectTechStack;
