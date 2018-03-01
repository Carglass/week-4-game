// todo
// should be impossible that attacker = defender

function SWChar(name, HP, AP, CP, id){
    this.name = name;
    this.HP = HP;
    this.AP = AP;
    this.CP = CP;
    this.id = id;
}

let obiwan = new SWChar("Obi-Wan", 100, 10, 10, "obi");
let luke = new SWChar("Luke", 100, 10, 8, "luke");
let palpatine = new SWChar("Palpatine",150,15,3, "palpatine");

let game = {
    players: [obiwan,luke,palpatine],
    attacker: "none",
    defender: "none",
    defenders: [],
    attack: function(attacker,defender){
        attacker.HP = attacker.HP - defender.CP;
        defender.HP = defender.HP - attacker.AP;
        attacker.AP = attacker.AP*2;
        console.log(attacker);
        console.log(defender);
        if (defender.HP <= 0){
            game.defender = "none";
        }
    },
    defenderStatus: function(){
        if (this.defender.HP <= 0){
            return false;
        } else {
            return true;
        }
    },
    defendersAreDead: function(){
        let allDead = true;
        for (let i=0; i<this.defenders.length; i++){
            if (this.defenders[i].HP > 0){
                allDead = false;
            }
        }
        return allDead;
    },
    displayGameStatus: function(){
        for (let i=0; i<this.players.length; i++){
            if (this.players[i] === this.attacker){
                $("#" + this.players[i].id).css("background-color","green");
            } else if (this.players[i] === this.defender && this.players[i].HP > 0){
                $("#" + this.players[i].id).css("background-color","blue");
            } else if (this.players[i].HP <= 0){
                $("#" + this.players[i].id).css("background-color","grey");
            }
        }
    }
}

$( document ).ready(function() {

    $("#luke").click(function(){
        if (game.attacker === "none"){
            game.attacker = luke;
            game.defenders = [obiwan,palpatine];
            console.log("Luke attacks");
        } else if (game.defender === "none"){
            game.defender = luke;
            console.log("Luke defends");
        }
        else {
            console.log("Attacker has been chosen");
        }
        game.displayGameStatus();
    });

    $("#obi").click(function(){
        if (game.attacker === "none"){
            game.attacker = obiwan;
            game.defenders = [luke,palpatine];
            console.log("Obi attacks");
        } else if(game.defender === "none"){
            game.defender = obiwan;
            console.log("Obi defends");
        } else {
            console.log("Everybody has been chosen");
        }
        game.displayGameStatus();
    });

    $("#palpatine").click(function(){
        if (game.attacker === "none"){
            game.attacker = palpatine;
            game.defenders = [luke,obiwan];
            console.log("Palpi attacks");
        } else if (game.defender === "none"){
            game.defender = palpatine;
            console.log("Palpi defends");
        } else {
            console.log("Everybody has been chosen");
        }
        game.displayGameStatus();
    });

    $("#attack").click(function(){
        if (game.defender !== "none" && game.attacker !== "none"){
            if (game.defenderStatus()){
                game.attack(game.attacker,game.defender);
            } else {
                console.log(game.defender.name + " is dead!");
                game.defender = "none";
                if (game.defendersAreDead()){
                    console.log("You killed everybody!");
                } else {
                    console.log("Choose the next defender")
                }
            }
        } else {
            if (game.defendersAreDead()){
                $("#bodyContent").append("<h1>You killed everybody</h1>");
                console.log("You killed everybody!");
            } else {
                console.log("Pick your players first dummy");
            }
        }
        game.displayGameStatus();
    });
});


