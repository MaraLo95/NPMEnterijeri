<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('klijenti', function (Blueprint $table) {
            $table->id();
            $table->string('naziv');
            $table->enum('tip', ['fizicko_lice', 'pravno_lice'])->default('pravno_lice');
            $table->string('email')->nullable();
            $table->string('telefon', 50)->nullable();
            $table->string('adresa')->nullable();
            $table->string('grad', 100)->nullable();
            $table->string('postanski_broj', 20)->nullable();
            $table->string('pib', 20)->nullable();
            $table->string('maticni_broj', 20)->nullable();
            $table->string('kontakt_osoba')->nullable();
            $table->text('napomena')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('naziv');
            $table->index('pib');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('klijenti');
    }
};

