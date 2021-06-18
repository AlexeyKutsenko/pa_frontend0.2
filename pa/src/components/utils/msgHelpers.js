const successMsgConfig = {
    title: 'Success',
    variant: 'success',
    solid: false
}

export function successCreateMsg(entityName) {
    this.$bvToast.toast(`${entityName} has been created`, successMsgConfig);
}

export function successUpdateMsg(entityName) {
    this.$bvToast.toast(`${entityName} has been updated`, successMsgConfig);
}

export function errorMsg(errorResponse, form) {
    let errorMsgConfig = {
        title: 'Error',
        variant: 'danger',
        solid: true
    };

    if (errorResponse["message"] && errorResponse.response.status !== 400) {
        this.$bvToast.toast(`${errorResponse["message"]}`, errorMsgConfig)
    } else {
        for (const errorField in errorResponse.response.data) {
            if (errorResponse.response.data.hasOwnProperty(errorField) && form.fields[errorField]) {

                let fieldName = form.fields[errorField].label;
                let errorMsg = errorResponse.response.data[errorField];

                this.$bvToast.toast(`${fieldName}: ${errorMsg}`, errorMsgConfig)
            } else {
                let fieldName = 'detail';
                let errorMsg = errorResponse.response.data[fieldName]
                this.$bvToast.toast(`${fieldName}: ${errorMsg}`, errorMsgConfig)
            }
        }
    }
}

