var eventBus = {
	
	events : {},
	
	
	subscribe : function(eventName, executable){
		
		if(!(this.events[eventName]) || this.events[eventName].length <=0){
			this.events[eventName] = [];
		}
		this.events[eventName].push(executable);
	},
	
	publish : function(eventName, data){
		
		if(!this.events[eventName]) return;
				
		this.events[eventName].forEach(function(executable){
				executable(data);
		});	
	}
};