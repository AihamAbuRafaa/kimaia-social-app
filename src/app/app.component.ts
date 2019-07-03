import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { AuthService } from '../providers/auth-service/auth-service';
import { UsersService } from '../providers/users-service/users-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string = 'LoginPage';
  signinpage: string = 'SigninPage'
  isAuthenticated: boolean = false;
  name: string;
  user: any;
  @ViewChild(Nav) nav: Nav;
  pages: Array<{ title: string, component: any }>;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private authSVC: AuthService, private userSvc: UsersService) {
    // used for an example of ngFor and navigation
    this.initializeApp();
  }



  async initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.init();
    });



  }
  async init() {
    try {
      await this.userSvc.getUsers();
      this.getUser();
    } catch (err) {
      console.log(err)
    }
  }
  logout() {
    this.authSVC.logout();
    this.nav.setRoot('LoginPage')
  }

  getUser() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.isAuthenticated = true;
        this.user = user;
        this.authSVC.uid = user.uid;
        this.userSvc.uid = user.uid;
        await this.userSvc.getFriends();
        this.rootPage = 'MainPage';
      }
      else {
        this.isAuthenticated = false;
        this.rootPage = 'LoginPage';
      }
    })
  }

  manageFriends() {
    this.nav.push('ManageFriendsPage')
  }
}

