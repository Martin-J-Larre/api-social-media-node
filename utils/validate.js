const validator = require("validator");

const validate = (data) => {
  let name =
    !validator.isEmpty(data.name) &&
    validator.isLength(data.name, { min: 3, max: undefined }) &&
    validator.isAlpha(data.name, "en-US");

  let surname =
    !validator.isEmpty(data.surname) &&
    validator.isLength(data.surname, { min: 3, max: undefined }) &&
    validator.isAlpha(data.surname, "en-US");

  let nickname =
    !validator.isEmpty(data.nickname) &&
    validator.isLength(data.nickname, { min: 3, max: undefined });

  let email = !validator.isEmpty(data.email) && validator.isEmail(data.email);

  let password =
    !validator.isEmpty(data.password) &&
    validator.isLength(data.password, { min: 4, max: undefined });

  if (data.bio) {
    let bio = validator.isLength(data.bio, { min: undefined, max: 255 });
    if (!bio) {
      throw new Error("Error 255 characters maximum");
    }
  }

  if (!name || !surname || !nickname || !email || !password) {
    throw new Error("Validation Error");
  }
};

module.exports = {
  validate,
};
