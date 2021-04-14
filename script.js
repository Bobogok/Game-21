class Card {

    constructor(rank, suit) {
        this.rank = rank;
		this.suit = suit;
    }

    /*
		Gets the value or points of the card
	*/
    getValue(currentTotal) {

		if (this.rank == 'A' && currentTotal < 11){
            this.value = 11;
        } else if (this.rank == 'A') {
            this.value = 1;
		} else if (this.rank == 'J' || this.rank == 'Q' || this.rank == 'K') {
			this.value = 10;
		} else {
			this.value = parseInt(this.rank);
		}

    }

    /*
        Renders the card
    */
    view() {
        this.getValue()
        console.group(`Card view:`)
        console.log(`Rank: ${this.rank}`)
        console.log(`Suit: ${this.suit}`)
        console.log(`Value: ${this.value}`)
        console.groupEnd()
    }

}


class Player extends Card {

    /*
		Constructor
		@param {Array} hand - the array which holds all the cards
	*/
    constructor(elem, hand) {
        super()
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
        super.getValue();

        let points = 0;
		for(let i = 1; i < this.hand.length; i++){

			if (i == 0) {
                this.points = this.hand[i].getValue(0);
            } else {
                this.points += this.hand[i].getValue(points);
            }
		}
	}

    /*
		Returns the array (hand) of cards
	*/
    showHand() {

        for(var i = 0; i < this.hand.length; i++) {
            console.log(this.hand[i].view())
        }

    }
}

/*
    Deck of Cards
*/
class Deck {

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


class Game extends Deck {

    // default generated for classes that do not have their own constructor
    constructor(...args) {
        super(...args);
    }

    start() {
        //initilaise and shuffle the deck of cards
        this.__proto__.__proto__.init.call(this);
        this.__proto__.__proto__.shuffle.call(this);

        //deal one card to dealer
		this.dealer = new Player('dealer', [this.deck.pop()]);

        //deal two cards to player
		this.player = new Player('player', [this.deck.pop(), this.deck.pop()]);

        this.dealer.showHand()
        this.player.showHand()

        this.setMessage("Hit or Stand");
    }

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

    dealButtonHandler() {
        this.start();
        this.dealButton.disabled = true;
        this.hitButton.disabled = false;
        this.standButton.disabled = false;
    }

    hitButtonHandler() {
        //deal a card and add to player's hand
        let card = this.deck.pop();
        this.player.hit(card);

        //render the card and score
        // document.getElementById(this.player.elem).innerHTML += this.dealer.__proto__.__proto__.view.call(this);
        // this.playerScore.innerHTML = this.player.getScore.call(this.player.hand);

        //if over, then player looses
        if (this.player.getScore() > 21){
            this.gameEnded('You lost!');
        }
    }

    standButtonHandler() {

    }

    /*
        Instructions or status of game
    */
    setMessage(str) {
        document.getElementById('status').innerHTML = str;
    }
    
}

let a = new Game();
a.start()
console.log(a)

// let deck = new Deck()
// deck.init();

// let cardJ = new Card('J', '♠');
// let player1 = new Player('J', '♠', cardJ);