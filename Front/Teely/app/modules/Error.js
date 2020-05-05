export function httpError(statusCode) {
    switch(statusCode) {
        case 401:
            alert("Erreur d'authentification.")
            break
        case 500:
            alert("Une erreur s'est produite au niveau du serveur. Veuillez réessayer plus tard ou contacter le support informatique.")
            break
        case 404:
            alert("La fenêtre ou la ressource demandée n'existe pas.")
            break
        case 503:
            alert("Le serveur n'est pas disponible. Veuillez réessayer plus tard.")
            break
        default:
            alert("Erreur non répertoriée")
            break
    }
    
}