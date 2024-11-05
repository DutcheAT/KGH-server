const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({

    user_id: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},

    admin_id: {type: mongoose.Schema.Types.ObjectId,ref: 'Admin'},

    message: {type: String,required: true},

    seen: { type: Boolean, default: false },

    timestamp: {type: Date,required: true, default: Date.now},
  
    type: {
      type: String,
      enum: ["none", "Message", "Contract"],
      default: "none",
    },

    // job_id: {type: mongoose.Schema.Types.ObjectId,ref: 'Agenda',default: null,},

    owner_id: {type: mongoose.Schema.Types.ObjectId,ref: 'User',default: null,},

    contract_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract',default: null, },
    
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;