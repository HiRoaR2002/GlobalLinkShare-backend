const express = require('express');
const mongoose = require('mongoose');
const SharedData = require('./models/Data');
const cors = require('cors');
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');
require('dotenv').config();

const app = express();
app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));      // for JSON
app.use(express.urlencoded({ limit: '50mb', extended: true }));


mongoose.connect(process.env.MONGO_URL); // replace with your URI

// Save data and return ID
app.post('/api/save', async (req, res) => {
  try {
    const { image_base64, framename, score, issueTitle, issue, prosTitle, pros } = req.body;
    const uploadResponse = await cloudinary.uploader.upload(`data:image/png;base64,${image_base64}`, {
      folder: 'saliency-images',
    });

    // Save data in MongoDB
    const newData = new SharedData({
      image_base64: uploadResponse.secure_url,
      framename: framename,
      score: score,
      issueTitle: issueTitle || [],
      issue: issue || [],
      prosTitle: prosTitle || [],
      pros: pros || [],
    });

    const saved = await newData.save();

    res.json({ id: saved._id });
  } catch (err) {
    console.error('Upload or Save Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get data by ID
app.get('/api/get/:id', async (req, res) => {
  const data = await SharedData.findById(req.params.id);
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

app.listen(5000, () => console.log('Server running on port 5000'));
