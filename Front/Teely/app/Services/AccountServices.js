//app/Services/AccountServices.js
import { backendURL } from '../modules/BackendConfig.js'
import { httpError } from '../modules/Error.js'
import { storeToken, getToken, removeToken } from '../modules/TokenStorage.js'
import generalServices from '../Services/GeneralServices'

const endpoint = "/account"

class AccountServices {

    async signup(username, password, email, lastName, name, birthDate, idImage, callback) {
        const requestBody = JSON.stringify({
            username: username,
            password: password,
            email: email,
            birthdate: birthDate,
            lastName: lastName,
            name: name,
            idImage: idImage
        })
        const fullEndpoint = endpoint + "/inscription"
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: requestBody
                })
                .catch(err => {
                    console.error("Promise error : " + err)
                })
            if (response.status != 201) {
                if (response.status == 409) {
                    alert("Ce nom d'utilisateur (ou cette adresse e-mail) est déjà utilisé, merci d'en choisir un autre !")
                }
                else if (response.status == 400) {
                    alert("Paramètre manquant dans la requête. Veuillez consulter les logs pour plus de détails.")
                }
                else {
                    httpError(response.status)
                }
                callback(false);
                console.log(await response.json())
            }
            else {
                alert("Inscription réussie :)")
                callback(true);
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async login(username, password, callback) {
        const requestBody = JSON.stringify({
            username: username,
            password: password,
        })
        const fullEndpoint = endpoint + "/login"
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: requestBody
                })
                .catch(err => {
                    console.error("Promise error : " + err)
                })
            const jsonBody = await response.json()
            if (response.status != 200) {
                if (response.status == 400) {
                    alert("Paramètre manquant dans la requête. Veuillez consulter les logs pour plus de détails.")
                }
                else if (response.status == 404) {
                    alert("Ce nom d'utilisateur n'existe pas.")
                }
                else if (response.status == 401) {
                    alert("Mot de passe incorrect.")
                }
                else {
                    httpError(response.status)
                }
                callback(false);
                console.log(await jsonBody)
            }
            else {
                storeToken(username)
                callback(true);
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async logout() {
        removeToken();
    }

    async saveProfile(userName, password, email, lastName, name, birthDate, biography, callback) {

        alert(lastName + "\n" + name + "\n" + userName + "\n" + password + "\n"
                + email + "\n" + birthDate + "\n" + biography)

        const username = await getToken()

        const requestBody = JSON.stringify({
            username: userName,
            password: password,
            email: email,
            birthdate: birthDate,
            lastName: lastName,
            name: name,
            bio: biography,
        })
        const fullEndpoint = endpoint + "/update"
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: username
                    },
                    body: requestBody
                })
            if (response.status != 204) {
                if (response.status == 400) {
                    alert("Paramètre manquant dans la requête. Veuillez consulter les logs pour plus de détails.")
                }
                callback(false);
            }
            else {
                alert("Modification enregistrée :)")
                callback(true);
            }

        } catch (error) {
            console.error(error)
        }
    }


    async dataProfile(callback, username) {
        if (username=="") {
            username =  (await getToken()).toString()
        }
        const token = await getToken()
        const fullEndpoint = endpoint + "/info?username="+username
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                })
            const respBody = await response.json()
            if (response.status != 200) {
                alert("Erreur lors de la récupération du profil")
            }
            else {
                callback(respBody)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async accountUpcomingTasks(callback) {
        const username = await getToken()
        const fullEndpoint = endpoint + "/task/upcomming"
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: username
                    }
                })
            const respBody = await response.json()
            if (response.status != 200) {
                alert("Erreur lors de la récupération des tâches")
            }
            else {
                callback(respBody.tasks)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async accountAllTasks(callback) {
        const username = await getToken()
        const fullEndpoint = endpoint + "/task/all"
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: username
                    }
                })
            const respBody = await response.json()
            if (response.status != 200) {
                alert("Erreur lors de la récupération des tâches")
            }
            else {
                callback(respBody.tasks)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async accountInvitations(callback) {

        const invit1 = { invitationId: 1, sender: 'User57', group: 'La mifa !', idImageGroup: '4' }
        const invit2 = { invitationId: 2, sender: 'Fati', group: 'Les collègues', idImageGroup: '3' }
        const invit3 = { invitationId: 3, sender: 'Lili la licorne', group: 'Vacances dans les iles', idImageGroup: '5' }
        const invit4 = { invitationId: 4, sender: 'Anonyme201', group: 'H4212', idImageGroup: '6' }

        let accountInvitations = [invit1, invit2, invit3, invit4]

        const username = await getToken()
        const fullEndpoint = endpoint + "/invitation"

        try {
            const response = await fetch(backendURL + fullEndpoint, 
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: username
                }
            })
            const respBody = await response.json()
            if (response.status != 200) {
                httpError(response.status)
                console.error(response.error)
            }
            else {
                // alert("Récupération des invitations réussie :)")
                //callback(respBody)
                callback(accountInvitations)
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    async accountInvitationChoice(idInvit, choice, callback) {
        /*const requestBody = JSON.stringify({
            idInvit: idInvit,
            choice: choice,
            
        })
        const fullEndpoint = endpoint + "/invitation/choice"
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: requestBody
                })
                .catch(err => {
                    console.log("Promise error : " + err)
                })
            if (response.status != 201) {
                alert("Une erreur s'est produite")
                httpError(response.status)
                callback(false);
                console.log(await response.json())
            }
            else {
                callback(true);
            }
        }
        catch (error) {
            console.error(error)
        }*/
        callback(true)
    }

    async getAccountUsernames(usernameParam, callback) {
        const username = await getToken()
        const fullEndpoint = endpoint + "?username=" + usernameParam
        try {
            const response = await fetch(backendURL + fullEndpoint, 
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: username
                }
            })
            const respBody = await response.json()
            if (response.status != 200) {
                httpError(response.status)
                console.error(response.error)
            }
            else {
                callback(respBody.users)
            }
        }
        catch (error) {
            console.error(error)
        }
    }
}

const accountServices = new AccountServices()
export default accountServices