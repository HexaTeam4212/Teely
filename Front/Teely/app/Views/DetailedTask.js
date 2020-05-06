// app/Components/DetailedTask.js

import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import generalServices from '../Services/GeneralServices'
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'

export default class TaskItem extends React.Component {
    constructor(props) {
        super(props)
        this.state= {
            taskId : this.props.route.params.taskId
        }
        console.log("id : "+ this.state.taskId)
    }
    

    render() {
        return (
            <View style={styles.main_container}>
                {backgroundGradientColor()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
})