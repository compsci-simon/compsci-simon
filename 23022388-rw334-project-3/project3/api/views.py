from django.shortcuts import render, redirect
from django.contrib import messages
# from .forms import RegisterForm, UserUpdateForm #, ProfileUpdateForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
# from django.contrib.auth import get_user_model
from .models import UserProfile, GroupAdmins, GroupMembers, Category, Post, Comment, Group, Friends, PostCategory

import json
import re
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.utils.timezone import make_aware

import pandas as pd
import geopandas as gpd
import geopy
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import haversine as hs

from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import check_password, make_password
SECRET_KEY = 'django-insecure-#@vtv0gx_pq$!v+d32@qllbaoxwnr%f3l_q65_=0u&h)+kcz)5'


# can also write a function to check specific user
def check_token(token):
    # you can just send in the token and then do the decoding
    authenticate = True
    if token == None:
        return False

    token = token.split(' ')[1]
    # print(token)
    try:
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        UserProfile.objects.get(username=data['username'])
        # time = data['exp']
        authenticate = True
    except:
        authenticate = False
   

    return authenticate

# Create your views here.
def register(request):
    # print(request.method)
    if request.method == 'POST':
        form = json.loads(request.body)
        username = form.get('username')
        email = form.get('email')
        password = form.get('password')
        image = form.get('image')
        # image = request.FILES['image']
        user = UserProfile()
        # check if exitst
        user.username = username.strip()
        user.email = email.strip()
        user.password = make_password(password)
        # user.image = image
        user.save()
        created = {
            'user_created': True
        }
        return JsonResponse(created)

    



def user_exists(request):
    if request.method == 'GET':
        username = request.GET.get('username')
        username = username.strip()
        user = UserProfile()
        message = None
        user_exist = True
        try:
            UserProfile.objects.get(username=username)
        except:
            user_exist = False

        message_user = None
        if user_exist:
            message_user = f'The user {username} already exists'

        exists = {
            'exists': user_exist,
            'message_user': message_user
        }
        return JsonResponse(exists)


def valid_email(request):
    if request.method == 'GET':
        email = request.GET.get('email')
        email = email.strip()
        email_valid = True
        message_email = None
        try:
            validate_email(email)
        except ValidationError as e:
            email_valid = False

        if email_valid:
            user.email = email
        else:
            message_email = f'{email} is not a valid email'

        valid = {
            'valid': email_valid,
            'message_email': message_email
        }
        return JsonResponse(valid)


def valid_password(request):
    if request.method == 'GET':
        password = request.GET.get('password')
        message_password = None
        valid_password = True
        if len(password) < 10:
            valid_password = False
            message_password = 'The password is fewer than 10 characters'
        x = re.search("[A-Z]", password)
        if not x:
            valid_password = False
            message_password = 'The password does not contain an uppercase letter'
        x = re.search("[a-z]", password)
        if not x:
            valid_password = False
            message_password = 'The password does not contain a lower case letter'
        x = re.search("[!”#$%&’()*+,-./:;<=>?@[\\]^_`{|}~]", password)
        if not x:
            valid_password = False
            message_password = 'The password does not contain a special character'

        valid = {
            'valid': valid_password,
            'message_password': message_password
        }
        return JsonResponse(valid)

def login(request):
    # print(request.method)
    if request.method == 'POST':
        # print(request.body)
        form = json.loads(request.body)
        username = form.get('username')
        password = form.get('password')
        remember_me = form.get('remember_me')
        username = username.strip()
        password = password.strip()
        if UserProfile.objects:
            # user = UserProfile.objects.get(username)
            try:
                user = UserProfile.objects.get(username=username)
            except:
                user = None
            if user:

                password_real = user.password
                if check_password(password, password_real):
                    if remember_me:
                        dt = datetime.now() + timedelta(minutes=60)
                        global SECRET_KEY
                        token = jwt.encode({'username': username, 'exp': dt}, SECRET_KEY, algorithm='HS256')
                        login = {
                            'login': True,
                            'token': token,
                            'expiry_time': dt,
                            'email': user.email,
                            'username': user.username
                        }
                        return JsonResponse(login)
                    else:
                        dt = datetime.now() + timedelta(seconds=10)
                        token = jwt.encode({'username': username, 'exp': dt}, SECRET_KEY, algorithm='HS256')
                        login = {
                            'login': True,
                            'token': token,
                            'expiry_time': dt,
                            'email': user.email,
                            'username': user.username
                        }
                        return JsonResponse(login)

                else:
                    login = {
                        'login': False,
                        'token': None
                    }
                    return JsonResponse(login)

            else:
                login = {
                    'login': False,
                    'token': None
                }
                return JsonResponse(login)
        else:
            login = {
                'login': False,
                'token': None
            }
            return JsonResponse(login)

