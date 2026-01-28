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
 * - CT06 : Mots de passe qui ne correspondent pas
 * - CT07 : Mot de passe trop court
 * - CT08 : Mot de passe adéquat
 */

class ControllerUserTest extends TestCase
{
    private $controllerUser;

    protected function setUp(): void
    {
        $this->controllerUser = new ControllerUser();
    }

    protected function tearDown(): void
    {
        $this->controllerUser = null;
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
        $this->assertEquals('Le pseudo doit contenir entre 2 et 25 caractères', $result['message']);
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
        $this->assertEquals('Le prénom doit contenir entre 2 et 25 caractères', $result['message']);
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
        $this->assertEquals('Le nom doit contenir entre 2 et 25 caractères', $result['message']);
    }

    /**
     * CT06 : Test avec des mots de passe qui ne correspondent pas
     */
    public function testControlUserInformationsWithPasswordsNotMatching()
    {
        $data = [
            'mail' => 'test@example.com',
            'nickName' => 'tester',
            'firstName' => 'Test',
            'lastName' => 'User',
            'password' => 'password1234',
            'passwordConfirm' => 'password5678' // Mots de passe différents
        ];

        $result = $this->controllerUser->controlUserPasswordFormat($data);

        $this->assertEquals(0, $result['code']);
        $this->assertEquals('Les mots de passe ne correspondent pas', $result['message']);
    }

    /**
     * CT07 : Test avec un mot de passe trop court
     */
    public function testControlUserInformationsWithPasswordTooShort()
    {
        $data = [
            'mail' => 'test@example.com',
            'nickName' => 'tester',
            'firstName' => 'Test',
            'lastName' => 'User',
            'password' => '123',
            'passwordConfirm' => '123'
        ];

        $result = $this->controllerUser->controlUserPasswordFormat($data);

        $this->assertEquals(0, $result['code']);
        $this->assertEquals('Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.', $result['message']);
    }

    /**
     * CT08 : Test avec un mot de passe adéquat
     */
    public function testControlUserInformationsWithValidPassword()
    {
        $data = [
            'mail' => 'test@example.com',
            'nickName' => 'tester',
            'firstName' => 'Test',
            'lastName' => 'User',
            'password' => 'Password123!',
            'passwordConfirm' => 'Password123!'
        ];

        $result = $this->controllerUser->controlUserPasswordFormat($data);

        $this->assertEquals(1, $result['code']);
        $this->assertEquals('Mot de passe valide', $result['message']);
    }
}
