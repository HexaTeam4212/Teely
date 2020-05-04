// app/Views/GroupMembers.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, FlatList, KeyboardAvoidingView } from 'react-native'
import accountServices from '../Services/AccountServices'
import groupServices from '../Services/GroupServices'
import ProfileIcon from '../Components/ProfileIcon'
import GroupIcon from '../Components/GroupIcon'
import MemberItem from '../Components/MemberItem'


export default class DetailedGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            idImageProfile: 18,
            name: "",
            description: "",
            idImageGroup: 18,
            members: [],
            isLoading: true,
        }
        this.groupId = ""
        this.getGroupId()
        this.getDataProfile()
        this.getGroupInfos()
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

    getGroupId() {
        let params = this.props.route.params
        this.groupId = params.idGroup
    }

    updateGroupInfos = (data) => {
        this.setState({
            name: data.group_name, description: data.description, idImageGroup: data.idImageGroup,
            members: data.members, isLoading: false
        });
    }

    getGroupInfos = () => {
        groupServices.getGroupInfos(this.groupId, this.updateGroupInfos)
    }

    updateDataProfile = (dataProfile) => {
        this.setState({ idImageProfile: dataProfile.idImage })
    }

    getDataProfile = () => {
        accountServices.dataProfile(this.updateDataProfile, "")
    }

    render() {
        return (
            <View style={styles.main_container}>
                <ProfileIcon idImage={this.state.idImageProfile} />
                <View >
                    <KeyboardAwareScrollView
                        contentContainerstyle={styles.content_container}
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                        enableAutomaticScroll={(Platform.OS === 'ios')}
                        enableOnAndroid={true}>
                        <View style={styles.head_container}>
                            <GroupIcon idImage={this.state.idImageGroup} />
                            <Text style={styles.name_text}>{this.state.name}</Text>
                            <Text style={styles.description_text} numberOfLines={4}> {this.state.description}</Text>
                            <Text style={styles.participant_text}>{this.state.members.length} participants</Text>
                        </View>
                        <FlatList
                            data={this.state.members}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => <MemberItem username={item} />}
                        />
                    </KeyboardAwareScrollView>
                </View>
                {this.displayLoading()}
            </View>




        )
    }

}

const styles = StyleSheet.create({
    main_container: {
        backgroundColor: '#78e1db',
        flex: 1
    },
    content_container: {
        marginTop: 30,
        marginBottom: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    head_container: {
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    groupPic: {
        marginTop: 5,
        alignSelf: 'center',
        resizeMode: 'contain',
        width: 120,
        height: 120,
        borderColor: '#ffb4e2',
        borderWidth: 3,
        borderRadius: 60,
        marginBottom: 10
    },
    name_text: {
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
        flexWrap: 'wrap'
    },
    description_text: {
        fontStyle: 'italic',
        color: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'Roboto',
        fontSize: 20,
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    participant_text: {
        fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
        fontSize: 16,
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',
        flexWrap: 'wrap'
    },
})