def test(request):
    token = request.META.get('HTTP_AUTHENTICATION')
    if not check_token(token):
        valid_token = {
            'valid_token': False
        }
        return JsonResponse(valid_token)
    token = {
        'valid_token': True
    }
    return JsonResponse(token)


def create_group(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)

        groupname = info.get('group_name')

        for g in Group.objects.all():
            if g.groupname == groupname:
                group_created = {
                    'group_created': False
                }
                return JsonResponse(group_created)
            

        group = Group()
        group.groupname = groupname
        group.save()
        groupadmin = GroupAdmins()
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        groupadmin.user = user
        groupadmin.group = group
        groupadmin.save()
        group_created = {
            'group_created': True
        }
        return JsonResponse(group_created)

    group_created = {
        'group_created': False
    }
    return JsonResponse(group_created)


def delete_group(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)

        groupname = info.get('group_name')
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        # check that the user is the admin
        group = Group.objects.get(groupname=groupname)
        groupadmin = GroupAdmins.objects.get(id=group.id)
        if groupadmin.user == user:
            group.delete()

            group_deleted = {
                'group_deleted': True
            }
            return JsonResponse(group_deleted)

    group_deleted = {
        'group_deleted': False
    }
    return JsonResponse(group_deleted)


def get_groups_admin(request):
    
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)
        
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        # check that the user is the admin
        group_names = []
        for g in GroupAdmins.objects.all():
            if g.user == user:
                group_name = {
                    'group_name': g.group.groupname
                }
                group_names.append(group_name)

        return JsonResponse(group_names, safe=False)

    group_names = {
        'groups': None
    }
    return JsonResponse(group_names)



def get_groups_belong(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)
        
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        # check that the user is the admin
        group_names = []
        for g in GroupAdmins.objects.all():
            if g.user == user:
                group_name = {
                    'group_name': g.group.groupname
                }
                group_names.append(group_name)

        for g in GroupMembers.objects.all():
            if g.user == user:
                group_name = {
                    'group_name': g.group.groupname
                }
                group_names.append(group_name)

        return JsonResponse(group_names, safe=False)

    group_names = {
        'groups': None
    }
    return JsonResponse(group_names)



def post(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)

        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        title = info.get('title')
        content = info.get('content')
        groupname = info.get('group_name')
        location = info.get('location')
        

        for g in Group.objects.all():
            if g.groupname == groupname:
                group = g

        

        post = Post()
        post.title = title
        post.content = content
        post.group = group
        post.user = user
        latitude = location.split(' ')[0]
        longitude = location.split(' ')[1]
        post.location_lat = float(latitude)
        post.location_lon = float(longitude)
        post.save()

        i = 1
        while True:
            category_key = 'category' + str(i) 
            try:
                category_name = info.get(category_key)
            except:
                break

            if category_name is None:
                break

            found = False
            for c in Category.objects.all():
                if c.name == category_name:
                    category = c
                    found = True


            
            if not found:
                category = Category()
                category.name  = category_name
                category.save()
                # category = Category.objects.get(name=category_name)

            post_category = PostCategory()
            post_category.post = post
            post_category.category = category
            post_category.save()
            i = i + 1
        

        post_created = {
            'post_created': True
        }
        return JsonResponse(post_created)

    post_created = {
        'post_created': False
    }
    return JsonResponse(post_created)



def create_comment(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)

        # get the post id of the post the comment is on
        post_id = info.get('post_id')
        post = Post.objects.get(id=post_id)
        
        comment = Comment()
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256']) 
        user = UserProfile.objects.get(username=data['username'])
        comment.post = post
        comment.user = user
        comment.text = info.get('comment')
        comment.save()

        comment_created = {
            'comment_created': True
        }
        return JsonResponse(comment_created)

    comment_created = {
        'comment_created': False
    }
    return JsonResponse(comment_created)


