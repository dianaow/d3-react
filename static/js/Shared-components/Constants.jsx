import { scaleOrdinal } from 'd3-scale';

export const width = 1400
export const height = 550

export const wrapper = { width: 1400, height: 550 }
export const margins = { top: 60, right: 0, bottom: 0, left: 80 }
export const svgDimensions = { width: wrapper.width - margins.left - margins.right, 
                    		   height: wrapper.height - margins.top - margins.bottom}

export const teamColors =   [{id:1, key: "ferrari", value: "#DC0000"},
		                     {id:2, key: "mercedes", value: "#01d2be"},
		                     {id:3, key: "red_bull", value: "#223971"},
		                     {id:4, key: "force_india", value: "#F595C8"},
		                     {id:5, key: "haas", value: "#828282"},
		                     {id:6, key: "mclaren", value: "#FF8700"},
		                     {id:7, key: "renault", value: "#FFD700"},
		                     {id:8, key: "sauber", value: "#9B0000"},
		                     {id:9, key: "toro_rosso", value: "#008CD1"},
		                     {id:10, key: "williams", value: "#004C6C"},
		                     {id:11, key: "manor", value: "#007AC0"}]


export const driverColors = [{id:1, driverRef: "vettel", constructorRef: "ferrari", season: 2016, value: "#DC0000"},
							 {id:2, driverRef: "vettel", constructorRef: "ferrari", season: 2017, value: "#DC0000"},
							 {id:3, driverRef: "vettel", constructorRef: "ferrari", season: 2018, value: "#DC0000"},
						     {id:4, driverRef: "raikkonen", constructorRef: "ferrari", season: 2016, value: "#DC0000"},
						     {id:5, driverRef: "raikkonen", constructorRef: "ferrari", season: 2017, value: "#DC0000"},
						     {id:6, driverRef: "raikkonen", constructorRef: "ferrari", season: 2018, value: "#DC0000"},
		                     {id:7, driverRef: "hamilton", constructorRef: "mercedes", season: 2016, value: "#01d2be"},
		                     {id:8, driverRef: "hamilton", constructorRef: "mercedes", season: 2017, value: "#01d2be"},
		                     {id:9, driverRef: "hamilton", constructorRef: "mercedes", season: 2018, value: "#01d2be"},
		                     {id:10, driverRef: "rosberg", constructorRef: "mercedes", season: 2016, value: "#60948F"},
		                     {id:11, driverRef: "bottas", constructorRef: "mercedes", season: 2017, value: "#60948F"},
		                     {id:12, driverRef: "bottas", constructorRef: "mercedes", season: 2018, value: "#60948F"},
		                     {id:13, driverRef: "ricciardo", constructorRef: "red_bull", season: 2016, value: "#004C6C"},
		                     {id:14, driverRef: "ricciardo", constructorRef: "red_bull", season: 2017, value: "#004C6C"},
		                     {id:15, driverRef: "ricciardo", constructorRef: "red_bull", season: 2018, value: "#004C6C"},
		                     {id:16, driverRef: "kvyat", constructorRef: "red_bull", season: 2016, value: "#506C78"},
		                     {id:17, driverRef: "verstappen", constructorRef: "red_bull", season: 2017, value: "#506C78"},
		                     {id:18, driverRef: "verstappen", constructorRef: "red_bull", season: 2018, value: "#506C78"},
		                     {id:19, driverRef: "sainz", constructorRef: "toro_rosso", season: 2016, value: "#008CD1"},
		                     {id:20, driverRef: "kvyat", constructorRef: "toro_rosso", season: 2017, value: "#008CD1"},
		                     {id:21, driverRef: "gasly", constructorRef: "toro_rosso", season: 2018, value: "#008CD1"},
		                     {id:22, driverRef: "verstappen", constructorRef: "toro_rosso", season: 2016, value: "#50849E"},
		                     {id:23, driverRef: "gasly", constructorRef: "toro_rosso", season: 2017, value: "#50849E"},
		                     {id:24, driverRef: "hartley", constructorRef: "toro_rosso", season: 2017, value: "#50849E"},
		                     {id:25, driverRef: "hartley", constructorRef: "toro_rosso", season: 2018, value: "#50849E"},
		                     {id:26, driverRef: "perez", constructorRef: "force_india", season: 2016, value: "#F595C8"},
		                     {id:27, driverRef: "perez", constructorRef: "force_india", season: 2017, value: "#F595C8"},
		                     {id:28, driverRef: "perez", constructorRef: "force_india", season: 2018, value: "#F595C8"},
		                     {id:29, driverRef: "ocon", constructorRef: "manor", season: 2016, value: "#171717"},
		                     {id:30, driverRef: "ocon", constructorRef: "force_india", season: 2017, value: "#AC889B"},
		                     {id:31, driverRef: "ocon", constructorRef: "force_india", season: 2018, value: "#AC889B"},
		                     {id:32, driverRef: "grosjean", constructorRef: "haas", season: 2016, value: "#828282"},
		                     {id:33, driverRef: "grosjean", constructorRef: "haas", season: 2017, value: "#828282"},
		                     {id:34, driverRef: "grosjean", constructorRef: "haas", season: 2018, value: "#828282"},
		                     {id:35, driverRef: "gutierrez", constructorRef: "haas", season: 2016, value: "#515151"},
		                     {id:36, driverRef: "magnussen", constructorRef: "renault", season: 2016, value: "#FFDD33"},
		                     {id:37, driverRef: "magnussen", constructorRef: "haas", season: 2017, value: "#515151"},
		                     {id:38, driverRef: "magnussen", constructorRef: "haas", season: 2018, value: "#515151"},
		                     {id:39, driverRef: "alonso", constructorRef: "mclaren", season: 2016, value: "#FF8700"},
		                     {id:40, driverRef: "alonso", constructorRef: "mclaren", season: 2017, value: "#FF8700"},
		                     {id:41, driverRef: "alonso", constructorRef: "mclaren", season: 2018, value: "#FF8700"},
		                     {id:42, driverRef: "vandoorne", constructorRef: "mclaren", season: 2016, value: "#BF6500"},
		                     {id:43, driverRef: "vandoorne", constructorRef: "mclaren", season: 2017, value: "#BF6500"},
		                     {id:44, driverRef: "vandoorne", constructorRef: "mclaren", season: 2018, value: "#BF6500"},
		                     {id:45, driverRef: "button", constructorRef: "mclaren", season: 2016, value: "#BF6500"},
		                     {id:46, driverRef: "ericsson", constructorRef: "sauber", season: 2016, value: "#9B0000"},
		                     {id:47, driverRef: "ericsson", constructorRef: "sauber", season: 2017, value: "#9B0000"},
		                     {id:48, driverRef: "ericsson", constructorRef: "sauber", season: 2018, value: "#9B0000"},
		                     {id:49, driverRef: "nasr", constructorRef: "sauber", season: 2016, value: "#8A5050"},
		                     {id:50, driverRef: "wehrlein", constructorRef: "sauber", season: 2017, value: "#8A5050"},
		                     {id:51, driverRef: "leclerc", constructorRef: "sauber", season: 2018, value: "#8A5050"},
		                     {id:52, driverRef: "massa", constructorRef: "williams", season: 2016, value: "#004C6C"},
		                     {id:53, driverRef: "massa", constructorRef: "williams", season: 2017, value: "#506C78"},
		                     {id:54, driverRef: "sirotkin", constructorRef: "williams", season: 2018, value: "#506C78"},
		                     {id:55, driverRef: "bottas", constructorRef: "williams", season: 2016, value: "#506C78"},
		                     {id:56, driverRef: "stroll", constructorRef: "williams", season: 2017, value: "#506C78"},
		                     {id:57, driverRef: "stroll", constructorRef: "williams", season: 2018, value: "#506C78"},
		                     {id:58, driverRef: "palmer", constructorRef: "renault", season: 2016, value: "#AFA363"},
		                     {id:59, driverRef: "sainz", constructorRef: "renault",season: 2017, value: "#AFA363"},
		                     {id:60, driverRef: "sainz", constructorRef: "renault",season: 2018, value: "#AFA363"},
		                     {id:61, driverRef: "hulkenberg", constructorRef: "force_india",season: 2016, value: "#AC889B"},
		                     {id:62, driverRef: "hulkenberg", constructorRef: "renault",season: 2017, value: "#FFDD33"},
		                     {id:63, driverRef: "hulkenberg", constructorRef: "renault",season: 2018, value: "#FFDD33"},
		                     {id:64, driverRef: "haryanto", constructorRef: "manor",season: 2016, value: "#171717"},
		                     {id:65, driverRef: "wehrlein", constructorRef: "manor",season: 2016, value: "#515151"},
		                     ]


