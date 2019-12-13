import React, { Component } from 'react';
import ApiManager from '../../modules/ApiManager';


export default class UsersDetail extends Component {

  state = {
      name: "",
      instrument: "",
      setlist: "",
      loadingStatus: true
  } 

  componentDidMount(){

    //http://localhost:5002/users/1?_embed=setlists&_expand=instruments
    //get(id) from AnimalManager and hang on to the data; put it into state
    ApiManager.get("users", this.props.matchId, "_embed=setlists&_expand=instrument" )
    .then((user) => {
      console.log(user)
      this.setState({
        name: user.name,
        instrument: user.instrument.instrumentName,
        setlist: "user.setlist",
        loadingStatus: false
      });
    });
  }

//   handleDelete = () => {
//     //invoke the delete function in AnimalManger and re-direct to the animal list.
//     this.setState({loadingStatus: true})
//     APIManager.delete("animals", this.props.animalId)
//     .then(() => this.props.history.push("/animals"))
// }

  render() {
    return (
      <div className="card">
        <div className="card-content">
          <picture>
            <img src={`https://robohash.org/${this.state.name}`} alt="Current User" />
          </picture>
            <h3>Name: {this.state.name}</h3>
            <p>Instrument: {this.state.instrument}</p>
            <button type="button" disabled={this.state.loadingStatus}>Add Buddy</button>
            <button type="button" disabled={this.state.loadingStatus}>Remove Buddy</button>
        </div>
      </div>
    );
  }
}
