const MAX_LABEL_WIDTH = 15;

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
			
			g.append("text")
			.attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"
			 +"rotate(" + angle(d) + ")";})
			.attr("class", "arc-label")
			.text(function(d){ return label(d.data.name); });
			
		
			/*g.append("g")
			.attr("transform", function(d){ return "translate(" + pos(d, arc) + ")";})
			.append("foreignObject")
			.attr("width", 	MAX_LABEL_WIDTH)
			.attr("height", MAX_LABEL_WIDTH)
			.append("xhtml:body")
			.append("p")
			.attr("class", "arc-label")
			.text(function(d){return d.data.name;});
			*/
		
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
	
	function angle(d){
		var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
		return a > 90 ? a - 180 : a;
	}
	
	function pos(d, arc){
		var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
		var c = arc.centroid(d);
		if(a > 180){
			c[0] = c[0] - MAX_LABEL_WIDTH;
			if( a < 270){
				c[1] = c[1] - MAX_LABEL_WIDTH;
			}
		}
		return c;
	}
	
	function label(text){
		if(text.length > MAX_LABEL_WIDTH){
				return text.slice(0, MAX_LABEL_WIDTH - 3) + "...";
		}
		return text;
	}
	
	return chart;
}