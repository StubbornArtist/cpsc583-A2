const MAX_RADIUS = 400;
const BAND_WIDTH = 50;
const SEPERATION = 60;

window.onload = function init(){
	//TODO: titles on chart, switch dates
	d3.csv("data.csv", function(data){
		
		var parsedData = parseData(data);
		
		
		d3.select("#slider")
		.datum(getDates(data))
		.call(slider()
				.height(600)
				.knobRadius(15)
				.title("Years"));
						
		d3.select("#container")
		.datum(parsedData["1974"])
		.call(expandingDonut());
		
		var tooltip = 
		d3.select("body")
		.append("div")
		.attr("class", "tooltip");

		eventBus.subscribe("arc-mouseover", function(data){			
			tooltip.style("top", (d3.event.pageY - 28) + "px")
						.style("left", (d3.event.pageX) + "px")
						.html("<p><span>Food : " + data.name +
						"</br>Quantity : " + data.value + " " + data.unit +"</p>")
						.classed("tooltip-show", true);
		});
		
		eventBus.subscribe("arc-mouseout", function(data){
			tooltip.classed("tooltip-show", false);
		});
		
		eventBus.subscribe("knob-drag", function(num){
				d3.select("#container")
					.datum(parsedData[num])
					.call(expandingDonut());
		});
	
	});
}

var expandingDonut = function (){
	var path;
	var container;
	var savedData;
	
	function chart(selection){
		selection.each(function(data){
			
			container = this;
			savedData = data;
			path = [];
			
			create();
		});
	}
	
	this.clearChart = function(){
		d3.select(container)
		.selectAll("*")
		.remove();
	}
	
	this.createChart = function(){
		var donutChart = layeredDonut()
					.maxRadius(MAX_RADIUS)
					.bandWidth(BAND_WIDTH)
					.seperation(SEPERATION)
					.path(path);
					
					
			d3.select(container)
			.attr("width", (MAX_RADIUS + BAND_WIDTH) * 2)
			.attr("height", (MAX_RADIUS + BAND_WIDTH) * 2)
			.datum(savedData)
			.call(donutChart);	
	}
	
	this.createInteraction = function(){
		
		d3.selectAll(".arc").on("mousedown", function(d){	
		
			var index = path.indexOf(d.data.name);
			if(index != -1){ 
				for (i = path.length - 1; i >= index; i--){
					path.pop();
				}
			}
			else if(path.length >=d.data.level){
				for(i = path.length - 1; i >= d.data.level; i--){
					path.pop();
				}
				path.push(d.data.name);
			}
			else{
				path.push(d.data.name);
			}
			create();
			markSelected();
		})
		.on("mouseover", function(d){
			d3.select(this).classed("arc-hover", true);
			eventBus.publish("arc-mouseover", d.data);
		})
		.on("mouseout", function(d){
			d3.select(this).classed("arc-hover", false);
			eventBus.publish("arc-mouseout", d.data);
		});	
	}
	
	this.markSelected = function(){
		d3.select(container)
		.selectAll(".arc")
		.filter(function(d){ return (path.indexOf(d.data.name) != -1) 
		&& (d.data.children.length > 0); })
		.classed("arc-select", true);
	}
	
	this.create = function(){
		clearChart();
		createChart();
		createInteraction();
	}
	
	return chart;
}


function parseData(raw){
	
	var dates = raw.columns.filter(function(d){ return !isNaN(d);});
	var levels = ["desc1", "desc2", "desc3", "desc4"];
	var years = {};
	dates.forEach(function(date){
		var data = [];
		raw.forEach(function(row){
			
			recurse(data, levels, row, (row[date] == '')? 0 : +row[date], 0);
			
		});
		years[date] = data; 
	
	});
	
	return years;
	
	
}

function recurse(root, levelLabels, row, value, level){
	
	var cat;
	var levelLabel = levelLabels[0];
	var existing = root.filter(function(d){ return d.name == row[levelLabel];});
	if(existing.length == 0){
		cat = {"name" : row[levelLabel], "unit": row.unit, "children" : []};
		root.push(cat); 
	}
	else{
		cat = existing[0];
	}
	if(levelLabels.length == 1 || row[levelLabels[1]] == ''){
		cat["value"] = value;
		cat["level"] = level;
		return;
	}
	recurse(cat.children, levelLabels.slice(1), row, value, level + 1); 
}


function getDates(data){
	return data.columns.filter(function(d){ return !isNaN(d);});
}

