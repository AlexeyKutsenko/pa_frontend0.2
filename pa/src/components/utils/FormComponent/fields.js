import {
    ChoiceValidator,
    DecimalValidator,
    IntegerValidator,
    MaxValueValidator,
    MinValueValidator,
    RequiredValidator,
    TextValidator
} from "./validators";
import {getBaseApi} from "../../../api/api";
import {errorMsg} from "../../../utils/msgHelpers";

class Field {
    constructor(fieldInfo) {
        this.classes = fieldInfo['classes']
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

class NumberField extends Field {
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

export class DecimalField extends NumberField {
    constructor(fieldInfo, value) {
        super(fieldInfo);
        this.validators.push(new DecimalValidator())

        this.data = value
    }
}

export class IntegerField extends NumberField {
    constructor(fieldInfo, value) {
        super(fieldInfo);
        this.validators.push(new IntegerValidator())
        this.data = value
    }
}


export class TextField extends Field {
    type = 'text';

    constructor(fieldInfo, value) {
        super(fieldInfo);
        this.validators.push(new TextValidator())
        this.data = value
    }
}

export class ChoiceField extends Field {
    api = getBaseApi();
    type = 'choice';
    choices = [];

    constructor(fieldInfo, value) {
        super(fieldInfo);

        if (fieldInfo['url']) {
            this.url = fieldInfo['url']
            this.api
                .get(this.url)
                .then(response => {
                    response.data.results.forEach(element => {
                        this.choices.push({
                            value: element.id,
                            text: element.name
                        })
                    })
                })
                .catch(error => {
                    errorMsg(error.data)
                })
        } else {
            this.choices.push({
                value: value,
                text: value,
            })
        }
        this.data = value

        this.validators.push(new ChoiceValidator(this.choices))
    }
}
