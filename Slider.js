var slider = function (){

	var height;
	var knobRadius;
	var knob;
	var scale;
	var valueText;
	var title;
	
	function chart(selection){
		
		selection.each( function(data){
			
				scale = d3.scaleQuantize()
						.range(data)
						.domain([0, height]);
					
				d3.select(this)
						.append("line")
						.attr("x1", 0)
						.attr("x2", 0)
						.attr("y1", 0)
						.attr("y2", height)
						.attr("class", "scale-line");
						
				knob = d3.select(this).append("circle")
						.attr("cx", 0)
						.attr("cy", 0)
						.attr("r", knobRadius)
						.attr("class", "scale-knob")
						.call(d3.drag()
						.on("start drag", slide));
						
				valueText =	d3.select(this).append("text")
							.attr("dx", 50)
							.attr("dy", 0)
							.attr("class", "scale-text")
							.text(scale(knob.attr("cy")));
							
				d3.select(this)
				.append("text")
				.attr("dy", -50)
				.attr("dx", -5)
				.attr("class", "scale-title")
				.text(title);
				
		});
	}
	
	
	function slide(){
		if(d3.event.y < (height - (knobRadius/2)) && d3.event.y > (knobRadius/2)){
			
			knob.attr("cy", d3.event.y);
			
			var val = scale(knob.attr("cy"));
			valueText.attr("dy", d3.event.y)
			.text(val);
			
			eventBus.publish("knob-drag", val);
		}
	}
	
	chart.height = function(value){
		if(!arguments.length) return height;
		height = value;
		return this;
	}
	
	chart.knobRadius = function(value){
		if(!arguments.length) return knobRadius;
		knobRadius = value;
		return this;
		
	}
	
	chart.title = function(value){
		if(!arguments.length) return title;
		title = value;
		return this;
	}
			
	return chart;

}