import { Injectable } from '@angular/core';
import { AuthService } from '../auth-service/auth-service';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase';
/*
  Generated class for the UsersServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsersService {
  users: User[] = []
  uid: string = ""
  usersKeys:string[]=[];
  friends:User[]=[];
  constructor(private adb: AngularFireDatabase, private authSvc: AuthService) {

  }
  async getUsers() {
    this.uid = this.authSvc.uid;
    return new Promise(async (resolve, reject) => {
      await firebase.database().ref('/users/').once('value').then(snapshot => {
        this.users = []
        this.usersKeys=[];
        snapshot.forEach(item => {
          var itemVal = item.val();
          this.users.push(itemVal)
          this.usersKeys.push(item.key);
        });
      });
      resolve(this.users)
    })
  }

  getCahcedUsers() {
    return this.users.filter(i => i.uid != this.uid)
  }

  async addFriend(friend: User) {
    try {
      let index=this.users.findIndex(i=>i.uid==this.uid)
      let friendId=friend.uid;
      let data = await this.adb.list("/users/" + this.usersKeys[index] + "/friends/").push({
        friendId
      });
    } catch (err) {
      console.log(err)
    }
  }

}
export interface User {
  name: string
  uid: string
  firends: User[]
}