const Discord = require("discord.js");
const fs = require('fs');  
const config = require('./auth.json');
const path = require('path')

const Check= require('./console/checks.js');
const {spawn} = require('child_process');
////////////////////////////////////////////////////////////////////////////////////////////////////////////
const client = new Discord.Client();

const check = new Check(config);
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function generateOutputFile(channel, member) {
  const fileName = `./${channel.id}-${member.id}-${Date.now()}.pcm`; 
  return fs.createWriteStream(fileName);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on('message', msg => {
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (command==='entra') {
    if(check._hasPermission(msg)){
    if (!msg.guild) {
      return msg.reply('nessun servizio privato');
    }
    if (msg.member.voice.channel) {
      msg.member.voice.channel.join()
      .then(conn => {
          msg.reply(`**ok!** Sono su ${msg.member.voice.channel.name}`);
          
          const receiver = conn.receiver;
  
          conn.on('speaking', (user, speaking) => {
            if (speaking) {
              msg.channel.send(`sto ascoltando ${user}`);
              
              const audioStream = receiver.createStream(user, { mode: 'pcm' });
              
              const outputStream = generateOutputFile(msg.member.voice.channel.name, user);
             
              audioStream.pipe(outputStream);
              outputStream.on("data", console.log);
              
              audioStream.on('end', () => {
                msg.channel.send(`non sto ascoltando ${user}`);
              });
            }
          });
        })
        .catch(console.log);
    } else {
      msg.reply('devi essere in una vocale!');
    }
  }
    
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  if(command==='esci'){
    if(check._hasPermission(msg)){ 
      
      if (msg.member.voice.channel) {
        msg.member.voice.channel.leave()    
      }else{
        msg.reply('devi essere in una vocale!');
        return
      }
    }

    const python = spawn('python', ['conversion.py']);
    
    python.on('close', () => {
     // if (check._esistefile('./nuovo.wav',msg)){}
      const canaleRegistrazioni = msg.guild.channels.cache.find(channelName => channelName.name === config.channel);
      
      canaleRegistrazioni.send({
        files: ['./nuovo.wav']
    })
    fs.readdir('.\\',(err, files) =>{
      if (err) {
          return 'cartella non raggiungibile: '+ err;
      } 
      
      files.forEach(file=>{
        
        if(path.extname(file)==".pcm" || path.extname(file)==".wav"){
          fs.unlinkSync(file);
        }
       
        
      });

  });
  
 
    
  
  });
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.login(config.token);

client.on('ready', () => {
  console.log('bot pronto!');
});
