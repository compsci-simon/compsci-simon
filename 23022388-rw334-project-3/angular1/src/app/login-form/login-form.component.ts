import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoutingService } from '../routing.service';
import { Emitters } from '../Emitter';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  myForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, 
              private snackBar: MatSnackBar, private router: RoutingService) {
    this.myForm = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: false
    });
  }

  get username() {
    return this.myForm?.controls['username'];
  }

  get password() {
    return this.myForm?.controls['password'];
  }

  get rememberMe() {
    return this.myForm?.controls['remember'];
  }

  ngOnInit(): void {
  }

  submitHandler() {
    let username: string = this.username.value;
    let password: string = this.password.value;
    let rememberMe: boolean = this.rememberMe.value;
    this.api.loginUser(username, password, rememberMe).subscribe((data) => {
      let resp: any = data;
      if (resp.errors) {
        // Server error
        let snack = this.snackBar.open('Login failed. Error with server', 'Retry', {
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
        snack.afterDismissed().subscribe(() => {
          this.router.gotoLogin()
        })
      } else if (resp.login) {
        // Login successful
        let token: string = resp.token;
        localStorage.setItem('token', token);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('expiry_time', resp.expiry_time);
        localStorage.setItem('myEmail', resp.email);
        localStorage.setItem('username', this.username.value);
        Emitters.authEmitter.emit(true);
        this.router.gohome()
      } else {
        // Login failed
        let snack = this.snackBar.open('Failed to log in. Incorrect username or password', 'Retry', {
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
        snack.afterDismissed().subscribe(() => {
          this.router.refresh();
        })
      }
    });
  }

}
