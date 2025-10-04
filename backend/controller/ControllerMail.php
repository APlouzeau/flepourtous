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
            $this->mailer->SMTPDebug = SMTP::DEBUG_OFF;

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
            $emailBody .= "<a href=\"" . htmlspecialchars(URI_MAIL . "api/verify-email/" . $verificationToken) . "\">Cliquez ici pour confirmer votre email</a><br><br>";
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
            return false;
        }

        $dateNow = new DateTime("now", new DateTimeZone('UTC'));

        $modelEvent = new ModelEvent();
        $eventsToAlert = $modelEvent->checkEventForNextHour($dateNow->format('Y-m-d H:i:s'));
        if (!$eventsToAlert) {
            error_log("No upcoming events found.");
            return false;
        }

        foreach ($eventsToAlert as $event) {
            try {
                $this->sendAppointmentReminderToUser($event);
                $this->sendAppointmentReminderToTeacher($event);
            } catch (Exception $e) {
                error_log("Mailer Error: " . $this->mailer->ErrorInfo);
            } finally {
                if ($this->mailer) {
                    $this->mailer->clearAddresses();
                    $this->mailer->clearAttachments();
                }
            }
        }
    }

    private function sendAppointmentReminderToUser($event)
    {
        if ($event['mail'] == TEACHER_MAIL) {
            return;
        }
        $appointmentDateTime = new DateTime($event['startDateTime'], new DateTimeZone('UTC'));
        $appointmentHour = $appointmentDateTime->format('H:i');

        $this->mailer->addAddress($event['mail']);
        $this->mailer->isHTML(true);
        $this->mailer->Subject = "Appointment reminder on FlePourTous";

        $emailBody = "Dear " . htmlspecialchars($event['firstName'] . " " . $event['lastName']) . ",<br><br>";
        $emailBody .= "This is a reminder for your appointment at " . htmlspecialchars($appointmentHour) . " UTC.<br>";

        if ($event['description'] != '') {
            $emailBody .= "Description : " . htmlspecialchars($event['description']) . "<br>";
        }

        if ($event['visioLink'] != '') {
            $emailBody .= "VisioLink : <a href=\"" . htmlspecialchars($event['visioLink']) . "\">" . "click here at appointment time. </a><br>";
        }
        $emailBody .= "<br>Warm regards,<br>Flepourtous Team";
        $this->mailer->Body = $emailBody;

        $this->mailer->send();
        $this->mailer->clearAddresses();
    }

    private function sendAppointmentReminderToTeacher($event)
    {
        if (!defined('TEACHER_MAIL') || TEACHER_MAIL == '') {
            return;
        }
        $dateTimeUtc = new DateTime($event['startDateTime'], new DateTimeZone('UTC'));
        $dateTimeParis = $dateTimeUtc->setTimezone(new DateTimeZone('Europe/Paris'));
        $this->mailer->addAddress(TEACHER_MAIL);
        $this->mailer->Subject = "Rappel de rendez-vous pour " . htmlspecialchars($event['firstName'] . " " . $event['lastName']);
        $teacherEmailBody = "Un rappel a été envoyé à l'élève.<br><br>";
        $teacherEmailBody .= "Rendez-vous prévu à : " . htmlspecialchars($dateTimeParis->format('H:i')) . " UTC.<br>";
        if ($event['description'] != '') {
            $teacherEmailBody .= "Description : " . htmlspecialchars($event['description']) . "<br>";
        }
        if ($event['visioLink'] != '') {
            $teacherEmailBody .= "Lien de visio : <a href=\"" . htmlspecialchars($event['visioLink']) . "\">" . "Cliquez ici à l'heure du rendez-vous</a><br>";
        }
        $teacherEmailBody .= "<br>Cordialement,<br>L'équipe Flepourtous<br><br><br><br>Alex quoi :D";
        $this->mailer->Body = $teacherEmailBody;
        $this->mailer->isHTML(true);
        $this->mailer->send();
        $this->mailer->clearAddresses();
    }

    public function sendMailToAlertEventDeleteBecauseNotPaid(array $user)
    {
        $userEntitie = new EntitieUser([
            'idUser' => $user['idUser']
        ]);
        $startDateTime = $user['startDateTime'];
        $appointmentDateTime = new DateTime($startDateTime, new DateTimeZone('UTC'));
        $appointmentDate = $appointmentDateTime->format('d-m H:i:s');
        $appointmentHour = $appointmentDateTime->format('H:i');

        $modelUser = new ModelUser();
        $userInformations = $modelUser->getUser($userEntitie);

        $this->mailer->addAddress($userInformations['mail']);
        $this->mailer->isHTML(true);
        $this->mailer->Subject = "Annulation de rendez-vous sur FLEpourtous";
        $emailBody = "Bonjour " . htmlspecialchars($userInformations['firstName'] . " " . $userInformations['lastName']) . ",<br><br>";
        $emailBody .= "Nous vous informons que votre rendez-vous prévu le " . htmlspecialchars($appointmentDate) . " à " . htmlspecialchars($appointmentHour) . " a été annulé car vous n'avez pas réglé le montant de la leçon.<br>";
        $emailBody .= "Nous vous invitons à prendre un nouveau rendez-vous.";
        $emailBody .= "Cordialement,<br>L'équipe Flepourtous";
        $this->mailer->Body = $emailBody;
        $this->mailer->send();
        $this->mailer->clearAddresses();
    }

    public function sendMailToForgetedPassword($mail, $token)
    {
        error_log("Sending password reset email to: " . $mail);
        try {
            $this->mailer->addAddress($mail);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = "Réinitialisation de votre mot de passe sur FlePourTous";

            $emailBody = "Bonjour " . ",<br><br>";
            $emailBody .= "Nous avons reçu une demande de réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :<br>";
            $emailBody .= "<a href=\"" . htmlspecialchars(URI . "api/reset-password/" . $token) . "\">" . "Lien de réinitialisation</a><br><br>";
            $emailBody .= "Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.<br><br>";
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

    public function sendMailForPaymentSuccess(string $user, string $eventId)
    {
        $modelEvent = new ModelEvent();
        $modelUser = new ModelUser();
        try {
            $user = $modelUser->getUser(new EntitieUser(['idUser' => $user]));
            $userMail = $user['mail'];
            error_log("Sending registration email to: " . $user['firstName'] . " " . $user['lastName'] . " at " . $userMail);

            $event = $modelEvent->getEventById($eventId);
            $eventDateTimeUtc = new DateTime($event['startDateTime']);
            $eventDateTimeUserTimezone = $eventDateTimeUtc->setTimezone(new DateTimeZone($event['timezone']));

            $eventDate = $eventDateTimeUserTimezone->format('d F Y');    // 11 September 2025
            $eventHour = $eventDateTimeUserTimezone->format('G\hi');       // 14:30

            $this->mailer->addAddress($userMail);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = "Flepourtous - Confirmation de paiement";

            $emailBody = "Bonjour " . htmlspecialchars($user['firstName'] . " " . $user['lastName']) . ",<br><br>";
            $emailBody .= "Merci d'avoir reservé un cours sur FlePourTous !<br>";
            $emailBody .= "Nous vous confirmons que votre paiement a bien été pris en compte et que votre rendez-vous le " . htmlspecialchars($eventDate) . " à " . htmlspecialchars($eventHour) . " (heure " . htmlspecialchars($event['timezone']) . ")" . " est confirmé.<br>";
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

    public function sendVisioEmail($email, $roomUrl, $duration)
    {
        error_log("Sending visio email to: " . $email);
        try {
            $this->mailer->addAddress($email);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = "Votre salle de visio Flepourtous";

            $emailBody = "Bonjour,<br><br>";
            $emailBody .= "Votre salle de visio a été créée. Vous pouvez rejoindre la salle en cliquant sur le lien ci-dessous :<br>";
            $emailBody .= "<a href=\"" . htmlspecialchars($roomUrl) . "\">" . "Rejoindre la salle de visio</a><br><br>";
            $emailBody .= "La salle sera disponible pendant les prochaines " . htmlspecialchars($duration) . " minutes.<br><br>";
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

    public function sendMailToConfirmCancelAppointment(EntitieEvent $event, bool $paid) {}
    public function sendMailToAlertEventDeleteByAdmin($userId, $startDateTime, $timezone, $amount)
    {
        $modelUser = new ModelUser();
        $userInformations = $modelUser->getUser(new EntitieUser(['idUser' => $userId]));
        $appointmentDateTimeUTC = new DateTime($startDateTime);
        $appointmentDateTime = $appointmentDateTimeUTC->setTimezone(new DateTimeZone($timezone));

        // 🎨 Formatage user-friendly
        setlocale(LC_TIME, 'fr_FR.UTF-8', 'fr_FR', 'french'); // Pour les noms français
        $appointmentDate = $appointmentDateTime->format('j F Y'); // "4 octobre 2025"
        $appointmentHour = $appointmentDateTime->format('G\hi'); // "14h30" au lieu de "14:30"


        $this->mailer->addAddress($userInformations['mail']);
        $this->mailer->isHTML(true);
        $this->mailer->Subject = "Annulation de rendez-vous par l'administrateur sur FLEpourtous";
        $emailBody = "Bonjour " . htmlspecialchars($userInformations['firstName'] . " " . $userInformations['lastName']) . ",<br><br>";
        $emailBody .= "Nous vous informons que votre rendez-vous prévu le " . htmlspecialchars($appointmentDate) . " à " . htmlspecialchars($appointmentHour) . " a été annulé par l'administrateur du site.<br>";
        $emailBody .= "Le montant de " . htmlspecialchars($amount) . " € a été recrédité sur votre porte-monnaie électronique.<br>";
        $emailBody .= "Nous vous invitons à prendre un nouveau rendez-vous.<br>";
        $emailBody .= "Cordialement,<br>L'équipe Flepourtous";
        $this->mailer->Body = $emailBody;
        $this->mailer->send();
        $this->mailer->clearAddresses();
        $this->mailer->clearAttachments();
    }
}
