import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  @Input() uploadFunction: (contents: string | ArrayBuffer) => Observable<{ url: string }>;
  @Input() callback: (imageURL: string) => void;
  @Input() currentURL: string

  uploading = false
  originalURL: string

  constructor(private http: HttpClient) {
    if (!this.currentURL) {
      this.currentURL = 'http://via.placeholder.com/640x640'
    }
    this.originalURL = this.currentURL
  }
  ngOnInit(): void { }

  files: File[] = [];

  onImageSelect(event) {
    this.files.push(...event.addedFiles);
    this.uploading = true;
    try {
      this.readFile(this.files[0]).then(fileContents => {
        this.uploading = true;
        this.uploadFunction(fileContents)
          .subscribe(
            (res) => {
              this.currentURL = res.url
              this.notifyNewImageURL(this.currentURL, event)
              this.uploading = false;
            },
            (err) => {
              this.onImageRemove(event);
              this.uploading = false;
            }
          )
      });
    } catch (error) {
      this.uploading = false;
      this.notifyNewImageURL(this.currentURL, event)
    }
  }

  notifyNewImageURL(url: string, event) {
    /*this.http.get<any>(url)
      .toPromise()
      .then(val => {
      })
      .catch(err => {
        this.currentURL = this.originalURL
        this.onImageRemove(event);
        this.callback(this.currentURL)
        throw err
      })*/
    this.callback(url)
  }

  onImageRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };
      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };
      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }
      reader.readAsDataURL(file);
    });
  }

}
