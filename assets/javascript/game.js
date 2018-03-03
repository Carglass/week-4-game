// todo
// should be impossible that attacker = defender

function SWChar(name, HP, AP, CP, id){
    this.name = name;
    this.HP = HP;
    this.maxHP = HP;
    this.AP = AP;
    this.baseAP = AP;
    this.CP = CP;
    this.id = id;
}

SWChar.prototype.setHP = function(newHP){
    this.HP = newHP;
    this.displayHP();
}

SWChar.prototype.displayHP = function(){
    $("#" + this.id + "HP").remove();
    let hp = $("<div>" + this.HP + " HP</div>");
    hp.attr("id",this.id + "HP");
    $("#" + this.id).append(hp);
}

SWChar.prototype.boostAP = function(){
    this.AP = this.AP + this.baseAP;
    this.displayAP();
}

SWChar.prototype.displayAP = function(){
    $("#" + this.id + "AP").remove();
    let ap = $("<div>" + this.AP + " AP</div>");
    ap.attr("id",this.id + "AP");
    $("#" + this.id).append(ap);
}

SWChar.prototype.reset = function(){
    this.setHP(this.maxHP);
    this.AP = this.baseAP;
    this.displayAP();
    $('#defenders').append($('#'+this.id));
}

let obiwan = new SWChar("Obi-Wan", 100, 10, 10, "obi");
let luke = new SWChar("Luke", 100, 10, 8, "luke");
let palpatine = new SWChar("Palpatine",150,15,3, "palpatine");


let game = {
    state: "init",
    players: [obiwan,luke,palpatine],
    attacker: "none",
    defender: "none",
    defenders: [],
    // attack manages the attack, 
    // then has the attacker AP increase,
    // then suppresses the game defender if he's dead
    attack: function(attacker,defender){
        attacker.setHP(attacker.HP - defender.CP);
        defender.setHP(defender.HP - attacker.AP);
        if (defender.HP <0){
            defender.setHP(0);
        }
        attacker.boostAP();
        if (!this.defenderStatus()){
            $('#deadDefenders').append($('#' + this.defender.id));
            this.defender = "none";
            this.setState("attackerSelected");
        }
        if (this.defendersAreDead()){
            this.setState("win");
        }
        this.displayGameState();

    },
    // We have several "status" functions that are called to evaluate different states
    // that can trigger a new game phase, or a display update.
    //
    // defenderStatus returns true if defender HP > 0, else false.
    defenderStatus: function(){
        if (this.defender.HP <= 0){
            return false;
        } else {
            return true;
        }
    },
    // defendersAreDead returnes true if all defensers are dead. 
    defendersAreDead: function(){
        let allDead = true;
        for (let i=0; i<this.defenders.length; i++){
            if (this.defenders[i].HP > 0){
                allDead = false;
            }
        }
        return allDead;
    },
    // displayPlayersStatus updates the players cards look to reflect
    // their current status.
    displayPlayersStatus: function(){
        for (let i=0; i<this.players.length; i++){
            $("#" + this.players[i].id).css("background-color","lightblue");
            if (this.players[i] === this.attacker){
                $("#" + this.players[i].id).css("background-color","green");
            } else if (this.players[i] === this.defender && this.players[i].HP > 0){
                $("#" + this.players[i].id).css("background-color","blue");
            } else if (this.players[i].HP <= 0){
                $("#" + this.players[i].id).css("background-color","grey");
            }
        }
    },
    displayGameState: function(){
        $("#scoreText").remove();
        if (game.state === "win"){
            let scoreText = $("<h1>You won!</h1>").attr("id","scoreText").addClass("col-6");
            $("#score").append(scoreText);
        } else if (game.state === "loose"){
            let scoreText = $("<h1>You lost!</h1>").attr("id","scoreText").addClass("col-6");
            $("#score").append(scoreText);
        } else if (game.state === "init"){
            let scoreText = $("<h1>Select your character</h1>").attr("id","scoreText").addClass("col-6");
            $("#score").append(scoreText);
        } else if (game.state === "attackerSelected"){
            let scoreText = $("<h1>Select the next opponent</h1>").attr("id","scoreText").addClass("col-6");
            $("#score").append(scoreText);
        } else if (game.state === "battleEngaged"){
            let scoreText = $("<h1>Now Fight!</h1>").attr("id","scoreText").addClass("col-6");
            $("#score").append(scoreText);
        }
    },
    setState: function(newState){
        this.state = newState;
        this.displayGameState();
    },
    reset: function(){
        this.attacker = "none";
        this.defender = "none";
        this.defenders = [];
        this.state = "init";
    }
}

$( document ).ready(function() {
    obiwan.displayHP();
    obiwan.displayAP(); 
    luke.displayHP();
    luke.displayAP();
    palpatine.displayHP();
    palpatine.displayAP();
    // the event when Luke card is clicked, may depend 
    // on game phase
    $("#luke").click(function(){
        if (game.state === "init"){
            game.attacker = luke;
            game.defenders = [palpatine,obiwan];
            game.setState("attackerSelected");
            $('#attacker').append($('#luke'));
        } else if (game.state === "attackerSelected"){
            if (game.attacker !== luke){
                game.defender = luke;
                game.setState("battleEngaged");
                $('#currentDefender').append($('#luke'));
            }
        } else if (game.state === "battleEngaged"){
            console.log("Everybody has been chosen");
        } else {
            console.log("game is finished");
        }
        game.displayPlayersStatus();
    });

    // the event when Obi-Wan card is clicked, may depend 
    // on game phase
    $("#obi").click(function(){
        if (game.state === "init"){
            game.attacker = obiwan;
            game.defenders = [luke,palpatine];
            game.setState("attackerSelected");
            $('#attacker').append($('#obi'));
        } else if (game.state === "attackerSelected"){
            if (game.attacker !== obiwan){
                game.defender = obiwan;
                game.setState("battleEngaged");
                $('#currentDefender').append($('#obi'));
            }
        } else if (game.state === "battleEngaged"){
            console.log("Everybody has been chosen");
        } else {
            console.log("game is finished");
        }
        game.displayPlayersStatus();
    });

    // the event when Palpatine card is clicked, may depend 
    // on game phase
    $("#palpatine").click(function(){
        if (game.state === "init"){
            game.attacker = palpatine;
            game.defenders = [luke,obiwan];
            game.setState("attackerSelected");
            $('#attacker').append($('#palpatine'));
        } else if (game.state === "attackerSelected"){
            if (game.attacker !== palpatine){
                game.defender = palpatine;
                game.setState("battleEngaged");
                $('#currentDefender').append($('#palpatine'));
            }
        } else if (game.state === "battleEngaged"){
            console.log("Everybody has been chosen");
        } else {
            console.log("game is finished");
        }
        game.displayPlayersStatus();
    });

    // What happens when Attack button is clicked
    $("#attack").click(function(){
        if (game.state === "init" || game.state === "attackerSelected"){
            console.log("Select the players first!");
        } else if (game.state === "battleEngaged"){
            game.attack(game.attacker,game.defender);
        } else if (game.state === "win" || game.state === "loose"){
            console.log("game is finished");
        }
    
        game.displayPlayersStatus();
    });

    $("#restart").click(function(){
        luke.reset();
        obiwan.reset();
        palpatine.reset();
        game.reset();
        game.displayPlayersStatus();
    })
});


