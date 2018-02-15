$(document).ready(()=>{

    $('#input').on("change",(evt) =>{
        let mode = $('#mode').val();
        let text = $('#input').val();
        $.get('/'+mode,{text:text})
            .done((data)=>{
            console.log(data);
            $('#results').prepend('<li>'+data['result']+'</li>');
            $('#input').val('');
        }).fail((xhr)=>{
            alert('Prob contacting server');
            console.log(xhr);
        });
    });
});