import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) { }

  gotoLogin () {
    this.router.navigate(['login']);
  }

  gotoRegister() {
    this.router.navigate(['register']);
  }

  refresh(): void {
    window.location.reload();
  }

  gohome() {
    this.router.navigate(['home']);
  }

  logout() {
    this.router.navigate(['']);
  }
}
