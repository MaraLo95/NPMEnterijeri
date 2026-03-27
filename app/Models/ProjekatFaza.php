<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjekatFaza extends Model
{
    use HasFactory;

    protected $table = 'projekat_faze';

    protected $fillable = [
        'projekat_id',
        'naziv',
        'opis',
        'redosled',
        'status'
    ];

    /**
     * Relacija sa projektom
     */
    public function projekat()
    {
        return $this->belongsTo(Projekat::class);
    }
}

