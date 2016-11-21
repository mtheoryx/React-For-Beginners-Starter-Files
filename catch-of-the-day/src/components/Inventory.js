import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.logout = this.logout.bind(this);
        this.authHandler = this.authHandler.bind(this);

        this.state = {
            uid: null,
            owner: null
        }
    }

    componentDidMount() {
        base.onAuth((user) => {
            if( user ) {
                this.authHandler(null, { user });
            }
        });
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
    
    authenticate(provider) {
        console.log(`Trying to log in with provider ${provider}`);
        base.authWithOAuthPopup(provider, this.authHandler);
    }

    logout() {
        base.unauth();
        this.setState({
            uid: null
        })
    }

    authHandler(error, authData) {
        
        if( error ) {
            console.log(error);
            return;
        }
        
        console.log(authData);

        //grab store info
        const storeRef = base.database().ref(this.props.storeId);

        //query firebase ONCE for the store data
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};

            //Let current user claim an un-owned store
            if( !data.owner ) {
                storeRef.set({
                    owner: authData.user.uid
                });
            }

            //Set state for user and owner
            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            });
        });
    }
    
    renderLogin() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github"
                        onClick={ () => this.authenticate('github')  } >
                    Log in with Github
                </button>
            </nav>

        )
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
        const logout = <button onClick={ this.logout }>Log Out!</button>;

        //Check if they are not logged in at all
        if( !this.state.uid ) {
            return <div>{ this.renderLogin() }</div>
        }

        //Check if they are the owner of a store
        if( this.state.uid !== this.state.owner ) {
            return  (
                <div>
                    <p>Sorry, you aren't the owner fo this store!</p>
                    { logout }
                </div>
            )
        }
        
        const { addFish, loadSamples } = this.props;
       
        return (
            <div>
                <h2>Inventory</h2>
                { logout }
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

Inventory.propTypes = {
    fishes: React.PropTypes.object.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    addFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string.isRequired
};

export default Inventory;
