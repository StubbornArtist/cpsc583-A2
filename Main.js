const MAX_RADIUS = 600;
const BAND_WIDTH = 50;
const SEPERATION = 70;

window.onload = function init(){
	
	d3.csv("data.csv", function(data){
		
		var selectedYear = "1974";
		var parsedData = parseData(data);
		
		var selectedData = parsedData.filter(function(d){ return d.year == selectedYear; })[0];
									
		var donutChart = layeredDonut()
						.maxRadius(MAX_RADIUS)
						.bandWidth(BAND_WIDTH)
						.seperation(SEPERATION)
						.path(["Carcase meat", "Pork", "Pork joints"]);
					
		d3.select("#container")
		.attr("width", (MAX_RADIUS + BAND_WIDTH) * 2)
		.attr("height", (MAX_RADIUS + BAND_WIDTH) * 2)
		.datum(selectedData.data)
		.call(donutChart);
			
		d3.selectAll(".arc").on("mousedown", function(d){	
			d["selected"] = !d["selected"];
			
			d3.selectAll(".arc")
			.filter(function(d2){return d2.data.parent == d.data.name && d2.data.level == (d.data.level - 1);})
			.classed("arc-expand", d["selected"]);
			
			d3.select("#container")
			.datum()
			.call(donutChart);
		})
		.on("mouseover", function(){
			d3.select(this).classed("arc-hover", true);
		})
		.on("mouseout", function(){
			d3.select(this).classed("arc-hover", false);
		});
		
	});
}

function parseData(raw){
	
	var dates = raw.columns.filter(function(d){ return !isNaN(d);});
	var levels = ["desc1", "desc2", "desc3", "desc4"];
	var years = [];
	dates.forEach(function(date){
		var data = [];
		raw.forEach(function(row){
			//data.push({"name" : findName(levels, row), "parent" : findParent(levels, row), "level" : findLevel(levels, row), 
			//"value" : (row[date] == '')? 0 : +row[date], "unit" : row.unit}); 
			
			recurse(data, levels, row, (row[date] == '')? 0 : +row[date]);
			
		});
		years.push({"year" : date, "data" : data}); 
	
	});
	
	return years;
	
	
}



function recurse(root, levelLabels, row, value){
	
	var cat;
	var level = levelLabels[0];
	var existing = root.filter(function(d){ return d.name == row[level];});
	if(existing.length == 0){
		cat = {"name" : row[level], "unit": row.unit, "children" : []};
		root.push(cat); 
	}
	else{
		cat = existing[0];
	}
	if(levelLabels.length == 1 || row[levelLabels[1]] == ''){
		cat["value"] = value;
		return;
	}
	recurse(cat.children, levelLabels.slice(1), row, value); 
}

function findLevel(levelTitles, row){
	var levelTitle = levelTitles[levelTitles.length - 1];
	if(row[levelTitle] != ''){
		return 0;
	}

	return 1 + findLevel(levelTitles.slice(0, levelTitles.length -1), row);
}

function findName(levelTitles, row){
	var levelTitle = levelTitles[levelTitles.length - 1];
	if(row[levelTitle] != ''){
		return row[levelTitle];
	}

	return findName(levelTitles.slice(0, levelTitles.length -1), row);
}	

function findParent(levelTitles, row){
	var levelTitle = levelTitles[levelTitles.length - 1];
	if(row[levelTitle] != ''){
		return row[levelTitles[levelTitles.length - 2]];
	}
	
	return findParent(levelTitles.slice(0, levelTitles.length -1), row);
}


