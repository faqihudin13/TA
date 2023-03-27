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



auth = Blueprint('auth', __name__)

def singleObject(data):
    data = {
        'email' : data.email,
    }

    return data

@auth.route('/facerecog', methods=['GET', 'POST'])
def facerecog():
    if request.method=='POST':
        data_string = request.data.decode("UTF-8")
        data = ast.literal_eval(data_string)
        print(data)
    return{'status':True}

@auth.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':
        data_string = request.data.decode("UTF-8")
        data = ast.literal_eval(data_string)
        email = data['email']
        password = data['password']

        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                #flash('Logged in successfully!', category='success')
                login_user(user, remember=True)
                # return {'status':True, 'message':'Berhasil'}
                data_2 = singleObject(user)
                # futuredates = datetime.now()+timedelta(days=7)
                expires = datetime.timedelta(seconds=10)
                expires_refresh = datetime.timedelta(seconds=10)

                acces_token = create_access_token(data, fresh=True, expires_delta= expires)
                refresh_token = create_refresh_token(data, expires_delta=expires_refresh)
                return response.success({
                    "status":True,
                    "data" : data_2,
                    "access_token" : acces_token,
                    "refresh_token" : refresh_token,
                }, "Sukses Login!")
            else:
                #flash('Incorrect password, try again.', category='error')
                return response.success({'status':False }, "Incorrect password, try again.") 
        else:
            #flash('Email does not exist.', category='error')
            return response.success({'status':False }, "Email does not exist.")

    return response.success({'status':False }, '')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))


@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        data_string = request.data.decode("UTF-8")
        data = ast.literal_eval(data_string)
        print(data)
        username = data['username']
        email = data['email']
        image = data['imageUrl']
        password1 = data['password1']
        password2 = data['password2']

        user = User.query.filter_by(email=email).first()
        if user:
            return {'status':False, 'message':'Email already exists.'}
        elif len(username)<2 :
            return{'status': False, 'message': 'username must be greater than 3 characters'}
        elif len(email) < 4:
            return {'status':False, 'message':'Email must be greater than 3 characters.'}
        elif len (image) < 3 :
            return{'status':False}
        elif password1 != password2:
            return {'status':False, 'message':'Password Dont match.'}
        elif len(password1) < 7:
            return {'status':False, 'message':'Email already exists.'}
        else:
            new_user = User(username=username,email=email,image=image, password=generate_password_hash(
                password1, method='sha256'))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            return {'status':True, 'message':'Account Created'}

    return {'status':False, 'message':''}
   
