// populate drop down options
d3.json("/data/samples.json").then(function(data) {
    var options = data.names;

    options.forEach(option => {
        d3.select("#selDataset").append("option").text(`${option}`)
    });

    // display inital graphs with id 940 (first option)
    var firstOption = "940";
    graphTopOsu(data.samples.filter(sample => sample.id === firstOption)[0]);
    graphBubble(data.samples.filter(sample => sample.id === firstOption)[0]);
    displayDemoInfo(data.metadata.filter(meta => meta.id === parseInt(firstOption))[0]);
});

// when an ID is chosen, display all graphs and information
function optionChanged(selectedId) {
    d3.json("/data/samples.json").then(function(data) {
        // grab samples
        var samples = data.samples;
        var metaData = data.metadata
        
        // filter by desired sample
        var desiredSample = samples.filter(sample => sample.id === selectedId)[0];
        var desiredMeta = metaData.filter(meta => meta.id === parseInt(selectedId))[0];

        // plot OSU values with desired sample 
        graphTopOsu(desiredSample);

        // plot bubble chart
        graphBubble(desiredSample);

        // display demographic info
        displayDemoInfo(desiredMeta);
    });
}

function graphTopOsu(graphSample) {
    // grab top 10 OTU values
    var values = graphSample.sample_values.sort((a,b) => a < b).slice(0,10);
    
    // grab labels and tooltip for the top 10 OTU values
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

function displayDemoInfo(metaDisplay) {
    // select demogrpahic infomation box
    var demoInfo = d3.select("#sample-metadata");

    // empty box
    demoInfo.html("");

    // append paragraphs to display demographic information
    Object.entries(metaDisplay).forEach(([key,value]) => {
        demoInfo.append("p").text(`${key}: ${value}`);
    });
}