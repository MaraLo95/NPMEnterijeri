<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('obracuni_ponuda', function (Blueprint $table) {
            $table->id();
            $table->string('broj_obracuna', 50)->unique();
            $table->foreignId('klijent_id')->nullable()->constrained('klijenti')->nullOnDelete();
            // ponuda_id FK se dodaje u create_ponude_table - kružna zavisnost (ponude još ne postoji)
            $table->unsignedBigInteger('ponuda_id')->nullable();
            $table->string('naziv_projekta');
            $table->date('datum_obracuna');
            $table->decimal('ukupna_cena_materijala', 12, 2)->default(0);
            $table->integer('profit_procenat')->nullable();
            $table->decimal('profit_iznos', 12, 2)->default(0);
            $table->decimal('ukupna_cena_ponude', 12, 2)->default(0);
            $table->enum('status', ['nacrt', 'poslata', 'prihvacena', 'odbijena', 'realizovana'])->default('nacrt');
            $table->boolean('is_novo')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('broj_obracuna');
            $table->index('status');
            $table->index('datum_obracuna');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('obracuni_ponuda');
    }
};

