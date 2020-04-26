// Components/GroupItem.js

import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'

class GroupItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const group = this.props.group
        const image = this.props.image
        return (

            <View style={styles.main_container}>
                <Image
                    style={styles.image}
                    source={image}
                />
                <View style={styles.text_container}>
                    <Text style={styles.description_text} >{group}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        //justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 5,
        borderColor: '#d9d9d9',
        borderWidth: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        width: 350,
        height: 100
    },
    text_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    image: {
        marginTop: 10,
        alignSelf: 'center',
        resizeMode: 'contain',
        width: 80,
        height: 80,
        borderColor: '#ffdb58',
        borderWidth: 3,
        borderRadius: 50,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 20
    },
    description_text: {
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
        fontSize: 16,
        textAlign: 'center',
        color: 'black',
        flexWrap: 'wrap'
    },
})

export default GroupItem