//app/Services/SignUpService.js
import { backendURL } from '../modules/BackendConfig.js'
import { httpError } from '../modules/Error.js'
import { storeToken, getToken } from '../modules/TokenStorage.js'

const endpoint = "/account/"

class AccountServices {

    async signup(username, password, email, lastName, name, birthDate, idImage, callback) {
        const requestBody = JSON.stringify({
            username: username,
            password: password,
            email: email,
            birthdate: birthDate,
            lastName: lastName,
            name: name,
            //idImage: idImage
        })
        const fullEndpoint = endpoint + "inscription"
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
        const fullEndpoint = endpoint + "login"
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
                else {
                    httpError(response.status)
                }
                callback(false);
                console.log(await jsonBody)
            }
            else {
                storeToken(jsonBody.authToken)
                callback(true);
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async saveProfil(username, password, confirmedPassword, email, lastName, name, birthDate, biography, callback) {

        alert(lastName + "\n" + name + "\n" + username + "\n" + password + "\n"
            + confirmedPassword + "\n" + email + "\n" + birthDate + "\n" + biography)
        callback(true);


        /*const requestBody = JSON.stringify({
                    username: username,
                    password: password,
                    email: email,
                    birthdate: birthDate,
                    lastName: lastName,
                    name: name,
                    biography: biography,
                })

        const fullEndpoint = endpoint + "update"
            try {
                const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: requestBody
                })
                if (response.status != 204) {
                    if (response.status == 409) {
                        alert("Ce nom d'utilisateur (ou cette adresse e-mail) est déjà utilisé, merci d'en choisir un autre !")
                        callback(false);
                    }    
                }
                else {
                    alert("Modification enregistrée :)")
                    callback(true);
                }
            
            }catch (error) {
                console.error(error)
            }
        }*/

    }

    dataProfil() {

        //alert("Récupération données profil")

        const username = "username"
        const password = "********"
        const email = "xyz@gmail.com"
        const lastName = "LastName"
        const name = "Name"
        const birthDate = "aaaa-mm-jj"
        const biography = "Hi everyone"
        const image = 2
        let datasProfil = [lastName, name, username, password, email, birthDate, biography, image]

        /*let datasProfil = []
        const fullEndpoint = endpoint + "info"
        try {
            const response = await fetch(backendURL + fullEndpoint, 
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: none
            })
            if (response.status != 200) {
                    alert("Erreur lors de la récupération du profil")
            }
            else {
                alert("Récupération profil réussie :)")
                datasProfil.push(response.lastName)
                datasProfil.push(response.name)
                datasProfil.push(response.username)
                datasProfil.push(response.password)
                datasProfil.push(response.email)
                datasProfil.push(response.birthDate)
                datasProfil.push(response.biography)
                datasProfil.push(response.image)
            }
        }
        catch (error) {
            console.error(error)
        }*/
        return datasProfil
    }

    accountTasks() {

        const task1 = { id: 320, name: 'Ménage', description: 'nettoyer salle de bain', dueDate: '2020-04-25', startingTime: '11:20' }
        const task2 = { id: 253, name: 'Promener Pooky', description: 'aller au parc avec Pooky', dueDate: '2020-04-26', startingTime: '15:00' }
        const task3 = { id: 501, name: 'Convention de stage', description: 'remplir avenant convention de stage', dueDate: '2020-04-25', startingTime: '16:10' }

        const task4 = { id: 321, name: 'Courses', description: 'Faire les courses pour la semaine', dueDate: '2020-04-27', startingTime: '13:00' }
    
        let accountTasks = [task1, task2, task3, task4]
        /*let accountTasks = []
        const fullEndpoint = endpoint + "task/all"

        try {
            const response = await fetch(backendURL + fullEndpoint, 
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: none
            })
            if (response.status != 200) {

                    alert("Erreur lors de la récupération des tâches")
            }
            else {
                alert("Récupération des tâches réussie :)")
                accountTasks.push(response.tasks)
            }
        }
        catch (error) {
            console.log(error)
        }*/
        return accountTasks
    }

    accountInvitations() {
        //alert("Récupération invitations profil")

        const invit1 = { id: 1, sender: 'User57', group: 'La mifa !', idImage: '13' }
        const invit2 = { id: 2, sender: 'Fati', group: 'Les collègues',idImage: '6' }
        const invit3 = { id: 3, sender: 'Lili la licorne', group: 'Vacances dans les iles',idImage: '16'}
        const invit4 = { id: 4, sender: 'Anonyme201', group: 'H4212',idImage: '8' }
    
        let accountInvitations = [invit1, invit2, invit3, invit4]
        /*let accountInvitations = []
        const fullEndpoint = endpoint + "invitation"
        try {
            const response = await fetch(backendURL + fullEndpoint, 
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: none
            })
            if (response.status != 200) {
                    alert("Erreur lors de la récupération des invitations")
            }
            else {
                alert("Récupération des invitations réussie :)")
                accountInvitations.push(response.invitations)
            }
        }
        catch (error) {
            console.log(error)
        }*/
        return accountInvitations
    }

}

const accountServices = new AccountServices()
export default accountServices