# XXX test!
def delete_comment(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)

        # id of comment to be deleted
        comment_id = info.get('comment')

        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256']) 
        user = UserProfile.objects.get(username=data['username'])
        
        # get the comment to be deleted from the database 
        comment = Comment.objects.get(id=comment_id)

        # the user who created a comment can delete it
        if comment.user == user:
            comment.delete()

            comment_deleted = {
                'comment_deleted': True
            }
            return JsonResponse(comment_deleted)

        # get the post on which the comment is made
        post = Post.objects.get(id=comment.post.id)
        
        # group admin of the post can delete the comment
        if post.group.user == user:
            comment.delete()

            comment_deleted = {
                'comment_deleted': True
            }
            return JsonResponse(comment_deleted)
        
        # user who made the post can delete the comment
        if post.user == user:
            comment.delete()

            comment_deleted = {
                'comment_deleted': True
            }
            return JsonResponse(comment_deleted)

    comment_deleted = {
        'comment_deleted': False
    }
    return JsonResponse(comment_deleted)



def update(request):
    if request.method == 'POST':
        info = json.loads(request.body)

        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)

        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])

        email = info.get('email')
        # info = info.get('avatar')
        # password = info.get('password')
        # password = make_password(password)

        if email:
            user.email = email

        user.save()
        # if password:
        #     user.password = password

        user_updated = {
            'updated': True
        }
        return JsonResponse(user_updated)



def delete_me(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)

        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        user.delete()
        user_deleted = {
            'user_deleted': True
        }
        return JsonResponse(user_deleted)
    
    user_deleted = {
        'user_deleted': False
    }
    return JsonResponse(user_deleted)



def user_information(request):
    if request.method == 'POST':
        info = json.loads(request.body)

        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)

        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])

        user_information = {
            'email': user.email
        }

        return JsonResponse(user_information)

def json_users(request):
    # User = get_user_model()
    # users =  User.objects.all()
    # users_json = []
    # for user in users:
    #     a = {
    #         'username': user.username,
    #         'email': user.email,
    #         'password': user.password
    #     }
    #     users_json.append(a)
    users = UserSerializer()
    print(users)
    return JsonResponse(users, safe=False)


def all_posts(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)
        
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        posts = []

        # first check if posts exists for user
        try:
            p1 = Post.objects.all()
        except Post.DoesNotExist:
            posts = {
                'post_user_exist': False 
            }
            return JsonResponse(posts)

        for p in Post.objects.all():
            for g in GroupMembers.objects.all():
                if g.user.id == user.id and g.group.id == p.group.id:

                    comments=[]
                    comments=get_post_comments_user(p.id)
                    categories=[]
                    categories = get_post_categories(p.id)

                    loc = (p.location_lat, p.location_lon)
                    locator = Nominatim(user_agent="myGeocoder")
                    coordinates = str(p.location_lat) + ", " + str(p.location_lon)
                    location = locator.reverse(coordinates)
                    location_data = location.raw
                    location_address = location_data['address']
                    location_values = list(location_address.values())

                    post = {
                        'title': p.title,
                        'id': p.id,
                        'content': p.content,
                        'time': date_format(p.time),
                        'location': location_values[0],
                        'group': p.group.groupname,
                        'category': categories,
                        'user': p.user.username,
                        'email': p.user.email,
                        'comments': comments
                    }
                    posts.append(post)

        for p in Post.objects.all():
            for g in GroupAdmins.objects.all():
                if g.user.id == user.id and g.group.id == p.group.id:
                    loc = (p.location_lat, p.location_lon)
                    locator = Nominatim(user_agent="myGeocoder")
                    coordinates = str(p.location_lat) + ", " + str(p.location_lon)
                    location = locator.reverse(coordinates)
                    location_data = location.raw
                    location_address = location_data['address']
                    location_values = list(location_address.values())

                    comments=[]
                    comments=get_post_comments_user(p.id)
                    categories=[]
                    categories = get_post_categories(p.id)

                    post = {
                        'title': p.title,
                        'id': p.id,
                        'content': p.content,
                        'time': date_format(p.time),
                        'location': location_values[0],
                        'group': p.group.groupname,
                        'category': categories,
                        'user': p.user.username,
                        'email': p.user.email,
                        'comments': comments
                    }
                    posts.append(post)

        return JsonResponse(posts, safe=False)

    posts = {
        'posts': None 
    }
    return JsonResponse(posts)


def get_post_categories(post):
    categories = []
    for c in PostCategory.objects.all():
        if c.post.id == post:
            category = {
                'name': c.category.name
            }
            categories.append(category)

    return categories

