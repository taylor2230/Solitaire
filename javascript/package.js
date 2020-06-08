/*
Builds the new game and modifies the data
*/

let data = [deck, drawDeck, cards, points];

let setting;
let drawNum;
let moveNum;
let formerCards;
let selectedCards;

class NewGame {
    constructor(s) {
        this.stack = s;
        this.game = document.getElementById('game');
    }

    clean() {
        if (document.querySelector('input[name = "draw-setting"]:checked').value === 'Three Cards') {
            setting = 3;
        } else {
            setting = 1;
        }
        this.game.innerHTML = '';
        this.stack[1] = []; //draw deck
        this.stack[2] = []; //cards
        drawNum = 0; //draw count
    }

    buildDeck() {
        //build the deck of cards into a new object
        //creates the full deck of cards
        let y = 0;
        for (let i = 0; i < Object.keys(this.stack[0]['suits']).length; i++) {
            for (let x = 0; x < Object.keys(this.stack[0]['values']).length; x++) {
                this.stack[2][y] = {
                    suit: this.stack[0]['suits'][i],
                    card: this.stack[0]['values'][x],
                    img: this.stack[0]['values'][x] + this.stack[0]['suits'][i][0] + '.png'
                };
                y++;
            }
        }
    }

    shuffleDeck() {
        //randomize the deck order
        //Fisher-Yates shuffle
        let shuffle = this.stack[2].length, temp, random;
        while (0 !== shuffle) {
            random = Math.floor(Math.random() * shuffle);
            shuffle -= 1;
            temp = this.stack[2][shuffle];
            this.stack[2][shuffle] = this.stack[2][random];
            this.stack[2][random] = temp;
        }
    }

    buildDraw() {
        //build draw cards section
        //creates the draw cards; remaining cards are used for the game area
        while (this.stack[1].length < 24) {
            this.stack[1].push(this.stack[2].pop());
        }
    }

    buildArea() {
        //build card area sections
        //creates groups for game area to add and remove elements
        let temp = [];
        let n = 1;
        while (n - 1 < this.stack[2].length) {
            let h = [];
            for (let i = 0; i < n; i++) {
                h.push(this.stack[2].pop());
            }
            temp.push(h);
            n++;
        }
        this.stack[2] = temp;
    }

    buildAce() {
        //build ace section of site
        //builds json objects for adding points
        this.stack[3].Hearts = [];
        this.stack[3].Diamonds = [];
        this.stack[3].Clubs = [];
        this.stack[3].Spades = [];
    }

    generateGame() {
        //build the visual part of the game
        function drawArea(e) {
            //build draw deck visual
            let d = document.createElement('button');
            d.id = 'draw-deck';
            d.type = 'button';
            d.innerHTML = '<img src="./content_assets/cards/00.png" height="170" width="111"/>';
            d.setAttribute('onclick', 'solitaireDraw();return false;');
            d.setAttribute('class', 'draw');
            e.appendChild(d);
        }

        function drawSelection(e) {
            //build spot for drawn cards visual
            let d = document.createElement('div');
            d.id = 'draw-user';
            d.setAttribute('class', 'drawn-section');
            e.appendChild(d);
        }

        function pointsArea(e) {
            //build ace area visual
            function cardObj(cardImg, card) {
                let c = document.createElement('button');
                c.type = 'button';
                c.innerHTML = '<img src="./content_assets/' + cardImg + '.png" height="170" width="111"/>';
                c.setAttribute('onclick', 'moveCard(this);return false;');
                c.setAttribute('class', 'pointsCards');
                c.setAttribute('name', card);
                return c;
            }

            let d = document.createElement('div');
            d.id = 'points-user';
            d.setAttribute('class', 'points');
            e.appendChild(d);
            let type = Object.keys(data[3]);
            for (let i = 0; i < type.length; i++) {
                let div = document.createElement('div');
                div.setAttribute('class', 'points-card');
                div.id = type[i];
                let section = cardObj(type[i], type[i]);
                div.appendChild(section);
                d.appendChild(div);
            }
        }

        function playArea(e) {
            //build play area visual
            function cardObj(cardImg, card) {
                let c = document.createElement('button');
                c.type = 'button';
                c.innerHTML = '<img src="./content_assets/cards/' + cardImg + '" height="170" width="111"/>';
                c.setAttribute('onclick', 'moveCard(this);return false;');
                c.setAttribute('class', 'playCards');
                c.setAttribute('name', card);
                c.disabled = true;
                return c;
            }

            let d = document.createElement('div');
            d.id = 'play-area';
            d.setAttribute('class', 'play');
            e.appendChild(d);

            for (let i = 0; i < data[2].length; i++) {
                let div = document.createElement('div');
                div.id = (i + 1).toString();
                div.setAttribute('class', 'play-cards');
                d.appendChild(div);
                for (let y = 0; y < data[2][i].length; y++) {
                    if (y === data[2][i].length - 1) {
                        let card = cardObj(data[2][i][y]['img'], data[2][i][y]['suit'] + '~' + data[2][i][y]['card']);
                        card.disabled = false;
                        div.appendChild(card);
                    } else {
                        let card = cardObj('00.png', data[2][i][y]['suit'] + '~' + data[2][i][y]['card']);
                        div.appendChild(card);
                    }
                }
            }
        }

        drawArea(this.game);
        drawSelection(this.game);
        pointsArea(this.game);
        playArea(this.game);
    }
}

