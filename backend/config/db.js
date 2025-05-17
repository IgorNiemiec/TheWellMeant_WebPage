const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');   // potwierdzenie po udanym połączeniu :contentReference[oaicite:13]{index=13}
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);                    // jeżeli nie uda się połączyć, zatrzymaj aplikację :contentReference[oaicite:14]{index=14}
  }
};

module.exports = connectDB;
