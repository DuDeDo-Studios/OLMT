const monsters = [];
let hand = [];
const playerField = [];
const opponentField = [];
let waveCount = 1;
let playerScore = 0;
let opponentScore = 0;
let spells = [];
let currentSpell = false;
let currentAbility = false;
let mana = 5;
let battleStarted = false;
let playerIsAttacking = false;
let opponentIsAttacking = false;

function updateScores(player, opponent) {
    document.getElementById("score1").innerHTML =
        ' <h5 class="card-title">Score: ' + player + "</h5>";
    document.getElementById("score2").innerHTML =
        ' <h5 class="card-title">Score: ' + opponent + "</h5>";
    mana = 5;
    updateMana();
    currentAbility = false;
    currentSpell = false;
}

function updateMana() {
    document.getElementById("mana").innerHTML =
        '<img src="coin.png" width="40" height="40">    ' + mana;
}

const generateMonsters = (mod1, mod2, count) => {
    for (let i = 0; i <= count; i++) {
        monsters.push({
            cost: 1,
            health: (Math.floor(Math.random() * mod2) + 1) * 10,
            attack: Math.floor(Math.random() * mod2) * 10,
            img: Math.floor(Math.random() * 2147483647),
        });
    }
};

function generateSpells() {
    for (let i = 1; i <= 3; i++) {
        const typeNum = Math.floor(Math.random() * 2);
        const stat = typeNum % 2 == 0 ? "Health" : "Attack";
        const typeEnemyNum = Math.floor(Math.random() * 2);
        const enemyStat = typeEnemyNum % 2 == 0 ? 1 : -1;
        let ammount = (Math.floor(Math.random() * 3) + 1) * enemyStat;
        spells.push({
            stat,
            ammount: ammount * 10,
            cost: 1,
        });
        const image = stat == "Health" ? "heart" : "sword";
        document.getElementById("spell" + i).innerHTML =
            '<div class="card-body" ><p><img src="coin.png" width="20" height="20">     -1</p><p><img src="' +
            image +
            '.png" width="20" height="20">   ' +
            spells[i - 1].ammount +
            "</p></div>";
    }
    let num = Math.ceil(Math.random() * 5);
    let ability = "";
    switch (num) {
        case 1:
            ability = "Trample";
            break;
        case 2:
            ability = "Retaliate";
            break;
        case 3:
            ability = "Quick Strike";
            break;
        case 4:
            ability = "Double Strike";
            break;
        case 5:
            ability = "Shield";
            break;
        default:
            break;
    }
    spells.push({ ability, cost: 2 });
    document.getElementById("ability").innerHTML =
        '<div class="card-body" ><p><img src="coin.png" width="20" height="20">     -2</p><p>' +
        ability +
        "</p></div>";
}

function selectAbility() {
    if (battleStarted) return;
    if (mana <= 1) return;
    if (!currentAbility && !spells[3].played) {
        currentAbility = spells[3];
        document
            .getElementById("ability")
            .firstElementChild.classList.add("selected");
    } else {
        currentAbility = false;
        document
            .getElementById("ability")
            .firstElementChild.classList.remove("selected");
    }
}

function selectSpell(index) {
    if (battleStarted) return;
    if (mana <= 0) return;
    if (!currentSpell && !spells[index].played) {
        currentSpell = spells[index];
        currentSpell.index = index + 1;
        document
            .getElementById("spell" + (index + 1))
            .firstElementChild.classList.add("selected");
    } else {
        index = currentSpell.index;
        currentSpell = false;
        document
            .getElementById("spell" + index)
            .firstElementChild.classList.remove("selected");
    }
}

