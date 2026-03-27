<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ponude', function (Blueprint $table) {
            $table->id();
            $table->string('broj_ponude', 50)->unique();
            $table->foreignId('klijent_id')->nullable()->constrained('klijenti')->nullOnDelete();
            $table->unsignedBigInteger('obracun_id')->nullable();
            $table->string('naziv_ponude');
            $table->string('naziv_projekta')->nullable();
            $table->date('datum_ponude');
            $table->date('datum_vazenja')->nullable();
            $table->string('rok_isporuke')->nullable();
            $table->string('nacin_placanja')->nullable();
            $table->text('napomena')->nullable();
            $table->text('napomena_pdv')->nullable();
            $table->enum('status', ['nacrt', 'poslata', 'prihvacena', 'odbijena', 'istekla', 'realizovana'])->default('nacrt');
            $table->decimal('ukupna_cena', 12, 2)->default(0);
            $table->boolean('is_novo')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('broj_ponude');
            $table->index('status');
            $table->index('datum_ponude');
        });

        // Dodaj foreign key za obracun_id
        Schema::table('ponude', function (Blueprint $table) {
            $table->foreign('obracun_id')->references('id')->on('obracuni_ponuda')->nullOnDelete();
        });

        // Dodaj foreign key u obracuni_ponuda za ponuda_id
        Schema::table('obracuni_ponuda', function (Blueprint $table) {
            $table->foreign('ponuda_id')->references('id')->on('ponude')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('obracuni_ponuda', function (Blueprint $table) {
            $table->dropForeign(['ponuda_id']);
        });
        
        Schema::dropIfExists('ponude');
    }
};

