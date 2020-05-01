import { backendURL } from '../modules/BackendConfig.js'
import { httpError } from '../modules/Error.js'
import { storeToken, getToken } from '../modules/TokenStorage.js'

const endpoint = "/group"

class GroupServices {
    
    async getGroupsUser(callback) {

        // const group1 = { id: 1, name: 'Le meilleur groupe de travail', idImage: '0' }
        // const group2 = { id: 2, name: 'En famille !', idImage: '1' }
        // const group3 = { id: 3, name: 'Vacaciones', idImage: '2'}
        // const group4 = { id: 4, name: 'Les poteaux', idImage: '3' }
    
        // let accountGroups = [group1, group2, group3, group4]
        const token = await getToken()
        try {
            const response = await fetch(backendURL + endpoint,
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
            }
            else {
                callback(respBody.groups)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async createGroup(groupName, description, invitedUsers, callback) {
        const requestBody = JSON.stringify({
            group_name: groupName,
            description: description,
            guests: invitedUsers
        })
        const token = await getToken()
        try {
            const response = await fetch(backendURL + endpoint,
                {
                    method: 'POST',
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
                    alert("Paramètre manquant dans la requête. Veuillez consulter les logs pour plus de détails.")
                }
                else if (response.status == 409) {
                    alert("Le groupe n'a pas pu être ajouté à la base de données. Veuillez consulter les logs pour plus de détails")
                }
                else {
                    httpError(response.status)
                }
            }
            else {
                callback()
            }
        }
        catch (error) {
            console.error(error)
        }
    }

}
const groupServices = new GroupServices()
export default groupServices
