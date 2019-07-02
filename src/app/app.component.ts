import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { AuthService } from '../providers/auth-service/auth-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = 'LoginPage';
  signinpage : string ='SigninPage'
  isAuthenticated:boolean =false;
  name:string;
  user:any;
  @ViewChild(Nav) nav: Nav;
  pages: Array<{title: string, component: any}>;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private authSVC : AuthService,) {
    this.initializeApp();

    // used for an example of ngFor and navigation

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.init()
    this.getUser();
    this.getName();
  }
  async init(){
    await firebase.initializeApp({
      apiKey: "AIzaSyD70V_1gf7lkbw28WNjJxtZ35YmFLbhqUw",
      authDomain: "kimaia-social-mission.firebaseapp.com",
      databaseURL: "https://kimaia-social-mission.firebaseio.com",
      projectId: "kimaia-social-mission",
      storageBucket: "",
      messagingSenderId: "143615907120",
      appId: "1:143615907120:web:5c5b59b753ae923d"
     });
     
 
   }
   logout(){
     this.authSVC.logout();
     this.nav.setRoot('LoginPage')
   }
 
   getName() {
     return new Promise((resolve, reject) => {
        firebase.database().ref('/users/').once('value').then(snapshot => {
         snapshot.forEach(item => {
           let i=item.val()
           if(this.user)
           {
           if(i.uid==this.user.uid)
           {
             this.name=i.name
             this.authSVC.name=i.name
           }
         }
         });
       });
       this.authSVC.name=this.name;
       resolve(this.name)
     })
   }
 
   getUser(){
      firebase.auth().onAuthStateChanged(user=>{
       if(user){
         this.isAuthenticated=true;
         this.rootPage='MainPage';
         this.user=user;
         this.authSVC.uid=user.uid;
       }
       else
       {
         this.isAuthenticated=false;
         this.rootPage='LoginPage';
       }
     })
   }

   manageFriends()
   {
     this.nav.push('ManageFriendsPage')
   }
 }
 
