const Joi = require("joi"); //import Joi from "joi";

const validateOrder = (data) => {
  const schema = Joi.object({
    shippingInfo: Joi.object({
      address: Joi.string().required(),
      district: Joi.string().hex().length(24).required(),
      area: Joi.string().hex().length(24).required(),
      postalCode: Joi.string().length(5).required(),
      contactNo: Joi.string()
        .pattern(/^07[0-9]{8}$/)
        .required(),
    }).required(),

    customer: Joi.string().hex().length(24).required(),
    selectedPackage: Joi.string().hex().length(24).required(),
    itemsOrdered: Joi.array()
      .items(
        Joi.object({
          item: Joi.string().required(),
          count: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
    totWeight: Joi.number().min(0).required(),

    itemsTotPrice: Joi.number().min(0).required(),
    taxPrice: Joi.number().min(0).required(),
    pickupandDeliveryCharge: Joi.number().min(0).required(),
    totalPrice: Joi.number().min(0).required(),

    paidAt: Joi.date().optional(),
    pickupDate: Joi.date().iso().required(),
    deliverDate: Joi.date().iso().min(Joi.ref("pickupDate")).required(),
    orderStatus: Joi.string()
      .valid("Processing", "Shipped", "Delivered", "Cancelled")
      .default("Processing"),
    createdAt: Joi.date().default(Date.now),
  });
  return schema.validate(date, { abortEarly: false }); //returns all validation errors
};

module.exports = validateOrder;
