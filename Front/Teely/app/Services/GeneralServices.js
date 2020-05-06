//app/Services/GeneralServices.js
import moment from 'moment'


class GeneralServices {
    calendarFormatDate(dateString) {
        var date = new Date(dateString);
        var formattedDate = moment.utc(date).format("YYYY-MM-DD")
        return formattedDate
    }

    formatDate(dateString) {
        if (dateString == null) {
            return ""
        }
        var date = new Date(dateString)
        var formattedDate = moment.utc(date).format("DD/MM/YYYY")
        return formattedDate
    }

    formatTime(dateString) {
        if (dateString == null) {
            return ""
        }
        var date = new Date(dateString)
        var formattedDate = moment.utc(date).format('HH:mm')
        return formattedDate
    }

    formatDateTime(dateString) {
        if (dateString == null) {
            return ""
        }
        var date = new Date(dateString)
        var formattedDate = moment.utc(date).format('DD/MM/YYYY à HH:mm')
        return formattedDate
    }

    orderTasksByDate(day, tasks) {
        let tasksForDay = []
        const arr = Object.keys(tasks);
        for (let i = 0; i < arr.length; ++i) {
            let task = { ...tasks[arr[i]] }
            if (generalServices.calendarFormatDate(task.datetimeStart) == day || generalServices.calendarFormatDate(task.datetimeEnd) == day) {
                tasksForDay.push(task)
            }
        }
        return tasksForDay
    }

    checkPrecedence(startDateString, endDateString) {
        if (startDateString == "" || endDateString == "" || startDateString == endDateString ||
            startDateString == null || endDateString == null) {
            return true
        }
        const startDate = moment.utc(startDateString, 'YYYY-MM-DD HH:mm:ss')
        const endDate = moment.utc(endDateString, 'YYYY-MM-DD HH:mm:ss')
        var isVerified = moment(endDate).isAfter(startDate)
        return isVerified
    }

    convertMinInHour(dateString) {
        if (dateString == null) {
            return ""
        }
        let hour = ((parseInt(dateString, 10)/60)).toString()
        const pos = hour.lastIndexOf(".")
        if(pos!=-1){
            hour = hour.substr(0,pos)
        }
        
        let min = (parseInt(dateString, 10)%60)
    
        if(min<=9){
            min = "0"+min.toString()
        }
        const duree = hour+"h"+min
        return duree
    }
}

const generalServices = new GeneralServices()
export default generalServices