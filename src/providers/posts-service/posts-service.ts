import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth-service/auth-service';
import { UsersService } from '../users-service/users-service';
import { ThrowStmt } from '@angular/compiler';
/*
  Generated class for the PostsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostsService {
  cachedPosts: Post[] = [];
  i = 0;
  constructor(private adb: AngularFireDatabase, private authSvc: AuthService, private usersSvc: UsersService) {

  }

  async sharePost(post: Post) {
    try {
      let usersKeys = this.usersSvc.usersKeys;
      let users = this.usersSvc.users;
      let index = users.findIndex(i => i.uid == this.authSvc.uid)
      let data = await this.adb.list("users/" + usersKeys[index] + "/posts/").push({
        author: post.author,
        text: post.text,
        dateTime: post.dateTime,
        uid: post.uid
      });
    } catch (err) {
      console.log(err)
    }
  }

  async getPosts() {
    return new Promise(async (resolve, reject) => {
      if (this.i == 0) {
          this.i++;
        if (this.usersSvc.usersKeys)
        this.usersSvc.usersKeys.forEach(async i => {
          await firebase.database().ref('/users/' + i + '/posts/').once('value').then(snapshot => {
            snapshot.forEach(item => {
              var itemVal = item.val();
              this.cachedPosts.push(itemVal)
            });
          });
          resolve(this.cachedPosts)
        })
      }else
      {
        resolve(this.cachedPosts)
      }
    })

  }
  async getCachedPosts() {
    let uid = this.authSvc.uid;
    return await this.cachedPosts.filter(i => i.uid != uid);
  }
}

export interface Post {
  uid: string;
  author: string;
  text: string;
  dateTime: string;
}