function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    var washingFreqData = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleResult = sampleArray.filter(idObj => idObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var washResult = washingFreqData.filter(id2 => id2.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstResult = sampleResult[0];
    // 2. Create a variable that holds the first sample in the metadata array.
    var firstWashResult = washResult[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleValues = firstResult.sample_values;
    var otuID = firstResult.otu_ids;
    var otuLabel = firstResult.otu_labels;

    // 3. Create a variable that holds the washing frequency.
    var washFreq = firstWashResult.wfreq;
    console.log(washFreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuID.slice(0, 10).reverse().map(otu => "OTU " + otu);

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sampleValues,
      y: yticks,
      hovertext: otuLabel.reverse(),
      type: "bar",
      orientation: "h"
      
    };
    var data = [barData];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found </b>",
      width: 500,
      height: 400,
      margin: {t: 100, b: 0}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, barLayout);
    
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: otuID,
      y: sampleValues,
      mode: "markers",
      text: otuLabel,
      marker: {
        size: sampleValues,
        color: otuID
      }
    };
    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Culture Per Sample</b>",
      showLegend: false,
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    // 4. Create the trace for the gauge chart.
    var gaugeTrace = {
      domain: {x: [0, 1], y: [0, 1]},
      value: washFreq,
      title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "red"},
        steps: [
          {range: [0, 2], color: "deepskyblue"},
          {range: [2, 4], color: "dodgerblue"},
          {range: [4, 6], color: "blue"},
          {range: [6, 8], color: "darkblue"},
          {range: [8, 10], color: "midnightblue"},
        ]
      }
    };

    gaugeData = [gaugeTrace];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: {t: 0, b: 0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
