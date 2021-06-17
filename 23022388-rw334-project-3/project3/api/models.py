from django.db import models
from django.contrib.auth.models import User
from PIL import Image

# Create your models here.
class UserProfile(models.Model):
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=150, default='noname')
    email = models.EmailField(max_length=254, default='default@email.com')
    password = models.CharField(max_length=100, default='nopassword')
    # image = models.CharField(max_length=100, default='default.jpg')

    def __str__(self):
        return f'{self.username} Profile'

    def save(self):
        super().save()

class Group(models.Model):
    groupname = models.CharField(max_length=100, default=None)

class GroupAdmins(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, default=0)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE) 

    def __str__(self):
        return f'{self.groupname} Group '


class GroupMembers(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, default=0)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.group} Group {self.user} Member'


class Friends(models.Model):
    user = models.ForeignKey(UserProfile, related_name='user_original', on_delete=models.CASCADE, default=None)
    friend = models.ForeignKey(UserProfile, related_name='friend_to_add', on_delete=models.CASCADE, default=None)


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.name} Category'


class Post(models.Model):
    title = models.CharField(max_length=100, default='')
    content = models.TextField(default='')
    time = models.DateTimeField(auto_now_add=True)
    location_lat = models.FloatField()
    location_lon = models.FloatField()
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    # category = models.ForeignKey(Category, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, default=None)


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, default=None)
    time = models.DateTimeField(auto_now_add=True)
    text = models.CharField(max_length=254, default='none')

class PostCategory(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
