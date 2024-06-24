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

router.get('/volcanoes/eruption-period', async (req, res, next) => {
    try {
        const { start_year, start_year_era, end_year, end_year_era } = req.query;

        if (!start_year || !start_year_era || !end_year || !end_year_era) {
            return res.status(400).json({ error: 'Missing required query parameters.' });
        }

        // Convert BCE years to negative numbers and CE years to positive numbers
        const convertYear = (year, era) => {
            return era === 'BCE' ? -Math.abs(parseInt(year)) : parseInt(year);
        };

        const startYear = convertYear(start_year, start_year_era);
        const endYear = convertYear(end_year, end_year_era);

        const volcanoes = await req.db('data')
            .whereNot('last_eruption', 'Unknown')
            .andWhere(req.db.raw('CAST(SUBSTRING_INDEX(last_eruption, " ", 1) AS SIGNED) * (CASE WHEN SUBSTRING_INDEX(last_eruption, " ", -1) = "BCE" THEN -1 ELSE 1 END)'), '>=', startYear)
            .andWhere(req.db.raw('CAST(SUBSTRING_INDEX(last_eruption, " ", 1) AS SIGNED) * (CASE WHEN SUBSTRING_INDEX(last_eruption, " ", -1) = "BCE" THEN -1 ELSE 1 END)'), '<=', endYear);

        if (volcanoes.length === 0) {
            return res.status(404).json({ error: 'No volcanoes found for the specified period.' });
        }

        // Check if the user is authenticated
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let isAuthenticated = false;
        if (token) {
            try {
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                isAuthenticated = true;
            } catch (err) {
                isAuthenticated = false;
            }
        }

        // Filter the response based on authentication
        const response = volcanoes.map(volcano => {
            const basicInfo = {
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
            if (isAuthenticated) {
                return {
                    ...basicInfo,
                    population_5km: volcano.population_5km,
                    population_10km: volcano.population_10km,
                    population_30km: volcano.population_30km,
                    population_100km: volcano.population_100km
                };
            }
            return basicInfo;
        });

        res.json(response);
    } catch (error) {
        console.error('Error fetching volcanoes:', error);
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
});

router.get('/volcanoes/activity-logs', authenticateToken, async (req, res, next) => {
    const { volcano_name } = req.query;

    try {
        const volcano = await req.db('data').where({ name: volcano_name }).first();
        if (!volcano) {
            return res.status(404).json({ error: 'Volcano not found' });
        }

        const volcano_id = volcano.id;

        const activity_logs = await req.db('activity_logs')
            .where({ volcano_id })
            .select('activity_date', 'description', 'intensity', 'user_email', 'created_at', 'updated_at');

        if (!activity_logs || activity_logs.length === 0) {
            return res.status(404).json({ error: 'No activity logs found for the specified volcano.' });
        }

        res.json(activity_logs);
    } catch (err) {
        console.error('Error fetching activity logs:', err);
        next(err);
    }
});

router.post('/volcanoes/activity-log', authenticateToken, async (req, res) => {
    try {
        const { volcano_name, activity_date, description, intensity } = req.body;
        const user_email = req.user.email;

        if (!volcano_name || !activity_date || !description || !intensity) {
            return res.status(400).json({ error: 'Invalid input: volcano_name, activity_date, description, and intensity are required.' });
        }

        // Find the volcano ID based on the volcano name
        const volcano = await req.db('data').where({ name: volcano_name }).first();

        if (!volcano) {
            return res.status(404).json({ error: 'Volcano not found' });
        }

        const volcano_id = volcano.id;

        // Check if an activity log already exists for this user and volcano
        const existingLog = await req.db('activity_logs').where({
            volcano_id,
            user_email
        }).first();

        if (existingLog) {
            // Update the existing activity log
            await req.db('activity_logs')
                .where({ id: existingLog.id })
                .update({
                    activity_date,
                    description,
                    intensity,
                    updated_at: req.db.fn.now()
                });

            res.status(200).json({ message: 'Activity log updated successfully.' });
        } else {
            // Insert a new activity log into the database
            await req.db('activity_logs').insert({
                volcano_id,
                activity_date,
                description,
                intensity,
                user_email,
                created_at: req.db.fn.now(),
                updated_at: req.db.fn.now()
            });

            res.status(201).json({ message: 'Activity log created successfully.' });
        }
    } catch (err) {
        console.error('Error logging activity:', err);
        res.status(500).json({ error: 'Internal server error: Unable to log activity.' });
    }
});

module.exports = router;
