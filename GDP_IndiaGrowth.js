var fs=require('fs');
var readline=require('readline');

var dataReader=readline.createInterface({
  input: fs.createReadStream('dataFiles/WDI_Data.csv'),
  output:process.stdout,
  terminal: false
});


var year=0;
var startYear, endYear;
var arr=[];
var countryIndex,indicatorIndex;
var growthPerYear;

dataReader.on('line',function(line){
  arr=line.toString().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  if (year==0) {
    startYear=line.toString().split(',').indexOf('1960');
    endYear=line.toString().split(',').indexOf('2015');
    console.log(startYear+" "+endYear);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]=="Country Name") {
        countryIndex=i;
      } else if (arr[i]=="Indicator Name") {
        indicatorIndex=i;
      }
    }
    year=1;
    console.log(year);
  } else {
    if (arr[countryIndex]=="India") {
      if (arr[indicatorIndex]=="GDP growth (annual %)") {
        growthPerYear=[];
        for (var j = startYear,k = 0; j <= endYear; j++,k++) {
          if (arr[j]==0) {
            arr[j]=0;
          }
          var dataObj = new Object();
          dataObj.year=1960+k;
          dataObj.valueOfYear=arr[j];
          growthPerYear.push(dataObj);
        }
        console.log(growthPerYear);
        //fs.writeFile('GDP_India.json',JSON.stringify(growthPerYear,null,2);
      }
    }
  }
});

dataReader.on('close',function(){
   fs.writeFile('jsonFiles/indiaGrowth.json',JSON.stringify(growthPerYear,null,2));
});
