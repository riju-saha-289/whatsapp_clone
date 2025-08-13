import dotenv from 'dotenv';
dotenv.config();

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Message from '../models/Message.js';
import connectDB from '../config/db.js';

const PAYLOADS_DIR = path.resolve('./payloads'); // your folder with JSON files

async function main() {
  try {
    await connectDB();

    const files = fs.readdirSync(PAYLOADS_DIR).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(PAYLOADS_DIR, file);
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      console.log(`\n📂 Reading file: ${file}`);

      const change = payload?.metaData?.entry?.[0]?.changes?.[0];
      const value = change?.value || {};

      const wa_id = value?.contacts?.[0]?.wa_id || 'unknown';
      const contactName = value?.contacts?.[0]?.profile?.name || '';

      // Process messages
      if (value.messages?.length) {
        console.log(`Processing ${value.messages.length} message(s) for wa_id: ${wa_id}`);

        for (const msg of value.messages) {
          try {
            await Message.findOneAndUpdate(
              { msg_id: msg.id }, // match on msg_id
              {
                msg_id: msg.id,
                wa_id,
                from: msg.from,
                to: value.metadata?.display_phone_number || '',
                type: msg.type,
                content: msg.text || {},
                timestamp: new Date(Number(msg.timestamp) * 1000),
                status: 'sent', // initial status
                isFromUser: msg.from === wa_id,
                contactName,
              },
              { upsert: true, new: true, strict: true }
            );
            console.log(`✅ Saved message ${msg.id}`);
          } catch (err) {
            console.error(`❌ Error saving message ${msg.id}: ${err.message}`);
          }
        }
      } else {
        console.log(`Processing 0 message(s) for wa_id: ${wa_id}`);
      }

      // Process status updates
      if (value.statuses?.length) {
        console.log(`Processing ${value.statuses.length} status update(s)`);

        for (const status of value.statuses) {
          try {
            const res = await Message.findOneAndUpdate(
              { msg_id: status.id },
              { status: status.status },
              { new: true }
            );

            if (!res) {
              console.warn(`⚠️ No message found with id: ${status.id} to update status`);
            } else {
              console.log(`✅ Updated status for ${status.id} to ${status.status}`);
            }
          } catch (err) {
            console.error(`❌ Error updating status ${status.id}: ${err.message}`);
          }
        }
      } else {
        console.log(`Processing 0 status update(s)`);
      }
    }

    console.log('\n🎯 All payloads processed successfully');
  } catch (err) {
    console.error('❌ Error processing payloads:', err);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

main();
