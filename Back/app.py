from flask import Flask, request, jsonify, session
from flask_cors import CORS
from peewee import *
import json
from datetime import datetime
from init_database import PERSON, PARTICIPATE_IN, TASK, GROUP, INVITATION, DEPENDANCE
from wrapper import sendError, authenticate
app = Flask(__name__)

CORS(app) ## allow CORS for all domains on all routes (to change later)

# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

mysql_db = MySQLDatabase('teely_db', user='root', password='root', host='127.0.0.1', port=3306)

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
        reponse_body = {
            "authToken": "dsfsdofjsdpofjsdpfk"
        }
        session['username'] = username

    return jsonify(reponse_body), code

@app.route('/account/logout',  methods=['GET'])
@authenticate
def account_logout():

    session.pop('username', None)

    return jsonify({}), 204

@app.route('/account/update',  methods=['PUT'])
@authenticate
def account_update():
    content = request.get_json()
    code = 204
    reponse_body = {}

    try:
        user = PERSON.get(PERSON.Username == session['username'])

        if user.Password == content["current_password"]:
            if "username" in content:
                if content["username"] != "":
                    #Test if username is already taken
                    try:
                        #This throw an error if there is no user found with this username
                        u = PERSON.get(PERSON.Username == content["username"])
                        if u.Username != session["username"]:
                            return sendError(409, "Username already taken !")
                    except:
                        pass
                    user.Username = content["username"]
                    session["username"] = content["username"]
            if "email" in content:
                if content["email"] != "":
                    #Test if email is already taken
                    try:
                        #This throw an error if there is no user found with this email
                        u = PERSON.get(PERSON.Email == content["email"])
                        cur_u = PERSON.get(PERSON.Username == session["username"])
                        if u.Email != cur_u.Email:
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

    username = session['username']
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

    user = PERSON.select().where(PERSON.Username == session["username"])
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

    user = PERSON.get(PERSON.Username == session["username"])
    tasks_rep = TASK.select().where(TASK.TaskUser == user).order_by(TASK.DatetimeStart)
    tasks_list = []

    for task in tasks_rep:
        dependanciesIds=[]
        dependancies = DEPENDANCE.select().where( DEPENDANCE.TaskConcerned == task)
        for dep in dependancies :
            dependanciesIds.append(dep.TaskConcerned.taskId)

        data = {
            "taskId": task.taskId,
            "name": task.Name,
            "description": task.Description,
            "taskUser": task.TaskUser.Username,
            "frequency": task.Frequency,
            "priority": task.PriorityLevel,
            "datetimeStart" : task.DatetimeStart,
            "datetimeEnd": task.DatetimeEnd,
            "dependancies" : dependanciesIds,
            "duration": task.Duration
        }
        tasks_list.append(data)

    reponse_body = {
        "tasks": tasks_list
    }

    return jsonify(reponse_body), 200

@app.route('/account/task/upcomming',  methods=['GET'])
@authenticate
def account_upcomming_tasks_for_user():

    user = PERSON.get(PERSON.Username == session["username"])
    current_date = datetime.now()
    tasks_rep = TASK.select().where(TASK.TaskUser).order_by(TASK.DatetimeStart)

    tasks_list = []

    for task in tasks_rep:
        dependanciesIds=[]
        dependancies = DEPENDANCE.select().where( DEPENDANCE.TaskConcerned == task)
        for dep in dependancies :
            dependanciesIds.append(dep.TaskConcerned.taskId)

        data = {
            "taskId": task.taskId,
            "name": task.Name,
            "description": task.Description,
            "taskUser": task.TaskUser.Username,
            "frequency": task.Frequency,
            "priority": task.PriorityLevel,
            "datetimeStart" : task.DatetimeStart,
            "datetimeEnd": task.DatetimeEnd,
            "dependancies" : dependanciesIds,
            "duration": task.Duration
        }

        if task.DatetimeStart is not None:
            if task.DatetimeStart.year >= current_date.year:
                if task.DatetimeStart.month >= current_date.month or task.DatetimeStart.year > current_date.year:
                    if task.DatetimeStart.day >= current_date.day or task.DatetimeStart.month > current_date.month or task.DatetimeStart.year > current_date.year:
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
    if 'username' not in session:
        return sendError("User is not logged in", 401)
    elif request.method == 'POST':
        content = request.get_json()
        code = 204
        user = PERSON.get(PERSON.Username == session['username'])
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
        user = PERSON.get(PERSON.Username == session['username'])
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
    if 'username' not in session:
        return sendError("User is not logged in", 401)
    else :
        user = PERSON.get(PERSON.Username == session['username'])
        code = 204
        rep = INVITATION.select().where( (INVITATION.Group_id == id_group) & (INVITATION.Recipient_id == user.personId) )
        for invitation in rep :
            INVITATION.delete().where(INVITATION.invitationId == invitation).execute()
        return jsonify(reponse_body), code


