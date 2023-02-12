import joi from "joi";

export const customerSchema = joi.object({
  name: joi.string().required(),
  cpf: joi
    .string()
    .custom((value, helper) => {
      if (isNaN(value)) {
        return helper.message("CPF must contain only numbers");
      }
      if (value.length !== 11) {
        return helper.message("CPF must be 11 characters long");
      } else {
        return true;
      }
    })
    .required(),
  birthday: joi.date().required(),
  phone: joi
    .string()
    .custom((value, helper) => {
      if (isNaN(value)) {
        return helper.message("Phone must contain only numbers");
      }
      if (value.length !== 10 && value.length !== 11) {
        return helper.message("Phone must be 10 or 11 characters long");
      } else {
        return true;
      }
    })
    .required(),
});
