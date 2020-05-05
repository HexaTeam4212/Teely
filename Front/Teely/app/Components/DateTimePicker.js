import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Platform } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

export default class DateTimePickerTester extends Component {
    constructor(props) {
        super(props);
        this.name = this.props.name
        this.state = {
            isDateTimePickerVisible: false,
            name : this.props.name
        };
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
        //this.setState({name : data});
        this.name = data
    };


    render() {
        this.name=this.props.name;
        const marginRight = this.props.marginRight
        return (
            <View style={styles.main_container}>
                <TouchableOpacity style={[styles.button, {marginRight:marginRight}]} onPress={this.showDateTimePicker}>
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
        fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    },

    button: {
        backgroundColor: 'white',
        height: 40,
        width: 200,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: "center",
    }
});