@app.route('/group/<id_group>/invite', methods=['GET'])
@authenticate
def create_invite(id_group):
    reponse_body = {}
    if 'username' not in session:
        return sendError("User is not logged in", 401)
    else :
        user = PERSON.get(PERSON.Username == session['username'])
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
def accept_invite(id_group):
    reponse_body = {}
    code = 204
    rep = INVITATION.select().where(INVITATION.invitationId == request.args.get('invite_id'))
    for invitation in rep :
        PARTICIPATE_IN.insert(User_id=invitation.Recipient_id , Group_id=invitation.Group_id).execute()
    INVITATION.delete().where(INVITATION.invitationId == request.args.get('invite_id')).execute()
    return jsonify(reponse_body), code

@app.route('/group/<id_group>/quit', methods=['GET'])
@authenticate
def quit_group(id_group):
    reponse_body = {}
    code = 204
    if 'username' not in session:
        return sendError("User is not logged in", 401)
    else :
        user = PERSON.get(PERSON.Username == session['username'])
        PARTICIPATE_IN.delete().where( (PARTICIPATE_IN.User_id == user.personId) & (PARTICIPATE_IN.Group_id == id_group) ).execute()
        return jsonify(reponse_body), code

@app.route('/group/<id_group>/task/all', methods=['GET'])
def group_task_all(id_group):
    rep = TASK.select().where(TASK.Group_id == id_group).order_by(TASK.DatetimeStart)
    response_body = {}
    taskData = []

    for task in rep:

        dependancies = DEPENDANCE.select().where( DEPENDANCE.TaskConcerned.taskId== task.taskId)

        dependanciesIds=[]
        try :
            for dep in dependancies :
                dependanciesIds.append(dep.taskConcerned)
        except :
            dependanciesIds.append("")

        data = {
            "taskId": task.taskId,
            "name": task.Name,
            "taskUser": task.TaskUser.Username,
            "frequency": task.Frequency,
            "priority": task.PriorityLevel,
            "datetimeStart" : task.DatetimeStart,
            "datetimeEnd": task.DatetimeEnd,
            "dependancies" : dependanciesIds,
            "duration": task.Duration
        }

        taskData.append(data)

    response_body = {
        "tasks" : taskData
    }

    return jsonify(response_body),200

@app.route('/group/<id_group>/task/<id_task>', methods=['GET'])
def group_task_id(id_group, id_task):
    try:
        task = TASK.get(TASK.taskId == id_task)
    except:
        return sendError(404, "Task not found !")
    
    dependanciesIds=[]
    dependancies = DEPENDANCE.select().where( DEPENDANCE.TaskConcerned == task)
    for dep in dependancies :
        dependanciesIds.append(dep.TaskConcerned.taskId)

    data = {
        "taskId": task.taskId,
        "name": task.Name,
        "description": task.Description,
        "taskUser": task.TaskUser.Username,
        "frequency": task.Frequency,
        "priority": task.PriorityLevel,
        "datetimeStart" : task.DatetimeStart,
        "datetimeEnd": task.DatetimeEnd,
        "dependancies" : dependanciesIds,
        "duration": task.Duration
    }

    response_body = {"task" : data}

    return jsonify(response_body),200

