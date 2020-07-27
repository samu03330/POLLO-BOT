const Discord = require("discord.js");
const fs = require('fs');  
const config = require('./auth.json');
const path = require('path')
const log = require('./console/logs.js');
const Check= require('./console/checks.js');
const {spawn} = require('child_process');




const client = new Discord.Client();

const check = new Check(config);

//gestione errori ,avvisi ed eventi 


// crea il file output (ogni volta che qualcuno inizia a parlare)
function generateOutputFile(channel, member) {
  const fileName = `./${channel.id}-${member.id}-${Date.now()}.pcm`; //non si possono utilizzare username perché ci sono alcuni con emoji...
  return fs.createWriteStream(fileName);
}

client.on('message', msg => {
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if (command==='entra') {
    if(check._hasPermission(msg)){
    
    var [channelName] = args;
    if (channelName ==1){
      var canale = "⏳ │COLLOQUIO 1";
    }else if(channelName ==2){
      var canale = "⏳ │COLLOQUIO 2";
    }else if(channelName ==3){
      var canale = "⏳ │COLLOQUIO 3";
    }else{msg.reply('puoi scegliere solo tra : [1,2,3]')}
    
    
    if (!msg.guild) {
      return msg.reply('no private service is available in your area at the moment. Please contact a service representative for more details.');
    }
  }
  
    const voiceChannel = msg.guild.channels.cache.find(channelName => channelName.name === canale);
    //console.log(voiceChannel.id);
    voiceChannel.join()
    .then(conn => {
        msg.reply(`**ok!** Sono su ${canale}`);
        // create our voice receiver
        const receiver = conn.receiver;

        conn.on('speaking', (user, speaking) => {
          if (speaking) {
            msg.channel.send(`sto ascoltando ${user}`);
            //questo crea un PCM a 16-bit ,stereo 48KHz PCM stream.
            const audioStream = receiver.createStream(user, { mode: 'pcm' });
            // crea un autput in modo da poter passare ad un file
            const outputStream = generateOutputFile(voiceChannel, user);
            // passa i dati della stream in un file
            audioStream.pipe(outputStream);
            outputStream.on("data", console.log);
            // quando l'utente smette di parlare
            audioStream.on('end', () => {
              msg.channel.send(`non sto ascoltando ${user}`);
            });
          }
        });
      })
      .catch(console.log);
    
    
  }
  if(command==='esci') {
    var [channelName] = args;
    
    if (channelName ==1){
      var canale = "⏳ │COLLOQUIO 1";
    }else if(channelName ==2){
      var canale = "⏳ │COLLOQUIO 2";
    }else if(channelName ==3){
      var canale = "⏳ │COLLOQUIO 3";
    }else{msg.reply('puoi scegliere solo tra : [1,2,3]')}
    
    const voiceChannel = msg.guild.channels.cache.find(channelName => channelName.name === canale);
    
    voiceChannel.leave()
   


    const python = spawn('python', ['conversion.py']);
    
    python.on('close', () => {
     
      const canaleRegistrazioni = msg.guild.channels.cache.find(channelName => channelName.name === '🚧│registrazioni');
      
      canaleRegistrazioni.send({
        files: ['./nuovo.wav']
    })
 
    fs.readdir('.\\',(err, files) =>{
      if (err) {
          return log.error('cartella non raggiungibile: '+ err);
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

client.login(config.token);

client.on('ready', () => {
  console.log('bot pronto!');
});
