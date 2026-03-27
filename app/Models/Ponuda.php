<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ponuda extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ponude';

    protected $fillable = [
        'broj_ponude',
        'klijent_id',
        'obracun_id',
        'naziv_ponude',
        'naziv_projekta',
        'datum_ponude',
        'datum_vazenja',
        'rok_isporuke',
        'nacin_placanja',
        'napomena',
        'napomena_pdv',
        'status',
        'ukupna_cena',
        'is_novo'
    ];

    protected $casts = [
        'datum_ponude' => 'date',
        'datum_vazenja' => 'date',
        'ukupna_cena' => 'decimal:2',
        'is_novo' => 'boolean'
    ];

    /**
     * Relacija sa klijentom
     */
    public function klijent()
    {
        return $this->belongsTo(Klijent::class);
    }

    /**
     * Relacija sa obračunom
     */
    public function obracun()
    {
        return $this->belongsTo(ObracunPonude::class, 'obracun_id');
    }

    /**
     * Relacija sa stavkama ponude
     */
    public function stavke()
    {
        return $this->hasMany(PonudaStavka::class);
    }

    /**
     * Relacija sa projektom
     */
    public function projekat()
    {
        return $this->hasOne(Projekat::class);
    }

    /**
     * Scope za godinu
     */
    public function scopeGodina($query, $godina)
    {
        return $query->whereYear('datum_ponude', $godina);
    }

    /**
     * Scope za status
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}

