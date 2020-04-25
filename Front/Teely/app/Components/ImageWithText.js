// app/Components/CustomButton.js
import React from 'react';
import { StyleSheet, ImageBackground, Text, View } from 'react-native';

export default class ImageWithText extends React.Component {
    render() {
        const text = this.props.text
        const source = this.props.source
        return (
            <View style={styles.main_container}>
                <ImageBackground style={{height: 70, width: 330, justifyContent: "center", alignItems: "center"}} source={source}>
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.button_text}>{text}</Text>
                    </View>
                </ImageBackground>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    button_text: {
        fontFamily: Platform.OS === 'ios' ? 'Marker Felt' : 'Roboto',
        fontWeight: 'bold',
        fontSize: 26,
        textAlign: 'left',
        color: 'white',
        flexWrap: 'wrap'
    },
});