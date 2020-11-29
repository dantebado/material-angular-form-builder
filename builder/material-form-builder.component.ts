import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

export interface FormBuiilderField {
  type: 'text' | 'password' | 'email' | 'number' | 'date' | 'time' | 'textarea' | 'radio' | 'select' | 'submit' | 'image'
  options?: { value: String, display: String }[]
  placeholder?: String
  default?: any
  required?: boolean
  width?: number // 1 - 12
  name?: string
  label?: string
  donotset?: any
  max?: number
  min?: number
  step?: number
  uploadFunction?: (contents: string | ArrayBuffer) => Observable<{ url: String }>
  uploadCallback?: (imageURL: string) => void
  disabled?: () => boolean
  binding: (value: any) => void
}

export interface FormBuilderRow {
  cols: FormBuiilderField[]
}

export interface FormBuilderData {
  title?: String
  rows: FormBuilderRow[]
}

@Component({
  selector: 'app-material-form-builder',
  templateUrl: './material-form-builder.component.html',
  styleUrls: ['./material-form-builder.component.scss']
})
export class MaterialFormBuilderComponent implements OnInit {

  @Input() form: FormBuilderData

  constructor() { }

  ngOnInit(): void {
    if (!this.form) {
      console.log("empty form data passed")
    } else {
      this.form.rows.forEach(row => {
        row.cols.forEach(field => {
          if (!field.name) {
            field.name = new Date().valueOf() + ""
          }
          if (field.default) {
            field.donotset = field.default
          }
          if (field.type == 'time') {
            field.donotset = {
              hour: '00',
              minutes: '00'
            }
          }
        })
      })
    }
  }

  getRangeOfHours() {
    var hours = []
    for (var i = 0; i <= 23; i++) {
      hours.push( (i < 10) ? ("0" + i) : ("" + i) )
    }
    return hours;
  }

  getRangeOfMinutes() {
    var minutes = []
    for (var i = 0; i < 60; i += 5) {
      minutes.push( (i < 10) ? ("0" + i) : ("" + i) )
    }
    return minutes;
  }

  timeModelChange(hour, minutes, field: FormBuiilderField) {
    if (hour.value === undefined) {
      hour.value = '00'
    }
    if (minutes.value === undefined) {
      minutes.value = '00'
    }
    field.binding(hour.value + ":" + minutes.value + ":00")
  }

}
