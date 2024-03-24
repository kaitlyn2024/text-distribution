var svgPie, gPie, svgBar, gBar, gBarToolTip, taInput, sInput, cnText, ccText;
var tooltipSize=[100, 50];
var tooltipOffset=[5, -5];

typeCount=[
    {type: "Constants", count: 0},
    {type: "Vowels", count: 0},
    {type: "Punctuation", count: 0},
];
var alphabetCount = [
    {character: "a", count: 0, type: "Vowels"},
    {character: "b", count: 0, type: "Constants"},
    {character: "c", count: 0, type: "Constants"},
    {character: "d", count: 0, type: "Constants"},
    {character: "e", count: 0, type: "Vowels"},
    {character: "f", count: 0, type: "Constants"},
    {character: "g", count: 0, type: "Constants"},
    {character: "h", count: 0, type: "Constants"},
    {character: "i", count: 0, type: "Vowels"},
    {character: "j", count: 0, type: "Constants"},
    {character: "k", count: 0, type: "Constants"},
    {character: "l", count: 0, type: "Constants"},
    {character: "m", count: 0, type: "Constants"},
    {character: "n", count: 0, type: "Constants"},
    {character: "o", count: 0, type: "Vowels"},
    {character: "p", count: 0, type: "Constants"},
    {character: "q", count: 0, type: "Constants"},
    {character: "r", count: 0, type: "Constants"},
    {character: "s", count: 0, type: "Constants"},
    {character: "t", count: 0, type: "Constants"},
    {character: "u", count: 0, type: "Vowels"},
    {character: "v", count: 0, type: "Constants"},
    {character: "w", count: 0, type: "Constants"},
    {character: "x", count: 0, type: "Constants"},
    {character: "y", count: 0, type: "Vowels"},
    {character: "z", count: 0, type: "Constants"},
    {character: ".", count: 0, type: "Punctuation"},
    {character: "?", count: 0, type: "Punctuation"},
    {character: "!", count: 0, type: "Punctuation"},
    {character: ",", count: 0, type: "Punctuation"},
    {character: ";", count: 0, type: "Punctuation"},
    {character: ":", count: 0, type: "Punctuation"},
];

//bar

//pie
var color = d3.scaleOrdinal(d3.schemeSet2);
var outerPieRadius=150;
var innerPieRadius=outerPieRadius*.7;

//both
var margin, innerWidth, innerHeight;

// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
    //get svg and input by id
    svgPie=d3.select("#pie_svg");
    svgBar=d3.select("#bar_svg");
    taInput = d3.select('#textarea_input');
    sInput = d3.select('#sumbit_input');
    cnText=d3.select('#character_name');
    ccText=d3.select('#character_count');
    
    //get width & height
    svgWidth = +svgPie.style('width').replace('px', '');
    svgHeight = +svgPie.style('height').replace('px', '');

    //set margin
    margin = {top: 80, bottom: 80, right: 80, left: 80};

    //set inner width
    innerWidth=svgWidth-margin.left-margin.right;
    innerHeight=svgHeight-margin["top"]-margin["bottom"];

    gPie = svgPie.append('g')
    .attr('transform', 'translate('+margin.left+', '+margin.top+')');
    gBar = svgBar.append('g')
    gBarToolTip = svgBar.append('g')
    .attr('transform', 'translate('+margin.left+', '+margin.top+')');

    submitText();
 });
 
 
function submitText(){
    taInputString = taInput.property("value");
    //reset bar
    clearBarChart();
    //reset pie
    setAlphabetCountZero();
    updateAlphabetCount();

    updateGraph();
}
function updateGraph(){
    updatePieGraph();
}

