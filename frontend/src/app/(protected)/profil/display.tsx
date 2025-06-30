"use client";

import { useContext, useState } from "react";
import { Context } from "./profileContext";
import Button from "../../components/front/Button";
import axios from "axios";

export default function DisplayUserprofil() {
    const { dataUser } = useContext(Context);
    const [activeTab, setActiveTab] = useState('informations');
    const [showEditModal, setShowEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editedUser, setEditedUser] = useState({
        firstName: dataUser?.firstName || '',
        lastName: dataUser?.lastName || '',
        mail: dataUser?.mail || '',
        address: dataUser?.address || '',
        country: dataUser?.country || '',
        password: ''
    });
    const [settings, setSettings] = useState({
        emailNotifications: true,
        courseReminders: true
    });

    const handleSaveChanges = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Préparer les données à envoyer
            const updateData: {
                firstName: string;
                lastName: string;
                mail: string;
                address: string;
                country: string;
                password?: string;
            } = {
                firstName: editedUser.firstName,
                lastName: editedUser.lastName,
                mail: editedUser.mail,
                address: editedUser.address,
                country: editedUser.country
            };

            // Ajouter le mot de passe seulement s'il a été saisi
            if (editedUser.password.trim() !== '') {
                updateData.password = editedUser.password;
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/updateUserProfile`,
                updateData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.data.code === 1) {
                alert('Profil mis à jour avec succès !');
                setShowEditModal(false);
                setEditedUser(prev => ({ ...prev, password: '' })); // Réinitialiser le mot de passe
                // Recharger la page pour afficher les nouvelles données
                window.location.reload();
            } else {
                setError(response.data.message || 'Erreur lors de la mise à jour');
            }
        } catch (error: unknown) {
            console.error('Erreur lors de la mise à jour:', error);
            const errorMessage = error instanceof Error && 'response' in error && 
                                typeof error.response === 'object' && error.response !== null &&
                                'data' in error.response && 
                                typeof error.response.data === 'object' && error.response.data !== null &&
                                'message' in error.response.data && 
                                typeof error.response.data.message === 'string'
                                ? error.response.data.message 
                                : 'Erreur lors de la mise à jour du profil';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setEditedUser(prev => ({
            ...prev,
            [field]: value
        }));
        // Effacer l'erreur quand l'utilisateur tape
        if (error) setError('');
    };

    const toggleSetting = (setting: string) => {
        setSettings(prev => ({
            ...prev,
            [setting]: !prev[setting as keyof typeof prev]
        }));
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setError('');
        setEditedUser({
            firstName: dataUser?.firstName || '',
            lastName: dataUser?.lastName || '',
            mail: dataUser?.mail || '',
            address: dataUser?.address || '',
            country: dataUser?.country || '',
            password: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Profile */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#1D1E1C] to-gray-800 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                                {dataUser?.firstName?.[0]?.toUpperCase() || 'U'}
                                {dataUser?.lastName?.[0]?.toUpperCase() || ''}
                            </div>
                        </div>
                        
                        {/* Informations principales */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                                {dataUser?.firstName} {dataUser?.lastName}
                            </h1>
                            <p className="text-gray-500 text-sm mb-4">{dataUser?.mail}</p>
                            
                            {/* Wallet Info */}
                            <div className="inline-flex items-center bg-gray-100 text-[#1D1E1C] px-4 py-2 rounded-full text-sm font-medium">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                {dataUser?.wallet != null ? dataUser.wallet : 0} €
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                            <Button 
                                onClick={() => setShowEditModal(true)}
                                variant="black"
                                className="text-sm px-4 py-2 !bg-[#1D1E1C] hover:!bg-gray-800"
                            >
                                Modifier
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <nav className="flex space-x-0 overflow-x-auto">
                        {[
                            { id: 'informations', label: 'Informations', icon: '👤' },
                            { id: 'cours', label: 'Mes Cours', icon: '📚' },
                            { id: 'planning', label: 'Planning', icon: '📅' },
                            { id: 'paiements', label: 'Paiements', icon: '💳' },
                            { id: 'parametres', label: 'Paramètres', icon: '⚙️' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                                    activeTab === tab.id
                                        ? 'border-[#1D1E1C] text-[#1D1E1C] bg-gray-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {activeTab === 'informations' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations personnelles</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {dataUser?.firstName || 'Non renseigné'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {dataUser?.lastName || 'Non renseigné'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {dataUser?.mail || 'Non renseigné'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {dataUser?.address || 'Non renseigné'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {dataUser?.country || 'Non renseigné'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'cours' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mes cours</h2>
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">📚</div>
                                <p className="text-gray-500 text-lg mb-4">Aucun cours pour le moment</p>
                                <Button 
                                    href="/offre-de-cours"
                                    variant="black"
                                    className="text-sm px-6 py-3 !bg-[#1D1E1C] hover:!bg-gray-800"
                                >
                                    Découvrir nos cours
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'planning' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mon planning</h2>
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">📅</div>
                                <p className="text-gray-500 text-lg mb-4">Aucun rendez-vous planifié</p>
                                <Button 
                                    href="/calendrier"
                                    variant="black"
                                    className="text-sm px-6 py-3 !bg-[#1D1E1C] hover:!bg-gray-800"
                                >
                                    Prendre rendez-vous
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'paiements' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Historique des paiements</h2>
                            
                            {/* Wallet Balance */}
                            <div className="bg-gradient-to-r from-[#1D1E1C] to-gray-800 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium mb-1">Solde disponible</h3>
                                        <p className="text-3xl font-bold">{dataUser?.wallet != null ? dataUser.wallet : 0} €</p>
                                    </div>
                                    <div className="text-4xl opacity-75">💰</div>
                                </div>
                            </div>

                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">💳</div>
                                <p className="text-gray-500 text-lg">Aucune transaction pour le moment</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'parametres' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Paramètres du compte</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-900">Notifications par email</h3>
                                        <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                                    </div>
                                    <button 
                                        onClick={() => toggleSetting('emailNotifications')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            settings.emailNotifications ? 'bg-[#1D1E1C]' : 'bg-gray-300'
                                        }`}
                                        aria-label="Activer les notifications par email"
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                        }`}></span>
                                    </button>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-900">Rappels de cours</h3>
                                        <p className="text-sm text-gray-500">Recevoir des rappels avant les cours</p>
                                    </div>
                                    <button 
                                        onClick={() => toggleSetting('courseReminders')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            settings.courseReminders ? 'bg-[#1D1E1C]' : 'bg-gray-300'
                                        }`}
                                        aria-label="Activer les rappels de cours"
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            settings.courseReminders ? 'translate-x-6' : 'translate-x-1'
                                        }`}></span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <Button 
                                    onClick={() => {
                                        console.log('Paramètres sauvegardés:', settings);
                                        alert('Paramètres sauvegardés avec succès !');
                                    }}
                                    variant="black"
                                    className="w-full mb-3 text-sm py-3 !bg-[#1D1E1C] hover:!bg-gray-800"
                                >
                                    Sauvegarder les modifications
                                </Button>
                                <Button 
                                    onClick={() => {
                                        if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                                            console.log('Suppression du compte demandée');
                                            alert('Fonctionnalité de suppression à implémenter');
                                        }
                                    }}
                                    variant="white"
                                    className="w-full text-sm py-3 !border-[#1D1E1C] !text-[#1D1E1C] hover:!bg-gray-50"
                                >
                                    Supprimer le compte
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de modification */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Modifier mes informations</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Fermer la popup"
                                    disabled={isLoading}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                                        <input
                                            type="text"
                                            value={editedUser.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            placeholder="Entrez votre prénom"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                                        <input
                                            type="text"
                                            value={editedUser.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            placeholder="Entrez votre nom"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={editedUser.mail}
                                        onChange={(e) => handleInputChange('mail', e.target.value)}
                                        placeholder="Entrez votre email"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                                    <input
                                        type="text"
                                        value={editedUser.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="Entrez votre adresse"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                                    <input
                                        type="text"
                                        value={editedUser.country}
                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                        placeholder="Entrez votre pays"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nouveau mot de passe 
                                        <span className="text-gray-500">(laisser vide pour ne pas modifier)</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={editedUser.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="Entrez un nouveau mot de passe"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D1E1C] focus:border-[#1D1E1C] transition-colors"
                                        disabled={isLoading}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Le mot de passe doit contenir au moins 8 caractères
                                    </p>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <Button
                                    onClick={handleCloseModal}
                                    variant="white"
                                    className="flex-1 text-sm py-3"
                                    disabled={isLoading}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={handleSaveChanges}
                                    variant="black"
                                    className="flex-1 text-sm py-3 !bg-[#1D1E1C] hover:!bg-gray-800"
                                    disabled={isLoading || !editedUser.firstName || !editedUser.lastName || !editedUser.mail}
                                >
                                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
