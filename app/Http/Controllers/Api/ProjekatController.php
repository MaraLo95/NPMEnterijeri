<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Projekat;
use App\Models\ProjekatFaza;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProjekatController extends Controller
{
    /**
     * Prikaz svih projekata sa filterima
     */
    public function index(Request $request)
    {
        $query = Projekat::with(['klijent', 'ponuda', 'faze', 'radnici']);

        // Filter po statusu
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter po prioritetu
        if ($request->has('prioritet') && $request->prioritet !== 'all') {
            $query->where('prioritet', $request->prioritet);
        }

        // Filter po klijentu
        if ($request->has('klijent_id')) {
            $query->where('klijent_id', $request->klijent_id);
        }

        // Filter po godini
        if ($request->has('godina')) {
            $query->whereYear('datum_pocetka', $request->godina);
        }

        // Pretraga
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('naziv', 'like', "%{$search}%")
                  ->orWhere('opis', 'like', "%{$search}%")
                  ->orWhereHas('klijent', function ($q) use ($search) {
                      $q->where('naziv', 'like', "%{$search}%");
                  });
            });
        }

        // Sortiranje
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        // Paginacija
        $perPage = $request->get('per_page', 15);
        $projekti = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $projekti,
            'stats' => [
                'total' => Projekat::count(),
                'aktivan' => Projekat::where('status', 'aktivan')->count(),
                'zavrsen' => Projekat::where('status', 'zavrsen')->count(),
                'na_cekanju' => Projekat::where('status', 'na_cekanju')->count(),
                'ukupna_vrednost' => Projekat::sum('ukupna_vrednost')
            ]
        ]);
    }

    /**
     * Kreiranje novog projekta
     */
    public function store(Request $request)
    {
        try {
            Log::info('ProjekatController::store', ['input' => $request->all(), 'db' => config('database.connections.mysql.database')]);
        } catch (\Throwable $e) {
            // Ignoriši greške logovanja
        }

        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'opis' => 'nullable|string',
            'klijent_id' => 'required|exists:klijenti,id',
            'ponuda_id' => 'nullable|exists:ponude,id',
            'datum_pocetka' => 'required|date',
            'datum_zavrsetka' => 'nullable|date',
            'prioritet' => 'required|string|in:nizak,srednji,visok,hitan',
            'ukupna_vrednost' => 'nullable|numeric|min:0',
            'adresa_lokacije' => 'nullable|string|max:255',
            'napomene' => 'nullable|string',
            'faze' => 'sometimes|array',
            'faze.*.naziv' => 'required_with:faze|string|max:255',
            'faze.*.opis' => 'nullable|string',
            'faze.*.redosled' => 'required_with:faze|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Generisanje broja projekta
            $brojProjekta = $this->generateBrojProjekta();

            // Kreiranje projekta
            $projekat = Projekat::create([
                'broj_projekta' => $brojProjekta,
                'naziv' => $request->naziv,
                'opis' => $request->opis,
                'klijent_id' => $request->klijent_id,
                'ponuda_id' => $request->ponuda_id,
                'datum_pocetka' => $request->datum_pocetka,
                'datum_zavrsetka' => $request->datum_zavrsetka,
                'prioritet' => $request->prioritet,
                'status' => 'na_cekanju',
                'ukupna_vrednost' => $request->ukupna_vrednost ?? 0,
                'adresa_lokacije' => $request->adresa_lokacije,
                'napomene' => $request->napomene,
                'procenat_zavrsenosti' => 0
            ]);

            // Kreiranje faza projekta ako su prosleđene
            if ($request->has('faze')) {
                foreach ($request->faze as $fazaData) {
                    ProjekatFaza::create([
                        'projekat_id' => $projekat->id,
                        'naziv' => $fazaData['naziv'],
                        'opis' => $fazaData['opis'] ?? null,
                        'redosled' => $fazaData['redosled'],
                        'status' => 'na_cekanju'
                    ]);
                }
            }

            DB::commit();

            try {
                Log::info('Projekat kreiran u bazu', ['id' => $projekat->id, 'naziv' => $projekat->naziv]);
            } catch (\Throwable $e) {
                // Ignoriši
            }

            return response()->json([
                'success' => true,
                'message' => 'Projekat uspešno kreiran',
                'data' => $projekat->load(['klijent', 'ponuda', 'faze'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            try {
                Log::error('ProjekatController::store error', ['message' => $e->getMessage()]);
            } catch (\Throwable $logEx) {
                // Ignoriši
            }
            return response()->json([
                'success' => false,
                'message' => 'Greška pri kreiranju projekta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Prikaz pojedinačnog projekta
     */
    public function show($id)
    {
        $projekat = Projekat::with(['klijent', 'ponuda', 'faze', 'radnici', 'slike', 'dokumenti'])
            ->find($id);

        if (!$projekat) {
            return response()->json([
                'success' => false,
                'message' => 'Projekat nije pronađen'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $projekat
        ]);
    }

    /**
     * Ažuriranje projekta
     */
    public function update(Request $request, $id)
    {
        $projekat = Projekat::find($id);

        if (!$projekat) {
            return response()->json([
                'success' => false,
                'message' => 'Projekat nije pronađen'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'naziv' => 'sometimes|string|max:255',
            'opis' => 'nullable|string',
            'klijent_id' => 'sometimes|exists:klijenti,id',
            'ponuda_id' => 'nullable|exists:ponude,id',
            'datum_pocetka' => 'sometimes|date',
            'datum_zavrsetka' => 'nullable|date',
            'prioritet' => 'sometimes|string|in:nizak,srednji,visok,hitan',
            'status' => 'sometimes|string|in:na_cekanju,aktivan,pauziran,zavrsen,otkazan',
            'ukupna_vrednost' => 'nullable|numeric|min:0',
            'adresa_lokacije' => 'nullable|string|max:255',
            'napomene' => 'nullable|string',
            'procenat_zavrsenosti' => 'sometimes|integer|min:0|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $projekat->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Projekat uspešno ažuriran',
                'data' => $projekat->fresh()->load(['klijent', 'ponuda', 'faze'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri ažuriranju projekta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Brisanje projekta
     */
    public function destroy($id)
    {
        $projekat = Projekat::find($id);

        if (!$projekat) {
            return response()->json([
                'success' => false,
                'message' => 'Projekat nije pronađen'
            ], 404);
        }

        try {
            // Brisanje povezanih fajlova
            if ($projekat->slike) {
                foreach ($projekat->slike as $slika) {
                    Storage::delete($slika->putanja);
                }
            }
            
            $projekat->delete();

            return response()->json([
                'success' => true,
                'message' => 'Projekat uspešno obrisan'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri brisanju projekta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Promena statusa projekta
     */
    public function changeStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:na_cekanju,aktivan,pauziran,zavrsen,otkazan'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        $projekat = Projekat::find($id);

        if (!$projekat) {
            return response()->json([
                'success' => false,
                'message' => 'Projekat nije pronađen'
            ], 404);
        }

        $projekat->update(['status' => $request->status]);

        // Ako je projekat završen, postavi procenat na 100
        if ($request->status === 'zavrsen') {
            $projekat->update(['procenat_zavrsenosti' => 100]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status projekta uspešno promenjen',
            'data' => $projekat
        ]);
    }

    /**
     * Ažuriranje faze projekta
     */
    public function updateFaza(Request $request, $projekatId, $fazaId)
    {
        $faza = ProjekatFaza::where('projekat_id', $projekatId)
            ->where('id', $fazaId)
            ->first();

        if (!$faza) {
            return response()->json([
                'success' => false,
                'message' => 'Faza nije pronađena'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'naziv' => 'sometimes|string|max:255',
            'opis' => 'nullable|string',
            'status' => 'sometimes|string|in:na_cekanju,u_toku,zavrsena',
            'redosled' => 'sometimes|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        $faza->update($request->all());

        // Rekalkulacija procenta završenosti projekta
        $this->recalculateProgress($projekatId);

        return response()->json([
            'success' => true,
            'message' => 'Faza uspešno ažurirana',
            'data' => $faza
        ]);
    }

    /**
     * Dodavanje radnika na projekat
     */
    public function addRadnik(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'radnik_id' => 'required|exists:radnici,id',
            'uloga' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        $projekat = Projekat::find($id);

        if (!$projekat) {
            return response()->json([
                'success' => false,
                'message' => 'Projekat nije pronađen'
            ], 404);
        }

        // Provera da li radnik već postoji na projektu
        if ($projekat->radnici()->where('radnik_id', $request->radnik_id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Radnik je već dodeljen ovom projektu'
            ], 400);
        }

        $projekat->radnici()->attach($request->radnik_id, [
            'uloga' => $request->uloga
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Radnik uspešno dodat na projekat',
            'data' => $projekat->load('radnici')
        ]);
    }

    /**
     * Uklanjanje radnika sa projekta
     */
    public function removeRadnik($projekatId, $radnikId)
    {
        $projekat = Projekat::find($projekatId);

        if (!$projekat) {
            return response()->json([
                'success' => false,
                'message' => 'Projekat nije pronađen'
            ], 404);
        }

        $projekat->radnici()->detach($radnikId);

        return response()->json([
            'success' => true,
            'message' => 'Radnik uspešno uklonjen sa projekta'
        ]);
    }

    /**
     * Upload slike za projekat
     */
    public function uploadSlika(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'slika' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
            'opis' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        $projekat = Projekat::find($id);

        if (!$projekat) {
            return response()->json([
                'success' => false,
                'message' => 'Projekat nije pronađen'
            ], 404);
        }

        $path = $request->file('slika')->store('projekti/' . $id, 'public');

        $projekat->slike()->create([
            'putanja' => $path,
            'opis' => $request->opis
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Slika uspešno uploadovana',
            'data' => [
                'putanja' => Storage::url($path)
            ]
        ]);
    }

    /**
     * Rekalkulacija procenta završenosti projekta
     */
    private function recalculateProgress($projekatId)
    {
        $projekat = Projekat::find($projekatId);
        $faze = $projekat->faze;

        if ($faze->count() === 0) {
            return;
        }

        $zavrsene = $faze->where('status', 'zavrsena')->count();
        $procenat = round(($zavrsene / $faze->count()) * 100);

        $projekat->update(['procenat_zavrsenosti' => $procenat]);
    }

    /**
     * Generisanje broja projekta
     */
    private function generateBrojProjekta()
    {
        $godina = date('Y');
        $lastProjekat = Projekat::whereYear('created_at', $godina)
            ->orderBy('id', 'desc')
            ->first();

        if ($lastProjekat && preg_match('/PRJ-(\d+)-/', $lastProjekat->broj_projekta, $matches)) {
            $newNumber = (int) $matches[1] + 1;
        } else {
            $newNumber = 1;
        }

        return 'PRJ-' . str_pad($newNumber, 4, '0', STR_PAD_LEFT) . '-' . $godina;
    }
}

