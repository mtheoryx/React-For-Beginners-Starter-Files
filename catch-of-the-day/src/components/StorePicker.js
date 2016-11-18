import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {
    goToStore( event ) {
        event.preventDefault();
        console.log('You changed the URL!');

        // grab the text of the input box
        const storeId= this.storeInput.value;
        console.log(storeId);

        // now transition from / to /store/:storeId
        this.context.router.transitionTo(`/store/${storeId}`);
    }

    render() {
        return (
            <form className="store-selector" onSubmit={ this.goToStore.bind(this) }>
                <h2>Please Enter a Store</h2>
                <input type="text"
                       required
                       placeholder="Store Name"
                       defaultValue={ getFunName() }
                       ref={ input => this.storeInput = input } />
                <button type="submit">Visit Store</button>
            </form>
        )
    }
}

// @TODO #bad #habits Note: Do not overuse context
StorePicker.contextTypes = {
    router: React.PropTypes.object
};

export default StorePicker;
