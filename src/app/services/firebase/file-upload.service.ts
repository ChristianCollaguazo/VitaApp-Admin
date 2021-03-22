import { FileUpload } from './../../controller/models/FileUpload';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private basePath = '/pictograms/images';
  constructor(
    private storage: AngularFireStorage
  ) {}

  // * Agregar archivos para ser subidos a firebase
  pushFileToStorage(fileUpload: FileUpload): Observable<any> {
    // * Se crea la ruta donde se guardara el archivo con su nombre incluido
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    // * Se obtine la referecia al path donde se guardara el archivo
    const storageRef = this.storage.ref(filePath);
    // * Se manda a guradar el archivo para esto se envia el path y el archivo.
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
    // * El proceso de subida es async por lo que debemos espera a que se finalize la subida
    // * por medio finalize() de rxjs
    return uploadTask
      .snapshotChanges()
      .pipe(
        map(resp => {
          fileUpload.progres = resp.bytesTransferred * 100 / resp.totalBytes;

          return resp;
        })
      );

    // * Sirve para guardar el progreso 1 - 100 de subida de un archivo.
    // return uploadTask.percentageChanges();
  }

  // * Sirve para eliminar un archivo subido a Storage de firebase
  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}
