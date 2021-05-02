import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Color } from 'src/app/controller/interfaces/color.interface';
import { FileUploadResponse } from 'src/app/controller/interfaces/image.interface';
import { PictogramHelp } from 'src/app/controller/interfaces/pictogram-help.interface';
import { Pictogram } from 'src/app/controller/interfaces/pictogram.interface';
import { VitaappService } from 'src/app/services/vitaapp/vitaapp.service';
import { ImagesRadioComponent } from '../../images/images-radio/images-radio.component';
import { UploadFormComponent } from '../../uploadFile/upload-form/upload-form.component';
declare var Notify: any;

@Component({
  selector: 'app-form-helper',
  templateUrl: './form-helper.component.html',
  styleUrls: ['./form-helper.component.scss'],
})
export class FormHelperComponent implements OnInit {
  @ViewChild('uploadFileComp') uploadFileComp: UploadFormComponent;
  @Output() reloadPictograms = new EventEmitter<boolean>();
  @ViewChild('imageRadioPictogram') imageRadioPictogram: ImagesRadioComponent;
  invalidUrl = false;
  colors: Color[] = [];
  formPictogram: FormGroup;
  constructor(
    private vitaapp: VitaappService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.vitaapp.getColor().subscribe(
      (colors) => {
        this.colors = colors;
        console.log(colors);
      },
      (err) => console.log('error al cargar los colores')
    );
  }

  savePictogram(): void {
    this.setImageURL(this.imageRadioPictogram.imagePrimary);
    if (this.formPictogram.valid) {
      const pictogram: PictogramHelp = {
        name: this.getName,
        imageUrl: this.getImageURL,
        images: this.imageRadioPictogram.getImages,
      };
      console.log(pictogram);

      this.initializeForm();
      this.uploadFileComp.inicializeUpload();

      this.vitaapp.savePictogramHelp(pictogram).subscribe(
        (resp) => {
          console.log(resp);
          this.reloadPictograms.emit(true);
          Notify('Pictograma agregada correctamente.', null, null, 'success');
        },
        (err) => {
          console.log(err);
          Notify('Error al agregar un pictograma.', null, null, 'danger');
        }
      );
    } else {
      this.validateForm();
      this.invalidUrl = this.formPictogram.get('imageURL').invalid;
    }
  }

  initializeForm(): void {
    this.invalidUrl = false;
    this.formPictogram = this.formBuilder.group({
      name: ['', Validators.required],
      imageURL: ['', Validators.required],
    });
    if (this.imageRadioPictogram) {
      this.imageRadioPictogram.emptyImages();
    }
  }

  get invalidName(): boolean {
    return (
      this.formPictogram.get('name').invalid &&
      this.formPictogram.get('name').touched
    );
  }

  setImageURL(imageURL: string): void {
    if (imageURL) {
      this.invalidUrl = false;
    } else {
      this.invalidUrl = true;
    }
    this.formPictogram.get('imageURL').setValue(imageURL);
  }

  addImage(src: FileUploadResponse): void {
    this.imageRadioPictogram.addImage(src);
  }

  get getName(): string {
    return this.formPictogram.get('name').value;
  }

  get getImageURL(): string {
    return this.formPictogram.get('imageURL').value;
  }

  validateForm(): void {
    if (this.formPictogram.invalid) {
      return Object.values(this.formPictogram.controls).forEach((control) =>
        control.markAllAsTouched()
      );
    }
  }
}
