const db = require('../database/db');
const bcrypt = require('bcryptjs');

const Organizer = {
    create: (name, email, password, callback) => {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const query = 'INSERT INTO organizers (name, email, password) VALUES (?, ?, ?)';

        db.query(query, [name, email, hashedPassword], (err, result) => {
            if (err) {
                callback(err);
            } else {
                const jwtToken = generateJWT(result.insertId);
                callback(null, jwtToken);
            }
        });
    },

    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM organizers WHERE email = ?', [email]);
        return rows[0];
    },
};

const generateJWT = (organizerId) => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: organizerId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    return token;
};

module.exports = Organizer;