@app.route('/group/<id_group>/task', methods=['POST'])
def group_task(id_group):
    content = request.get_json()
    
    try:
        userTask = PERSON.get(PERSON.Username == content['taskUser'])
        group = GROUP.get(GROUP.groupId == id_group)
    except:
        return sendError(404, "User or group not found !")

    if "datetimeStart" in content and "datetimeEnd" in content:
        startTime = datetime.strptime(content["datetimeStart"], "%Y-%m-%d %H:%M:%S")
        endTime = datetime.strptime(content["datetimeEnd"], "%Y-%m-%d %H:%M:%S")
        diff = endTime - startTime
        duration = diff.seconds / 60
    else:
        duration = content['duration']

    try :
        
        newTask = TASK(TaskUser=userTask, Description = content['description'], Frequency=content['frequency'], Group=group, PriorityLevel=content['priorityLevel'], Name=content["name"], Duration=duration)
    except:
        return sendError(400, "Make sure to send all the parameters")

    #optional field
    if "datetimeStart" in content:
        newTask.DatetimeStart = content["datetimeStart"]
    if "datetimeEnd" in content:
        newTask.DatetimeEnd = content["datetimeEnd"]

    newTask.save()

    try :
        for dep in content["dependencies"]:
            taskDep = TASK.get(TASK.taskId == dep)
            newDependance = DEPENDANCE(TaskConcerned = newTask, TaskDependency = taskDep)
            newDependance.save()
    except:
        return sendError(400, "Fail to add dependencies. Make sure to send the dependencies field with correct task value !")

    return jsonify({}), 200


@app.route('/group/<id_group>/task/<id_task>', methods=['DELETE'])
def delete_task(id_group,id_task):
    try:
        task = TASK.get(TASK.taskId == id_task)
        DEPENDANCE.delete().where(DEPENDANCE.TaskConcerned == task).execute()
    except:
        return sendError(404, "Task doesnt't exist or has already been deleted !")

    TASK.delete().where(TASK.taskId == id_task).execute()
    return jsonify({}), 204

@app.route('/group/<id_group>/task/<id_task>',  methods=['PUT'])
def task_put(id_group,id_task):
    content = request.get_json()
    code = 204
    response_body ={}
    
    try:
        task = TASK.get(TASK.taskId == id_task)
        task.Group = id_group
        if 'taskUser' in content:
            task.TaskUser = content['taskUser']
        if 'description' in content:
            task.Description = content['description']
        if 'frequency' in content:
            task.Frequency = content['frequency']
        if 'name' in content:
            task.Name = content['name']
        if 'datetimeStart' in content:
            task.DatetimeStart = content['datetimeStart']
        if 'datetimeEnd' in content:
            task.DatetimeEnd = content['datetimeEnd']
        if 'priority' in content:
            task.PriorityLevel = content['priority']
        if 'duration' in content:
            task.Duration = content['duration']
        
        task.save()
    except:
        return sendError(404, "Task not found !")

    if 'dependancies' in content:
        DEPENDANCE.delete().where(DEPENDANCE.TaskConcerned == task).execute()
        
        for idDep in content['dependancies']:
            taskDep = TASK.get(TASK.taskId == idDep)
            newDependance = DEPENDANCE(TaskConcerned = task, TaskDependency = taskDep)
            newDependance.save()


    dependanciesIds = []
    dependancies = DEPENDANCE.select().where(DEPENDANCE.TaskConcerned == task)
    for dep in dependancies:
        dependanciesIds.append(dep.TaskDependency.taskId)

    data = {
        "taskId": task.taskId,
        "name": task.Name,
        "description": task.Description,
        "taskUser": task.TaskUser.Username,
        "frequency": task.Frequency,
        "priority": task.PriorityLevel,
        "datetimeStart" : task.DatetimeStart,
        "datetimeEnd": task.DatetimeEnd,
        "dependancies" : dependanciesIds,
        "duration": task.Duration
    }
    response_body = data
    return jsonify(response_body), 200
