const asyncErrorHandler = require("../utils/asyncErrorHandler");
const Order = require("../models/orderModel");
const Package = require("../models/packageModel");
const CustomError = require("../utils/customError");
const Service = require("../models/serviceModel");
const validateOrder = require("../validations/orderValidation");

const calculateOrderPrice = async (selectedPackage, itemsOrdered) => {
  let itemsTotPrice = 0;
  //fetchinf package details with populate
  const packageData = await Package.findById(selectedPackage).populate(
    "serviceIncluded.service"
  );
  if (!packageData) throw new CustomError("Package not found", 404);

  //loop through the serviceincluded to ensure the service exists
  for (const serviceEntry of packageData.serviceIncluded) {
    const service = await Service.findById(serviceEntry.service);
    if (!service)
      throw new CustomError(`service ${serviceEntry.service} not found`, 404);

    for (const item of service.itemsInfo.items) {
      if (itemsOrdered[item]) {
        //checking if the item was ordered
        const orderedQty = itemsOrdered[item];
        const baseQty = service.itemsInfo.unitInfo.quantity;
        const perUnitPrice = service.itemsInfo.price;
        //calculating total price for the items
        const itemTotal = (orderedQty / baseQty) * perUnitPrice;
        itemsTotPrice += itemTotal;
      }
    }
  }
  //adding addtional charges
  const taxRate = 0.1;
  const taxPrice = itemsTotPrice * taxRate;
  const pickupandDeliveryCharge = 2000;

  //final total price
  const totalPrice = itemsTotPrice + taxPrice + pickupandDeliveryCharge;
  return { itemsTotPrice, taxPrice, pickupandDeliveryCharge, totalPrice };
};

//Create New Order - api/v1/order/new
exports.createOrder = asyncErrorHandler(async (req, res, next) => {
  //validating incoming req using joi lib
  const { error } = validateOrder(req.body);
  if (error) return next(error);

  const { selectedPackage, items } = req.body;
  //calculating order prices
  const { itemsTotPrice, taxPrice, pickupandDeliveryCharge, totalPrice } =
    await calculateOrderPrice(selectedPackage, items);

  const orderData = {
    ...req.body,
    itemsTotPrice,
    taxPrice,
    pickupandDeliveryCharge,
    totalPrice,
  };

  const newOrder = await Order.create(orderData);

  res.status(201).json({
    success: true,
    order: newOrder,
  });
});

//Create New Order - api/v1/order/new
// exports.newOrder = asyncErrorHandler(async (req, res, next) => {
//   const {
//     shippingInfo,
//     selectedPackage,
//     items,
//     quantity,
//     itemsPrice,
//     taxPrice,
//     pickupandDeliveryCharge,
//     totalPrice,
//     pickupDate,
//     deliverDate,
//   } = req.body;

//   const order = await Order.create({
//     shippingInfo,
//     customer: req.user.id,
//     selectedPackage,
//     items,
//     quantity,
//     itemsPrice,
//     taxPrice,
//     pickupandDeliveryCharge,
//     totalPrice,
//     paidAt: Date.now(),
//     pickupDate,
//     deliverDate,
//     orderStatus: "Processing",
//     createdAt: Date.now(),
//   });
//   res.status(200).json({
//     success: true,
//     order,
//   });
// });
// {   "shippingInfo": {
//         "address": "raja veediya",
//         "district": "kandy",
//         "postalCode":"20180",
//         "contactNo": "0711234567"
//     },
//     "selectedPackage": "666b0408c2a46a6d2e02f8d0",
//     "items":["saree": 1, "trouser": 5],
//     "quantity": 5,
//     "itemsPrice": 5000,
//     "taxPrice": 500,
//     "pickupandDeliveryCharge" : 1000,
//     "totalPrice": 5500,
//     "pickupDate": 20.03.2025,
//     "deliverDate": 30.03.2025
// }
