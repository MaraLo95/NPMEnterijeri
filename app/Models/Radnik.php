<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Radnik extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'radnici';

    protected $fillable = [
        'ime',
        'prezime',
        'email',
        'telefon',
        'adresa',
        'jmbg',
        'datum_zaposlenja',
        'pozicija',
        'satnica',
        'status',
        'napomena'
    ];

    protected $casts = [
        'datum_zaposlenja' => 'date',
        'satnica' => 'decimal:2'
    ];

    /**
     * Accessor za puno ime
     */
    public function getPunoImeAttribute()
    {
        return "{$this->ime} {$this->prezime}";
    }

    /**
     * Relacija sa projektima (many-to-many)
     */
    public function projekti()
    {
        return $this->belongsToMany(Projekat::class, 'projekat_radnik')
            ->withPivot('uloga')
            ->withTimestamps();
    }

    /**
     * Relacija sa satnicama
     */
    public function satnice()
    {
        return $this->hasMany(Satnica::class);
    }
}

