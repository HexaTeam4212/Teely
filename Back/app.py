from flask import Flask, request, jsonify
from flask_cors import CORS
from peewee import *
import json
from init_database import PERSON, PARTICIPATE_IN, TASK, GROUP, INVITATION
app = Flask(__name__)

CORS(app) ## allow CORS for all domains on all routes (to change later)

mysql_db = MySQLDatabase('teely_db', user='root', password='root', host='127.0.0.1', port=3306)

def sendError(code, msg):
    body = {
        "error": msg
    }
    return jsonify(body), code

@app.route('/account/inscription', methods=['POST'])
def account_inscription():
    content = request.get_json()
    code = 201
    reponse_body = {}

    try:
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
            "token": "dsfsdofjsdpofjsdpfk"
        }

    return jsonify(reponse_body), code

@app.route('/group', methods=['GET', 'POST'])
def group(): 
    content = request.get_json()
    reponse_body = {}
    #Il faut récupérer l'ID de celui qui est connecté 
    userId = 1

    if request.method == 'POST':
        code = 204
        try:
            newGroup = GROUP(Name = content['group_name'], Description = content['description'])
        except:
            return sendError(400, "Make sure to send all the parameters")
        
        try:    
           newGroup.save()
        except:
            return sendError(409, "This group couldn't be add in the database !")
        
        try:
            for user in content['members'] :
                INVITATION.insert(Sender_id=userId ,Recipient_id=user,Group_id=newGroup.groupId).execute()
        except:
            return sendError(400, "Make sure to send all the parameters")

        PARTICIPATE_IN.insert(User_id=userId,Group_id=newGroup.groupId).execute()
        return jsonify(reponse_body), code
        
    if request.method == 'GET':
        code=200
        rep = PARTICIPATE_IN.select().where(PARTICIPATE_IN.User_id == userId)
        res = ()
        for groupId in rep:
            res += str(groupId) ,
        response_body = {"groups" : res }

        return json.dumps(response_body),code

        
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
