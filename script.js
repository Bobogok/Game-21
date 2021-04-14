/*
    Card class
*/
class Card {

    /*
		@param {String} rank
		@param {String} suit
	*/
    constructor(rank, suit) {
        this.rank = rank;
		this.suit = suit;
    }

    /*
		Gets the value or points of the card
	*/
    getValue(currentTotal) {

        let value = 0;

		if (this.rank == 'A' && currentTotal < 11){
            value = 11;
		} else if (this.rank == 'A'){
            value = 1;
		} else if (this.rank == 'J' || this.rank == 'Q' || this.rank == 'K'){
            value = 10;
		} else {
            value = parseInt(this.rank);
		}
		return value;
	}

    /*
        Renders the card in console
    */
    view() {
        console.group(`Card view:`);
        console.log(`Rank: ${this.rank}`);
        console.log(`Suit: ${this.suit}`);
        console.groupEnd();
    }

}

/*
    Player class
*/
class Player {

    /*
		Constructor
		@param {Array} hand - the array which holds all the cards
	*/
    constructor(elem, hand) {
        // super()
        this.elem = elem;
        this.hand = hand;
    }

    /*
		Hit player with new card from the deck
		@param {Card} card - the card to deal to the player
	*/
    hit(card) {
        this.hand.push(card);
    }

    /*
		the total score of all the cards in the hand of a player
	*/
    getScore() {

        let points = 0;

		for(let i = 0; i < this.hand.length; i++){
			if(i == 0) points = this.hand[i].getValue(0);
			else points += this.hand[i].getValue(points);
		}

		return points;

	}

    /*
		Returns the array (hand) of cards
	*/
    showHand() {

        for(var i = 0; i < this.hand.length; i++) {
            console.log(this.hand[i].view());
        }

    }
}

/*
    Deck of Cards
*/
class Deck {

    /*
		Initialise constructor
	*/
    constructor() {
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		this.suits = ['♥', '♦', '♣', '♠'];
		this.deck;
    }

    /*
        Fills up the deck array with cards
    */
    init() {
        this.deck = [];
        for (let s = 0; s < this.suits.length; s++) {
            for (let r = 0; r < this.ranks.length; r++) {
                this.deck.push(new Card(this.ranks[r], this.suits[s]));
            }
        }
    }

    /*
		Shuffles the cards in the deck randomly
	*/
    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
}


class Game {

    /*
        Start the game
    */
    start() {
        this.deck = new Deck();
        this.deck.init();
        this.deck.shuffle();


        //deal one card to dealer
		this.dealer = new Player('dealer', [this.deck.deck.pop()]);

        //deal two cards to player
		this.player = new Player('player', [this.deck.deck.pop(), this.deck.deck.pop()]);

        this.playerScore.innerHTML = this.player.getScore();
        this.dealerScore.innerHTML = this.dealer.getScore();

        this.dealer.showHand();
        this.player.showHand();

        this.setMessage("Hit or Stand");
    }

    /*
        Initialise
    */
    init() {
        this.dealerScore = document.getElementById('dealer-score').getElementsByTagName("span")[0];
        this.playerScore = document.getElementById('player-score').getElementsByTagName("span")[0];
        this.dealButton = document.getElementById('deal');
        this.hitButton = document.getElementById('hit');
        this.standButton = document.getElementById('stand');

        //attaching event handlers
        this.dealButton.addEventListener('click', this.dealButtonHandler.bind(this));
        this.hitButton.addEventListener('click', this.hitButtonHandler.bind(this));
        this.standButton.addEventListener('click', this.standButtonHandler.bind(this));
    }

    /*
        Deal button event handler
    */
    dealButtonHandler() {
        this.start();
        this.dealButton.disabled = true;
        this.hitButton.disabled = false;
        this.standButton.disabled = false;
    }

    /*
        Hit button event handler
    */
    hitButtonHandler() {
        //deal a card and add to player's hand
        let card = this.deck.deck.pop();
        this.player.hit(card);

        //render the card and score
        card.view();
        this.playerScore.innerHTML = this.player.getScore();

        // if over, then player looses
        if (this.player.getScore() > 21) {
            this.gameEnded('You lost!');
        }
    }

    /*
        Stand button event handler
    */
    standButtonHandler() {
        this.hitButton.disabled = true;
        this.standButton.disabled = true;

        //deals a card to the dealer until
        //one of the conditions below is true
        while(true){
            let card = this.deck.deck.pop();

            this.dealer.hit(card);
            card.view();
            this.dealerScore.innerHTML = this.dealer.getScore();

            let playerBlackjack = this.player.getScore() == 21,
                dealerBlackjack = this.dealer.getScore() == 21;

            //Rule set
            if(dealerBlackjack && !playerBlackjack) {
                this.gameEnded('You lost!');
                break;
            } else if(dealerBlackjack && playerBlackjack) {
                this.gameEnded('Draw!');
                break;
            } else if(this.dealer.getScore() > 21 && this.player.getScore() <= 21) {
                this.gameEnded('You won!');
                break;
            } else if(this.dealer.getScore() > this.player.getScore() && this.dealer.getScore() <= 21 && this.player.getScore() < 21) {
                this.gameEnded('You lost!');
                break;
            }
            //TODO needs to be expanded..
        }
    }

    /*
        Instructions or status of game
    */
    setMessage(str) {
        document.getElementById('status').innerHTML = str;
    }

    /*
        If the player wins or looses
    */
    gameEnded(str) {
        this.setMessage(str);
        this.dealButton.disabled = false;
        this.hitButton.disabled = true;
        this.standButton.disabled = true;
    }
}

// first initilaise
document.addEventListener('DOMContentLoaded', (event) => {
    new Game().init();
});