// app/Views/DetailedTask.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RefreshControl, StyleSheet, Text, View, ScrollView, ActivityIndicator, FlatList, Image , TouchableOpacity } from 'react-native'
import accountServices from '../Services/AccountServices'
import groupServices from '../Services/GroupServices'
import ProfileIcon from '../Components/ProfileIcon'
import TextsRow from '../Components/TextsRow'
import ImagesGroup from '../modules/ImageGroup'
import TaskItem from '../Components/TaskItem'
import CustomButton from '../Components/CustomButton'
import generalServices from '../Services/GeneralServices'
import taskServices from '../Services/TaskServices'
import moment from 'moment'
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'

export default class DetailedTask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            idImageProfile: 18,
            idImageGroup: 18,
            groupId:"",
            groupName: "",
            taskName: "",
            taskDescription: "",
            taskUser: "",
            taskDependencies: [],
            datetimeStart: "00-00-0000 à 00:00",
            datetimeEnd: "00-00-0000 à 00:00",
            taskDuration: "",
            taskPrioriy: "",
            groupTasks: [],
            colorPrio: "black",
            isLoading: true,
            refreshing: false
        }
        this.taskId = this.props.route.params.taskId
        this.tabTaskDependencies = []
        this.getDataProfile()
        this.getTaskInfos()
        
        
    }

    componentDidMount() {
        const { navigation } = this.props
        this._unsubscribe = navigation.addListener('focus', () => {
            this.getDataProfile()
            this.getTaskInfos()
        });
      }
    
      componentWillUnmount() {
        this._unsubscribe();
      }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.getDataProfile()
        this.getTaskInfos()
        
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

    checkDataNotNull(data){
        if(data==null){
            data ="Aucune"
        }
        return data
    }

    updateTaskInfos = (data) => {
        console.log("priorité : " + data.priority)
        let priority = "Aucune"
        if (data.priority == 1) {
            //priority = "Basse"
            priority="★"
            this.colorPrio = "green"
        } else if (data.priority == 2) {
            //priority = "Moyenne"
            priority="★★"
            this.colorPrio = "orange"
        } else if (data.priority == 3) {
            //priority = "Haute"
            priority="★★★"
            this.colorPrio = "red"
        }
        this.setState({
            groupId: data.idGroup,taskName: data.name, taskDescription: this.checkDataNotNull(data.description), 
            taskUser: this.checkDataNotNull(data.taskUser),
            taskPriority: priority, datetimeStart: this.displayedFormatDateTime(data.datetimeStart),
            datetimeEnd: this.displayedFormatDateTime(data.datetimeEnd), taskDependencies: data.dependencies,
            taskDuration: this.checkDataNotNull(generalServices.convertMinInHour(data.duration))
            
        })
        this.getGroupInfos()
    }

    getTaskInfos() {
        taskServices.getTaskInfos(this.taskId, this.updateTaskInfos)
    }

    updateGroupInfos = (data) => {
        this.setState({
            groupName: data.group_name, idImageGroup: data.idImageGroup
        });
        this.getGroupTasks()
    }

    getGroupInfos = () => {
        groupServices.getGroupInfos(this.state.groupId, this.updateGroupInfos)
    }

    updateDataProfile = (dataProfile) => {
        this.setState({ idImageProfile: dataProfile.idImage })
    }

    getDataProfile = () => {
        accountServices.dataProfile(this.updateDataProfile, "")
    }

    updateGroupTasks = (data) => {
        this.setState({ groupTasks: data })
        this.findDependentTasks()
    }

    getGroupTasks() {
        groupServices.getGroupTasks(this.state.groupId, this.updateGroupTasks)
    }

    displayedFormatDateTime = (datetime) => {
        if (datetime == null) {
            return "Non défini"
        }
        var formattedDateTime = moment(datetime).format("DD-MM-YYYY") + " à " + moment.utc(datetime).format("HH:mm")
        return formattedDateTime
    }

    findDependentTasks(){
        if(this.state.taskDependencies!=null && this.state.groupTasks.length){
            for (let i = 0; i < this.state.groupTasks.length; i++) {
                if(this.state.taskDependencies.includes(this.state.groupTasks[i].taskId))
                this.tabTaskDependencies.push(this.state.groupTasks[i])
            }
        }

        this.setState({ isLoading: false, refreshing: false})
    }

    displayPossibleDependencies = () => {
        if (this.tabTaskDependencies.length) {
            return (
                <View>
                    <Text style={styles.container_title}> Tâches précédentes : </Text>
                    <ScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        scrollEnabled={true}
                        enableAutomaticScroll={(Platform.OS === 'ios')}
                        enableOnAndroid={true}
                        contentContainerStyle={[styles.taskUser_container, { maxHeight: 300 }]}
                    >
                        <View>
                            <FlatList
                                data={this.tabTaskDependencies}
                                keyExtractor={(item) => item.taskId.toString()}
                                renderItem={({ item }) => this.renderTaskItem(item)}
                            />
                        </View>
                    </ScrollView>
                </View>
            )
        }
    }

    renderTaskItem = (task) => {
            return (
                <View style={styles.task_container}>
                    <View style={styles.leftAligned_container}>
                        <TaskItem task={task} />
                    </View>
                </View>
            );
    }

    render() {
        return (
            <View style={styles.main_container}>
                {backgroundGradientColor()}
                <ProfileIcon idImage={this.state.idImageProfile} />
                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView
                        scrollEnabled={true}
                        enableAutomaticScroll={(Platform.OS === 'ios')}
                        enableOnAndroid={true}
                        keyboardOpeningTime={0}
                        contentContainerStyle={styles.content_container}
                        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                    >
                        <Text style={styles.container_title}> Infos tâche : </Text>
                        <TextsRow name="Nom de la tâche :" name2={this.state.taskName}></TextsRow>
                        <View style={styles.groupLined_container}>
                            <Text style={styles.text}> Groupe : </Text>
                            <Image style={styles.groupPic} source={ImagesGroup[this.state.idImageGroup]} />
                            <Text style={styles.name_text}>{this.state.groupName}</Text>
                        </View>
                        <TextsRow name="Description :" name2={this.state.taskDescription}></TextsRow>
                        <TextsRow name="Personne en charge :" name2={this.state.taskUser}></TextsRow>
                        <TextsRow name="Début :" name2={this.state.datetimeStart}></TextsRow>
                        <TextsRow name="Fin :" name2={this.state.datetimeEnd}></TextsRow>
                        <TextsRow name="Durée :" name2={this.state.taskDuration}></TextsRow>
                        <TextsRow name="Priorité :" name2={this.state.taskPriority} color={this.colorPrio}></TextsRow>
                        {this.displayPossibleDependencies()}
                        <CustomButton name="Modifier" width={180} onPress={() => {
                            this.props.navigation.navigate("EditTask", { groupId: this.state.groupId, taskId: this.taskId })
                        }}>
                        </CustomButton>
                        <View style={{ marginBottom: 100 }}></View>
                    </KeyboardAwareScrollView>
                    {this.displayLoading()}
                </View>
            </View >

        )
    }

}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    content_container: {
        marginTop: 40,
        marginBottom: 10,
        flexDirection: 'column',
    },
    groupLined_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    taskUser_container: {
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
        borderColor: '#ffdb58',
        borderWidth: 2,
        borderRadius: 15,
        alignItems: 'stretch',
        justifyContent: 'space-around'
    },
    task_container: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        margin: 5,
        borderColor: 'white',
        borderBottomWidth: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    leftAligned_container: {
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    centered_container: {
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkedImage_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
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
        resizeMode: 'contain',
        alignItems: 'flex-start',
        width: 70,
        height: 70,
        borderColor: '#ffb4e2',
        borderWidth: 3,
        borderRadius: 60,
        margin: 10
    },
    checkedImage: {
        alignItems: "flex-end",
        height: 20,
        width: 20,
        margin: 5
    },
    name_text: {
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
        fontSize: 17,
        textAlign: 'center',
        color: 'white',
        flexWrap: 'wrap',
        marginRight: 20,
    },
    username_text: {
        fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
        flexWrap: 'wrap',
    },
    container_title: {
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
        fontWeight: 'bold',
        fontSize: 20,
        textDecorationLine: 'underline',
        textAlign: 'center',
        color: 'black',
        marginTop: 20,
        marginBottom: 10
    },
    text: {
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
        color: 'black',
        marginLeft: 20
    },
})