def get_post_comments(post): 
    comments = []
    
    # find all comments of the specific post
    for c in Comment.objects.all():
        if c.post.id == post:
            comments.append(c.text)

    return comments


def get_post_comments_user(post):
    comments = []
    
    # find all comments of the specific post
    for c in Comment.objects.all():
        if c.post.id == post:
            comment = {
                'comment_content': c.text,
                'user': c.user.username
            }
            comments.append(comment)

    return comments


# Get all usernames for selection
def get_users(request):
    
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)
        
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        # check that the user is the admin
        usernames = []
        for u in UserProfile.objects.all():
            if u.username != user.username: 
                username = {
                    'username': u.username
                }
                usernames.append(username)

        return JsonResponse(usernames, safe=False)

    usernames = {
        'users': None
    }
    return JsonResponse(usernames)


# Filter posts by user
def user_filter(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)
        
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        filter_user = info.get('user')
        filter_id = UserProfile.objects.get(username=filter_user)
        posts = []

        # first check if posts exists for user
        try:
            p1 = Post.objects.filter(user=filter_id).order_by('time').values_list('id', 'content', 'time', 'location_lat', 'location_lon', 'group', 'user', 'title')[:25]
        except Post.DoesNotExist:
            posts = {
                'post_user_exist': False 
            }
            return JsonResponse(posts)

        # check if the user is in the group on which the post was made
        # (only users in the group can view the comments)
        valid_request = False
        p2 = list(p1)
        for p in p2:
            for g in GroupMembers.objects.all():
                if g.user.id == user.id and g.group.id == p[5]:
                    comments = []
                    comments=get_post_comments_user(p[0])
                    categories = []
                    categories = get_post_categories(p[0])
                    post = {
                        'title': p[7],
                        'id': p[0],
                        'content': p[1],
                        'time': date_format(p[2]),
                        'location_lat': p[3],
                        'location_lon': p[4],
                        'group': Group.objects.get(id=p[5]).groupname,
                        'category': categories,
                        'user': filter_user,
                        'comments': comments
                    }
                    posts.append(post)
                    valid_request = True

        for p in p2:
            for g in GroupAdmins.objects.all():
                if g.user.id == user.id and g.group.id == p[5]:
                    comments = []
                    comments=get_post_comments_user(p[0])
                    categories = []
                    categories = get_post_categories(p[0])
                    post = {
                        'title': p[7],
                        'id': p[0],
                        'content': p[1],
                        'time': date_format(p[2]),
                        'location_lat': p[3],
                        'location_lon': p[4],
                        'group': Group.objects.get(id=p[5]).groupname,
                        'category': categories,
                        'user': p[6],
                        'comments': comments
                    }
                    posts.append(post)
                    valid_request = True

        if not valid_request:
            posts = {
                'posts_none': True 
            }
            return JsonResponse(posts)

        return JsonResponse(posts, safe=False)

    posts = {
        'posts_none': True 
    }
    return JsonResponse(posts)


def all_groups(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)

        groups = []
        for g in Group.objects.all():
            group = {
                'id': g.id,
                'group_name': g.groupname
            }
            groups.append(group)

        return JsonResponse(groups, safe=False)

def join_group(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)

        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        group_id = info.get('group_id')

        for g in GroupAdmins.objects.all():
            if g.user.id == user.id and g.group.id == group_id:
                # print('Is it here')
                group_joined = {
                    'joined': False
                }
                return JsonResponse(group_joined)


        for g in GroupMembers.objects.all():
            if g.user.id == user.id and g.group.id == group_id:
                # print('or here')
                group_joined = {
                    'joined': False
                }
                return JsonResponse(group_joined)

        
        group = Group.objects.get(id=group_id)
        new_member = GroupMembers()
        new_member.user = user 
        new_member.group = group
        new_member.save()

        group_joined = {
            'joined': True
        }
        return JsonResponse(group_joined)

    group_joined = {
        'joined': False
    }
    return JsonResponse(group_joined)


