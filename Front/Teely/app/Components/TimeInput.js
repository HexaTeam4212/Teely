import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimeInput = (props) => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        console.log("current date : " + date);
        sendData(formatTime(currentDate));
    };

    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    const showTimepicker = () => {
        showMode('time');
      };

    const sendData = (data) => {
        console.log('data to be sent : ' + data)
        props.parentCallback(data)
        console.log("data sent")
    };

    const formatTime= (date) => {
        return `${date.getHours()-2}:${date.getMinutes() }`;
    };

    return (
        <View>
            <View style={styles.main_container}>
                <TouchableOpacity style={styles.button} onPress={showTimepicker}>
                    <Text style={styles.buttonText}>Horaire </Text>
                </TouchableOpacity>
            </View>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={date}
                    mode={mode}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};



const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop:20
    },
    buttonText: {
        fontSize: 20,
        color: 'black',
        fontFamily: 'Cochin'
    },

    button: {
        padding: 10,
        backgroundColor: 'white',
        height: 40,
        width: 200,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: "center",
    }
});

export default TimeInput;