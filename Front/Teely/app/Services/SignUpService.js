//app/Services/SignUpService.js

class SignUpService {
    signup(username, password, confirmedPassword,email, lastName, name, birthDate) {
        alert("Submitted : \n username : " + username +
        "\n password : " + password +
        "\n confirmed password : " + confirmedPassword + 
        "\n email : " + email +
        "\n lastName : " + lastName +
        "\n name : " + name +
        "\n birthDate : " + birthDate)

        if (password != confirmedPassword) {
            alert("Les mots de passe saisis ne sont pas identiques, merci de re-vérifier")
        }
        //if (verif format email)
    }

}
const signUpService = new SignUpService()
export default signUpService