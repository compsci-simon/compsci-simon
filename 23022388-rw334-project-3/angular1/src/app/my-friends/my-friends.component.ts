import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../routing.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.css']
})
export class MyFriendsComponent implements OnInit {

  constructor(private api: ApiService, private router: RoutingService) { }

  friends: any[] = [];
  ngOnInit(): void {
    this.api.getFriends().subscribe((data) => {
      let friends: any = data;
      for (let friend of friends) {
        this.friends.push(friend);
      }
    });

    
  }

  reload() {
    this.api.getFriends().subscribe((data) => {
      this.friends = [];
      let friends: any = data;
      for (let friend of friends) {
        this.friends.push(friend);
      }
    });
  }


}