class Solitaire {
    constructor(stack) {
        this.stack = stack;
        this.game = document.getElementById('game');
    }

    draw(toDraw, div) {
        //drawn cards
        function cardObj(cardImg, card) {
            let c = document.createElement('button');
            c.type = 'button';
            c.innerHTML = '<img src="./content_assets/cards/' + cardImg + '" height="170" width="111"/>';
            c.setAttribute('onclick', 'moveCard(this);return false;');
            c.setAttribute('class', 'drawn');
            c.setAttribute('name', card);
            c.disabled = false;
            return c;
        }

        let target = div;
        let max = data[1].length;
        if(max !== 0) {
            for (let i = 0; i < toDraw; i++) {
                if (drawNum > max - 1) {
                    drawNum = 0;
                }
                let card = cardObj(data[1][drawNum]['img'], data[1][drawNum]['suit'] + '~' + data[1][drawNum]['card']);
                target.appendChild(card);
                drawNum++;
            }
        }
    }

    selectCards(topCard) {
        //returns children of top card
        let bool = false;
        let children = topCard.parentNode.childNodes;
        let num = 0;
        let targetSiblings = [];
        do {
            if (children[num] === topCard) {
                bool = true;
            }
            if (bool) {
                targetSiblings.push(children[num]);
            }
            num++;
        } while (num < children.length);
        num = 0;
        while (num < targetSiblings.length) {
            targetSiblings[num].style.border = '2px solid blue';
            num++;
        }
        return targetSiblings;
    }

    compareSelection(a1, a2) {
        //compares user selection to handle duplicate moves
        let num = 0;
        let equality = false;
        if (a1 !== undefined) {
            while (num < a2.length && equality === false) {
                if (a2[num] === a1[num]) {
                    equality = true;
                }
                num++;
            }
        } else equality = false;
        return equality;
    }

    restoreStyle(card) {
        //restores the style when a duplicate is found
        let num = 0;
        while (num < card.length) {
            card[num].style.border = null;
            num++;
        }
    }

    MovePoints(card, c1, c2, pDiv, tDiv) {
        let bottomCard = card.length;
        let bottomC = card[bottomCard - 1].name.split('~');
        if (bottomC[0] === tDiv.id && c2[1] === undefined && bottomC[1] === 'A' ||
            bottomC[0] === c2[0] && this.CheckNumber(c2[1], bottomC[1], this.stack[0]['values'])) {
            tDiv.innerHTML = '';
            tDiv.appendChild(card[bottomCard - 1]);
            this.stack[3][bottomC[0]].push(bottomC[1]);
            this.RemoveDrawCard(c1[1] + c1[0][0] + '.png', pDiv.id);
            console.log(this.stack[3]);
            this.EmptyDiv(pDiv);
            this.CheckWin(this.stack[3]);
        }
    }

    MoveKing(c, pDiv, tDiv) {
        this.CheckBlank(c, tDiv);
        this.FlipLastCard(pDiv);
    }

