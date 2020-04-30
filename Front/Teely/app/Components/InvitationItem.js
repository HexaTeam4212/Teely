// Components/InvitationItem.js

import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import Images from '../modules/ImageGroup';

class InvitationItem extends React.Component {
    constructor(props) {
        super(props);
        this.invitation = this.props.invitation;
    }

    clickAcceptButton() {
        this.props.parentCallbackAccept(this.invitation)
    }

    clickDeclineButton() {
        this.props.parentCallbackDecline(this.invitation)
    }

    render() {
        return (
            <View style={styles.main_container}>
                <View style={styles.image_container}>
                    <Image
                        style={styles.image}
                        source={Images[this.invitation.idImageGroup]}
                    />
                </View>
                <View style={styles.right_container}>
                    <View style={styles.text_container}>
                    <Text style={styles.description_text} >{this.invitation.sender}
                        {" "}t'invite à rejoindre le groupe :{"\n"}{this.invitation.group}
                    </Text>
                    </View>
                    <View style={styles.button_container}>
                        <View style={styles.acceptButton_container}>
                        <TouchableOpacity style={styles.acceptButton} onPress={() => this.clickAcceptButton()}>
                            <Text style={styles.button_text}>Accepter</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={styles.declineButton_container}>
                        <TouchableOpacity style={styles.declineButton} onPress={() => this.clickDeclineButton()} >
                            <Text style={styles.button_text}>Refuser</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginBottom: 5,
        borderColor: '#d9d9d9',
        borderWidth: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        width: 350,
        height: 120,

    },
    image_container: {
        flex: 1,
    },
    right_container: {
        flex: 2.5,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    text_container:{
        flex: 2,
    },
    button_container:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        margin: 7,
    },
    acceptButton_container:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    declineButton_container:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
        marginRight: 20,
    },
    description_text: {
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
        fontSize: 16,
        textAlign: 'center',
        color: 'black',
        flexWrap: 'wrap'
    },
    button_text: {
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
        color: 'black',
        flexWrap: 'wrap'
    },
    acceptButton: {
        padding: 10,
        backgroundColor: '#70F987',
        width: 90,
        height: 35,
        borderRadius: 30,
    },
    declineButton: {
        padding: 10,
        backgroundColor: '#F56262',
        width: 90,
        height: 35,
        borderRadius: 30,
    }
})

export default InvitationItem