$(document).ready(function () {
  $("#sendMessage").on("click", function () {
    const message = $("#messageInput").val(); // Récupère la valeur de l'input
    if (message.length > 0) {
      createMessage(message); // Appelle la fonction avec le message
    } else {
      alert("Le message ne peut pas être vide !");
    }
  });

  $("#messageInput").on("keydown", function (event) {
    if (event.key == "Enter") {
      event.preventDefault();
      $("#sendMessage").click();
    }
  });

  function createMessage(message) {
    $.ajax({
      url: "/ajaxMessage",
      type: "POST", // On repasse en POST
      async: true,
      data: { message: message }, // Envoie le message en POST
      dataType: "json",
      success: function (results) {
        const resultsValues = Object.values(results);
        $("#postsContainer").append(`
                    <div class="post">
                        <p>${resultsValues[0]}</p>
                        <span>Posté par l'utilisateur ID: ${resultsValues[1]}</span>
                    </div>
                `);
        $("#messageInput").val("");
      },
      error: function (request, error) {
        console.log("Erreur :", error);
      },
    });
  }
});
