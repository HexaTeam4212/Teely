import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

export default class DateTimePickerTester extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDateTimePickerVisible: false
        };
        this.name=this.props.name;
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    formatDate = (date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    handleDatePicked = date => {
        const data = this.formatDate(date)
        this.props.parentCallback(data)
        this.hideDateTimePicker();
        this.name = data;
    };


    render() {
        return (
            <View style={styles.main_container}>
                <TouchableOpacity style={styles.button} onPress={this.showDateTimePicker}>
                    <Text style={styles.buttonText}> {this.name} </Text>
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        
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
