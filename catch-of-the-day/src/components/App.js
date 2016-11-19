import React from 'react';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';

import sampleFishes from '../sample-fishes';

class App extends React.Component {
    constructor() {
        super(); //Now we can use 'this'

        this.addFish = this.addFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);

        //Initial state
        this.state={
            fishes: {},
            orders: {}
        }
    }

    addFish( fish ) {
        // Copy state
        const fishes = { ...this.state.fishes };

        // Create timestamp for object id uniqueness

        const timestamp = Date.now();

        // Update state
        fishes[`fish-${timestamp}`] = fish;

        // Set state
        this.setState({ fishes });
    }

    loadSamples() {
        console.log('Loading sample fishes!');
        this.setState({
            fishes: sampleFishes
        });
    }

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                </div>
                <Order />
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
            </div>
        )
    }
}

export default App;
