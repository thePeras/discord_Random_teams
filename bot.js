const Discord = require('discord.js')
require('dotenv').config()

const client = new Discord.Client();

//consts
const prefix = '_random'

client.once('ready', () => {
    console.log("bot online!")
    //console.log(client.guilds.cache.get('689597383637467148'))
})
client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return
    
    const author = message.author.id
    console.log(author)

    const args = message.content.slice(prefix.length + 1).split(" ")
    if(args.length > 0 && args[0] !== ''){
        console.log("args: " + args)
    }else{
        let channels = client.channels.cache
        for (let [key, channel] of channels) {
            if(channel.type === "voice"){
                if(channel.members.get(author)){
                    let players = []
                    for(let [key, member] of channel.members){
                        players.push(member)
                    }
                    let shufflePlayer = shuffle(players)
                    const half = Math.ceil(channel.members.size / 2);    
                    const first_team = shufflePlayer.splice(0, half)
                    const second_team = shufflePlayer.splice(-half)

                    message.channel.send(`Equipa 1: ${first_team}`)
                    message.channel.send(`Equipa 2: ${second_team}`)
                }
            }
        }
        //sortear~
        //get author member
        //const channel = message.author.voice
        //console.log(channel)
        //GuildChannel.VoiceChannel.members
        //see member channel
        //see channel users

        //console.log("server_id: " + server_id)
        //console.log("author_id: " + message.author.id)
        //console.log('guilds:' + client.guilds)
        //console.log('cache:' + client.guilds.cache)
        //console.log("server: " + client.guilds.cache[server_id])
        //console.log(client.users)
        //console.log("user: " + client.users.cache.get(message.author.id))
        //console.log(message)
        //console.log("123")
        //console.log(message.member)
        //console.log(message.member.voiceChannel)
    }
})

/*
  author: User {
    id: '297100876152045608',
    system: null,
    locale: null,
    flags: UserFlags { bitfield: 0 },
    username: 'thePeras',
    bot: false,
    discriminator: '8501',
    avatar: '70dfd26afa04ab6e3865cee288e5715b',
    lastMessageID: '817467985157554177',
    lastMessageChannelID: '689600049772363825'
  },
*/
client.login(process.env.BOT_TOKEN)

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }