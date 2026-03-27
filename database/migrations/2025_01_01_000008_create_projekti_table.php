<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projekti', function (Blueprint $table) {
            $table->id();
            $table->string('broj_projekta', 50)->unique();
            $table->string('naziv');
            $table->text('opis')->nullable();
            $table->foreignId('klijent_id')->nullable()->constrained('klijenti')->nullOnDelete();
            $table->foreignId('ponuda_id')->nullable()->constrained('ponude')->nullOnDelete();
            $table->date('datum_pocetka');
            $table->date('datum_zavrsetka')->nullable();
            $table->enum('prioritet', ['nizak', 'srednji', 'visok', 'hitan'])->default('srednji');
            $table->enum('status', ['na_cekanju', 'aktivan', 'pauziran', 'zavrsen', 'otkazan'])->default('na_cekanju');
            $table->decimal('ukupna_vrednost', 12, 2)->default(0);
            $table->string('adresa_lokacije')->nullable();
            $table->text('napomene')->nullable();
            $table->integer('procenat_zavrsenosti')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('broj_projekta');
            $table->index('status');
            $table->index('prioritet');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projekti');
    }
};

