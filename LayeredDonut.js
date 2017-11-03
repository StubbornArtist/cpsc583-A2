var layeredDonut = function(){

	var maxRadius;
	var bandWidth;
	var seperation;
	var path;
	
	function chart(selection){
		
		selection.each( function(data){
			var radius = maxRadius;
			createLevels(this, radius, data, 0, path);
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
						.value(function(d){ return d.value + 50;})
						.classes("arc arc-level" + level ));	
	}
	
	function createLevels(container, radius, root, level, path){
		
		if(root.length == 0){
			return;
		}
		createLevel(container, radius, root, level);
		
		if(path.length == 0){
			return;
		}
		
		var child = root.filter(function(d){ return d.name == path[0];})[0];
		radius -= (bandWidth + seperation);
		
		createLevels(container, radius, child.children, level + 1, path.slice(1));
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