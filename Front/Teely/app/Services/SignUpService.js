//app/Services/SignUpService.js

class SignUpService {
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
        const backendURL = "http://localhost:5000"
        const endpoint = "/account/inscription"
        try {
            let requestBody = JSON.stringify({
                username: username,
                password: password,
                email: email,
                birthdate: birthDate,
                lastName: lastName,
                name: name,
                bio: ""
            })
            console.log(requestBody)
            const response = await fetch(backendURL + endpoint, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: requestBody
            })
            console.log(response.status)
            if (response.status != 201) {
                alert("inscription échouée")
            }
        }
        catch (error) {
            console.error(error)
        }
      }

}
const signUpService = new SignUpService()
export default signUpService