    MoveCard(card, c1, c2, pDiv, tDiv) {
        if (this.CheckSuit(c1[0], c2[0], this.stack[0]['suits'])
            && this.CheckNumber(c1[1], c2[1], this.stack[0]['values'])) {
            for (let i = 0; i < card.length; i++) {
                this.RemoveDrawCard(c1[1] + c1[0][0] + '.png', pDiv.id);
                card[i].setAttribute('class', 'playCards');
                tDiv.appendChild(card[i]);
            }
            this.EmptyDiv(pDiv);
        }
    }

    CheckSuit(c1, c2, data) {
        //Check the suit to ensure it is moving to the correct pair
        let pos1 = data.indexOf(c1);
        let pos2 = data.indexOf(c2);
        let bool;
        if (c1 !== c2) {
            switch (pos1) {
                case 0:
                    bool = pos2 !== 1;
                    break;
                case 1:
                    bool = pos2 !== 0;
                    break;
                case 2:
                    bool = pos2 !== 3;
                    break;
                case 3:
                    bool = pos2 !== 2;
                    break;
            }
            return bool;
        } else {
            return false;
        }
    }

    CheckNumber(c1, c2, data) {
        //compare card to only allow top card to move correctly
        let compare = [c1, c2];
        let positions = [];
        let num = 0;
        while (num < 2) {
            for (let i = 0; i < data.length; i++) {
                if (compare[num] == data[i]) {
                    positions.push(i);
                }
            }
            num++;
        }
        return positions[0] === positions[1] - 1;
    }

    CheckBlank(c, tDiv) {
        //move king to a blank div
        tDiv.innerHTML = '';
        for (let i = 0; i < c.length; i++) {
            tDiv.appendChild(c[i]);
        }
    }

    RemoveDrawCard(ele, pDivID) {
        //remove card from draw stack when moving from draw area
        if(pDivID === 'draw-user') {
            for(let i = 0; i < this.stack[1].length; i++) {
                if(ele === this.stack[1][i]['img']) {
                    this.stack[1].splice(i, 1);
                }
            }
        }
    }

    FlipLastCard(pDiv) {
        //flip the last card on the previous stack
        let children = pDiv.childNodes;
        if (children.length !== 0 && children[0].id !== 'blank') {
            let max = children[children.length - 1];
            let maxCard = max.name.split('~');
            max.innerHTML = '<img src="./content_assets/cards/' + maxCard[1] + maxCard[0][0] + '.png" height="170" width="111" alt=""/>';
            max.disabled = false;
        }
    }

    EmptyDiv(pDiv) {
        //process an empty div to assign blank card
        if (pDiv.innerHTML === '' && pDiv.id !== 'draw-user') {
            let d = document.createElement('button');
            d.id = 'blank';
            d.type = 'button';
            d.name = 'blank~0';
            d.innerHTML = '<img src="./content_assets/cards/blank.png" height="170" width="111"/>';
            d.setAttribute('onclick', 'moveCard(this);return false;');
            d.setAttribute('class', 'playCards');
            pDiv.appendChild(d);
        } else {
            this.FlipLastCard(pDiv);
        }
    }

    CheckWin(data) {
        //Check win conditions on points move
        if ((data['Hearts'].length +
            data['Diamonds'].length +
            data['Spades'].length +
            data['Clubs'].length) === 52) {
            this.game.innerHTML = '<label id="win">You Win!</label>';
        }
    }

    move(card, tgtCard, div, tgtDiv) {

        let topC1 = card[0].name.split('~');
        let topC2 = tgtCard[0].name.split('~');
        if(div.className !== 'points-card') {
            if (topC2[0] === 'blank' && topC1[1] === 'K') {
                //process a king move to a blank spot
                this.RemoveDrawCard(topC1[1] + topC1[0][0] + '.png', div.id);
                this.MoveKing(card, div, tgtDiv);
            } else if (tgtDiv.className === 'points-card') {
                //process a move to the points section
                this.MovePoints(card, topC1, topC2, div, tgtDiv);
            } else {
                //if card is not blank, king, or points area, process below
                this.MoveCard(card, topC1, topC2, div, tgtDiv);
            }
        }
    }
}
