from flask import Flask, request, jsonify, session
from flask_cors import CORS
from peewee import *
import jwt
import json
import datetime
from configparser import ConfigParser
from init_database import PERSON, PARTICIPATE_IN, TASK, GROUP, INVITATION, DEPENDANCE
from wrapper import sendError, authenticate
from algoBack import order_tasks
app = Flask(__name__)

CORS(app) ## allow CORS for all domains on all routes (to change later)

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


config_object = ConfigParser()
config_object.read("config.ini")
database_config = config_object["DATABASE_INFO"]
mysql_db = MySQLDatabase(database_config["name"], user=database_config["user"], password=database_config["password"], host=database_config["host"], port=int(database_config["port"]))

# Account endpoints

@app.route('/account/inscription', methods=['POST'])
def account_inscription():
    content = request.get_json()
    code = 201
    reponse_body = {}

    try:
        newUser = PERSON(Username = content['username'], Email = content['email'], Password = content['password'], LastName = content['lastName'], Name = content['name'], BirthDate = content['birthdate'], idImage = content["idImage"])
    except:
        return sendError(400, "Bad Request: Make sure to send all parameters !")

    try:
        newUser.save()
    except:
        return sendError(409, "Conflict: This username or email already exist in database !")

    return jsonify(reponse_body), code

@app.route('/account/login',  methods=['POST'])
def account_login():
    content = request.get_json()
    code = 200
    reponse_body = {}

    try:
        username = content["username"]
        password = content["password"]
    except:
        return sendError(400, "Bad Request: Make sure to send all parameters !")

    try:
        user = PERSON.get(PERSON.Username == username)
    except:
        return sendError(404, "This user doesn't exit !")

    if user.Password != password:
        return sendError(401, "The password is incorrect !")
    else:
        key = 'not_so_secret_key'
        userId = user.personId
        jwt_payload = {
            'userId' : userId,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2) #token expires after 2 hours
        }
        JWTtoken = jwt.encode(jwt_payload, key).decode('utf-8')
        reponse_body = {
            "authToken": JWTtoken
        }
        session['userId'] = userId

    return jsonify(reponse_body), code

@app.route('/account/logout',  methods=['GET'])
@authenticate
def account_logout():

    session.pop('userId', None)

    return jsonify({}), 204

@app.route('/account/update',  methods=['PUT'])
@authenticate
def account_update():
    content = request.get_json()
    code = 204
    reponse_body = {}

    try:
        user = PERSON.get(PERSON.personId == session['userId'])

        if user.Password == content["current_password"]:
            if "username" in content:
                if content["username"] != "":
                    #Test if username is already taken
                    try:
                        #This throw an error if there is no user found with this username
                        u = PERSON.get(PERSON.Username == content["username"])
                        if u.Username != user.Username:
                            return sendError(409, "Username already taken !")
                    except:
                        pass
                    user.Username = content["username"]
            if "email" in content:
                if content["email"] != "":
                    #Test if email is already taken
                    try:
                        #This throw an error if there is no user found with this email
                        u = PERSON.get(PERSON.Email == content["email"])
                        if u.Email != user.Email:
                            return sendError(409, "Email already taken !")
                    except:
                        pass
                    user.Email = content["email"]
            if "password" in content:
                if content["password"] != "":
                    user.Password = content["password"]
            if "lastName" in content:
                if content["lastName"] != "":
                    user.LastName = content["lastName"]
            if "name" in content:
                if content["name"] != "":
                    user.Name = content["name"]
            if "birthdate" in content:
                if content["birthdate"] != "":
                    user.BirthDate = content["birthdate"]
            if "bio" in content:
                if content["bio"] != "":
                    user.Bio = content["bio"]
            user.save()
        else:
            return sendError(403, "Password mismatch, you are not allowed to modify the profil !")
    except:
        return sendError(400, "Bad Request: Make sure to send all parameters !")

    return jsonify(reponse_body), code

