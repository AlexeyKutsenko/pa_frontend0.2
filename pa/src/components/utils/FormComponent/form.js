import {ChoiceField, DecimalField, IntegerField, TextField} from "./fields";

const typesInfo = {
    'choice': ChoiceField,
    'decimal': DecimalField,
    'field': ChoiceField,
    'integer': IntegerField,
    'string': TextField,
};

export class Form {
    fields = {};
    valid = true;

    constructor(fieldsInfo, entity) {
        for (const field in fieldsInfo) {
            if (fieldsInfo.hasOwnProperty(field)) {
                let formField = typesInfo[fieldsInfo[field]['type']];
                if (formField !== null) {
                    let value = entity ? entity[field] : null
                    this.fields[field] = new formField(fieldsInfo[field], value);
                }
            } else {
                throw Error('Not implemented')
            }
        }
    }


    validate() {
        this.valid = true;
        for (const field in this.fields) {
            if (this.fields.hasOwnProperty(field)) {
                this.fields[field].validate();

                if (this.valid && !this.fields[field].valid) {
                    this.valid = false;
                }
            }
        }
    }
}
