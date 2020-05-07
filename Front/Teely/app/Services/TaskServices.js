import { backendURL } from '../modules/BackendConfig.js'
import { httpError } from '../modules/Error.js'
import { getToken } from '../modules/TokenStorage.js'


const endpoint = "/task"

class TaskServices {
    async getTaskInfos(taskId, callback) {
        const token = await getToken()
        const fullEndpoint = endpoint + '/' + taskId
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
                callback(respBody.task)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async deleteTask(taskId, callback) {
        const token = await getToken()
        const fullEndpoint = endpoint + '/' + taskId
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
            const respBody = await response
            if (response.status != 204) {
                if (response.status == 404) {
                    alert("La tâche n'existe pas ou a déjà été supprimée")
                }
                else {
                    httpError(response.status)
                    console.warn(respBody.error)
                }

                callback(false);
            }
            else {
                callback(true);
            }
        } catch (error) {
            console.error(error)
        }
    }

    async updateTask(taskId, taskUser, description, name, datetimeStart, datetimeEnd, priority, dependencies, duration, callback) {
        const token = await getToken()
        const requestBody = JSON.stringify({
            taskUser: taskUser,
            description: description,
            frequency: 1,
            name: name,
            datetimeStart: datetimeStart,
            datetimeEnd: datetimeEnd,
            priority: priority,
            dependencies: dependencies,
            duration: duration,
        })
        const fullEndpoint = endpoint + '/' + taskId
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
            const respBody = await response.json()
            if (response.status != 200) {
                if (response.status == 404) {
                    alert("La tâche n'existe pas")
                }
                else if (response.status==400) {
                    alert("La durée et les heures saisies sont incohérentes")
                }
                else {
                    httpError(response.status)
                    console.warn(respBody.error)
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
}
const taskServices = new TaskServices()
export default taskServices