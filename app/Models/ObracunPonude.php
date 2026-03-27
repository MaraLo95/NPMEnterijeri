<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ObracunPonude extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'obracuni_ponuda';

    protected $fillable = [
        'broj_obracuna',
        'klijent_id',
        'ponuda_id',
        'naziv_projekta',
        'datum_obracuna',
        'ukupna_cena_materijala',
        'profit_procenat',
        'profit_iznos',
        'ukupna_cena_ponude',
        'status',
        'is_novo'
    ];

    protected $casts = [
        'datum_obracuna' => 'date',
        'ukupna_cena_materijala' => 'decimal:2',
        'profit_iznos' => 'decimal:2',
        'ukupna_cena_ponude' => 'decimal:2',
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
     * Relacija sa ponudom
     */
    public function ponuda()
    {
        return $this->belongsTo(Ponuda::class);
    }

    /**
     * Relacija sa stavkama obračuna
     */
    public function stavke()
    {
        return $this->hasMany(ObracunStavka::class, 'obracun_id');
    }

    /**
     * Scope za godinu
     */
    public function scopeGodina($query, $godina)
    {
        return $query->whereYear('datum_obracuna', $godina);
    }
}

