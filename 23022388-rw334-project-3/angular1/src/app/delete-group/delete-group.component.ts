import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoutingService } from '../routing.service';

@Component({
  selector: 'app-delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.css']
})
export class DeleteGroupComponent implements OnInit {

  groups: string[] = [];
  selectedGroup: string = 'None';
  disabled = true;
  rForm: FormGroup;

  constructor(private api: ApiService, private fb: FormBuilder, private snackBar: MatSnackBar,
              private router: RoutingService) {
    this.rForm = fb.group({
      group_name: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.rForm.controls['group_name'].setErrors({test: true});
    this.api.getUserAdminGroups().subscribe(data => {
      let resp:any = data;
      
      // Checking for valid token
      if (resp.valid_token == false) {
        this.api.logout();
      }

      if (resp.errors) {
        // Errors
      } else {
        // We have data!
        this.groups = []
        for (let item of resp) {
          this.groups.push(item.group_name)
        }
      }
    });
  }

  submitHandler() {
    console.log("submitted form")
    let group = this.group_name.value;
    this.api.deleteGroup(group).subscribe(data => {
      let resp: any = data;
      console.log(resp)
      if (resp.errors) {
        // We have an error
        let snack = this.snackBar.open("Server error", "Dismiss", {
          verticalPosition: 'top',
          horizontalPosition: 'center'
        })
        snack.afterDismissed().subscribe(() => {
          this.router.refresh()
        });
      } else if (resp.group_deleted) {
        // Success
        let snack = this.snackBar.open("Successfully deleted group", "Dismiss", {
          verticalPosition: 'top',
          horizontalPosition: 'center'
        })
        snack.afterDismissed().subscribe(() => {
          this.router.refresh()
        });
      } else {
        // Failure
        let snack = this.snackBar.open("Failure deleting group", "Dismiss", {
          verticalPosition: 'top',
          horizontalPosition: 'center'
        })
        snack.afterDismissed().subscribe(() => {
          this.router.refresh()
        });
      }
    });
  }

  get group_name() {
    return this.rForm.controls['group_name']
  }

  test() {
    console.log(this.group_name.value)
  }

}
