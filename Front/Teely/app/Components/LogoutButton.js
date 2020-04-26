// app/Components/LogoutButton.js
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'

import accountServices from '../Services/AccountServices'

class LogoutButton extends React.Component {
    render() {
        const { navigation } = this.props
        return (
            <TouchableOpacity style={styles.signOutButton} onPress={() => {
                accountServices.logout()
                navigation.navigate("Login")
            }}>
                <Text style={styles.buttonText}>Déconnexion</Text>
            </TouchableOpacity >
        )
    }
}

export default function (props) {
    const navigation = useNavigation()
    return <LogoutButton {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
    signOutButton: {
        padding: 10,
        backgroundColor: '#ffb4e2',
        width: 110,
        height: 40,
        borderRadius: 30,
        alignSelf: 'flex-end'
    },
    buttonText: {
        fontSize: 15,
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? 'Papyrus' : 'Roboto',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        textAlign: 'center'
    },
});