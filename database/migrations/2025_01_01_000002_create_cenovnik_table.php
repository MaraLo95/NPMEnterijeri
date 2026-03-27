<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cenovnik', function (Blueprint $table) {
            $table->id();
            $table->string('vrsta_usluge');
            $table->text('opis_usluge')->nullable();
            $table->enum('jedinica_mere', ['KOM', 'M', 'M2', 'H', 'PAK'])->default('KOM');
            $table->decimal('cena_eur', 10, 2);
            $table->timestamps();
            
            $table->index('vrsta_usluge');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cenovnik');
    }
};

