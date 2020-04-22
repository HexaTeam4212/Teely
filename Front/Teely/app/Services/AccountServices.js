//app/Services/SignUpService.js


const backendURL = "http://621a5af9.ngrok.io"
const endpoint = "/account/"

class AccountServices {

    signup(username, password, confirmedPassword,email, lastName, name, birthDate) {
        if (password != confirmedPassword) {
            alert("Les mots de passe saisis ne sont pas identiques, merci de re-vérifier")
        }
        if (!email.includes("@") || !email.includes(".")) {
            alert("Adresse mail non valide, merci de re-vérifier")
        }
        //Vérification du format de la date
        this.signUpRequest(username, password,email, lastName, name, birthDate)

    }

    async signUpRequest(username, password,email, lastName, name, birthDate) {
        
        try {
            const requestBody = JSON.stringify({
                username: username,
                password: password,
                email: email,
                birthdate: birthDate,
                lastName: lastName,
                name: name,
                bio: "" //TODO: a retirer une fois que le back aura corrigé
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
            console.log(response.status)
            if (response.status != 201) {
                alert("inscription échouée" + response.status)
            }
        }
        catch (error) {
            console.error(error)
        }
      }

}
const accountServices = new AccountServices()
export default accountServices