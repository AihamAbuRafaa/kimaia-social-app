import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, AlertController, } from 'ionic-angular';
import { PostsService, Post, IPost } from '../../providers/posts-service/posts-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { UsersService } from '../../providers/users-service/users-service';

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
export class MainPage{
  newPost: Post = {
    dateTime: "",
    author: "",
    text: "",
    uid: ""
  }
  cachedPosts: Post[];
  datePosts: IPost[] = [];
  constructor(public navCtrl: NavController,
    public alertCtrl:AlertController,
    public navParams: NavParams,
    private postSvc: PostsService,
    private authSvc: AuthService,
    private userSvc:UsersService,
    private loadCtrl: LoadingController,) {
  }
  
   async ionViewDidEnter() {
     // i used this function because when i return from managefriends page to this page this function called to add posts of the accepted new friend
    let load = this.loadCtrl.create({
      content:'please wait ...',
    });
    load.present();
    try {
      this.cachedPosts=[]
      this.datePosts=[]
      this.postSvc.getPosts();
      this.cachedPosts = this.postSvc.getCachedPosts();
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
        return a.dateTime.getTime() - b.dateTime.getTime(); // sort the array by time
      });
      this.cachedPosts = [];
      this.datePosts.forEach(i => {
        let date = new Date(i.dateTime);
        let ob: Post = {
          author: i.author,
          dateTime: date.toString().split('G')[0],
          text: i.text,
          uid: i.uid
        }
        this.cachedPosts.push(ob);
      })
      this.cachedPosts.reverse()
    } catch (err) {
      console.log(err)
      let alert = this.alertCtrl.create({
        subTitle: 'Error while getting posts',
        buttons: ['Dismiss']
      });
      alert.present();
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
        this.newPost.uid = this.userSvc.user.uid;
        this.newPost.author = this.userSvc.user.name;
        this.postSvc.sharePost(this.newPost);
        this.newPost.text = ""
      }
    } catch (err) {
      console.log(err)
      let alert = this.alertCtrl.create({
        subTitle: 'Error while sharing post',
        buttons: ['Dismiss']
      });
      alert.present();
    } finally {
      load.dismiss();
    }
  }
}
