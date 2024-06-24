exports.up = function(knex) {
    return knex.schema.createTable('activity_logs', table => {
        table.increments('id').primary();  // Primary key
        table.integer('volcano_id').notNullable();  // Volcano ID
        table.string('user_email').notNullable();  // User email
        table.date('activity_date').notNullable();  // Activity date
        table.string('description', 1000).notNullable();  // Description of the activity
        table.enu('intensity', ['Low', 'Moderate', 'High']).notNullable();  // Intensity of the activity
        table.timestamps(true, true);  // Timestamps
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('activity_logs');
};