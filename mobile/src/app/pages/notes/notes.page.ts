import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { Note } from '../../models/note';
import { ToastController, AlertController, Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';



@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
notes: Note[] = [];
today = new Date();
date = this.today.getFullYear()+'-'+(this.today.getMonth()+1)+'-'+this.today.getDate();
  blob: Blob;
  filename: any;
  stringToWrite: string;
  dirName: string;
  isThemeBlack: boolean = false;
  isThemeYellow: boolean = false;
  isThemeGreen: boolean = false;
  themes: any[] = [
    {'name':'themeBlack', 'color':'#000000', 'status':false},
    {'name':'themeYellow', 'color':'#f5c800', 'status':false},
    {'name':'themeGreen', 'color':'#0082fc', 'status':false}
  ];

  constructor(private router: Router, 
    private storageService: StorageService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private file: File, private platform: Platform,) { 
     
      this.platform.ready().then(() => {
this.createDirectory();
      });
      
    // this.storageService.getNote().then((notes: Note[]) => {
    //   this.notes = notes;
    //   console.log(this.notes)

    // });
  
}
createDirectory() {
  this.dirName = "Note Pad 2.0"
  this.file.checkDir(this.file.externalRootDirectory, this.dirName)
  .then((success) => console.log('Directory exists'))
  .catch((err) => {console.log('Directory doesnt exist');
this.presentToast(this.file.externalRootDirectory + this.dirName + " directory created successfully!")
    this.file.createDir(this.file.externalRootDirectory, this.dirName, true);
}); 
}

  ngOnInit() {
  }
  ionViewDidEnter(){
    
    this.storageService.getNote().then((notes: Note[]) => {
      this.notes = notes;
      console.log(this.notes)
    });
    this.storageService.getTheme().then((theme: any[]) => {
      if(theme === null || theme=== undefined){
        this.storageService.setTheme(this.themes);
        return
      }else{
         this.themes = theme;
      }
     

    });


  }
  //create a note
  createNote(){
    // alert(JSON.stringify(this.notes));
    this.storageService.setEditOrCreateStatus("create");
    this.router.navigate(['edit']);
    
  } 
  // end createNote 
  //create a note
  editNote(item: Note){
    // alert(JSON.stringify(this.notes));
     this.storageService.setItemToEdit(item);
    this.storageService.saveNote(this.notes);
    this.storageService.setEditOrCreateStatus("edit");
   
    this.router.navigate(['edit']);
    
  } 
  // end createNote

async deleteNote(oldNote:Note){
  let confirm = await this.alertCtrl.create({
    header: "Confirm delete",
    subHeader: 'Do you want delete this note ?',
    cssClass:"background-color: rgba($color: #000000, $alpha: 1.0);",
    buttons: [
    {
      text: 'Yes',
      handler: () => {
        let notesArray = this.notes;
        //  alert(this.notes);
            console.log(notesArray);
           let toBeReplaced = notesArray.findIndex(x => x.id === oldNote.id);
            //  alert(toBeReplaced);
            console.log(toBeReplaced);
            
      
      if (toBeReplaced > -1) {
        console.log(notesArray);
        console.log("before");
        this.notes.splice(toBeReplaced, 1);
        
      this.storageService.saveNote(notesArray);
      console.log(notesArray);
     
       this.presentToast("Deleted !");
      } 
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
    
 
 
  
 }
  
 //presentToast
 async presentToast(message: any){
  let toast = await this.toastCtrl.create(
    {  message: message,
    duration: 4000,
     position: 'bottom'
    });
    toast.present();
}//end presentToast


///////////////////////////////////////////////::::

async saveAsTxt(item: Note) { 
  this.filename = item.title
  this.stringToWrite = item.content;
  let confirm = await this.alertCtrl.create({
    header: "Save",
    subHeader: 'Please set file name',
    cssClass:"background-color: rgba($color: #000000, $alpha: 1.0);",
    inputs: [
     { type: "text",
      value:this.filename,
      name:'filename_custom',
      handler: (input) => {
        this.filename = input.value;
      },
      }
    ],
    buttons: [
    {
      text: 'Save',
      handler: (data) => {
        if(data.filename_custom!==null){
                 this.filename = data.filename_custom;
        }
      this.file.createFile(this.file.externalRootDirectory, this.filename, true);
        
     
      let filePath = this.file.externalRootDirectory + this.dirName;
      this.blob = new Blob([this.stringToWrite], { type: "text/plain" });
      this.file.writeFile(filePath, this.filename +".txt", this.blob, {replace: true, append: false})
        .then((success) => {
          this.presentToast('Saved successfully at : '+filePath);
          // alert(JSON.stringify(success));

        })
        .catch((err) => {
          // alert(JSON.stringify(err))
        });
          } 
    },
    {
      text: 'Cancel',
      handler: () => {
        return true;
      }
    }
  ]
  });
   confirm.present();
  
}
//theme switcher
  themeSwitch(index: any)
  {
    
    this.themes[0].status = false;
    this.themes[1].status = false;
    this.themes[2].status = false;

    this.themes[index].status = true;
    this.storageService.setTheme(this.themes);
  }//end
}
