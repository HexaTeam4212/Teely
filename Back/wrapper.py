from flask import Flask, request, jsonify, session

def sendError(code, msg):
	body = {
		"error": msg
	}
	return jsonify(body), code

def authenticate(func):
	def authenticate_and_call(*args, **kwargs):
		if "Authorization" not in request.headers:
			return sendError(412, "Missing authorization header !")
		
		if 'username' not in session:
			return sendError(401, "User is not logged in !")

		if request.headers["Authorization"] != session['username']:
			return sendError(401, "Incorrect username verification !")

		return func(*args, **kwargs)
	return authenticate_and_call