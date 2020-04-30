// app/Views/SignUp.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'
import { Agenda, LocaleConfig } from 'react-native-calendars'
import moment from "moment"
import accountServices from '../Services/AccountServices'


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
    this.state = { currentDate: moment(new Date()).format("YYYY-MM-DD"),
       isLoading: false, tasks: [] }
    this.getTasks()
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
    //this.setState({tasks: accountServices.accountTasks()})
  }

  getSelectedDayTasks = (date) => {

    let taskDate = moment(date);
    taskDate = taskDate.format("DD/MM/YYYY");


    //const data = { username : CLIENT_ID, ServiceDate : taskDate };

    //returned result with fetch api
    /*requestData(PROVIDER_URL + SERVICES_FOR_DATE_URL, data).then((result) => {
        console.log(result);*/
        const task1 = { id: 320, name: 'Ménage', description: 'nettoyer salle de bain', startingTime: '11:20' }
        const task2 = { id: 253, name: 'Promener Pooky', description: 'aller au parc avec Pooky', startingTime: '15:00' }
       
        //if (result.status == "Successful") {
            let resultData=[task1, task2]
            if (resultData != "") {
                //changing the received result object so that calendar can view the event on selected date
                let modifiedData = { [date] : resultData };
                this.setState({tasks:modifiedData});
                console.log(modifiedData);
                //to change the month and year on top of agenda
                //setDate(moment(date).format("MMMM YYYY"));
            }
            else {
                let modifiedData = { [date] : resultData };
                this.setState({tasks:modifiedData});
            }
        //}
        /*else {
            Toast.show(result.message ? result.message : result, Toast.SHORT);
        }

    })
    .catch((error) => {
        console.log(error);
    });*/
}


  renderItem = (item) => {
    return (
      <View style={styles.task_container}>
        <Text >{item.name}</Text>
        <Text >{item.startingTime}</Text>
      </View>
    );
  }

  renderEmptyData = () => {
    return (
      <View style={styles.emptyTask_container}>
        <Image
          source={require('../../assets/Images/cat.png')} style={{ height: 400, width: 275 }} />
        <Text style={styles.emptyTask_text}>Rien à signaler pour le moment.. </Text>
      </View>
    );
  }


  render() {
    return (
      <View style={styles.main_container}>
        <Agenda
          items={{
            '2020-04-26': [{ name: 'ménage', startingTime: '11:10' }],
            '2020-04-27': [{ name: 'promener le chien', startingTime: '15:00' }],
            '2020-04-28': [{ name: 'item 3 - any js object' }, { name: 'any js object' }]
          }}
          loadItemsForMonth={(month) => {
                    let currentDate = moment();
                    currentDate = currentDate.format("YYYY-MM-DD");
                    if (currentDate == month.dateString) {
                        this.getSelectedDayTasks(month.dateString);
                    }
                    console.log(currentDate);
                    console.log("trigger loading items");
                }
            }
          onCalendarToggled={(calendarOpened) => { console.log(calendarOpened) }}
          onDayPress={(day) => { console.log('day pressed') }}
          onDayChange={(day) => { }}
          selected={this.state.currentDate}
          pastScrollRange={50}
          futureScrollRange={50}
          renderKnob={() => {
            return (
              <View style={{ flex: 1, top: Platform.OS == 'ios' ? null : 5, }}>
                <Image
                  source={require('../../assets/Images/down-arrow.png')} style={{ width: 20, height: 20}}
                />
              </View>
            );
          }}
          // Specify how each item should be rendered in agenda
          renderItem={this.renderItem}
          // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
          renderDay={(day, item) => {
            return ();
          }}
          renderEmptyData={this.renderEmptyData}
          hideKnob={false}
          onRefresh={() => console.log('refreshing...')}
          refreshing={false}
          refreshControl={null}
          theme={{
            backgroundColor: '#78e1db',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#ffb4e2',
            selectedDayTextSize: 20,
            selectedDayTextColor: 'white',
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
            agendaDayTextColor: 'black',
            agendaDayNumColor: 'black',
            agendaTodayColor: '#ffb4e2',
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
  emptyTask_container: {
    backgroundColor: '#78e1db',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  task_container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  content_container: {
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
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

});