const nodeHtmlToImage = require('node-html-to-image')

exports.generateImage = async (team, color) => {

    let HTML_TEMPLATE = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <style>
            body {
                font-family: "Poppins", Arial, Helvetica, sans-serif;
                background: rgb(207, 9, 9);
                color: #fff;
                max-width: 500px;
                margin: 0;
                padding: 0;
                display: inline-block;
                margin-left: auto;
                margin-right: auto;
                padding: 20px 30px 0 30px;
                background: rgb(31, 31, 31);
              }
              body > div{
                margin: 0px 10px;
                max-width: 70px;
                float: left
              }
        
              img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: 2px solid #fff;
                padding: 5px;
                display: flex;
                justify-content: center;
                margin: auto
              }
              p{
                font-size: 14px;
                font-weight: 500;
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                text-align: center;
              }
            </style>
          </head>
          <body>`

    console.log(team)
    team.forEach(player => {
        HTML_TEMPLATE += `<div>
                            <img src="${player.user.avatarURL()}" />
                            <p>${player.user.username}</p>
                          </div>`
    })
    
    HTML_TEMPLATE += '</body></html>'

    console.log(HTML_TEMPLATE)

    let image = await nodeHtmlToImage({
        html: HTML_TEMPLATE,
        quality: 100,
        type: 'jpeg',
        puppeteerArgs: {
          args: ['--no-sandbox'],
        },
        encoding: 'buffer',
    })

    console.log(image)

    return image
}