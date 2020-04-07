import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';
import { Note } from '../../models/note';
import { Router } from '@angular/router';
import { NavController,  ModalController, AlertController, ToastController, MenuController } from '@ionic/angular';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { File } from '@ionic-native/file/ngx';



@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit  {
notes: Note[] = [];
test:string = "";
noteModel: Note = new Note();
itemToEdit: Note = new Note();
errorMessage: string = "";
status: string = "";
themes: any[] = [
  {'name':'themeBlack', 'color':'#000000', 'status':false},
  {'name':'themeYellow', 'color':'#f5c800', 'status':false},
  {'name':'themeGreen', 'color':'#0082fc', 'status':false}
];

  constructor(private storageService: StorageService,
              private router: Router,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController, 
              private file: File, 
                                                  ) {
                                                    //get notes all from storage
    this.storageService.getNote().then((notes: Note[]) => {
      if (notes !== null && notes !== undefined){
        this.notes = notes;
        // alert(this.notes);
        // alert(this.notes);
      }
      
    });

                                                    }
  ionViewDidEnter() { 
    this.storageService.getTheme().then((theme: any[]) => {
      if(theme === null || theme=== undefined){
        this.storageService.setTheme(this.themes);
        return
      }else{
         this.themes = theme;
      }
     

    });
     this.storageService.getItemToEdit().then((item: Note) => {
       if(item!==null && item!==undefined){
         this.itemToEdit = item;
       }else{
         this.itemToEdit = new Note;
       }
      
      console.log(item)
    });
    this.storageService.getEditOrCreateStatus().then((status:string) => {
      this.status = status; 
      // alert(status)
      this.getEditOrCreateStatus(status);
    });
    
    //get notes all from storage
    this.storageService.getNote().then((notes: Note[]) => {
      if (notes !== null && notes !== undefined){
        this.notes = notes;
        // alert(this.notes);
        // alert(this.notes);
      }
      
    });
   
  } 
  ngOnInit() { 
 
  }
 
  
 
  
  getEditOrCreateStatus(status: any){
    if(status ==="create"){
      this.test = "Create";
    }
    if(status ==="edit"){
      
      // alert("st"+this.status)
      this.test = "Edit";

    }
  };
  async cancel(){
    //confirm cancel
    
      let confirm = await this.alertCtrl.create({
        header: "Confirm exit",
        subHeader: 'Do you want discard all change?',
        cssClass:"alert_custom",
        buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.router.navigate(['notes']);
            // this.storageService.saveNote(this.notes);
          }
        },
        {
          text: 'No',
          handler: () => {
            return true;
          }
        }
      ]
      });
       confirm.present();
    //fin removePaymentMedia
    

  }
  checkData(){
    if(this.status ==="create"){
       if(this.noteModel.title === undefined){
      this.errorMessage = "Please set a title";
      return false;
    }
    if(this.noteModel.content === undefined){
      this.errorMessage = "Please set content";
      return false;
    }
    return true;
    }
    if(this.status ==="edit"){
       if(this.itemToEdit.title === undefined){
      this.errorMessage = "Please set a title";
      return false;
    }
    if(this.itemToEdit.content === undefined){
      this.errorMessage = "Please set content";
      return false;
    }
    return true;
    }
   
  }
 

  
  editNote(){
   //check on noteModel
   if(!this.checkData()){
    this.presentToast(this.errorMessage);
    return;
  }
     let toBeReplaced = this.notes.findIndex(x => x.id === this.itemToEdit.id);
    
      //time handling
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
if(toBeReplaced === -1) {
  this.presentToast("Not found");
  return;
}
if (toBeReplaced > -1) {
 //set time
 this.itemToEdit.update_date = date;
 this.itemToEdit.update_time = time;
  this.notes.splice(toBeReplaced, 1, this.itemToEdit);
  
  this.storageService.saveNote(this.notes);
  this.storageService.setItemToEdit(null);
  this.presentToast("Updated !");
 this.router.navigate(['notes']);

} 
}
  saveNote(){
    //check on noteModel
    if(!this.checkData()){
      this.presentToast(this.errorMessage);
      return;
    }
    //time handling
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        //set id
        if(this.notes!==null && this.notes !== undefined){

       
      let lastNote = this.notes[this.notes.length-1];
      
      if(lastNote !== undefined && lastNote !== null){
        let lastId = lastNote.id;
        if(lastId !== undefined && lastId !== null ){
        this.noteModel.id = lastNote.id + 1;
      }else{
        this.noteModel.id = 0;
      }
      }else{
        this.noteModel.id = 0;
      }
 }else{
  this.noteModel.id = 0;
}
      //set time
      this.noteModel.create_date = date;
      this.noteModel.create_time = time;
      //push into notes array
    this.notes.push(this.noteModel); 
    
    this.storageService.saveNote(this.notes);
    this.noteModel = new Note;
    this.presentToast("Saved !");
    this.router.navigate(['notes']);   
    
  }
  //end saveNote

  //presentToast
  async presentToast(message: any){
    let toast = await this.toastCtrl.create(
      {  message: message,
      duration: 4000,
       position: 'bottom'
      });
      toast.present();
  }//end presentToast


  /////////////////////////////////////////////////////////////////////////////////


  createFile(item: Note) {
    let filename = item.title
this.file.createFile(this.file.dataDirectory, filename, true);
} 
writeFile(item: Note) {
  let filename = item.title
let stringToWrite = item.content;
let blob = new Blob([stringToWrite], { type: "text/plain" });
this.file.writeFile(this.file.dataDirectory, filename, blob, {replace: true, append:
false});
}
// async readFile() {
//   let filename = item.title
// this.promise = this.file.readAsText(this.file.dataDirectory, filename);
// await this.promise.then(value => {
// console.log(value);
// });
}
