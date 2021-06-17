import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutingService } from '../routing.service';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  categories: string[] = ['nature', 'tech', 'finance', 'Art', 'History', 'Sport'];
  groups: string[] = [];
  location = '';
  rForm: FormGroup;

  constructor(private snackBar: MatSnackBar, private api: ApiService, 
    private fb: FormBuilder, private router: RoutingService) {
    this.rForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      group_name: ['', Validators.required],
      category1_name: ['', Validators.required],
      category2_name: ['', Validators.required],
      category3_name: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    let loggedIn = JSON.parse(localStorage.getItem('loggedIn') || 'false');
    if (!loggedIn) {
      this.router.gotoLogin();
    }

    if (!navigator.geolocation) {
      console.log("Location is not supported")
    }
    navigator.geolocation.getCurrentPosition(position => {
      this.location = this.location + position.coords.latitude + ' ' +
                      + position.coords.longitude;
                      console.log(position.coords.latitude)
                      console.log(position.coords.longitude)
    });
    this.api.getGroupsBelong().subscribe(data => {
      let resp: any = data;
      
      // Checking for valid token
      if (resp.valid_token == false) {
        this.api.logout();
      }
      
      for (let item of resp) {
        this.groups.push(item.group_name)
      }
    });
  }

  get title() {
    return this.rForm.controls['title'];
  }

  get content() {
    return this.rForm.controls['content'];
  }

  get group_name() {
    return this.rForm.controls['group_name'];
  }

  get category1_name() {
    return this.rForm.controls['category1_name'];
  }

  get category2_name() {
    return this.rForm.controls['category2_name'];
  }

  get category3_name() {
    return this.rForm.controls['category3_name'];
  }

  submitHandler() {
    let title = this.title.value;
    let content = this.content.value;
    let group = this.group_name.value;
    let categories: string[] = [];
    let category1 = this.category1_name.value;
    let category2 = this.category2_name.value;
    let category3 = this.category3_name.value;

    categories.push(category1);
    categories.push(category2);
    categories.push(category3);

    this.api.createPost(title, content, group, categories, this.location)
      .subscribe((data) => {
        let resp: any = data;
        console.log(resp)
        if (resp.errors) {
          // We have an error
        } else if (resp.post_created) {
          // Post Created successfully
          let snack = this.snackBar.open("Created post successfully", "Dismiss", {
            verticalPosition: "top",
            horizontalPosition: "center"
          });
          snack.afterDismissed().subscribe(data => {
            this.router.refresh()
          });
        } else {
          // Failed to create post
        }
      });
  }

}
