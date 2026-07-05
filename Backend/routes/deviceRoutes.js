const express =require('express');
const router=express.Router();
const Device=require('../models/Device')

router.get('/',async(req,res)=>{
    try{
        const devices= await Device.find();
        res.json(devices);

    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.post('/',async(req,res)=>{
    const device= new Device({
        name: req.body.name,
        type: req.body.type,
        client: req.body.client,
        serialNumber: req.body.serialNumber,
        location: req.body.location,
        warrantyExpiry: req.body.warrantyExpiry

    });
    try{
        const newDevice =await device.save(); //save to database krdo
        res.status(201).json(newDevice); //201 means created succesfully
    } catch(error){
        res.status(400).json({message:error.message}); 
        //400 yaani bad request
    }
});

//update a device (PUT)
//URL:http://localhost:5000/api/devices/:id

router.put('/:id',async(req,res)=>{
    try{

        const updatedDevice= await Device.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );

        if(!updatedDevice){
            return res.status(404).json({message:'Device not found'});
        }
        
        res.json(updatedDevice); //send the updated device back
        } catch(error){
            res.status(400).json({message:error.message});
        }
});

// 6. DELETE a device (DELETE)
// URL: http://localhost:5000/api/devices/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedDevice = await Device.findByIdAndDelete(req.params.id);
        if (!deletedDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json({ message: 'Device deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports=router;