$(document).ready(function(){
    $.getJSON('pytania.json', function(data){
        $.each(data, function(key, val) {
            $.each(val, function(key2, val2){
               
                let div = document.createElement("div");
                let h3 = document.createElement("h3");

                h3.innerHTML = val2.question;
                div.setAttribute("id", `pytanie-${key2}`);
                div.appendChild(h3);


                val2.options.forEach((element, index) => {
                    let input = document.createElement("input");
                    let label = document.createElement("label");
                    let br = document.createElement("br"); 

                    input.setAttribute("type", "checkbox");
                    input.setAttribute("name", `odpowiedz-${key2}`);
                    input.setAttribute("id", `id-${key2}-${index}`);
                    input.setAttribute("value", `${key2}`);
                    input.value = element;

                    label.setAttribute("for", `id-${key2}-${index}`);
                    label.innerHTML = element;

                    div.appendChild(input);
                    div.appendChild(label);
                    div.appendChild(br);
                    console.log(div)
                });

                document.body.appendChild(div);
            });
        });
    });
});
