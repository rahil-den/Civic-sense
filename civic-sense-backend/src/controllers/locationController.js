import State from '../models/State.js';
import City from '../models/City.js';
import Area from '../models/Area.js';

// Get all states
export const getStates = async (req, res) => {
    try {
        const states = await State.find({ isActive: true });
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get cities by state
export const getCities = async (req, res) => {
    try {
        const cities = await City.find({ stateId: req.params.stateId, isActive: true });
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get areas by city
export const getAreas = async (req, res) => {
    try {
        const areas = await Area.find({ cityId: req.params.cityId });
        res.json(areas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Add State
export const addState = async (req, res) => {
    try {
        const { name } = req.body;
        const state = await State.create({ name });
        res.status(201).json(state);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Add City
export const addCity = async (req, res) => {
    try {
        const { stateId, name } = req.body;
        const city = await City.create({ stateId, name });
        res.status(201).json(city);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Add Area
export const addArea = async (req, res) => {
    try {
        const { cityId, name } = req.body;
        const area = await Area.create({ cityId, name });
        res.status(201).json(area);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
