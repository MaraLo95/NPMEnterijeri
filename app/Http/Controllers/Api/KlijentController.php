<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Klijent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class KlijentController extends Controller
{
    /**
     * Prikaz svih klijenata
     */
    public function index(Request $request)
    {
        $query = Klijent::with(['ponude', 'projekti']);

        // Pretraga
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('naziv', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('telefon', 'like', "%{$search}%")
                  ->orWhere('pib', 'like', "%{$search}%");
            });
        }

        // Filter po tipu
        if ($request->has('tip') && $request->tip !== 'all') {
            $query->where('tip', $request->tip);
        }

        // Sortiranje
        $sortBy = $request->get('sort_by', 'naziv');
        $sortDir = $request->get('sort_dir', 'asc');
        $query->orderBy($sortBy, $sortDir);

        // Paginacija ili lista
        if ($request->has('all') && $request->all === 'true') {
            $klijenti = $query->get();
        } else {
            $perPage = $request->get('per_page', 15);
            $klijenti = $query->paginate($perPage);
        }

        return response()->json([
            'success' => true,
            'data' => $klijenti
        ]);
    }

    /**
     * Kreiranje novog klijenta
     */
    public function store(Request $request)
    {
        Log::info('KlijentController::store', ['input' => $request->all(), 'db' => config('database.connections.mysql.database')]);

        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'tip' => 'required|string|in:fizicko_lice,pravno_lice',
            'email' => 'nullable|email|max:255',
            'telefon' => 'nullable|string|max:50',
            'adresa' => 'nullable|string|max:255',
            'grad' => 'nullable|string|max:100',
            'postanski_broj' => 'nullable|string|max:20',
            'pib' => 'nullable|string|max:20',
            'maticni_broj' => 'nullable|string|max:20',
            'kontakt_osoba' => 'nullable|string|max:255',
            'napomena' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $klijent = Klijent::create($request->all());

            Log::info('Klijent kreiran u bazu', ['id' => $klijent->id, 'naziv' => $klijent->naziv]);

            return response()->json([
                'success' => true,
                'message' => 'Klijent uspešno kreiran',
                'data' => $klijent
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri kreiranju klijenta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Prikaz pojedinačnog klijenta
     */
    public function show($id)
    {
        $klijent = Klijent::with(['ponude', 'projekti', 'obracuni'])->find($id);

        if (!$klijent) {
            return response()->json([
                'success' => false,
                'message' => 'Klijent nije pronađen'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $klijent
        ]);
    }

    /**
     * Ažuriranje klijenta
     */
    public function update(Request $request, $id)
    {
        $klijent = Klijent::find($id);

        if (!$klijent) {
            return response()->json([
                'success' => false,
                'message' => 'Klijent nije pronađen'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'naziv' => 'sometimes|string|max:255',
            'tip' => 'sometimes|string|in:fizicko_lice,pravno_lice',
            'email' => 'nullable|email|max:255',
            'telefon' => 'nullable|string|max:50',
            'adresa' => 'nullable|string|max:255',
            'grad' => 'nullable|string|max:100',
            'postanski_broj' => 'nullable|string|max:20',
            'pib' => 'nullable|string|max:20',
            'maticni_broj' => 'nullable|string|max:20',
            'kontakt_osoba' => 'nullable|string|max:255',
            'napomena' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $klijent->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Klijent uspešno ažuriran',
                'data' => $klijent
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri ažuriranju klijenta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Brisanje klijenta
     */
    public function destroy($id)
    {
        $klijent = Klijent::find($id);

        if (!$klijent) {
            return response()->json([
                'success' => false,
                'message' => 'Klijent nije pronađen'
            ], 404);
        }

        // Provera da li klijent ima povezane ponude ili projekte
        if ($klijent->ponude()->count() > 0 || $klijent->projekti()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Klijent ima povezane ponude ili projekte i ne može biti obrisan'
            ], 400);
        }

        try {
            $klijent->delete();

            return response()->json([
                'success' => true,
                'message' => 'Klijent uspešno obrisan'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri brisanju klijenta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Statistika za klijenta
     */
    public function stats($id)
    {
        $klijent = Klijent::find($id);

        if (!$klijent) {
            return response()->json([
                'success' => false,
                'message' => 'Klijent nije pronađen'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'broj_ponuda' => $klijent->ponude()->count(),
                'broj_projekata' => $klijent->projekti()->count(),
                'ukupna_vrednost_ponuda' => $klijent->ponude()->sum('ukupna_cena'),
                'prihvacene_ponude' => $klijent->ponude()->where('status', 'prihvacena')->count(),
                'aktivni_projekti' => $klijent->projekti()->where('status', 'aktivan')->count()
            ]
        ]);
    }
}

