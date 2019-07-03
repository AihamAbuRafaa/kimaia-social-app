import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AuthService } from '../auth-service/auth-service';
import { UsersService } from '../users-service/users-service';
/*
  Generated class for the PostsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostsService {
  cachedPosts: Post[] = [];
  i = 0;
  constructor(private authSvc: AuthService, private usersSvc: UsersService) {

  }

  async sharePost(post: Post) {
    try {
      let usersKeys = this.usersSvc.usersKeys;
      let users = this.usersSvc.users;
      let index = users.findIndex(i => i.uid == this.authSvc.uid)
      let data = await firebase.database().ref("users/" + usersKeys[index] + "/posts/").push({
        author: post.author,
        text: post.text,
        dateTime: post.dateTime,
        uid: post.uid
      });
    } catch (err) {
      console.log(err)
    }
  }

  getPosts() {
    let friends = this.usersSvc.getCachedFriends()
    let users = this.usersSvc.getChacedUsers()
    friends.forEach(friend => {
      users.forEach(user => {
        if (user) {
          if (friend.friendId == user.uid && friend.isAccept == true) {
            if (user.posts) {
              Object.values(user.posts).forEach(post => {
                this.cachedPosts.push(post);
              })
            }
          }
        }
      });
    })

  }
  async getCachedPosts() {
    let uid = this.authSvc.uid;
    return this.cachedPosts;
  }
}

export interface Post {
  uid: string;
  author: string;
  text: string;
  dateTime: string;
}
export interface IPost {
  uid: string;
  author: string;
  text: string;
  dateTime: Date;
}