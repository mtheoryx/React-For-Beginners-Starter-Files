import React from 'react';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
    constructor() {
        super(); //Now we can use 'this'

        this.addFish = this.addFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);

        //Initial state
        this.state={
            fishes: {},
            order: {}
        }
    }

    componentWillMount() {
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`, { context: this, state: 'fishes'});
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    addFish( fish ) {
        // Copy state
        const fishes = { ...this.state.fishes };

        // Create timestamp for object id uniqueness
        const timestamp = Date.now();

        // Update state
        fishes[`fish-${ timestamp }`] = fish;

        // Set state
        this.setState({ fishes });
    }

    loadSamples() {
        this.setState({
            fishes: sampleFishes
        });
    }

    addToOrder( key ) {
        // Copy state
        const order = { ...this.state.order };

        // Update or add number of fish ordered
        order[key] = order[key] + 1 || 1;

        // Set state
        this.setState({ order });
    }

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {
                            Object
                                .keys(this.state.fishes)
                                .map(key => <Fish key={ key }
                                                  details={ this.state.fishes[key] }
                                                  index={ key }
                                                  addToOrder={ this.addToOrder } />)
                        }
                    </ul>
                </div>
                <Order order={this.state.order} fishes={this.state.fishes}/>
                <Inventory addFish={ this.addFish }
                           loadSamples={ this.loadSamples } />
            </div>
        )
    }
}

export default App;