@app.route('/account/info',  methods=['GET'])
@authenticate
def account_info():

    user = PERSON.get(PERSON.personId == session['userId'])
    username = user.Username
    if request.args.get('username') is not None:
        username = request.args.get('username')

    try:
        user = PERSON.get(PERSON.Username == username)
    except:
        return sendError(404, "User not found !")

    groupsParticipating = PARTICIPATE_IN.select().where(PARTICIPATE_IN.User == user.personId)
    groupIds = []

    for groupP in groupsParticipating:
        groupIds.append(groupP.Group.groupId)

    reponse_body = {
        "username": user.Username,
        "email": user.Email,
        "birthDate": user.BirthDate,
        "lastName": user.LastName,
        "name": user.Name,
        "bio": user.Bio,
        "idImage": user.idImage,
        "groupIds": groupIds
    }

    return jsonify(reponse_body), 200

@app.route('/account/invitation', methods=['GET'])
@authenticate
def account_invitation():

    user = PERSON.select().where(PERSON.personId == session["userId"])
    invitations = INVITATION.select().where(INVITATION.Recipient == user)

    invitData = []

    for invit in invitations:
        data = {
            "invitationId": invit.invitationId,
            "sender": invit.Sender.Username,
            "group": invit.Group.Name,
            "groupId": invit.Group.groupId,
            "idImageGroup": invit.Group.idImage
        }
        invitData.append(data)

    reponse_body = {
        "invitations" : invitData
    }

    return jsonify(reponse_body), 200

@app.route('/account',  methods=['GET'])
@authenticate
def account_list():
    try:
        username = request.args.get('username')
    except:
        username = ""

    users_rep = PERSON.select().where(PERSON.Username.startswith(username))
    users_list = []
    for user in users_rep:
        users_list.append(user.Username)

    reponse_body = {
        "users": users_list
    }

    return jsonify(reponse_body), 200

@app.route('/account/task/all',  methods=['GET'])
@authenticate
def account_all_tasks_for_user():

    user = PERSON.get(PERSON.personId == session["userId"])
    tasks_rep = TASK.select().where(TASK.TaskUser == user).order_by(TASK.DatetimeStart)
    tasks_list = []

    for task in tasks_rep:
        dependenciesIds=[]
        dependencies = DEPENDANCE.select().where( DEPENDANCE.TaskConcerned == task)
        for dep in dependencies :
            dependenciesIds.append(dep.TaskConcerned.taskId)

        data = {
            "taskId": task.taskId,
            "name": task.Name,
            "description": task.Description,
            "taskUser": task.TaskUser.Username,
            "frequency": task.Frequency,
            "priority": task.PriorityLevel,
            "datetimeStart" : task.DatetimeStart,
            "datetimeEnd": task.DatetimeEnd,
            "dependencies" : dependenciesIds,
            "duration" : task.Duration
        }

        tasks_list.append(data)

    reponse_body = {
        "tasks": tasks_list
    }

    return jsonify(reponse_body), 200

@app.route('/account/task/upcoming',  methods=['GET'])
@authenticate
def account_upcoming_tasks_for_user():

    user = PERSON.get(PERSON.personId == session["userId"])
    current_date = datetime.datetime.now()
    tasks_rep = TASK.select().where(TASK.TaskUser == user, TASK.DatetimeStart > current_date).order_by(TASK.DatetimeStart)

    tasks_list = []

    for task in tasks_rep:
        dependenciesIds=[]
        dependencies = DEPENDANCE.select().where( DEPENDANCE.TaskConcerned == task)
        for dep in dependencies :
            dependenciesIds.append(dep.TaskConcerned.taskId)

        data = {
            "taskId": task.taskId,
            "name": task.Name,
            "description": task.Description,
            "taskUser": task.TaskUser.Username,
            "frequency": task.Frequency,
            "priority": task.PriorityLevel,
            "datetimeStart" : task.DatetimeStart,
            "datetimeEnd": task.DatetimeEnd,
            "dependencies" : dependenciesIds,
            "duration" : task.Duration
        }

        tasks_list.append(data)

    reponse_body = {
        "tasks": tasks_list
    }

    return jsonify(reponse_body), 200

# Group endpoints

