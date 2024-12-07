const Organizer = require('../models/organizerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existingOrganizer = await Organizer.findByEmail(email);
      if (existingOrganizer) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const organizerId = await Organizer.create(name, email, hashedPassword);

      const token = jwt.sign({ id: organizerId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
  
      res.status(201).json({ token });
    } catch (error) {
      console.error('Erro ao registrar organizador:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };

exports.login = async (req, res) => {
    try {
      console.log('Login request received:', req.body); 
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }
  
      console.log('Verificando organizador...');
      const organizer = await Organizer.findByEmail(email);
  
      if (!organizer) {
        return res.status(404).json({ message: 'Organizador não encontrado' });
      }
  
      console.log('Validando senha...');
      const isPasswordValid = await bcrypt.compare(password, organizer.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha incorreta' });
      }
  
      console.log('Gerando token JWT...');
      const token = jwt.sign({ id: organizer.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
  
      console.log('Login bem-sucedido, retornando token.');
      res.status(200).json({ token });
    } catch (error) {
      console.error('Erro durante o login:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
