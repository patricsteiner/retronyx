import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [CoreModule, AppRoutingModule],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
// Project architecture according to https://medium.com/@tomastrajan/how-to-build-epic-angular-app-with-clean-architecture-91640ed1656
