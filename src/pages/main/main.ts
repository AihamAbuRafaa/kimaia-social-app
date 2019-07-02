import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { PostsService, Post } from '../../providers/posts-service/posts-service';
import { AuthService } from '../../providers/auth-service/auth-service';

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
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private menu: MenuController,
    private postSvc: PostsService,
    private authSvc: AuthService,
    private loadCtrl: LoadingController) {
  }
  async ngOnInit() {
    let load = this.loadCtrl.create();
    load.present();
    try {
      let a = await this.postSvc.getPosts();
      this.cachedPosts = await this.postSvc.getCachedPosts();
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
