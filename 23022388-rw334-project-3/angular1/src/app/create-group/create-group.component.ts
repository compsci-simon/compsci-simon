import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { RoutingService } from '../routing.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  myForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService,
              private router: RoutingService, private _snackBar: MatSnackBar) {

    this.myForm = fb.group({
      group_name: ['', Validators.required]
    });
  }

  get group_name() {
    return this.myForm?.controls['group_name'];
  }

  submitHandler() {
    console.log(this.group_name.value);
    this.api.createGroup(this.group_name.value).subscribe(data => {
      let resp: any = data;

      // Checking for valid token
      if (resp.valid_token == false) {
        this.api.logout();
      }
      
      if (resp.errors) {
        // Error
        console.log("Error")
        let snack = this._snackBar.open("Server error", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center"
        })
        snack.afterDismissed().subscribe(() => {
          this.router.refresh();
        })
      } else if (resp.group_created) {
        // I think everything should be valid
        let snack = this._snackBar.open("Group created successfully", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center",
          panelClass: ["mat-primary"]
        })
        snack.afterDismissed().subscribe(() => {
          this.router.refresh();
        })
      } else {
        // Invalid
        let snack = this._snackBar.open("Group already exists", "Dismiss", {
          verticalPosition: "top",
          horizontalPosition: "center"
        })
        snack.afterDismissed().subscribe(() => {
          this.router.refresh();
        })
      }
    });
  }

  ngOnInit(): void {
  }

}
