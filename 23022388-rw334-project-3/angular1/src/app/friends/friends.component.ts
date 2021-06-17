import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../routing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  constructor(private api: ApiService, private router: RoutingService, private snackBar: MatSnackBar) { }


  users: any[] = [];
  users_copy: any[] = [];
  search = '';
  friends: any[] = [];

  ngOnInit(): void {
    let loggedIn = JSON.parse(localStorage.getItem('loggedIn') || 'false');
    if (!loggedIn) {
      this.router.gotoLogin();
    }
    this.api.getAllUsers().subscribe((data) => {
      let users: any = data;
      for (let user of users) {
        this.users.push(user.username);
      }
    });
    this.api.getFriends().subscribe((data) => {
      let friends: any = data;
      for (let friend of friends) {
        this.friends.push(friend);
      }
    });
  }

  add_friend(user: string) {
    this.api.addFriend(user).subscribe((resp) => {
      let response: any = resp;
      if (response.errors) {
        // We have an error
        this.snackBar.open("Server error", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center"
        });
      } else if (response.friend_added) {
        // Success
        this.snackBar.open("Successfully added friend", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center"
        });
      } else {
        // Failure
        this.snackBar.open("You have already added this person as a friend", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center"
        });
      }
    });
  }

  refineList() {
    this.users = []
    for (let item of this.users_copy) {
      if (item.group_name.toLowerCase().includes(this.search.toLowerCase())) {
        this.users.push(item);
      }
    }
  }
}
