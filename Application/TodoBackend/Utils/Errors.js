'use-strict';
var errors = {};
/**
* Used to create errors
* @Param {Number} httpCode - http response code
* @Param {String} message - Error message
* @Param {String} description - Error description
*/
export class ApiError extends Error {
    constructor(status, name, description) {
        super();
        this.status = status;
        this.name = name;
        this.description = description;
        this.details = null;
    }
    withDetails(details) {
        this.details = details;
        return this;
    }
}
// Exporting error Object
export default errors;
export const response = {
    'errorResponse': function (errorObj) {
    this.HTTP=errorObj.status;
    this.MESSAGE = errorObj.name;
    this.DESCRIPTION = errorObj.description;
    this.DETAILS = errorObj.details ? errorObj.details:null;
   },
  };
errors.ApiError = ApiError;
//--------------------- GENERIC ERRORS -------------------------/
errors.invalid_host = new ApiError(401, 'UNKNOWN HOST ORGANIZATION', 'The request could not be completed due to the missing requirements')
errors.duplicate_identity = new ApiError(409, 'DUPLICATE IDENTITY', 'The request could not be completed due to a conflict with the current state of the resource')
errors.required_admin = new ApiError(401, 'ADMIN ENROLLMENT REQUIRED', 'The request could not be completed due to the missing requirements')
errors.file_not_found = new ApiError(500, 'INTERNAL SERVER ERROR', 'If you are the developer, please check your server logs for more information');
errors.execution_failed = new ApiError(500, 'SCRIPT EXECUTION ERROR', 'The request for creating network has failed');
errors.network_not_found = new ApiError(400, 'PROPERTY REQUESTED NOT FOUND', 'The requested blockchain network doesn\'t exists');
errors.maximum_organizations_reached = new ApiError(409, 'MAXIMUM LIMIT REACHED', 'The number of organizations are reached');
errors.request_failed = new ApiError(500, 'FAILED TO FULFIL REQUEST', "There was an error while fulfilling the request. Try again later");
errors.invalid_auth = new ApiError(401, 'INVALID_AUTH','Are you sure you are on the right path?');
errors.invalid_permission = new ApiError(401, 'INVALID_PERMISSION','Permission denied. Current user does not has required permissions for this resource.');
errors.not_reachable = new ApiError(500, 'Network Not Reachable', "Network timeout expired. Please try again later");
errors.contract_error = new ApiError(401, 'Contract Error Occurred. Please see more details');
errors.identity_not_found = new ApiError(401, "Unknown User", "Make sure to login/Signup before submitting requests");
errors.signUpError = new ApiError(500, "Unknown Error", "Looks like there was an error in processing your request");

errors.required_key = new ApiError(400, 'REQUIRED_KEY','Api key is required. Please provide a valid api key along with request.');
errors.required_auth = new ApiError(400, 'REQUIRED_AUTH_TOKEN','Auth Token is required. Please provide a valid auth token along with request.');
errors.internal_error = new ApiError(500, 'INTERNAL_ERROR','Something went wrong on server. Please contact server admin.');
errors.invalid_key = new ApiError(401, 'INVALID_KEY','Valid api key is required. Please provide a valid api key along with request.');
errors.invalid_access = new ApiError(401, 'INVALID_ACCESS','Access denied. Current user does not has access for this resource.');
errors.invalid_input = new ApiError(400, 'INVALID_INPUT','The request input is not as expected by API. Please provide valid input.');
errors.input_too_large = new ApiError(400, 'INPUT_TOO_LARGE','The request input size is larger than allowed.');
errors.invalid_input_format = new ApiError(400, 'INVALID_INPUT_FORMAT','The request input format is not allowed.');
errors.invalid_operation = new ApiError(403, 'INVALID_OPERATION','Requested operation is not allowed due to applied rules. Please refer to error details.');
errors.not_found = new ApiError(404, 'NOT_FOUND','The resource referenced by request does not exists.');
errors.not_registeration = new ApiError(404, 'NOT_REGISTERATION','User not registered with this email/mobile.');
//--------------- SOME OTHERS LOGIC ERRORS -------------------/
errors.invalid_key = new ApiError(403, 'INVALID_VERFICATION_KEY','Key is expired or does not exists.Please provide a valid vaerfication key');
errors.could_not_get_access_token = new ApiError(403, 'INVALID_OPERATION','Error in getting access token from auth0');
errors.bad_request = new ApiError(403, 'INVALID_OPERATION','Bad Request');