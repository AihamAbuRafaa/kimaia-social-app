import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageFriendsPage } from './manage-friends';

@NgModule({
  declarations: [
    ManageFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageFriendsPage),
  ],
})
export class ManageFriendsPageModule {}