def add_friend(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)

        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        friend = info.get('friend')
        new_friend = UserProfile.objects.get(username=friend)
        for f in Friends.objects.all():
            if f.friend.id == new_friend.id and f.user.id == user.id:
                # friend is already added
                friend_added = {
                    'friend_added': False
                }
                return JsonResponse(friend_added)


        # for g in GroupMembers.objects.all():
        #     if g.user.id == user.id and g.group.id == group_id:
        #         # print('or here')
        #         group_joined = {
        #             'joined': False
        #         }
        #         return JsonResponse(group_joined)

        
        friend_to_add = Friends()
        friend_to_add.user = user 
        friend_to_add.friend = new_friend
        friend_to_add.save()

        friend_added = {
            'friend_added': True
        }
        return JsonResponse(friend_added)

    friend_added = {
        'friend_added': False
    }
    return JsonResponse(friend_added)

# Get all user friends
def get_all_friends(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)
        
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        # check that the user is the admin
        friends = []
        for f in Friends.objects.all():
            if f.user == user:
                friend_name = {
                    'friend_name': f.friend.username
                }
                friends.append(friend_name)

        return JsonResponse(friends, safe=False)

    friends = {
        'friends': None
    }
    return JsonResponse(friends)


# Filter posts by time
def time_filter(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)
        
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        time = info.get('time')
        if time == "hour":
            time_filter = datetime.now() - timedelta(hours=1)      
        elif time == "day":
            time_filter = datetime.now() - timedelta(days=1)
        elif time == "week":
            time_filter = datetime.now() - timedelta(weeks=1)

        settings.TIME_ZONE
        aware_datetime = make_aware(time_filter)
        aware_datetime.tzinfo
        posts = []

        # first check if posts exists for time
        try:
            p1 = Post.objects.filter(time__gte=aware_datetime).order_by('-time').values_list('id', 'content', 'time', 'location_lat', 'location_lon', 'group', 'user', 'title')[:25]
        except Post.DoesNotExist:
            posts = {
                'post_time_exist': False 
            }
            return JsonResponse(posts)

        valid_request = False
        p2 = list(p1)
        for p in p2:
            for g in GroupMembers.objects.all():
                if g.user.id == user.id and g.group.id == p[5]:
                    
                    new_user = UserProfile.objects.get(id=p[6])
                    comments = []
                    comments=get_post_comments_user(p[0])
                    categories = []
                    categories = get_post_categories(p[0])
                    post = {
                        'title': p[7],
                        'id': p[0],
                        'content': p[1],
                        'time': date_format(p[2]),
                        'location_lat': p[3],
                        'location_lon': p[4],
                        'group': Group.objects.get(id=p[5]).groupname,
                        'category': categories,
                        'user': new_user.username,
                        'email': new_user.email,
                        'comments': comments
                    }
                    posts.append(post)
                    valid_request = True

        for p in p2:
            for g in GroupAdmins.objects.all():
                if g.user.id == user.id and g.group.id == p[5]:
                    print(p[6])
                    new_user = UserProfile.objects.get(id=p[6])
                    comments = []
                    comments=get_post_comments_user(p[0])
                    categories = []
                    categories = get_post_categories(p[0])
                    post = {
                        'title': p[7],
                        'id': p[0],
                        'content': p[1],
                        'time': date_format(p[2]),
                        'location_lat': p[3],
                        'location_lon': p[4],
                        'group': Group.objects.get(id=p[5]).groupname,
                        'category': categories,
                        'user': new_user.username,
                        'email': new_user.email,
                        'comments': comments
                    }
                    posts.append(post)
                    valid_request = True

        if not valid_request:
            posts = {
                'posts_none': True 
            }
            return JsonResponse(posts)

        return JsonResponse(posts, safe=False)

    posts = {
        'posts_none': True 
    }
    return JsonResponse(posts)


