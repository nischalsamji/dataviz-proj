(function(){

$('#age').slider({
    min: 16,
    max: 50,
    step: 1,
    animate: true,
    value: 16,
    slide:function(event,ui)
    {
        if((ui.value>=16) && (ui.value<= 24))
        {
            agerange = '16 - 24';
        }
        else if((ui.value>=25)&& (ui.value<= 29))
        {
            agerange = '25 - 29';
        }
        else if((ui.value>=30) && (ui.value<=39))
        {
            agerange = '30 - 39';
        }
        else if((ui.value>=40) && (ui.value<= 49))
        {
            agerange = '40 - 49';
        }
        else if(ui.value==50)
        {
            agerange = '50 +';
        }
        $('#age-value').html(agerange);
        $('#customer-age').val(agerange);
    }
});


var colors = {
"Academic" : "#AEC6E8",
"Action" : "#FF7D05",
"Anthropology" : "#FFBC76",
"Autobiography" : "#22A825",
"Biography" : "#97E087",
"Childrens" : "#DB2524",
"Christian" : "#F79C97",
"Classics" : "#C4AFD6",
"Contemporary" : "#925449",
"Culture" : "#C49C92",
"Economics" : "#E773C6",
"Fantasy" : "#F8B6D2",
"Fiction" : "#FFA500",
"History" : "#DAD996",
"Horror" : "#15C0CA",
"Humor" : "#CBFFFF",
"Literature" : "#1A79BD",
"Mystery" : "#AEC8E9",
"NonFiction" : "#FF7B0",
"Philosophy" : "#FFBB76",
"Plays" : "#389837",
"Poetry" : "#95E186",
"Politics" : "#CC292E",
"Psychology" : "#FF9996",
"Religion" : "#9764C3",
"Romance" : "#C7ADDC",
"Science" : "#8E5341",
"ScienceFiction" : "#C69B92",
"SequentialArt" : "#FBB4D2",
"ShortStories" : "#7E7E7E",
"Sociology" : "#BABF1D",
"Suspense" : "#BABC1B",
"Western" : "#DDDB84",
"YoungAdult" : "#9BDAE9"
}

var genre = d3.keys(colors)

  var svg = d3.select(".viz-main").append("svg")
    .attr("width", 900)
    .attr("height", 320)
    .attr("class", "bubble");

 var index = d3.select(".index-main").append("svg")
    .attr("width", 300)
    .attr("height", 360)
    .attr("class", "indexrect");

  var div = d3.select("body").append("div")   // declare the properties for the div used for the tooltips
    .attr("class", "tooltip")
    .attr("width", 120)
    .attr("height", 160)          // apply the 'tooltip' class
    .style("opacity", 0); 
    var myData = null;

   var  x = d3.time.scale().range([0, 1200]);
  var y = d3.scale.linear().range([300, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
  .orient("bottom").ticks(0);

var yAxis = d3.svg.axis().scale(y)
  .orient("right").ticks(0);

var drag = d3.behavior.drag()
              .on("dragstart", function() {
                  d3.event.sourceEvent.stopPropagation()
              })
              .on("drag", dragmove);

  d3.csv("bookdata.csv",function(error, bookdata){

    myData = bookdata;

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(20,300)")
    .style({ 'stroke': 'grey', 'fill': 'none', 'stroke-width': '2px'})
    .call(xAxis);


  

  // Add the Y Axis
  svg.append("g") 
    .attr("class", "y axis")
    .attr("transform", "translate(10,0)")
    .style({ 'stroke': 'grey', 'fill': 'none', 'stroke-width': '2px'})
    .call(yAxis);

  svg.append("text")
      .attr("x", 20)
      .attr("y", 20)
      .text("Highly Critically Acclaimed");
      
  svg.append("text")
      .attr("x", 20)
      .attr("y", 290)
      .text("Low Critically Acclaimed");

  svg.append("text")
      .attr("x", 780)
      .attr("y", 20)
      .text("High Popularity");

  svg.append("text")
      .attr("x", 780)
      .attr("y", 290)
      .text("Low Popularity");
     
      index.selectAll('.indexrect')
            .data(genre)
            .enter().append("g")
            .attr("class","indexitem")
            .append("rect")
            .attr("height", 15)
            .attr("width", 15)
            .attr("x", function(d, i){
              if(i < 17)
                return 10;
              else
                return 130 ;
            })
            .attr("y", function(d,i){ return (((i+1) % 17) * 20)})
            .style("fill", function(d,i){return colors[d]});

      var x = 0;
      index.selectAll('.indexitem')
            .data(genre)
            .append("text")
            .attr("x", function(d, i){
              if(i < 17)
                return 30;
              else
                return 150 ;
            })
            .attr("y", function(d,i){ 
              x = 0
              if(i == 0)
              {
                return 35;
              }
              else 
              return ( ((i % 17) * 20) + 35 )

            })
            .text( function(d,i){ return genre[i]})
            .on("click",function(d,i){
              text = genre[i];
              filterData(text);
            });

  function filterData(filterParam){
    myData = bookdata.filter(function(d){
      return d.genre === filterParam;
    });

    loadViz(myData);
  }
    
   
    loadViz(myData);

  });

function loadViz(bookdata){

var maxValue;
var minValue;


  var maxValue = d3.max(bookdata, function(d){
    return +d.reviews;
  });

  var minValue = d3.min(bookdata,function(d){
    return +d.reviews;
  });

  var scale = d3.scale.linear().domain([minValue, maxValue]).range([5, 35]);
  var xscale = d3.scale.linear().domain([1, 557]).range([800, 40]);
  var yscale = d3.scale.linear().domain([1, 557]).range([50, 250]);


  d3.selectAll('.book').remove();
  var node = svg.selectAll(".book")
          .data(bookdata)
          .enter().append("g")
          .append("circle")
          .attr("class","book")
          .attr("fill-opacity", 0.5)
          .attr("r",function(d) { return  scale(+d.reviews)})
          .attr("cx", function(d) {  return xscale(d.revRank); })
          .attr("cy", function(d) {  return yscale(d.ratRank); })
          .style("fill", function(d) { return colors[d.genre]; })
          .attr("stroke", function(d) { return colors[d.genre]; })
          .style("stroke-width", "2px")
          .style("stroke-opacity", 1)
          .on("mouseover", function( d, i) { 

            var rad = d3.select(this).attr("r");

                d3.selectAll(".book")
                    .transition()
                    .duration(200)      
                    .attr("fill-opacity", 0.3)
                    .style("stroke-opacity", 0.2);

                d3.select(this)
                    .transition()        
                    .duration(200)      
                    .attr("fill-opacity", 1)
                    .attr("r", rad * 1.25);

                div.transition()        
                    .duration(200)      
                    .style("opacity", .85); 
                var string = "<img class = " + "tooltip" + " src= " +"img/"+ d.imSource+ " />";
                div.html(string)
                .style("left", (d3.event.pageX - 34) + "px")
                .style("top", (d3.event.pageY - 12) + "px");

                })
          .on("mouseout", function(d,i){

            var rad = d3.select(this).attr("r");

            div.transition()        
                    .duration(200)      
                    .style("opacity", 0); 

            d3.selectAll(".book")
                    .transition()
                    .duration(200)      
                    .attr("fill-opacity", 0.5)
                    .style("stroke-opacity", 1)

            d3.select(this)
                    .transition()        
                    .duration(200)      
                    .attr("fill-opacity", 0.5)
                    .style("stroke-opacity", 1)
                    .attr("r", rad * 0.8);

          })
          .on("click", function(d){

            this_book = d;      

            d3.select('.reco1')
              .transition()
              .duration(12000)
              .attr("opacity", 1)
              .attr("src", function(d){


                var recoData = bookdata.filter(function(d){

                  return d.ids === this_book['sg1'] });
                console.log(recoData);
                return "img/" + recoData[0]['imSource'];


              });

            d3.select('.reco2')
              .attr("src",  function(d){



                var recoData = bookdata.filter(function(d){
                  return d.ids === this_book['sg2']
                });
                return "img/" + recoData[0]['imSource'];

              });
            d3.select('.reco3')
              .attr("src",  function(d){

                var recoData = bookdata.filter(function(d){
                  return d.ids === this_book['sg3']
                });
                return "img/" + recoData[0]['imSource'];

              });
            d3.select('.reco4')
              .attr("src",  function(d){

                var recoData = bookdata.filter(function(d){
                  return d.ids === this_book['sg4']
                });
                return "img/" + recoData[0]['imSource'];

              });

            recoData = [];
            d3.select('.reco')
              .transition()
              .duration(1000)
              .style("visibility", "visible");
              



          });
}

// var line = svg.append("line")
//             .style("stroke", "black")
//             .attr("x1", 150)
//             .attr("y1", 100)
//             .attr("x2", 250)
//             .attr("y2", 300);

function dragmove(d) {
              var x = d3.event.x;
              var y = d3.event.y;
              d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
              if(d3.select(this).attr("class") == "first") {
                line.attr("x1", x);
                line.attr("y1", y);
              } else {
                line.attr("x2", x);
                line.attr("y2", y);
              }
          }

   //basic map config with custom fills, mercator projection
      var map = new Datamap({
        scope: 'world',
        element: document.getElementById('container1'),
        projection: 'mercator',
        height: 200,
        fills: {
          defaultFill: '#f0af0a',
          lt50: 'rgba(0,244,244,0.9)',
          gt50: 'red'
        },
        
                done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(myData) {
                alert(myData);
            });
        },

        data: {
          USA: {fillKey: 'lt50' },
          RUS: {fillKey: 'lt50' },
          CAN: {fillKey: 'lt50' },
          BRA: {fillKey: 'gt50' },
          ARG: {fillKey: 'gt50' },
          COL: {fillKey: 'gt50' },
          AUS: {fillKey: 'gt50' },
          ZAF: {fillKey: 'gt50' },
          IND: {fillKey: 'lt50' },
          MAD: {fillKey: 'gt50' }       
        }
      })
      
})();