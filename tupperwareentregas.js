function initAnimate() {

    $(".logoInit").animate({
        "margin-left": "40%"
    }, 1500, function() {
        $(".logoInit").hide();
        $(".HomeScreen").show(100);
    });
}

function searchDelivery() {

    var dataJson = {}

    if ($(".codigoConsultora").val() != "") {

        $.get("https://raw.githubusercontent.com/tupperwareentregas/tupperwareentregas.github.io/main/data/data.json", function(data) {
            dataJson = JSON.parse(data).entregasVisualizacao;

            var deliveryItem = dataJson.filter(function(delivery) {
                return delivery.CodigoConsultora == $(".codigoConsultora").val();
            });

            if (deliveryItem.length > 0) {

                $(".deliveryView").show(200);

                $(".StatsField").text("Status: " + deliveryItem[0].status);
                $(".NameField").text("Nome Consultor(a): " + deliveryItem[0].Nome);
                $(".CodeField").text("Codigo: " + deliveryItem[0].CodigoConsultora);
                $(".WeekField").text("Semana: " + deliveryItem[0].Semana)
                $(".DeliveryDateField").text("Data de Entrega: " + deliveryItem[0].DataEntrega)
                $(".HourDeliveryField").text("Hora de Entrega: " + deliveryItem[0].HorarioEntrega)
                $(".NameRecipientField").text("Nome de quem Recebeu: " + deliveryItem[0].NomeRecebidor)
                $(".ObsField").text("Observação: " + deliveryItem[0].observacao)

                $("html, body").animate({
                    scrollTop: ($(".deliveryView").first().offset().top)
                }, 1000)
            } else {
                alert("Codigo não encontrado!")
            }

        });
    }
}