exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.string('email').primary();
        table.string('password').notNullable();
        table.string('firstName').nullable();
        table.string('lastName').nullable();
        table.date('dob').nullable();
        table.string('address').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};