import { IUser } from "../../common/interfaces";
import { PermissionValues } from "../../common/types";
import { Util } from "../../utilities";
import { IUserToken } from "./login.model";

export class User implements IUser {
  permissions: PermissionValues[];
  id: string;
  userName: string;
  fullName: string;
  firstName: string;
  email: string;
  avatar?: string;
  localAvatar?: string;
  providerAvatar?: string;
  jobTitle?: string;
  phoneNumber?: string;
  isEnabled?: boolean;
  isLockedOut?: boolean;
  isAdmin?: boolean;
  emailConfirmed?: boolean;
  identityProvider?: string;
  localAccount?: boolean;
  roles?: string[];
  externalId?: string;
  status?: string;
 
 constructor(token: IUserToken) {
  this.id = token.sub;
  this.userName = token.decodedname || token.name;
  this.fullName = token.fullname;
  this.email = token.email;
  this.jobTitle = token.jobtitle;
  this.phoneNumber = token.phone;
  this.providerAvatar = token.provideravatar;
  this.localAvatar = token.localavatar;
  this.identityProvider = token.identityprovider;
  this.localAccount = Util.parseBool(token.localaccount);
  this.roles = Util.toArray(token.role);
  this.permissions = Util.toArray(token.permission);
  this.firstName = Util.getFirstName(this.fullName);
  this.isAdmin = this.roles.includes("backendadmin");
  this.isEnabled = true;
   User.SetAavatar(this);
  }

  static Update(user:User, vm: any):void {
    user.roles = Util.toArray(vm.roles);
  }

  static isAdmin(user: User): boolean {
    return user?.isAdmin || false
  }

  static SetAavatar(user:User):void{
    user.avatar = user.localAvatar || user.providerAvatar;
   }
 
}
