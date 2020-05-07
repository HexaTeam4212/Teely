// app/Views/GroupMembers.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image,RefreshControl, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'

import accountServices from '../Services/AccountServices'
import groupServices from '../Services/GroupServices'
import ProfileIcon from '../Components/ProfileIcon'
import GroupIcon from '../Components/GroupIcon'
import MemberItem from '../Components/MemberItem'
import MenuButton from '../Components/MenuButton'
import MenuDrawer from 'react-native-side-drawer'
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'
import Images from '../modules/ImageProfile';

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
            refreshing: false,
            open: false
        }
        this.groupId = ""
        this.getGroupId()
        this.getDataProfile()
        this.getGroupInfos()
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
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
            members: data.members, isLoading: false, refreshing: false
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

    toggleOpen = () => {
        this.setState({ open: !this.state.open });
    }

    drawerContent = () => {
        return (
            <View style={styles.menu}>
                <TouchableOpacity onPress={this.toggleOpen} style={{ flex: 1, marginBottom: 10 }} >
                    <ProfileIcon idImage={this.state.idImageProfile} />
                </TouchableOpacity>
                <View style={{ flex: 12 }}>
                    <MenuButton name='Profil' width={'95%'} onPress={() => this.props.navigation.navigate("Profile")} />
                    <MenuButton name='Calendrier' width={'95%'} onPress={() => this.props.navigation.navigate("PersonalCalendar")} />
                    <MenuButton name='Groupes' width={'95%'} onPress={() => this.props.navigation.navigate("Groups")} />
                    <MenuButton name='Invitations' width={'95%'} onPress={() => this.props.navigation.navigate("Invitations", { invitations: this.invitations })} />
                    <MenuButton name='Paramètres' width={'95%'} onPress={() => this.props.navigation.navigate("EditProfile")} />
                    <MenuButton name='Déconnexion' width={'95%'} onPress={() => {
                        accountServices.logout()
                        this.props.navigation.navigate("Login")
                    }} />
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.main_container}>
                {backgroundGradientColor()}
                <View style={{ flex: 1 }}>
                    <MenuDrawer
                        open={this.state.open}
                        drawerContent={this.drawerContent()}
                        drawerPercentage={55}
                        animationTime={200}
                        overlay={false}
                        opacity={0.2}
                    >
                        <KeyboardAwareScrollView
                            contentContainerStyle={{ flex: 1 }}
                            resetScrollToCoords={{ x: 0, y: 0 }}
                            scrollEnabled={true}
                            enableAutomaticScroll={(Platform.OS === 'ios')}
                            enableOnAndroid={true}
                            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                        >
                            <View style={styles.icon_container}>
                                <TouchableOpacity onPress={this.toggleOpen}>
                                    <Image style={styles.profil} source={Images[this.state.idImageProfile]} />
                                </TouchableOpacity>
                            </View>
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
                            <View style={{ marginBottom: 80 }}></View>
                        </KeyboardAwareScrollView>
                    </MenuDrawer>
                    {this.displayLoading()}
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    main_container: {
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
    icon_container: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        zIndex: 5
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
    profil: {
        resizeMode: 'contain',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderColor: '#ffb4e2',
        borderWidth: 3,
        borderRadius: 60,
        margin: 10
    },
    menu: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#ffb4e2",
        padding: 0
    },
})




