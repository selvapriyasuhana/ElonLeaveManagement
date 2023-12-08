const router = require('express').Router();
const Staffdetails = require("../Models/Staffmodel.js");
const Asset = require('../Models/model.js');
const AssetRequired = require('../Models/assetmodel.js');

router.post("/assetrequired", async (req, res) => {
    try {
        // Check if the assigned staff member exists in the staffdetails collection
        const assignedStaff = await Staffdetails.findOne({ Name: req.body.OrderedBy });

        if (!assignedStaff) {
            return res.status(404).json({
                message: 'Given Staff name not found.',
            });
        }
         

    var users = new AssetRequired();
    users.AssetsName = req.body.AssetsName;
    users.Purpose = req.body.Purpose;
    users.Need = req.body.Need;
    users.OrderedBy = req.body.OrderedBy;
    users.RequestedBy = req.body.RequestedBy;
    try {
        await users.save();
        res.status(201).json({
            message: 'New Asset Required Successfully',
            data: users,
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

var assetcontroller = require("../Controller/assetcontroller.js");
router.route("/getall").get(assetcontroller.index);

router
  .route("/:user_id")
  .get(assetcontroller.view)
  .patch(assetcontroller.update)
  .put(assetcontroller.update)
  .delete(assetcontroller.Delete);

module.exports = router;
