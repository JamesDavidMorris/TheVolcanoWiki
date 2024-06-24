const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.get('/countries', async (req, res, next) => {
    try {
        const countries = await req.db('data').distinct('country');
        res.json(countries);
    } catch (err) {
        next(err);
    }
});

router.get('/volcanoes', async (req, res, next) => {
    try {
        const { country, populatedWithin } = req.query;
        if (!country) {
            return res.status(400).json({
                error: true,
                message: "Country is a required query parameter."
            });
        }

        let query = req.db('data').where('country', country);

        if (populatedWithin) {
            const populationColumn = `population_${populatedWithin}`;
            query = query.where(populationColumn, '>', 0);
        }

        const volcanoes = await query.select('id', 'name', 'country', 'region', 'subregion');
        res.json(volcanoes);
    } catch (err) {
        next(err);
    }
});

router.get('/volcanoes/:id', async (req, res, next) => {
    try {
        const volcano = await req.db('data').where({ id: req.params.id }).first();
        if (!volcano) {
            return res.status(404).json({ error: 'Volcano not found' });
        }

        // Check if user is authenticated
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let isAuthenticated = false;
        if (token) {
            try {
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                isAuthenticated = true;
            } catch (err) {
                console.log('JWT verification failed:', err);
                isAuthenticated = false;
            }
        }

        const response = {
            id: volcano.id,
            name: volcano.name,
            country: volcano.country,
            region: volcano.region,
            subregion: volcano.subregion,
            last_eruption: volcano.last_eruption,
            summit: volcano.summit,
            elevation: volcano.elevation,
            latitude: volcano.latitude,
            longitude: volcano.longitude
        };

        // Include population data only if authenticated
        if (isAuthenticated) {
            response.population_5km = volcano.population_5km;
            response.population_10km = volcano.population_10km;
            response.population_30km = volcano.population_30km;
            response.population_100km = volcano.population_100km;
        }

        res.json(response);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
