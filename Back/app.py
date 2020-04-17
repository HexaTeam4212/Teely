from flask import Flask, request, jsonify
from peewee import *
from init_database import PERSON, PARTICIPATE_IN, TASK, GROUP, INVITATION
app = Flask(__name__)

mysql_db = MySQLDatabase('test_1', user='root', password='root', host='127.0.0.1', port=3306)

@app.route('/account/inscription', methods=['POST'])
def account_inscription():
    content = request.get_json()
    code = 201
    reponse_body = {}

    try:
        newUser = PERSON(Username = content['username'], Email = content['email'], Password = content['password'], LastName = content['lastName'], Name = content['name'], BirthDate = content['birthdate'], Bio = content['bio'])
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
        print("Error")

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