<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cenovnik extends Model
{
    use HasFactory;

    protected $table = 'cenovnik';

    protected $fillable = [
        'vrsta_usluge',
        'opis_usluge',
        'jedinica_mere',
        'cena_eur'
    ];

    protected $casts = [
        'cena_eur' => 'decimal:2'
    ];

    /**
     * Relacija sa stavkama ponuda
     */
    public function ponudaStavke()
    {
        return $this->hasMany(PonudaStavka::class);
    }

    /**
     * Relacija sa stavkama obračuna
     */
    public function obracunStavke()
    {
        return $this->hasMany(ObracunStavka::class);
    }
}