# Filter posts by group
def group_filter(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)
        
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        filter_group = info.get('group')
        filter_id = Group.objects.get(groupname=filter_group)
        posts = []

        # first check if posts exists for user
        try:
            p1 = Post.objects.filter(group=filter_id).order_by('time').values_list('id', 'content', 'time', 'location_lat', 'location_lon', 'group', 'user', 'title')[:25]
        except Post.DoesNotExist:
            posts = {
                'post_user_exist': False 
            }
            return JsonResponse(posts)

        valid_request = False
        p2 = list(p1)
        for p in p2:
            for g in GroupMembers.objects.all():
                if g.user.id == user.id and g.group.id == p[5]:
                    new_user = UserProfile.objects.get(id=p[6])
                    comments = []
                    comments=get_post_comments_user(p[0])
                    categories = []
                    categories = get_post_categories(p[0])

                    post = {
                        'title': p[7],
                        'id': p[0],
                        'content': p[1],
                        'time': date_format(p[2]),
                        'location_lat': p[3],
                        'location_lon': p[4],
                        'group': Group.objects.get(id=p[5]).groupname,
                        'category': categories,
                        'user': new_user.username,
                        'email': new_user.email,
                        'comments': comments
                    }
                    posts.append(post)
                    valid_request = True

        for p in p2:
            for g in GroupAdmins.objects.all():
                if g.user.id == user.id and g.group.id == p[5]:
                    new_user = UserProfile.objects.get(id=p[6])
                    comments = []
                    comments=get_post_comments_user(p[0])
                    categories = []
                    categories = get_post_categories(p[0])

                    post = {
                        'title': p[7],
                        'id': p[0],
                        'content': p[1],
                        'time': date_format(p[2]),
                        'location_lat': p[3],
                        'location_lon': p[4],
                        'group': Group.objects.get(id=p[5]).groupname,
                        'category': categories,
                        'user': new_user.username,
                        'email': new_user.email,
                        'comments': comments
                    }
                    posts.append(post)
                    valid_request = True

        if not valid_request:
            posts = {
                'posts_none': True 
            }
            return JsonResponse(posts)

        return JsonResponse(posts, safe=False)

    posts = {
        'posts_none': True 
    }
    return JsonResponse(posts)



# Filter posts by category
def category_filter(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)
        
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        filter_category = info.get('category')

        try:
            filter_id = Category.objects.get(name=filter_category)
        except:
            posts = {
                'category_exists': False
            }
            return JsonResponse(posts)
            
        posts = []

        # first check if posts exists for user
        try:
            p1 = PostCategory.objects.filter(category=filter_id).values_list('id')[:25]
        except Post.DoesNotExist:
            posts = {
                'post_user_exist': False 
            }
            return JsonResponse(posts)


        valid_request = False
        p2 = list(p1)
        # print(p1)
        for p in p2:
            # print(p[0])
            try:
                p3 = PostCategory.objects.get(id=p[0])
                p3 = Post.objects.get(id=p3.post.id)
            except:
                continue
            for g in GroupMembers.objects.all():
                if g.user.id == user.id and g.group.id == p3.group.id:
                    comments = []
                    comments=get_post_comments_user(p3.id)

                    categories = []
                    categories = get_post_categories(p3.id)

                    post = {
                        'title': p3.title,
                        'id': p3.id,
                        'content': p3.content,
                        'time': date_format(p3.time),
                        'location_lat': p3.location_lat,
                        'location_lon': p3.location_lon,
                        'group': p3.group.groupname,
                        'category': categories,
                        'user': p3.user.username,
                        'email': p3.user.email,
                        'comments': comments
                    }
                    posts.append(post)
                    valid_request = True

        for p in p2:
            try:
                p3 = PostCategory.objects.get(id=p[0])
                p3 = Post.objects.get(id=p3.post.id)
            except:
                continue
            # p3 = Post.objects.get(id=p.p[0])
            for g in GroupAdmins.objects.all():
                if g.user.id == user.id and g.group.id == p3.group.id:
                    comments = []
                    comments=get_post_comments_user(p[0])

                    categories = []
                    categories = get_post_categories(p3.id)

                    post = {
                        'title': p3.title,
                        'id': p3.id,
                        'content': p3.content,
                        'time': date_format(p3.time),
                        'location_lat': p3.location_lat,
                        'location_lon': p3.location_lon,
                        'group': p3.group.groupname,
                        'category': categories,
                        'user': p3.user.username,
                        'email': p3.user.email,
                        'comments': comments
                    }
                    posts.append(post)
                    valid_request = True

        if not valid_request:
            posts = {
                'posts_none': True 
            }
            return JsonResponse(posts)

        return JsonResponse(posts, safe=False)

    posts = {
        'posts_none': True 
    }
    return JsonResponse(posts)

