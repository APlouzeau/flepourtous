<div class="form">
    <form method="POST" action="<?= BASE_URL . 'register'; ?>">
        <input type="text" placeholder="Nom" name="pseudo" required />
        <input type="password" placeholder="Mot de passe" name="password" required />
        <button type="submit">Inscription</button>
    </form>
    <a href="<?= BASE_URL . "login" ?>"><button>Vous avez un compte? Connectez-vous ici !</button></a>
</div>