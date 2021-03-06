// app/Components/GroupTaskItem.js

import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import generalServices from '../Services/GeneralServices'
import { TouchableOpacity } from 'react-native-gesture-handler'

class GroupTaskItem extends React.Component {
    constructor(props) {
        super(props);
        this.task = this.props.task
    }

    clickLoupe() {
        this.props.parentCallbackLoupe(this.task)
    }

    clickDelete() {
        this.props.parentCallbackDelete(this.task)
    }

    displayTimes() {
        if (this.task.datetimeStart) {
            return(
                <Text style={styles.date_text}>Le {generalServices.formatDate(this.task.datetimeStart)} à {generalServices.formatTime(this.task.datetimeStart)} </Text>
                
            )
        }   
    }

    displayDuration(){
        if(this.task.duration){
            return(
                <Text style={styles.date_text}>Durée : {generalServices.convertMinInHour(this.task.duration)}</Text>
            )
        }
    }
    
    render() {
        this.task = this.props.task
        let pers = this.task.taskUser
        if(pers=="" || pers==null){
            pers = "Non défini"
        }
        return (
            <View style={styles.main_container}>
                <View style={styles.left_container}>
                    <View style={styles.name_container}>
                        <Text style={styles.name_text}>{this.task.name}</Text>
                    </View>
                    <View style={styles.date_container}>
                    {this.displayTimes()}
                    {this.displayDuration()}
                    </View>
                    <View style={styles.pers_container}>
                        <Text style={styles.date_text}>Par : {pers} </Text>
                    </View>
                </View>
                <View style={styles.right_container}>
                    <TouchableOpacity onPress={() => this.clickLoupe()}>
                        <Image style={{ height: 40, width: 40 }} source={require('../../assets/Images/loupe.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.clickDelete()}>
                        <Image style={{ height: 35, width: 35 }} source={require('../../assets/Images/cross.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'row',
        marginTop:5,
        marginBottom:5,
        marginRight:5,
        marginLeft:10,

    },
    left_container: {
        flex: 3,
        marginRight:5,
    },
    right_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name_container: {
        flex: 2
    },
    date_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight:3,

    },
    pers_container: {
        flex: 1,
        alignItems: 'flex-start'
    },
    name_text: {
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Noteworthy' : 'Roboto',
        fontSize: 16,
        textAlign: 'left',
        flexWrap: 'wrap',
        textDecorationLine: 'underline'
    },
    date_text: {
        fontSize: 16,
        textAlign: 'right',
        fontWeight: 'bold',
        color: '#03ACAC',
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    }
})

export default GroupTaskItem