<?php

class ControllerInvoice
{
    private $invoiceModel;
    private $controllerUser;
    private $controllerError;

    public function __construct($invoiceModel)
    {
        $this->invoiceModel = $invoiceModel;
        $this->controllerUser = new ControllerUser();
        $this->controllerError = new ControllerError();
    }


    public function getInvoices()
    {
        if (!$this->controllerUser->verifyConnectAdmin()) {
            $this->controllerError->unauthorizedResponse();
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$this->controllerError->validateData($input, 'Pas de filtres envoyés')) {
            return;
        }

        $filters = $this->setFilters($input);
        if (!$this->controllerError->validateData($filters, 'Pas de filtres valides envoyés')) {
            return;
        }

        $filtersToSql = $this->filterToSql($filters);
        if (!$this->controllerError->validateData($filtersToSql, 'Erreur lors de la conversion des filtres')) {
            return;
        }

        $lessonToInvoiced = $this->invoiceModel->getEventsWithFilters($filtersToSql);
        if (!$this->controllerError->validateData($lessonToInvoiced, 'Aucun cours trouvé pour les filtres donnés')) {
            return;
        }

        $this->controllerError->successResponse($lessonToInvoiced, 'Cours récupérés avec succès');
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

        return ['where' => implode(' AND ', $sqlParts), 'params' => $params];
    }
}
