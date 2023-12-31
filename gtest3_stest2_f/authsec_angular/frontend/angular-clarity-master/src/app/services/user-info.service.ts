import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './api/helper';
export interface UserInStorage{
    userId:string;
    email:string;
    displayName:string;
    username: string;
    roles: string,
    token:string;
}
export interface LoginInfoInStorage{
    success:boolean;
    message:string;
    landingPage:string;
    user?:UserInStorage;
}
@Injectable()
export class UserInfoService {

    public currentUserKey:string="currentUser";
    public storage:Storage = sessionStorage; // <--- you may switch between sessionStorage or LocalStrage (only one place to change)



    constructor(        private _http: HttpClient,
      ) {}

    //Store userinfo from session storage
    storeUserInfo(userInfoString:string) {
        this.storage.setItem(this.currentUserKey, userInfoString);
    }

    //Remove userinfo from session storage
    removeUserInfo() {
        this.storage.removeItem(this.currentUserKey);
    }

    //Get userinfo from session storage
    getUserInfo():UserInStorage|null {
        try{
            let userInfoString:string = this.storage.getItem(this.currentUserKey);
            if (userInfoString) {
                let userObj:UserInStorage = JSON.parse(this.storage.getItem(this.currentUserKey));
                return userObj;
            }
            else{
                return null;
            }
        }
        catch (e) {
            return null;
        }
    }

    isLoggedIn():boolean {
        return this.storage.getItem(this.currentUserKey)?true:false;
    }

    //Get User's Display name from session storage
    getUserName():string {
        let userObj:UserInStorage = this.getUserInfo();
        if (userObj!== null) {
            return userObj.displayName
        }
        return "no-user";
    }

    getEmail():string {
        let userObj:UserInStorage = this.getUserInfo();
        if (userObj!== null) {
            return userObj.email
        }
        return "no-user";
    }


    getRoles(): string {
        let userObj:UserInStorage = this.getUserInfo();
        if (userObj!== null) {
            return userObj.roles
        }
        return null;
    }


    // Get  User Id from session storage
    getUserId(): string {
        let userObj:UserInStorage = this.getUserInfo();
        if (userObj!== null) {
            return userObj.userId;
        }
        return "no-user";
    }

    getStoredToken():string|null {
        let userObj:UserInStorage = this.getUserInfo();
        if (userObj !== null) {
            return userObj.token;
        }
        return null;
    }

    public getAllUsers(){
      return this._http.get(`${baseUrl}/api/all-users`);
  }

  public getUserById(id: any){
      return this._http.get(`${baseUrl}/api/get-one/${id}`);
  }

  public updateUserById(id: any, user: any){
      return this._http.put(`${baseUrl}/api/org-users/${id}`, user);
  }

  public deleteUserById(id: any){
      return this._http.delete(`${baseUrl}/api/org-users/${id}`);
  }
public logout(){
  return this._http.get(`${baseUrl}/token/logout`);
}
}
