const customError = require("../utils/customError");
const {
  Admin,
  Customer,
  LaundryOwner,
  Staff,
} = require("../models/userModels");
const Laundry = require("../models/laundryModel");
const Service = require("../models/serviceModel");
const Package = require("../models/packageModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const errorHandler = require("../middlewares/errorHandler");

//********Service *********/
//Admin: add service - /api/v1/service/add
exports.addService = asyncErrorHandler(async (req, res, next) => {
  const { name, itemsInfo, description } = req.body;
  const service = await Service.create({
    name,
    itemsInfo,

    description,
  });

  res.status(201).json({
    success: true,
    service,
  });
});

//Admin: Get single service - /api/v1/service/get/:id
exports.getService = asyncErrorHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return next(
      new customError(`Service not found with this id: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success: true,
    service,
  });
});

//Admin, laundryOwner: get services - /api/v1/service/get
exports.getServices = asyncErrorHandler(async (req, res, next) => {
  const getServices = await Service.find();
  res.status(201).json({
    success: true,
    getServices,
  });
});

//Admin: update service - api/v1/service/update/:id
exports.updateService = asyncErrorHandler(async (req, res, next) => {
  console.log("Req bod: ", req.body);
  let service = await Service.findById(req.params.id);
  if (!service) {
    return next(
      new customError(`Service not found with this id: ${req.params.id}`, 404)
    );
  }
  const { name, itemsInfo, description } = req.body;

  console.log("re body:  ", name, itemsInfo, description);

  if (
    !name ||
    !itemsInfo ||
    !description
    // itemsInfo.unitInfo.quantity == null ||
    // isNaN(itemsInfo.unitInfo.quantity) ||
    // itemsInfo.price == null ||
    // isNaN(itemsInfo.price)
  ) {
    return next(
      new customError("Please provide the data in correct format", 400)
    );
  }

  const newServiceData = {
    name,
    itemsInfo,

    description,
  };

  console.log("new servicedata :", name, itemsInfo, description);

  service = await Service.findByIdAndUpdate(req.params.id, newServiceData, {
    new: true,
    runValidators: true,
  });
  console.log("service: ", service);
  res.status(201).json({
    success: true,
    service,
  });
});

//Admin: Delete service - api/v1/service/delete/:id
exports.deleteService = asyncErrorHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new customError("Service not found", 404));
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    message: "Service deleted!",
  });
});

//********Package**********/

//Admin, LaundryOwner: Create Package - api/v1/package
exports.createPackage = asyncErrorHandler(async (req, res, nex) => {
  const { name, serviceIncluded } = req.body;
  //console.log(name, serviceIncluded);

  //getting serviceIds from serviceincluded array
  const serviceIds = serviceIncluded.map((service) => service.service);
  // console.log("serviceids: ", serviceIds);

  //finding matching serviceids from service db
  const services = await Service.find({ _id: { $in: serviceIds } });
  //console.log("services: ", services);

  if (services.length !== serviceIncluded.length) {
    const mismatchedServices = serviceIds.filter(
      (id) => !services.some((service) => service._id.equals(id))
    );
    return new customError(
      `one or more services are invalide, services:${mismatchedServices} `
    );
    console.log("mismatchedservices: ", mismatchedServices);
  }
  const newPackage = await Package.create({ name, serviceIncluded });
  console.log("newPackage: ", newPackage);
  res.status(201).json({
    success: true,
    newPackage,
  });
});

// Get a single Package - api/v1/package/get/:id
exports.getPackage = asyncErrorHandler(async (req, res, next) => {
  const package = await Package.findById(req.params.id);
  if (!package) {
    return next(
      new customError(
        `Package not found with this package id: ${req.params.id} `,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    package,
  });
});

//Get all Packages - api/v1/package/get/
exports.getPackages = asyncErrorHandler(async (req, res, next) => {
  const packages = await Package.find();
  if (!packages) {
    return next(new customError("no packages found!", 404));
  }
  res.status(200).json({
    success: true,
    packages,
  });
});

//Admin: update package- api/v1/package/update/:id

exports.updatePackage = asyncErrorHandler(async (req, res, next) => {
  let package = await Package.findById(req.params.id);
  if (!package) {
    return next(
      new customError(`Service not found with this ${req.params.id}`, 404)
    );
  }
  const { name, serviceIncluded } = req.body;
  if (!name || !serviceIncluded) {
    return next(
      new customError(`Please provide the data in correct format`, 400)
    );
  }
  const newPackageData = { name, serviceIncluded };

  package = await Package.findByIdAndUpdate(req.params.id, newPackageData, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    success: true,
    package,
  });
});

//Admin: Delete package - api/v1/package/delete/:id
exports.deletePackage = asyncErrorHandler(async (req, res, next) => {
  const package = await Package.findById(req.params.id);
  if (!package) {
    return next(
      new customError(`Package not found with this id: ${req.params.id}`, 404)
    );
  }

  await package.deleteOne();

  res.status(200).json({
    success: true,
    message: "package deleted!",
  });
});
