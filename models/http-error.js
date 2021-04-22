class HttpError extends Error {
  //extends keyword is used to inherit properties of another class. In this case HttpError class inherits properties of the Error class.
  constructor(message, errorCode) {
    super(message); //Super calls the constructor of the parent class in this case, the Error class and adds the message property.
    this.code = errorCode; //Adds a code property.
  }
}

module.exports = HttpError;
