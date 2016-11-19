import React from 'react';
import AddFishForm from './AddFishForm';

class Inventory extends React.Component {
    render() {
        const { addFish, loadSamples } = this.props;

        return (
            <div>
                <h2>Inventory</h2>
                <AddFishForm addFish={ addFish } />
                <button onClick={ loadSamples }>Load Sample Fishes</button>
            </div>
        )
    }
}

export default Inventory;
