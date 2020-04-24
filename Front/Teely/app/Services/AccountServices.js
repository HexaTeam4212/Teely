//app/Services/SignUpService.js
import { backendURL } from '../modules/BackendConfig.js'
import { httpError } from '../modules/Error.js'

const endpoint = "/account/"

class AccountServices {

    async signup(username, password, email, lastName, name, birthDate, callback) {
        const requestBody = JSON.stringify({
            username: username,
            password: password,
            email: email,
            birthdate: birthDate,
            lastName: lastName,
            name: name,
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
                console.error(await response.json())
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
            if (response.status != 200) {
                if (response.status == 400) {
                    alert("Paramètre manquant dans la requête. Veuillez consulter les logs pour plus de détails.")
                }
                else {
                    httpError(response.status)
                }
                callback(false);
                console.error(await response.json())
            }
            else {
                callback(true);
            }
        }
        catch (error) {
            console.error(error)
        }
    }

      async saveProfil(username, password, confirmedPassword,email, lastName, name, birthDate, biography, image,callback) {
        
        alert(lastName +"\n" +name +"\n"+username+"\n" +password+"\n"
        +confirmedPassword+"\n" + email+"\n"+ birthDate+"\n"+ biography
        + "\n"+image)
        callback(true);

        /*if(username=='' || password=='' || confirmedPassword=='' || birthDate=='' || lastName=='' || name=='' || email=='') {
            alert("Veuillez remplir tous les champs !")
        } 
        else if (password != confirmedPassword) {
            alert("Les mots de passe saisis ne sont pas identiques, merci de re-vérifier")
        }
        else {
            try {
                const requestBody = JSON.stringify({
                    username: username,
                    password: password,
                    email: email,
                    birthdate: birthDate,
                    lastName: lastName,
                    name: name,
                    biography: biography,
                    image: image
                })
                const fullEndpoint = endpoint + "update"
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
            }
            catch (error) {
                console.error(error)
            }
        }*/

    }

    dataProfil() {
        alert("Récupération données profil")
        
        const username = "Pseudonyme"
        const password = "********"
        const email = "xyz@gmail.com"
        const lastName = "Nom"
        const name = "Prénom"
        const birthDate = "aaaa-mm-jj"
        const biography = "Biographie"
        const image = 18
        console.log("image data profil : "+image)
        let datasProfil = [lastName, name,username,password,email, birthDate, biography, image]
        
        /*let datasProfil = []
        try {
            const fullEndpoint = endpoint + "info"
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

}
const accountServices = new AccountServices()
export default accountServices