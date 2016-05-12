var convict = require('convict');

// Define a schema
var conf = convict({
	env:
	{
		doc: "The applicaton environment.",
		format: ["production", "development", "test"],
		default: "development",
		env: "NODE_ENV",
		arg: 'env'
	},

	server:
	{
		ip:
		{
			doc: "The IP address to bind.",
			format: "ipaddress",
			default: "127.0.0.1",
			env: "IP_ADDRESS",
		},
		
		port:
		{
			doc: "The port to bind.",
			format: "port",
			default: 3000,
			env: "PORT"
		}
	},

	database:
	{
		ip:
		{
			doc: "The IP address of the database.",
			format: "ipaddress",
			default: "127.0.0.1",
			env: "RDS_HOSTNAME",
		},

		port:
		{
			doc: "The port of the database",
			format: "port",
			default: 3306,
			env: "RDS_PORT"
		},

		username:
		{
			doc: "The username to be used to access the database",
			format: String,
			default: "root",
			env: "RDS_USERNAME"
		},

		password:
		{
			doc: "The password to be user to access the database",
			format: String,
			default: "root",
			env: "RDS_PASSWORD"
		},

		name:
		{
			doc: "The name of the database",
			format: String,
			default: "homefinds",
			env: "RDS_NAME"
		}
	},

	view:
	{
		locals:
		{
			base:
			{
				doc: "The basepath of assets",
				format: String,
				default: "/",
				env: "URL_BASE"
			},

			images:
			{
				doc: "The basepath of images",
				format: String,
				default: "/images/",
				env: "IMAGE_BASE"
			}
		}
	},

	facebook:
	{
		clientid:
		{
			doc: "The facebook clientId",
			format: String,
			default: ""
		},

		clientsecret:
		{
			doc: "The facebook clientSecret",
			format: String,
			default: ""
		}
	}
		


});

// Load environment dependent configuration
var env = conf.get('env');
conf.loadFile('./config/' + env + '.json');

// Perform validation
conf.validate({strict: true});

module.exports = conf;