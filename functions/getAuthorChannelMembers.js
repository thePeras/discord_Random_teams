module.exports = (channels, author) => {
    //loop thought server channels
    for (let [key, channel] of channels) {
        if(channel.type === "voice"){
            if(channel.members.get(author)){
                return (channel.members)
            }
        }
    }
    return {}
}