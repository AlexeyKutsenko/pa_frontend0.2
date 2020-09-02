class Validator {
    validate(data) {
        return Boolean(data);
    }
}

export class MinValueValidator extends Validator {
    constructor(min_value) {
        super();
        this.min_value = min_value
    }

    validate(data) {
        return data >= this.min_value ? true : `Field must be greater than ${this.min_value}`;
    }
}

export class MaxValueValidator extends Validator {
    constructor(max_value) {
        super();
        this.max_value = max_value
    }

    validate(data) {
        return data <= this.max_value ? true : `Field must be lower than ${this.max_value}`
    }
}

export class DecimalValidator extends Validator {
    validate(data) {
        return isNaN(Number(data)) ? 'Field is not a number' : true;
    }
}

export class IntegerValidator extends DecimalValidator {
    validate(data) {
        if (super.validate(data) === true && Number.isInteger(Number(data))) {
            return true
        }
        return 'Field is not an integer'
    }
}

export class RequiredValidator extends Validator {
    validate(data) {
        return data !== null ? true : 'Field is an empty'
    }
}

export class TextValidator extends RequiredValidator {
    validate(data) {
        return super.validate(data) === true &&
        data.trim() !== '' ? true : 'Field doesn\'t contain any characters'
    }
}

export class ChoiceValidator extends Validator {
    constructor(choices) {
        super();
        this.choices = choices
    }

    validate(data) {
        for (let index = 0; index < this.choices.length; index++) {
            if (this.choices[index]['value'] === data) {
                return true
            }
        }
        return 'Invalid field value';
    }
}