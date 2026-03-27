<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ponuda;
use App\Models\PonudaStavka;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf;

class PonudaController extends Controller
{
    /**
     * Prikaz svih ponuda sa filterima
     */
    public function index(Request $request)
    {
        $query = Ponuda::with(['klijent', 'stavke', 'obracun']);

        // Filter po godini
        if ($request->has('godina')) {
            $query->whereYear('datum_ponude', $request->godina);
        }

        // Filter po mesecu
        if ($request->has('mesec') && $request->mesec !== 'all') {
            $query->whereMonth('datum_ponude', $request->mesec);
        }

        // Filter po statusu
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Pretraga
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('broj_ponude', 'like', "%{$search}%")
                  ->orWhere('naziv_ponude', 'like', "%{$search}%")
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
        $ponude = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $ponude,
            'stats' => [
                'total' => Ponuda::whereYear('datum_ponude', $request->godina ?? date('Y'))->count(),
                'prihvacene' => Ponuda::whereYear('datum_ponude', $request->godina ?? date('Y'))
                    ->where('status', 'prihvacena')->count(),
                'ukupna_vrednost' => Ponuda::whereYear('datum_ponude', $request->godina ?? date('Y'))
                    ->sum('ukupna_cena')
            ]
        ]);
    }

    /**
     * Kreiranje nove ponude
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'klijent_id' => 'required|exists:klijenti,id',
            'naziv_ponude' => 'required|string|max:255',
            'naziv_projekta' => 'nullable|string|max:255',
            'datum_ponude' => 'required|date',
            'datum_vazenja' => 'nullable|date|after_or_equal:datum_ponude',
            'rok_isporuke' => 'nullable|string|max:255',
            'nacin_placanja' => 'nullable|string|max:255',
            'napomena' => 'nullable|string',
            'napomena_pdv' => 'nullable|string',
            'obracun_id' => 'nullable|exists:obracuni_ponuda,id',
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

            // Generisanje broja ponude
            $godina = date('Y', strtotime($request->datum_ponude));
            $brojPonude = $this->generateBrojPonude($godina);

            // Kreiranje ponude
            $ponuda = Ponuda::create([
                'broj_ponude' => $brojPonude,
                'klijent_id' => $request->klijent_id,
                'obracun_id' => $request->obracun_id,
                'naziv_ponude' => $request->naziv_ponude,
                'naziv_projekta' => $request->naziv_projekta,
                'datum_ponude' => $request->datum_ponude,
                'datum_vazenja' => $request->datum_vazenja,
                'rok_isporuke' => $request->rok_isporuke,
                'nacin_placanja' => $request->nacin_placanja,
                'napomena' => $request->napomena,
                'napomena_pdv' => $request->napomena_pdv ?? 'Paušalni preduzetnik nije u sistemu PDV-a, u skladu sa članom 40. Zakona o porezu na dodatu vrednost.',
                'status' => 'nacrt',
                'ukupna_cena' => 0
            ]);

            // Kreiranje stavki ponude
            $ukupnaCena = 0;
            foreach ($request->stavke as $stavkaData) {
                $ukupnaCenaStavke = $stavkaData['kolicina'] * $stavkaData['cena_po_jm'];
                $ukupnaCena += $ukupnaCenaStavke;

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

            // Ažuriranje ukupne cene
            $ponuda->update(['ukupna_cena' => $ukupnaCena]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ponuda uspešno kreirana',
                'data' => $ponuda->load(['klijent', 'stavke', 'obracun'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Greška pri kreiranju ponude',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Prikaz pojedinačne ponude
     */
    public function show($id)
    {
        $ponuda = Ponuda::with(['klijent', 'stavke', 'obracun'])->find($id);

        if (!$ponuda) {
            return response()->json([
                'success' => false,
                'message' => 'Ponuda nije pronađena'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ponuda
        ]);
    }

    /**
     * Ažuriranje ponude
     */
    public function update(Request $request, $id)
    {
        $ponuda = Ponuda::find($id);

        if (!$ponuda) {
            return response()->json([
                'success' => false,
                'message' => 'Ponuda nije pronađena'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'klijent_id' => 'sometimes|exists:klijenti,id',
            'naziv_ponude' => 'sometimes|string|max:255',
            'naziv_projekta' => 'nullable|string|max:255',
            'datum_ponude' => 'sometimes|date',
            'datum_vazenja' => 'nullable|date',
            'status' => 'sometimes|string|in:nacrt,poslata,prihvacena,odbijena,istekla,realizovana',
            'rok_isporuke' => 'nullable|string|max:255',
            'nacin_placanja' => 'nullable|string|max:255',
            'napomena' => 'nullable|string',
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
            $ponuda->update($request->except('stavke'));

            // Ako su prosleđene stavke, ažuriraj ih
            if ($request->has('stavke')) {
                // Brisanje starih stavki
                $ponuda->stavke()->delete();

                // Kreiranje novih stavki
                $ukupnaCena = 0;
                foreach ($request->stavke as $stavkaData) {
                    $ukupnaCenaStavke = $stavkaData['kolicina'] * $stavkaData['cena_po_jm'];
                    $ukupnaCena += $ukupnaCenaStavke;

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

                $ponuda->update(['ukupna_cena' => $ukupnaCena]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Ponuda uspešno ažurirana',
                'data' => $ponuda->fresh()->load(['klijent', 'stavke', 'obracun'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Greška pri ažuriranju ponude',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Brisanje ponude
     */
    public function destroy($id)
    {
        $ponuda = Ponuda::find($id);

        if (!$ponuda) {
            return response()->json([
                'success' => false,
                'message' => 'Ponuda nije pronađena'
            ], 404);
        }

        try {
            $ponuda->delete();

            return response()->json([
                'success' => true,
                'message' => 'Ponuda uspešno obrisana'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri brisanju ponude',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Promena statusa ponude
     */
    public function changeStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:nacrt,poslata,prihvacena,odbijena,istekla,realizovana'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        $ponuda = Ponuda::find($id);

        if (!$ponuda) {
            return response()->json([
                'success' => false,
                'message' => 'Ponuda nije pronađena'
            ], 404);
        }

        $ponuda->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status ponude uspešno promenjen',
            'data' => $ponuda
        ]);
    }

    /**
     * Generisanje PDF ponude
     */
    public function generatePdf($id)
    {
        $ponuda = Ponuda::with(['klijent', 'stavke'])->find($id);

        if (!$ponuda) {
            return response()->json([
                'success' => false,
                'message' => 'Ponuda nije pronađena'
            ], 404);
        }

        $companyInfo = [
            'naziv' => 'Miloš Đurović PR Proizvodnja i',
            'pib' => '114892347',
            'mb' => '67933800',
            'tekuci_racun' => '265-1100310094017-74',
            'adresa' => 'Ilije Stojadinovića 28, Beograd',
            'email' => 'npmmontaza@gmail.com',
            'telefon' => '+38163559870'
        ];

        $pdf = Pdf::loadView('pdf.ponuda', [
            'ponuda' => $ponuda,
            'company' => $companyInfo
        ]);

        return $pdf->download("ponuda-{$ponuda->broj_ponude}.pdf");
    }

    /**
     * Generisanje broja ponude
     */
    private function generateBrojPonude($godina)
    {
        $lastPonuda = Ponuda::whereYear('datum_ponude', $godina)
            ->orderBy('id', 'desc')
            ->first();

        if ($lastPonuda) {
            $lastNumber = (int) explode('/', $lastPonuda->broj_ponude)[0];
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return str_pad($newNumber, 5, '0', STR_PAD_LEFT) . '/' . $godina;
    }
}

