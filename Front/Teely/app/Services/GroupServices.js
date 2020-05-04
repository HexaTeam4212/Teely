import { backendURL } from '../modules/BackendConfig.js'
import { httpError } from '../modules/Error.js'
import { storeToken, getToken } from '../modules/TokenStorage.js'

const endpoint = "/group"

class GroupServices {
    
    async getGroupsUser(callback) {
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
        const token = await getToken()
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
        }
    }

    async updateGroupInfos(groupId, groupName, description, callback) {
        const token = await getToken()
        const requestBody = JSON.stringify({
            group_name: groupName,
            description: description
        })
        const fullEndpoint = endpoint+ '/'+groupId+'/update'
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    body: requestBody
                })
            if (response.status != 204) {
                if (response.status == 400) {
                    alert("Paramètre manquant dans la requête. Veuillez consulter les logs pour plus de détails.")
                }
                callback(false);
            }
            else {
                alert("Modification enregistrée :)")
                callback(true);
            }

        } catch (error) {
            console.error(error)
        }
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
            if (response.status != 204) {
                httpError(response.status)
                callback(false)
            }else {
                callback(true)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async inviteUser(groupId, username) {
        const token = await getToken()
        const fullEndpoint = endpoint+ '/'+groupId+'/invite?username=' + username
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                })
                .catch(err => {
                    console.log("Promise error : " + err)
                })
            if (response.status != 200) {
                if (response.status == 409) {
                    alert(username +" est déjà dans le groupe ou a déjà été invité !")
                }
                httpError(response.status)
            }
            else {
                callback(true)
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
