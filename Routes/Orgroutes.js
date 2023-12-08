const Organization = require("../Models/Orgmodel.js");
const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { ORGName, Address, Contact } = req.body;

    const newOrganization = new Organization({ ORGName, Address, Contact });
    const savedOrganization = await newOrganization.save();

    res.status(201).json(savedOrganization);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the organization" });
  }
});
const Orgcontroller = require("../Controller/Orgcontroller");
router.route("/getall").get(Orgcontroller.index);

router
  .route("/name/:ORGName")
  .get(Orgcontroller.view)
  .patch(Orgcontroller.update)
  .put(Orgcontroller.update)
  .delete(Orgcontroller.Delete);
module.exports = router;

module.exports = router;
