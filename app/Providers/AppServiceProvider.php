<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Vite 6 puts manifest in build/.vite/manifest.json, Laravel expects build/manifest.json
        Vite::useManifestFilename('.vite/manifest.json');
    }
}

