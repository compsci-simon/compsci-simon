import { Component, OnInit } from '@angular/core';
import { Post } from '../Post';
import { Comment } from '../Comment';
import { ApiService } from '../api.service';
import { NgForm } from '@angular/forms';
import { RoutingService } from '../routing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(private api: ApiService, private router: RoutingService) {
  }
              
  ngOnInit(): void {

    let loggedIn = JSON.parse(localStorage.getItem('loggedIn') || 'false');
    if (!loggedIn) {
      this.router.gotoLogin();
    }
    this.api.getAllPosts().subscribe(data => {
      let res: any = data
      console.log(res);
      if (res.valid_token == false) {
        this.api.logout();
      }
      for (let post of data) {
        this.posts.push(post);
      }
    });
    //this.sortByTime()

    this.api.getAllUsers().subscribe((data) => {
      let users: any = data;
      for (let user of users) {
        this.users.push(user.username);
      }
    })
    this.api.getGroupsBelong().subscribe(data => {
      let resp: any = data;
      
      // Checking for valid token
      if (resp.valid_token == false) {
        this.api.logout();
      }
      for (let item of resp) {
        this.groups.push(item.group_name)
      }
    });
  }

  posts: Post[] = []
  users: string[] = []
  selectedName = '';
  commentString = '';
  times:any = [
                {"text": "Last hour", "value": "hour"}, 
                {"text": "Last day", "value": "day"}, 
                {"text": "Last week", "value": "week"}, 
              ];
              locations: any = [
                {"text": "Within 5km", "value": 5},
                {"text": "Within 10km", "value": 10},
                {"text": "Within 100km", "value": 100},
              ]
  

  selectedFilter: string = '';
  selectedSort = 'Time'
  filters = [{option: 'Time'}, {option: 'Location'}, {option: 'Category'}, {option: 'Group'}, {option: 'User'}];
  sorts = [{option: 'Time'}, {option: 'Location'}];
  groups: string[] = [];
  categories: string[] = ['nature', 'tech', 'finance', 'Art', 'History', 'Sport'];
  selectedTime: string = '';
  selectedLocation: string = '';
  selectedCategory: string = '';
  selectedGroup: string = '';
  selectedUser: string = '';
  search_boolean: boolean[] = [];

  onChangeFilter() {
    this.search_boolean = [false,false,false,false,false];
    if (this.selectedFilter === 'Time') {
      this.search_boolean[0] = true;
    } else if (this.selectedFilter === 'Location') {
      this.search_boolean[1] = true;
    } else if (this.selectedFilter === 'Category') {
      this.search_boolean[2] = true;
    } else if (this.selectedFilter === 'Group') {
      this.search_boolean[3] = true;
    } else if (this.selectedFilter === 'User') {
      this.search_boolean[4] = true;
    }
  }

  lat: number = -1;
  long: number = -1;

  filter() {
    if (this.selectedFilter == "Time") {
      this.api.filterPostsTime("hour").subscribe((data) => {
        let resp: any = data;
        console.log(resp)
        if (resp.posts_none == true) {
          // there were no post for selected time
          this.posts = []
        } else {
          this.posts = []
          for (let post of resp) {
            this.posts.push(post);
          }
        }
      })
    } else if (this.selectedFilter == "User") {
      console.log(this.selectedFilter)
      console.log(this.selectedUser)
      this.api.filterPostsUser(this.selectedUser).subscribe((data) => {
        let resp: any = data;
        console.log(resp)
        if (resp.posts_none == true) {
          // there were no post for selected user
          this.posts = []
        } else {
          this.posts = []
          for (let post of resp) {
            this.posts.push(post);
          }
        }
      })
    } else if (this.selectedFilter == "Group") {
      this.api.filterPostsGroup(this.selectedGroup).subscribe((data) => {
        let resp: any = data;
        console.log(resp)
        if (resp.posts_none == true) {
          // there were no post for selected group
          this.posts = []
        } else {
          this.posts = []
          for (let post of resp) {
            this.posts.push(post);
          }  
        }
      })
    } else if (this.selectedFilter == "Category") {
      this.api.filterPostsCategory(this.selectedCategory).subscribe((data) => {
        let resp: any = data;
        console.log(resp)
        if (resp.posts_none == true) {
          // there were no post for selected category
          this.posts = [];
        } else if (resp.category_exists == false){
          this.posts = [];
        } else {
          this.posts = []
          for (let post of resp) {
            this.posts.push(post);
          }  
        }
      })
    } else if (this.selectedFilter == "Location") {
      if (!navigator.geolocation) {
        console.log("Location is not supported")
      }
      if (!navigator.geolocation) {
        console.log("location not available");
      }
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.api.filterPostsLocation(Number(this.selectedLocation), this.lat, this.long).subscribe((data) => {
          let resp: any = data;
          console.log(resp)
          if (resp.posts_none == true) {
            // there were no post for selected location
            this.posts = []
          } else {
            this.posts = []
            for (let post of resp) {
              this.posts.push(post);
            }
          }
        });
      });
      
    } 
  }

  onChangeSort() {
    if (this.selectedSort == "Time") {
      this.sortByTime()
    } else if (this.selectedSort == "Location") {
      this.sortByLocation()
    }
  }

  sortByTime() {
    let dates: any = [];
    for (let post of this.posts) {
      let time = Date.parse(this.posts[0].time.toString());
      dates.push(time);
    }
    for (let item of dates) {
      console.log(item)
    }
    for (let i = 0; i < dates.length; i++) {
      for (let j = i; j > 0; j--) {
        if (dates[j] < dates[j-1]) {
          let temp = dates[j];
          let tempp: Post = this.posts[j];
          dates[j] = dates[j - 1];
          this.posts[j] = this.posts[j - 1];
          dates[j - 1] = temp;
          this.posts[j - 1] = tempp;
        }
      }
    }
    console.log(this.posts)
  }

  sortByLocation() {
  }


  nameChanged() {
    this.api.getPostForUser(this.selectedName).subscribe(data => {
      this.posts = []
      let resp: any = data;
      console.log(data);
      for (let post of resp) {
        this.posts.push(post)
      }
    })
  }


  comment(post: Post, formValue: any, form: NgForm) {
    let comment: Comment = {comment_content:formValue.commentInput, user:"none"};
    this.api.createComment(formValue.commentInput, post.id).subscribe((data) => {
      let resp: any = data;
      console.log(resp)
      if (resp.errors) {
        // We have an error
      } else if (resp.comment_created) {
        // Success
        let p: Post;
        for (p of this.posts) {
          if (p.id === post.id) {
            p.comments.push(comment);
          }
        }
      } else {
        // Failure
      }
    });
    form.reset();
  }

}