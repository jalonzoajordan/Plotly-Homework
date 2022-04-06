datapath = "samples.json"

function optionChanged(selection){
    //read the data and perform tasks
    d3.json(datapath).then((data) => {
        //Get the available IDs and add to dropdown
        data.metadata.forEach(item => {
            d3.select ("#selDataset").append('option').attr('value', item.id).text(item.id);
        })

        //Build the bar chart
        //Get the chart values
        const sample = data.samples.filter(item => parseInt(item.id) == selection);
        values = sample[0].sample_values.slice(0,10);
        values = values.reverse();
        labels = sample[0].otu_ids.slice(0,10);
        labels = labels.reverse();
        hovertext = sample[0].otu_labels;
        hovertext = hovertext.reverse();

        //add the word OTU to the labels
        yLabels = labels.map(item => "OTU" + " " + item);

        //build the plotly bar trace and layout
        trace = {
            x: values,
            y: yLabels,
            type: 'bar',
            orientation: 'h',
            text: hovertext
        };

        //plot the bar chart
        Plotly.newPlot('bar', [trace], {responsive:true});

        //Build the bubble chart
        //create non-spliced lists of values
        bubbleVals = sample[0].sample_values;
        bubbleLabels = sample[0].otu_ids;
        
        //build the plotly bubble trace and layout
        bubbleTrace = {
            x: bubbleLabels,
            y: bubbleVals,
            mode: 'markers',
            text: hovertext,
            marker: {
                size: bubbleVals,
                color: bubbleLabels
            }
        };
        bubbleLayout = {
            title: 'Bubble Chart of Samples',
            xaxis: {title: 'OTU'},
            yaxis: {title: 'Samples Collected'},
            showlegend: false,
            height: 500,
            width: 1000
        };

        //plot the bubble chart
        Plotly.newPlot('bubble',[bubbleTrace], bubbleLayout);

        //Build the bonus Belly Button Chart

        //get the metadata as an object for easier use (moved from the demographic info to use in new chart)
        idData = data.metadata.filter(item=> (item.id == selection));

        //Mark the tag that will receive the gauge chart
        gaugeDiv = d3.select("#gauge");
        gaugeDiv.html("");

        //get the wash frequency
        freq = idData[0].wfreq;

        //build the trace
        gaugeTrace = {
            domain: {x: [0,1], y: [0,1]},
            value: freq,
            title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
            type: 'indicator',
            mode: 'gauge+number',
            gauge: {
                axis: {range: [0,9]},
                bar: {color: "#000000"},
                steps: [
                    {range: [0,1], color: "#f8f3ec"},
                    {range: [1,2], color: "#f4f1e5"},
                    {range: [2,3], color: "#e9e6ca"},
                    {range: [3,4], color: "#e5e7b3"},
                    {range: [4,5], color: "#d5e49d"},
                    {range: [5,6], color: "#b7cc92"},
                    {range: [6,7], color: "#8cbf88"},
                    {range: [7,8], color: "#8abb8f"},
                    {range: [8,9], color: "#85b48a"}
                ]
            }
        };

        //build the layout
        gaugeLayout = {
            width: 700,
            height: 350
        }

        //plot the gauge chart
        Plotly.newPlot('gauge',[gaugeTrace],gaugeLayout);

        //add the metadata to the demographic info
        //grab the class to update from index.html
        panelData = d3.select("#sample-metadata");
        panelData.html("");

        //loop through the idData and add to the panelData
        Object.entries(idData[0]).forEach(item => {
            panelData.append("p").text(item[0] +": " +item[1]);
        });
    })

}
//add default item to populate data
optionChanged(940);