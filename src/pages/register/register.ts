import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AngularFireDatabase } from '@angular/fire/database';
import { NgForm } from '@angular/forms';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authSVC:AuthService,
    private loadingCtrl:LoadingController,
    private alerCtrl : AlertController,
    private adb: AngularFireDatabase,) {
 }


 // register and go to home page
 register(form : NgForm) {
   const loading=this.loadingCtrl.create({
     content:"Signing you up...",
   });
   loading.present();
   this.authSVC.signup(form.value.email,form.value.password).then(
     data=>{
       loading.dismiss();
       let dataa = this.adb.list("/users/").push({
         uid:data.user.uid,
         name:form.value.fullname
       });
     })
     .catch(error=>{
       loading.dismiss();
       const alert=this.alerCtrl.create({
         title:'Signup failed ',
         message: error.message,
         buttons:['Ok']
       });
       alert.present();
     });
 }

 // go to login page
 login() {
   this.navCtrl.setRoot('LoginPage');
 }

}
