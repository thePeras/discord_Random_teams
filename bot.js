require('dotenv').config()

//functions
const generateImage = require('./functions/template')
const shuffle = require('./functions/shuffle')
const getAuthorChannelMembers = require('./functions/getAuthorChannelMembers')

//consts
const prefix = '_random'
const blacklist = new Set(['235088799074484224', '201503408652419073']) //235088799074484224 e 201503408652419073
const csgo_channels = ['818950626762817586','818950593623097354','818953135354675270','818953297774772255','818953379928735774']
const orange = '#f7a310'
const blue = '#53ccbb'
const players_suffixs = ['Leader', 'AWPer', 'Entry Fragger', 'Support', 'Lurker']
let first_team = []
let second_team = []
let tittle_1 = 'Equipa 1'
let tittle_2 = 'Equipa 2'
const REACTION_TEXT = 'Reage a esta mensagem para mudar os jogadores das equipas para dois canais de voz diferentes'

//discord.js
const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.once('ready', () => {
    console.log("bot online!") 
    //console all server users
    //for(let [key, user] of client.users.cache) console.log(`id: ${key} username: ${user.username}`)
})

client.on('message', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return
    
    const author = message.author.id
    console.log("command executed by: " + author)

    const args = message.content.slice(prefix.length + 1).split(" ")
    
    if(args.length > 0 && args[0] !== ''){
        console.log("args: " + args)

        if(args[0]) tittle_1 = args[0]
        if(args[1]) tittle_2 = args[1]
    }

    let channel_members = getAuthorChannelMembers(client.channels.cache, author)
    let players = []
    first_team = []
    second_team = []
    
    //return if no voice channel was finded
    //if(Object.keys(channel_members).length === 0) return message.channel.send("Precisas de estar num canal de voz")
    
    //insert members to player
    for(let [key, member] of channel_members){
      if(!blacklist.has(key.toString())) players.push(member)
    }
    //check if there is more than 1 person teams
    if(players.length === 1) return message.channel.send("Só existe uma pessoa no canal")
    
    //shuffle and spliting the teams
    let shufflePlayer = shuffle(players)
    const half = Math.trunc(channel_members.size / 2);
    first_team = shufflePlayer.splice(0, half)
    second_team = shufflePlayer.splice(-half)
    
    //create the embed text
    let team_1_text = new Discord.MessageEmbed()
      .setColor(orange)
      .setTitle(tittle_1)
    
    let team_2_text = new Discord.MessageEmbed()
      .setColor(blue)
      .setTitle(tittle_2)
    
    //generate teams images
    let image1 = await generateImage(first_team, '#f7a310')
    let image2 = await generateImage(second_team, '#f7a310')
    
    if(!image1 || !image2) return message.channel.send("Não deu para renderizar as fotos") 

    //attachs users image and fields
    team_1_text.attachFiles([{name: "image.jpeg", attachment: image1}])
    team_1_text.setImage('attachment://image.jpeg');
    first_team.forEach( (player, i) => {
      team_1_text.addField(i < 5 ? players_suffixs[i] : 'Riffler', `${player}`, true)
    });
    
    team_2_text.attachFiles([{name: "image.jpeg", attachment: image2}])
    team_2_text.setImage('attachment://image.jpeg');
    second_team.forEach( (player, i) => {
      team_2_text.addField(i < 5 ? players_suffixs[i] : 'Riffler', `${player}`, true)
    });
    
    //send messages
    message.channel.send(team_1_text)
    message.channel.send(team_2_text)
    message.channel.send(REACTION_TEXT)
    //loop through channels to find a umpty one
    //console.log(client.channels.cache.get(csgo_channels[0]).members)
    //wait for reaction to change   
})

client.on('messageReactionAdd', async (reaction, user) => {
  // When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

  console.log('new reaction from: ' + reaction.message.author)
  console.log('message of the reaction: ' + reaction.message.content)

  //return if is not a reaction for Random Teams
  console.log(reaction.message.author)
  if(reaction.message.author.id !== '817461606035751012' || reaction.message.content !== REACTION_TEXT) return
	
  //search 2 empty channels
  let empty = [];
  for (let [key, channel] of client.channels.cache) {
    if(csgo_channels.indexOf(channel.id) > 0 && channel.members.size === 0){
      empty.push(channel)
      if(empty.length >= 2) break;
    }
  }

  //mode users to empty channel_members
  if(empty.length === 2){
    first_team.forEach(player => player.voice.setChannel(empty[0]))
    second_team.forEach(player => player.voice.setChannel(empty[1]))
  }

  //clear teams
  first_team = []
  second_team = []
});

client.login(process.env.BOT_TOKEN)

