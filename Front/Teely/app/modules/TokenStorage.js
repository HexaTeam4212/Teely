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

export const storeKeyValue = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.error(e)
    }
}

export const getKeyValue = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value
        }
        else {
            console.error("Key not found")
        }
    } catch (e) {
        console.error(e)
    }
}

export const removeKeyValue = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (e) {
        console.error(e)
    }
}

export const clearAllData = async() => {
    AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        .then(() => alert('success'));
}