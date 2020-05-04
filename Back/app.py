from flask import Flask, request, jsonify, session
from flask_cors import CORS
from peewee import *
import json
import datetime
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
        user.Username = content["username"]
        user.Email = content["email"]
        user.Password = content["password"]
        user.LastName = content["lastName"]
        user.Name = content["name"]
        user.BirthDate = content["birthdate"]
        if "bio" in content:
            user.Bio = content["bio"]
        user.save()
    except:
        return sendError(400, "Bad Request: Make sure to send all parameters !")

    return jsonify(reponse_body), code

@app.route('/account/info',  methods=['GET'])
@authenticate
def account_info():

    user = PERSON.get(PERSON.Username == session['username'])
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

    tasks_rep = TASK.select().where(TASK.TaskUser.Username == session["username"])
    tasks_list = []

    for task in tasks_rep:
        data = {
            "name": task.Name,
            "description": task.Description,
            "taskedUser": task.TaskUser,
            "dueDate": task.Date,
            "duration": task.Duration,
            "frequency": task.Frequency,
            "priority": task.PriorityLevel
        }
        tasks_list.append(data)

    reponse_body = {
        "tasks": tasks_list
    }

    return jsonify(reponse_body), 200

@app.route('/account/task/upcomming',  methods=['GET'])
@authenticate
def account_upcomming_tasks_for_user():

    tasks_rep = TASK.select().where(TASK.TaskUser.Username == session["username"] & TASK.Date > datetime.datetime.now())
    tasks_list = []

    for task in tasks_rep:
        data = {
            "name": task.Name,
            "description": task.Description,
            "taskedUser": task.TaskUser,
            "dueDate": task.Date,
            "duration": task.Duration,
            "frequency": task.Frequency,
            "priority": task.PriorityLevel
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
    rep = TASK.select().where(TASK.Group_id == id_group)
    response_body = {}
    taskData = []
    ''' manque des éléments à rajouter"description":
    manque la DATE
    '''
    for task in rep:

        dependancies = DEPENDANCE.select().where( DEPENDANCE.TaskConcerned.taskId== task.taskId)

        dependanciesIds=[]
        try :
            for dep in dependancies :
                dependanciesIds.append(dep.taskConcerned)
        except :
            dependanciesIds.append("")

        data = {"id": task.taskId,
            "name": task.Name,
            "taskedUsers": task.TaskUser_id,
            "dueDate" : str(task.Date),
            "frequency": task.Frequency,
            "priority": task.PriorityLevel,
            "duration": task.Duration,
            "startingTime" : str(task.StartingTime),
            "dependancies" : dependanciesIds
        }

        taskData.append(data)

    response_body = {
        "tasks" : taskData
    }

    return json.dumps(response_body),200

@app.route('/group/<id_group>/task/<id_task>', methods=['GET'])
def group_task_id(id_group, id_task):
    rep = TASK.select().where(TASK.taskId == id_task)
    taskData = []
    dependanciesIds=[]

    try :
        dependancies = DEPENDANCE.select().where( DEPENDANCE.TaskConcerned.taskId== task.taskId)
        for dep in dependancies :
            dependanciesIds.append(dep.taskConcerned)
    except :
        dependanciesIds.append("")

    for task in rep:
        data = {"id": task.taskId,
        "description": task.Description,
        "taskedUsers": task.TaskUser_id,
        "dueDate": str(task.Date),
        "frequency": task.Frequency,
        "priority": task.PriorityLevel,
        "duration": task.Duration,
        "startingTime" : str(task.StartingTime),
        "dependancies" : dependanciesIds
        }

        taskData.append(data)
    response_body = {"task" : taskData}

    return json.dumps(response_body),200

@app.route('/group/<id_group>/task', methods=['POST'])
def group_task(id_group):
    content = request.get_json()
    reponse_body = {}
    ''' verification que le groupe existe ?'''
    try :
        newTask = TASK(TaskUser=content['taskUser'], Description = content['description'], Frequency=content['frequency'],Group=id_group, Date= content['date'], PriorityLevel=content['priorityLevel'],Duration = content['duration'],StartingTime = content['startingTime'])
    except:
        return sendError(400, "Make sure to send all the parameters")
    try:
       newTask.save()
    except:
        return sendError(409, "This task couldn't be add in the database !")

    try :
        newDependance = DEPENDANCE(TaskConcerned=newTask.taskId, TaskDependancies = content['dependancies'])
    except:
        return sendError(400, "Make sure to send all the parameters")
    try:
       newDependance.save()
    except:
        return sendError(409, "This task couldn't be add in the database !")

    return jsonify(reponse_body), 200


@app.route('/group/<id_group>/task/<id_task>', methods=['DELETE'])
def delete_task(id_group,id_task):
    reponse_body = {}
    code = 204
    TASK.delete().where( (TASK.taskId == id_task) ).execute()
    return jsonify(reponse_body), code

@app.route('/group/<id_group>/task/<id_task>',  methods=['PUT'])
def task_put(id_group,id_task):
    content = request.get_json()
    code = 204
    response_body ={}
    try:
        task = TASK.get(TASK.taskId==id_task)
        task.TaskUser=content['taskUser']
        task.Description = content['description']
        task.Frequency=content['frequency']
        task.Group=id_group
        task.Date= content['date']
        task.PriorityLevel=content['priorityLevel']
        task.Duration = content['duration']
        task.StartingTime = content['startingTime']
        task.save()
    except:
            return sendError(400, "Bad Request 1: Make sure to send all parameters !")

    try :
            dependance = DEPENDANCE.get(DEPENDANCE.TaskConcerned==id_task)
            dependance.TaskDependancies = content['dependancies']
            dependance.save()
    except :
        try :
            newDependance = DEPENDANCE(TaskConcerned=id_task, TaskDependancies = content['dependancies'])
            newDependance.save()
        except :
            return sendError(400, "Bad Request 2: Make sure to send all parameters !")

    try :
        task = TASK.get(TASK.taskId==id_task)
        dependancies = DEPENDANCE.get(DEPENDANCE.TaskConcerned==id_task)
        dependanciesIds=[]
        for dep in dependance :
            dependanciesIds.append(dep.taskConcerned)
    except :
        dependanciesIds.append("")

    data = {"id": task.taskId,
    "description": task.Description,
    "taskedUsers": task.TaskUser_id,
    "dueDate": str(task.Date),
    "frequency": task.Frequency,
    "priority": task.PriorityLevel,
    "duration": task.Duration,
    "startingTime" : task.StartingTime,
    "dependancies" : str(dependanciesIds)
    }
    response_body =data
    return json.dumps(response_body), 200
