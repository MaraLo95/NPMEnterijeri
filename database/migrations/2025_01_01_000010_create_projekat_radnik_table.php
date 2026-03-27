<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projekat_radnik', function (Blueprint $table) {
            $table->id();
            $table->foreignId('projekat_id')->constrained('projekti')->cascadeOnDelete();
            $table->foreignId('radnik_id')->constrained('radnici')->cascadeOnDelete();
            $table->string('uloga', 100)->nullable();
            $table->timestamps();
            
            $table->unique(['projekat_id', 'radnik_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projekat_radnik');
    }
};

