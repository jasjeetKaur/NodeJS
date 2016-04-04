var fs=require('fs');
var readline=require('readline');
var rd=readline.createInterface({
    input: fs.createReadStream('dataFiles/WDI_Data.csv'),
    output: process.stdout,
    terminal:false
});
var newArray;
var flag=true;
var countryIndex,index2,indicatorIndex,index4,yearIndex;
var gdp=0,gni=0,sortingFlag=0;
var gdpGniObject, finalObject,gdpGniArray=[];
var countryArray=[];
var lineArray,splitArray;
rd.on('line',function(line){
    newArray=line.toString().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    if(flag==true){
      for(var i=0;i<newArray.length;i++){
        if(newArray[i]=="Country Name"){
        countryIndex=i;
      }else if(newArray[i]=="Country Code"){
        index2=i;
      }else if(newArray[i]=="Indicator Name"){
        indicatorIndex=i;
      }else if(newArray[i]=="Indicator Code"){
        index4=i;
      }else if(newArray[i]==2005){
        yearIndex=i;
      }
    }//end loop
      countryFunction();
      flag=false;
      console.log(flag);
  }//  end if true condition
  else{

      if(newArray[indicatorIndex]=="GDP per capita (constant 2005 US$)"){
        for(var i=0;i<countryArray.length;i++){
          if(newArray[countryIndex]==countryArray[i]){
             gdp=newArray[yearIndex];
          }
        }//for loop
      }else if(newArray[indicatorIndex]=="GNI per capita (constant 2005 US$)"){
        for(var i=0;i<countryArray.length;i++){
          if(newArray[countryIndex]==countryArray[i]){
              gni=newArray[yearIndex];
          }
        }
      }

      if(gdp!=0 && gni!=0){
         gdpGniObject=new Object();
         gdpGniObject.countryName=newArray[countryIndex];
         gdpGniObject.gdp=parseFloat(gdp);
         gdpGniObject.gni=parseFloat(gni);
         finalObject=new Object();
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
   var finalData= gdpGniArray.slice(0,15);
   fs.writeFile('jsonFiles/GDP_Top15_Country2.json',JSON.stringify(finalData,null, 2));

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
        console.log(i);
    }
  }
});
};
