// app/Components/TexstRow.js
import React from 'react';
import { StyleSheet, Text, TextInput, View, Platform } from 'react-native';

export default class TexstRow extends React.Component {

    render() {
        const type = this.props.type
        const name = this.props.name
        const name2 = this.props.name2
        let colorText2 = "white"
        if(this.props.color!=null){
            colorText2 = this.props.color
        }
        let style_container
        if(name2!=null && name2.length<=25){
            style_container = styles.main_container
        }else{
            style_container = styles.main2_container
        }
        return (
            <View style={style_container} >
                <Text style={styles.text}> {name}</Text>
                <Text style={[styles.text2, {color:colorText2}]}>{name2}</Text>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'

    },
    main2_container: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'

    },
    text: {
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
        color: 'black',
        marginBottom: 5,
        marginLeft: 20,
    },
    text2: {
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
        color: 'white',
        marginBottom: 5,
        marginRight: 20
    }
});