export const driver_2016_1 = ["vettel", "hamilton", "ricciardo", "perez", "grosjean", "alonso", "ericsson", "massa", "palmer", "wehrlein", "verstappen"]
export const driver_2016_2 = ["raikkonen", "rosberg", "kvyat", "hulkenberg", "gutierrez", "button", "nasr", "bottas", "magnussen", "ocon", "haryanto", "vandoorne", "sainz"]
export const driver_2017_1 = ["vettel", "hamilton", "ricciardo", "perez", "grosjean", "alonso", "ericsson", "massa", "sainz", "gasly"]
export const driver_2017_2 = ["raikkonen", "bottas", "kvyat", "verstappen", "ocon", "magnussen", "vandoorne", "wehrlein", "stroll", "hulkenberg", "hartley"]
export const driver_2018_1 = ["vettel", "hamilton", "ricciardo", "perez", "grosjean", "alonso", "ericsson", "stroll", "sainz", "gasly"]
export const driver_2018_2 = ["raikkonen", "bottas", "verstappen", "verstappen", "ocon", "magnussen", "vandoorne", "leclerc", "sirotkin", "hulkenberg"]

// SCALES
export const driverColorScale = scaleOrdinal()
				                    .domain(driverColors.map(d => d.id))
				                    .range(driverColors.map(d => d.value))

