import React, { Component } from 'react';

class About extends Component {

  render() {

	  const moveimage = {
		    position: "relative",
		    top: "-40px",
		    paddingRight: "10px"
		}

	  return (
	    <React.Fragment>
	  	  <div className="dd-wrapper">
			  <div className="About">
			  	<p> Frontend Stack </p>
			  	<i className="devicon-javascript-plain colored"></i>
			  	<i className="devicon-d3js-plain colored"></i>
			  	<i className="devicon-react-original-wordmark colored"></i>
			  	<i className="devicon-webpack-plain-wordmark colored"></i>
			  	<i className="devicon-babel-plain colored"></i>
			  	<i className="devicon-bootstrap-plain-wordmark colored"></i>
			  	<p> Backend Stack </p>
			  	<i className="devicon-python-plain-wordmark colored"></i>
			  	<i className="devicon-postgresql-plain-wordmark colored"></i>
			  	<i className="devicon-redis-plain-wordmark colored"></i>
			  	<img style={moveimage} src='http://flask.pocoo.org/static/logo/flask.svg' height="80" />
			  	<img style={moveimage} src='http://www.celeryproject.org/static/img/logo.png' height="50" />
			  	<p> Production Stack </p>
			  	<i className="devicon-express-original-wordmark colored"></i>
			  	<i className="devicon-docker-plain-wordmark colored"></i>
			  	<i className="devicon-amazonwebservices-plain-wordmark colored"></i>
			  </div>
		  </div>
		</React.Fragment>
	  )
  }
}

export default About;