import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {AngularFireDatabaseModule, AngularFireDatabase} from '@angular/fire/database';
import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list';
import { AngularFireModule } from '@angular/fire';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { AuthService } from '../providers/auth-service/auth-service';
import { PostsService } from '../providers/posts-service/posts-service';

@NgModule({
  declarations: [
    MyApp,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyD70V_1gf7lkbw28WNjJxtZ35YmFLbhqUw",
      authDomain: "kimaia-social-mission.firebaseapp.com",
      databaseURL: "https://kimaia-social-mission.firebaseio.com",
      projectId: "kimaia-social-mission",
      storageBucket: "",
      messagingSenderId: "143615907120",
      appId: "1:143615907120:web:5c5b59b753ae923d"
    }),
    AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    PostsService
  ]
})
export class AppModule {}
