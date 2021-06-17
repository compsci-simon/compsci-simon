import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { RoutingService } from '../routing.service';
import { Emitters } from '../Emitter';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

  constructor(private api: ApiService, private router: RoutingService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDiaglog() {
    this.dialog.open(DeleteDialogComponent)
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
      }
    })
  }

}
