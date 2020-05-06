// app/Views/InviteMembers.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput } from 'react-native'
import ActionButton from 'react-native-action-button'
import Autocomplete from 'react-native-autocomplete-input'

import CustomButton from '../Components/CustomButton'
import groupServices from '../Services/GroupServices'
import accountServices from '../Services/AccountServices'
import { getToken } from '../modules/TokenStorage'

export default class InviteMembers extends React.Component {
    constructor(props) {
        super(props)
        this.groupId = ""
        this.state = {
            usernameInput: "",
            usernameList: [],
            invitedUsers: []
        }
        this.isUsernameValid = true
        this.getGroupId()
    }

    getGroupId() {
        let params = this.props.route.params
        this.groupId = params.idGroup
    }

    redirect = (result) => {
        this.setState({ isLoading: false })
        if (result) {
            this.props.navigation.navigate("DetailedGroup", { idGroup: this.groupId })
        }
    }


    render() {
        return (
            <View style={styles.main_container}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={true}
                    enableAutomaticScroll={(Platform.OS === 'ios')}
                    enableOnAndroid={true}>
                    <FlatList data={this.state.invitedUsers}
                        renderItem={({ item }) =>
                                <View style={styles.item}>
                                    <Text style={styles.itemText}>{item.key} </Text>
                                    <TouchableOpacity style={styles.crossButton} onPress={() => {
                                        const username = item.key
                                        this.state.invitedUsers.splice(this.state.invitedUsers.findIndex(v => v.key === username), 1)
                                        this.setState({ invitedUsers: this.state.invitedUsers })
                                    }}>
                                        <Image style={{height: 30, width: 30}}source={require('../../assets/Images/cross.png')} />
                                    </TouchableOpacity>
                                </View>
                        }>
                    </FlatList>
                    <Autocomplete
                        inputContainerStyle={styles.textInput}
                        listContainerStyle={styles.suggestionList}
                        placeholder="Participant à inviter"
                        data={this.state.usernameList}
                        defaultValue={this.state.usernameInput}
                        onChangeText={text => {
                            this.setState({ usernameInput: text })
                            this.isUsernameValid = this.state.usernameList.some((item) => item.key === text)
                            accountServices.getAccountUsernames(text, false, (usernameResults) => {
                                let newUsernameList = []
                                for (let i = 0; i < usernameResults.length; i++) {
                                    newUsernameList.push({ key: usernameResults[i] })
                                }
                                this.setState({ usernameList: newUsernameList })
                            })
                        }}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => {
                                this.setState({ usernameInput: item.key })
                                this.setState({ usernameList: [] })
                                this.isUsernameValid = true
                            }}>
                                <Text>{item.key}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <View style={styles.addButton}>
                        <ActionButton
                            buttonColor="pink"
                            onPress={() => {
                                if (this.state.invitedUsers.some(item => item.key === this.state.usernameInput)) {
                                    alert("Cet utilisateur est déjà dans la liste des participants !")
                                }
                                else if (this.state.usernameList.some(item => item.key !== this.state.usernameInput) || !this.isUsernameValid || this.state.usernameInput.length === 0) {
                                    alert("Cet utilisateur n'existe pas !")
                                }
                                else {
                                    this.state.invitedUsers.push({ key: this.state.usernameInput })
                                    this.setState({
                                        refresh: !this.state.refresh
                                    })
                                    this.setState({ usernameInput: '' })
                                }
                            }}
                            position="center"
                        />
                    </View>
                    <View style={styles.create_container}>
                        <CustomButton name='Inviter' width={200} onPress={() => {
                            for (let i = 0; i < this.state.invitedUsers.length; i++) {
                                console.log("à inviter : " + this.state.invitedUsers[i].key)
                                this.setState({ isLoading: true })
                                groupServices.inviteUser(this.groupId, this.state.invitedUsers[i].key, this.redirect)
                            }
                        }}></CustomButton>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#ffb4e2'
    },
    create_container: {
        flex: 1,
        marginTop: 30,
        marginBottom: 10,
    },
    item: {
        backgroundColor: 'lightpink',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 50,
    },
    itemText: {
        alignSelf: 'center',
        fontSize: 18,
        color: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
        fontWeight: 'bold',
        flexWrap: 'wrap',
        textAlign: 'center',
    },
    textInput: {
        backgroundColor: 'white',
        marginLeft: "15%",
        marginRight: "15%",
        marginTop: "5%",
        borderWidth: 0
    },
    suggestionList: {
        marginLeft: "15%",
        marginRight: "15%",
        borderWidth: 0
    },
    addButton: {
        marginBottom: 70,
        marginTop: -10
    },
    crossButton: {
        alignSelf: 'flex-end',
        marginRight: -55,
        marginTop: -26
    }
});