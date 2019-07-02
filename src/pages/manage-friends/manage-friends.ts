import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UsersService, User } from '../../providers/users-service/users-service';

/**
 * Generated class for the ManageFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-friends',
  templateUrl: 'manage-friends.html',
})
export class ManageFriendsPage implements OnInit {
  users:User[]=[];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private usersSvc:UsersService,
    private loadCtrl:LoadingController) {
  }

  async ngOnInit(){
    let load=this.loadCtrl.create();
    load.present();
    try{
    await this.usersSvc.getUsers()
    this.users=await this.usersSvc.getCahcedUsers();
    }catch(err){
      console.log(err)
    }finally{
      load.dismiss();
    }
  }

  async addFriend(friend:User)
  {
    let load=this.loadCtrl.create();
    load.present();
    try{
      await this.usersSvc.addFriend(friend);
      this.users=this.users.filter(i=>i.uid!=friend.uid)
    }catch(err)
    {
      console.log(err)
    }finally{
      load.dismiss();
    }
  }

}
