<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#1e40af">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="eZvornik">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">

    <title>Zvornik Events – Događaji u gradu</title>
    <meta name="description" content="Platforma za pretragu događaja u Zvorniku: koncerte, festivale, turističke dane, kulturne i sportske događaje. Pronađite šta se dešava u gradu. Vreme, mapa, praktične informacije.">
    <meta name="keywords" content="Zvornik, događaji, koncerti, festivali, turizam, kultura, sport, Republika Srpska">
    <meta property="og:title" content="Zvornik Events – Događaji u gradu">
    <meta property="og:description" content="Platforma za pretragu događaja u Zvorniku. Koncerti, turizam, kultura, sport. Svi događaji na jednom mestu.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:image" content="{{ asset('images/grb_Zvornik.png') }}">
    <meta property="og:locale" content="sr_RS">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="shortcut icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-title" content="eZvornik" />
<link rel="manifest" href="/site.webmanifest" />
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@@type": "WebApplication",
        "name": "Zvornik Events",
        "description": "Platforma za pretragu događaja u gradu Zvornik. Koncerti, festivali, turistički dani, kultura, sport.",
        "url": "{{ url('/') }}",
        "applicationCategory": "LifestyleApplication",
        "operatingSystem": "Any"
    }
    </script>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=montserrat:400,500,600,700" rel="stylesheet" />

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased bg-white dark:bg-slate-950 font-sans h-full overflow-hidden">
    <div id="app" class="h-full"></div>
</body>
</html>
