// app/Components/TaskItem.js

import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

class TaskItem extends React.Component {
    render() {
        const task = this.props.task
        return (
            <View style={styles.main_container}>
                <View style={styles.name_container}>
                    <Text style={styles.name_text}>{task.name}</Text>
                </View>
                <View style={styles.date_container}>
                    <Text style={styles.date_text}>Le {task.dueDate} à {task.startingTime}</Text>
                </View>
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
        fontSize: 14,
        textAlign: 'right',
        color: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    }
})

export default TaskItem