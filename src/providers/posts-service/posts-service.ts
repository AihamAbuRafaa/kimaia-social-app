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
  constructor(private authSvc: AuthService, private usersSvc: UsersService) {

  }

  async sharePost(post: Post) {
    try {
      let usersKeys = this.usersSvc.usersKeys;
      let users = this.usersSvc.users;
      let index = users.findIndex(i => i.uid == this.authSvc.uid)
      let data = await firebase.database().ref("users/" + usersKeys[index] + "/posts/").push({ //request to share post
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
    try {
      this.cachedPosts=[]
      let friends = this.usersSvc.getCachedFriends()
      let users = this.usersSvc.getChacedUsers()
      friends.forEach(friend => {
        users.forEach(user => {
          if (user) {
            if (friend.friendId == user.uid && friend.isAccept == true) { //if user is my friend add his posts
              if (user.posts) {
                const values = Object.keys(user.posts).map(key => user.posts[key]);
                //I have used this because object.values dosent in es2015 and I'am used es2015
                console.log(values)
                values.forEach(post => {
                  this.cachedPosts.push(post);
                })
              }
            }
          }
        });
      })
    } catch (err) {
      console.log(err)
    }
  }
  getCachedPosts() {
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
//the diffrence is one with dateTime as string and the othe with Date becaues there's not type date in the database
export interface IPost {
  uid: string;
  author: string;
  text: string;
  dateTime: Date;
}