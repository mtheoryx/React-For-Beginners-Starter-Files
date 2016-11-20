import React from 'react';
import AddFishForm from './AddFishForm';

class Inventory extends React.Component {
    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e, key) {
        const fish = this.props.fishes[key];

        //copy the fish with updated props
        const updatedFish = {
            ...fish,
            [e.target.name]: e.target.value
        };

        //Update state with new fish
        this.props.updateFish(key, updatedFish);
    }

    renderInventory(key) {
        const fish = this.props.fishes[key];

        return (
            <div className="fish-edit" key={ key }>
                <input type="text"
                       name="name"
                       placeholder="Fish Name"
                       value={ fish.name }
                       onChange={ (e) => this.handleChange(e, key) }/>

                <input type="text"
                       name="price"
                       placeholder="Fish Price"
                       value={ fish.price }
                       onChange={ (e) => this.handleChange(e, key) }/>

                <select name="status"
                        value={ fish.status }
                        onChange={ (e) => this.handleChange(e, key) }>
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>

                <textarea name="desc"
                          placeholder="Fish Desc"
                          value={ fish.desc }
                          onChange={ (e) => this.handleChange(e, key) }>

                </textarea>

                <input type="text"
                       name="image"
                       placeholder="Fish Image"
                       value={ fish.image }
                       onChange={ (e) => this.handleChange(e, key) }/>
                <button onClick={ () => this.props.removeFish(key) }>Remove Fish</button>
            </div>
        )
    }

    render() {
        const { addFish, loadSamples } = this.props;

        return (
            <div>
                <h2>Inventory</h2>
                {
                    Object
                        .keys(this.props.fishes)
                        .map(this.renderInventory)
                }
                <AddFishForm addFish={ addFish } />
                <button onClick={ loadSamples }>Load Sample Fishes</button>
            </div>
        )
    }
}

export default Inventory;
