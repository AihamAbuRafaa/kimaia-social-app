import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth-service/auth-service';
/*
  Generated class for the PostsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostsService {
  cachedPosts: Post[] = [];
  constructor(private adb: AngularFireDatabase,private authSvc:AuthService) {

  }

  async sharePost(post: Post) {
    try {
      let data = await this.adb.list("/posts/").push({
        author: post.author,
        text: post.text,
        dateTime: post.dateTime,
        uid: post.uid
      });
    } catch (err) {

    }
  }

  async getPosts() {
    return new Promise(async(resolve, reject) => {
      await firebase.database().ref('/posts/').once('value').then(snapshot => {
        this.cachedPosts=[]
          snapshot.forEach(item => {
          var itemVal = item.val();
          this.cachedPosts.push(itemVal)
        });
      });
      resolve(this.cachedPosts)
    })
  }
  async getCachedPosts() {
    let uid=this.authSvc.uid;
    return this.cachedPosts.filter(i=>i.uid!=uid);
  }
}

export interface Post {
  uid: string;
  author: string;
  text: string;
  dateTime: string;
}