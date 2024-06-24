var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

// Register route
router.post('/register', async function(req, res, next) {
  const { email, password, firstName, lastName, dob, address } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: 'Request body incomplete, both email and password are required'
    });
  }

  try {
    // Check if the user already exists
    const existingUser = await req.db('users').where({ email }).first();

    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: 'User already exists'
      });
    }

    // Insert the new user into the database
    await req.db('users').insert({ email, password, firstName, lastName, dob, address });

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    next(error);
  }
});

// Login route
router.post('/login', async function(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: 'Request body incomplete, both email and password are required'
    });
  }

  try {
    // Check if the user exists
    const user = await req.db('users').where({ email }).first();

    if (!user || user.password !== password) {
      return res.status(401).json({
        error: true,
        message: 'Incorrect email or password'
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      token,
      token_type: 'Bearer',
      expires_in: 86400
    });
  } catch (error) {
    next(error);
  }
});

// Get profile route
router.get('/:email/profile', async function(req, res, next) {
  const { email } = req.params;
  let token = req.headers.authorization?.split(' ')[1];

  // Check if token is provided as a query parameter
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      error: true,
      message: 'Authorization header (\'Bearer token\') not found'
    });
  }

  try {
    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: true,
          message: 'Invalid JWT token'
        });
      }

      const user = await req.db('users').where({ email }).first();

      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'User not found'
        });
      }

      // If authenticated, return the user's profile with additional info
      res.status(200).json({
        email: user.email,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        dob: user.dob || null,
        address: user.address || null
      });
    });
  } catch (error) {
    next(error);
  }
});

// Update profile route
router.put('/:email/profile', async function(req, res, next) {
  const { email } = req.params;
  const { firstName, lastName, dob, address } = req.body;
  let token = req.headers.authorization?.split(' ')[1];

  // Check if token is provided as a query parameter
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      error: true,
      message: 'Authorization header (\'Bearer token\') not found'
    });
  }

  if (!firstName || !lastName || !dob || !address) {
    return res.status(400).json({
      error: true,
      message: 'Request body incomplete: firstName, lastName, dob and address are required.'
    });
  }

  try {
    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: true,
          message: 'Invalid JWT token'
        });
      }

      if (decoded.email !== email) {
        return res.status(403).json({
          error: true,
          message: 'Forbidden'
        });
      }

      await req.db('users').where({ email }).update({ firstName, lastName, dob, address });

      res.status(200).json({
        email,
        firstName,
        lastName,
        dob,
        address
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
