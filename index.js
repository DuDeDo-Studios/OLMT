const monsters = []
let hand = []
const playerField = []
const opponentField = []
let waveCount = 1
let playerScore = 0
let opponentScore = 0
let spells = []
let currentSpell = false
let currentAbility = false

function updateScores (player, opponent) {
    document.getElementById('score1').innerHTML = ' <h5 class="card-title">Score: '+ player+'</h5>'
    document.getElementById('score2').innerHTML = ' <h5 class="card-title">Score: '+ opponent+'</h5>'
}

const generateMonsters = (mod1, mod2, count) => {
    for (let i=0; i<=count; i++) {
        monsters.push({
            cost: Math.floor(Math.random() * mod1),
            health: (Math.floor(Math.random() * mod2) + 1)* 10,
            attack: Math.floor(Math.random() * mod2) * 10,
            img: Math.floor(Math.random() * 2147483647),
        })
    }
}

function generateSpells () {
    for (let i=1; i<=3; i++) {
        let ammount = (Math.floor(Math.random() * 3) + 1)
        spells.push({
           stat: ammount % 2 == 0 ? 'Health' : 'Attack',
           ammount: ammount * 10,
        })
        document.getElementById('spell'+ i).innerHTML = '<div class="card-body" id="spell'+i+'"><p>' + spells[i-1].stat + ' +  '+ spells[i-1].ammount+'</p></div>'
    }
    let num = Math.ceil(Math.random() * 5);
    let ability = ''
    switch (num) {
        case 1:
            ability = 'Trample'
            break;     
        case 2:
            ability = 'Retaliate'
            break; 
        case 3:
            ability = 'Quick Strike'
            break; 
        case 4:
            ability = 'Double Strike'
            break; 
        case 5:
            ability = 'Shield'
            break; 
        default:
            break;
    }
    spells.push({ability})
    document.getElementById('ability').innerHTML = '<div class="card-body" id="ability"><p>' +ability + '</p></div>'
}

function selectAbility () {
    if (!currentAbility && !spells[3].played) {
        currentAbility = spells[3]
    } else {
        currentAbility =false
    }
    console.log(currentAbility);
}

function selectSpell (index) {
    if (!currentSpell && !spells[index].played) {
        currentSpell = spells[index]
        currentSpell.index = index + 1
    } else {
        currentSpell = false;
    }
}

function applySpell (index) {
    if (!currentSpell && !currentAbility) {
        return;
    } else if (!!currentSpell) {
        console.log(currentSpell.index);
        playerField[index][currentSpell.stat.toLowerCase()] += currentSpell.ammount
        updatePlayerField()
        document.getElementById('spell'+ currentSpell.index).innerHTML = ''
        currentSpell.played = true
        currentSpell = false
    } else if (!!currentAbility) {
        playerField[index].ability = currentAbility.ability
        document.getElementById('ability').innerHTML = ''
        currentAbility.played = true
        currentAbility = false
        updatePlayerField();
    }
}

const generateHand = () => {
    for (let i=1; i<=6; i++) {
        const monster = monsters.pop();
        document.getElementById('hand'+ i).innerHTML = '<div class="card-body onclick=playCard" id="hand'+i+'"><img src="https://app.pixelencounter.com/api/basic/monsters/' + monster.img + '" style="width:50px;height:60px;" class="card-img-top" ><p>Cost: ' + monster.cost + ' </p><p><div class="heart"></div>' + monster.health + ' </p><p>Attack: ' + monster.attack + ' </p></div>'
        monster.position = 'hand' + i
        hand.push(monster)
        // document.getElementById('hand'+ i).addEventListener('click', playCard)
    }
}

const nextWave = () => {
    let count = opponentField.length
    for (let i=1; i<5 - count; i++) {
        const monster = monsters.pop();
        opponentField.push(monster)
    }
    updateOpponentField()
}

function updateOpponentField () {
    for (let i=1; i<=opponentField.length; i++) {
        let monster = opponentField[i - 1]
        document.getElementById('card0' + i).innerHTML = '<img src="https://app.pixelencounter.com/api/basic/monsters/' + monster.img + '" style="width:50px;height:60px;" class="card-img-top" ><p>Health: ' + monster.health + ' </p><p>Attack: ' + monster.attack + ' </p>'
    }
}

const playCard = (position) => {
    console.log(position);
    if (playerField.length == 4) {
        return
    }
    let monster = hand.find(monster => {
        return monster.position == position
    })
    if (monster.played) {
        return;
    }
    monster.played = true
    playerField.push(monster)
    document.getElementById(position).innerHTML = ''
    updatePlayerField()
}

function updatePlayerField () {
    //console.log(playerField)
    for (let i=1; i<=playerField.length; i++){
        let monster = playerField[i - 1]
        document.getElementById('card' + i).innerHTML = '<img src="https://app.pixelencounter.com/api/basic/monsters/' + monster.img + '" style="width:50px;height:60px;" class="card-img-top" ><p>Health: ' + monster.health + ' </p><p>Attack: ' + monster.attack + ' </p><p>' + (monster.ability ? monster.ability : '') + '</p>'
    }
    for(let i=4; i>playerField.length; i--) { 
        document.getElementById('card' + i).innerHTML = ''
        //console.log(i)
    }
}

const startBattle = () => {
    hand = [];
    spells = [];
    while (opponentField.length && playerField.length) {
        for (monster in playerField) {
            if (playerField[monster].ability == 'Quick Strike') {
                console.log('player')
                battle(playerField[monster], opponentField[0])
                if (opponentField[0].health <= 0) {
                    opponentField.shift()
                    console.log(opponentField);
                }
            }
        }
        console.log('opponent')
        for (i=0; i<opponentField.length; i++) {
            if (!playerField.length){
                break
            }
            battle(opponentField[i], playerField[0])
            if (playerField[0].health <= 0) {
                playerField.shift()
            }
        }
        while (opponentField[0]?.health <= 0) {
            console.log(opponentField[0]);
            opponentField.shift()
        }
        console.log('player')
        for (i=0; i<playerField.length; i++) {
            let difference = 0
            if (!opponentField.length){
                break
            } 
            if (playerField[i].ability != 'Quick Strike') {
                difference = playerField[i].attack - opponentField[0].health
                battle(playerField[i], opponentField[0])
            }
            if (playerField[i].ability == 'Trample'){
                //playerField[i].ability = null
                let j = i + 1
                while (difference > 0 && opponentField[j]) {
                    console.log(difference);
                    let health = opponentField[j].health 
                    opponentField[j].health -= difference
                    difference -= health;
                    j++
                }
            }
            if (playerField[i].ability == 'Double Strike'){
                playerField[i].ability = null
                i--;
            }
            while (opponentField[0]?.health <= 0) {
                console.log(opponentField[0]);
                opponentField.shift()
            }
        }
    }
    !playerField.length ? opponentScore++ : playerScore++
    updateScores(playerScore, opponentScore)

    updateOpponentField()
    updatePlayerField()
    waveCount++
    generateMonsters(waveCount, waveCount + 2, 9);
    nextWave()
    generateHand();
    generateSpells()
}

function battle (attacker, defender) {
    //console.log(attacker, 'vs', defender)
    if (defender.ability == 'Shield'){
        defender.ability = null
        return
    }
    defender.health -= attacker.attack
    console.log( defender.health)
    if (defender.ability == 'Retaliate') {
        attacker.health -= defender.attack
    }
}


updateScores(playerScore, opponentScore)
generateMonsters(waveCount, waveCount + 2, 9);
nextWave()
generateHand();
generateSpells()