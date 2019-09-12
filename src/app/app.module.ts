import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbar,
  MatToolbarModule,
  MatExpansionModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

import { PostListComponent } from './posts/post-list/post-list.component';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
