var policyDeck=Array(11).fill('Política fascista')
$.merge(policyDeck, Array(6).fill('Política liberal'))
var discardPile=[]
var currentPolicies=[]

var rules={
    5:["Nothing","Nothing","Examine","Kill","Kill"],
    6:["Nothing","Nothing","Examine","Kill","Kill"],
    7:["Nothing","Investigate","Pick","Kill","Kill"],
    8:["Nothing","Investigate","Pick","Kill","Kill"],
    9:["Investigate","Investigate","Pick","Kill","Kill"],
    10:["Investigate","Investigate","Pick","Kill","Kill"]
}

var numPlayers;

var isVetoUnlocked=false
var isFirstVeto=true

var numLiberales=0
var numFascistas=0

function set_number_of_players(form){
    numPlayers=parseInt($('input[name="jugadores"]:checked').val());
    $("#AskNumPlayers").hide()
    update_board()
    $("#Tablero").show()
}

function update_board(){
    var tabLiberal="Políticas liberales:<br>|_|_|_|_|_|<br><br>"
    var tabFascista="Políticas fascistas:<br>|_|_|_|_|_|_|<br><br>"
    
    for(i=0;i<numLiberales;i++){
        tabLiberal=tabLiberal.replace("_","x")
    }
    
    for(i=0;i<numFascistas;i++){
        tabFascista=tabFascista.replace("_","x")
    }
        
    $("#PoliticasLiberales").html(tabLiberal)
    $("#PoliticasFascistas").html(tabFascista)
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function remove(array,element){
    array.splice(array.indexOf(element),1);
}

function newPolicyDeck(){
    while(discardPile.length>0){
        policyDeck.push(discardPile.pop())
    }
    shuffle(policyDeck)
}

function showAction(action){
    switch(action) {
        case "Examine":
            examine()
            break
        case "Investigate":
            alert("El presidente tiene que ver la carta de afiliación de partido de alguien de la mesa.")
            break
        case "Pick":
            alert("El presidente tiene que elegir al siguiente presidente.\nDespués de esta ronda el presidente vuelve a pasarse a la izquierda como de costumbre.")
            break
        case "Kill":
            alert("El presidente tiene que matar a alguien.\nSi quien muere es Hitler tiene que decirlo. Si no lo es, muere sin revelar de qué partido era.")
            break
        default:
        
    }
}

function examine(){
    alert("El presidente tiene que ver las 3 políticas que hay en la pila.\nDale ok sólo si eres el presidente.")
    var message="Las tres siguiente políticas son:\n"+policyDeck[policyDeck.length-1]+"\n"+policyDeck[policyDeck.length-2]+"\n"+policyDeck[policyDeck.length-3]
    alert(message)
}

function apply_policy(actual){
    var masFascismo=false
    if(actual=='Política fascista'){
        numFascistas++
        masFascismo=true
    }else{
        numLiberales++
    }
    
    if(numFascistas==5){
        isVetoUnlocked=true
        if(masFascismo){
            alert("¡Activado poder de veto!")
        }
    }
    
    $("#Tablero").show()   
    update_board()
    
    if(numFascistas==6){
        $("#Tablero button").hide()
        $("#FasistWin").show()
    }
    else if(numLiberales==5){
        $("#Tablero button").hide()
        $("#LiberalWin").show()
    }
    else if(masFascismo){
        setTimeout(function(){ showAction(rules[numPlayers][numFascistas-1]);}, 100);
    }
}

function apply_top(){
    if(policyDeck<1){
        newPolicyDeck()
    }
    
    apply_policy(policyDeck.pop())
}

function take_three(){
    if(policyDeck<3){
        newPolicyDeck()
    }
    currentPolicies.push(policyDeck.pop())
    currentPolicies.push(policyDeck.pop())
    currentPolicies.push(policyDeck.pop())
    alert("Dale ok sólo si eres el presidente.")
    $("#Tablero").hide()
    $("#politicaPresi0").html(currentPolicies[0])
    $("#politicaPresi1").html(currentPolicies[1])
    $("#politicaPresi2").html(currentPolicies[2])
    $("#EligePresi").show()
}

//Para que el presi elija 2
$(function () {
    $('input[name="politicaPresi"]').click(function () {
        var ticked=$('input[name="politicaPresi"]:checked').length
        $('#AceptarPresi').prop('disabled', ticked!=2);
    });
});

function pasar_canci(){
    $("#EligePresi").hide()
    var discard=currentPolicies[$('input[name="politicaPresi"]:not(:checked)')[0].value]
    discardPile.push(discard)
    remove(currentPolicies,discard)
    
    $('input[name="politicaPresi"]')[0].checked=false
    $('input[name="politicaPresi"]')[1].checked=false
    $('input[name="politicaPresi"]')[2].checked=false
    
    setTimeout(function(){
        alert("Dale ok sólo si eres el canciller.");
        
        $("#politicaCanci0").html(currentPolicies[0])
        $("#politicaCanci1").html(currentPolicies[1])
        $("#EligeCanci").show()
        
        if(isVetoUnlocked && isFirstVeto){
            $('#Vetar').prop('disabled', false);
        }
    }, 10);
}

//Para que el canci elija 1
$(function () {
    $('input[name="politicaCanci"]').click(function () {
        var ticked=$('input[name="politicaCanci"]:checked').length
        $('#AceptarCanci').prop('disabled', ticked!=1);
    });
});

function apply_three(){
    $("#EligeCanci").hide()
    var discard=currentPolicies[$('input[name="politicaCanci"]:not(:checked)')[0].value]
    discardPile.push(discard)
    remove(currentPolicies,discard)
    
    $('input[name="politicaCanci"]')[0].checked=false
    $('input[name="politicaCanci"]')[1].checked=false
    isFirstVeto=true
    
    apply_policy(currentPolicies.pop())
}

function veto(){
    $("#EligeCanci").hide()
    $("#EligeVeto").show()
}

function veto_si(){
    $('input[name="politicaCanci"]')[0].checked=false
    $('input[name="politicaCanci"]')[1].checked=false
    
    discardPile.push(currentPolicies.pop())
    discardPile.push(currentPolicies.pop())
    
    $("#EligeVeto").hide()
    update_board()
    $("#Tablero").show()
}

function veto_no(){
    isFirstVeto=false
    $('#Vetar').prop('disabled', true);
    $("#EligeVeto").hide()
    $("#EligeCanci").show()
}

function refresh(){
    location.reload();
}

shuffle(policyDeck)
