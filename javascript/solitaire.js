/*
Specific functions for the solitaire game
*/

let ng = new NewGame(data);
let g;

function startNewGame() {
    //starts a new game when clicked
    ng.clean();
    ng.buildDeck();
    ng.buildDeck();
    ng.shuffleDeck();
    ng.buildDraw();
    ng.buildArea();
    ng.buildAce();
    ng.generateGame();
    g = new Solitaire(data);
}

function solitaireDraw() {
    let drawTarget = document.getElementById('draw-user');
    drawTarget.innerHTML = '';
    g.draw(setting, drawTarget);
    let drawnCards = document.getElementsByClassName('drawn');
    let lastCard = drawnCards.length;
    drawnCards[lastCard-1].disabled = false;
}

function moveCard(ele) {
    selectedCards = g.selectCards(ele);
    if(moveNum === undefined) {
        formerCards = selectedCards;
        moveNum = 1;
    } else if(moveNum === 1) {
        if(g.compareSelection(formerCards, selectedCards)) {
            g.restoreStyle(selectedCards);
            moveNum = undefined;
        } else {
            moveNum = undefined;
            g.restoreStyle(formerCards);
            g.move(formerCards, selectedCards, formerCards[0].parentNode, ele.parentNode);
            g.restoreStyle(selectedCards);
        }
    }
}
