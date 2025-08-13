import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
  wa_id: { type: String, required: true, index: true },     
  from: { type: String, required: true },                  
  to: { type: String, required: false },                   
  msg_id: { type: String, required: true, unique: true },  
  type: { type: String, required: true },                  
  content: { type: Object, required: true },               
  timestamp: { type: Date, required: true, index: true },   
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'read', 'pending'], 
    default: 'pending', 
    index: true 
  },                                                        
  isFromUser: { type: Boolean, required: true },            
  contactName: { type: String, default: '' },               
}, { timestamps: true, collection: 'processed_messages' });

messageSchema.index({ wa_id: 1, timestamp: -1 });

export default mongoose.model('Message', messageSchema);
