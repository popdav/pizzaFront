import React, { Component } from 'react';
import { Line } from 'rc-progress';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css';
import axios from 'axios';

class PizzaForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ingredients: [],
            prices: [{price: 200, time: 1000, type:'small'},
                {price: 400, time: 2000, type: 'medium'}, {price: 600, time: 3000, type: 'big'}],
            pizzaSize: {},
            pizzaIngredient: {},
            renderInfo: false,
            showProgress: false,
            name: '',
            address: '',
            phone: '',
            orderInfo: {},
            orderDuration: -1,
            progressBar: 0,
            timerInt: 300,
            timer: null,
        }
    }

    async componentDidMount() {
        try {
            const res = await axios.post('/getIngredients');
            this.setState({ingredients: res.data});
            console.log(res.data);
        }
        catch (e) {
            console.log(e);
        }
    }

    handlePizzaSize = (e) => {this.setState({pizzaSize: this.state.prices[e.target.value]})};
    handlePizzaIngredient = (e) => {this.setState({pizzaIngredient: this.state.ingredients[e.target.value]})};
    handleNameChange = (e) => {this.setState({name: e.target.value})};
    handleAddrChange = (e) => {this.setState({address: e.target.value})};
    handleTelephoneChange = (e) => {this.setState({telephone: e.target.value})};

    handelNextStep = () => {
      if (this.state.showProgress) return;
      if( (this.state.pizzaSize.price === undefined)
          || (this.state.pizzaIngredient.name === undefined)) {
          alert('You need to fill in pizza size and pizza ingredient');
          return;
      }

      this.setState({renderInfo: true});
    };

    handleSubmit = async () => {
        if (this.state.showProgress) return;

        if ( this.state.name === ''
            || this.state.address === ''
            || this.state.telephone === '') {
            alert('You need to fill in blank fields');
            return
        }

        const orderBody = {
            price: this.state.pizzaSize.price + this.state.pizzaIngredient.price,
            duration: this.state.pizzaSize.time + this.state.pizzaIngredient.time,
            name: this.state.name,
            address: this.state.address,
            telephone: this.state.telephone,
            size: this.state.pizzaSize.type,
            ingredient: this.state.pizzaIngredient.name
        };

        try {
            const resOrder = await axios.post('/addToQueue', orderBody);
            console.log(resOrder);
            this.setState({
                orderInfo: resOrder.data,
                orderDuration: resOrder.data.duration,
                timer: setInterval(this.checkOrderStatus, this.state.timerInt),
                showProgress: true
            });
            console.log(this.state)
        }
        catch (e) {
            console.log(e)
        }
    };

    checkOrderStatus = async () => {
        try {
            const resOrder = await axios.post('/checkStatus', {_id: this.state.orderInfo._id});
            console.log(resOrder.data)
            if (resOrder.data[0].status === 'in_queue') {
                this.setState({orderInfo: resOrder.data[0], orderDuration: resOrder.data[0].duration});
            } else if (this.state.orderDuration - this.state.timerInt < 0 && resOrder.data[0].status === 'processing') {
                this.setState({orderInfo: resOrder.data[0], orderDuration: 0, progressBar: 90});
            } else if (resOrder.data[0].status === 'processing') {
                const duration = this.state.orderDuration - this.state.timerInt;
                const progress =
                    (this.state.orderInfo.duration - this.state.orderDuration) / this.state.orderInfo.duration* 100;
                this.setState({orderInfo: resOrder.data[0], orderDuration: duration, progressBar: progress});
            } else if (resOrder.data[0].status === 'processed') {
                clearInterval(this.state.timer);
                this.setState({orderInfo: resOrder.data[0], orderDuration: 0, progressBar: 100, timer: null});
                alert('Order done!')
            }
        }
        catch (e) {
            console.log(e)
        }
    };

    renderInfoForm = () => {
      return (
          <form>
              <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input className="form-control" id="name" onChange={this.handleNameChange}/>
              </div>
              <div className="form-group">
                  <label htmlFor="addr">Address:</label>
                  <input className="form-control" id="addr" onChange={this.handleAddrChange}/>
              </div>
              <div className="form-group">
                  <label htmlFor="tele">Telephone:</label>
                  <input className="form-control" id="tele" onChange={this.handleTelephoneChange}/>
              </div>
              <div className="form-group d-flex justify-content-center">
                    You want to order {this.state.pizzaSize.type} pizza with {this.state.pizzaIngredient.name}.<br/>
                    Price: {this.state.pizzaSize.price + this.state.pizzaIngredient.price}$
              </div>
              <div className="form-group d-flex justify-content-center">
                  <div className='btn btn-secondary' onClick={this.handleSubmit}>Submit order</div>
              </div>
          </form>
      )
    };

    renderProgressBar = () => {
        let text = '';
        if (this.state.orderInfo.status === 'in_queue')
            text = 'in queue';
        else if (this.state.orderInfo.status === 'processing')
            text = 'processing';
        else if (this.state.orderInfo.status === 'processed')
            text = 'done';

        return (
            <div>
                Your order is {text}
                <Line percent={this.state.progressBar} strokeWidth="4" strokeColor="#0066ff" />
            </div>
        )

    };

    render() {
        return (
            <div>
                <form>
                    <div className="form-group d-flex justify-content-center">
                        <h2>Order a pizza</h2>
                    </div>
                    <div className="form-group">
                        <label htmlFor="size">Select pizza size:</label>
                        <select className="form-control" id="size" onChange={this.handlePizzaSize}>
                            <option value={{}}></option>
                            <option value={0}>Small   200$</option>
                            <option value={1}>Medium  400$</option>
                            <option value={2}>Big     600$</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ingredient">Select pizza ingredient:</label>
                        <select className="form-control" id="ingredient" onChange={this.handlePizzaIngredient}>
                            <option value={{}}></option>
                            {this.state.ingredients.map((e, i) => {
                                return (
                                    <option key={i} value={i}>{e.name} {e.price}$</option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="form-group d-flex justify-content-center">
                        <div className='btn btn-secondary' onClick={this.handelNextStep}>Next step</div>
                    </div>

                </form>
                {this.state.renderInfo ? this.renderInfoForm() : ''}
                {this.state.showProgress ? this.renderProgressBar() : ''}
                <br/>
            </div>
        );
    }
}

export default PizzaForm;
