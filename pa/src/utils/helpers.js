export function prepare_request_data(form) {
  let creationData = {};
  let paramsQuery = {};

  for (let field of Object.keys(form.fields)) {
    if (form.fields.hasOwnProperty(field)) {
      if (form.fields[field]['query_param']) {
        paramsQuery[field] = form.fields[field].data;
      } else {
        creationData[field] = form.fields[field].data;
      }
    }
  }
  return {creationData, paramsQuery};
}