# Filter by location of user
def location_filter(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        token = info.get('token')
        if not check_token(token):
            valid_token = {
                'valid_token': False
            }
            return JsonResponse(valid_token)
        
        token = token.split(' ')[1]
        global SECRET_KEY
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = UserProfile.objects.get(username=data['username'])
        radius = info.get('radius')
        longitude = info.get('long')
        latitude = info.get('lat')
        loc1 = (float(latitude), float(longitude))

        posts = []

        # first check if posts exists for location
        # try:
        #     p1 = Post.objects.filter(location_lon__gte=long_lower, location_lon__lte=long_upper, location_lat__gte=lat_lower, location_lat__lte=lat_upper).order_by('-time').values_list('id', 'content', 'time', 'location_lat', 'location_lon', 'group', 'category', 'user')[:25]
        # except Post.DoesNotExist:
        #     posts = {
        #         'post_time_exist': False 
        #     }
        #     return JsonResponse(posts)

        # valid_request = False
        # p2 = list(p1)
        # for p in p2:
        #     locator = Nominatim(user_agent="myGeocoder")
        #     coordinates = str(p[3]) + ", " + str(p[4])
        #     location = locator.reverse(coordinates)

        #     comments = []
        #     comments=get_post_comments_user(p[0])

        #     post = {
        #         'content': p[1],
        #         'time': p[2],
        #         'location': location.address['city'],
        #         'group': p[5],
        #         'category': p[6],
        #         'user': p[7],
        #         'comments': comments
        #     }
        #     posts.append(post)
        #     valid_request = True

        valid_request = False
        for p in Post.objects.all():
            for g in GroupMembers.objects.all():
                if g.user.id == user.id and g.group.id == p.group.id:
                    
                    loc2 = (p.location_lat, p.location_lon)
                    d = hs.haversine(loc1,loc2)

                    if (d <= float(radius)):
                        locator = Nominatim(user_agent="myGeocoder")
                        coordinates = str(p.location_lat) + ", " + str(p.location_lon)
                        location = locator.reverse(coordinates)
                        location_data = location.raw
                        location_address = location_data['address']
                        location_values = list(location_address.values())

                        comments = []
                        comments=get_post_comments_user(p.id)

                        categories = []
                        categories = get_post_categories(p.id)

                        post = {
                            'title': p.title,
                            'id': p.id,
                            'content': p.content,
                            'time': date_format(p.time),
                            'location': location_values[0],
                            'group': p.group.groupname,
                            'category': categories,
                            'user': p.user.username,
                            'email': p.user.email,
                            'comments': comments,
                            'distance': d
                        }
                        posts.append(post)
                        valid_request = True

        for p in Post.objects.all():
            for g in GroupAdmins.objects.all():
                if g.user.id == user.id and g.group.id == p.group.id:
                    
                    loc2 = (p.location_lat, p.location_lon)
                    d = hs.haversine(loc1,loc2)

                    if (d <= float(radius)):
                        locator = Nominatim(user_agent="myGeocoder")
                        coordinates = str(p.location_lat) + ", " + str(p.location_lon)
                        location = locator.reverse(coordinates)
                        location_data = location.raw
                        location_address = location_data['address']
                        location_values = list(location_address.values())

                        comments = []
                        comments=get_post_comments_user(p.id)

                        categories = []
                        categories = get_post_categories(p.id)

                        post = {
                            'title': p.title,
                            'id': p.id,
                            'content': p.content,
                            'time': p.time,
                            'location': location_values[0],
                            'group': p.group.groupname,
                            'category': categories,
                            'user': p.user.username,
                            'email': p.user.email,
                            'comments': comments,
                            'distance': d
                        }
                        posts.append(post)
                        valid_request = True

        if not valid_request:
            posts = {
                'posts_none': True 
            }
            return JsonResponse(posts)
        
        sorted_posts = sorted(posts, key = lambda i: i['distance'])

        return JsonResponse(sorted_posts, safe=False)

    posts = {
        'posts_none': True 
    }
    return JsonResponse(posts)


def date_format(date):
    date = str(date)
    year = date.split('-')[0]
    month = date.split('-')[1]
    day = date.split('-')[2]
    t = day.index(' ')
    day = day[:t]
    time = day[t+1:]
    month = int(month)
    if month == 1:
        month_s = 'January'
    elif month == 2:
        month_s = 'February'
    elif month == 3:
        month_s = 'March'
    elif month == 4:
        month_s = 'April'
    elif month == 5:
        month_s = 'May'
    elif month == 6:
        month_s = 'June'
    elif month == 7:
        month_s = 'July'
    elif month == 8:
        month_s = 'August'
    elif month == 9:
        month_s = 'September'
    elif month == 10:
        month_s = 'October'
    elif month == 11:
        month_s = 'November'
    elif month == 12:
        month_s = 'December'
    return f'{month_s} {day}, {year}'
