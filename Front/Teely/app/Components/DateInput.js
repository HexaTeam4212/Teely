import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateInput = (props) => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        console.log("current date : " + date);
        sendData(formatDate(currentDate));
    };

    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const sendData = (data) => {
        console.log('data to be sent : ' + data)
        props.parentCallback(data)
        console.log("data sent")
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()-1}`;
    };

    return (
        <View>
            <View style={styles.main_container}>
                <TouchableOpacity style={styles.button} onPress={showDatepicker}>
                    <Text style={styles.buttonText}>Date de naissance </Text>
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

export default DateInput;