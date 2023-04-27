import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { isPlatformServer } from '@angular/common';
import { ServerStorage } from './server-store';
import { Util } from '../../utilities';

@Injectable({ providedIn: 'root' })
/**
* Provides a wrapper for accessing the web storage API and synchronizing session storage across tabs/windows.
*/
export class LocalStoreManager {

  private static syncListenerInitialised = false;
  private syncKeys: string[] = [];
  private initEvent = new Subject<void>();
  private reservedKeys: string[] =
    [
      'sync_keys',
      'addToSyncKeys',
      'removeFromSyncKeys',
      'getSessionStorage',
      'setSessionStorage',
      'addToSessionStorage',
      'removeFromSessionStorage',
      'clearAllSessionsStorage'
    ];

  public static readonly DBKEY_USER_DATA = "user_data";
  private static readonly DBKEY_SYNC_KEYS = "sync_keys";

  private $isPlatformServer: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
      this.$isPlatformServer = isPlatformServer(this.platformId);
  }
  
  get session():Storage { return this.$isPlatformServer ? ServerStorage.session : sessionStorage; }
  get local() { return this.$isPlatformServer ?  ServerStorage.local : localStorage; }

  initialiseStorageSyncListener() {
    if (LocalStoreManager.syncListenerInitialised == true)
      return;

    LocalStoreManager.syncListenerInitialised = true;
    window.addEventListener("storage", this.sessionStorageTransferHandler, false);
    this.syncSessionStorage();
  }

  deinitialiseStorageSyncListener() {

    window.removeEventListener("storage", this.sessionStorageTransferHandler, false);

    LocalStoreManager.syncListenerInitialised = false;
  }

  private sessionStorageTransferHandler = (event: StorageEvent) => {

    if (!event.newValue)
      return;

    if (event.key == 'getSessionStorage') {
      if (this.session.length) {
        this.localStorageSetItem('setSessionStorage', this.session);
        localStorage.removeItem('setSessionStorage');
      }
    }
    else if (event.key == 'setSessionStorage') {

      if (!this.syncKeys.length)
        this.loadSyncKeys();

      const data = JSON.parse(event.newValue);
     
      for (const key in data) {
        if (this.syncKeysContains(key))
          this.sessionStorageSetItem(key, JSON.parse(data[key]));
      }

      this.onInit();
    }
    else if (event.key == 'addToSessionStorage') {
      const data = JSON.parse(event.newValue);
      this.addToSessionStorageHelper(data["data"], data["key"]);
    }
    else if (event.key == 'removeFromSessionStorage') {
      this.removeFromSessionStorageHelper(event.newValue);
    }
    else if (event.key == 'clearAllSessionsStorage' && this.session.length) {
      this.clearInstanceSessionStorage();
    }
    else if (event.key == 'addToSyncKeys') {
      this.addToSyncKeysHelper(event.newValue);
    }
    else if (event.key == 'removeFromSyncKeys') {
      this.removeFromSyncKeysHelper(event.newValue);
    }
  }


  private syncSessionStorage() {

    localStorage.setItem('getSessionStorage', '_dummy');
    localStorage.removeItem('getSessionStorage');
  }


  public clearAllStorage() {

    this.clearAllSessionsStorage();
    this.clearLocalStorage();
  }


  public clearAllSessionsStorage() {

    this.clearInstanceSessionStorage();
    localStorage.removeItem(LocalStoreManager.DBKEY_SYNC_KEYS);

    localStorage.setItem('clearAllSessionsStorage', '_dummy');
    localStorage.removeItem('clearAllSessionsStorage');
  }


  public clearInstanceSessionStorage() {
    this.session.clear();
    this.syncKeys = [];
  }

  /**
   * LOCAL STORAGE
   */

  clearLocalStorage() {
      this.local.clear();
  }

  private addToSessionStorage(data: any, key: string) {
    this.addToSessionStorageHelper(data, key);
    this.addToSyncKeysBackup(key);
    this.localStorageSetItem('addToSessionStorage', { key: key, data: data });
    this.local.removeItem('addToSessionStorage');
  }

  private addToSessionStorageHelper(data: any, key: string) {
    this.addToSyncKeysHelper(key);
    this.sessionStorageSetItem(key, data);
  }

  private removeFromSessionStorage(keyToRemove: string) {
    this.removeFromSessionStorageHelper(keyToRemove);
    this.removeFromSyncKeysBackup(keyToRemove);
    this.local.setItem('removeFromSessionStorage', keyToRemove);
    this.local.removeItem('removeFromSessionStorage');
  }


  private removeFromSessionStorageHelper(keyToRemove: string) {
    this.session.removeItem(keyToRemove);
    this.removeFromSyncKeysHelper(keyToRemove);
  }


  private testForInvalidKeys(key: string) {

    if (!key)
      throw new Error("key cannot be empty")

    if (this.reservedKeys.some(x => x == key))
      throw new Error(`The storage key "${key}" is reserved and cannot be used. Please use a different key`);
  }


  private syncKeysContains(key: string) {

    return this.syncKeys.some(x => x == key);
  }


  private loadSyncKeys() {

    if (this.syncKeys.length)
      return;

    this.syncKeys = this.getSyncKeysFromStorage();
  }


  private getSyncKeysFromStorage(defaultValue: string[] = []): string[] {

    const data = this.localStorageGetItem(LocalStoreManager.DBKEY_SYNC_KEYS);

    if (data == null)
      return defaultValue;
    else
      return <string[]>data;
  }


  private addToSyncKeys(key: string) {

    this.addToSyncKeysHelper(key);
    this.addToSyncKeysBackup(key);
    this.local.setItem('addToSyncKeys', key);
    this.local.removeItem('addToSyncKeys');
  }


  private addToSyncKeysBackup(key: string) {

    const storedSyncKeys = this.getSyncKeysFromStorage();

    if (!storedSyncKeys.some(x => x == key)) {
      storedSyncKeys.push(key);
      this.localStorageSetItem(LocalStoreManager.DBKEY_SYNC_KEYS, storedSyncKeys);
    }
  }

  private removeFromSyncKeysBackup(key: string) {

    const storedSyncKeys = this.getSyncKeysFromStorage();

    const index = storedSyncKeys.indexOf(key);

    if (index > -1) {
      storedSyncKeys.splice(index, 1);
      this.localStorageSetItem(LocalStoreManager.DBKEY_SYNC_KEYS, storedSyncKeys);
    }
  }


  private addToSyncKeysHelper(key: string) {

    if (!this.syncKeysContains(key))
      this.syncKeys.push(key);
  }



  private removeFromSyncKeys(key: string) {

    this.removeFromSyncKeysHelper(key);
    this.removeFromSyncKeysBackup(key);

    this.local.setItem('removeFromSyncKeys', key);
    this.local.removeItem('removeFromSyncKeys');
  }


  private removeFromSyncKeysHelper(key: string) {

    const index = this.syncKeys.indexOf(key);

    if (index > -1) {
      this.syncKeys.splice(index, 1);
    }
  }


  saveSessionData(data: any, key = LocalStoreManager.DBKEY_USER_DATA) {

    this.testForInvalidKeys(key);

    this.removeFromSyncKeys(key);
    this.local.removeItem(key);
    this.sessionStorageSetItem(key, data);
  }


  saveSyncedSessionData(data: any, key = LocalStoreManager.DBKEY_USER_DATA) {
    this.testForInvalidKeys(key);
    this.local.removeItem(key);
    this.addToSessionStorage(data, key);
  }


  savePermanentData(data: any, key = LocalStoreManager.DBKEY_USER_DATA) {

    this.testForInvalidKeys(key);

    this.removeFromSessionStorage(key);
    this.localStorageSetItem(key, data);
  }



  moveDataToSessionStorage(key = LocalStoreManager.DBKEY_USER_DATA) {

    this.testForInvalidKeys(key);

    const data = this.getData(key);

    if (data == null)
      return;

    this.saveSessionData(data, key);
  }


  public moveDataToSyncedSessionStorage(key = LocalStoreManager.DBKEY_USER_DATA) {

    this.testForInvalidKeys(key);

    const data = this.getData(key);

    if (data == null)
      return;

    this.saveSyncedSessionData(data, key);
  }


  public moveDataToPermanentStorage(key = LocalStoreManager.DBKEY_USER_DATA) {

    this.testForInvalidKeys(key);

    const data = this.getData(key);

    if (data == null)
      return;

    this.savePermanentData(data, key);
  }


  exists(key = LocalStoreManager.DBKEY_USER_DATA): boolean {
    
    let data = this.session.getItem(key);

    if (data == null) data = this.local.getItem(key);

    return data != null;
  }


  getData(key = LocalStoreManager.DBKEY_USER_DATA) {

    this.testForInvalidKeys(key);

    let data = this.sessionStorageGetItem(key);

    if (data == null) data = this.localStorageGetItem(key);

    return data;
  }


  getDataObject<T>(key = LocalStoreManager.DBKEY_USER_DATA, isDateType = false): T | undefined {

    let data = this.getData(key);

    if (data != null) {
      if (isDateType)
        data = new Date(data);

      return <T>data;
    }
    else {
      return undefined;
    }
  }

  deleteData(key = LocalStoreManager.DBKEY_USER_DATA) {
    this.testForInvalidKeys(key);
    this.removeFromSessionStorage(key);
    this.local.removeItem(key);
  }

  getInitEvent(): Observable<any> {
    return this.initEvent.asObservable();
  }

  private localStorageSetItem(key: string, data: any) {
     this.local.setItem(key, JSON.stringify(data));
  }

  private sessionStorageSetItem(key: string, data: any): void {
     this.session.setItem(key, JSON.stringify(data));
  }

  private localStorageGetItem(key: string) : any {
    return Util.jsonTryParse(this.local.getItem(key));
  }

  private sessionStorageGetItem(key: string): any {
     return Util.jsonTryParse(this.session.getItem(key));
  }

  private onInit() {
    setTimeout(() => {
      this.initEvent.next();
      this.initEvent.complete();
    });
  }
}
