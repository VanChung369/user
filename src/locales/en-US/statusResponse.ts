export default {
  'statusResponse.200': 'The server successfully returns the request data.',
  'statusResponse.201': 'New or modified data is successful.',
  'statusResponse.202': 'A request has entered the background queue (asynchronous task).',
  'statusResponse.204': 'Delete data successfully.',
  'statusResponse.400':
    'There are errors issued by the request, and the server does not perform new or modified data.',
  'statusResponse.401': 'Users have no permissions (tokens, user names, password errors).',
  'statusResponse.403': 'Users are authorized, but access is prohibited.',
  'statusResponse.404':
    'The requests are targeted at non -existent records, and the server does not operate.',
  'statusResponse.406': 'The format of the request is not available.',
  'statusResponse.410':
    'The request resources are permanently deleted and will not be obtained anymore.',
  'statusResponse.422': 'When a object is created, an verification error occurs.',
  'statusResponse.500': 'If the server is error, check the server.',
  'statusResponse.502': 'Merchants error.',
  'statusResponse.503':
    'The service is unavailable, and the server is temporarily overloaded or maintained.',
  'statusResponse.504': 'The gateway timeout.',
};
