const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/habit-tracker', { useNewUrlParser: true, useUnifiedTopology: true });

const habitSchema = new mongoose.Schema({
    name: String,
    description: String,
    completed: { type: Boolean, default: false }
});

const Habit = mongoose.model('Habit', habitSchema);

app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/habits', async (req, res) => {
    const habits = await Habit.find();
    res.json(habits);
});

app.post('/habits', async (req, res) => {
    const habit = new Habit(req.body);
    await habit.save();
    res.status(201).json(habit);
});

app.put('/habits/:id', async (req, res) => {
    const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(habit);
});

app.delete('/habits/:id', async (req, res) => {
    await Habit.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
