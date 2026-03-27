<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cenovnik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CenovnikController extends Controller
{
    /**
     * Prikaz svih stavki cenovnika
     */
    public function index(Request $request)
    {
        $query = Cenovnik::query();

        // Pretraga
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('vrsta_usluge', 'like', "%{$search}%")
                  ->orWhere('opis_usluge', 'like', "%{$search}%");
            });
        }

        // Filter po jedinici mere
        if ($request->has('jedinica_mere') && $request->jedinica_mere !== 'all') {
            $query->where('jedinica_mere', $request->jedinica_mere);
        }

        // Sortiranje
        $sortBy = $request->get('sort_by', 'vrsta_usluge');
        $sortDir = $request->get('sort_dir', 'asc');
        $query->orderBy($sortBy, $sortDir);

        // Paginacija ili lista
        if ($request->has('all') && $request->all === 'true') {
            $items = $query->get();
        } else {
            $perPage = $request->get('per_page', 20);
            $items = $query->paginate($perPage);
        }

        // Dodaj izračunate cene sa markup-om
        $kurs = $request->get('kurs', 117); // EUR/RSD kurs
        $markup = $request->get('markup', 30); // Procenat markup-a

        if ($items instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            $items->getCollection()->transform(function ($item) use ($kurs, $markup) {
                return $this->addCalculatedPrices($item, $kurs, $markup);
            });
        } else {
            $items = $items->map(function ($item) use ($kurs, $markup) {
                return $this->addCalculatedPrices($item, $kurs, $markup);
            });
        }

        return response()->json([
            'success' => true,
            'data' => $items,
            'settings' => [
                'kurs' => $kurs,
                'markup' => $markup
            ]
        ]);
    }

    /**
     * Kreiranje nove stavke cenovnika
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vrsta_usluge' => 'required|string|max:255',
            'opis_usluge' => 'nullable|string',
            'jedinica_mere' => 'required|string|in:KOM,M,M2,H,PAK',
            'cena_eur' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $item = Cenovnik::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Stavka cenovnika uspešno kreirana',
                'data' => $item
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri kreiranju stavke cenovnika',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Prikaz pojedinačne stavke cenovnika
     */
    public function show($id)
    {
        $item = Cenovnik::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Stavka cenovnika nije pronađena'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $item
        ]);
    }

    /**
     * Ažuriranje stavke cenovnika
     */
    public function update(Request $request, $id)
    {
        $item = Cenovnik::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Stavka cenovnika nije pronađena'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'vrsta_usluge' => 'sometimes|string|max:255',
            'opis_usluge' => 'nullable|string',
            'jedinica_mere' => 'sometimes|string|in:KOM,M,M2,H,PAK',
            'cena_eur' => 'sometimes|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $item->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Stavka cenovnika uspešno ažurirana',
                'data' => $item
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri ažuriranju stavke cenovnika',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Brisanje stavke cenovnika
     */
    public function destroy($id)
    {
        $item = Cenovnik::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Stavka cenovnika nije pronađena'
            ], 404);
        }

        try {
            $item->delete();

            return response()->json([
                'success' => true,
                'message' => 'Stavka cenovnika uspešno obrisana'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri brisanju stavke cenovnika',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk import stavki cenovnika
     */
    public function bulkImport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'stavke' => 'required|array|min:1',
            'stavke.*.vrsta_usluge' => 'required|string|max:255',
            'stavke.*.jedinica_mere' => 'required|string|in:KOM,M,M2,H,PAK',
            'stavke.*.cena_eur' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $created = 0;
            foreach ($request->stavke as $stavkaData) {
                Cenovnik::create($stavkaData);
                $created++;
            }

            return response()->json([
                'success' => true,
                'message' => "Uspešno importovano {$created} stavki",
                'data' => ['created' => $created]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri importu stavki cenovnika',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Dodavanje izračunatih cena
     */
    private function addCalculatedPrices($item, $kurs, $markup)
    {
        $cenaRsd = $item->cena_eur * $kurs;
        $cenaEurSaMarkupom = $item->cena_eur * (1 + $markup / 100);
        $cenaRsdSaMarkupom = $cenaEurSaMarkupom * $kurs;

        $item->cena_rsd = round($cenaRsd, 2);
        $item->cena_eur_sa_markupom = round($cenaEurSaMarkupom, 2);
        $item->cena_rsd_sa_markupom = round($cenaRsdSaMarkupom, 2);

        return $item;
    }
}

