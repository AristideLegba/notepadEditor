import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Note } from '../../models/note';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
STATUS = "stat";
NOTES = "";
ITEM = "ITEM_TO_EDIT";
  THEME: string;
  constructor(private storage: Storage) { }

  setEditOrCreateStatus(status:any){
    this.storage.set(this.STATUS, status);
  };
  getEditOrCreateStatus(){
    return this.storage.get(this.STATUS).then((status: any) => {
      return status;
    });
  }
  saveNote(item: Note[]){
    this.storage.set(this.NOTES, item);
  };
  getNote(){
    return this.storage.get(this.NOTES).then((notes: Note[]) => {
      return notes;
    });
  }
  setItemToEdit(item: Note){
    this.storage.set(this.ITEM, item);
  };
  getItemToEdit(){
    return this.storage.get(this.ITEM).then((item: Note) => {
      return item;
    });
  }
  setTheme(item: any){
    this.storage.set(this.THEME, item);
  };
  getTheme(){
    return this.storage.get(this.THEME).then((item: any) => {
      return item;
    });
  }
}
