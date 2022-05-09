import { Client, Intents, MessageEmbed } from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
import { config } from 'dotenv';
import ApiServices from './plugins/services.js';
config();

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

function formatParams(url) {
	/**
	 * 
	 * Chercher tous les params dans l'url et les valeurs qui suivent
	 * INDICE : Chaque params est séparé par &
	 * 			Entre le name et la value du param il y a un =
	 */
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

function checkParams(array, name, value) {
	if(typeof array[name] === 'undefined')
		array[name] = value
	else
		array[name] += ',' + value
	return array
}

client.once('ready', () => {
	console.log('Client Ready !');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ez') {
		await interaction.reply('Ez !');
	} else if (commandName === 'connect-vinted') {
		ApiServices.refreshToken();
		await interaction.reply(`Token refresh`);
	} else if (commandName === 'get-vetements') {
		ApiServices.getVetements().then(async res => {
			makeEmbedMsg(res).then(async msg => {
				await interaction.reply({ embeds: [msg] });
			});
		})
	} else if (commandName === 'get-url') {
		let url = interaction.options.getString('vinted_url', true)
		ApiServices.getWithParameters(formatParams(url)).then(async res => {
			for( let i = 0; i < 15; i++ ) {
				makeEmbedMsg(res[i]).then(async msg => {
					await interaction.channel.send({ embeds: [msg] })
				});
			}
		})
	}
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);

/**
 * TODO
 * 
 * Gestion des erreurs de l'api vinted sur le token invalide
 * 		-> Refaire le refresh token et la requête demandée
 * 
 * Automatiser la récup du token s'il n'est pas récupéré
 * 
 * Sauvegarder les urls et les channels
 * [ channelId => url ]
 * Ex:	- On veut les derniers joggings sortis sur le canal "joggos" avec la commande /get-vetements
 * 		- On récupère l'id du canal où le message est envoyé
 * 		- On check dans le tableau l'url correspondante
 * 		- On execute la requête et on renvoi le tout sur le même canal
 * 
 * Gestion des jeux-vidéos ?
 * 
 * Git du tout
 * 
 * Pour éviter de surcharger l'API avec des requêtes de pleins d'utilisateurs
 * Utiliser un système de cache -> [ Url demandée -> résultat de l'api sauvegardé en cache ]
 * Si la même requête est demandée dans les 2~3 min, on renvoi la donnée du cache
 * Sinon, on refait la requête api et on save dans le cache
 * 
 */