function applySpell(index, isMonster = false) {
    if (!currentSpell && !currentAbility) {
        return;
    } else if (!!currentSpell) {
        if (isMonster) {
            opponentField[index][currentSpell.stat.toLowerCase()] +=
                currentSpell.ammount;
            if (opponentField[index].attack <= 0) {
                opponentField[index].attack = 0;
            }
            if (opponentField[index].health <= 0) {
                opponentField.splice(index, 1);
            }
            updateOpponentField();
            document.getElementById("spell" + currentSpell.index).innerHTML = "";
            currentSpell.played = true;
            currentSpell = false;
            mana--;
        } else {
            playerField[index][currentSpell.stat.toLowerCase()] +=
                currentSpell.ammount;
            if (playerField[index].attack <= 0) {
                playerField[index].attack = 0;
            }
            if (playerField[index].health <= 0) {
                playerField.splice(index, 1);
            }
            updatePlayerField();
            document.getElementById("spell" + currentSpell.index).innerHTML = "";
            currentSpell.played = true;
            currentSpell = false;
            mana--;
        }
    } else if (!!currentAbility) {
        if (isMonster) return;
        playerField[index].ability = currentAbility.ability;
        document.getElementById("ability").innerHTML = "";
        currentAbility.played = true;
        currentAbility = false;
        updatePlayerField();
        mana -= 2;
    }
    updateMana();
}

const generateHand = () => {
    for (let i = 1; i <= 6; i++) {
        const monster = monsters.pop();
        document.getElementById("hand" + i).innerHTML =
            '<div class="card-body onclick=playCard" id="hand' +
            i +
            '"><img src="https://app.pixelencounter.com/api/basic/monsters/' +
            monster.img +
            '" style="width:50px;height:60px;" class="card-img-top" ><p><img src="coin.png" width="20" height="20">    -' +
            monster.cost +
            ' </p><p><img src="heart.png" width="20" height="20">    ' +
            monster.health +
            ' </p><p><img src="sword.png" width="20" height="20">    ' +
            monster.attack +
            " </p></div>";
        monster.position = "hand" + i;
        hand.push(monster);
        // document.getElementById('hand'+ i).addEventListener('click', playCard)
    }
};

const nextWave = () => {
    let count = opponentField.length;
    for (let i = 1; i < 5 - count; i++) {
        const monster = monsters.pop();
        opponentField.push(monster);
    }
    updateOpponentField();
};

function updateOpponentField() {
    for (let i = 1; i <= 4; i++) {
        if (opponentField[i - 1]) {
            let monster = opponentField[i - 1];
            document.getElementById("card0" + i).innerHTML =
                '<img src="https://app.pixelencounter.com/api/basic/monsters/' +
                monster.img +
                '" style="width:50px;height:60px;" class="card-img-top" ><p><img src="heart.png" width="20" height="20">    ' +
                monster.health +
                ' </p><p><img src="sword.png" width="20" height="20">    ' +
                monster.attack +
                " </p>";
        } else {
            document.getElementById("card0" + i).innerHTML = "";
        }
    }
}

const playCard = (position) => {
    if (battleStarted) return
    if (mana <= 0) return;
    if (playerField.length == 4) {
        return;
    }
    let monster = hand.find((monster) => {
        return monster.position == position;
    });
    if (monster.played) {
        return;
    }
    monster.played = true;
    playerField.push(monster);
    document.getElementById(position).innerHTML = "";
    updatePlayerField();
    mana--;
    updateMana();
};

function updatePlayerField() {
    for (let i = 1; i <= playerField.length; i++) {
        let monster = playerField[i - 1];
        document.getElementById("card" + i).innerHTML =
            '<img src="https://app.pixelencounter.com/api/basic/monsters/' +
            monster.img +
            '" style="width:50px;height:60px;" class="card-img-top" ><p><img src="heart.png" width="20" height="20">    ' +
            monster.health +
            ' </p><p><img src="sword.png" width="20" height="20">    ' +
            monster.attack +
            " </p><p>" +
            (monster.ability ? monster.ability : "") +
            "</p>";
    }
    for (let i = 4; i > playerField.length; i--) {
        document.getElementById("card" + i).innerHTML = "";
    }
}

