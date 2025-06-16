<?php

use PHPUnit\Framework\TestCase;

/**
 * PLAN DE TEST - Validation des informations utilisateur
 * 
 * Objectif : Vérifier la validation des données d'inscription
 * Cas testés :
 * - CT01 : Données valides
 * - CT02 : Email invalide  
 * - CT03 : Pseudo trop court
 * - CT04 : Prénom trop court
 * - CT05 : Nom trop court
 */

class ControllerUserTest extends TestCase
{
    private $controllerUser;

    protected function setUp(): void
    {
        $this->controllerUser = new ControllerUser();
    }

    /**
     * controlUserInformationsTest
     */
    public function testControlUserInformations()
    {
        $validData = [
            'mail' => 'coucou@gmail.com',
            'nickName' => 'Alex',
            'firstName' => 'Alex',
            'lastName' => 'Dupont',
        ];

        $result = $this->controllerUser->controlUserInformations($validData);

        $this->assertEquals(1, $result['code']);
        $this->assertEquals('Informations valides', $result['message']);
    }

    public function testControlUserInformationsWithInvalidEmail()
    {
        $invalidData = [
            'mail' => 'invalid-email',
            'nickName' => 'Alex',
            'firstName' => 'Alex',
            'lastName' => 'Dupont',
        ];

        $result = $this->controllerUser->controlUserInformations($invalidData);

        $this->assertEquals(0, $result['code']);
        $this->assertEquals('Adresse e-mail invalide', $result['message']);
    }

    public function testControlUserInformationsWithNickNameTooShort()
    {
        $emptyData = [
            'mail' => 'coucou@gmail.com',
            'nickName' => 'a',
        ];

        $result = $this->controllerUser->controlUserInformations($emptyData);

        $this->assertEquals(0, $result['code']);
        $this->assertEquals('Le pseudo doit contenir au moins 2 caractères', $result['message']);
    }

    public function testControlUserInformationsWithFirstNameTooShort()
    {
        $emptyData = [
            'mail' => 'coucou@gmail.com',
            'nickName' => 'ab',
            'firstName' => 'A',
        ];

        $result = $this->controllerUser->controlUserInformations($emptyData);

        $this->assertEquals(0, $result['code']);
        $this->assertEquals('Le prénom doit contenir au moins 2 caractères', $result['message']);
    }

    public function testControlUserInformationsWithLastNameTooShort()
    {
        $emptyData = [
            'mail' => 'coucou@gmail.com',
            'nickName' => 'ab',
            'firstName' => 'Ab',
            'lastName' => 'A',
        ];

        $result = $this->controllerUser->controlUserInformations($emptyData);

        $this->assertEquals(0, $result['code']);
        $this->assertEquals('Le nom doit contenir au moins 2 caractères', $result['message']);
    }
}
