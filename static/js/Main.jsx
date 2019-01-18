import React from 'react'
import { Switch, Route } from 'react-router-dom'
import LaptimesBeeswarm from './views/LaptimesBeeswarm'
import LaptimesScatter from './views/LaptimesScatter'
import ResultsBar from './views/ResultsBar'
import AllSortedResultsBar from './views/AllSortedResultsBar'
import Bubbles from './views/Bubbles'
import About from './views/About'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Bubbles}/>
      <Route path='/about' component={About}/>
      <Route path='/laptimes-beeswarmplot' component={LaptimesBeeswarm}/>
      <Route path='/laptimes-scatterplot' component={LaptimesScatter}/>
      <Route path='/results-barchart' component={ResultsBar}/>
      <Route path='/animation' component={AllSortedResultsBar}/>
      <Route path='/bubbles' component={Bubbles}/>
    </Switch>
  </main>
)

export default Main
