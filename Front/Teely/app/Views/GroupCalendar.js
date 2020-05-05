// app/Views/GroupCalendar.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator, RefreshControl } from 'react-native'
import { Agenda, LocaleConfig } from 'react-native-calendars'
import moment from "moment"
import groupServices from '../Services/GroupServices'
import generalServices from '../Services/GeneralServices'


LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.']
}

LocaleConfig.defaultLocale = 'fr';
export default class GroupCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.groupId = ""
    this.tasks = {}
    this.state = {
      selectedDate: moment(new Date()).format("YYYY-MM-DD"),
      isLoading: true,
      refreshing: false,
      currentTasksLists: {}
    }
    this.getGroupId()
    this.getAllTasks()
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.getGroupId()
    this.getAllTasks()
  }
  
  getAllTasks() {
    groupServices.getGroupTasks(this.groupId, this.updateTasksLists)
  }

  getGroupId() {
    let params = this.props.route.params
    this.groupId = params.idGroup
  }

  displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator color='#ffb4e2' size='large' />
        </View>
      )
    }
  }



  renderKnob = () => {
    return (
      <View style={{ flex: 1, top: Platform.OS == 'ios' ? null : 5, }}>
        <Image
          source={require('../../assets/Images/down-arrow.png')} style={{ width: 20, height: 20 }}
        />
      </View>
    );
  }

  loadItems = (day) => {
    this.setState({ selectedDate: day })
    if (!day)
      return;
    let begin = moment(day.dateString).startOf('month')
    let end = moment(day.dateString).endOf('month')
    while (begin.isSameOrBefore(end)) {
      const currentDay = begin.format('YYYY-MM-DD')
      let value = generalServices.orderTasksByDate(currentDay, this.state.currentTasksLists)
      if (value.length) {
        this.tasks[currentDay] = Array.isArray(value) ? [...value] : []
      }
      begin.add(1, 'days')
    }

  }

  updateTasksLists = (data) => {
    this.setState({ currentTasksLists: data, isLoading: false, refreshing:false})
    this.loadItems(this.state.selectedDate)
  }


  renderItem = (item) => {
    return (
      <View style={styles.task_container}>
        <View><Text style={styles.time_text}>{generalServices.formatTime(item.datetimeStart)}</Text></View>
        <View><Text style={styles.name_text}>{item.name}</Text></View>
        <View><Text style={styles.description_text}>{item.description}</Text></View>
        <View><Text style={styles.time_text}>{generalServices.formatTime(item.datetimeEnd)}</Text></View>
        {this.renderTaskedUsers(item.taskUser)}
      </View>

    );
  }

  renderTaskedUsers = (usersList) => {
    if (usersList.length) {
      return (
        <View style={styles.taskedUsers_container}>
          <Text style={styles.taskedUser_text}>Par : {usersList.toString()} </Text>
        </View>
      );
    }
    else {
      return (
        <View style={styles.taskedUsers_container}>
          <Text style={styles.taskedUser_text}>Non assignée </Text>

        </View>
      );
    }
  }

  renderEmptyData = () => {
    return (
      <View style={styles.emptyTask_container}>
        <Image
          source={require('../../assets/Images/cat.png')} style={{ height: 400, width: 275 }} />
        <Text style={styles.emptyTask_text}>Rien à signaler pour le moment... </Text>
      </View>
    );
  }


  render() {
    return (
      <View style={styles.main_container}>
        <View style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
            enableOnAndroid={true}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
          >
            <Agenda
              items={this.tasks}
              loadItemsForMonth={this.loadItems}
              selected={this.state.selectedDate}
              pastScrollRange={50}
              futureScrollRange={50}
              renderKnob={this.renderKnob}
              renderItem={this.renderItem}
              renderEmptyData={this.renderEmptyData}
              hideKnob={false}
              onRefresh={() => console.log('refreshing...')}
              refreshing={false}
              refreshControl={null}
              theme={{
                backgroundColor: '#78e1db',
                calendarBackground: 'white',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#ffb4e2',
                selectedDayTextSize: 20,
                selectedDayTextColor: 'white',
                todayTextColor: '#78e1db',
                dayTextColor: '#2d4150',
                dayTextFontSize: 30,
                dayBackgroundColor: 'white',
                textDisabledColor: '#d9e1e8',
                dotColor: '#ffdb58',
                selectedDotColor: 'white',
                arrowColor: 'orange',
                indicatorColor: 'blue',
                textMonthFontWeight: 'bold',
                textDayFontSize: 17,
                textMonthFontSize: 17,

                agendaDayTextColor: 'black',
                agendaDayTextFontSize: 40,
                agendaDayNumColor: 'black',
                agendaTodayColor: 'white',
              }}
              style={styles.content_container}
            />
          </KeyboardAwareScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#78e1db',
    flex: 1
  },
  emptyTask_container: {
    backgroundColor: '#78e1db',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  task_container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  content_container: {
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
  },
  taskedUsers_container: {
    marginTop: 5,
    borderColor: '#ffdb58',
    borderTopWidth: 2
  },
  emptyTask_text: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontSize: 24,
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  name_text: {
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Noteworthy' : 'Roboto',
    fontSize: 18,
    textAlign: 'center',
    color: '#2d4150',
    flexWrap: 'wrap',
    marginBottom: 5
  },
  description_text: {
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'Roboto',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#2d4150',
    flexWrap: 'wrap',
    marginBottom: 5
  },
  time_text: {
    fontSize: 14,
    textAlign: 'left',
    color: 'grey',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
  },
  taskedUser_text: {
    fontSize: 17,
    textAlign: 'left',
    color: '#2d4150',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
  }

});