// app/Views/PersonalCalendar.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import { Agenda, LocaleConfig } from 'react-native-calendars'
import moment from "moment"

import accountServices from '../Services/AccountServices'
import generalServices from '../Services/GeneralServices'
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.']
}

LocaleConfig.defaultLocale = 'fr';
export default class PersonalCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.tasks = {}
    this.state = {
      selectedDate: moment(new Date()).format("YYYY-MM-DD"),
      isLoading: true,
      refreshing: false,
      currentTasksLists: {}
    }

    this.getAllTasks()
  }

  componentDidMount() {
    const { navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      this.getAllTasks()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.getAllTasks()
  }

  getAllTasks() {
    accountServices.accountAllTasks(this.updateTasksLists)
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
    this.setState({ currentTasksLists: data, isLoading: false, refreshing: false })
    this.loadItems(this.state.selectedDate)
  }

  displayStart = (item) => {
  }
  
  renderItem = (item) => {
    return (
      <View style={styles.task_container}>
        <TouchableOpacity onPress={() => {this.props.navigation.navigate("EditTask", { taskId: item.taskId, groupId: 1 })}}>
          <View><Text style={styles.time_text}> {generalServices.formatDateTime(item.datetimeStart)}</Text></View>
          <View><Text style={styles.name_text}>{item.name}</Text></View>
          <View><Text style={styles.description_text}>{item.description}</Text></View>
          <View><Text style={styles.time_text}>{generalServices.formatDateTime(item.datetimeEnd)}</Text></View>
        </TouchableOpacity>
      </View>
    );
  }

  renderEmptyData = () => {
    return (
      <View style={styles.emptyTask_container}>
        {backgroundGradientColor()}
        <Image
          source={require('../../assets/Images/cat.png')} style={{ height: 400, width: 275 }} />
        <Text style={styles.emptyTask_text}>Rien à signaler pour le moment... </Text>
      </View>
    );
  }


  render() {
    return (
      <View style={styles.main_container}>
        {backgroundGradientColor()}
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
        {this.displayLoading()}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  emptyTask_container: {
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
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyTask_text: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'lightblue',
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
  }

});
