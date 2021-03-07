const puppeteer = require('puppeteer')

module.exports = async (team, color) => {

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

    //console.log(team)
    
    team.forEach(player => {
        HTML_TEMPLATE += `<div>
                            <img src="${player.user.avatarURL()}" />
                            <p>${player.user.username}</p>
                          </div>`
    })
    
    HTML_TEMPLATE += '</body></html>'

    //console.log(HTML_TEMPLATE)
    try {

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent( HTML_TEMPLATE );
    const example = await page.$('body');
    const boundingBox = await example.boundingBox();

    const imageBuffer = await example.screenshot({
      type: 'jpeg',
      quality: 100,
      clip: {
        x: 0,
        y: 0,
        width: boundingBox.width,
        height: boundingBox.height
      }
    });

    await browser.close();

    return imageBuffer

    }catch (e) {
      console.log("Try Error", e)
    }

    //console.log(imageBuffer)
    
}