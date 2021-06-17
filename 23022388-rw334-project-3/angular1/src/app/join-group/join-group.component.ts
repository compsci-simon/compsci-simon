import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';
import { Group } from '../Group';

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.component.html',
  styleUrls: ['./join-group.component.css']
})
export class JoinGroupComponent implements OnInit {

  groups: Group[] = [];
  groups_copy: Group[] = [];
  search = '';

  constructor(private api: ApiService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.api.getAllGroups().subscribe((groups) => {
      for (let group of groups) {
        this.groups.push(group);
        this.groups_copy.push(group);
      }
    });
  }

  join_group(id: number) {
    this.api.joinGroup(id).subscribe((resp) => {
      let response: any = resp;
      if (response.errors) {
        // We have an error
        this.snackBar.open("Server error", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center"
        });
      } else if (response.joined) {
        // Success
        this.snackBar.open("Successfully joined group", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center"
        });
      } else {
        // Failure
        this.snackBar.open("You are already a member", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center"
        });
      }
    });
  }

  refineList() {
    this.groups = []
    for (let item of this.groups_copy) {
      if (item.group_name.toLowerCase().includes(this.search.toLowerCase())) {
        this.groups.push(item);
      }
    }
  }

}
