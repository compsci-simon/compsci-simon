import { Component, OnInit } from '@angular/core';
import { Emitters } from '../Emitter';
import { RoutingService } from '../routing.service';

@Component({
  selector: 'app-navbar-erin',
  templateUrl: './navbar-erin.component.html',
  styleUrls: ['./navbar-erin.component.css']
})
export class NavbarErinComponent implements OnInit {

  loggedIn: boolean = false;
  email = localStorage.getItem('myEmail');
  username = localStorage.getItem('username');

  constructor(private router: RoutingService) {
    let logged = localStorage.getItem('loggedIn')?.toString;
    if (logged) {
      this.loggedIn = true;
    }
  }

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((data) => {
      this.loggedIn = data;
    });
    console.log(this.email);
  }

  logout() {
    localStorage.clear();
    this.loggedIn = false;
    this.router.logout();
  }

}
