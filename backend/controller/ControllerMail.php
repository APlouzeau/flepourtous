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

    public function sendMailToAlertForNextAppointment()
    {
        error_log("Verifying if there are upcoming events in the next hour...");

            $apiKey = $_SERVER['HTTP_API_KEY'] ?? null; 
        if ($apiKey !== CRON_KEY) { 
        error_log("Unauthorized attempt to access sendMailToAlertForNextAppointment. IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
        http_response_code(403); // Forbidden
        echo json_encode(['code' => 0, 'message' => 'Accès non autorisé']);
        return false; // Ou exit();
    }

        $dateNow = new DateTime("now", new DateTimeZone('UTC'));
        ;

        $modelEvent = new ModelEvent();
        $eventsToAlert = $modelEvent->checkEventForNextHour($dateNow->format('Y-m-d H:i:s'));
        if (!$eventsToAlert) {
            error_log("No upcoming events found.");
            return false; // No events found in the next hour
        }

        foreach ($eventsToAlert as $event) {
            try {
                $this->mailer->addAddress($event['mail']);
                $this->mailer->isHTML(true);
                $this->mailer->Subject = "Rappel de votre rendez-vous sur FlePourTous";
                
                $emailBody = "Bonjour " . htmlspecialchars($event['firstName'] . " " . $event['lastName']) . ",<br><br>";
                $emailBody .= "Ceci est un rappel pour votre rendez-vous prévu le " . htmlspecialchars($event['startDateTime']) . " UTC.<br>";
                $emailBody .= "Description : " . htmlspecialchars($event['description']) . "<br>";
                if ($event['visioLink']) {
                    $emailBody .= "Lien de visio : <a href=\"" . htmlspecialchars($event['visioLink']) . "\">" . "Lien de visio . </a><br>";
                }
                $emailBody .= "<br>Cordialement,<br>L'équipe Flepourtous";
                $this->mailer->Body = $emailBody;
                
                $this->mailer->send();
                
            } catch (Exception $e) {
                error_log("Mailer Error: " . $this->mailer->ErrorInfo);
            } finally {
                if ($this->mailer) {
                    $this->mailer->clearAddresses(); // Clear addresses after sending
                    $this->mailer->clearAttachments(); // Clear attachments if any
                }
            }
        }
    }
}
