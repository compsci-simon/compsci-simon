"""project3 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static
from api import views as api_views
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register', api_views.register, name='register-view'),
    path('api/user_exists', api_views.user_exists, name='user-exists'),
    # path('api/valid_email', api_views.valid_email, name='valid-email'),
    # path('api/valid_password', api_views.valid_password, name='valid-password'),
    path('api/login', api_views.login, name='login'),
    path('api/test', api_views.test, name='test'),
    path('api/create_group', api_views.create_group, name='create-group'),
    path('api/delete_group', api_views.delete_group, name='delete-group'),
    path('api/groups/admin', api_views.get_groups_admin, name='admin-group'),
    path('api/groups/belong', api_views.get_groups_belong, name='belong-group'),
    path('api/post/create', api_views.post, name='post'),
    path('api/comment/create', api_views.create_comment, name='create-comment'),
    path('api/comment/delete', api_views.delete_comment, name='delete-comment'),
    path('api/get_post_comments', api_views.get_post_comments, name='post-comment'),
    path('api/user/update', api_views.update, name='update'),
    path('api/user/delete', api_views.delete_me, name='delete-me'),
    path('api/user/information', api_views.user_information, name='update'),
    path('api/posts/all', api_views.all_posts, name='all-posts'),
    path('api/users/all', api_views.get_users, name='all-users'),
    path('api/filter/user', api_views.user_filter, name='filter-user'),
    path('api/groups/all', api_views.all_groups, name='all-groups'),
    path('api/group/join', api_views.join_group, name='join-group'),
    # path('logout/', auth_views.LogoutView.as_view(template_name='users/logout.html'), name='logout'),
    path('json_objects/', api_views.json_users, name='json'),
    path('api/filter/time', api_views.time_filter, name='filter-time'),
    path('api/filter/group', api_views.group_filter, name='filter-group'),
    path('api/filter/category', api_views.category_filter, name='filter-category'),
    path('api/filter/location', api_views.location_filter, name='filter-location'),
    path('api/friend/add', api_views.add_friend, name='add-friend'),
    path('api/friends/added', api_views.get_all_friends, name='all-friends')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)