<?php

use Illuminate\Support\Facades\Route;

// API routes - vraćaju JSON
Route::get('/api', function () {
    return response()->json([
        'name' => 'NPM Enterijeri API',
        'version' => '1.0.0',
        'status' => 'running',
        'documentation' => '/api'
    ]);
});

// Frontend routes - sve ostale rute vraćaju React app
Route::get('/{any?}', function () {
    return view('react-app');
})->where('any', '.*');

