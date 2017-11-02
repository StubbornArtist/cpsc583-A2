var donut = function(){
	
	var bandWidth;
	var radius;
	var segValue;
	var classes;
	
	function chart(selection){
		
		selection.each( function(data){
			
			var arc = d3.arc()
						.innerRadius(radius)
						.outerRadius(radius + bandWidth);
			var pie = d3.pie()
						.sort(null)
						.startAngle(0)
						.endAngle(Math.PI * 2)
						.value(segValue);
							
			var g = d3.select(this)
			.selectAll("g" + classes)
			.data(pie(data))
			.enter()
			.append("g")
			.attr("class", classes)
			.attr("transform", "translate (" + (radius + bandWidth) + "," + (radius + bandWidth) + ")");
			
			g.append("path")
			.attr("d", arc);
		});
	}
	
	
	
	chart.radius = function(value){
		if(!arguments.length) return radius;
		
		radius = value;
		return this;
	}
	
	chart.bandWidth = function(value){
		if(!arguments.length) return bandWidth;
		
		bandWidth = value;
		return this;
	}
	
	chart.value = function(value){
		if(!arguments.length) return segValue;
		
		segValue = value;
		return this;
	}
	
	chart.classes = function(value){
		if(!arguments.length) return classes;
		
		classes = value;
		return this;
	}
	
	return chart;
}