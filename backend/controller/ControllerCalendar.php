<?php

use App\Enum\AppointmentStatus as EnumAppointmentStatus;
use Google\Service\Adsense\TimeZone;
use config\enum\AppointmentStatus;

require_once APP_PATH . 'vendor/autoload.php';



if (!class_exists('Google_Service_Calendar')) {
    die('ERREUR : La classe Google_Service_Calendar n\'a pas été trouvée par l\'autoloader.');
}
class ControllerCalendar
{
    private $frenchTimeZone = "Europe/Paris";
    private $modelEvent;
    private $modelUser;
    private $modelLesson;
    private $modelPrice;
    private $controllerMail;
    private $controllerUser;
    private $controllerLesson;
    private $controllerVisio;
    private $controllerError;

    private const EVENT_LOG_FILE = 'event_log';

    // Codes d'annulation, partagés avec le front (checkDeleteEvent → modale → deleteEvent).
    public const CANCEL_REFUNDED = 1;          // plus de 24 h avant : recrédité
    public const CANCEL_LATE_NOT_REFUNDED = 2; // moins de 24 h avant : séance due
    public const CANCEL_ADMIN = 3;             // annulation par l'admin : recrédité
    private const CANCEL_FREE_DELAY_SECONDS = 24 * 3600;

    // Prise de rendez-vous (FLE-113).
    public const ALLOWED_DURATIONS = [30, 45, 60];
    private const SLOT_STEP_MINUTES = 15;
    private const MIN_DELAY_BEFORE_APPOINTMENT_SECONDS = 8 * 3600;
    // Plages de la professeure, en heure de Paris, par jour ISO (1 = lundi … 7 = dimanche).
    // Heure de fin = fin du dernier cours. Remplacé par la table des horaires dans FLE-32.
    private const DEFAULT_TEACHER_RANGES = [
        1 => [['08:30', '21:30']],
        2 => [['08:30', '21:30']],
        3 => [['08:30', '21:30']],
        4 => [['08:30', '21:30']],
        5 => [['08:30', '21:30']],
        6 => [['08:30', '21:30']],
        7 => [['08:30', '21:30']],
    ];

    /**
     * Règle d'annulation, unique pour checkDeleteEvent et deleteEvent.
     * Le code demandé par le front n'est écouté que pour l'annulation admin (3),
     * et seulement si la session est admin ; sinon seul le délai avant le cours compte.
     *
     * @param string $startDateTimeUtc startDateTime de la table event (UTC)
     */
    public static function cancellationCode(string $startDateTimeUtc, bool $isAdmin, mixed $requestedCode, ?DateTimeImmutable $now = null): int
    {
        if ($isAdmin && (int) $requestedCode === self::CANCEL_ADMIN) {
            return self::CANCEL_ADMIN;
        }

        $utc = new DateTimeZone('UTC');
        $now = $now ?? new DateTimeImmutable('now', $utc);
        $timeRemaining = (new DateTimeImmutable($startDateTimeUtc, $utc))->getTimestamp() - $now->getTimestamp();

        return $timeRemaining < self::CANCEL_FREE_DELAY_SECONDS ? self::CANCEL_LATE_NOT_REFUNDED : self::CANCEL_REFUNDED;
    }

    public function __construct()
    {
        $this->modelEvent = new ModelEvent();
        $this->modelUser = new ModelUser();
        $this->modelLesson = new ModelLesson();
        $this->modelPrice = new ModelPrices();
        $this->controllerMail = new ControllerMail();
        $this->controllerUser = new ControllerUser();
        $this->controllerLesson = new ControllerLesson();
        $this->controllerVisio = new ControllerVisio();
        $this->controllerError = new ControllerError();
    }

    public function listEvents()
    {
        $this->controllerUser->verifyConnectBack();

        if ($_SESSION['role'] != 'admin') {

            $this->listEventsUser();
        } else {
            $this->listEventsMain();
        }
    }

    private function getClient()
    {
        $keyFilePath = APP_PATH . 'config/service-account-key.json'; // Chemin vers ta clé JSON
        if (!file_exists($keyFilePath)) {
            throw new Exception("Fichier de clé du compte de service introuvable : " . $keyFilePath);
        }

        $client = new \Google\Client();
        $client->setAuthConfig($keyFilePath);
        $client->addScope(Google\Service\Calendar::CALENDAR);

        return $client;
    }

    public function listEventsMain()
    {
        $events = $this->modelEvent->getAllEvents();
        if (count($events) == 0) {
            $response = [
                'code' => 0,
                'message' => 'Pas de rendez-vous'
            ];
        } else {
            $response = [
                'code' => 1,
                'message' => 'Rendez-vous récupérés avec succès',
                'data' => $events
            ];
        }
        echo json_encode($response);
    }

