//app/Services/SignUpService.js

const backendURL = "http://811122ea.ngrok.io"
const endpoint = "/account/"

class AccountServices {
    constructor () {
        this.signUpResult=""
    }

    async signup(username, password, confirmedPassword,email, lastName, name, birthDate, callback) {
        this.signUpResult="false"
        if(username=='' || password=='' || confirmedPassword=='' || birthDate=='' || lastName=='' || name=='' || email=='') {
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
                    this.signUpResult="true"
                    alert("Inscription réussie :)")
                    callback(true);
                }
            }
            catch (error) {
                console.error(error)
            }
        }
    }


}
const accountServices = new AccountServices()
export default accountServices