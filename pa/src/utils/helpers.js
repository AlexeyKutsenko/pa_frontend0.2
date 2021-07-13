export function parse_options(creationData) {
    let fieldsInfo = {};

    if (creationData['query_params']) {
        let query_params = creationData['query_params'];
        delete creationData['query_params'];
        for (const query_param in query_params) {
            if (query_params.hasOwnProperty(query_param) && !query_params[query_param]['read_only']) {
                fieldsInfo[query_param] = query_params[query_param];
                fieldsInfo[query_param]['query_param'] = true;
            }
        }
    }

    for (let field of Object.keys(creationData)) {
        if (creationData.hasOwnProperty(field) && !creationData[field]['read_only']) {
            fieldsInfo[field] = creationData[field];
        }
    }

    return fieldsInfo;
}
