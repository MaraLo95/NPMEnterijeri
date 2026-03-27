<?php
/**
 * Fallback za hosting gde document root nije public/
 * Prosleđuje sve zahteve na public/index.php
 */
require __DIR__.'/public/index.php';
