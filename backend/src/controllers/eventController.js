
const eventModel = require('../models/eventModel');

const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar eventos', error });
  }
};

const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await eventModel.getEventById(id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar evento', error });
  }
};

const createEvent = async (req, res) => {
  const { organizerId, name, description, location, eventDate } = req.body;
  try {
    const result = await eventModel.createEvent({ organizerId, name, description, location, eventDate });
    res.status(201).json({ message: 'Evento criado com sucesso', eventId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar evento', error });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, description, location, eventDate } = req.body;
  try {
    const result = await eventModel.updateEvent(id, { name, description, location, eventDate });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.status(200).json({ message: 'Evento atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar evento', error });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await eventModel.deleteEvent(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.status(200).json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar evento', error });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
