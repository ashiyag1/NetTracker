const mongoose=require('mongoose');

const DeviceSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a device name'],
        trim:true
    },
    type:{
        type:String,
        required:[true,'Please add a device type'],
        enum:['Router','Switch','IP Phone','AVEquipment','Other']
    },
    client: {
        type: String,
        required: [true, 'Please add the client name'],
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Broken', 'Under Maintenance'],
        default: 'Active' // If we don't specify, it will be Active
    },
    serialNumber: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true,
        default: 'Client Office'
    },
    warrantyExpiry: {
        type: Date
    }
}, {
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
});

module.exports=mongoose.model('Device',DeviceSchema);