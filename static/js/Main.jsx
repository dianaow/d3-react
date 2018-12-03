import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MainDashboard from './views/MainDashboard'
import LaptimesScatter from './views/LaptimesScatter'
import ResultsBar from './views/ResultsBar'
import About from './views/About'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={MainDashboard}/>
      <Route path='/about' component={About}/>
      <Route path='/laptimes-beeswarmplot' component={MainDashboard}/>
      <Route path='/laptimes-scatterplot' component={LaptimesScatter}/>
      <Route path='/results-barchart' component={ResultsBar}/>
    </Switch>
  </main>
)

export default Main