function updatePieGraph(){
    var arc = d3.arc()
        .innerRadius(innerPieRadius)
        .outerRadius(outerPieRadius);

    var pie = d3.pie()
        .value(function (d) {return d.count})
        .sort(null);
    var path = gPie
        .selectAll('paths')
        .data(pie(typeCount))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i){
            return color(d.data.type);
        })
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr('transform', 'translate('+innerWidth/2+', '+innerHeight/2+')')
        .on('mouseover', function(d, i) {
            d3.select(this).attr("stroke-width", "4px");
            gPie.append("text")
            .text(i.data.type+": "+i.data.count)
            .attr("x", innerWidth/2)
            .attr("y", innerHeight/2)
            .attr ("text-anchor", "middle");
        })
        .on('mouseout', function() {
            d3.select(this).attr("stroke-width", "1px");
            gPie.selectAll("text").remove();
        })
        .on('click', function(d, i) {
            updateBarGraph(i.data.type, i.data.count);
        });
}
function updateBarGraph(type, count){
    clearBarChart();
    
    var typeCount=getTypeCount(type);
    var maxCount=d3.max(typeCount, function(d) {  return d.count+1; });
    const xScale = d3.scaleBand()
        .domain(typeCount.map(function(d) { return d.character;}))
        .range([0, innerWidth])
        .padding(0.2);
    
    const yScale = d3.scaleLinear()
        .domain([0, maxCount])
        .range([innerHeight, 0]);
    
        //alert(maxCount);
    var tooltip, tooltipCount, tooltipCharacter, mPosition;
    var barChart = gBar.selectAll('rect')
        .data(typeCount)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.character))
        .attr('y', d=>yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', function(d) {
            return  innerHeight- yScale(d.count);
        })
        .attr("fill", d => color(d.type))
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .on('mouseover', function(d, i) {
            mPosition=d3.pointer(d);

            ccText.text(i.count);
            cnText.text("'"+i.character+"'");

            tooltip=gBar.append('rect')
                .attr('x', mPosition[0]+tooltipOffset[0])
                .attr('y', mPosition[1]-tooltipSize[1]+tooltipOffset[1])
                .attr('width', tooltipSize[0])
                .attr('height', tooltipSize[1])
                .attr('stroke', 'black')
                .attr('fill', 'white');

            tooltipCount=gBar.append('text')
                .attr('x', mPosition[0]+tooltipOffset[0]*2)
                .attr('y', mPosition[1]+10)
                .text('Count: '+i.count);
            tooltipCharacter=gBar.append('text')
                .attr('x', mPosition[0]+tooltipOffset[0]*2)
                .attr('y', mPosition[1]+10)
                .text('Character: '+i.character);
            
        })
        .on('mousemove',  function(d, i) {
            mPosition=d3.pointer(d);
            tooltip
                .attr('x', mPosition[0]+tooltipOffset[0])
                .attr('y', mPosition[1]-tooltipSize[1]+tooltipOffset[1]);
            tooltipCount
                .attr('x', mPosition[0]+tooltipOffset[0]*2)
                .attr('y', mPosition[1]-tooltipSize[1]-3*tooltipOffset[1]);
            tooltipCharacter
                .attr('x', mPosition[0]+tooltipOffset[0]*2)
                .attr('y', mPosition[1]-tooltipSize[1]-7*tooltipOffset[1]);
        })
        .on('mouseout',  function(d, i) {
            ccText.text("NONE");
            cnText.text("SELECTED CHARACTER");

            tooltip.remove();
            tooltipCount.remove();
            tooltipCharacter.remove();
        })
    //ccText.text(count);
    const xAxis = d3.axisBottom(xScale);
    gBar.append('g').call(xAxis)
    .attr("transform", "translate(0," + innerHeight + ")");
    const yAxis = d3.axisLeft(yScale);
    gBar.append('g').call(yAxis);
}



function setAlphabetCountZero(){
    for(let i=0; i<alphabetCount.length; i++){
        alphabetCount[i].count=0;
    }
    for(let i=0; i<typeCount.length; i++){
        typeCount[i].count=0;
    }
}
function updateAlphabetCount(){
    for(let i = 0; i<taInputString.length; i++){
        for(let j=0; j<alphabetCount.length; j++){
            if(taInputString[i].toLowerCase()==alphabetCount[j].character){
                alphabetCount[j].count++;
                if(alphabetCount[j].type=="Constants"){
                    typeCount[0].count++;
                }else if(alphabetCount[j].type=="Vowels"){
                    typeCount[1].count++;
                }else{
                    typeCount[2].count++;
                }
                break;
            } 
        }
    }
}

function clearBarChart(){
    ccText.text("NONE");
    svgBar.selectAll('g')
    .remove();
    gBar = svgBar.append('g')
    .attr('transform', 'translate('+margin.left+', '+margin.top+')');
}
function getTypeCount(type){
    if(type=="Constants"){
        return [
            alphabetCount[1], 
            alphabetCount[2],
            alphabetCount[3],
            alphabetCount[5],
            alphabetCount[6],
            alphabetCount[7],
            alphabetCount[9],
            alphabetCount[10],
            alphabetCount[11],
            alphabetCount[12],
            alphabetCount[13],
            alphabetCount[15],
            alphabetCount[16],
            alphabetCount[17],
            alphabetCount[18],
            alphabetCount[19],
            alphabetCount[21],
            alphabetCount[22],
            alphabetCount[23],
            alphabetCount[25],
        ];
    }else if(type=="Vowels"){
        return [
            alphabetCount[0],
            alphabetCount[4],
            alphabetCount[8],
            alphabetCount[14],
            alphabetCount[20],
            alphabetCount[24]
        ];
        
    }else{
        return [
            alphabetCount[26], 
            alphabetCount[27],
            alphabetCount[28],
            alphabetCount[29],
            alphabetCount[30],
            alphabetCount[31],
        ];
    }
}