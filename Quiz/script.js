
let tab_indexy = losowanie_indeksow();
let tablica_sprawdzonych_odpowiedzi = [];


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

function przyrownanie_tablic(tab1, tab2) {
    if (tab1.length !== tab2.length) {
        return false;
    }
    for (let i = 0; i < tab1.length; i++) {
        if (tab1[i] !== tab2[i]) {
            return false;
        }
    }
    return true;
}


function sprawdzanie_odpowiedzi(tab_id) {
    let wynik = null;

    $.ajax({
        url: 'pytania.json',
        dataType: 'json',
        async: false,
        success: function(data) {
            let pytania = data.quiz;
            let szukane_question_id;

            if (tab_id.length > 1) {
                let tab_ids = [];
                for (let i = 0; i < tab_id.length; i++) {
                    szukane_question_id = parseInt(tab_id[i].key);
                    tab_ids.push(parseInt(tab_id[i].value));
                }
                for (let i = 0; i < pytania.length; i++) {
                    if (pytania[i].question_id == szukane_question_id) {
                        if (przyrownanie_tablic(pytania[i].correct_answers, tab_ids)) {
                            wynik = {"zgodnosc": true};
                        } else {
                            wynik = {"zgodnosc": false};
                        }
                    }
                }
            } else {
                let sprawdzana_odp;
                for (let i = 0; i < tab_id.length; i++) {
                    szukane_question_id = parseInt(tab_id[i].key);
                    sprawdzana_odp = parseInt(tab_id[i].value);
                }
                for (let i = 0; i < pytania.length; i++) {
                    if (pytania[i].question_id == szukane_question_id) {
                        if (pytania[i].correct_answers == sprawdzana_odp) {
                            wynik = {"zgodnosc": true};
                        } else {
                            wynik = {"zgodnosc": false};
                        }
                    }
                }
            }
        }
    });

    return wynik;
}


function generowanie_pytan() {
    let liczba = 0;

    $.getJSON('pytania.json', function(data) {
        let pytania = data.quiz;

        for (let j = 0; j < tab_indexy.length; j++) {
            let index = tab_indexy[j];
            let pytanie = pytania[index];

            let div = document.createElement("div");
            div.style.display = "none";

            let h3 = document.createElement("h3");
            h3.textContent = (liczba + 1) + ", " + pytanie.question;
            div.appendChild(h3);

            if (pytanie.correct_answers.length == 1) {
                for (let i = 0; i < pytanie.options.length; i++) {
                    let input = document.createElement("input");
                    input.type = "radio";
                    input.classList.add("odpowiedzi");
                    input.name = "odpowiedz-" + index;
                    input.id = "id-" + pytanie.question_id + "-" + i;
                    input.value = i;

                    let label = document.createElement("label");
                    label.setAttribute("for", input.id);
                    label.textContent = pytanie.options[i];

                    div.appendChild(input);
                    div.appendChild(label);
                    div.appendChild(document.createElement("br"));
                }
            } else {
                for (let i = 0; i < pytanie.options.length; i++) {
                    let input = document.createElement("input");
                    input.type = "checkbox";
                    input.classList.add("odpowiedzi");
                    input.name = "odpowiedz-" + index;
                    input.id = "id-" + pytanie.question_id + "-" + i;
                    input.value = i;

                    let label = document.createElement("label");
                    label.setAttribute("for", input.id);
                    label.textContent = pytanie.options[i];

                    div.appendChild(input);
                    div.appendChild(label);
                    div.appendChild(document.createElement("br"));
                }
            }

            let button = document.createElement("button");
            button.textContent = "Dalej";
            button.classList.add("next");
            div.appendChild(button);

            $("div#pytania").append(div);
            liczba++;
        }

        let currentIndex = 0;
        $("div#pytania div").eq(currentIndex).show();

        $("button.next").on("click", function() {
            let tab_odpowedzi = [];

            $(this).parent().children(".odpowiedzi").each(function() {
                if (this.checked) {
                    tab_odpowedzi.push({"key": this.id.split("-")[1], "value": this.id.split("-")[2]});
                }
            });

            tablica_sprawdzonych_odpowiedzi.push(sprawdzanie_odpowiedzi(tab_odpowedzi));

            $(this).parent().hide();
            currentIndex++;

            if (currentIndex < tab_indexy.length) {
                $("div#pytania div").eq(currentIndex).fadeIn();
            } else {
                let poprawne = 0;
                for (let i = 0; i < tablica_sprawdzonych_odpowiedzi.length; i++) {
                    if (tablica_sprawdzonych_odpowiedzi[i].zgodnosc === true) {
                        poprawne++;
                    }
                }

                $("div#pytania").html("<h2>Twój wynik: " + poprawne + " / " + tablica_sprawdzonych_odpowiedzi.length + "</h2>");

                let btn_powtorz = document.createElement("button");
                btn_powtorz.textContent = "Powtórz";
                btn_powtorz.id = "powtorz";
                $("div#pytania").append(btn_powtorz);

                $("button#powtorz").on("click", function() {
                    $("div#pytania").empty();
                    tablica_sprawdzonych_odpowiedzi = [];
                    tab_indexy = losowanie_indeksow();
                    generowanie_pytan();
                });
            }
        });
    });
}

$(document).ready(function() {
    generowanie_pytan();
});
