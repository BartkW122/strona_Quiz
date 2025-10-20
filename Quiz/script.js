function losowanie_indeksow() {
  let losowane_indexy = [];

  while (losowane_indexy.length < 20) {
    let liczba = Math.floor(Math.random() * 20); 
    if (!losowane_indexy.includes(liczba)) {
      losowane_indexy.push(liczba);
    }
  }

  return losowane_indexy;
}

let tab_indexy = losowanie_indeksow();

function sprawdzenie_ilosci_odpowiedzi(dlugosc){
    if(dlugosc == 1){
        return true
    }
    if(dlugosc > 1){
        return false
    }
}

function  obsluga_button(){

    let ilosc_klik = 1;
    $("button.next").on("click",function(){
        console.log(ilosc_klik);
        if(ilosc_klik<20){

            ilosc_klik ++;

        }else{

            ilosc_klik = 1;

            alert("koniec")
            let btn_powtorz = document.createElement("button");

            btn_powtorz.textContent = "Powtorz";
            btn_powtorz.id = "powtorz";

            $("div#conatiner").append(btn_powtorz);

            $("button#powtorz").on("click",function(){
                
                    $("div#pytania").empty();
                    $(this).remove();
                    generowanie_pytan();

            })

        }
        //console.log($(this).parent().hide())
    })
}
function przyrownanie_tablic(tab1,tab2){
    if (tab1.length !== tab2.length) {
        return false;
    }

    return tab1.every((value, index) => {
        return value === tab2[index];
    });
}
function sprawdzanie_odpowiedzi(tab_id){

    $.getJSON('pytania.json', function(data) {
            let pytania = data.quiz;
            let szukane_question_id;
            let wynik = null;

            if(tab_id.length > 1){
                let tab_ids = [];

                tab_id.forEach(item=>{
                    szukane_question_id = parseInt(item.key);
                    tab_ids.push(parseInt(item.value))
                })

                 pytania.forEach(item=>{
                    if(item.question_id == szukane_question_id){
                        console.log(item);
                        console.log("answer =>"+item.correct_answers);
                        console.log("tab =>"+tab_ids)

                        if(przyrownanie_tablic(item.correct_answers,tab_ids)){
                            wynik = {
                                question_id:szukane_question_id,
                                zgodnosc:true
                            };
                        }else{
                            wynik = {
                                question_id:szukane_question_id,
                                zgodnosc:false
                            };
                        }

                    }
                })
                
            }else{
                let sprawdzana_odp;

                tab_id.forEach(item=>{

                    szukane_question_id = parseInt(item.key);
                    sprawdzana_odp = parseInt(item.value);
                    
                })

                pytania.forEach(item=>{
                    if(item.question_id == szukane_question_id){
                        console.log(item);
                        console.log(item.correct_answers);
                        if(item.correct_answers == sprawdzana_odp){
                            wynik = {
                                question_id:szukane_question_id,
                                zgodnosc:true
                            };
                        }else{
                            wynik = {
                                question_id:szukane_question_id,
                                zgodnosc:false
                            };
                        }
                    }
                })
                
            }
            
        return wynik;
    });
}

function obsluga_input(){
    let tab_odpowedzi=[];
    let tablica_sprawdzonych_odpowiedzi = [];
    let temp;
    $("button.next").on("click",function(){
        for(let i  = 0;i<4;i++){
            if($(this).parent().children(".odpowiedzi")[i].checked){
                console.log($(this).parent().children(".odpowiedzi")[i]);
                temp ={
                    "key":$(this).parent().children(".odpowiedzi")[i].id.split("-")[1],
                    "value":$(this).parent().children(".odpowiedzi")[i].id.split("-")[2]
                }
                tab_odpowedzi.push(temp)
            }
        }
        /*console.log(temp)
        console.log(tab_odpowedzi);*/
        tablica_sprawdzonych_odpowiedzi.push(sprawdzanie_odpowiedzi(tab_odpowedzi));
        console.log(tablica_sprawdzonych_odpowiedzi);
        tab_odpowedzi = [];
    });

}

function generowanie_pytan(){
    
     let liczba = 0;

    $.getJSON('pytania.json', function(data) {
            let pytania = data.quiz;

            tab_indexy.forEach(index => {
            let pytanie = pytania[index];
            
            let div = document.createElement("div");
            let h3 = document.createElement("h3");
            let button = document.createElement("button");
            
            button.textContent = "Dalej";
            button.classList.add("next");
            liczba++;
            h3.textContent = `${liczba}, ${pytanie.question}`
            
            div.appendChild(h3);
            
            if(sprawdzenie_ilosci_odpowiedzi(pytanie.correct_answers.length)){
                pytanie.options.forEach((opcja, i) => {
                    
                    let input = document.createElement("input");
                    input.type = "radio";
                    input.classList.add("odpowiedzi");
                    input.name = `odpowiedz-${index}`;
                    input.id = `id-${pytanie.question_id}-${i}`;
                    input.value = opcja;

                    let label = document.createElement("label");
                    label.setAttribute("for", input.id);
                    label.textContent = opcja;

                    div.appendChild(input);
                    div.appendChild(label);
                    div.appendChild(document.createElement("br"));
                });

            }else{
                 pytanie.options.forEach((opcja, i) => {
                
                    let input = document.createElement("input");
                    input.type = "checkbox";
                    input.classList.add("odpowiedzi");
                    input.name = `odpowiedz-${index}`;
                    input.id = `id-${pytanie.question_id}-${i}`;
                    input.value = opcja;

                    let label = document.createElement("label");
                    label.setAttribute("for", input.id);
                    label.textContent = opcja;

                    div.appendChild(input);
                    div.appendChild(label);
                    div.appendChild(document.createElement("br"));
                });

            }

            div.appendChild(button)
    
            $("div#pytania").append(div)

        });

        obsluga_button();
        obsluga_input();
    });
}

$(document).ready(function() {
    generowanie_pytan();
});


