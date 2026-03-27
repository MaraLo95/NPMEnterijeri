<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('obracuni_stavke', function (Blueprint $table) {
            $table->id();
            $table->foreignId('obracun_id')->constrained('obracuni_ponuda')->cascadeOnDelete();
            $table->foreignId('cenovnik_id')->nullable()->constrained('cenovnik')->nullOnDelete();
            $table->string('naziv_usluge');
            $table->text('opis')->nullable();
            $table->enum('jedinica_mere', ['KOM', 'M', 'M2', 'H', 'PAK'])->default('KOM');
            $table->decimal('kolicina', 10, 2);
            $table->decimal('cena_po_jm', 12, 2);
            $table->timestamps();
            
            $table->index('obracun_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('obracuni_stavke');
    }
};

