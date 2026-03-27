<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObracunStavka extends Model
{
    use HasFactory;

    protected $table = 'obracuni_stavke';

    protected $fillable = [
        'obracun_id',
        'cenovnik_id',
        'naziv_usluge',
        'opis',
        'jedinica_mere',
        'kolicina',
        'cena_po_jm'
    ];

    protected $casts = [
        'kolicina' => 'decimal:2',
        'cena_po_jm' => 'decimal:2'
    ];

    /**
     * Accessor za ukupnu cenu stavke
     */
    public function getUkupnaCenaStavkeAttribute()
    {
        return round($this->kolicina * $this->cena_po_jm, 2);
    }

    /**
     * Relacija sa obračunom
     */
    public function obracun()
    {
        return $this->belongsTo(ObracunPonude::class, 'obracun_id');
    }

    /**
     * Relacija sa cenovnikom
     */
    public function cenovnik()
    {
        return $this->belongsTo(Cenovnik::class);
    }
}

