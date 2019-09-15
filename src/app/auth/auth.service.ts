import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // TOKEN
  private token: string;
  private authStatusListener = new Subject<boolean>();

  // CONSTRUCTOR
  constructor(private http: HttpClient) {}

  // GET TOKEN
  getToken() {
    return this.token;
  }

  // GET AUTH STATUS LISTENER
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // CREATE USER
  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  // LOGIN
  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        this.authStatusListener.next(true);
      });
  }
} // END CLASS
