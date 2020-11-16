import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css';

import axios from 'axios';

class AdminPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            user: '',
            pass: '',
        }
    }
    handleUsername = (e) => {this.setState({user: e.target.value})};
    handlePassword = (e) => {this.setState({pass: e.target.value})};

    handleSubmit = async () => {
      const body = {
          username: this.state.user,
          password: this.state.pass
      };

      try {
        const res = await axios.post('/adminLogin', body);
        axios.defaults.headers.common = {'authorization': `Bearer ${res.data.token}`};
        const resQ = await axios.post('/adminQuery', {});

        this.setState({token: res.data.token, data: resQ.data});
        console.log(resQ.data)
      }
      catch (e) {
          if(e.response.status === 401){
              alert('Invalid username or password');
          }
          console.log(e)
      }

    };

    topFive = () => {
        let map = {};
        for(let i=0; i<this.state.data.length; i++){
            if (map[this.state.data[i].ingredient] === undefined) {
                map[this.state.data[i].ingredient] = 1
            } else {
                map[this.state.data[i].ingredient] += 1
            }
        }

        let sortable = [];
        for(let ing in map) {
            sortable.push([ing, map[ing]]);
        }

        sortable.sort((a,b) => { return b[1]-a[1]});

        return sortable.slice(0,5);
    };

    totalMoneyTime = () => {
        let money = 0;
        let time = 0;
        for(let i=0; i<this.state.data.length; i++){
            money += this.state.data[i].price;
            time += this.state.data[i].duration;
        }

        return {money, time};
    };

    renderLogin = () => {
        return (
            <div className="card" style={{"maxWidth": "50%", "marginLeft": "25%", "marginRight": "25%"}}>
                <div className="card-body">
                    <form className="d-flex flex-column justify-content-center">
                        <div className="form-group">
                            <label htmlFor="Email1">Name</label>
                            <input className="form-control" id="Email1" placeholder="Enter name"
                                   onChange={this.handleUsername}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Password1">Password</label>
                            <input type="password" className="form-control" id="Password1"
                                   placeholder="Password" onChange={this.handlePassword}/>
                        </div>
                        <div className="btn btn-primary" onClick={this.handleSubmit}>
                            Submit
                        </div>
                    </form>
                </div>
            </div>
        )
    };

    renderPanel = () => {
        const top5 = this.topFive().map(x => x[0]);
        const {money, time} = this.totalMoneyTime();

        return (
            <div>
                <div className="card" >
                    <div className="card-body d-flex flex-column justify-content-around">
                        <div className="d-flex justify-content-between">
                            <div className='card d-inline p-2 bg-dark text-white'>Top 5 ingredients: </div>
                            {top5.map((e,i) => {
                                    return (
                                        <div key={i} className='card d-inline p-2 bg-primary text-white'>{e}</div>
                                    )
                            })}
                        </div>
                        <br/>
                        <div className="d-flex justify-content-between">
                            <div className='card d-inline p-2 bg-dark text-white'>Money earned: </div>
                            <div className='card d-inline p-2 bg-primary text-white'>{money}$</div>
                        </div>
                        <br/>
                        <div className="d-flex justify-content-between">
                            <div className='card d-inline p-2 bg-dark text-white'>Time spent: </div>
                            <div className='card d-inline p-2 bg-primary text-white'>{time/1000} seconds</div>
                        </div>
                    </div>
                </div>
                <br/>

                <div className='card d-inline-flex p-2 bg-dark text-white'>History:</div>
                <br/>
                <br/>
                <div >
                {this.state.data.map((e, i) => {
                    return(
                        <div key={e._id} className='card' style={{'width': '40%', 'marginLeft': '20%', 'marginBottom': '5%'}}>
                            <div className='card-body'>
                                <p>Order: {e.size} pizza</p>
                                <p>Ingredient: {e.ingredient}</p>
                                <p>Price: {e.price}$</p>
                                <p>Name: {e.name}</p>
                                <p>Telephone: {e.telephone}</p>
                                <p>Address: {e.address}</p>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
        )
    };

    render() {
        return (
            <div className='container '>
                <br/>
                {this.state.token ? this.renderPanel() : this.renderLogin()}
            </div>
        );
    }
}

export default AdminPanel;
