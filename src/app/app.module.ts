import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule} from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './pages/home/home.component';
import { DataViewComponent } from './components/data-view/data-view.component';
import { NotificationsComponent } from './components/notifications/notifications.component'
import { NotificationsService } from './services/notifications/notifications.service';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DataEditComponent } from './components/data-edit/data-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DataViewComponent,
    NotificationsComponent,
    DatePickerComponent,
    DataEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [NotificationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
