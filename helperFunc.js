//standardize city formatting
const titleCityFormat = (city) =>{
    return city[0].toUpperCase()+(city.split('').splice(1, city.length-1).join('').toLowerCase());
}

const findThreeBest = ({...dataObj}, recentArray) =>{
    //edit copy of dataObj so factors in recent queries
      recentArray?.forEach((key)=>{
        dataObj[key] = dataObj[key] + 5
      })
    //object --> array structure
      let cityListArray = []
      for (let key in dataObj){
        cityListArray.push([key, dataObj[key]])
      }
    //sort nested array
    cityListArray = cityListArray?.sort((a,b) => b[1]-a[1])
    console.log(cityListArray)
  
    //access first element every list
    return cityListArray?.splice(0,3).map((rawr)=> rawr[0])
      
}

const funcGateway = {
    titleCityFormat:titleCityFormat,
    findThreeBest:findThreeBest
}


module.exports = funcGateway;