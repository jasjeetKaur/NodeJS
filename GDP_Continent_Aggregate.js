var fs=require('fs');
var readline=require('readline');

var read=readline.createInterface({
  input: fs.createReadStream('dataFiles/WDI_Data.csv'),
  output: process.stdout,
  terminal: false
});

var flag=true;
var newArray,aggregateArray=[];
var index1,index2,startIndex,endIndex;
var countryObject,aggregateObject;
var sum=0;
var continentArray=['Asia','Europe','Africa','Oceania','North America','South America','Australia'];
read.on('line',function(line){
  newArray=line.toString().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  if(flag==true){
     startIndex = line.toString().split(',').indexOf('1960');
     endIndex = line.toString().split(',').indexOf('2015');
     for(var i=0;i<newArray.length;i++){
      if(newArray[i]=="Country Name"){
        index1=i;
      }else if(newArray[i]=="Indicator Name"){
      index2=i;
     }
   }
    continentCountryFunction();
    flag=false;
    console.log(startIndex+"    "+endIndex);
 }
 else{
    if(newArray[index2]=="GDP per capita (constant 2005 US$)"){
      for(var k=0;k<continentCountryArray.length;k++){
        countryObject=new Object();
        countryObject=continentCountryArray[k];
        if(countryObject.country==newArray[index1]){
        //  console.log(countryObject.continent);
          aggregateObject=new Object();
          aggregateObject.continent=countryObject.continent;
          for(var i=startIndex;i<=endIndex;i++){
            if(newArray[i]==0){
              newArray[i]=0;
            }
            var d=parseInt(newArray[i]);
            sum=sum+d;
          }
        //  console.log(sum);
          aggregateObject.sum=sum;
          aggregateArray.push(aggregateObject);
          sum=0;
        }
      }
    }
 }
});
read.on('close',function(){
  var add=0,count=0,avg;
  var finalObject,finalArray=[];
  for(var k=0;k<continentArray.length;k++){
       var continent=continentArray[k];
       for(var i=0;i<aggregateArray.length;i++){
         aggregateObject=new Object();
         aggregateObject=aggregateArray[i];
         if(continent==aggregateObject.continent){
             add=add+aggregateObject.sum;
       }
  }
   finalObject=new Object();
   finalObject.continent=continent;
   finalObject.aggregate=add;
   finalArray.push(finalObject);
   add=0;
   count=0;
}
     console.log(finalArray);
     fs.writeFile('jsonFiles/GDP_Continent_Aggregate.json',JSON.stringify(finalArray,null, 2));
});
var obj;
var array,lineArray;
var continentCountryArray=[];
var continentCountryFunction=function(){
  fs.readFile('dataFiles/Countries-Continents-csv.csv',function(err,data){
    array=data.toString().split("\n");
     for(var i=0;i<array.length;i++){
       lineArray=array[i].toString().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
       obj=new Object();
       obj.continent=lineArray[0];
       obj.country=lineArray[1];
       continentCountryArray.push(obj);
     }
    //console.log(continentCountryArray);
  });
}
