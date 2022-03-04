import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cadastro, Login } from '../interfaces/consultas_d';
import { LoginComponent } from '../../features/login/login.component';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly endpointLogin = "http://localhost:3000/login";

  constructor(private http : HttpClient) { }

  public postUser(data : Login){
    return this.http.post<Login[]>(this.endpointLogin, data);
  }

  public getUser(){
    return this.http.get<Login[]>(this.endpointLogin);
  }

  login(user: Login){
    // const result = await lastValueFrom(this.http.post<Login>(`${environment.api}/auth/login`, user));
    const result = this.http.post<Login>(`${environment.api}/auth/login`, user);
    console.log("dados retornados: ", result);
    if(result){
      return true;
    }

    return false;
  }

  register(cadastro: Cadastro){
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  public logout(){
    localStorage.removeItem('token');
  }

}