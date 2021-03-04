$(document).ready(function(){
    console.log('howaya?');

    $('.input-region').on('keypress', textEntered);
});

function textEntered(){
    console.log(this.value);
}