<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PonudaStavka extends Model
{
    use HasFactory;

    protected $table = 'ponude_stavke';

    protected $fillable = [
        'ponuda_id',
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
     * Relacija sa ponudom
     */
    public function ponuda()
    {
        return $this->belongsTo(Ponuda::class);
    }

    /**
     * Relacija sa cenovnikom
     */
    public function cenovnik()
    {
        return $this->belongsTo(Cenovnik::class);
    }
}

