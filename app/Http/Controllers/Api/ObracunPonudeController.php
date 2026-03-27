<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ObracunPonude;
use App\Models\ObracunStavka;
use App\Models\Ponuda;
use App\Models\PonudaStavka;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ObracunPonudeController extends Controller
{
    /**
     * Prikaz svih obračuna sa filterima
     */
    public function index(Request $request)
    {
        $query = ObracunPonude::with(['klijent', 'stavke', 'ponuda']);

        // Filter po godini
        if ($request->has('godina')) {
            $query->whereYear('datum_obracuna', $request->godina);
        }

        // Filter po mesecu
        if ($request->has('mesec') && $request->mesec !== 'all') {
            $query->whereMonth('datum_obracuna', $request->mesec);
        }

        // Filter po statusu
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Pretraga
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('broj_obracuna', 'like', "%{$search}%")
                  ->orWhere('naziv_projekta', 'like', "%{$search}%")
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
        $obracuni = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $obracuni,
            'stats' => [
                'total' => ObracunPonude::whereYear('datum_obracuna', $request->godina ?? date('Y'))->count(),
                'prihvaceni' => ObracunPonude::whereYear('datum_obracuna', $request->godina ?? date('Y'))
                    ->where('status', 'prihvacena')->count(),
                'ukupna_vrednost' => ObracunPonude::whereYear('datum_obracuna', $request->godina ?? date('Y'))
                    ->sum('ukupna_cena_ponude')
            ]
        ]);
    }

    /**
     * Kreiranje novog obračuna i automatsko kreiranje ponude
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'klijent_id' => 'required|exists:klijenti,id',
            'naziv_projekta' => 'required|string|max:255',
            'datum_obracuna' => 'required|date',
            'profit_procenat' => 'nullable|integer|min:0|max:100',
            'stavke' => 'required|array|min:1',
            'stavke.*.naziv_usluge' => 'required|string|max:255',
            'stavke.*.jedinica_mere' => 'required|string|in:KOM,M,M2,H,PAK',
            'stavke.*.kolicina' => 'required|numeric|min:0',
            'stavke.*.cena_po_jm' => 'required|numeric|min:0',
            'stavke.*.opis' => 'nullable|string'
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

            // Generisanje broja obračuna
            $godina = date('Y', strtotime($request->datum_obracuna));
            $brojObracuna = $this->generateBrojObracuna($godina);

            // Izračunavanje cena
            $ukupnaCenaMaterijala = 0;
            foreach ($request->stavke as $stavka) {
                $ukupnaCenaMaterijala += $stavka['kolicina'] * $stavka['cena_po_jm'];
            }

            // Izračunavanje profita
            $profitProcenat = $request->profit_procenat ?? 0;
            $profitIznos = $ukupnaCenaMaterijala * ($profitProcenat / 100);
            $ukupnaCenaPonude = $ukupnaCenaMaterijala + $profitIznos;

            // Kreiranje obračuna
            $obracun = ObracunPonude::create([
                'broj_obracuna' => $brojObracuna,
                'klijent_id' => $request->klijent_id,
                'naziv_projekta' => $request->naziv_projekta,
                'datum_obracuna' => $request->datum_obracuna,
                'ukupna_cena_materijala' => $ukupnaCenaMaterijala,
                'profit_procenat' => $profitProcenat,
                'profit_iznos' => $profitIznos,
                'ukupna_cena_ponude' => $ukupnaCenaPonude,
                'status' => 'nacrt',
                'is_novo' => true
            ]);

            // Kreiranje stavki obračuna
            foreach ($request->stavke as $stavkaData) {
                ObracunStavka::create([
                    'obracun_id' => $obracun->id,
                    'cenovnik_id' => $stavkaData['cenovnik_id'] ?? null,
                    'naziv_usluge' => $stavkaData['naziv_usluge'],
                    'opis' => $stavkaData['opis'] ?? null,
                    'jedinica_mere' => $stavkaData['jedinica_mere'],
                    'kolicina' => $stavkaData['kolicina'],
                    'cena_po_jm' => $stavkaData['cena_po_jm']
                ]);
            }

            // ========================================
            // AUTOMATSKO KREIRANJE PONUDE
            // ========================================
            $ponuda = Ponuda::create([
                'broj_ponude' => $brojObracuna, // Isti broj kao obračun
                'klijent_id' => $request->klijent_id,
                'obracun_id' => $obracun->id,
                'naziv_ponude' => $request->naziv_projekta,
                'naziv_projekta' => $request->naziv_projekta,
                'datum_ponude' => $request->datum_obracuna,
                'napomena_pdv' => 'Paušalni preduzetnik nije u sistemu PDV-a, u skladu sa članom 40. Zakona o porezu na dodatu vrednost.',
                'status' => 'nacrt',
                'ukupna_cena' => $ukupnaCenaPonude,
                'is_novo' => true
            ]);

            // Kopiranje stavki u ponudu
            foreach ($request->stavke as $stavkaData) {
                PonudaStavka::create([
                    'ponuda_id' => $ponuda->id,
                    'cenovnik_id' => $stavkaData['cenovnik_id'] ?? null,
                    'naziv_usluge' => $stavkaData['naziv_usluge'],
                    'opis' => $stavkaData['opis'] ?? null,
                    'jedinica_mere' => $stavkaData['jedinica_mere'],
                    'kolicina' => $stavkaData['kolicina'],
                    'cena_po_jm' => $stavkaData['cena_po_jm']
                ]);
            }

            // Povezivanje obračuna sa ponudom
            $obracun->update(['ponuda_id' => $ponuda->id]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Obračun i ponuda uspešno kreirani',
                'data' => [
                    'obracun' => $obracun->load(['klijent', 'stavke']),
                    'ponuda' => $ponuda->load(['klijent', 'stavke'])
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Greška pri kreiranju obračuna',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Prikaz pojedinačnog obračuna
     */
    public function show($id)
    {
        $obracun = ObracunPonude::with(['klijent', 'stavke', 'ponuda'])->find($id);

        if (!$obracun) {
            return response()->json([
                'success' => false,
                'message' => 'Obračun nije pronađen'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $obracun
        ]);
    }

    /**
     * Ažuriranje obračuna
     */
    public function update(Request $request, $id)
    {
        $obracun = ObracunPonude::find($id);

        if (!$obracun) {
            return response()->json([
                'success' => false,
                'message' => 'Obračun nije pronađen'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'klijent_id' => 'sometimes|exists:klijenti,id',
            'naziv_projekta' => 'sometimes|string|max:255',
            'datum_obracuna' => 'sometimes|date',
            'profit_procenat' => 'nullable|integer|min:0|max:100',
            'status' => 'sometimes|string|in:nacrt,poslata,prihvacena,odbijena,realizovana',
            'stavke' => 'sometimes|array|min:1'
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

            // Ažuriranje osnovnih podataka
            $obracun->update($request->except(['stavke', 'ukupna_cena_materijala', 'ukupna_cena_ponude']));

            // Ako su prosleđene stavke, ažuriraj ih
            if ($request->has('stavke')) {
                // Brisanje starih stavki
                $obracun->stavke()->delete();

                // Kreiranje novih stavki
                $ukupnaCenaMaterijala = 0;
                foreach ($request->stavke as $stavkaData) {
                    $ukupnaCenaStavke = $stavkaData['kolicina'] * $stavkaData['cena_po_jm'];
                    $ukupnaCenaMaterijala += $ukupnaCenaStavke;

                    ObracunStavka::create([
                        'obracun_id' => $obracun->id,
                        'cenovnik_id' => $stavkaData['cenovnik_id'] ?? null,
                        'naziv_usluge' => $stavkaData['naziv_usluge'],
                        'opis' => $stavkaData['opis'] ?? null,
                        'jedinica_mere' => $stavkaData['jedinica_mere'],
                        'kolicina' => $stavkaData['kolicina'],
                        'cena_po_jm' => $stavkaData['cena_po_jm']
                    ]);
                }

                // Rekalkulacija cena
                $profitProcenat = $request->profit_procenat ?? $obracun->profit_procenat ?? 0;
                $profitIznos = $ukupnaCenaMaterijala * ($profitProcenat / 100);
                $ukupnaCenaPonude = $ukupnaCenaMaterijala + $profitIznos;

                $obracun->update([
                    'ukupna_cena_materijala' => $ukupnaCenaMaterijala,
                    'profit_procenat' => $profitProcenat,
                    'profit_iznos' => $profitIznos,
                    'ukupna_cena_ponude' => $ukupnaCenaPonude,
                    'is_novo' => false
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Obračun uspešno ažuriran',
                'data' => $obracun->fresh()->load(['klijent', 'stavke', 'ponuda'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Greška pri ažuriranju obračuna',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Brisanje obračuna
     */
    public function destroy($id)
    {
        $obracun = ObracunPonude::find($id);

        if (!$obracun) {
            return response()->json([
                'success' => false,
                'message' => 'Obračun nije pronađen'
            ], 404);
        }

        try {
            // Takođe briši povezanu ponudu ako postoji
            if ($obracun->ponuda) {
                $obracun->ponuda->delete();
            }
            
            $obracun->delete();

            return response()->json([
                'success' => true,
                'message' => 'Obračun uspešno obrisan'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri brisanju obračuna',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Promena statusa obračuna
     */
    public function changeStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:nacrt,poslata,prihvacena,odbijena,realizovana'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        $obracun = ObracunPonude::find($id);

        if (!$obracun) {
            return response()->json([
                'success' => false,
                'message' => 'Obračun nije pronađen'
            ], 404);
        }

        $obracun->update([
            'status' => $request->status,
            'is_novo' => false
        ]);

        // Ažuriraj i povezanu ponudu
        if ($obracun->ponuda) {
            $obracun->ponuda->update(['status' => $request->status, 'is_novo' => false]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status obračuna uspešno promenjen',
            'data' => $obracun
        ]);
    }

    /**
     * Izračunavanje profita za različite procente
     */
    public function calculateProfit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ukupna_cena_materijala' => 'required|numeric|min:0',
            'procenti' => 'sometimes|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        $ukupnaCenaMaterijala = $request->ukupna_cena_materijala;
        $procenti = $request->procenti ?? [100, 90, 80, 70, 60, 50];

        $kalkulacije = [];
        foreach ($procenti as $procenat) {
            $profitIznos = $ukupnaCenaMaterijala * ($procenat / 100);
            $ukupnaCenaPonude = $ukupnaCenaMaterijala + $profitIznos;

            $kalkulacije[] = [
                'procenat' => $procenat,
                'profit_iznos' => round($profitIznos, 2),
                'ukupna_cena_ponude' => round($ukupnaCenaPonude, 2)
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'ukupna_cena_materijala' => $ukupnaCenaMaterijala,
                'kalkulacije' => $kalkulacije
            ]
        ]);
    }

    /**
     * Generisanje broja obračuna
     */
    private function generateBrojObracuna($godina)
    {
        $lastObracun = ObracunPonude::whereYear('datum_obracuna', $godina)
            ->orderBy('id', 'desc')
            ->first();

        if ($lastObracun) {
            $lastNumber = (int) explode('/', $lastObracun->broj_obracuna)[0];
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return str_pad($newNumber, 5, '0', STR_PAD_LEFT) . '/' . $godina;
    }
}

