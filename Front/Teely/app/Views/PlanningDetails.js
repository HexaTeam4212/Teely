// app/Views/PlanningDetails.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import DateTimePicker from '../Components/DateTimePicker'

import CustomButton from '../Components/CustomButton'
import groupServices from '../Services/GroupServices'
import generalServices from '../Services/GeneralServices'


export default class PlanningDetails extends React.Component {
    constructor(props) {
        super(props)
        this.groupId = this.props.route.params.idGroup
        this.state = {
            startInput: "hh:mm",
            endInput: "hh:mm",
            modifiedTasks: [],
            displayedResult: false,
            isLoading: false,
            refreshing: false,
        }
    }

    /*onRefresh = () => {
        this.setState({ refreshing: true })
        this.setState({
            startInput: "hh:mm", endInput: "hh:mm", displayedResult: false,
            refreshing: false, modifiedTasks: []
        })
    }*/

    displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator color='#ffb4e2' size='large' />
                </View>
            )
        }
    }

    callbackFunctionStartInput = (childData) => {
        this.setState({ startInput: childData })
        console.log("child data start " + childData)
        console.log("startInput : " + this.state.startInput)
    }

    callbackFunctionEndInput = (childData) => {
        this.setState({ endInput: childData })
        console.log("child data end " + childData)
        console.log("endInput : " + this.state.endInput)
    }

    displayModifiedTasks(tasks) {
        if (this.state.displayedResult) {
        //return (
        //     <View>
        //         <Text style={styles.container_title}> Tâches modifiées : </Text>
        //         <FlatList
        //             data={this.state.modifiedTasks}
        //             keyExtractor={(item) => item.toString()}
        //             renderItem={({ item }) => <TaskItemFromId task={item} />}
        //         />
        //     </View>

        //)
        }
    }

    getResult = (result, data) => {
        if (result == true) {
            this.setState({ modifiedTasks: data, displayedResult: true })
        }
        this.setState({ isLoading: false })


    }

    orderTasks = () => {
        this.setState({ isLoading: true })
        var startHour 
        var startMinute 
        var endHour 
        var endMinute 
        if (this.state.startInput == "hh:mm") {
            startHour = 0
            startMinute = 0
        } else {
            var elts = this.state.startInput.split(":")
            startHour= elts[0]
            startMinute= elts[1]
        }
        if (this.state.endInput == "hh:mm") {
            endHour = 23
            endMinute = 59
        } else {
            var elts = this.state.endInput.split(":")
            endHour= elts[0]
            endMinute= elts[1]
        }
        console.log(startHour + ':' + startMinute + ' ' + endHour + ':' + endMinute)
        groupServices.orderTaks(this.groupId, startHour, startMinute, endHour, endMinute, this.getResult)
    }

    render() {
        return (
            <View style={styles.main_container}>
                <KeyboardAwareScrollView contentContainerStyle={styles.content_container}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={true}
                    enableAutomaticScroll={(Platform.OS === 'ios')}
                    enableOnAndroid={true}>
                    <View style={styles.groupLined_container}>
                        <View style={styles.centered_container}>
                            <Text style={styles.text}> Heure de début au plus tôt : </Text>
                        </View>
                        <View style={styles.rightAligned_container}>
                            <DateTimePicker mode='time' width={160} name={this.state.startInput} parentCallback={this.callbackFunctionStartInput} />
                        </View>
                    </View>
                    <View style={styles.groupLined_container}>
                        <View style={styles.centered_container}>
                            <Text style={styles.text}> Heure de fin au plus tard : </Text>
                        </View>
                        <View style={styles.rightAligned_container}>
                            <DateTimePicker mode='time' width={160} name={this.state.endInput} parentCallback={this.callbackFunctionEndInput} />
                        </View>
                    </View>
                    <View style={styles.groupLined_container}>
                        <CustomButton name="Lancer" width={170} onPress={this.orderTasks}>
                        </CustomButton>
                    </View>
                </KeyboardAwareScrollView>
                {this.displayLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#ffb4e2'
    },
    content_container: {
        flex: 1,
        margin: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch'
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
    groupLined_container: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centered_container: {
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightAligned_container: {
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    leftAligned_container: {
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    text: {
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
        color: 'black',
        marginRight: 10
    },
});