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

    protected function setFilters($input)
    {
        $filters = [];

        if (isset($input['begin_period']) && !empty($input['begin_period'])) {
            $filters['begin_period'] = $input['begin_period']; // ← CORRIGÉ : était $input['begin']
        }

        if (isset($input['end_period']) && !empty($input['end_period'])) {
            $filters['end_period'] = $input['end_period'];
        }

        if (isset($input['user_id']) && !empty($input['user_id'])) {
            $filters['user_id'] = (int)$input['user_id'];
        }

        if (isset($input['status']) && !empty($input['status'])) {
            $filters['status'] = $input['status'];
        }

        if (isset($input['invoiced']) && !empty($input['invoiced'])) {
            $filters['invoiced'] = (float)$input['invoiced'];
        }

        return $filters;
    }

    protected function filterToSql($filters)
    {
        $sqlParts = [];
        $params = [];

        if (isset($filters['begin_period'])) {
            $sqlParts[] = 'event_date >= :begin_period';
            $params[':begin_period'] = $filters['begin_period'];
        }

        if (isset($filters['end_period'])) {
            $sqlParts[] = 'event_date <= :end_period';
            $params[':end_period'] = $filters['end_period'];
        }

        if (isset($filters['user_id'])) {
            $sqlParts[] = 'user_id = :user_id';
            $params[':user_id'] = $filters['user_id'];
        }

        if (isset($filters['status'])) {
            $sqlParts[] = 'status = :status';
            $params[':status'] = $filters['status'];
        }

        if (isset($filters['invoiced'])) {
            $sqlParts[] = 'invoiced = :invoiced';
            $params[':invoiced'] = $filters['invoiced'];
        }
        if (empty($sqlParts)) {
            return ['where' => '1=1', 'params' => []]; // Aucun filtre fourni, retourner tous les résultats
        }

        return ['where' => implode(' AND ', $sqlParts), 'params' => $params];
    }

    /**
     * Microservice pour marquer un cours comme facturés
     */
    public function setInvoiced()
    {
        if (!$this->controllerUser->verifyConnectAdmin()) {
            $this->controllerError->unauthorizedResponse();
            return;
        }

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
