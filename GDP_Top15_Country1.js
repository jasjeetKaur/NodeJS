var fs=require('fs');
var readline=require('readline');
var rd=readline.createInterface({
    input: fs.createReadStream('dataFiles/WDI_Data.csv'),
    output: process.stdout,
    terminal:false
});
var arr;
var flag=true;
var countryIndex,indicatorIndex,yearIndex;
var gdp=0,gni=0,sortingFlag=0;
var gdpGniObject, finalObject,gdpGniArray=[];
var countryArray=[];
var lineArray,splitArray;
rd.on('line',function(line){
    arr=line.toString().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if(flag==true){
      for(var i=0;i<arr.length;i++){
        if(arr[i]=="Country Name"){
        countryIndex=i;
      }else if(arr[i]=="Indicator Name"){
        indicatorIndex=i;
      }else if(arr[i]==2005){
        yearIndex=i;
      }
    }
      countryFunction();
      flag=false;
      console.log(flag);
  }
  else{
      if(arr[indicatorIndex]=="GDP at market prices (constant 2005 US$)"){
        for(var i=0;i<countryArray.length;i++){
          if(arr[countryIndex]==countryArray[i]){
             gdp=arr[yearIndex];
          }
        }
      }else if(arr[indicatorIndex]=="GNI (constant 2005 US$)"){
        for(var i=0;i<countryArray.length;i++){
          if(arr[countryIndex]==countryArray[i]){
              gni=arr[yearIndex];
          }
        }
      }

      if(gdp!=0 && gni!=0){
         gdpGniObject=new Object();
         gdpGniObject.country=arr[countryIndex];
         gdpGniObject.gdp=parseFloat(gdp);
         gdpGniObject.gni=parseFloat(gni);
         gdpGniArray.push(gdpGniObject);
         gdp=0;
         gni=0;
         }
   }
});
rd.on('close',function(){
     sorting(gdpGniArray,'gdp')
     function sorting(a, par)
      {
      var swapped;
      do {
        swapped = false;
        for (var i = 0; i < a.length - 1; i++) {
            if (a[i][par] < a[i + 1][par]) {
                var temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }
      } while (swapped);
    }

    console.log(gdpGniArray);
   var finalData=gdpGniArray.slice(0,15);
   fs.writeFile('jsonFiles/GDP_Top15_Country1.json',JSON.stringify(finalData,null, 2));

});
var countryFunction=function(){
fs.readFile('dataFiles/Countries-Continents-csv.csv',function(err,data){
  if(err){
    console.log(err);
  }else{
     lineArray=data.toString().split("\n");
     for(var i=0;i<lineArray.length;i++){
        splitArray=lineArray[i].toString().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        countryArray[i]=splitArray[1];
        //console.log(i);
    }
  }
});
};
