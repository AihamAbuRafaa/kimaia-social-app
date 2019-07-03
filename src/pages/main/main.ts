import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, SelectPopover } from 'ionic-angular';
import { PostsService, Post, IPost } from '../../providers/posts-service/posts-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { UsersService } from '../../providers/users-service/users-service';
import firebase from 'firebase';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage implements OnInit {
  newPost: Post = {
    dateTime: "",
    author: "",
    text: "",
    uid: ""
  }
  cachedPosts: Post[];
  viewPosts: Post[];
  datePosts: IPost[] = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private menu: MenuController,
    private postSvc: PostsService,
    private authSvc: AuthService,
    private loadCtrl: LoadingController,
    private usersSvc: UsersService) {
  }
  async ngOnInit() {
    let load = this.loadCtrl.create({
      content:'please wait ...',
      spinner: 'crescent',
    });
    load.present();
    try {
      await this.postSvc.getPosts();
      this.cachedPosts = await this.postSvc.getCachedPosts();
      this.cachedPosts.forEach(i => {
        let date = new Date(i.dateTime);
        let ob: IPost = {
          author: i.author,
          dateTime: date,
          text: i.text,
          uid: i.uid
        }
        this.datePosts.push(ob);
      })
      this.datePosts = this.datePosts.sort((a: IPost, b: IPost) => {
        return a.dateTime.getTime() - b.dateTime.getTime();
      });
      this.cachedPosts = [];
      this.datePosts.forEach(i => {
        let date = new Date(i.dateTime);
        let ob: Post = {
          author: i.author,
          dateTime: date.toUTCString(),
          text: i.text,
          uid: i.uid
        }
        this.cachedPosts.push(ob);
      })
      this.cachedPosts.reverse()
    } catch (err) {
      console.log(err)
    } finally {
    load.dismiss();    
    }
  }

  

  sharePost() {
    let load = this.loadCtrl.create();
    load.present();
    try {
      if (this.newPost.text) {
        let dateTime = new Date().toString();
        this.newPost.dateTime = dateTime;
        this.newPost.uid = this.authSvc.uid;
        this.newPost.author = this.authSvc.name;
        this.postSvc.sharePost(this.newPost);
        this.newPost.text = ""
      }
    } catch (err) {
      console.log(err)
    } finally {
      load.dismiss();
    }
  }
}
