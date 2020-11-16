import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css';
import { Link } from "react-router-dom";


class Bar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ingredients: []
        }
    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="navbar navbar-dark bg-primary d-flex flex-row">
                <div className='container'>
                    <Link to='/'><button className='btn btn-secondary'>Home</button></Link>
                    <Link to='/admin'><button className='btn btn-secondary'>Admin panel</button></Link>

                </div>
            </div>
        );
    }
}

export default Bar;
