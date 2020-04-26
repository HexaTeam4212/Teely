// Components/InvitationItem.js

import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import Images from '../modules/ImageProfil';

class InvitationItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const invitation = this.props.invitation
        return (
                <View style={styles.main_container}>
                    <Image
                        style={styles.image}
                        source={Images[invitation.idImage]}
                    />
                    <Text style={styles.description_text} >{invitation.sender} 
                    {" "}t'invite à rejoindre{"\n"}le groupe : {"\n"}{invitation.group}
                    </Text>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        //flex: 1,
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
    },
})

export default InvitationItem