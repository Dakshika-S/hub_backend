express = require("express");
const router = express.Router();
const {
  addService,
  getServices,
  getService,
  updateService,
  deleteService,
  createPackage,
  getPackage,
  getPackages,
  updatePackage,
  deletePackage,
} = require("../controllers/packageControllers");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");
//service routes
router
  .route("/service/add")
  .post(isAuthenticatedUser, authorizeRoles("admin"), addService);
router
  .route("/service/get")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin", "laundryOwner"),
    getServices
  );
router
  .route("/service/get/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getService);
router
  .route("/service/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateService);
router
  .route("/service/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteService);

//package routes
router
  .route("/package/add")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin", "laundryOwner"),
    createPackage
  );
router.route("/package/get/:id").get(getPackage);
router.route("/package/get").get(getPackages);
router
  .route("/package/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updatePackage);
router
  .route("/package/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deletePackage);
module.exports = router;
