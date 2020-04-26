import { backendURL } from '../modules/BackendConfig.js'
import { httpError } from '../modules/Error.js'
import { storeToken, getToken } from '../modules/TokenStorage.js'

const endpoint = "/group"

class GroupServices {
    dataGroupsUser() {
        //alert("Récupération groupes utilisateur")

        const group1 = { id: 1, name: 'Le meilleur groupe de travail', idImage: '5' }
        const group2 = { id: 2, name: 'En famille !', idImage: '10' }
        const group3 = { id: 3, name: 'Vacaciones', idImage: '3'}
        const group4 = { id: 4, name: 'Les potaux', idImage: '7' }
    
        let accountGroups = [group1, group2, group3, group4]
        /*let accountGroups = []
        const fullEndpoint = endpoint
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
                    alert("Erreur lors de la récupération des groupes")
            }
            else {
                alert("Récupération des groupes réussie :)")
                accountGroups.push(response.groups)
            }
        }
        catch (error) {
            console.error(error)
        }*/
        return accountGroups
    }

}
const groupServices = new GroupServices()
export default groupServices
