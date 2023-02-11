import joi from "joi";

export const customerSchema = joi.object({
  name: joi.string().required(),
  cpf: joi.number().positive().required(),
  birthday: joi.date().required(),
  phone: joi.number().positive().required(),
});