export function httpError(statusCode) {
    switch(statusCode) {
        case 401:
            alert("Votre session a expiré. Veuillez vous reconnecter.")
            break
        case 500:
            alert("Une erreur s'est produite au niveau du serveur. Veuillez réessayer plus tard ou contacter le support informatique.")
            break
        case 404:
            alert("La ressource demandée n'existe pas.")
            break
        case 503:
            alert("Le serveur n'est pas disponible. Veuillez réessayer plus tard.")
            break
    }
    
}