function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then(function(data){ // sample here is a parameter, so use f string
    let divTag=d3.select("#sample-metadata");
    divTag.html("");
    let list=divTag.append("ul").attr("style","list-style-type:none; padding:0"); //add style to remove bullets and padding
    Object.entries(data).forEach(([key,value])=>list.append("li").text(`${key}:${value}`).attr("style","font-size:12px"));// adjust the font-size of each item in order to fit in the box
  }); 
}; 



function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then(function(data){
    console.log(data["otu_ids"].slice(0,10));
    let pieData=[{labels:data["otu_ids"].slice(0,10),
                  values: data["sample_values"].slice(0,10),
                  type:"pie",
                  textinfo:"percent", // only show percentage on chart
                  hoverinfo:"text", // only display text when hovering
                  hovertext: data["otu_labels"].slice(0,10) 
                }];
    Plotly.newPlot("pie",pieData);
    let bubbleData=[{ x: data["otu_ids"],
                     y: data["sample_values"],
                     type:"scatter",
                     name:"",
                     mode: "markers",
                     marker:{
                       size: data["sample_values"],
                       color: data["otu_ids"],
                       sizeref: 1.5,
                       colorscale:"Earth" 
                     },
                     text:data["otu_labels"],                 
                     hovertemplate:"(%{x},%{y}) %{text}" //display coordinates and text of a point
                    }];
      Plotly.newPlot("bubble",bubbleData);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
