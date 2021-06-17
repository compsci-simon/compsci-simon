import { Component, OnInit } from '@angular/core';
import { Emitters } from '../Emitter';
import { RoutingService } from '../routing.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn: boolean = false;

  constructor(private router: RoutingService) {
    let loggedIn = JSON.parse(localStorage.getItem('loggedIn') || 'false');
    if (loggedIn) {
      this.loggedIn = true;
    }
  }

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((data) => this.loggedIn = data)
  }

  logout() {
    localStorage.clear()
    this.loggedIn = false;
    this.router.logout();
  }

}
