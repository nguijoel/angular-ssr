import { FormControl, Validators } from '@angular/forms';
import { PermissionValues } from '../../common/types';



export class UserLogin {
    constructor(username?: string, password?: string, rememberMe?: boolean) {
     this.username = new FormControl(username, [Validators.required, Validators.maxLength(70)]);
     this.password = new FormControl(password, [Validators.required, Validators.maxLength(70)]);
     this.rememberMe = new FormControl(rememberMe);
    }
    username: FormControl;
    password: FormControl;
    rememberMe: FormControl;
}

export class GuestLogin {
  constructor(name?: string) {
   this.name = new FormControl(name, [Validators.required,Validators.maxLength(36)]);
  }
  name: FormControl;
}

export class UserResetPasswordModel {
  constructor() {
   this.email = new FormControl("", [Validators.required, Validators.maxLength(70)]);
  }
  email: FormControl;
}

export class UserChangePasswordModel {
  constructor(currentRequired?:boolean) {
    this.currentPassword = new FormControl("", [Validators.required, Validators.maxLength(70)]);
    this.password = new FormControl("", [Validators.required, Validators.maxLength(70)]);
    this.confirmPassword = new FormControl("", [Validators.required, Validators.maxLength(70)]);

   if(!currentRequired)
      this.currentPassword.disable(); 
  }

  currentPassword: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
}



export class UserSignup {
  name: FormControl;
  email: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  constructor() {
    this.email = new FormControl('', [Validators.required, Validators.maxLength(70)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(70)]);
    this.confirmPassword = new FormControl('', [Validators.required,Validators.maxLength(70)]);
    this.name = new FormControl('', [Validators.required, Validators.maxLength(70)]);
   }
}

export interface IUserToken {
    sub: string;
    name: string;
    fullname: string;
    decodedname:string;
    jobtitle: string;
    email: string;
    phone: string;
    provideravatar: string;
    localavatar:string;
    avatar:string;
    role: string | string[];
    configuration: string;
    localaccount:boolean;
    hasprofile:boolean;
    identityprovider:string;
    permission: PermissionValues | PermissionValues[];
}