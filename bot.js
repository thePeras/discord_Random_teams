require('dotenv').config()

//functions
const generateImage = require('./functions/template')
const shuffle = require('./functions/shuffle')
const getAuthorChannelMembers = require('./functions/getAuthorChannelMembers')

//consts
const prefix = '_random'
const blacklist = new Set(['235088799074484224', '201503408652419073']) //235088799074484224 e 201503408652419073
const orange = '#f7a310'
const blue = '#53ccbb'
let tittle_1 = 'Equipa 1'
let tittle_2 = 'Equipa 2'

//discord.js
const Discord = require('discord.js')
const client = new Discord.Client();

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
    let first_team = []
    let second_team = []
    
    //return if no voice channel was finded
    if(Object.keys(channel_members).length === 0) return message.channel.send("Precisas de estar num canal de voz")
    //insert members to player
    for(let [key, member] of channel_members){
      if(!blacklist.has(key.toString())) players.push(member)
    }
    //check if there is more than 1 person teams
    if(players.length === 1) return message.channel.send("Só existe uma pessoa no canal")
    
    //shuffle and spliting the teams
    let shufflePlayer = shuffle(players)
    const half = Math.trunc(channel.members.size / 2);
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
    
    //attachs users image and fields
    team_1_text.attachFiles([{name: "image.jpeg", attachment: image1}])
    team_1_text.setImage('attachment://image.jpeg');
    first_team.forEach(player => {
      team_1_text.addField('jogador', `${player}`, true)
    });
    
    team_2_text.attachFiles([{name: "image.jpeg", attachment: image2}])
    team_2_text.setImage('attachment://image.jpeg');
    second_team.forEach(player => {
      team_2_text.addField('jogador', `${player}`, true)
    });
    
    //send messages
    message.channel.send(team_1_text)
    message.channel.send(team_2_text)
    
})

client.login(process.env.BOT_TOKEN)

