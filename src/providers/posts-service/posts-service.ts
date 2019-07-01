import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
/*
  Generated class for the PostsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostsService {
  cachedPosts: Post[]=[];
  constructor(private adb: AngularFireDatabase) {

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
    return new Promise((resolve, reject) => {
      firebase.database().ref('/posts/').once('value').then(snapshot => {
        if (snapshot) {
          snapshot.forEach(item => {
            if (item) {
              var itemVal = item.val();
              if (itemVal) {
                this.cachedPosts.push(itemVal)
              }
            }
          });
        }
      });
      resolve(this.cachedPosts)
    })
  }
  async getCachedPosts()
  {
    return this.cachedPosts;
  }
}

export interface Post {
  uid: string;
  author: string;
  text: string;
  dateTime: string;
}