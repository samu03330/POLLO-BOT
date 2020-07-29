import os,subprocess,time
cartellaPCM = r'C:\\Users\\omaro\\Desktop\\tavolo\\progetti\\discordbot\\recorder'

def getlist(cartella):
    
    nomiFile = os.listdir(cartella)
    
    i=0 
    inputs=''
    
    for file in nomiFile:
        
        
        nome, separatore , estensione = file.partition('.')
        
        if separatore+estensione=='.pcm':
            
            subprocess.run(f'ffmpeg -f s16le -ar 48k -ac 2 -i {file} {nome}.wav',shell=True)
            
        else:
            continue
        
    time.sleep(2) 
    NewNomiFile = os.listdir(cartella) 
    
    for audio in NewNomiFile:
       
        nome, separatore , estensione = audio.partition('.')
        
        if separatore+estensione=='.wav': 
            i+=1
            inputs += ' -i '+audio  

     
    subprocess.run(f'ffmpeg{inputs} -filter_complex amix=inputs={i}:duration=longest:dropout_transition=2 nuovo.wav')
    time.sleep(2)
    
    
    
   

   
        


    
         
print(getlist(cartellaPCM))
