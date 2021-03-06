import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '../users-service/users-service';

@Injectable()
export class AuthService {
  name: string;
  uid: string;
  user: User = {
    friends: [],
    name: "",
    posts: [],
    uid: ""
  }
  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyD70V_1gf7lkbw28WNjJxtZ35YmFLbhqUw",
      authDomain: "kimaia-social-mission.firebaseapp.com",
      databaseURL: "https://kimaia-social-mission.firebaseio.com",
      projectId: "kimaia-social-mission",
      storageBucket: "",
      messagingSenderId: "143615907120",
      appId: "1:143615907120:web:5c5b59b753ae923d"
    })

  }

  signup(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  signin(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    try {
      firebase.auth().signOut();
    } catch (err) {
      console.log(err)
    }
  }
}
