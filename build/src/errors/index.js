"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateSheduleError = exports.TooManyRequestsError = exports.TimeError = exports.BadRequestError = exports.ConflictError = exports.LocationError = exports.ServerError = exports.UnAuthorizedError = exports.NotFoundError = exports.ValidationError = exports.SystemError = void 0;
class SystemError extends Error {
    get code() {
        return this._code;
    }
    constructor(code, message) {
        super(message); // 'Error' breaks prototype chain here
        this.name = "SystemError";
        this._code = code;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.SystemError = SystemError;
class ValidationError extends SystemError {
    constructor(values, message) {
        super("validation-error", message); // 'Error' breaks prototype chain here
        this.name = "ValidationError";
        this._required_variables = values;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends SystemError {
    constructor(message) {
        super("notFound-error", message); // 'Error' breaks prototype chain here
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.NotFoundError = NotFoundError;
class UnAuthorizedError extends SystemError {
    constructor(message) {
        super("unauthorized-error", message); // 'Error' breaks prototype chain here
        this.name = "UnAuthorizedError";
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.UnAuthorizedError = UnAuthorizedError;
class ServerError extends SystemError {
    constructor(message) {
        super("server-error", message); // 'Error' breaks prototype chain here
        this.name = "ServerError";
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.ServerError = ServerError;
class LocationError extends SystemError {
    constructor(message) {
        super("location-error", message); // 'Error' breaks prototype chain here
        this.name = "LocationError";
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.LocationError = LocationError;
class ConflictError extends SystemError {
    constructor(message) {
        super("conflict-error", message); // 'Error' breaks prototype chain here
        this.name = "ConflictError";
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.ConflictError = ConflictError;
class BadRequestError extends SystemError {
    constructor(message) {
        super("bad-request-error", message); // 'Error' breaks prototype chain here
        this.name = "BadRequestError";
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.BadRequestError = BadRequestError;
class TimeError extends SystemError {
    constructor(message) {
        super("time-error", message); // 'Error' breaks prototype chain here
        this.name = "TimeError";
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.TimeError = TimeError;
class TooManyRequestsError extends SystemError {
    constructor(message) {
        super("too-many-requests-error", message); // 'Error' breaks prototype chain here
        this.name = "TooManyRequestsError";
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class DateSheduleError extends SystemError {
    constructor(message) {
        super("dublicate_found_on_shedule", message); // 'Error' breaks prototype chain here
        this.name = "DateSheduleError";
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.DateSheduleError = DateSheduleError;
//# sourceMappingURL=index.js.map