@app.route('/group', methods=['GET', 'POST'])
@authenticate
def group():
    reponse_body = {}
    if request.method == 'POST':
        content = request.get_json()
        code = 204
        user = PERSON.get(PERSON.personId == session['userId'])
        try:
            newGroup = GROUP(Name = content['group_name'], Description = content['description'], idImage=content['idImageGroup'])
        except:
            return sendError(400, "Make sure to send all the parameters")

        try:
           newGroup.save()
        except:
            return sendError(409, "This group couldn't be added to the database !")

        if 'guests' in content:
            for username in content['guests'] :
                recipient = PERSON.get(PERSON.Username == username)
                INVITATION.insert(Sender_id=user.personId ,Recipient_id=recipient.personId,Group_id=newGroup.groupId).execute()

        PARTICIPATE_IN.insert(User_id=user.personId,Group_id=newGroup.groupId).execute()
        return jsonify(reponse_body), code
    elif request.method == 'GET':
        user = PERSON.get(PERSON.personId == session['userId'])
        rep = PARTICIPATE_IN.select().where(PARTICIPATE_IN.User_id == user.personId)

        groupsData = []

        for participate_in in rep:
            data = {
                    "groupId":participate_in.Group_id,
                    "group_name": participate_in.Group.Name,
                    "idImageGroup": participate_in.Group.idImage
                }
            groupsData.append(data)
        reponse_body = {
            "groups" : groupsData
        }
        return jsonify(reponse_body), 200

@app.route('/group/<id_group>', methods=['GET'])
@authenticate
def get_group(id_group):
    code= 200
    group = GROUP.get(GROUP.groupId == id_group)
    rep = PARTICIPATE_IN.select().where(PARTICIPATE_IN.Group_id == id_group)
    res = ()
    for participate_in in rep:
        member = PERSON.get(PERSON.personId == participate_in.User_id)
        res += str(member.Username) ,
    response_body = {
        "id": group.groupId,
        "group_name": group.Name,
        "description": group.Description,
        "members": res,
        "idImageGroup": group.idImage
    }
    return json.dumps(response_body),code

@app.route('/group/<id_group>/update',  methods=['PUT'])
@authenticate
def group_update(id_group):
    content = request.get_json()
    code = 204
    reponse_body = {}

    try:
        group = GROUP.get(GROUP.groupId == id_group)
        group.Name = content["group_name"]
        group.Description = content["description"]
        group.save()
    except:
        return sendError(400, "Bad Request: Make sure to send all parameters !")

    return jsonify(reponse_body), code

@app.route('/group/<id_group>/invite', methods=['DELETE'])
def delete_invite(id_group):
    reponse_body = {}
    user = PERSON.get(PERSON.personId == session['userId'])
    code = 204
    rep = INVITATION.select().where( (INVITATION.Group_id == id_group) & (INVITATION.Recipient_id == user.personId) )
    for invitation in rep :
        INVITATION.delete().where(INVITATION.invitationId == invitation).execute()
    return jsonify(reponse_body), code


@app.route('/group/<id_group>/invite', methods=['GET'])
@authenticate
def create_invite(id_group):
    reponse_body = {}
    user = PERSON.get(PERSON.personId == session['userId'])
    code = 204
    rep = PERSON.select().where(PERSON.Username == request.args.get('username'))
    for guest in rep:
        resultat = INVITATION.select().where( (INVITATION.Recipient_id == guest.personId) & (INVITATION.Group_id == id_group) )
        for invitation in resultat :
            code = 409
            reponse_body = {
                "error": "Conflict: The request could not be completed due to conflict. User may have already been invited."
            }
            return jsonify(reponse_body), code
        resultat = PARTICIPATE_IN.select().where( (PARTICIPATE_IN.User_id == guest.personId) & (PARTICIPATE_IN.Group_id == id_group) )
        for participant in resultat :
            code = 409
            reponse_body = {
                "error": "Conflict: The request could not be completed due to conflict. User is already in the group."
            }
            return jsonify(reponse_body), code
        INVITATION.insert(Sender_id=user.personId ,Recipient_id=guest.personId ,Group_id=id_group).execute()
    return jsonify(reponse_body), code

