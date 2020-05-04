//app/Services/GeneralServices.js
import moment from 'moment'


class GeneralServices {
    calendarFormatDate(dateString) {
        var date = new Date(dateString); 
        var formattedDate= moment.utc(date).format("YYYY-MM-DD")
        return formattedDate
    }

    formatDate(dateString){
        if (dateString==null) {
            return ""
        }
        var date = new Date(dateString); 
        var formattedDate= moment.utc(date).format("DD/MM/YYYY")
        return formattedDate
    }

    formatTime(dateString) {
        if (dateString==null) {
            return ""
        }
        var date = new Date(dateString); 
        var formattedDate= moment.utc(date).format('HH:mm')
        return formattedDate
    }

    orderTasksByDate(day, tasks) {
        let tasksForDay = []
        const arr = Object.keys(tasks);
        for (let i = 0; i < arr.length; ++i) {
            let task = {...tasks[arr[i]]}
            if (generalServices.calendarFormatDate(task.datetimeStart)==day || generalServices.calendarFormatDate(task.datetimeEnd)==day) {
                tasksForDay.push(task)
            }
        }
        return tasksForDay
    }
}

const generalServices = new GeneralServices()
export default generalServices