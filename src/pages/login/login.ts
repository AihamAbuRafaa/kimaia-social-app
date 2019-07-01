import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NgForm } from '@angular/forms';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  constructor(public nav: NavController,
    public forgotCtrl: AlertController,
    private loadingCtrl:LoadingController,
    private authSVC:AuthService,
     public menu: MenuController, 
     public toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.menu.swipeEnable(false);
  }
  register() {
    this.nav.setRoot('RegisterPage');
  }

  // login and go to home page
  login(form : NgForm) {

    const loading=this.loadingCtrl.create({
      content:"Signing you in...",
    });
    loading.present();
    this.authSVC.signin(form.value.email,form.value.password).then(
      data=>{
        loading.dismiss();
        this.nav.setRoot('HomePage')
      })
      .catch(error=>{
        loading.dismiss();
        const alert=this.forgotCtrl.create({
          title:'Signin failed ',
          message: error.message,
          buttons:['Ok']
        });
        alert.present();
      });
    
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {

          }
        },
        {
          text: 'Send',
          handler: data => {

            this.resetPassword(data.email);
            let toast = this.toastCtrl.create({
              message: 'Email was sended successfully',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }
  resetPassword(data:string)
  {
    this.authSVC.resetPassword(data);
  }
}
