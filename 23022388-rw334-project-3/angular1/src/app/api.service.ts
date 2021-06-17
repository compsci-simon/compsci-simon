import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from './Post';
import { Group } from './Group';
import { Emitters } from './Emitter';
import { RoutingService } from './routing.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: RoutingService) { }

  userExists(username: string) {
    return this.http.get(`http://localhost:8000/api/user_exists?username=${username}`);
  }

  registerUser(username: string, email: string, password: string) {
    let body = {username: username, email: email, password: password, image:'None'}
    let url = `http://localhost:8000/api/register`;
    return this.http.post(url, body);
  }

  loginUser(username: string, password: string, remember_me: boolean) {
    let body = {
      username: username, 
      password: password,
      remember_me: remember_me
    };
    let url = `http://localhost:8000/api/login`;
    return this.http.post(url, body);
  }

  logout() {
    localStorage.clear();
    Emitters.authEmitter.emit(false);
    this.router.logout();
  }

  createGroup(group_name: string) {
    let url = `http://localhost:8000/api/create_group`;
    let token = localStorage.getItem('token');
    let body = {token: `Bearer ${token}`, group_name: group_name}
    return this.http.post(url, body);
  }

  getUserAdminGroups() {
    let url = 'http://localhost:8000/api/groups/admin';
    let token = localStorage.getItem('token');
    let body = { token: "Bearer "+token };
    return this.http.post(url, body);
  }

  deleteGroup(group_name: string) {
    let url = 'http://localhost:8000/api/delete_group';
    let token = localStorage.getItem('token');
    let body = { token: "Bearer " + token, group_name: group_name };
    return this.http.post(url, body);
  }

  getGroupsBelong() {
    let url = 'http://localhost:8000/api/groups/belong';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer "+ token
    };
    return this.http.post(url, body);
  }

  createPost(title: string, content: string, group_name: string, category: string[], location: string) {
    let url = 'http://localhost:8000/api/post/create';
    let token = localStorage.getItem('token');
    let body = { 
      token: "Bearer " + token,
      title: title,
      content: content,
      group_name: group_name,
      category1: category[0],
      category2: category[1],
      category3: category[2],
      location: location
    };
    return this.http.post(url, body);
  }

  getUserInfo() {
    let url = 'http://localhost:8000/api/user/information';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token
    };
    return this.http.post(url, body);
  }

  getAllPosts() {
    let url = 'http://localhost:8000/api/posts/all';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token
    };
    return this.http.post<Post[]>(url, body);
  }

  getAllUsers() {
    let url = 'http://localhost:8000/api/users/all';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token
    };
    return this.http.post(url, body);
  }

  getPostForUser(user: string) {
    let url = 'http://localhost:8000/api/posts/filter/user';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token, user: user
    };
    return this.http.post(url, body);
  }

  deleteMyAccount() {
    let url = 'http://localhost:8000/api/user/delete';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token
    };
    return this.http.post(url, body);
  }

  createComment(comment: string, post_id: number) {
    let url = 'http://localhost:8000/api/comment/create';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token, comment: comment, post_id: post_id
    };
    return this.http.post(url, body);
  }

  getAllGroups() {
    let url = 'http://localhost:8000/api/groups/all';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token
    };
    return this.http.post<Group[]>(url, body);
  }

  joinGroup(group_id: number) {
    let url = 'http://localhost:8000/api/group/join';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token, group_id: group_id
    };
    return this.http.post<Group[]>(url, body);
  }

  getFriends() {
    let url = 'http://localhost:8000/api/friends/added';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token
    };
    return this.http.post<Group[]>(url, body);
  }

  addFriend(friend: string) {
    let url = 'http://localhost:8000/api/friend/add';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token, friend: friend
    };
    return this.http.post<Group[]>(url, body);
  }

  filterPostsTime(time: string) {
    let url = 'http://localhost:8000/api/filter/time';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token, time: time
    };
    return this.http.post(url, body);
  }

  filterPostsUser(user: string) {
    let url = 'http://localhost:8000/api/filter/user';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token, user: user
    };
    return this.http.post(url, body);
  }

  filterPostsGroup(group: string) {
    let url = 'http://localhost:8000/api/filter/group';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token, group: group
    };
    return this.http.post(url, body);
  }

  filterPostsCategory(category: string) {
    let url = 'http://localhost:8000/api/filter/category';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token, category: category
    };
    return this.http.post(url, body);
  }

  filterPostsLocation(radius: number, lat: number, long: number) {
    let url = 'http://localhost:8000/api/filter/location';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token, radius: radius, lat:lat, long:long
    };
    return this.http.post(url, body);
  }

  changeEmail(email: string) {
    let url = 'http://localhost:8000/api/user/update';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token, email: email
    };
    return this.http.post(url, body);
  }

  validateLoggedIn() { // Remember to implement this function
    let url = 'http://localhost:8000/api/token/check';
    let token = localStorage.getItem('token');
    let body = {
      token: "Bearer " + token
    };
    return this.http.post(url, body);
  }
  
}
