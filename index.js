import { Client, Intents, MessageEmbed } from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
import { config } from 'dotenv';
import ApiServices from './plugins/services.js';
config();

/**
 * Crée un Embeded Message pour Discord avec les valeurs du produit passé en param
 * @param {Object} item 
 * @returns {MessageEmbed}
 */
async function makeEmbedMsg(item) {
	return new MessageEmbed()
		.setColor('AQUA')
		.setTitle( item.title != "" ? item.title : "Pas de titre" )
		.setDescription( item.title != "" ? item.title : "Pas de titre" )
		.setURL( item.url != null ? item.url : "" )
		.setAuthor({ 
			name: item.user != null || item.user.login != null ? item.user.login : "Pas de login", 
			iconURL: item.user.photo != null ? item.user.photo.url : "", 
			url: item.user != null || item.user.profile_url != null ? item.user.profile_url : ""
		})
		.setImage(item.photo != null && item.photo.url != null ? item.photo.url : "#")
		.addFields(
			{ name: ':credit_card: Prix', value: '```' + item.price + ' ' + item.currency + '```', inline: true },
			{ name: ':straight_ruler: Taille', value: '```' + item.size_title + '```', inline: true },
			{ name: ':clipboard: Marque', value: '```' + item.brand_title + '```', inline: true }
		)
}

/**
 * Récupère les paramètres d'une recherche utilisateur Vinted
 * Renvoi un tableau de ces params adaptés pour l'API Vinted
 * @param {string} url URL Utilisateur du site Vinted
 * @returns {Array} Paramètres récupérés de l'url et formattés pour l'API
 */
function formatParams(url) {
	let params = []
	let ez = url.split('&')
	ez.forEach(elem => {
		if(elem.indexOf('brand_id[]') != -1) {
			let val = elem.split('=')
			params = checkParams(params, 'brand_ids', val[val.length - 1])
		} else if (elem.indexOf('catalog[]') != -1) {
			let val = elem.split('=')
			params = checkParams(params, 'catalog_ids', val[val.length - 1])
		} else if (elem.indexOf('price_to') != -1) {
			let val = elem.split('=')
			params = checkParams(params, 'price_to', val[val.length - 1])
		} else if (elem.indexOf('currency') != -1) {
			let val = elem.split('=')
			params = checkParams(params, 'currency', val[val.length - 1])
		} else if (elem.indexOf('status[]') != -1) {
			let val = elem.split('=')
			params = checkParams(params, 'status_ids', val[val.length - 1])
		} else if (elem.indexOf('size_id[]') != -1) {
			let val = elem.split('=')
			params = checkParams(params, 'size_ids', val[val.length - 1])
		}
	})

	return params;
}

/**
 * Vérifie si la clé "name" est déjà présente dans le tableau "array"[name => value]
 * @param {Array} array 
 * @param {string} name 
 * @param {*} value 
 * @returns {Array} array
 */
function checkParams(array, name, value) {
	if(typeof array[name] === 'undefined')
		array[name] = value
	else
		array[name] += ',' + value
	return array
}

/**
 * Lancement du client, connexion à l'API Discord
 */
client.once('ready', () => {
	console.log('Client Ready !');
});

/**
 * Récupération des interactions provenant du serveur Discord
 */
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	// Test des différentes commandes disponibles
	switch (commandName) {
		case 'ez':
			await interaction.reply('Ez !');
			break;
		case 'connect-vinted':
			ApiServices.refreshToken();
			await interaction.reply(`Token refresh`);
			break;
		case 'get-vetements':
			ApiServices.getVetements().then(async res => {
				makeEmbedMsg(res).then(async msg => {
					await interaction.reply({ embeds: [msg] });
				});
			})
			break;
		case 'get-url':
			let url = interaction.options.getString('vinted_url', true)
			ApiServices.getWithParameters(formatParams(url)).then(async res => {
				for( let i = 0; i < 15; i++ ) {
					makeEmbedMsg(res[i]).then(async msg => {
						await interaction.channel.send({ embeds: [msg] })
					});
				}
			})
			break;
		default:
			await interaction.reply(`Commande ${commandName} inconnue ! :thinking:`)
	}
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);