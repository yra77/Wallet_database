jQuery(document).ready(function($)
{

    $('.history').click(function()
    {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/history',
            success: function(response) 
            { 
                History(response);
            },
            error: function(xhr, status, err) 
            {
              console.log(xhr.responseText);
            }
           });
        
           function History(val) 
           {
            $('.secretCode').hide();
            $('.wallet').hide();
            $('#divReceive').show();
           
            var str = '';
            for(let i = 0; i < val.length; i++)
            {
                if(val[i] != '.')
                   str += val[i];
                   else
                     str += "<br/>";
            };
             $('#divReceive').html('<p style="color:white; margin-top: 3em;">' + str + '</p>'
             + '<p><button type="button" class="exit" style="font-size:80%; background-color:red; color:white; margin-top: 5em; margin-left: 35%;">back</button></p>');
           
              $('#divReceive .exit').click(function()
              {
                $('#divReceive').hide();
                 $('.secretCode').show();
                 $('.wallet').show();
              });
            }

    });

});