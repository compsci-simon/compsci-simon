import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

import { RegisterFormComponent } from './register-form/register-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { RoutingService } from './routing.service';
import { LoginFormComponent } from './login-form/login-form.component';
import { LandingComponent } from './landing/landing.component';
import { MatCardModule } from '@angular/material/card';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { DeleteGroupComponent } from './delete-group/delete-group.component';
import { NavbarErinComponent } from './navbar-erin/navbar-erin.component';
import { AvatarModule } from 'ngx-avatar';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { JoinGroupComponent } from './join-group/join-group.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';
import { FriendsComponent } from './friends/friends.component';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { MyFriendsComponent } from './my-friends/my-friends.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterFormComponent,
    LoginFormComponent,
    LandingComponent,
    NavbarComponent,
    HomeComponent,
    MyProfileComponent,
    CreatePostComponent,
    CreateGroupComponent,
    DeleteGroupComponent,
    NavbarErinComponent,
    ManageGroupsComponent,
    DeleteUserComponent,
    MyPostsComponent,
    MyGroupsComponent,
    JoinGroupComponent,
    DeleteDialogComponent,
    ManageProfileComponent,
    FriendsComponent,
    AddFriendComponent,
    MyFriendsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatDividerModule,
    MatListModule,
    MatCheckboxModule,
    MatChipsModule,
    AvatarModule
  ],
  providers: [ApiService, RoutingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
