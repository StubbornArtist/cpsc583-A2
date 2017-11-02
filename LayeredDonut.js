var layeredDonut = function(){

	var maxRadius;
	var bandWidth;
	var levels;
	var seperation;
	var path;
	
	function chart(selection){
		
		selection.each( function(data){
			var radius = maxRadius - ((path.length - 1) * (bandWidth + seperation));
			createLevels(this, radius, data, 0, path);
			
			
			/**for( var i = 0; i <= levels; i++){
					
				var levelData = data.filter(function(d){ return d.level == i;});
								
				d3.select(this)
				.append("g")
				.attr("transform" , "translate(" + (maxRadius - radius) +"," + (maxRadius - radius) +")")
				.datum(levelData)
				.call(donut()
						.radius(radius)
						.bandWidth(bandWidth)
						.value(function(d){ return d.value;})
						.classes("arc arc-level" + i ));				

				radius-= (bandWidth + seperation);
			}**/
			
			
		});
	}
	function createLevel (container, radius, data, level){
		d3.select(container)
				.append("g")
				.attr("transform" , "translate(" + (maxRadius - radius) +"," + (maxRadius - radius) +")")
				.datum(data)
				.call(donut()
						.radius(radius)
						.bandWidth(bandWidth)
						.value(function(d){ return d.value;})
						.classes("arc arc-level" + level ));	
	}
	
	function createLevels(container, radius, root, level, path){
		
		createLevel(container, radius, root, level);
		
		if(path.length == 0){
			return;
		}
		
		var child = root.filter(function(d){ return d.name == path[0];})[0];
		path.shift();
		radius += (bandWidth + seperation);
		
		if(!(child.children.size <= 0)){
			createLevels(container, radius, child.children, level + 1, path);
		}
	}

	chart.maxRadius = function(value){
		if(!arguments.length) return radius;
		
		maxRadius = value;
		return this;
	}
	
	chart.bandWidth = function(value){
		if(!arguments.length) return bandWidth;
		
		bandWidth = value;
		return this;
	}
	
	chart.levels = function(value){
		if(!arguments.length) return levels;
		
		levels = value;
		return this;
	}
	
	chart.seperation = function(value){
		if(!arguments.length) return seperation;
		
		seperation = value;
		return this;		
	}
	
	chart.path = function(value){
		if(!arguments.length) return path;
		
		path = value;
		return this;
	}


	return chart;
}	