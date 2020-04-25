// app/Views/SignUp.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, ActivityIndicator, Image, Platform, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'
import ImageWithText from '../Components/ImageWithText'
import accountServices from '../Services/AccountServices'
import Images from '../modules/ImageProfil'
import TaskItem from '../Components/TaskItem'
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
	'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

export default class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.username = ""
        this.lastName = ""
        this.name = ""
        this.birthDate = ""
        this.bio = ""
        this.tasks = []
        this.initDatasProfil = []
        this.state = { isLoading: false }
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
        this.tasks = accountServices.accountTasks().slice(0,6) //On affiche max les 6 prochaines
        if (!(this.tasks.length)) {
            return (
                <View style={styles.emptyTasks_container}>
                    <Text style={styles.bio_text}>Rien à signaler pour le moment.. </Text>
                    <Image style={{ height: 150, width: 100 }} source={require('../../assets/Images/cat.png')} />
                </View>
            )
        }
        else {
            return (
                <SafeAreaView style={styles.tasks_container}>
                    <Text style={styles.name_text}>A venir :</Text>
                    <FlatList
                        data={this.tasks}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <TaskItem task={item} />}
                    />
                </SafeAreaView>
            )
        }
    }

    getDataProfil = () => {
        this.initDatasProfil = accountServices.dataProfil()
        this.lastName = this.initDatasProfil[0]
        this.name = this.initDatasProfil[1]
        this.username = this.initDatasProfil[2]
        this.birthDate = this.initDatasProfil[5]
        this.bio = this.initDatasProfil[6]
        this.idImage = this.initDatasProfil[7]
    }


    imageProfil = () => {
        this.getDataProfil()
        return (
            <Image style={styles.profilePic} source={Images[this.idImage]} />
        )

    }


    render() {
        return (
            <View style={styles.main_container}>
                <TouchableOpacity style={styles.signOutButton} onPress={() => this.props.navigation.navigate("Login")}>
                    <Text style={styles.buttonText}>Déconnexion</Text>
                </TouchableOpacity>
                <View style={styles.head_container}>
                    {this.imageProfil()}
                    <View style={styles.headerInfo_container}>
                        <View style={styles.labels_container}>
                            <Text style={styles.name_text}>{this.name} {this.lastName}</Text>
                            <Text style={styles.username_text}> ({this.username}) </Text>
                        </View>
                        <View style={styles.bio_container}>
                            <Text style={styles.bio_text} numberOfLines={4}> {this.bio}</Text>
                        </View>
                        <View style={styles.foot_container}>
                            <Text style={styles.date_text}>Né(e) le : {this.birthDate}</Text>
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
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        backgroundColor: '#78e1db',
        flex: 1,
    },
    head_container: {
        flex: 5,
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
        flex: 5,
        flexDirection: 'column',
        justifyContent: 'space-evenly',  
        marginLeft: 50,
        marginRight: 30,
        backgroundColor: '#60dbd3',
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
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
        fontSize: 20,
        textAlign: 'left',
        flexWrap: 'wrap'
    },
    date_text: {
        marginTop: 5,
        textAlign: 'left',
        fontSize: 18,
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
    },
    buttonText: {
        fontSize: 15,
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? 'Papyrus' : 'Roboto',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        textAlign: 'center'
    },
    signOutButton: {
        padding: 10,
        backgroundColor: '#ffb4e2',
        width: 110,
        height: 40,
        borderRadius: 30,
        alignSelf: 'flex-end'
    }


});