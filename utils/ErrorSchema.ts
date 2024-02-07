export interface IErrorSchema {
    statusCode: number;
    message: string;
  }
  export default class ErrorSchema implements IErrorSchema {
    statusCode: number;
    message: string;
    constructor(statusCode: number, message: string) {
      this.message = message;
      this.statusCode = statusCode;
    }
  }