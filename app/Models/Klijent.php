<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Klijent extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'klijenti';

    protected $fillable = [
        'naziv',
        'tip',
        'email',
        'telefon',
        'adresa',
        'grad',
        'postanski_broj',
        'pib',
        'maticni_broj',
        'kontakt_osoba',
        'napomena'
    ];

    /**
     * Relacija sa ponudama
     */
    public function ponude()
    {
        return $this->hasMany(Ponuda::class);
    }

    /**
     * Relacija sa projektima
     */
    public function projekti()
    {
        return $this->hasMany(Projekat::class);
    }

    /**
     * Relacija sa obračunima
     */
    public function obracuni()
    {
        return $this->hasMany(ObracunPonude::class);
    }
}

