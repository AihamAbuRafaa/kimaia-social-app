import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UsersService, User, Friend } from '../../providers/users-service/users-service';

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
  users: User[] = [];
  friends: Friend[] = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl:AlertController,
    private usersSvc: UsersService,
    private loadCtrl: LoadingController) {
  }

  async ngOnInit() {
    let load = this.loadCtrl.create();
    load.present();
    try {
      this.users = await this.usersSvc.getCachedUsersWithoutFriends();
      this.friends = await this.usersSvc.friends;
      this.users = this.users.filter(i => {
        let uid = i.uid;
        let flag = true;
        this.friends.forEach(d => {
          if (uid == d.friendId) {
            flag = false;
            //break;
          }
        })
        return flag;
      })
      this.friends = this.friends.filter(i => {
        if (i.isAccept == false) {
          if (i.isRequest == true) {
            return true;
          }
          else {
            return false;
          }
        } else {
          return false;
        }
      })
    } catch (err) {
      console.log(err)
      let alert = this.alertCtrl.create({
        subTitle: 'Error while getting friends',
        buttons: ['Dismiss']
      });
    } finally {
      load.dismiss();
    }
  }

  async addFriend(friend: User) {
    let load = this.loadCtrl.create();
    load.present();
    try {
      await this.usersSvc.addFriend(friend);
      this.users = this.users.filter(i => i.uid != friend.uid)
    } catch (err) {
      console.log(err)
      let alert = this.alertCtrl.create({
        subTitle: 'Error while adding a friend',
        buttons: ['Dismiss']
      });
      alert.present();
    } finally {
      load.dismiss();
    }
  }
  acceptOrRejectRequest(friend: Friend, flag: boolean) {
    let load = this.loadCtrl.create();
    load.present();
    try {
      if (flag == true)//accept
      {
        this.usersSvc.acceptFriend(friend)
      } else //reject
      {
        this.usersSvc.rejectFriend(friend)
      }
      this.friends = this.friends.filter(i => friend.friendId != i.friendId)
    } catch (err) {
      console.log(err)
      let alert = this.alertCtrl.create({
        subTitle: 'Error while accepting/rejecting a friend',
        buttons: ['Dismiss']
      });
      alert.present();
    }finally{
      load.dismiss();
    }
  }

}
