class Check{
    
    constructor(config){
        this._config = config 

    }
    _hasPermission(msg) {
		if (this._config.consenti.utenti.includes(msg.member.id)) {
			return true;
		}
		for (const roleName of this._config.consenti.ruoli) {
			if (msg.member.roles.cache.find( r => r.name == roleName)) {
				return true;
            }
            msg.reply('non hai il permesso!')
		}
		return false;
	}

}
module.exports = Check;