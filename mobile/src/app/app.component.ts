import { Component } from '@angular/core';

import { StorageService } from './services/storage/storage.service';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  themes: any[] = [
    {'name':'themeBlack', 'color':'#000000', 'status':false},
    {'name':'themeYellow', 'color':'#f5c800', 'status':false},
    {'name':'themeGreen', 'color':'#0082fc', 'status':false}
  ];
  public appPages = [
    {
      title: 'Notes',
      url: '/notes',
      icon: 'home'
    },
    // {
    //   title: 'About',
    //   url: '/about',
    //   icon: 'information'
    // },
  ];

  constructor(private storageService: StorageService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.storageService.getTheme().then((theme: any[]) => {
      if(theme === null || theme=== undefined){
        this.storageService.setTheme(this.themes);
        return
      }else{
         this.themes = theme;
      }
     

    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
