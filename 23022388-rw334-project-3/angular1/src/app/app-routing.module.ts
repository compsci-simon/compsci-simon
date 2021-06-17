import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateGroupComponent } from './create-group/create-group.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { FriendsComponent } from './friends/friends.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { RegisterFormComponent } from './register-form/register-form.component';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ManageProfileComponent },
  { path: 'post/create', component: CreatePostComponent },
  { path: 'groups/manage', component: ManageGroupsComponent },
  { path: 'friends', component: FriendsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
