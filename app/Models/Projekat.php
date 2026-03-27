<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Projekat extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'projekti';

    protected $fillable = [
        'broj_projekta',
        'naziv',
        'opis',
        'klijent_id',
        'ponuda_id',
        'datum_pocetka',
        'datum_zavrsetka',
        'prioritet',
        'status',
        'ukupna_vrednost',
        'adresa_lokacije',
        'napomene',
        'procenat_zavrsenosti'
    ];

    protected $casts = [
        'datum_pocetka' => 'date',
        'datum_zavrsetka' => 'date',
        'ukupna_vrednost' => 'decimal:2',
        'procenat_zavrsenosti' => 'integer'
    ];

    /**
     * Relacija sa klijentom
     */
    public function klijent()
    {
        return $this->belongsTo(Klijent::class);
    }

    /**
     * Relacija sa ponudom
     */
    public function ponuda()
    {
        return $this->belongsTo(Ponuda::class);
    }

    /**
     * Relacija sa fazama projekta
     */
    public function faze()
    {
        return $this->hasMany(ProjekatFaza::class)->orderBy('redosled');
    }

    /**
     * Relacija sa radnicima (many-to-many)
     */
    public function radnici()
    {
        return $this->belongsToMany(Radnik::class, 'projekat_radnik')
            ->withPivot('uloga')
            ->withTimestamps();
    }

    /**
     * Relacija sa slikama
     */
    public function slike()
    {
        return $this->hasMany(ProjekatSlika::class);
    }

    /**
     * Relacija sa dokumentima
     */
    public function dokumenti()
    {
        return $this->hasMany(ProjekatDokument::class);
    }

    /**
     * Scope za status
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope za aktivne projekte
     */
    public function scopeAktivan($query)
    {
        return $query->where('status', 'aktivan');
    }
}

