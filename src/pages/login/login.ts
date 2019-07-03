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
    private loadingCtrl: LoadingController,
    private authSVC: AuthService,
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
  login(form: NgForm) {

    const loading = this.loadingCtrl.create({
      content: "Signing you in...",
    });
    loading.present();
    this.authSVC.signin(form.value.email, form.value.password).then(
      data => {
        loading.dismiss();
        this.nav.setRoot('MainPage')
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.forgotCtrl.create({
          title: 'Signin failed ',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });

  }
}
