
const pool = require('../database/db');

const getAllEvents = async () => {
  const [rows] = await pool.query('SELECT * FROM events');
  return rows;
};

const getEventById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
  return rows[0];
};

const createEvent = async (eventData) => {
  const { organizerId, name, description, location, eventDate } = eventData;
  const [result] = await pool.query(
    'INSERT INTO events (organizer_id, name, description, location, event_date) VALUES (?, ?, ?, ?, ?)',
    [organizerId, name, description, location, eventDate]
  );
  return result;
};

const updateEvent = async (id, eventData) => {
  const { name, description, location, eventDate } = eventData;
  const [result] = await pool.query(
    'UPDATE events SET name = ?, description = ?, location = ?, event_date = ? WHERE id = ?',
    [name, description, location, eventDate, id]
  );
  return result;
};

const deleteEvent = async (id) => {
  const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
  return result;
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
