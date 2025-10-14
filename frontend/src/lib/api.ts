const getApiUrl = () => {
  // En production (côté serveur), utiliser l'URL interne
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || 'http://api';
  }
  // Côté client, utiliser l'URL publique
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

export { getApiUrl };