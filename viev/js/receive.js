jQuery(document).ready(function($)
{
 
    $('#divReceive').hide();

  $('.butReceive').click(function()
  {
    var id = $(this).closest("tr").attr("id");//this.parentNode.id;
 
$.ajax({
    type: 'POST',
    url: 'http://localhost:8080/receive',
    data: {
            id :id
         },
    success: function(response) 
    { 
        //console.log(response);
        Receive(response, id);
    },
    error: function(xhr, status, err) 
    {
      console.log(xhr.responseText);
    }
   });
  });
  
function Receive(val, id) 
{
    $('.secretCode').hide();
    $('.wallet').hide();
    $('#divReceive').show();
    
    if(id === "shiba_inu" || id === "tether")
       id += "<p style='color:red'> network erc20 only</p>";
       if(id === "bnb" || id === "busd")
       id += "<p style='color:red'> network bep20 only</p>";
    $("#divReceive").html('<p style="color:white; margin-top: 3em;">The address of this wallet ' + id + '</p><span style="color:chartreuse;" class="receiveCopy">' + val + ' </span><button class="fa copy">&#xf0c5; copy</button>'
    + '<p><button type="button" class="exit" style="font-size:80%; background-color:red; color:white; margin-top: 5em; margin-left: 35%;">back</button></p>');

    $('#divReceive .exit').click(function()
    {
        $('#divReceive').hide();
        $('.secretCode').show();
        $('.wallet').show();
    });

   $('.copy').click(function()
   {
    var text = $(".receiveCopy").text();
    navigator.clipboard.writeText(text);
   });

}

});