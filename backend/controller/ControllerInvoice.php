<?php

class ControllerInvoice
{
    private $invoiceModel;
    private $controllerUser;
    private $controllerError;
    private $modelUser;

    public function __construct()
    {
        $this->invoiceModel = new ModelInvoice();
        $this->controllerUser = new ControllerUser();
        $this->controllerError = new ControllerError();
        $this->modelUser = new ModelUser();
    }


    public function getInvoices()
    {
        if (!$this->controllerUser->verifyConnectAdmin()) {
            $this->controllerError->unauthorizedResponse();
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        error_log("🔍 Backend received input: " . json_encode($input)); // ← DEBUG

        $filters = $this->setFilters($input);

        $filtersToSql = $this->filterToSql($filters);

        $lessonToInvoiced = $this->invoiceModel->getInvoices($filtersToSql);
        if (!$this->controllerError->validateData($lessonToInvoiced, 'Aucun cours trouvé pour les filtres donnés')) {
            return;
        }

        $finalList = [];

        foreach ($lessonToInvoiced as $lesson) {

            $user = $this->modelUser->getUser(new EntitieUser(['idUser' => $lesson['userId']]));
            $userName = $user['firstName'] . ' ' . $user['lastName'];
            $lesson['studentName'] = $userName;
            $finalList[] = $lesson;
        }
        $this->controllerError->successResponse($finalList, 'Cours récupérés avec succès');
    }

    private function setFilters($input)
    {
        $filters = [];
        error_log("🔍 setFilters received: " . json_encode($input)); // ← DEBUG

        if (isset($input['beginPeriod']) && !empty($input['beginPeriod'])) {
            if ($input['beginPeriod'] > date('Y-m-d')) {
                $input['beginPeriod'] = date('Y-m-d');
            }
            $filters['beginPeriod'] = $input['beginPeriod'];
        }

        if (isset($input['endPeriod']) && !empty($input['endPeriod'])) {
            if ($input['endPeriod'] > date('Y-m-d')) {
                $input['endPeriod'] = date('Y-m-d');
            }

            // ✅ Si endPeriod < beginPeriod, ajuster endPeriod au lieu de faire une erreur
            if (isset($input['beginPeriod']) && $input['endPeriod'] < $input['beginPeriod']) {
                $input['endPeriod'] = $input['beginPeriod'];
            }

            $filters['endPeriod'] = $input['endPeriod'];
        }

        if (isset($input['userId']) && $input['userId'] !== '') {
            $filters['userId'] = (int)$input['userId'];
        }

        if (isset($input['status']) && !empty($input['status'])) {
            $filters['status'] = $input['status'];
        }

        if (isset($input['isInvoiced']) && $input['isInvoiced'] !== '') {
            error_log("🔍 Processing isInvoiced: " . $input['isInvoiced']); // ← DEBUG
            $filters['is_invoiced'] = (int)$input['isInvoiced'];
            error_log("🔍 Filters after isInvoiced: " . json_encode($filters)); // ← DEBUG
        }


        return $filters;
    }

    private function filterToSql($filters)
    {
        $sqlParts = [];
        $params = [];
        error_log("🔍 filterToSql received: " . json_encode($filters)); // ← DEBUG

        if (isset($filters['beginPeriod'])) {
            $sqlParts[] = 'startDateTime >= :beginPeriod';
            $params[':beginPeriod'] = $filters['beginPeriod'];
        }

        if (isset($filters['endPeriod'])) {
            $sqlParts[] = 'startDateTime <= :endPeriod';
            $params[':endPeriod'] = $filters['endPeriod'];
        }

        if (isset($filters['userId'])) {
            $sqlParts[] = 'userId = :userId';
            $params[':userId'] = $filters['userId'];
        }

        if (isset($filters['status'])) {
            $sqlParts[] = 'status = :status';
            $params[':status'] = $filters['status'];
        }

        if (isset($filters['is_invoiced'])) { // ← Nouveau filtre
            $sqlParts[] = "is_invoiced = :is_invoiced";
            $params[':is_invoiced'] = $filters['is_invoiced'];
        }

        if (empty($sqlParts)) {
            return ['where' => '1=1', 'params' => []]; // Aucun filtre fourni, retourner tous les résultats
        }

        return ['where' => implode(' AND ', $sqlParts), 'params' => $params];
    }

    /**
     * Concentrateur pour marquer un cours comme facturés
     */
    public function setInvoiced()
    {
        // verifyConnectAdmin() fait déjà exit() si l'utilisateur n'est pas admin
        $this->controllerUser->verifyConnectAdmin();

        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['idEvent']) || empty($input['idEvent'])) {
            $this->controllerError->unauthorizedResponse('ID de l\'événement manquant');
            return;
        }

        $idEvent = $input['idEvent'];

        $this->invoiceModel->setInvoiced($idEvent);
        $this->controllerError->successResponse(null, 'Cours marqué comme facturé');
    }
}
