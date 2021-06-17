import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  email = '';

  constructor( private api: ApiService) {

  }

  ngOnInit(): void {
    this.api.getUserInfo().subscribe((data) => {
      let resp: any = data;
      // Checking for valid token
      if (resp.valid_token == false) {
        this.api.logout();
      }
      this.email = resp.email;
    });

  }

  test() {
    this.api.getUserInfo().subscribe((data) => {
      let resp: any = data;
      console.log(resp);
    });
  }

  submitHandler() {
    this.api.changeEmail(this.email).subscribe((data) => {
      let resp: any = data;
      if (resp.errors) {
        // We have an error
      } else if (resp.updated){
        // Success
      }
    });
  }

}
