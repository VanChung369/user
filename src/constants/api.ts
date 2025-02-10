const HEADERS: CONSTANT.API = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Origin': '*',
};

const HEADERS_MULTIPLE_PART: CONSTANT.API = {
  ...HEADERS,
  'Content-Type': 'multipart/form-data; boundary=something',
  Accept: 'application/json',
};

export { HEADERS, HEADERS_MULTIPLE_PART };
