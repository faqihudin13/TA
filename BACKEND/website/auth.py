from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from . import db   ##means from __init__.py import db
from flask_login import login_user, login_required, logout_user, current_user
import ast
from flask import request
import os
from website import response
import datetime
from flask_jwt_extended import *
from .ML.train_face import train_face
from .ML.recog_face import recog_face

auth = Blueprint('auth', __name__)

def singleObject(data):
    data = {
        'email' : data.email,
        'username':data.username,
        'image':data.image
    }

    return data


@auth.route('/facerecog', methods=['POST'])
def facerecog():
    if request.method=='POST':
        data_string = request.data.decode("UTF-8")
        data = ast.literal_eval(data_string)
        image = data['imageSrc']
        email = data['email']   
        user = User.query.filter_by(email=email).first()
        signature_db =user.signature
        image_output, facenet_score, result=recog_face(image,signature_db) 
    return{'image':image_output,'facenet':facenet_score,'result':result}

@auth.route('/facedetec', methods=['GET', 'POST'])
def facedetec():
    if request.method=='POST':
        data_string = request.data.decode("UTF-8")
        data = ast.literal_eval(data_string)
        username = 'test'
        image = data['image']
        image_output, name_output, signature_str=train_face(image,username) 
        signature = str(signature_str)
    return{'image':image_output}

@auth.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data_string = request.data.decode("UTF-8")
        data = ast.literal_eval(data_string)
        email = data['email']
        password = data['password']
        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                login_user(user, remember=True)
                data_2 = singleObject(user)
                expires = datetime.timedelta(minutes=60)
                expires_refresh = datetime.timedelta(minutes=60)
                acces_token = create_access_token(data_2, fresh=True, expires_delta= expires)
                refresh_token = create_refresh_token(data_2, expires_delta=expires_refresh)
                return response.success({
                    "status":True,
                    "data" : data_2,
                    "access_token" : acces_token,
                    "refresh_token" : refresh_token,
                }, "Sukses Login!")
            else:
                return response.success({'status':False }, 'Incorrect password please try again!') 
        else:
            return response.success({'status':False }, 'Email not match')

    return response.success({'status':False }, '')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


@auth.route('/sign-up', methods=['POST'])
def sign_up():
    if request.method == 'POST':
        data_string = request.data.decode("UTF-8")
        data = ast.literal_eval(data_string)
        username = data['username']
        email = data['email']
        image = data['imageUrl']
        password1 = data['password1']
        password2 = data['password2']
        image_output, name_output, signature_str=train_face(image,username) 
        signature = str(signature_str)
        user = User.query.filter_by(email=email).first()
        if user:
            return {'status':False, 'message':'Email already exists'}
        elif len(email) < 13:
            return {'status':False, 'message':'Email must be greater than 12 characters'}
        elif len(username)< 5 :
            return{'status': False, 'message': 'Username must be greater than 4 characters'}
        elif len (image) < 3 :
            return{'status':False}
        elif len(password1) < 7:
            return {'status':False, 'message':'Password must be greater than 7 characters'}
        elif password1 != password2:
            return {'status':False, 'message':'Password Dont match'}
        else:
            new_user = User(username=username,email=email,image=image,signature=signature, password=generate_password_hash(
                password1, method='sha256'))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            return {'status':True, 'message':'Account Created'}
    return {'status':False, 'message':''}
   