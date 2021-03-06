// app/Views/SignUp.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { YellowBox, RefreshControl, StyleSheet, Text, View, ActivityIndicator, Image, Platform, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'

import ImageWithText from '../Components/ImageWithText'
import accountServices from '../Services/AccountServices'
import Images from '../modules/ImageProfile'
import TaskItem from '../Components/TaskItem'
import LogoutButton from '../Components/LogoutButton'
import generalServices from '../Services/GeneralServices'
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'


YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

export default class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            refreshing: false,
            username: "",
            name: "",
            lastName: "",
            birthDate: "",
            biography: "",
            idImage: 1,
            tasks: []
        }
        this.getDataProfile()

    }

    componentDidMount() {
        const { navigation } = this.props
        this._unsubscribe = navigation.addListener('focus', () => {
            this.getDataProfile()
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
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
    displayUpcomingTasks() {
        if (!(this.state.tasks.length)) {
            return (
                <View style={styles.emptyTasks_container}>
                    <Text style={styles.bio_text}>Rien à signaler pour le moment... </Text>
                    <Image style={{ height: 150, width: 100 }} source={require('../../assets/Images/cat.png')} />
                </View>
            )
        }
        else {
            return (
                <SafeAreaView style={styles.tasks_container}>
                    <Text style={styles.name_text}>A venir :</Text>
                    <FlatList
                        data={this.state.tasks}
                        keyExtractor={(item) => item.taskId.toString()}
                        renderItem={({ item }) => <TaskItem task={item} />}
                    />
                </SafeAreaView>
            )
        }
    }

    updateTasksList = (tasksList) => {
        this.setState({
            tasks: tasksList.slice(0,3), isLoading: false, refreshing: false
        })
    }

    updateDataProfile = (dataProfile) => {
        this.setState({
            username: dataProfile.username, name: dataProfile.name, lastName: dataProfile.lastName,
            birthDate: generalServices.formatDate(dataProfile.birthDate), biography: dataProfile.bio, idImage: dataProfile.idImage,
            isLoading: false
        })
        accountServices.accountUpcomingTasks(this.updateTasksList)
    }

    getDataProfile = () => {
        accountServices.dataProfile(this.updateDataProfile, "")
    }

    imageProfile = () => {
        return (
            <Image style={styles.profilePic} source={Images[this.state.idImage]} />
        )
    }

    displayBiography = () => {
        if (this.state.biography == null) {
            return (
                <Text style={styles.bio_text}> Votre bio ici :) </Text>
            )
        } else {
            return (
                <Text style={styles.bio_text} numberOfLines={4}> {this.state.biography}</Text>
            )
        }
    }



    render() {
        return (
            <View style={styles.main_container}>
                {backgroundGradientColor()}
                <LogoutButton></LogoutButton>
                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView
                        contentContainerStyle={{ flex: 1 }}
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                        enableAutomaticScroll={(Platform.OS === 'ios')}
                        enableOnAndroid={true}
                        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                    >
                        <View style={styles.head_container}>
                            {this.imageProfile()}
                            <View style={styles.headerInfo_container}>
                                <View style={styles.labels_container}>
                                    <Text style={styles.name_text}>{this.state.name} {this.state.lastName}</Text>
                                    <Text style={styles.username_text}> ({this.state.username}) </Text>
                                </View>
                                <View style={styles.bio_container}>
                                    {this.displayBiography()}
                                </View>
                                <View style={styles.foot_container}>
                                    <Text style={styles.date_text}>Né(e) le : {this.state.birthDate}</Text>
                                    <TouchableOpacity style={styles.editButton} onPress={() => this.props.navigation.navigate("EditProfile")}>
                                        <Image style={styles.editImage} source={require('../../assets/Images/edit.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={{ flex: 3 }} onPress={() => this.props.navigation.navigate("PersonalCalendar")}>
                            <ImageWithText source={require('../../assets/Images/yellowArrow.png')} text='MON CALENDRIER' />
                        </TouchableOpacity>
                        <View style={styles.content_container}>
                            <KeyboardAwareScrollView
                                contentContainerstyle={styles.content_container}
                                resetScrollToCoords={{ x: 0, y: 0 }}
                                scrollEnabled={true}
                                enableAutomaticScroll={(Platform.OS === 'ios')}
                                enableOnAndroid={true}>
                                {this.displayUpcomingTasks()}
                            </KeyboardAwareScrollView>
                        </View>
                        <TouchableOpacity style={{ flex: 3, marginBottom: 1 }} onPress={() => this.props.navigation.navigate("Groups")}>
                            <ImageWithText source={require('../../assets/Images/pinkArrow.png')} text='MES GROUPES' />
                        </TouchableOpacity>
                        {this.displayLoading()}
                    </KeyboardAwareScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    head_container: {
        flex: 4,
        marginRight: 10,
        marginLeft: 10,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
    },
    headerInfo_container: {
        flex: 1,
        margin: 5
    },
    foot_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    content_container: {
        backgroundColor: '#78e1db',
        flex: 5,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        marginLeft: 50,
        marginRight: 30,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 15,
    },
    labels_container: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    emptyTasks_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tasks_container: {
        margin: 10,
        flex: 1,
        flexDirection: 'column',
    },
    name_text: {
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
        flexWrap: 'wrap'
    },
    username_text: {
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
        fontSize: 18,
        fontStyle: 'italic',
        color: 'white',
        textAlign: 'center',
        flexWrap: 'wrap'
    },
    button_text: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        color: 'white',
        flexWrap: 'wrap'
    },
    bio_container: {
        flex: 3,
        justifyContent: 'center'
    },
    bio_text: {
        fontStyle: 'italic',
        color: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'Roboto',
        fontSize: 20,
        textAlign: 'left',
        flexWrap: 'wrap'
    },
    date_text: {
        marginTop: 5,
        textAlign: 'left',
        fontSize: 16,
        color: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
    },
    profilePic: {
        marginTop: 10,
        alignSelf: 'center',
        resizeMode: 'contain',
        width: 80,
        height: 80,
        borderColor: '#ffb4e2',
        borderWidth: 3,
        borderRadius: 50,
        marginBottom: 20
    },
    editButton: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    editImage: {
        width: 30,
        height: 30,
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 100,
        alignItems: 'center',
        justifyContent: 'center'
    }
});