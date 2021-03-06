const Discord = require('discord.js')
require('dotenv').config()
const {generateImage} = require('./template')

const client = new Discord.Client();

//consts
const prefix = '_random'
const blacklist = new Set(['201503408652419073', '235088799074484224'])

client.once('ready', () => {
    console.log("bot online!")
    //for(let [key, user] of client.users.cache) console.log(`id: ${key} username: ${user.username}`)
})
client.on('message', async message => {
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
                    let first_team = []
                    let second_team = []
                    
                    for(let [key, member] of channel.members){
                      if(!blacklist.has(key.toString())) players.push(member)
                    }
                    
                    //check if there is teams
                    if(players.length > 1){
                        //shuffle and spliting the teams
                        let shufflePlayer = shuffle(players)
                        const half = Math.trunc(channel.members.size / 2);
                        console.log(half)    
                        first_team = shufflePlayer.splice(0, half)
                        second_team = shufflePlayer.splice(-half)
                    }else{
                        return message.channel.send("Só existe uma pessoa no canal")
                    }
                    
                    let team_1_text = new Discord.MessageEmbed()
                        .setColor('#f7a310')
                        .setTitle('Equipa 1')

                    let team_2_text = new Discord.MessageEmbed()
                        .setColor('#53ccbb')
                        .setTitle('Equipa 2')
                    
                    //generateImage(first_team, '#f7a310')
                    let image1 = await generateImage(first_team, '#f7a310')
                    let image2 = await generateImage(second_team, '#f7a310')

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

                    message.channel.send(team_1_text)
                    message.channel.send(team_2_text)

                    //message.channel.send(new Discord.MessageAttachment(image, `team_1.jpeg`))
                    //message.channel.send(new Discord.MessageAttachment(generateImage(teamToPrint), `team_1.jpeg`))

                    /*second_team.forEach(async user => {
                        const { avatarURL } = await client.users.fetch(user.id)
                        team_2_text.setAuthor(user.username, avatarURL)
                    })
                    message.channel.send(`Equipa 1: ${first_team}`)
                    message.channel.send(`Equipa 2: ${second_team}`)
*/
                }
            }
        }

    }
})

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


/* 
const _htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <style>
      body {
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        background: rgb(22, 22, 22);
        color: #fff;
        max-width: 300px;
      }

      .app {
        max-width: 300px;
        padding: 20px;
        display: flex;
        flex-direction: row;
        border-top: 3px solid rgb(16, 180, 209);
        background: rgb(31, 31, 31);
        align-items: center;
      }

      img {
        width: 50px;
        height: 50px;
        margin-right: 20px;
        border-radius: 50%;
        border: 1px solid #fff;
        padding: 5px;
      }
    </style>
  </head>
  <body>
    <div class="app">
      <img src="https://avatars.dicebear.com/4.5/api/avataaars/${name}.svg" />

      <h4>Welcome ${name}</h4>
    </div>
  </body>
</html>
`


const images = await nodeHtmlToImage({
    html: _htmlTemplate,
    quality: 100,
    type: 'jpeg',
    puppeteerArgs: {
      args: ['--no-sandbox'],
    },
    encoding: 'buffer',
})

message.channel.send(new Discord.MessageAttachment(images, `${name}.jpeg`))
*/