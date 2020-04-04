import React, { Component, PureComponent } from 'react';
import Card from './Card.js'
import axios from 'axios';
import './Deck.css'

const baseURL = "https://deckofcardsapi.com/api/deck"

class Deck extends Component{
    constructor(props){
        super(props);
        this.state = {
            deck: null,
            drawn: []
        }

        //Bind Methods
        this.getCard = this.getCard.bind(this);
    }

    //Make API Request
    async componentDidMount(){
        let deck = await axios.get(`${baseURL}/new/shuffle/`);
        //We want data info from the API
        this.setState({deck: deck.data});
    }


    //Method to get Card
    async getCard(){
         //Grab Card with another API call using Deck ID
         let deckId = this.state.deck.deck_id;

         try{
            //Url to Request a New Card
            let cardURL = `${baseURL}/${deckId}/draw/`;
            let cardRes = await axios.get(cardURL);

            //If there are no more cards, throw an error
            if(!cardRes.data.success){
                throw new Error ("No Cards Left")
            }

         let card = cardRes.data.cards[0];
         //Setstate Using new Card Info from API
         this.setState(st => ({
             drawn: [
                 ...st.drawn,
                 {
                     id: card.code,
                     image: card.image,
                     name: `${card.suit} ${card.value}`
                 }
             ]
         }));
    }
        catch (err){
            alert(err)
        }
    }


    //Render Component
    render(){
        const cards = this.state.drawn.map( c => (
            <Card key={c.id} name={c.name} image={c.image} /> //pass to the child component via props
        ))
        return(
            <div>
                <h1 className="text">Card Dealer</h1>
                <p className="text">A little Demo Made with React</p>
                <button className="btn" onClick={this.getCard}>Deal Me!</button>
                <div className="Deck-cardarea">
                {cards}
                </div>
                
            </div>
        )
    }
}

export default Deck;