//app/Services/SignUpService.js

const backendURL = "http://18045fd1.ngrok.io"
const endpoint = "/account/"

class AccountServices {

    async signup(username, password, email, lastName, name, birthDate, callback) {
        try {
            const requestBody = JSON.stringify({
                username: username,
                password: password,
                email: email,
                birthdate: birthDate,
                lastName: lastName,
                name: name,
            })
            const fullEndpoint = endpoint + "inscription"
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: requestBody
                })
            if (response.status != 201) {
                if (response.status == 409) {
                    alert("Ce nom d'utilisateur (ou cette adresse e-mail) est déjà utilisé, merci d'en choisir un autre !")
                    callback(false);
                }
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
        try {
            const requestBody = JSON.stringify({
                username: username,
                password: password,
            })
            const fullEndpoint = endpoint + "login"
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: requestBody
                })
            if (response.status != 200) {
                if (response.status == 400) {
                    alert("Nom d'utilisateur ou mot de passe non renseignés")
                    callback(false);
                }
            }
            else {
                callback(true);
            }
        }
        catch (error) {
            console.error(error)
        }
    }
}
const accountServices = new AccountServices()
export default accountServices