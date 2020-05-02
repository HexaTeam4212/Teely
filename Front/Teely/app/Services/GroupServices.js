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
            // console.log("service : "+JSON.stringify(respBody))
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

    async getGroupInfos(groupId, callback) {
        const name = 'Democrateam'
        const idImageGroup = 5
        const description = "La meilleure équipe projet"
        const  members = [ 'FatimaW', 'Louis', 'AndreaC', 'Shuyao', 'Lucie', 'Emmy', 'Baptiste' ]


        let groupInfo = await {id: groupId, group_name: name, idImageGroup: idImageGroup, description: description, members: members}
        /*const token = await getToken()
        const fullEndpoint = endpoint+ '/'+groupId
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
            }
            else {
                callback(respBody)
            }
        }
        catch (error) {
            console.error(error)
        }*/
        callback(groupInfo)
    }

    async leaveGroup(groupId, callback) {
        const token = await getToken()
        const fullEndpoint = endpoint+ '/'+groupId+'/quit'
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
            if (response.status != 204) {
                httpError(response.status)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async inviteUser(groupId, username) {
        const token = await getToken()
        const fullEndpoint = endpoint+ '/'+groupId+'/invite'
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    parameters: username
                })
                .catch(err => {
                    console.log("Promise error : " + err)
                })
            const respBody = await response.json()
            if (response.status != 200) {
                if (response.status == 409) {
                    alert("Cet utilisateur est déjà dans le groupe ou a déjà été invité !")
                }
                httpError(response.status)
            }
            else {
                callback(true)
                alert("L'invitation a bien été envoyée à "+ username)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async createGroup(groupName, description, invitedUsers, idImageGroup, callback) {
        const requestBody = JSON.stringify({
            group_name: groupName,
            description: description,
            guests: invitedUsers,
            idImageGroup: idImageGroup
        })
        console.log(requestBody)
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
                console.error(response.error)
            }
            else {
                callback()
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async getGroupTasks(groupId, callback) {
        const token = await getToken()
        const fullEndpoint = endpoint+ '/'+groupId+'/task/all'
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
            const respBody = await response.json()
            console.log("response : "+respBody.tasks)
            if (response.status != 200) {
                alert("Erreur lors de la récupération des tâches")
            }
            else {
                callback(respBody.tasks)
            }
        }
        catch (error) {
            console.error(error)
        }
    }



}
const groupServices = new GroupServices()
export default groupServices
