from flask import Flask, request, jsonify
from flask_cors import CORS
from peewee import *
import sys
from init_database import PERSON, PARTICIPATE_IN, TASK, GROUP, INVITATION
app = Flask(__name__)

CORS(app) ## allow CORS for all domains on all routes (to change later)

mysql_db = MySQLDatabase('teely_db', user='root', password='root', host='127.0.0.1', port=3306)

@app.route('/account/inscription', methods=['POST'])
def account_inscription():
    content = request.get_json()
    code = 201
    reponse_body = {}

    try:
        newUser = PERSON(Username = content['username'], Email = content['email'], Password = content['password'], LastName = content['lastName'], Name = content['name'], BirthDate = content['birthdate'])
    except:
        code = 400
        reponse_body = {
            "error": "Bad Request: Make sure to send all parameters !"
        }

    try:    
        newUser.save()
    except:
        code = 409
        reponse_body = {
            "error": "Conflict: This username or email already exist in database !"
        }

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
        code = 400
        reponse_body = {
            "error": "Bad Request: Make sure to send all parameters !"
        }

    try:
        rep = PERSON.select().where(PERSON.Username == username)
    except:
        code = 404
        reponse_body = {
            "error" : "This user doesn't exit !"
        }

    for user in rep:
        if user.Password != password:
            code = 401
            reponse_body = {
                "error": "The password is incorrect !"
            }
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
            code = 400
            reponse_body = {
            "error" : "Make sure to send all the parameters"
            }
        #Il faut ajouter le créateur du groupe dans la table participant_in
        try:    
           newGroup.save()
        except:
            code = 409
            reponse_body = {
                "error": "This group couldn't be add in the database !"
            }
        try:
            for user in content['members'] :
                print(user)
                print(newGroup.id)
                INVITATION.insert(Sender_id=userId ,Recipient_id=user,Group_id=newGroup.groupId).execute()
        except:
            code = 400
            reponse_body = {
                "error": "Make sure to send all the parameters"
            }
       # try :
        PARTICIPATE_IN.insert(User_id=userId,Group_id=newGroup.groupId).execute()
        

           
    return jsonify(reponse_body), code

        
