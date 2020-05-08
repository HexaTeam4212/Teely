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
            if (response.status != 200) {
                httpError(response.status)
                console.warn(respBody.error)
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
        const fullEndpoint = endpoint + '/' + groupId
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
                console.warn(respBody.error)
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
        const fullEndpoint = endpoint + '/' + groupId + '/update'
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
                .catch(err => {
                    console.error("Promise error : " + err)
                })
            if (response.status != 204) {
                if (response.status == 400) {
                    alert("Paramètre manquant dans la requête. Veuillez consulter les logs pour plus de détails.")
                }
                else {
                    httpError(response.status)
                }
                const respBody = await response.json()
                console.warn(respBody.error)
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
        const fullEndpoint = endpoint + '/' + groupId + '/quit'
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
                const respBody = await response.json()
                console.warn(respBody.error)
                callback(false)
            } else {
                callback(true)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async inviteUser(groupId, username, callback) {
        const token = await getToken()
        const fullEndpoint = endpoint + '/' + groupId + '/invite?username=' + username
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
            if (response.status != 204) {
                if (response.status == 409) {
                    alert(username + " est déjà dans le groupe ou a déjà été invité !")
                }
                else {
                    httpError(response.status)
                }
                const respBody = await response.json()
                console.warn(respBody.error)
                callback(false)
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
                    alert("Une erreur s'est produite au niveau du réseau. Veuillez réessayer plus tard ou contater le support informatique.")
                }
                else if (response.status == 409) {
                    alert("Le groupe n'a pas pu être ajouté à la base de données. Veuillez consulter les logs pour plus de détails")
                }
                else {
                    httpError(response.status)
                }
                const respBody = await response.json()
                console.warn(respBody.error)
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
        const fullEndpoint = endpoint + '/' + groupId + '/task/all'
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
                console.warn(respBody.error)
            }
            else {
                callback(respBody.tasks)
            }

        }
        catch (error) {
            console.error(error)
        }
    }

    async acceptInvitGroup(groupId, invitId, callback) {
        const token = await getToken()
        const fullEndpoint = endpoint + '/' + groupId + '/accept?invite_id=' + invitId
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token,
                    }
                })
                .catch(err => {
                    console.error("Promise error : " + err)
                })
            if (response.status != 204) {
                httpError(response.status)
                callback(false)
                const respBody = await response.json()
                console.warn(respBody.error)
            }
            else {
                callback(true)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async declineInvitGroup(groupId, callback) {
        const token = await getToken()
        const fullEndpoint = endpoint + '/' + groupId + '/invite'
        try {
            const response = await fetch(backendURL + fullEndpoint,
                {
                    method: 'DELETE',
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
                const respBody = await response.json()
                console.warn(respBody.error)
                callback(false);
            }
            else {
                callback(true);
            }

        } catch (error) {
            console.error(error)
        }
    }

    async createTask(groupId, name, description, datetimeStart, datetimeEnd,
        duration, dependencies, taskUser, priority, callback) {
        const requestBody = JSON.stringify({
            name: name,
            description: description,
            taskUser: taskUser,
            frequency: 1,
            priorityLevel: priority,
            dependencies: dependencies,
            datetimeStart: datetimeStart,
            datetimeEnd: datetimeEnd,
            duration: duration,
        })
        const fullEndpoint = endpoint + '/' + groupId + '/task'
        const token = await getToken()
        try {
            const response = await fetch(backendURL + fullEndpoint,
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
            if (response.status != 200) {
                if (response.status == 400) {
                    alert("Erreur de réseau. Veuillez réessayer plus tard ou contacter le support informatique.")
                }
                else if (response.status == 404) {
                    alert("Utilisateur ou groupe non trouvé")
                }
                else {
                    httpError(response.status)
                }
                const respBody = await response.json()
                console.warn(respBody.error)
                callback(false)
            }
            else {
                callback(true)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async orderTaks(groupId, startHour, startMinute, endHour, endMinute, callback) {
        const fullEndpoint = endpoint + '/' + groupId + '/order?startHour=' + startHour + '&startMinute=' + startMinute
            + '&endHour=' + endHour + '&endMinute=' + endMinute
        const token = await getToken()
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
                    console.error("Promise error : " + err)
                })
            const respBody = await response.json()
            if (response.status != 200) {
                if (response.status == 400) {
                    alert("Paramètres manquants à la requête")
                }
                else if (response.status==412) {
                    alert("Les heures de début et de fin ne sont pas valides, veuillez choisir une heure de fin supérieure à celle de début")
                }
                else if (response.status == 409) {
                    alert("Attention : certaines tâches ont une durée supérieure au créneau imposé et n'ont donc pas été agencées")
                }
                else {
                    httpError(response.status)
                }
                callback(false)
                console.warn(respBody.error)
            }
            else {
                callback(true, respBody.tasks_modified)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

}
const groupServices = new GroupServices()
export default groupServices
