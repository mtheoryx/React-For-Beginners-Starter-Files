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
        this.removeFromOrder = this.removeFromOrder.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(this);

        //Initial state
        this.state={
            fishes: {},
            order: {}
        }
    }

    componentWillMount() {
        //This runs right before the app is rendered
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`
            , {
            context: this,
            state: 'fishes'
        });
        //check if there is any order from localStorage
        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

        if( localStorageRef ) {
            //update our app components order state
            this.setState({
                order: JSON.parse(localStorageRef)
            })
        }

    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
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

    updateFish(key, updatedFish) {
        //Copy fishes state
        const fishes = {...this.state.fishes};

        //Update state with new fish
        fishes[key] = updatedFish;

        //Set state with new updated fishes
        this.setState({fishes})
    }

    removeFish(key) {
        //Copy fishes state
        const fishes = {...this.state.fishes};

        //Need to set to null due to firebase instead of delete
        fishes[key] = null;

        //Set new state
        this.setState({ fishes });
        //fish-1479655420110
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

    removeFromOrder(key) {
        //Copy state
        const order = { ...this.state.order };

        //Delete from order
        //Can use delete directly since not persisting via firebase
        delete order[key];

        //Set new state
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

                <Order order={ this.state.order }
                       fishes={ this.state.fishes }
                       params={ this.props.params }
                       removeFromOrder={ this.removeFromOrder }/>

                <Inventory addFish={ this.addFish }
                           loadSamples={ this.loadSamples }
                           updateFish={ this.updateFish }
                           removeFish={ this.removeFish }
                           storeId={ this.props.params.storeId }
                           fishes={ this.state.fishes }/>
            </div>
        )
    }
}

App.propTypes = {
    params: React.PropTypes.object.isRequired
};

export default App;
