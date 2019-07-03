import { Injectable } from '@angular/core';
import { AuthService } from '../auth-service/auth-service';
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
  friends: Friend[] = [];
  friendsKeys: string[] = [];
  user: User = {
    friends: [],
    name: "",
    posts: [],
    uid: ""
  };
  constructor(private authSvc: AuthService) {
  }
  async getFriends() {
    let index = this.users.findIndex(i => i.uid == this.uid)
    let snapshot = await firebase.database().ref("/users/" + this.usersKeys[index] + "/friends/").once('value');
    this.friends = []
    this.friendsKeys=[]
    snapshot.forEach(item => {
      var itemVal = item.val();
      this.friends.push(itemVal)
      this.friendsKeys.push(item.key)
    });
    
  }
  async getUsers() {
    this.uid = this.authSvc.uid;
    try {
      let snapshot = await firebase.database().ref('/users/').once('value');
      this.users = []
      this.usersKeys = [];
      snapshot.forEach(item => {
        var itemVal = item.val();
        this.users.push(itemVal)
        this.usersKeys.push(item.key);
      });
    } catch (err) {
      console.log(err)
    }
  }
  getChacedUsers(){
    return this.users.filter(i=>i.uid!=this.uid)
  }
  getCachedUsersWithoutFriends() {
    return this.users.filter(user => {
      let flag = true;
      if (user.uid == this.uid) {
        flag = false;
      } else {
        this.friends.forEach(friend => {
          if (friend.friendId == user.uid) {
            flag = false;
          }
        })
      }
      return flag;
    })
  }

  async addFriend(friend: User) {
    try {
      let index = this.users.findIndex(i => i.uid == this.uid)
      let friendName = this.users[index].name;
      index = this.users.findIndex(i => i.uid == friend.uid)
      let friendId = this.uid;
      let isAccept = false;
      let isRequest = true;
      let data = await firebase.database().ref("/users/" + this.usersKeys[index] + "/friends/").push({
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
      let dat = await firebase.database().ref("/users/" + this.usersKeys[index] + "/friends/" + data.key).set({
        friendId,
        friendName,
        isAccept,
        isRequest
      });
      // add friend to the cache array
      this.friendsKeys.push(data.key)
      this.friends.push({
        friendId:friendId,
        friendName:friendName,
        isAccept:isAccept,
        isRequest:isRequest
      })
    } catch (err) {
      console.log(err)
    }
  }

  async acceptFriend(friend: Friend) {
    try {
      let index = this.users.findIndex(i => i.uid == this.uid)
      let friendName = this.users[index].name;
      index = this.users.findIndex(i => i.uid == friend.friendId)
      let friendId = friend.friendId;
      let friendIndex = this.friends.findIndex(i => i.friendId == friendId)
      friendId = this.uid;
      let isAccept = true;
      let isRequest = false;
      let data = await firebase.database().ref("/users/" + this.usersKeys[index] + "/friends/" + this.friendsKeys[friendIndex]).set({
        friendId,
        friendName,
        isAccept,
        isRequest
      });
      index = this.users.findIndex(i => i.uid == friend.friendId)
      friendName = this.users[index].name;
      index = this.users.findIndex(i => i.uid == this.uid)
      friendId = friend.friendId;
      isRequest = true;
      isAccept = true;
      let dat = await firebase.database().ref("/users/" + this.usersKeys[index] + "/friends/" + this.friendsKeys[friendIndex]).set({
        friendId,
        friendName,
        isAccept,
        isRequest
      });
      //add friend to cache array
      this.friends[friendIndex].isAccept=true;
    } catch (err) {
      console.log(err)
    }
  }
  async rejectFriend(friend: any) {
    try {
      let index = this.users.findIndex(i => i.uid == friend.friendId)
      let friendIndex = this.friends.findIndex(i => i.friendId == friend.friendId)
      let data = await firebase.database().ref("/users/" + this.usersKeys[index] + "/friends/" + this.friendsKeys[friendIndex]).remove()
      index = this.users.findIndex(i => i.uid == this.uid)
      let dat = await firebase.database().ref("/users/" + this.usersKeys[index] + "/friends/" + this.friendsKeys[friendIndex]).remove();
      //remove friend from cache
      this.friends.splice(friendIndex)
      this.friendsKeys.splice(friendIndex)
    } catch (err) {
      console.log(err)
    }
  }
  getCachedFriends() {
    return this.friends.slice();
  }

}
export interface User {
  name: string
  uid: string
  friends?: Friend[]
  posts?: Post[]
}

export interface Friend {
  friendId: string,
  friendName: string,
  isAccept: boolean,
  isRequest: boolean
} 