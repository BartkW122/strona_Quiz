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
        if(ilosc_klik<=20){

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
        console.log(this)
    })
}

function obsluga_input(tab){
    $("input").on("click",function(){
        console.log($(this))
        if(!tab.includes($(this))){
            tab.push($(this));
        }
    })
}

function generowanie_pytan(){
    let tab_odpowiedzi = [];
     let tab_indexy = losowanie_indeksow();
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
                    input.name = `odpowiedz-${index}`;
                    input.id = `id-${index}-${i}`;
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
                    input.name = `odpowiedz-${index}`;
                    input.id = `id-${index}-${i}`;
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
        obsluga_input(tab_odpowiedzi);
    });
}
$(document).ready(function() {
    generowanie_pytan();
});


