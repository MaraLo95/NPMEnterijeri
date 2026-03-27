<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Radnik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class RadnikController extends Controller
{
    public function index(Request $request)
    {
        $hasFilters = ($request->has('search') && !empty($request->search))
            || ($request->has('status') && $request->status !== 'all');

        if (!$hasFilters) {
            $radnici = Cache::remember('radnici_list', 60, function () {
                return Radnik::orderBy('prezime')->orderBy('ime')->get();
            });
        } else {
            $query = Radnik::query();

            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('ime', 'like', "%{$search}%")
                      ->orWhere('prezime', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('pozicija', 'like', "%{$search}%");
                });
            }

            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            $radnici = $query->orderBy('prezime')->orderBy('ime')->get();
        }

        return response()->json([
            'success' => true,
            'data' => $radnici
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'jmbg' => 'required|string|size:13',
            'email' => 'nullable|email|max:255',
            'telefon' => 'nullable|string|max:50',
            'adresa' => 'nullable|string|max:255',
            'datum_zaposlenja' => 'nullable|date',
            'pozicija' => 'nullable|string|max:100',
            'satnica' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:aktivan,neaktivan,na_odsustvu',
            'napomena' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        $radnik = Radnik::create([
            'ime' => $request->ime,
            'prezime' => $request->prezime,
            'jmbg' => $request->jmbg,
            'email' => $request->email,
            'telefon' => $request->telefon,
            'adresa' => $request->adresa,
            'datum_zaposlenja' => $request->datum_zaposlenja,
            'pozicija' => $request->pozicija ?? 'Radnik',
            'satnica' => $request->satnica,
            'status' => $request->status ?? 'aktivan',
            'napomena' => $request->napomena
        ]);

        Cache::forget('radnici_list');

        return response()->json([
            'success' => true,
            'message' => 'Radnik uspešno kreiran',
            'data' => $radnik
        ], 201);
    }

    public function show($id)
    {
        $radnik = Radnik::with('projekti')->find($id);

        if (!$radnik) {
            return response()->json([
                'success' => false,
                'message' => 'Radnik nije pronađen'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $radnik
        ]);
    }

    public function update(Request $request, $id)
    {
        $radnik = Radnik::find($id);

        if (!$radnik) {
            return response()->json([
                'success' => false,
                'message' => 'Radnik nije pronađen'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'ime' => 'sometimes|string|max:255',
            'prezime' => 'sometimes|string|max:255',
            'jmbg' => 'sometimes|string|size:13',
            'email' => 'nullable|email|max:255',
            'telefon' => 'nullable|string|max:50',
            'adresa' => 'nullable|string|max:255',
            'datum_zaposlenja' => 'nullable|date',
            'pozicija' => 'nullable|string|max:100',
            'satnica' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:aktivan,neaktivan,na_odsustvu',
            'napomena' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Greška pri validaciji',
                'errors' => $validator->errors()
            ], 422);
        }

        $radnik->update($request->only([
            'ime', 'prezime', 'jmbg', 'email', 'telefon', 'adresa',
            'datum_zaposlenja', 'pozicija', 'satnica', 'status', 'napomena'
        ]));

        Cache::forget('radnici_list');

        return response()->json([
            'success' => true,
            'message' => 'Radnik uspešno ažuriran',
            'data' => $radnik
        ]);
    }

    public function destroy($id)
    {
        $radnik = Radnik::find($id);

        if (!$radnik) {
            return response()->json([
                'success' => false,
                'message' => 'Radnik nije pronađen'
            ], 404);
        }

        $radnik->delete();

        Cache::forget('radnici_list');

        return response()->json([
            'success' => true,
            'message' => 'Radnik uspešno obrisan'
        ]);
    }
}
