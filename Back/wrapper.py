from flask import Flask, request, jsonify, session
from functools import wraps
import jwt

def sendError(code, msg):
	body = {
		"error": msg
	}
	return jsonify(body), code

def authenticate(func):
	@wraps(func)
	def authenticate_and_call(*args, **kwargs):
		if "Authorization" not in request.headers:
			return sendError(412, "Missing authorization header !")
		
		if 'userId' not in session:
			return sendError(401, "User is not logged in !")

		JWTtoken = request.headers["Authorization"]
		decodedJWTtoken = jwt.decode(JWTtoken, 'not_so_secret_key')
		if decodedJWTtoken['userId'] != session['userId']:
			return sendError(401, "Incorrect token !")

		return func(*args, **kwargs)
	return authenticate_and_call