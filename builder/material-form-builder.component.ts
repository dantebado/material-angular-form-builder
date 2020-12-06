import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyAmount } from 'src/app/model/membership.model';

export interface FormBuilderOption {
  value: any
  display: String
}

export interface FormBuiilderField {
  type: 'text' | 'password' | 'email' | 'number' | 'date' | 'time' | 'textarea' | 'radio' | 'select' | 'submit' | 'image' | 'currency_amount'
  options?: FormBuilderOption[]
  placeholder?: String
  defvalue?: any
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

export function newCurrencyInput(currencies: FormBuilderOption[], defvalue: CurrencyAmount, required: boolean, width: number, name: string, label: string, binding: (value: any) => void) {
  var type : 'currency_amount' = 'currency_amount'
  return {
    type: type,
    defvalue: defvalue,
    required: required,
    width: width,
    name: name,
    label: label,
    binding: binding,
    options: currencies
  }
}

export function newImageInput(defvalue: string, required: boolean, width: number, name: string, label: string, binding: (value: any) => void, uploadFunction: (contents: string | ArrayBuffer) => Observable<{ url: String }>, uploadCallback: (imageURL: string) => void) {
  var type : 'image' = 'image'
  return {
    type: type,
    defvalue: defvalue,
    required: required,
    width: width,
    name: name,
    label: label,
    binding: binding,
    uploadFunction: uploadFunction,
    uploadCallback: uploadCallback
  }
}

export function newSelectInput(options: FormBuilderOption[], defvalue: any, required: boolean, width: number, name: string, label: string, binding: (value: any) => void) {
  var type : 'select' = 'select'
  return {
    type: type,
    options: options,
    defvalue: defvalue,
    required: required,
    width: width,
    name: name,
    label: label,
    binding: binding
  }
}

export function newRadioInput(options: FormBuilderOption[],defvalue: string, required: boolean, width: number, name: string, label: string, binding: (value: any) => void) {
  var type : 'radio' = 'radio'
  return {
    type: type,
    options: options,
    defvalue: defvalue,
    required: required,
    width: width,
    name: name,
    label: label,
    binding: binding
  }
}

export function newTextareaInput(placeholder: string, defvalue: string, required: boolean, width: number, name: string, label: string, binding: (value: any) => void) {
  var type : 'textarea' = 'textarea'
  return {
    type: type,
    placeholder: placeholder,
    defvalue: defvalue,
    required: required,
    width: width,
    name: name,
    label: label,
    binding: binding
  }
}

export function newTimeInput(defvalue: any, required: boolean, width: number, name: string, label: string, binding: (value: any) => void) {
  var type: 'time' = 'time'
  return {
    type: type,
    defvalue: defvalue,
    required: required,
    width: width,
    name: name,
    label: label,
    binding: binding
  }
}

export function newDateInput(defvalue: any, required: boolean, width: number, name: string, label: string, binding: (value: any) => void) {
  var type: 'date' = 'date'
  return {
    type: type,
    defvalue: defvalue,
    required: required,
    width: width,
    name: name,
    label: label,
    binding: binding
  }
}

export function newTextInput(placeholder: string, defvalue: string, required: boolean, width: number, name: string, label: string, binding: (value: any) => void) {
  var type : 'text' = 'text'
  return {
    type: type,
    placeholder: placeholder,
    defvalue: defvalue,
    required: required,
    width: width,
    name: name,
    label: label,
    binding: binding
  }
}

export function newPasswordInput(placeholder: string, required: boolean, width: number, name: string, label: string, binding: (value: any) => void) {
  var type : 'password' = 'password'
  return {
    type: type,
    placeholder: placeholder,
    required: required,
    width: width,
    name: name,
    label: label,
    binding: binding
  }
}

export function newEmailInput(placeholder: string, defvalue: string, required: boolean, width: number, name: string, label: string, binding: (value: any) => void) {
  var type : 'email' = 'email'
  return {
    type: type,
    placeholder: placeholder,
    defvalue: defvalue,
    required: required,
    width: width,
    name: name,
    label: label,
    binding: binding
  }
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
          if (field.type == 'time') {
            field.donotset = {
              hour: '00',
              minutes: '00'
            }
          }
          if (field.type == 'currency_amount') {
            field.donotset = {
              currency: 'ARS',
              amount: 0.0
            }
            if (!field.defvalue) {
              field.defvalue = field.donotset
            }
          }
          if (field.defvalue != null) {
            field.donotset = field.defvalue
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

  currencyModelChange(currency, amount, field: FormBuiilderField) {
    field.binding({
      currency: currency.value,
      amount: amount
    })
  }

}
