import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';

@NgModule({
  declarations: [],
  exports: [IonicModule],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AngularFirePerformanceModule,
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: REGION,
      useValue: 'europe-west1',
    },
  ],
})
export class CoreModule {}

// Eager module that defines everything needed by the whole app (imported in appModule).
