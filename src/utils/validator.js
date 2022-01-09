const PasswordValidator = require('password-validator');
const {credValidations} = require('../config');

class ValidationHelper {
  constructor() {
    this.schema = new PasswordValidator();
    this.pass = credValidations.password 
    this.passwordSchema = this.schema
                    .is().min(this.pass.minLength)                 // Minimum length
                    .is().max(this.pass.maxLength)                 // Maximum length
                    .has().uppercase(this.pass.minUpperCase)       // Must have uppercase letters
                    .has().lowercase(this.pass.minLowerCase)       // Must have lowercase letters
                    .has().digits(this.pass.minDigits)             // Must have at least min digits
                    .has().not().spaces()                          // Should not have spaces
                    .is().not().oneOf(this.pass.blacklistedPass);  // Blacklist these values
    this.errList = [];
  }

  vadidatePassword (password) {
    this.errList = this.schema.validate(password, { details: true }).map(({ message }) => message);
    return this.errList;
  }
  
}

module.exports = ValidationHelper;