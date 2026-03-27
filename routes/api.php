<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PonudaController;
use App\Http\Controllers\Api\ObracunPonudeController;
use App\Http\Controllers\Api\ProjekatController;
use App\Http\Controllers\Api\KlijentController;
use App\Http\Controllers\Api\CenovnikController;
use App\Http\Controllers\Api\RadnikController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| NPM Enterijeri - API Rute
|
*/

// ========================================
// JAVNE RUTE (bez autentifikacije)
// ========================================

// Autentifikacija
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// ========================================
// ZAŠTIĆENE RUTE (potrebna autentifikacija)
// ========================================

Route::middleware('auth:sanctum')->group(function () {

    // ========================================
    // Auth rute
    // ========================================
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::put('/change-password', [AuthController::class, 'changePassword']);
    });

    // ========================================
    // Klijenti
    // ========================================
    Route::prefix('klijenti')->group(function () {
        Route::get('/', [KlijentController::class, 'index']);
        Route::post('/', [KlijentController::class, 'store']);
        Route::get('/{id}', [KlijentController::class, 'show']);
        Route::put('/{id}', [KlijentController::class, 'update']);
        Route::delete('/{id}', [KlijentController::class, 'destroy']);
        Route::get('/{id}/stats', [KlijentController::class, 'stats']);
    });

    // ========================================
    // Cenovnik
    // ========================================
    Route::prefix('cenovnik')->group(function () {
        Route::get('/', [CenovnikController::class, 'index']);
        Route::post('/', [CenovnikController::class, 'store']);
        Route::post('/bulk-import', [CenovnikController::class, 'bulkImport']);
        Route::get('/{id}', [CenovnikController::class, 'show']);
        Route::put('/{id}', [CenovnikController::class, 'update']);
        Route::delete('/{id}', [CenovnikController::class, 'destroy']);
    });

    // ========================================
    // Obračuni ponuda
    // ========================================
    Route::prefix('obracuni')->group(function () {
        Route::get('/', [ObracunPonudeController::class, 'index']);
        Route::post('/', [ObracunPonudeController::class, 'store']);
        Route::get('/{id}', [ObracunPonudeController::class, 'show']);
        Route::put('/{id}', [ObracunPonudeController::class, 'update']);
        Route::delete('/{id}', [ObracunPonudeController::class, 'destroy']);
        Route::patch('/{id}/status', [ObracunPonudeController::class, 'changeStatus']);
        Route::post('/calculate-profit', [ObracunPonudeController::class, 'calculateProfit']);
    });

    // ========================================
    // Ponude
    // ========================================
    Route::prefix('ponude')->group(function () {
        Route::get('/', [PonudaController::class, 'index']);
        Route::post('/', [PonudaController::class, 'store']);
        Route::get('/{id}', [PonudaController::class, 'show']);
        Route::put('/{id}', [PonudaController::class, 'update']);
        Route::delete('/{id}', [PonudaController::class, 'destroy']);
        Route::patch('/{id}/status', [PonudaController::class, 'changeStatus']);
        Route::get('/{id}/pdf', [PonudaController::class, 'generatePdf']);
    });

    // ========================================
    // Radnici
    // ========================================
    Route::prefix('radnici')->group(function () {
        Route::get('/', [RadnikController::class, 'index']);
        Route::post('/', [RadnikController::class, 'store']);
        Route::get('/{id}', [RadnikController::class, 'show']);
        Route::put('/{id}', [RadnikController::class, 'update']);
        Route::delete('/{id}', [RadnikController::class, 'destroy']);
    });

    // ========================================
    // Projekti
    // ========================================
    Route::prefix('projekti')->group(function () {
        Route::get('/', [ProjekatController::class, 'index']);
        Route::post('/', [ProjekatController::class, 'store']);
        Route::get('/{id}', [ProjekatController::class, 'show']);
        Route::put('/{id}', [ProjekatController::class, 'update']);
        Route::delete('/{id}', [ProjekatController::class, 'destroy']);
        Route::patch('/{id}/status', [ProjekatController::class, 'changeStatus']);
        
        // Faze projekta
        Route::put('/{projekatId}/faze/{fazaId}', [ProjekatController::class, 'updateFaza']);
        
        // Radnici na projektu
        Route::post('/{id}/radnici', [ProjekatController::class, 'addRadnik']);
        Route::delete('/{projekatId}/radnici/{radnikId}', [ProjekatController::class, 'removeRadnik']);
        
        // Upload slika
        Route::post('/{id}/slike', [ProjekatController::class, 'uploadSlika']);
    });

    // ========================================
    // Korisnik info
    // ========================================
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    });
});

// ========================================
// Fallback ruta
// ========================================
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API ruta nije pronađena'
    ], 404);
});

