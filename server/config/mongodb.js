import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri) throw new Error('MONGO_URL not defined in .env');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB Connected!');
  } catch (error) {
    console.error('DB Connection Failed:', error);
    process.exit(1);
  }
}
