import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Platform } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment'

export default class DateTimePickerComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDateTimePickerVisible: false,
            mode: this.props.mode,
        };
        this.name = this.props.name
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    displayedFormatDateTime = (datetime) => {
        if (datetime == null) {
            return "Non défini"
        }
        var formattedDateTime = moment(datetime).format("DD-MM-YYYY") + " à " + moment.utc(datetime).format("HH:mm")
        return formattedDateTime
    }
    formatDateTime = (datetime) => {
        var formattedDateTime = moment(datetime).format("YYYY-MM-DD HH:mm:ss")
        return formattedDateTime
    };

    formatDate = (date) => {
        var formattedDate = moment(date).format("YYYY-MM-DD")
        return formattedDate
    };

    displayedFormatDate = (date) => {
        if (date == null) {
            return "Non défini"
        }
        var formattedDate = moment(date).format("DD-MM-YYYY")
        return formattedDate
    };


    
    formatTime = (time) => {
        var formattedTime=moment(time).format("HH:mm")
        return formattedTime
    }


    datePicked = (date) => {
        let data;
        if (this.state.mode == 'date') {
            data = this.displayedFormatDate(date);
        } else if (this.state.mode == 'datetime') {
            data = this.displayedFormatDateTime(date);
        } else if (this.state.mode == 'time') {
            data = date
        } else {
            data = ""
        }
        return data
    }

    handleDatePicked = date => {
        var data = ""
        if (this.state.mode == 'date') {
            data = this.formatDate(date)
        } else if (this.state.mode == 'datetime') {
            data = this.formatDateTime(date)
        } else if (this.state.mode == 'time') {
            data = this.formatTime(date)
        }
        this.props.parentCallback(data)
        this.hideDateTimePicker()
    };


    render() {
        if (this.props.name != "jj-mm-aaaa" && this.props.name != "00-00-0000 à 00:00"
         && this.props.name != "hh:mm") {
            this.name = this.datePicked(this.props.name)
        }
        else {
            this.name = this.props.name
        }
        const marginRight = this.props.marginRight
        const width = this.props.width
        return (
            <View style={styles.main_container}>
                <TouchableOpacity style={[styles.button, { marginRight: marginRight, width: width }]} onPress={this.showDateTimePicker}>
                    <Text style={styles.buttonText}> {this.name} </Text>
                </TouchableOpacity>
                <DateTimePicker
                    mode={this.state.mode}
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
        fontSize: 16,
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
    },
    button: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: "center",
    }
});
