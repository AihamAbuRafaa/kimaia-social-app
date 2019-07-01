import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
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
    author:"",
    text: "",
    uid: ""
  }
  cachedPosts:Post[];
  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, private postSvc: PostsService, private authSvc: AuthService) {
  }
  async ngOnInit() {
    let i=await this.postSvc.getCachedPosts()
    console.log(i)
  }
  sharePost() {
    if (this.newPost.text) {
      let dateTime = new Date().toString();
      this.newPost.dateTime = dateTime;
      this.newPost.uid = this.authSvc.uid;
      this.newPost.author=this.authSvc.name;
      this.postSvc.sharePost(this.newPost);
    }
  }
}
