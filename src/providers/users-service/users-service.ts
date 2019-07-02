import { Injectable } from '@angular/core';
import { AuthService } from '../auth-service/auth-service';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase';
/*
  Generated class for the UsersServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsersService {
  users:User[]=[]
  constructor(private adb: AngularFireDatabase,private authSvc:AuthService) {
    
  }
  getUsers(){
    return new Promise(async(resolve, reject) => {
      await firebase.database().ref('/users/').once('value').then(snapshot => {
        this.users=[]
          snapshot.forEach(item => {
          var itemVal = item.val();
          this.users.push(itemVal)
        });
      });
      resolve(this.users)
    }) 
  }

  getCahcedUsers(){
    let uid=this.authSvc.uid;
    return this.users.filter(i=>i.uid!=uid)
  }

}
export interface User{
  name:string
  uid:string
}