@app.route('/group/<id_group>/accept', methods=['GET'])
@authenticate
def accept_invite(id_group):
    rep = INVITATION.select().where(INVITATION.invitationId == request.args.get('invite_id'))
    for invitation in rep :
        PARTICIPATE_IN.insert(User_id=invitation.Recipient_id , Group_id=invitation.Group_id).execute()
    INVITATION.delete().where(INVITATION.invitationId == request.args.get('invite_id')).execute()

    return jsonify({}), 204

@app.route('/group/<id_group>/quit', methods=['GET'])
@authenticate
def quit_group(id_group):
    user = PERSON.get(PERSON.personId == session['userId'])
    PARTICIPATE_IN.delete().where( (PARTICIPATE_IN.User_id == user.personId) & (PARTICIPATE_IN.Group_id == id_group) ).execute()

    return jsonify({}), 204

@app.route('/group/<id_group>/task/all', methods=['GET'])
@authenticate
def group_task_all(id_group):
    user = PERSON.get(PERSON.personId == session["userId"])

    try:
        group = GROUP.get(GROUP.groupId == id_group)
    except:
        return sendError(404, "Group not found !")

    tasks = TASK.select().where(TASK.Group == group).order_by(TASK.DatetimeStart)
    taskData = []

    for task in tasks:

        dependencies = DEPENDANCE.select().where(DEPENDANCE.TaskConcerned.taskId == task.taskId)
        dependenciesIds=[]

        try :
            for dep in dependencies :
                dependenciesIds.append(dep.taskConcerned)
        except :
            dependenciesIds.append("")

        if task.TaskUser is None:
            taskUserUsername = None
        else:
            taskUserUsername = task.TaskUser.Username


        data = {
            "taskId": task.taskId,
            "name": task.Name,
            "frequency": task.Frequency,
            "taskUser": taskUserUsername,
            "priority": task.PriorityLevel,
            "datetimeStart" : task.DatetimeStart,
            "datetimeEnd": task.DatetimeEnd,
            "dependencies" : dependenciesIds,
            "duration" : task.Duration
        }
        taskData.append(data)

    response_body = {
        "tasks" : taskData
    }

    return jsonify(response_body),200

@app.route('/task/<id_task>', methods=['GET'])
@authenticate
def group_task_id(id_task):

    user = PERSON.get(PERSON.personId == session["userId"])
    try:
        task = TASK.get(TASK.taskId == id_task)
    except:
        return sendError(404, "Task not found !")

    dependenciesIds=[]
    dependencies = DEPENDANCE.select().where( DEPENDANCE.TaskConcerned == task)
    try :
        for dep in dependencies :
            dependenciesIds.append(dep.TaskDependency.taskId)
    except :
        dependenciesIds.append("")

    if task.TaskUser is None:
        taskUserUsername = None
    else:
        taskUserUsername = task.TaskUser.Username


    data = {
        "idGroup" : task.Group.groupId,
        "taskId": task.taskId,
        "name": task.Name,
        "description": task.Description,
        "taskUser": taskUserUsername,
        "frequency": task.Frequency,
        "priority": task.PriorityLevel,
        "datetimeStart" : task.DatetimeStart,
        "datetimeEnd": task.DatetimeEnd,
        "dependencies" : dependenciesIds,
        "duration" : task.Duration
    }

    reponse_body = {"task" : data}

    return jsonify(reponse_body),200

