// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';
// 
// export type User = {
//   id: number
//   name: string
// }

import * as mathjs from 'mathjs'

export type UnitFieldValue = InvalidUnitFieldValue | ValidUnitFieldValue

export class InvalidUnitFieldValue {
    constructor(
        public readonly textValue: string,
        public readonly acceptedUnit: string,
        public readonly error: string) { }
    isError(): boolean { return true }
}

export class ValidUnitFieldValue {
    constructor(
        public readonly textValue: string,
        public readonly acceptedUnit: string,
        public readonly value: number | mathjs.Unit) { }
    isError(): boolean { return false }
}