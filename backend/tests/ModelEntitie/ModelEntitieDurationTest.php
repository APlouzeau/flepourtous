<?php

use PHPUnit\Framework\TestCase;

/**
 * PLAN DE TEST - ModelDuration
 * 
 * Objectif : Tester les méthodes de récupération des durées avec la vraie BDD
 * Cas testés :
 * - getAllDurations : Récupère toutes les durées
 * - getDurationById : Récupère une durée par son ID (cas valide)
 * - getDurationById : Récupère une durée par son ID (cas invalide)
 */

class ModelEntitieDurationTest extends TestCase
{
    private $modelDuration;

    protected function setUp(): void
    {
        // Utilise la vraie connexion à la base de données
        $this->modelDuration = new ModelDuration();
    }

    protected function tearDown(): void
    {
        $this->modelDuration = null;
    }

    /**
     * Test de getAllDurations
     * Vérifie que la méthode retourne un tableau
     */
    public function testGetAllDurations()
    {
        $result = $this->modelDuration->getAllDurations();

        $this->assertIsArray($result);
    }

    /**
     * Test de getDurationById avec un ID valide
     * Vérifie que la méthode retourne les bonnes données
     */
    public function testGetDurationById()
    {
        $result = $this->modelDuration->getDurationById(1);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('idDuration', $result);
        $this->assertArrayHasKey('duration', $result);
        $this->assertEquals(1, $result['idDuration']);
        $this->assertIsInt($result['duration']);
    }

    /**
     * Test de createDuration
     * Vérifie que la création fonctionne
     */
    public function testCreateDuration()
    {
        // Setup
        $duration = new EntitieDuration(['duration' => 9999]);

        // Test
        $result = $this->modelDuration->createDuration($duration);
        $this->assertTrue($result);

        // Cleanup
        $this->modelDuration->deleteDurationFromDuration(9999);
    }

    /**
     * Test de getDurationByDuration avec une durée valide
     * Vérifie que la méthode retourne les bonnes données
     */
    public function testGetDurationByDuration()
    {
        // Setup - créer une durée de test
        $testDuration = 8888;
        $this->modelDuration->createDuration(new EntitieDuration(['duration' => $testDuration]));

        // Test
        $result = $this->modelDuration->getDurationByDuration($testDuration);
        $this->assertIsArray($result);
        $this->assertArrayHasKey('idDuration', $result);
        $this->assertArrayHasKey('duration', $result);
        $this->assertEquals($testDuration, $result['duration']);
        $this->assertIsInt($result['duration']);

        // Cleanup
        $this->modelDuration->deleteDurationFromDuration($testDuration);
    }

    /**
     * Test de getDurationByDuration avec une durée invalide
     * Vérifie que la méthode retourne null
     */
    public function testGetDurationByDurationInvalid()
    {
        $result = $this->modelDuration->getDurationByDuration(999999);
        $this->assertNull($result);
    }

    /**
     * Test de updateDurationFromDuration
     * Vérifie que la modification fonctionne
     */
    public function testUpdateDurationFromDuration()
    {
        // Setup - créer une durée de test
        $oldDuration = 7777;
        $newDuration = 7778;
        $this->modelDuration->createDuration(new EntitieDuration(['duration' => $oldDuration]));

        // Test
        $duration = new EntitieDuration(['duration' => $oldDuration]);
        $result = $this->modelDuration->updateDurationFromDuration($duration, $newDuration);
        $this->assertTrue($result);

        // Vérifier que la modification a bien eu lieu
        $updated = $this->modelDuration->getDurationByDuration($newDuration);
        $this->assertIsArray($updated);
        $this->assertEquals($newDuration, $updated['duration']);

        // Cleanup
        $this->modelDuration->deleteDurationFromDuration($newDuration);
    }

    /**
     * Test de deleteDurationFromDuration
     * Vérifie que la suppression fonctionne
     */
    public function testDeleteDurationFromDuration()
    {
        // Setup - créer une durée de test
        $testDuration = 6666;
        $this->modelDuration->createDuration(new EntitieDuration(['duration' => $testDuration]));

        // Test - supprimer
        $result = $this->modelDuration->deleteDurationFromDuration($testDuration);
        $this->assertTrue($result);

        // Vérifier que c'est bien supprimé
        $deleted = $this->modelDuration->getDurationByDuration($testDuration);
        $this->assertNull($deleted);
    }
}
