// Components/MemberItem.js

import React from 'react'
import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native'
import ImagesProfile from '../modules/ImageProfile'
import accountServices from '../Services/AccountServices'
import moment from 'moment'

export default class MemberItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            username: this.props.username,
            name: "",
            lastName: "",
            birthDate: "",
            biography: "",
            idImageProfile: 18,
        }
        this.getDataProfile()
    }

    displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator color='#ffb4e2' size='large' />
                </View>
            )
        }
    }

    updateDataProfile = (dataProfile) => {
        this.setState({
            name: dataProfile.name, lastName: dataProfile.lastName, birthDate: this.formatDate(dataProfile.birthDate),
            biography: dataProfile.bio, idImageProfile: dataProfile.idImage, isLoading: false
        })
    }

    getDataProfile = () => {
        accountServices.dataProfile(this.updateDataProfile, this.state.username) 
    }

    formatDate(dateString) {
        var date = new Date(dateString);
        var formattedDate = moment(date).format("DD/MM/YYYY")
        return formattedDate
    }
    render() {
        return (
            <View style={styles.main_container}>
                <Image
                    style={styles.image}
                    source={ImagesProfile[this.state.idImageProfile]}
                />
                <View style={styles.infos_container}>
                    <View style={styles.labels_container}>
                        <Text style={styles.name_text}>{this.state.name} {this.state.lastName}</Text>
                        <Text style={styles.username_text}> ({this.state.username}) </Text>
                    </View>
                    <View style={styles.bio_container}>
                        <Text style={styles.bio_text}>{this.state.biography}</Text>
                    </View>
                    <View style={styles.foot_container}>
                        <Text style={styles.date_text}>Né(e) le : {this.state.birthDate}</Text>
                    </View>
                </View>
                {this.displayLoading()}
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        flexDirection: 'row',
        borderColor: '#ffb4e2',
        borderWidth: 5,
        backgroundColor: '#78e1db',
    },
    infos_container: {
        flex: 1,
        margin: 5
    },
    labels_container: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    bio_container: {
        justifyContent: 'center'
    },
    foot_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    loading_container: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    name_text: {
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        flexWrap: 'wrap'
    },
    username_text: {
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
        fontSize: 16,
        fontStyle: 'italic',
        color: 'white',
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    bio_text: {
        fontStyle: 'italic',
        color: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'Roboto',
        fontSize: 16,
        textAlign: 'left',
        flexWrap: 'wrap'
    },
    image: {
        marginTop: 10,
        alignSelf: 'center',
        resizeMode: 'contain',
        width: 70,
        height: 70,
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
    date_text: {
        marginTop: 5,
        textAlign: 'left',
        fontSize: 14,
        color: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
    },
})