    public function createEvent()
    {
        $this->controllerUser->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);


        if (!$data || !isset($data['description']) || !isset($data['startDate']) || !isset($data['startTime']) || !isset($data['duration']) || !isset($data['id_lesson'])) {
            http_response_code(400); // Bad Request
            $response = [
                'code' => 0,
                'message' => 'Données manquante pour créer le rendez-vous.',
            ];
            echo json_encode($response);
            exit();
        } else {
            $availableDuration = [30, 45, 60];
            if ($data['duration'] && !in_array($data['duration'], $availableDuration)) {
                http_response_code(400);
                $response = [
                    'code' => 0,
                    'message' => 'La durée doit être de 30, 45 ou 60 minutes.',
                ];
                echo json_encode($response);
                exit();
            }
        }

        $startDateTime = $data['startDate'] . ' ' . $data['startTime'] . ':00';
        $userTimeZone = $data['userTimeZone'];
        $userStartDateTime = new DateTime($startDateTime, new DateTimeZone($userTimeZone));
        $userStartDateTimeUTC = $userStartDateTime->setTimezone(new DateTimeZone('UTC'));
        $userStartDateTimeUTCToString = $userStartDateTimeUTC->format('Y-m-d H:i:s');
        $nowUTC = new DateTime('now', new DateTimeZone('UTC'));
        $appointDateTimeMin = $nowUTC->add(new DateInterval('PT8H'));

        if ($userStartDateTimeUTC < $appointDateTimeMin) {
            http_response_code(400); // Bad Request
            $response = [
                'code' => 0,
                'message' => 'La date et l\'heure de début doivent être au moins 8 heures dans le futur.',
                'data' => [
                    'appointDateTimeMin' => $appointDateTimeMin->format('Y-m-d H:i:s'),
                    'userStartDateTimeUTCToString' => $userStartDateTimeUTCToString,
                ]
            ];
            echo json_encode($response);
            exit();
        }

        $idLesson = (int)$data['id_lesson'];
        $userId = $_SESSION['idUser'];
        $description = $data['description'];
        $duration = $data['duration'];
        $createdAt = date('Y-m-d H:i:s');
        $updatedAt = date('Y-m-d H:i:s');
        $status = AppointmentStatus::PENDING->value;
        $appointmentName = $_SESSION['firstName'] . "-" . $_SESSION['lastName'];

        // Récupérer l'email de l'utilisateur pour l'ajouter comme attendee dans Google Calendar
        $user = new EntitieUser([
            'idUser' => $userId,
        ]);
        $userData = $this->modelUser->getUser($user);
        $userEmail = $userData['mail'] ?? null;

