// app/Components/InviteButton.js
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Platform, Button } from 'react-native';

export default class InviteButton extends React.Component {
    render() {
        const name = this.props.name
        const width = this.props.width
        const onPressAction = this.props.onPress
        return (
            <View style={styles.main_container}>
                <TouchableOpacity style={styles.button} onPress={onPressAction}>
                    <Text style={styles.buttonText}>{name}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        fontSize: 17,
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
        textAlign: 'center'
    },
    button: {
        padding: 10,
        backgroundColor: 'lightpink',
        width: 150,
        height: 80,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: "center",
    }
});