@app.route('/group/<id_group>/task', methods=['POST'])
@authenticate
def group_task(id_group):
    user = PERSON.get(PERSON.personId == session["userId"])
    content = request.get_json()

    try:
        group = GROUP.get(GROUP.groupId == id_group)
    except:
        return sendError(404, "Group not found !")

    try :
        if "datetimeStart" in content and "datetimeEnd" in content and content["datetimeStart"] != "" and content["datetimeEnd"] != "":
            startTime = datetime.datetime.strptime(content["datetimeStart"], "%Y-%m-%d %H:%M:%S")
            endTime = datetime.datetime.strptime(content["datetimeEnd"], "%Y-%m-%d %H:%M:%S")
            diff = endTime - startTime
            duration = diff.seconds / 60
        else:
            duration = content['duration']

        newTask = TASK(Description = content['description'], Frequency=content['frequency'], Group=group, PriorityLevel=content['priorityLevel'], Name=content["name"],  Duration=duration)
    except:
        return sendError(400, "Make sure to send all the parameters")

    #optional field
    try :

        if "datetimeStart" in content and content['datetimeStart'] != "":
            newTask.DatetimeStart = content['datetimeStart']
            if "datetimeEnd" in content and content['datetimeEnd'] == "":
                startTime = datetime.datetime.strptime(content["datetimeStart"], "%Y-%m-%d %H:%M:%S") + datetime.timedelta(minutes=duration)
                newTask.DatetimeEnd  = datetime.datetime.strftime(startTime, "%Y-%m-%d %H:%M:%S")

        if "datetimeEnd" in content and content['datetimeEnd'] != "":
            newTask.DatetimeEnd = content['datetimeEnd']
            if "datetimeStart" in content and content['datetimeStart'] == "":
                endTime = datetime.datetime.strptime(content["datetimeEnd"], "%Y-%m-%d %H:%M:%S") - datetime.timedelta(minutes=duration)
                newTask.DatetimeStart  = datetime.datetime.strftime(endTime, "%Y-%m-%d %H:%M:%S")

    except :
            return sendError(400, "Durée et Heures incohérentes")


    if "taskUser" in content and content['taskUser'] != "":
        try:
            userTask = PERSON.get(PERSON.Username == content['taskUser'])
            newTask.TaskUser = userTask
        except:
            return sendError(404, "User not found !")

    newTask.save()

    try :
        for dep in content["dependencies"]:
            taskDep = TASK.get(TASK.taskId == dep)
            newDependance = DEPENDANCE(TaskConcerned = newTask, TaskDependency = taskDep)
            newDependance.save()
    except:
        return sendError(400, "Fail to add dependencies. Make sure to send the dependencies field with correct task value !")

    return jsonify({}), 200


@app.route('/task/<id_task>', methods=['DELETE'])
@authenticate
def delete_task(id_task):

    try:
        task = TASK.get(TASK.taskId == id_task)
        DEPENDANCE.delete().where(DEPENDANCE.TaskConcerned == task).execute()
        DEPENDANCE.delete().where(DEPENDANCE.TaskDependency == task).execute()
    except:
        return sendError(404, "Task doesnt't exist or has already been deleted !")

    TASK.delete().where(TASK.taskId == id_task).execute()
    return jsonify({}), 204

