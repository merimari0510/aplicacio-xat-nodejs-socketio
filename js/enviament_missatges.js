jQuery(function($) {
   //Creem un socket
   var socket = io.connect();
   //Formulari per enviar un missatge
   var $messageForm = $('#send-message');
   //El missatge a enviar
   var $messageBox = $('#message');
   //El panel de chat
   var $chat = $('#chat');
   //Els miisatges del chat
   var $messages_chat = $('#messages');
   //El botó per el qual s'envia el missatge
   var $buttonSend = $('#send');
   
   //Formulari del nickname
   var $nickForm = $('#setNick');
   //El nickname a enviar
   var $nickBox = $('#nickname');
   //La llista d'usuaris que hi ha
   var $users = $('#users');
   //Creu de l'alerta de l'error
   var $closeAlert = $('#closeAlert');
   
   
   
   $nickForm.click(function(e) {
	   e.preventDefault();
	   console.log("nickform");
	   //El socket emet el missatge de "new user" on envia el nickname i espera un valor retornat 
	   //Si el valor és true, llavors amaga el formulari del nickname i mostra la sala de chat
	   //Si el valor és fals, llavors mostra el missatge d'error: "Aquest nickname ja està utilitzat. Prova-ho amb un altre."
	   socket.emit('new user', $nickBox.val(), function(data) {
			console.log("new user");
		   if(data) {
				console.log("new nickname is OK");
			   $('#nickWrap').hide();
			   $('#linia_top_nick').hide();
			   $('#linia_bottom_nick').hide();
			   $('#contentWrap').show();
		   } else {
				console.log("new nickname is WRONG");
			   $("#login-error").show();
		   }
	   });
	   //Eliminem el valor del nickname
	   $nickBox.val('');
   });
   
   //Quan cliquem la creu de l'alerta "Aquest nickname ja està utilitzat. Prova-ho amb un altre.", s'amagarà l'error
   $closeAlert.click(function(e) {
		$("#login-error").hide();
   });
   
   //Quan enviem un missatge, s'envia pel socket "send message" amb el valor del missatge.
   $messageForm.submit(function(e) {
	   e.preventDefault();
	   console.log("messageForm submit");
	   if($messageBox.val()!='') {
			console.log("send message"+$messageBox.val());
			socket.emit('send message', $messageBox.val());
		}
		//Eliminem el valor del missatge
	   $messageBox.val('');
   });
   
   //Quan reps un missatge "new message", s'afageix en el chat, el nickname i el missatge
   socket.on('new message', function(data) {
		console.log('<b>'+data.nick+":</b> "+data.msg+"<br/>");
	  $messages_chat.append('<li><b>'+data.nick+":</b> "+data.msg+"</li>"); 
   });
   
   //Quan reps un missatge "new message", s'afageix en el chat, el nickname i el missatge
   socket.on('usernameDisconnect', function(data) {
		console.log('Username Disconnect '+data.nick);
	  $messages_chat.append("<li>L'usuari <b>"+data.nick+"</b> s'ha desconnectat</li>"); 
   });
   
   //Quan reps el missatge "usernames", s'insereixen tots els nicknames dels usuaris en el div dels usuaris
   socket.on('usernames', function(data) {
		console.log("usernames");
		var html = '';
		for (var username in data) {
			html += "<p>" + username + '</p>';
		}
		$users.html(html);
	});
   
});