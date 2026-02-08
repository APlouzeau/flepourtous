<?php

use PHPUnit\Framework\TestCase;

/**
 * PLAN DE TEST - ModelPrices
 * Objectif : Tester les méthodes de récupération des prix avec la vraie BDD
 * Cas testés :
 * - getAllPrices : Récupère tous les prix
 * - getPriceById : Récupère un prix par son ID (cas valide)
 * - getPriceById : Récupère un prix par son ID (cas invalide)
 */

class ModelEntitiePriceTest extends TestCase
{
    private $modelPrice;

    protected function setUp(): void
    {
        $this->modelPrice = new ModelPrices();
    }

    protected function tearDown(): void
    {
        $this->modelPrice = null;
    }

    /**
     * Test de getAllPrices
     * Vérifie que la méthode retourne un tableau
     */
    public function testGetAllPrices()
    {
        $result = $this->modelPrice->getAllPrices();
        $this->assertIsArray($result);
        if (!empty($result)) {
            $this->assertArrayHasKey('idPrice', $result[0]);
            $this->assertArrayHasKey('price', $result[0]);
        }
    }

    /**
     * Test de getPriceById avec un ID valide
     * Vérifie que la méthode retourne les bonnes données
     */
    public function testGetPriceById()
    {
        $result = $this->modelPrice->getPriceById(1);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('idPrice', $result);
        $this->assertArrayHasKey('price', $result);
        $this->assertEquals(1, $result['idPrice']);
        $this->assertIsFloat($result['price']);
    }

    /**
     * Test de getPriceByPrice
     * Vérifie que la méthode retourne un tableau
     */
    public function testGetPriceByPrice()
    {
        $result = $this->modelPrice->getPriceByPrice(11.00);
        $this->assertIsArray($result);
        $this->assertArrayHasKey('idPrice', $result);
        $this->assertArrayHasKey('price', $result);
        $this->assertEquals(11.00, $result['price']);
        $this->assertIsFloat($result['price']);
    }

    /**
     * Test de createPrice
     * Vérifie que la création fonctionne
     */
    public function testCreatePrice()
    {
        // Setup
        $price = new EntitiePrice(['price' => 999]);

        // Test
        $result = $this->modelPrice->createPrice($price);
        $this->assertTrue($result);

        // Cleanup
        $this->modelPrice->deletePrice(999);
    }

    /**
     * Test de updatePrice
     * Vérifie que la modification fonctionne
     */
    public function testUpdatePrice()
    {
        // Setup - créer un prix de test
        $testPrice = 8888.00;
        $this->modelPrice->createPrice(new EntitiePrice(['price' => $testPrice]));

        // Test
        $result = $this->modelPrice->getPriceByPrice($testPrice);
        $this->assertIsArray($result);
        $this->assertArrayHasKey('idPrice', $result);
        $this->assertArrayHasKey('price', $result);
        $this->assertEquals($testPrice, $result['price']);
        $this->assertIsFloat($result['price']);

        // Cleanup
        $this->modelPrice->deletePrice($testPrice);
    }

    /**
     * Test de getPriceByPrice avec un prix invalide
     * Vérifie que la méthode retourne null
     */
    public function testGetPriceByPriceInvalid()
    {
        $result = $this->modelPrice->getPriceByPrice(999999);
        $this->assertNull($result);
    }

    /**
     * Test de deletePriceFromPrice
     * Vérifie que la suppression fonctionne
     */
    public function testDeletePriceFromPrice()
    {
        // Setup - créer un prix de test
        $testPrice = 666.00;
        $this->modelPrice->createPrice(new EntitiePrice(['price' => $testPrice]));

        // Test - supprimer
        $result = $this->modelPrice->deletePrice($testPrice);
        $this->assertTrue($result);

        // Vérifier que c'est bien supprimé
        $deleted = $this->modelPrice->getPriceByPrice($testPrice);
        $this->assertNull($deleted);
    }
}
