import { AbstractControl } from "@angular/forms"

export function EmailValidator(control: AbstractControl) {
    const emailRegex: RegExp =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let invalid = !emailRegex.test(control.value)
    if (control.value === null || control.value === '') {
        invalid = false
    }
    return invalid ? { invalidEmail: { value: control.value } } : null
}