const startBattle = () => {
    if (battleStarted) return
    battleStarted = true;
    hand = [];
    spells = [];
    let time = 1000;
    //while (opponentField.length && playerField.length) {
    for (monster in playerField) {
        if (playerField[monster].ability == "Quick Strike") {
            let index = parseInt(monster) + 1;
            playerField[monster].index = "card" + index;
            setTimeout(battle, time, playerField[monster], true);
            time += 1500;
        }
    }
    setTimeout(() => {
        opponentIsAttacking = true
        let internalTime = 0;
        for (i = 0; i < opponentField.length; i++) {
            if (!playerField.length) {
                break;
            }
            opponentField[i].index = "card0" + (i + 1);
            setTimeout(battle, internalTime, opponentField[i]);
            internalTime += 1500;
            time += 1500;
        }
    }, time);

    setTimeout(() => {
        let internalTime = 0;
        for (i = 0; i < playerField.length; i++) {
            if (!opponentField.length) {
                break;
            }
            playerField[i].index = "card" + (i + 1);
            setTimeout(battle, internalTime, playerField[i], true);
            internalTime += 1500;
            time += 1500;
        }
    }, time + 6000);

    // while (opponentField[0]?.health <= 0) {
    //     opponentField.shift()
    // }
    // for (i=0; i<playerField.length; i++) {
    //     let difference = 0
    //     if (!opponentField.length){
    //         break
    //     }
    //     if (playerField[i].ability != 'Quick Strike') {
    //         difference = playerField[i].attack - opponentField[0].health
    //         battle(playerField[i], opponentField[0])
    //     }
    //     if (playerField[i].ability == 'Trample'){
    //         //playerField[i].ability = null
    //         let j = i + 1
    //         while (difference > 0 && opponentField[j]) {
    //             let health = opponentField[j].health
    //             opponentField[j].health -= difference
    //             difference -= health;
    //             j++
    //         }
    //     }
    //     if (playerField[i].ability == 'Double Strike'){
    //         playerField[i].ability = null
    //         i--;
    //     }
    //     while (opponentField[0]?.health <= 0) {
    //         opponentField.shift()
    //     }
    //}
    //}
    setTimeout(() => {
        !playerField.length ? opponentScore++ : playerScore++;
        updateScores(playerScore, opponentScore);

        waveCount++;
        generateMonsters(waveCount, waveCount + 2, 9);
        nextWave();
        generateHand();
        generateSpells();
        battleStarted = false
    }, time + (playerField.length * 1500) + (opponentField.length * 1500));
};

function battle(attacker, isPlayer = false) {
    let defender;
    if (!isPlayer) {
        defender = playerField[0];
        if (!defender) return;
        defender.index = "card1";
    } else {
        defender = opponentField[0];
        if (!defender) return;
        defender.index = "card01";
    }
    console.log(attacker);

    setTimeout(() => {
        document.getElementById(defender.index).classList.add("defender");
    }, 300);
    document.getElementById(attacker.index).classList.add("attacker");

    setTimeout(() => {
        if (playerField[0].health <= 0) {
            playerField.splice(0, 1);
        }
        if (opponentField[0].health <= 0) {
            opponentField.splice(0, 1);
        }
        if (isPlayer)
        updateOpponentField();
        updatePlayerField();
        document.getElementById(attacker.index).classList.remove("attacker");
    }, 1000);
    setTimeout(() => {
        document.getElementById(defender.index).classList.remove("defender");
    }, 600);

    if (defender.ability == "Shield") {
        defender.ability = null;
        return;
    }
    defender.health -= attacker.attack;

    if (defender.ability == "Retaliate") {
        attacker.health -= defender.attack;
    }
}

updateScores(playerScore, opponentScore);
generateMonsters(waveCount, waveCount + 2, 9);
nextWave();
generateHand();
generateSpells();
