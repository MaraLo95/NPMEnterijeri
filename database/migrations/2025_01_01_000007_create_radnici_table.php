<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('radnici', function (Blueprint $table) {
            $table->id();
            $table->string('ime');
            $table->string('prezime');
            $table->string('email')->nullable();
            $table->string('telefon', 50)->nullable();
            $table->string('adresa')->nullable();
            $table->string('jmbg', 13)->nullable();
            $table->date('datum_zaposlenja')->nullable();
            $table->string('pozicija', 100)->nullable();
            $table->decimal('satnica', 10, 2)->nullable();
            $table->enum('status', ['aktivan', 'neaktivan', 'na_odsustvu'])->default('aktivan');
            $table->text('napomena')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['ime', 'prezime']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('radnici');
    }
};

