var pg = require('pg');

console.log(process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
	process.env.DATABASE_URL = 'postgres://txepvnhyhlfnlx:rmQPEXilDYhSdXPR3cQeScjM5A@ec2-50-16-218-45.compute-1.amazonaws.com:5432/d1ime6gf8p5d76';

}

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
	if (err) throw err;
	console.log('Connected to postgres! Getting schemas...');

	client
		.query('SELECT table_schema,table_name FROM information_schema.tables;')
		.on('row', function(row) {
			console.log(JSON.stringify(row));
		});
});
