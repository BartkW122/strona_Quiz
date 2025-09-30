$(document).ready(function(){
    let div = document.createElement("div");
    let h3 = document.createElement("h3");
    let input = document.createElement("input");
    let label = document.createElement("label");

    $.getJSON('pytania.json', function(data){
        $.each(data,function(key, val) {
            $.each(val,function(key2,val2){
                
            })
        });
    });
});