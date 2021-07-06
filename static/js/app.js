d3.json("/data/samples.json").then(function(data) {
    // grab samples
    var samples = data.samples;
    
    // define which sample is interested in
    var sample_id = samples[0].id;
    
    // filter by desired sample
    var desiredSample = samples.filter(sample => sample.id === sample_id)[0];
    
    // plot OSU values with desired sample 
    graphTopOsu(desiredSample);

    // plot bubble chart
    graphBubble(desiredSample);

    // display demographic info
    displayDemoInfo(desiredSample);
});

function graphTopOsu(graphSample) {
    // grab top 10 OTU values
    var values = graphSample.sample_values.sort((a,b) => a < b).slice(0,10);
    
    // grab labels for the top 10 OTU values
    var labels = [];
    var hoverText = [];
    values.forEach(value => {
        index = graphSample.sample_values.indexOf(value);
        
        // avoid duplicate labels when values are repeated
        while (labels.includes((`OSU ${graphSample.otu_ids[index]}`))) {
            index = graphSample.sample_values.indexOf(value, index + 1);            
        } 
        labels.push(`OSU ${graphSample.otu_ids[index]}`);
        hoverText.push(graphSample.otu_labels[index]);
    })

    // set up horizontal bar chart
    traceBar = [{
        type: "bar", 
        orientation: "h", 
        x: values.reverse(), 
        y: labels.reverse(),
        text: hoverText.reverse() 
    }];

    var layoutBar = {
        title: "Top 10 Bacteria Cultures Found",
    }
    // plot horizontal bar chart
    Plotly.newPlot("bar", traceBar, layoutBar);
}


function graphBubble(graphSample) {
    var traceBubble = [{
        x: graphSample.otu_ids, 
        y: graphSample.sample_values, 
        text: graphSample.otu_labels,
        mode: "markers", 
        marker: {
            size: graphSample.sample_values,
            color: graphSample.otu_ids
        }
    }];

    var layoutBubble = {
        title: "Bacteria Cultures per Sample", 
        xaxis: {title:"OTU ID"} 
    };

    Plotly.newPlot("bubble", traceBubble, layoutBubble);
}

function displayDemoInfo(graphSample) {
    console.log(graphSample)
}