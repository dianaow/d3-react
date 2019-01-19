import React from 'react'
import { Switch, Route } from 'react-router-dom'
import LaptimesBeeswarm from './Components/Laptimes-BeeswarmPlot/main'
import LaptimesScatter from './Components/Laptimes-ScatterPlot/main'
import ResultsBar from './Components/Results-BarChart/main'
import SortedResultsBar from './Components/Results-Animation/main'
import Bubbles from './Components/Results-Bubbles/main'
import About from './Components/About'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Bubbles}/>
      <Route path='/about' component={About}/>
      <Route path='/laptimes-beeswarmplot' component={LaptimesBeeswarm}/>
      <Route path='/laptimes-scatterplot' component={LaptimesScatter}/>
      <Route path='/results-barchart' component={ResultsBar}/>
      <Route path='/results-animation' component={SortedResultsBar}/>
      <Route path='/results-bubbles' component={Bubbles}/>
    </Switch>
  </main>
)

export default Main
