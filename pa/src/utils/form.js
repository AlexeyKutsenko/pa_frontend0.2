import {
    ChoiceValidator,
    DecimalValidator,
    IntegerValidator,
    MaxValueValidator,
    MinValueValidator,
    RequiredValidator,
    TextValidator
} from "./validators";

class FormField {
    constructor(fieldInfo) {
        this.data = null;
        this.label = fieldInfo['label'];
        this.required = fieldInfo['required'];
        this.valid = null;
        this.validators = [];
        this.errors = [];
        this.query_param = fieldInfo['query_param'] || false;

        if (fieldInfo['required']) {
            this.validators.push(new RequiredValidator())
        }

    }

    validate() {
        this.valid = true;
        this.errors = [];

        this.validators.forEach(validator => {
            let validationResult = validator.validate(this.data);
            if (validationResult !== true) {
                this.errors.push(validationResult);
                this.valid = false;
            }
        });
    }
}

class NumberFormField extends FormField {
    type = 'number';

    constructor(fieldInfo) {
        super(fieldInfo);
        if (fieldInfo.hasOwnProperty('min_value')) {
            this.validators.push(new MinValueValidator(fieldInfo['min_value']))
        }
        if (fieldInfo.hasOwnProperty('max_value')) {
            this.validators.push(new MaxValueValidator(fieldInfo['max_value']))
        }
    }
}

class DecimalFormField extends NumberFormField {
    constructor(fieldInfo) {
        super(fieldInfo);
        this.validators.push(new DecimalValidator())
    }
}

class IntegerFormField extends NumberFormField {
    constructor(fieldInfo) {
        super(fieldInfo);
        this.validators.push(new IntegerValidator())
    }
}

class TextFormField extends FormField {
    type = 'text';

    constructor(fieldInfo) {
        super(fieldInfo);
        this.validators.push(new TextValidator())
    }
}

class ChoiceFormField extends FormField {
    type = 'choice';
    choices = [];

    constructor(fieldInfo) {
        super(fieldInfo);

        fieldInfo['choices'].forEach(choice => {
            this.choices.push({
                'value': choice['value'],
                'text': choice['display_name'] ? choice['display_name']: choice['value']
            })
        });

        this.validators.push(new ChoiceValidator(this.choices))
    }
}

const typesInfo = {
    'decimal': DecimalFormField,
    'integer': IntegerFormField,
    'string': TextFormField,
    'choice': ChoiceFormField,
};

export class Form {
    fields = {};
    valid = true;

    constructor(fieldsInfo) {
        for (const field in fieldsInfo) {
            if (fieldsInfo.hasOwnProperty(field)) {
                let formField = typesInfo[fieldsInfo[field]['type']];
                this.fields[field] = new formField(fieldsInfo[field]);
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