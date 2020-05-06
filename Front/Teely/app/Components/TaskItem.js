// app/Components/TaskItem.js

import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import generalServices from '../Services/GeneralServices'

class TaskItem extends React.Component {
    constructor(props) {
        super(props)
        this.task = this.props.task
    }
    displayTimes() {
        if (this.task.datetimeStart) {
            return(
                <View style={styles.date_container}>
                    <Text style={styles.date_text}>Le {generalServices.formatDate(this.task.datetimeStart)} à {generalServices.formatTime(this.task.datetimeStart)} </Text>
                </View>
            )
        }
    }
    render() {
        
        return (
            <View style={styles.main_container}>
                <View style={styles.name_container}>
                    <Text style={styles.name_text}>{this.task.name}</Text>
                </View>
                {this.displayTimes()}
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        margin: 5,
    },
    name_container: {
        flex: 2
    },
    date_container: {
        flex: 1,
    },
    name_text: {
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Noteworthy' : 'Roboto',
        fontSize: 16,
        textAlign: 'left',
        color: 'white',
        flexWrap: 'wrap',
        textDecorationLine: 'underline'
    },
    date_text: {
        fontSize: 16,
        textAlign: 'right',
        color: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    }
})

export default TaskItem