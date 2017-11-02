var slider = function (){

	var width;
	
	function chart(selection){
		
		selection.each( function(data){
			var scale = d3.scaleOrdinal()
						.range([0, width ])
						.domain(data);
						
						
			var line = d3.select(this)
						.append("line")
						.attr("width", width)
						.attr("class", "scale-line");
						
			line.selectAll(".label")
				.data(data)
				.enter()
				.append("g")
				.attr("transform", function(d){ return "translate (" +  scale(d) + ", 0 )";})
				.attr("class", "label")
				.append("text")
				.text("Hi");
				
		});
	}
	
	chart.width = function(value){
		if(!arguments.length) return width;
		width = value;
		return this;
	}
			
	return chart;

}