        try {
            $utcDateTimeForGoogle = new DateTime($userStartDateTimeUTCToString, new DateTimeZone('UTC'));

            $parisStartDateTime = (clone $utcDateTimeForGoogle)->setTimezone(new DateTimeZone($this->frenchTimeZone));
            $googleStartDateTime = $parisStartDateTime->format(DateTime::RFC3339);

            $interval = new DateInterval('PT' . $duration . 'M');
            $utcEndDateTimeForGoogle = (clone $utcDateTimeForGoogle)->add($interval);
            $parisEndDateTime = $utcEndDateTimeForGoogle->setTimezone(new DateTimeZone($this->frenchTimeZone));
            $googleEndDateTime = $parisEndDateTime->format(DateTime::RFC3339);

            //GOOGLE INSTANCE
            $client = $this->getClient();
            $service = new Google\Service\Calendar($client);

            // GOOGLE CALENDAR CHECK
            $checkParams = [
                'timeMin' => $googleStartDateTime,
                'timeMax' => $googleEndDateTime,
                'timeZone' => $this->frenchTimeZone,
                'singleEvents' => true,
            ];
            $existingEvents = $service->events->listEvents(GOOGLE_CALENDAR_ID, $checkParams);
            if (count($existingEvents->getItems()) > 0) {
                $response = [
                    'code' => 0,
                    'message' => 'Un événement existe déjà à cette date et heure.',
                ];
                echo json_encode($response);
                exit();
            }

            //GOOGLE CALENDAR register
            $eventDescription = $description ?? '';
            if ($userEmail) {
                $eventDescription .= "\n\nUser: " . $userEmail;
            }
            $eventDescription .= "\n\nSource:app";

            $event = new Google\Service\Calendar\Event([
                'summary' => $appointmentName,
                'description' => $eventDescription,
                'start' => [
                    'dateTime' => $googleStartDateTime, // Format RFC3339 : '2025-05-03T10:00:00+02:00'
                    'timeZone' => $this->frenchTimeZone,
                ],
                'end' => [
                    'dateTime' => $googleEndDateTime, // Format RFC3339 : '2025-05-03T11:00:00+02:00'
                    'timeZone' => $this->frenchTimeZone,
                ],
            ]);

            $createdEvent = $service->events->insert(GOOGLE_CALENDAR_ID, $event);
            if (!$createdEvent) {
                $response = [
                    'code' => 0,
                    'message' => 'Erreur lors de la création de l\'événement dans Google Calendar',
                ];
                echo json_encode($response);
                exit();
            }

            $idEvent = $createdEvent->getId();

            //Visioconférence
            $roomUrl = $this->controllerVisio->createRoom($duration, $userStartDateTimeUTCToString, $idEvent);

            if ($roomUrl === false) {
                $responseVisio = [
                    'code' => 0,
                    'message' => 'Erreur lors de la création de la room visio',
                ];
                echo json_encode($responseVisio);
                return;
            }

            //DATABASE
            $eventDatabase = new EntitieEvent([
                'idEvent' => $idEvent,
                'userId' => $userId,
                'description' => $description,
                'duration' => $duration,
                'createdAt' => $createdAt,
                'startDateTime' => $userStartDateTimeUTCToString,  // Stocké en UTC
                'timezone' => $userTimeZone,  // Timezone de l'utilisateur pour affichage
                'updatedAt' => $updatedAt,
                'status' => $status,
                'visioLink' => $roomUrl,
                'id_lesson' => $idLesson,
            ]);

            $createdEvent = $this->modelEvent->createEvent($eventDatabase);
            $price = $this->modelPrice->getPriceForAppointment($duration, $idLesson);
            $lesson = $this->modelLesson->getLessonById($idLesson);
            $_SESSION['lesson_price'] = $price;
            $_SESSION['lesson_name'] = $lesson['title'];
            $_SESSION['event_id'] = $idEvent;

            if (!$createdEvent) {
                $response = [
                    'code' => 10,
                    'message' => 'Erreur lors de l\'enregistrement de l\'événement en base de données',
                    'data' => $eventDatabase
                ];
                echo json_encode($response);
                return;
            } else {
                $response = [
                    'code' => 1,
                    'message' => 'Événement enregistré avec succès',
                ];
            }
        } catch (Exception $e) {
            $errorResponse = [
                'error' => 'Erreur lors de la création de l\'événement: ' . $e->getMessage(),
                'details' => isset($eventDatabase) ? $eventDatabase : null
            ];
            echo json_encode($errorResponse);
            return;
        }
        echo json_encode($response);
    }

    public function listEventsUser()
    {
        $this->controllerUser->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        $locale = isset($data['locale']) ? $data['locale'] : 'en';
        $events = $this->modelEvent->getEventsUser($_SESSION['idUser'], $locale);
        if (count($events) == 0) {
            $response = [
                'code' => 0,
                'message' => 'Pas de rendez-vous'
            ];
        } else {

            $response = [
                'code' => 1,
                'message' => 'Rendez-vous récupérés avec succès',
                'data' => $events
            ];
        }
        echo json_encode($response);
    }

    public function checkDeleteEvent()
    {
        $this->controllerUser->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);

        if (!$data || !isset($data['idEvent'])) {
            $response = [
                'code' => 0,
                'message' => 'Données manquantes pour vérifier l\'annulation (idEvent requis).'
            ];
            echo json_encode($response);
            return;
        }

        $event = $this->modelEvent->getEventById($data['idEvent']);
        if (!$event) {
            $response = [
                'code' => 0,
                'message' => 'Événement non trouvé en base de données',
            ];
            echo json_encode($response);
            return;
        }

        // Même règle que deleteEvent : un élève ne peut interroger que ses propres cours.
        $isAdmin = ($_SESSION['role'] ?? null) === 'admin';
        if ((int) $event['userId'] !== (int) $_SESSION['idUser'] && !$isAdmin) {
            $response = [
                'code' => 0,
                'message' => 'Vous n\'êtes pas autorisé à supprimer cet événement.',
            ];
            echo json_encode($response);
            return;
        }

        $cancellationCode = self::cancellationCode($event['startDateTime'], $isAdmin, $data['code'] ?? null);

        if ($cancellationCode === self::CANCEL_ADMIN) {
            $response = [
                'code' => 3,
                'message' => "En tant qu'administrateur, vous pouvez annuler ce rendez-vous sans frais pour l'utilisateur. Un mail sera automatiquement envoyé à l'élève afin de le prévenir, et son porte-monnaie sera recrédité. Confirmez-vous l'annulation ?",
            ];
        } else {
            // Logique normale pour les utilisateurs
            if ($cancellationCode === self::CANCEL_LATE_NOT_REFUNDED) {
                $response = [
                    'code' => 2,
                    'message' => "L'annulation d'un rendez-vous moins de 24 heures avant le début entraîne le paiement de la totalité de la séance. Confirmez- vous l'annulation ?",
                ];
            } else {
                $response = [
                    'code' => 1,
                    'message' => "L'annulation d'un rendez-vous plus de 24 heures avant le début n'entraîne aucune pénalité. Le montant de votre leçon sera recrédité sur votre porte-monnaie. Confirmez-vous l'annulation ?",
                ];
            }
        }
        echo json_encode($response);
    }

    public function deleteEvent()
    {
        $this->controllerUser->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);


        if (!$data || !isset($data['idEvent']) || !isset($data['code'])) {
            $response = [
                'code' => 0,
                'message' => 'Données manquantes pour supprimer l\'événement (idEvent requis).'
            ];
            echo json_encode($response);
            return;
        }

        $event = $this->modelEvent->getEventById($data['idEvent']);
        if (!$event) {
            $response = [
                'code' => 0,
                'message' => 'Événement non trouvé en base de données',
            ];
            echo json_encode($response);
            return;
        }

        $isAdmin = ($_SESSION['role'] ?? null) === 'admin';
        if ((int) $event['userId'] !== (int) $_SESSION['idUser'] && !$isAdmin) {
            $response = [
                'code' => 0,
                'message' => 'Vous n\'êtes pas autorisé à supprimer cet événement.',
            ];
            echo json_encode($response);
            return;
        }

        if ($event['status'] != AppointmentStatus::PAID->value && $event['status'] != AppointmentStatus::GOOGLE->value) {
            $response = [
                'code' => 0,
                'message' => 'Seuls les rendez-vous payés ou pris par l\'enseignante peuvent être supprimés.',
            ];
            echo json_encode($response);
            return;
        }

        if ($event['status'] == AppointmentStatus::CANCELLED_REFUNDED->value || $event['status'] == AppointmentStatus::CANCELLED_NOT_REFUNDED->value || $event['status'] == AppointmentStatus::CANCELLED_ADMIN->value) {
            $response = [
                'code' => 0,
                'message' => 'Cet événement a déjà été annulé.',
            ];
            echo json_encode($response);
            return;
        }

        // Le remboursement est décidé ici, jamais par le code envoyé par le navigateur :
        // sinon un élève pourrait envoyer code 1 ou 3 à moins de 24 h et être remboursé.
        $invoiced = self::cancellationCode($event['startDateTime'], $isAdmin, $data['code']);

        // Le code envoyé est celui du message que l'utilisateur a confirmé. S'il ne correspond
        // plus (cap des 24 h franchi entre la confirmation et le clic, ou code falsifié),
        // on n'annule pas : l'utilisateur doit relancer l'annulation et voir les vraies conditions.
        if ((int) $data['code'] !== $invoiced) {
            error_log("Annulation refusée pour l'événement " . $data['idEvent'] . " : code envoyé " . json_encode($data['code']) . ", code calculé $invoiced, utilisateur " . $_SESSION['idUser']);
            http_response_code(409);
            $response = [
                'code' => 0,
                'message' => 'Les conditions d\'annulation ont changé. Relancez l\'annulation pour voir les nouvelles conditions.',
            ];
            echo json_encode($response);
            return;
        }

        $lessonPrice = $this->modelPrice->getPriceByEventId($event['idEvent']);
        $price = (float) ($lessonPrice['price'] ?? 0);

        $newStatus = match ($invoiced) {
            self::CANCEL_REFUNDED => AppointmentStatus::CANCELLED_REFUNDED->value,
            self::CANCEL_LATE_NOT_REFUNDED => AppointmentStatus::CANCELLED_NOT_REFUNDED->value,
            self::CANCEL_ADMIN => AppointmentStatus::CANCELLED_ADMIN->value,
        };
        $refundAmount = $invoiced === self::CANCEL_LATE_NOT_REFUNDED ? 0.0 : $price;

        // Statut et porte-monnaie changés ensemble, et seulement si le cours est encore actif :
        // une deuxième requête simultanée (double clic, requête rejouée) ne recrédite pas.
        $cancelled = $this->modelEvent->cancelAndRefund(
            $data['idEvent'],
            $newStatus,
            [AppointmentStatus::PAID->value, AppointmentStatus::GOOGLE->value],
            (int) $event['userId'],
            $refundAmount
        );

        $this->controllerError->logs("Annulation de l'événement " . $data['idEvent'] . " (code $invoiced) : ", [$cancelled ? 'OK' : 'refusée ou erreur'], self::EVENT_LOG_FILE);

        if (!$cancelled) {
            http_response_code(409);
            $response = [
                'code' => 0,
                'message' => 'Ce rendez-vous a déjà été annulé ou ne peut plus l\'être.',
            ];
            echo json_encode($response);
            return;
        }

        // Effets de bord seulement pour la requête qui a réellement annulé.
        $this->controllerVisio->deleteRoom($data['idEvent']);
        $this->modelEvent->deleteVisioLink($data['idEvent']);

        $this->controllerMail->sendMailToAlertEventDelete($event['userId'], $event['startDateTime'], $event['timezone'], $lessonPrice['price'] ?? 0, $invoiced);
        $this->controllerMail->sendMailToAlertEventDeleteByUser($event['userId'], $event['startDateTime'], $event['timezone'], $lessonPrice['price'] ?? 0, $invoiced);

        $client = $this->getClient();
        $service = new Google\Service\Calendar($client);

        try {
            $service->events->delete(GOOGLE_CALENDAR_ID, $data['idEvent']);
        } catch (Exception $e) {
            // Le cours est déjà annulé et recrédité en base : seul l'agenda Google n'est pas à jour.
            error_log("Événement " . $data['idEvent'] . " annulé en base mais pas supprimé de Google Calendar : " . $e->getMessage());
            $response = [
                'code' => 0,
                'message' => 'Erreur lors de la suppression de l\'événement dans Google Calendar',
            ];
            echo json_encode($response);
            return;
        }

        $response = [
            'code' => 1,
            'message' => 'Événement supprimé de la base de données avec succès',
        ];
        echo json_encode($response);
    }


    public function getAvailablesTimeSlots()
    {
        $this->controllerUser->verifyConnectBack();
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);

        $error = self::validateSlotsRequest(is_array($data) ? $data : []);
        if ($error !== null) {
            http_response_code(400);
            echo json_encode([
                'code' => 0,
                'message' => $error,
            ]);
            return;
        }

        $userTimeZone = new DateTimeZone($data['userTimeZone']);
        $duration = (int) $data['selectedDuration'];
        $teacherTimeZone = new DateTimeZone($this->frenchTimeZone);
        [$dayStart, $dayEnd] = self::userDayBounds($data['date'], $userTimeZone);

        // Périodes occupées sur toute la journée de l'élève (qui peut couvrir deux jours de Paris).
        $controllerGoogle = new ControllerGoogle();
        $events = $controllerGoogle->getOccupiedSlotsOnGoogleCalendar(
            $dayStart->setTimezone(new DateTimeZone('UTC')),
            $dayEnd->setTimezone(new DateTimeZone('UTC'))
        );
        if (!is_array($events)) {
            // Google injoignable : sans les occupations, tous les créneaux paraîtraient libres. On n'en propose aucun.
            http_response_code(503);
            echo json_encode([
                'code' => 0,
                'message' => 'Impossible de vérifier les disponibilités pour le moment.',
            ]);
            return;
        }
        $busyPeriods = [];
        foreach ($events as $event) {
            $busyPeriods[] = [new DateTimeImmutable($event->getStart()), new DateTimeImmutable($event->getEnd())];
        }

        $slots = self::computeAvailableSlots(
            $data['date'],
            $userTimeZone,
            $duration,
            self::DEFAULT_TEACHER_RANGES,
            $teacherTimeZone,
            $busyPeriods
        );

        if (empty($slots)) {
            echo json_encode(['code' => 0]);
            return;
        }

        echo json_encode([
            'code' => 1,
            'message' => 'Créneaux disponibles récupérés avec succès',
            'data' => array_map(fn(DateTimeImmutable $slot) => $slot->format('H:i'), $slots),
        ]);
    }

    /**
     * Contrôle les paramètres de getAvailableTimeSlots. Renvoie le message d'erreur, ou null si tout est valide.
     * Fuseaux : identifiants IANA, y compris les anciens noms que renvoient encore les navigateurs
     * (Asia/Calcutta, Europe/Kiev…). Décalages fixes (« +02:00 ») et abréviations (« CEST ») refusés :
     * ils ignorent les changements d'heure.
     */
    public static function validateSlotsRequest(array $data): ?string
    {
        $date = $data['date'] ?? null;
        $parsedDate = is_string($date) ? DateTimeImmutable::createFromFormat('!Y-m-d', $date) : false;
        if (!$parsedDate || $parsedDate->format('Y-m-d') !== $date) {
            return 'Date invalide (format attendu : AAAA-MM-JJ).';
        }

        $timeZone = $data['userTimeZone'] ?? null;
        if (!is_string($timeZone) || !self::isNamedTimeZone($timeZone)) {
            return 'Fuseau horaire invalide.';
        }

        $duration = $data['selectedDuration'] ?? null;
        if (!is_numeric($duration) || !in_array((int) $duration, self::ALLOWED_DURATIONS, true) || (float) $duration != (int) $duration) {
            return 'La durée doit être de 30, 45 ou 60 minutes.';
        }

        return null;
    }

    /**
     * Vrai pour un fuseau nommé (type 3 : « Europe/Paris », « Asia/Calcutta »…) connu de PHP.
     * Faux pour un décalage fixe (« +02:00 », type 1) ou une abréviation (« CEST », type 2).
     */
    private static function isNamedTimeZone(string $timeZone): bool
    {
        try {
            $zone = new DateTimeZone($timeZone);
        } catch (Exception $e) {
            return false;
        }
        return (((array) $zone)['timezone_type'] ?? null) === 3;
    }

    /**
     * Début et fin (exclue) de la journée de l'élève, dans son fuseau.
     * Si minuit n'existe pas ce jour-là chez lui (changement d'heure à minuit), PHP prend la première heure qui existe.
     *
     * @return array{0: DateTimeImmutable, 1: DateTimeImmutable}
     */
    public static function userDayBounds(string $userDate, DateTimeZone $userTimeZone): array
    {
        $dayStart = new DateTimeImmutable($userDate . ' 00:00:00', $userTimeZone);
        $nextDate = (new DateTimeImmutable($userDate, new DateTimeZone('UTC')))->modify('+1 day')->format('Y-m-d');
        $dayEnd = new DateTimeImmutable($nextDate . ' 00:00:00', $userTimeZone);

        return [$dayStart, $dayEnd];
    }

    /**
     * Créneaux réservables pour un élève, un jour donné CHEZ LUI (00:00 → 24:00 dans son fuseau). Fonction pure (FLE-113).
     *
     * - Les plages de la professeure sont des heures murales dans son fuseau, par jour ISO (1 = lundi … 7 = dimanche).
     *   L'heure de fin d'une plage est la fin du dernier cours : un cours doit tenir entièrement dans une plage.
     * - La journée de l'élève peut couvrir deux jours de la professeure : on calcule les créneaux de chaque jour
     *   concerné, puis on ne garde que ceux qui commencent dans la journée de l'élève.
     * - Grille de 15 min depuis le début de la plage ; un cours ne commence pas moins de 8 h après $now.
     * - Un créneau est pris s'il chevauche une période occupée ($busyPeriods : [début, fin], fin exclue).
     * - Créneaux écartés : heure qui n'existe pas chez la professeure, et heure qui existe deux fois chez l'élève
     *   (nuit où il recule d'une heure) : l'API ne renvoie que H:i, createEvent ne saurait pas laquelle réserver.
     * Aucun décalage n'est supposé : chaque conversion passe par DateTimeZone, à la date du créneau.
     *
     * @param array<int, list<array{0: string, 1: string}>> $teacherRanges jour ISO => [['09:00', '12:00'], …]
     * @param list<array{0: DateTimeInterface, 1: DateTimeInterface}> $busyPeriods
     * @return list<DateTimeImmutable> débuts des créneaux, dans le fuseau de l'élève, triés
     */
    public static function computeAvailableSlots(
        string $userDate,
        DateTimeZone $userTimeZone,
        int $duration,
        array $teacherRanges,
        DateTimeZone $teacherTimeZone,
        array $busyPeriods,
        ?DateTimeImmutable $now = null
    ): array {
        $step = self::SLOT_STEP_MINUTES * 60;
        $durationSeconds = $duration * 60;
        $now = $now ?? new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $earliest = $now->getTimestamp() + self::MIN_DELAY_BEFORE_APPOINTMENT_SECONDS;

        [$dayStart, $dayEnd] = self::userDayBounds($userDate, $userTimeZone);
        $dayStartTs = $dayStart->getTimestamp();
        $dayEndTs = $dayEnd->getTimestamp();

        $busy = array_map(fn($period) => [$period[0]->getTimestamp(), $period[1]->getTimestamp()], $busyPeriods);

        // Jours de la professeure qui chevauchent la journée de l'élève (deux au plus).
        $teacherDate = $dayStart->setTimezone($teacherTimeZone)->setTime(0, 0);
        $lastTeacherDate = $dayEnd->modify('-1 second')->setTimezone($teacherTimeZone)->format('Y-m-d');

        $slots = [];
        while ($teacherDate->format('Y-m-d') <= $lastTeacherDate) {
            $date = $teacherDate->format('Y-m-d');
            foreach ($teacherRanges[(int) $teacherDate->format('N')] ?? [] as [$rangeStart, $rangeEnd]) {
                $rangeStartAt = self::teacherWallTime($date, $rangeStart, $teacherTimeZone);
                $rangeEndAt = self::teacherWallTime($date, $rangeEnd, $teacherTimeZone);
                if ($rangeStartAt === null || $rangeEndAt === null) {
                    continue;
                }
                $rangeEndTs = $rangeEndAt->getTimestamp();

                [$hour, $minute] = array_map('intval', explode(':', $rangeStart));
                for ($minutes = $hour * 60 + $minute; ; $minutes += self::SLOT_STEP_MINUTES) {
                    if ($minutes >= 24 * 60) {
                        break;
                    }
                    $start = self::teacherWallTime($date, sprintf('%02d:%02d', intdiv($minutes, 60), $minutes % 60), $teacherTimeZone);
                    if ($start === null) {
                        continue; // heure sautée chez la professeure
                    }
                    $startTs = $start->getTimestamp();
                    $endTs = $startTs + $durationSeconds;
                    if ($endTs > $rangeEndTs) {
                        break;
                    }
                    if ($startTs < $dayStartTs || $startTs >= $dayEndTs || $startTs < $earliest) {
                        continue;
                    }
                    foreach ($busy as [$busyStart, $busyEnd]) {
                        if ($startTs < $busyEnd && $endTs > $busyStart) {
                            continue 2;
                        }
                    }
                    $userStart = $start->setTimezone($userTimeZone);
                    if (self::isAmbiguousWallTime($userStart, $userTimeZone)) {
                        continue;
                    }
                    $slots[$startTs] = $userStart;
                }
            }
            $teacherDate = $teacherDate->modify('+1 day');
        }

        ksort($slots);
        return array_values($slots);
    }

    /** Heure murale chez la professeure, ou null si elle n'existe pas ce jour-là (passage à l'heure d'été). */
    private static function teacherWallTime(string $date, string $time, DateTimeZone $timeZone): ?DateTimeImmutable
    {
        if ($time === '24:00') {
            $next = (new DateTimeImmutable($date, new DateTimeZone('UTC')))->modify('+1 day')->format('Y-m-d');
            return new DateTimeImmutable($next . ' 00:00:00', $timeZone);
        }
        $wallTime = DateTimeImmutable::createFromFormat('!Y-m-d H:i', $date . ' ' . $time, $timeZone);
        if (!$wallTime || $wallTime->format('Y-m-d H:i') !== $date . ' ' . $time) {
            return null;
        }
        return $wallTime;
    }

    /**
     * Vrai si l'heure murale de $time existe deux fois dans $timeZone ce jour-là (nuit du retour à l'heure d'hiver).
     * On cherche, autour de $time, un autre décalage qui donnerait la même heure murale à un autre instant.
     */
    private static function isAmbiguousWallTime(DateTimeImmutable $time, DateTimeZone $timeZone): bool
    {
        $timestamp = $time->getTimestamp();
        $offset = $timeZone->getOffset($time);
        foreach ([-3 * 3600, 3 * 3600] as $shift) {
            $otherOffset = $timeZone->getOffset((new DateTimeImmutable('@' . ($timestamp + $shift))));
            if ($otherOffset === $offset) {
                continue;
            }
            $otherTimestamp = $timestamp + $offset - $otherOffset;
            if ($timeZone->getOffset(new DateTimeImmutable('@' . $otherTimestamp)) === $otherOffset) {
                return true;
            }
        }
        return false;
    }

    public function checkWaitingEvents()
    {
        $waitingEvents = $this->modelEvent->checkWaitingEvent();
        if (!empty($waitingEvents)) {
            $this->checkActionForUnpaidAppointments($waitingEvents);

            $response = [
                'code' => 1,
                'message' => 'Vérification des événements en attente effectuée avec succès',
            ];
            echo json_encode($response);
        } else {
            $response = [
                'code' => 0,
                'message' => 'Aucun événement en attente à vérifier',
            ];
            echo json_encode($response);
        }
    }

    public function createNewEventFromGoogle($event, $idEvent, $duration, $startDateTimeUtcFormatted, $startDateTime)
    {
        $description = $event->getSummary();
        $userId = null;

        $emailsToCheck = [];
        $attendees = $event->getAttendees();

        if (!empty($attendees)) {
            foreach ($attendees as $attendee) {
                if ($attendee->getEmail()) {
                    $emailsToCheck[] = $attendee->getEmail();
                }
            }
        }

        $creator = $event->getCreator();
        if ($creator && $creator->getEmail()) $emailsToCheck[] = $creator->getEmail();
        $organizer = $event->getOrganizer();
        if ($organizer && $organizer->getEmail()) $emailsToCheck[] = $organizer->getEmail();

        foreach ($emailsToCheck as $email) {
            $foundUserId = $this->modelUser->checkMail($email);
            if ($foundUserId) {
                $userId = $foundUserId;
                break;
            }
        }

        if ($userId === null) {
            $adminUserId = $this->modelUser->checkMail(TEACHER_MAIL);
            if ($adminUserId) {
                $userId = $adminUserId;
            } else {
                return;
            }
        }

        $status = 'Google';
        $visioLink = $this->controllerVisio->createRoom($duration, $startDateTimeUtcFormatted, $idEvent);
        $userTimeZone = 'Europe/Paris';

        $this->registerEventInDatabase($idEvent, $userId, $description, $duration, $startDateTimeUtcFormatted, $userTimeZone, $visioLink, $status);
    }

    private function registerEventInDatabase($idEvent, $userId, $description, $duration, $startDateTimeUtcFormatted, $userTimeZone, $visioLink, $status)
    {
        $createdAt = date('Y-m-d H:i:s');
        $updatedAt = date('Y-m-d H:i:s');

        $eventDatabase = new EntitieEvent([
            'idEvent' => $idEvent,
            'userId' => $userId,
            'description' => $description,
            'duration' => $duration,
            'createdAt' => $createdAt,
            'startDateTime' => $startDateTimeUtcFormatted,
            'timezone' => $userTimeZone,
            'updatedAt' => $updatedAt,
            'status' => $status,
            'visioLink' => $visioLink,
        ]);

        $createdEvent = $this->modelEvent->createEvent($eventDatabase);

        return $createdEvent;
    }

    /**
     * Rendez-vous « En attente » (non payés), appelé par le cron toutes les 10 min :
     * - entre 15 et 25 min après la réservation : un mail de rappel (fenêtre de 10 min = un seul passage du cron) ;
     * - cours dans moins de 24 h et non payé depuis 30 min, ou cours dans plus de 24 h et non payé depuis 2 h :
     *   annulation (statut, room visio, événement Google pour libérer le créneau) + mail ;
     * - cours déjà passé : statut annulé en silence, sans mail ni suppression (vieux rendez-vous restés en attente).
     * Chaque rendez-vous est traité à part : une erreur sur l'un n'empêche pas les suivants.
     */
    public function checkActionForUnpaidAppointments(array $unpaidAppointments)
    {
        $currentTime = new DateTime('now', new DateTimeZone('UTC'));
        $now = $currentTime->getTimestamp();

        foreach ($unpaidAppointments as $appointment) {
            $appointmentId = $appointment['idEvent'];
            try {
                $createdAt = new DateTime($appointment['createdAt'], new DateTimeZone('UTC'));
                $appointmentStart = (new DateTime($appointment['startDateTime'], new DateTimeZone('UTC')))->getTimestamp();
                $sinceCreation = $now - $createdAt->getTimestamp();

                if ($appointmentStart <= $now) {
                    $this->modelEvent->updateEventStatus($appointmentId, AppointmentStatus::CANCELLED_UNPAID->value);
                    $this->controllerError->logs("Rendez-vous passé non payé, annulé sans mail", [$appointmentId], self::EVENT_LOG_FILE);
                    continue;
                }

                if ($sinceCreation > 15 * 60 && $sinceCreation < 25 * 60) {
                    $this->controllerMail->sendMailToAlertEventNotPaid($appointment);
                }

                $startsWithin24h = $appointmentStart <= $now + 24 * 60 * 60;
                $mustCancel = ($startsWithin24h && $sinceCreation > 30 * 60)
                    || (!$startsWithin24h && $sinceCreation > 120 * 60);

                if ($mustCancel) {
                    // Statut d'abord : c'est lui qui fait foi si une étape suivante échoue.
                    $this->modelEvent->updateEventStatus($appointmentId, AppointmentStatus::CANCELLED_UNPAID->value);
                    $this->controllerVisio->deleteRoom($appointmentId);
                    $this->deleteGoogleEvent($appointmentId);
                    $this->controllerMail->sendMailToAlertEventDeleteBecauseNotPaid($appointment);
                    $this->controllerError->logs("Rendez-vous non payé annulé", [$appointmentId], self::EVENT_LOG_FILE);
                }
            } catch (Throwable $e) {
                error_log("checkActionForUnpaidAppointments : erreur sur l'événement " . $appointmentId . " : " . $e->getMessage());
            }
        }
    }

    /**
     * Supprime l'événement de l'agenda Google (libère le créneau).
     * Un événement déjà supprimé côté Google (404 / 410) compte comme un succès.
     */
    private function deleteGoogleEvent(string $idEvent): bool
    {
        try {
            $service = new Google\Service\Calendar($this->getClient());
            $service->events->delete(GOOGLE_CALENDAR_ID, $idEvent);
            return true;
        } catch (Google\Service\Exception $e) {
            if (in_array($e->getCode(), [404, 410], true)) {
                return true;
            }
            error_log("Suppression Google impossible pour l'événement " . $idEvent . " : " . $e->getMessage());
            return false;
        } catch (Throwable $e) {
            // Réseau, clé du compte de service… : on journalise sans bloquer la suite (mail à l'élève).
            error_log("Suppression Google impossible pour l'événement " . $idEvent . " : " . $e->getMessage());
            return false;
        }
    }
}
