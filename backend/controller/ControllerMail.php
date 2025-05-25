<?php

require_once APP_PATH . 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class ControllerMail
{
    private $mailer;

    public function __construct()
    {
        $this->mailer = new PHPMailer(true);

        try {

            $this->mailer->isSMTP();
            $this->mailer->Host = MAIL_HOST;
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = MAIL_USERNAME;
            $this->mailer->Password = MAIL_PASSWORD;
            $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $this->mailer->Port = MAIL_PORT;
            $this->mailer->SMTPDebug = SMTP::DEBUG_SERVER;

            $this->mailer->CharSet = 'UTF-8';

            $this->mailer->setFrom(MAIL_USERNAME, 'FlePourTous - Support');


        } catch (Exception $e) {
            error_log("Mailer Error: " . $this->mailer->ErrorInfo);
            throw new Exception("Mailer could not be initialized: " . $e->getMessage());
        }
    }

    public function sendMailToRegister(EntitieUser $user, $verificationToken)
    {
        error_log("Sending registration email to: " . $user->getMail());
        try {
            $this->mailer->addAddress($user->getMail());
            $this->mailer->isHTML(true);
            $this->mailer->Subject = "Vérification de votre adresse e-mail pour le site FlePourTous";

            $emailBody = "Bonjour " . htmlspecialchars($user->getFirstName() . " " . $user->getLastName()) . ",<br><br>";
            $emailBody .= "Merci de vous être inscrit sur FlePourTous ! Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :<br>";
            $emailBody .= "<a href=\"" . htmlspecialchars(URI . "api/verify-email/" . $verificationToken) . "\">" . "Lien de confirmation</a><br><br>";
            $emailBody .= "Si vous n'avez pas créé de compte, veuillez ignorer cet email.<br><br>";
            $emailBody .= "Cordialement,<br>L'équipe Flepourtous";
            $this->mailer->Body = $emailBody;

            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Mailer Error: " . $this->mailer->ErrorInfo);
            return false;
        } finally {
            if ($this->mailer) {
                $this->mailer->clearAddresses(); // Clear addresses after sending
                $this->mailer->clearAttachments(); // Clear attachments if any
            }
        }
    }
}
