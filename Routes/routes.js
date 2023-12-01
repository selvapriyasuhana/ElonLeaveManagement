const router = require('express').Router();
const Staffdetails = require("../Models/Staffmodel.js");

const Asset = require('../Models/model.js');

router.post("/addasset", async(req, res) => {
    try {
        // Check if the assigned staff member exists in the staffdetails collection
        const assignedStaff = await Staffdetails.findOne({ username: req.body.AssignedTo });

        if (!assignedStaff) {
            return res.status(404).json({
                message: 'Assigned staff not found. Please provide a valid staff member for AssignedTo.',
            });
        }

    var user = new Asset();
    user.AssetNumber  = req.body.AssetNumber;
    user.AssetId      = req.body.AssetId;
    user.Category     = req.body.Category;
    user.SubCategory  = req.body.SubCategory;
    user.Model        = req.body.Model;
    user.AssignedTo   = req.body.AssignedTo;
    user.AssignedBy   = req.body.AssignedBy;
    user.AssignedDate = req.body.AssignedDate;
    user.Price        = req.body.Price;
    user.Status       = req.body.Status;
    try {
        await user.save();
        res.status(201).json({
            message: 'New Asset Added Successfully',
            data: user,
        });
    } catch (err) {
        res.status(400).json({
            message: 'Error adding new asset',
            error: err.message,
        });
    }
}catch (error) {
    // Handle errors from the outer try block
    res.status(500).json({
        message: 'An error occurred',
        error: error.message,
    });
}
});


var controller = require("../Controller/controller.js");
router.route("/assets/getall").get(controller.index);

router
  .route("/assets/:user_id")
  .get(controller.view)
  .patch(controller.update)
  .put(controller.update)
  .delete(controller.Delete);

module.exports = router;
