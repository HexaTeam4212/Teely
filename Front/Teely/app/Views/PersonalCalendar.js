// app/Views/SignUp.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'
import { LocaleConfig } from 'react-native-calendars'

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
    var today = new Date()
    var thisYear = parseInt(today.getFullYear())
    var thisMonth = parseInt(today.getMonth() + 1)
    var thisDay = parseInt(today.getDate())
    if (thisMonth < 10) {
      thisMonth = "0" + thisMonth
    }
    if (thisDay < 10) {
      thisDay = "0" + thisDay
    }
    this.currentDay = thisYear + "-" + thisMonth + "-" + thisDay
    console.log(this.currentDay)
    this.tasks = []
    this.state = { isLoading: false }
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

  getTasks() {
    this.tasks = accountServices.accountTasks()
  }




  render() {
    return (
      <View style={styles.main_container}>
        <Agenda
         items={{
          '2020-04-22': [{name: 'item 1 - any js object'}],
          '2020-04-23': [{name: 'item 2 - any js object', height: 80}],
          '2020-04-24': [],
          '2020-04-25': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
        }}
          loadItemsForMonth={(month) => { console.log('trigger items loading') }}
          onCalendarToggled={(calendarOpened) => { console.log(calendarOpened) }}
          onDayPress={(day) => { console.log('day pressed') }}
          onDayChange={(day) => { }}
          selected={this.currentDay}
          pastScrollRange={50}
          futureScrollRange={50}
          renderKnob={() => {
            return (
              <View style={{ flex: 1, top: Platform.OS == 'ios' ? null : 5, }}>
                <Image
                  source={require('../../assets/Images/down-arrow.png')} style={{ width: 20, height: 20 }}
                />
              </View>
            );
          }}
          // Specify how each item should be rendered in agenda
          renderItem={(item, firstItemInDay) => { return (<View />); }}
          // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
          renderDay={(day, item) => { return (<View />); }}
          renderEmptyData={() => {
            return (
              <View style={styles.content}>
                <Image style={{ height: 150, width: 100 }} source={require('../../assets/Images/cat.png')} />
              </View>
            );
          }}
          hideKnob={false}
          onRefresh={() => console.log('refreshing...')}
          refreshing={false}
          refreshControl={null}
          theme={{
            backgroundColor: '#f1f2f6',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#ffb4e2',
            selectedDayTextSize: 20,
            todayTextColor: '#78e1db',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#ffdb58',
            selectedDotColor: 'green',
            arrowColor: 'orange',
            indicatorColor: 'blue',
            textMonthFontWeight: 'bold',
            textDayFontSize: 17,
            textMonthFontSize: 17,
            agendaDayTextColor: 'yellow',
            agendaDayNumColor: 'black',
            agendaTodayColor: 'red',
            agendaKnobColor: 'blue',
          }}
          style={styles.content_container}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#78e1db',
    flex: 1
  },
  emptyData_container: {
    flex: 1
  },
  content_container: {
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

});