import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
config();


const commands = [
	new SlashCommandBuilder()
		.setName('ez')
		.setDescription('Ez en fait !'),
	new SlashCommandBuilder()
		.setName('connect-vinted')
		.setDescription('Test d\'une connexion vinted'),
	new SlashCommandBuilder()
		.setName('get-vetements')
		.setDescription('Test de récupération de produits'),
	new SlashCommandBuilder()
		.setName('get-url')
		.setDescription('Récupère les produits d\'une URL')
		.addStringOption( option => 
			option.setName('vinted_url')
				.setDescription('URL nécessaire à la requête')
				.setRequired(true)
		)
]
.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);