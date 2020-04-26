import { AsyncStorage } from 'react-native'

export const storeToken = async (token) => {
    try {
        await AsyncStorage.setItem('Authorization', token)
    } catch (e) {
        console.error(e)
    }
}

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('Authorization')
        if (token !== null) {
            return token
        }
        else {
            console.error("Token not found")
        }
    } catch (e) {
        console.error(e)
    }
}

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('Authorization')
    } catch (e) {
        console.error(e)
    }
}