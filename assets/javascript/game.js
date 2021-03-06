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
    let hp = $("<div>"+ this.HP +"HP</div>").css("border","1px solid black");
    let currentHp = $("<div></div>").css("width",Math.floor((this.HP/this.maxHP)*100)+"%").css("background-color","rgba(71, 175, 26, 0.5)").css("height","24px").css("position","absolute").css("top","0");
    hp.attr("id",this.id+"HP").css("position","relative");
    $("#" + this.id + "Stats").append(hp);
    hp.append(currentHp);
}

SWChar.prototype.boostAP = function(){
    this.AP = this.AP + this.baseAP;
    this.displayAP();
}

SWChar.prototype.displayAP = function(){
    $("#" + this.id + "AP").remove();
    let ap = $("<div>" + this.AP + " AP</div>");
    ap.attr("id",this.id + "AP");
    $("#" + this.id +"Stats").append(ap);
}

SWChar.prototype.reset = function(){
    this.setHP(this.maxHP);
    this.AP = this.baseAP;
    this.displayAP();
    $('#defenders').append($('#'+this.id));
    $('#'+this.id).removeClass("col-6");
    $('#'+this.id).removeClass("col-3");
    $('#'+this.id).addClass("col-3");
}

let obiwan = new SWChar("Obi-Wan", 120, 11, 16, "obi");
let luke = new SWChar("Luke", 110, 14, 8, "luke");
let palpatine = new SWChar("Palpatine",130,10,13, "palpatine");
let rey = new SWChar("Rey", 90, 18, 19, 'rey');


let game = {
    state: "init",
    players: [obiwan,luke,palpatine, rey],
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
        if(this.attacker.HP <= 0){
            this.attacker.HP = 0;
            this.setState('loose');
            this.attacker.displayHP();
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
            $("#" + this.players[i].id).css("background-color","transparent");
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
        this.displayGameState();
    }
}

$( document ).ready(function() {
    obiwan.displayHP();
    obiwan.displayAP(); 
    luke.displayHP();
    luke.displayAP();
    palpatine.displayHP();
    palpatine.displayAP();
    rey.displayHP();
    rey.displayAP();
    game.displayGameState();
    // the event when Luke card is clicked, may depend 
    // on game phase
    $("#luke").click(function(){
        if (game.state === "init"){
            game.attacker = luke;
            game.defenders = [palpatine,obiwan,rey];
            game.setState("attackerSelected");
            $('#attacker').append($('#luke'));
        } else if (game.state === "attackerSelected"){
            if (game.attacker !== luke){
                game.defender = luke;
                game.setState("battleEngaged");
                $('#currentDefender').append($('#luke'));
                $('#luke').removeClass('col-3');
                $('#luke').addClass('col-6');
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
            game.defenders = [luke,palpatine,rey];
            game.setState("attackerSelected");
            $('#attacker').append($('#obi'));
        } else if (game.state === "attackerSelected"){
            if (game.attacker !== obiwan){
                game.defender = obiwan;
                game.setState("battleEngaged");
                $('#currentDefender').append($('#obi'));
                $('#obi').removeClass('col-3');
                $('#obi').addClass('col-6');
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
            game.defenders = [luke,obiwan,rey];
            game.setState("attackerSelected");
            $('#attacker').append($('#palpatine'));
        } else if (game.state === "attackerSelected"){
            if (game.attacker !== palpatine){
                game.defender = palpatine;
                game.setState("battleEngaged");
                $('#currentDefender').append($('#palpatine'));
                $('#palpatine').removeClass('col-3');
                $('#palpatine').addClass('col-6');
            }
        } else if (game.state === "battleEngaged"){
            console.log("Everybody has been chosen");
        } else {
            console.log("game is finished");
        }
        game.displayPlayersStatus();
    });

    // the event when Rey card is clicked, may depend 
    // on game phase
    $("#rey").click(function(){
        if (game.state === "init"){
            game.attacker = rey;
            game.defenders = [palpatine,obiwan,luke];
            game.setState("attackerSelected");
            $('#attacker').append($('#rey'));
        } else if (game.state === "attackerSelected"){
            if (game.attacker !== rey){
                game.defender = rey;
                game.setState("battleEngaged");
                $('#currentDefender').append($('#rey'));
                $('#rey').removeClass('col-3');
                $('#rey').addClass('col-6');
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
        rey.reset();
        game.reset();
        game.displayPlayersStatus();
    })
});





