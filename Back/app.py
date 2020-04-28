from flask import Flask, request, jsonify, session
from flask_cors import CORS
from peewee import *
import json
from init_database import PERSON, PARTICIPATE_IN, TASK, GROUP, INVITATION
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
        # newUser = PERSON(Username = content['username'], Email = content['email'], Password = content['password'], LastName = content['lastName'], Name = content['name'], BirthDate = content['birthdate'], idImage = content["idImage"])
        newUser = PERSON(Username = content['username'], Email = content['email'], Password = content['password'], LastName = content['lastName'], Name = content['name'], BirthDate = content['birthdate'])
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
        user.idImage = content["idImage"]
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
    reponse_body = {
        "username": user.Username,
        "email": user.Email,
        "birthdate": user.BirthDate,
        "lastName": user.LastName,
        "name": user.Name,
        "bio": user.Bio,
        "idImage": user.idImage
    }

    return jsonify(reponse_body), 200

# Group endpoints

@app.route('/group', methods=['GET', 'POST'])
def group(): 
    content = request.get_json()
    reponse_body = {}

    if 'username' not in session:
        return sendError("User is not logged in", 401)
    elif request.method == 'POST':
        code = 204
        user = PERSON.get(PERSON.Username == session['username'])
        try:
            newGroup = GROUP(Name = content['group_name'], Description = content['description'])
        except:
            return sendError(400, "Make sure to send all the parameters")
        
        try:    
           newGroup.save()
        except:
            return sendError(409, "This group couldn't be add in the database !")
        
        for username in content['guests'] :
            recipient = PERSON.get(PERSON.Username == username)
            INVITATION.insert(Sender_id=user.personId ,Recipient_id=recipient.personId,Group_id=newGroup.groupId).execute()

        PARTICIPATE_IN.insert(User_id=user.personId,Group_id=newGroup.groupId).execute()
        return jsonify(reponse_body), code    
    elif request.method == 'GET':
        code=200
        rep = PARTICIPATE_IN.select().where(PARTICIPATE_IN.User_id == user.personId)
        res = ()
        for groupId in rep:
            res += str(groupId) ,
        response_body = {"groups" : res }
        return json.dumps(response_body),code
'''
@app.route('/group/<id_group>', methods=['GET'])
def get_group(id_group):
    group = GROUP.get(GROUP.groupId == id_group)
    rep = PARTICIPATE_IN.select().where(PARTICIPATE_IN.Group_id == id_group)
    res = ()
    for userId in rep:
        member = PERSON.get(PERSON.personId == userId)
        res += str(member.username) ,
    reponse_body = {
        "id": group.groupId,
        "group_name": group.Name,
        "description": group.Description,
        "members": res
    }
    return json.dumps(response_body),code
'''



@app.route('/group/<id_group>/invite', methods=['DELETE'])
def delete_invite(id_group): 
    content = request.get_json()
    reponse_body = {}
    code = 204
    userId = 2
    rep = INVITATION.select().where( (INVITATION.Group_id == id_group) & (INVITATION.Recipient_id == userId) )
    print(rep)
    for invitation in rep :
        print(invitation)
        INVITATION.delete().where(INVITATION.invitationId == invitation).execute()
    return jsonify(reponse_body), code
    

@app.route('/group/<id_group>/invite', methods=['GET'])
def create_invite(id_group): 
    reponse_body = {}
    code = 204
    userId = 1
    rep = PERSON.select().where(PERSON.Username == request.args.get('username'))
    for user in rep:
        resultat = INVITATION.select().where( (INVITATION.Recipient_id == user.personId) & (INVITATION.Group_id == id_group) )
        for invitation in resultat : 
            code = 409
            reponse_body = {
                "error": "Conflict: The request could not be completed due to conflict. User may have already been invited."
            }   
        INVITATION.insert(Sender_id=userId ,Recipient_id=user.personId ,Group_id=id_group).execute()
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
def quit_group(id_group): 
    reponse_body = {}
    code = 204
    userId = 1
    PARTICIPATE_IN.delete().where( (PARTICIPATE_IN.User_id == userId) & (PARTICIPATE_IN.Group_id == id_group) ).execute()
    return jsonify(reponse_body), code
