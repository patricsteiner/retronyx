import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { AboutModalComponent } from './about-modal/about-modal.component';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { AngularFireAnalyticsModule, ScreenTrackingService } from '@angular/fire/analytics';

@NgModule({
  declarations: [AppComponent, AboutModalComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    IonicStorageModule.forRoot(),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AppRoutingModule,
    AngularFirePerformanceModule,
    AngularFireAnalyticsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    { provide: REGION, useValue: 'europe-west1' },
    ScreenTrackingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