export const colorScale = scaleOrdinal()
							.domain(teamColors.map(d => d.key))
                        	.range(teamColors.map(d => d.value))

// STYLES
export const textStyle = {
  textAnchor: 'middle',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: '1.4rem'
} 

export const legendStyle = {
  textAlign: 'left',
  fontSize: '1rem'
} 

export const topLegendStyle = {
  color: '#d3d3d3',
  fontSize: '0.8em',
  padding: '10px'
} 

export const headerStyle = {
  textAlign: 'left',
  fontWeight: 'bold',
  minWidth: '350px'
}

// FUNCTIONS
export const formatDriverNames = (e) => {
  if(e.includes("_")){
    return e.split("_")[1]
  } else {
    return e
  }
}

export const name_shortform = (n) => {
	if(n === 'magnussen'){
	  return 'kmag'
	} else if (n === 'hulkenberg'){
	  return 'hulk'
	} else if (n === 'grosjean') {
	  return 'grosj'
	} else if (n === 'raikkonen') {
	  return 'kimi'
	} else {
	  return n
	}
}

export const status_shortform = (e) => {
    if(e != "Finished" && e != "+1 Lap" && e != "+2 Laps" && e != "+3 Laps"  && e != "+4 Laps" ){
      return e.substring(0,3).toUpperCase()
    } else {
      return ""
    }
}

export const toaddStroke = (d, s) => {
  if (s == 2016) {
    if (driver_2016_1.includes(d)) {
      return true
    } else if (driver_2016_2.includes(d)) {
      return false
    }
  } else if (s == 2017) {
    if (driver_2017_1.includes(d)) {
      return true
    } else if (driver_2017_2.includes(d)) {
      return false
    }      
  } else if (s == 2018) {
    if (driver_2018_1.includes(d)) {
      return true
    } else if (driver_2018_2.includes(d)) {
      return false
    }      
  }
}

export const filterAndSort = (selectedRace, selectedSeason, data, sort_value) => {

  var filtered =  data.filter(d => (d.raceName === selectedRace.raceName && d.season === selectedSeason.season))
  
  filtered.forEach((d,i) => {
		filtered[i].driverRef = name_shortform(formatDriverNames(d.driverRef))
	})
	
  if (sort_value != ""){
		filtered.sort((a, b) => { return (a[sort_value]) - (b[sort_value]) })
  }
  
return filtered
}

export const filterAndSortSeason = (selectedSeason, data, sort_value) => {
  
  var filtered = data.filter(d => ( d.season === selectedSeason.season))

  filtered.forEach((d,i) => {
		filtered[i].driverRef = name_shortform(formatDriverNames(d.driverRef))
	})
	
  if (sort_value != ""){
		filtered.sort((a, b) => { return (a[sort_value]) - (b[sort_value]) })
  }
  
return filtered
}

export const sortOn = (property) => {
    return function(a, b){
        if(a[property] < b[property]){
            return -1;
        }else if(a[property] > b[property]){
            return 1;
        }else{
            return 0;   
        }
    }
}
