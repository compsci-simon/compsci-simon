import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoutingService } from '../routing.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  myForm: FormGroup;
  submit: boolean = false;
  file: any = null;

  constructor(private fb: FormBuilder, private api: ApiService, 
              private _snackBar: MatSnackBar, private routing: RoutingService) {

    this.myForm = this.fb.group({
      username: ['', [
        Validators.required,
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$')
      ]],
      confirm_password: ['', [
        Validators.required
      ]]
    });
    // ^(?=.*[a-z]+.*)(?=.*[A-Z]+.*)(?=.*\d+.*)(?=.*[\!\@\#\$\%\^\&\*\(\)\\\{\}\[\]\'\"\|\,]+.*).{4,}$
  }

  ngOnInit(): void {
  }

  // Some getters
  get username() {
    return this.myForm.controls['username'];
  }

  get email() {
    return this.myForm.controls['email'];
  }

  get password() {
    return this.myForm.controls['password'];
  }

  get confirm_password() {
    return this.myForm.controls['confirm_password'];
  }

  submitHandler() {
    let username = this.username.value
    let email = this.email.value
    let password = this.password.value
    let resp: any;
    this.api.registerUser(username, email, password).subscribe((data) => {
      resp = data;
      if (resp.errors) {
        this.submit = true;
        let snackbar = this._snackBar.open("Error creating user", "Retry", {
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        snackbar.afterDismissed().subscribe(() => {
          this.submit = false;
          this.routing.gotoRegister()
        })
      } else if (resp.user_created) {
        this.submit = true;
        let snackbar = this._snackBar.open("User successfully created", "Login", {
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        snackbar.afterDismissed().subscribe(() => {
          this.submit = false;
          this.routing.gotoLogin()
        })
      }
    });
  }
  
  usernameExists() {
    let request: any;
    this.api.userExists(this.username?.value).subscribe((data) => {
      request = data;
      if (request.exists && this.username?.value.length > 0) {
        this.username.setErrors({notUnique: true});
      }
    })
  }

  confirmPasswordValidator() {
    if (this.password.value != this.confirm_password.value) {
      this.confirm_password.setErrors({notEqual: true})
    } else {
      this.confirm_password.setErrors(null)
    }
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

}
