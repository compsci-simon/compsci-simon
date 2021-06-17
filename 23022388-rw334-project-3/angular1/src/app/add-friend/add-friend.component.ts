import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../routing.service';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent implements OnInit {

  constructor(private api: ApiService, private router: RoutingService, private snackBar: MatSnackBar) { }

  users: any[] = [];
  users_copy: any[] = [];
  search = '';

  ngOnInit(): void {
    let loggedIn = JSON.parse(localStorage.getItem('loggedIn') || 'false');
    if (!loggedIn) {
      this.router.gotoLogin();
    }
    this.api.getAllUsers().subscribe((data) => {
      let users: any = data;
      for (let user of users) {
        this.users.push(user.username);
        this.users_copy.push(user.username);
      }
    });
  }

  add_friend(user: string) {
    this.api.addFriend(user).subscribe((resp) => {
      let response: any = resp;
      if (response.errors) {
        // We have an error
        let snack = this.snackBar.open("Server error", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center"
        });
        snack.afterDismissed().subscribe(() => {
          this.router.refresh();
        });
      } else if (response.friend_added) {
        // Success
        let snack = this.snackBar.open("Successfully added friend", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center"
        });
        snack.afterDismissed().subscribe(() => {
          this.router.refresh();
        });
      } else {
        // Failure
        let snack = this.snackBar.open("You have already added this person as a friend", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center"
        });
        snack.afterDismissed().subscribe(() => {
          this.router.refresh();
        });
      }
    });
  }

  refineList() {
    this.users = []
    for (let item of this.users_copy) {
      if (item.toLowerCase().includes(this.search.toLowerCase())) {
        this.users.push(item);
      }
    }
  }
}
