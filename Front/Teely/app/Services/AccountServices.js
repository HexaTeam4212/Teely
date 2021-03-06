//app/Services/AccountServices.js
import { backendURL } from '../modules/BackendConfig.js'
import { httpError } from '../modules/Error.js'
import {storeToken, getToken, removeToken, getKeyValue, storeKeyValue, removeKeyValue} from '../modules/TokenStorage.js'
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
                    alert("Une erreur s'est produite au niveau du réseau. Veuillez réessayer plus tard ou contacter le support informatique.")
                }
                else {
                    httpError(response.status)
                }
                const respBody = await response.json()
                console.warn(respBody.error)
                callback(false);
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
            const respBody = await response.json()
            if (response.status != 200) {
                if (response.status == 400) {
                    alert("Une erreur s'est produite au niveau du réseau. Veuillez réessayer plus tard ou contacter le support informatique.")
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
                console.warn(respBody.error)
                callback(false);
            }
            else {
                storeToken(respBody.authToken)
                storeKeyValue('username', username)
                callback(true);
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async logout() {
        removeToken();
        removeKeyValue('username')
    }

    async saveProfile(username, current_password, new_password, email, lastName, name, birthDate, biography, callback) {
        const token = await getToken()

        const requestBody = JSON.stringify({
            username: username,
            current_password: current_password,
            password: new_password,
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
                        Authorization: token
                    },
                    body: requestBody
                })
                .catch(err => {
                    console.error("Promise error : " + err)
                })
            if (response.status != 204) {
                if (response.status == 400) {
                    alert("Paramètre manquant dans la requête")
                }else if(response.status == 409){
                    alert("Email ou nom d'utilisateur déjà pris")
                }else if(response.status == 403){
                    alert("Mauvais mot de passe")
                }
                else {
                    httpError(response.status)
                }
                const respBody = await response.json()
                console.warn(respBody.error)
                callback(false)
            }
            else {
                const storedUsername = await getKeyValue('username')
                if (storedUsername !== username) {
                    storeKeyValue('username', username)
                }
                callback(true);
            }

        } catch (error) {
            console.error(error)
        }
    }

    async dataProfile(callback, username) {
        var fullEndpoint
        if (username == "") {
            fullEndpoint = endpoint + "/info"
        }else {
            fullEndpoint = endpoint + "/info?username=" + username
        }
        const token = await getToken()
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
                .catch(err => {
                    console.error("Promise error : " + err)
                })
            const respBody = await response.json()
            if (response.status != 200) {
                httpError(response.status)
                const respBody = await response.json()
                console.warn(respBody.error)
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

        const token = await getToken()
        const fullEndpoint = endpoint + "/task/upcoming"
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
                .catch(err => {
                    console.error("Promise error : " + err)
                })
            const respBody = await response.json()
            if (response.status != 200) {
                httpError(response.status)
                const respBody = await response.json()
                console.warn(respBody.error)
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
        const token = await getToken()
        const fullEndpoint = endpoint + "/task/all"
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
                .catch(err => {
                    console.error("Promise error : " + err)
                })
            const respBody = await response.json()
            if (response.status != 200) {
                httpError(response.status)
                console.warn(respBody.error)
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

        const token = await getToken()
        const fullEndpoint = endpoint + "/invitation"

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
                .catch(err => {
                    console.error("Promise error : " + err)
                })
            const respBody = await response.json()
            if (response.status != 200) {
                httpError(response.status)
                console.warn(respBody.error)
            }
            else {
                callback(respBody.invitations)
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    async getAccountUsernames(usernameParam, withConnectedUser,callback) {
        const token = await getToken()
        const fullEndpoint = endpoint + "?username=" + usernameParam
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
                .catch(err => {
                    console.error("Promise error : " + err)
                })
            let respBody = await response.json()
            if (response.status != 200) {
                httpError(response.status)
                console.warn(respBody.error)
            }
            else {
                if (withConnectedUser === false) {
                    const storedUsername = await getKeyValue('username')
                    const index = respBody.users.indexOf(storedUsername);                    
                    if (index > -1) {
                        respBody.users.splice(index, 1);
                    }
                }
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