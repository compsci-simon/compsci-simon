import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { Emitters } from '../Emitter';
import { RoutingService } from '../routing.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeleteDialogComponent>,
              private api: ApiService, private router: RoutingService) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  deleteAccount() {
    this.api.deleteMyAccount().subscribe((data) => {
      console.log(data)
      let resp: any = data;
      
      // Checking for valid token
      if (resp.valid_token == false) {
        this.api.logout();
      }
      
      if (resp.errors) {
        // There was an error
        console.log("There was an error")
      } else if (resp.user_deleted) {
        // All was successfull
        Emitters.authEmitter.emit(false);
        localStorage.removeItem('token');
        localStorage.removeItem('loggedIn');
        this.router.logout();
        this.dialogRef.close();
      }
    })
  }

}
