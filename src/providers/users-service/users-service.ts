import { Injectable } from '@angular/core';
import { AuthService } from '../auth-service/auth-service';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase';
import { Post } from '../posts-service/posts-service';
/*
  Generated class for the UsersServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsersService {
  users: User[] = []
  uid: string = ""
  usersKeys: string[] = [];
  friends: User[] = [];
  friendsKeys: string[] = [];
  user: User = {
    firends: [],
    name: "",
    posts: [],
    uid: ""
  };
  constructor(private adb: AngularFireDatabase, private authSvc: AuthService) {
  }
  async getFriends() {
    let index = this.users.findIndex(i => i.uid == this.uid)
    return new Promise(async (resolve, reject) => {
      await firebase.database().ref("/users/" + this.usersKeys[index] + "/friends/").once('value').then(snapshot => {
        this.friends = []
        snapshot.forEach(item => {
          var itemVal = item.val();
          this.friends.push(itemVal)
          this.friendsKeys.push(item.key)
        });
      });
      resolve(this.users)
    })
  }
  async getUsers() {
    this.uid = this.authSvc.uid;
    return new Promise(async (resolve, reject) => {
      await firebase.database().ref('/users/').once('value').then(snapshot => {
        this.users = []
        this.usersKeys = [];
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
      let index = this.users.findIndex(i => i.uid == this.uid)
      let friendName = this.users[index].name;
      index = this.users.findIndex(i => i.uid == friend.uid)
      let friendId = this.uid;
      let isAccept = false;
      let isRequest = true;
      let data = await this.adb.list("/users/" + this.usersKeys[index] + "/friends/").push({
        friendId,
        friendName,
        isAccept,
        isRequest
      });
      index = this.users.findIndex(i => i.uid == friend.uid)
      friendName = this.users[index].name;
      index = this.users.findIndex(i => i.uid == this.uid)
      friendId = friend.uid;
      isRequest = false;
      isAccept = false;
      let dat = await this.adb.list("/users/" + this.usersKeys[index] + "/friends/").push({
        friendId,
        friendName,
        isAccept,
        isRequest
      });
    } catch (err) {
      console.log(err)
    }
  }

  async acceptFriend(friend: any) {
    let userIndex = this.users.findIndex(i => i.uid == this.uid)
    let friendIndex = this.friends.findIndex(i => i.uid == friend.uid)
    let isAccept = true;
    let dat = await this.adb.database.ref("/users/" + this.usersKeys[userIndex] + "/friends/" + this.friendsKeys[friendIndex]).set({
      isAccept:true
    },function(){

    });
  }
  async rejectFriend(friend: User) {

  }

}
export interface User {
  name: string
  uid: string
  firends?: User[]
  posts?: Post[]
}