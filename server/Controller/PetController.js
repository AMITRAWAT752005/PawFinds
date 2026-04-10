const Pet = require('../Model/PetModel');
const fs = require('fs');
const path = require('path');

const postPetRequest = async (req, res) => {
  try {
    const { name, age, area, justification, email, phone, type, breed } = req.body;
    const { filename } = req.file;

    const pet = await Pet.create({
      name,
      age,
      area,
      justification,
      email,
      phone,
      type,
      breed,
      filename,
      status: 'Pending'
    });

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, phone, status } = req.body;
    const pet = await Pet.findByIdAndUpdate(id, { email, phone, status }, { new: true });

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    res.status(200).json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const allPets = async (reqStatus, req, res) => {
  try {
    const data = await Pet.find({ status: reqStatus }).sort({ updatedAt: -1 });
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    const filePath = path.join(__dirname, '../images', pet.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper function to convert age string to months
const convertAgeToMonths = (ageString) => {
  // Try to extract number from age string (e.g., "2 years" -> 24, "6 months" -> 6)
  const match = ageString.match(/(\d+)/);
  if (!match) return 12; // Default to 12 months
  
  const number = parseInt(match[1]);
  if (ageString.toLowerCase().includes('year')) {
    return number * 12;
  } else if (ageString.toLowerCase().includes('month')) {
    return number;
  } else if (ageString.toLowerCase().includes('week')) {
    return number * 4;
  }
  return number;
};

// Function to call ML service for adoption prediction
const getAdoptionLikelihood = async (petData) => {
  try {
    const ageMonths = convertAgeToMonths(petData.age);
    
    const mlPayload = {
      type: petData.type,
      breed: petData.breed,
      AgeMonths: ageMonths,
      status: petData.status || 'Pending'
    };

    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mlPayload)
    });

    if (!response.ok) {
      console.warn('ML service error:', response.statusText);
      return null; // Fallback gracefully
    }

    const prediction = await response.json();
    return prediction.adoption_likelihood || null;
  } catch (error) {
    console.warn('Could not call ML service:', error.message);
    return null; // Graceful fallback if ML service is down
  }
};

module.exports = {
  postPetRequest,
  approveRequest,
  deletePost,
  allPets,
  getAdoptionLikelihood
};
