import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {

  groups: string[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getUserAdminGroups().subscribe(data => {
      let groups: any = data; 
      let resp: any = data
      // Checking for valid token
      if (resp.valid_token == false) {
        this.api.logout();
      }
      for (let item of groups) {
        this.groups.push(item.group_name)
      }
    });
  }

  test() {
  }

}
