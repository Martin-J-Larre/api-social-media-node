const validator = require("validator");

const validate = (data) => {
  let name =
    !validator.isEmpty(data.name) &&
    validator.isLength(data.name, { min: 3, max: undefined }) &&
    validator.isAlpha(data.name, "en-US");
  if (!name) {
    throw new Error("Error in the field name");
  }
  let surname =
    !validator.isEmpty(data.surname) &&
    validator.isLength(data.surname, { min: 3, max: undefined }) &&
    validator.isAlpha(data.surname, "en-US");
  if (!surname) {
    throw new Error("Error in the field surname");
  }
  let nickname =
    !validator.isEmpty(data.nickname) &&
    validator.isLength(data.nickname, { min: 3, max: undefined });
  if (!nickname) {
    throw new Error("Error in the field nickname");
  }
  let email = !validator.isEmpty(data.email) && validator.isEmail(data.email);
  if (!email) {
    throw new Error("Error in the field email");
  }
  let password =
    !validator.isEmpty(data.password) &&
    validator.isLength(data.password, { min: 4, max: undefined });
  if (!password) {
    throw new Error("Error in the field password min 4 characters");
  }
  let bio = validator.isLength(data.bio, { min: undefined, max: 255 });
  if (!bio) {
    throw new Error("Error 255 characters maximum");
  }
};

module.exports = {
  validate,
};
