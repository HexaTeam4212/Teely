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
}
const taskServices = new TaskServices()
export default taskServices