@app.route('/task/<id_task>',  methods=['PUT'])
@authenticate
def task_put(id_task):
    user = PERSON.get(PERSON.personId == session["userId"])
    content = request.get_json()

    try:
        task = TASK.get(TASK.taskId == id_task)


        if 'taskUser' in content :
            if content['taskUser']!= "" :
                people= PERSON.get(PERSON.Username == content['taskUser'])
                task.TaskUser = people
            elif task.TaskUSer is None :
                task.TaskUser = None
        if 'description' in content:
            task.Description = content['description']
        if 'frequency' in content:
            task.Frequency = content['frequency']
        if 'name' in content:
            task.Name = content['name']
        if 'datetimeStart' in content and  content['datetimeStart']!= "":
            if content['datetimeStart']!= "" :
                task.DatetimeStart = content['datetimeStart']
            elif task.DatetimeStart!=None :
                task.DatetimeStart = None
        if 'datetimeEnd' in content and  content['datetimeEnd']!= "":
            if content['taskUser']!= "" :
                task.DatetimeEnd = content['datetimeEnd']
            elif task.DatetimeEnd!=None :
                task.DatetimeEnd = None
        if 'priority' in content:
            task.PriorityLevel = content['priority']
        if 'duration' in content and  content['duration']!= "":
            if content['duration']!= "" :
                task.Duration = content['duration']
            else :
                if 'datetimeStart' in content and  content['datetimeStart']!= "" and 'datetimeEnd' in content and  content['datetimeEnd']!= "" :
                    startTime = datetime.datetime.strptime(content["datetimeStart"], "%Y-%m-%d %H:%M:%S")
                    endTime = datetime.datetime.strptime(content["datetimeEnd"], "%Y-%m-%d %H:%M:%S")
                    diff = endTime - startTime
                    duration = diff.seconds / 60
                    task.Duration = duration
                else :
                    return sendError(400, "Make sure to send all the parameters")
        
		task.save()
    except:
        return sendError(400, "Make sure to send all the parameters")

    try :
        if 'datetimeStart' in content and  content['datetimeStart']!= "" and 'datetimeEnd' in content and  content['datetimeEnd']!= "" :
            startTime = datetime.datetime.strptime(content["datetimeStart"], "%Y-%m-%d %H:%M:%S")
            endTime = datetime.datetime.strptime(content["datetimeEnd"], "%Y-%m-%d %H:%M:%S")
            diff = endTime - startTime
            duration = diff.seconds / 60

            if duration!=task.Duration :
                endTime = datetime.datetime.strptime(task.DatetimeStart , "%Y-%m-%d %H:%M:%S")  + datetime.timedelta(minutes=task.Duration)
                newTask.DatetimeEnd  = datetime.datetime.strftime(endTime, "%Y-%m-%d %H:%M:%S")

        if task.DatetimeStart is not None and task.DatetimeEnd is None:
            endTime = datetime.strptime(task.DatetimeStart , "%Y-%m-%d %H:%M:%S") + datetime.timedelta(minutes=task.Duration)
            newTask.DatetimeEnd  = datetime.datetime.strftime(endTime, "%Y-%m-%d %H:%M:%S")

            """endTime = datetime.strptime(task.DatetimeStart , "%a, %d %b %Y %H:%M:%S GMT") + datetime.timedelta(minutes=task.Duration)
            newTask.DatetimeEnd  = datetime.datetime.strftime(endTime, "%a, %d %b %Y %H:%M:%S GMT")"""

        if task.DatetimeEnd is not None and task.DatetimeStart is None:
            startTime = datetime.datetime.strptime(task.DatetimeEnd , "%Y-%m-%d %H:%M:%S")  - datetime.timedelta(minutes=task.Duration)
            newTask.DatetimeStart = datetime.datetime.strftime(startTime, "%Y-%m-%d %H:%M:%S")
        task.save()
    except:
        return sendError(400, "Durée et Heures incohérentes")

    if 'dependencies' in content  :
        DEPENDANCE.delete().where(DEPENDANCE.TaskConcerned == task).execute()

    if 'dependencies' in content and content['dependencies']!= "" :
        for idDep in content['dependencies']:
            taskDep = TASK.get(TASK.taskId == idDep)
            newDependance = DEPENDANCE(TaskConcerned = task, TaskDependency = taskDep)
            newDependance.save()


    dependenciesIds = []

    dependencies = DEPENDANCE.select().where(DEPENDANCE.TaskConcerned == task)
    for dep in dependencies:
        dependenciesIds.append(dep.TaskDependency.taskId)

    if task.TaskUser is None:
        taskUserUsername = None
    else:
        taskUserUsername = task.TaskUser.Username

    data = {
        "taskId": task.taskId,
        "name": task.Name,
        "description": task.Description,
        "taskUser": taskUserUsername,
        "frequency": task.Frequency,
        "priority": task.PriorityLevel,
        "datetimeStart" : task.DatetimeStart,
        "datetimeEnd": task.DatetimeEnd,
        "dependencies" : dependenciesIds,
        "duration" : task.Duration
    }
    response_body = data
    return jsonify(response_body), 200

@app.route('/group/<id_group>/order',  methods=['GET'])
@authenticate
def group_order_tasks(id_group):
    content = request.get_json()

    try:
        group = GROUP.get(GROUP.groupId == id_group)
    except:
        return sendError(404, "Group not found !")

    try:
        startHour = request.args.get('startHour')
        startMinute = request.args.get('startMinute')
        endHour = request.args.get('endHour')
        endMinute = request.args.get('endMinute')
    except:
        return sendError(400, "You must send those parameters : startHour, startMinute, endHour, endMinute")

    try:
        start = datetime.time(hour=int(startHour), minute=int(startMinute))
        end = datetime.time(hour=int(endHour), minute=int(endMinute))
        if start > end:
            return sendError(400, "Start must be less than end !")
    except:
        return sendError(400, "Parameters should be digits !")

    rep = order_tasks(group, startHour, startMinute, endHour, endMinute)

    return jsonify(rep), 200
