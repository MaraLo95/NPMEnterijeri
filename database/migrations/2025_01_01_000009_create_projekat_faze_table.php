<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projekat_faze', function (Blueprint $table) {
            $table->id();
            $table->foreignId('projekat_id')->constrained('projekti')->cascadeOnDelete();
            $table->string('naziv');
            $table->text('opis')->nullable();
            $table->integer('redosled')->default(1);
            $table->enum('status', ['na_cekanju', 'u_toku', 'zavrsena'])->default('na_cekanju');
            $table->timestamps();
            
            $table->index('projekat_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projekat_faze');
    }
};

