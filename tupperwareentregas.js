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
            dataJson = JSON.parse(data).entregasBase;

            var deliveryItem = dataJson.filter(function(delivery) {
                return delivery.CodigoConsultora == $(".codigoConsultora").val();
            });

            if (deliveryItem.length > 0) {

                $(".deliveryView").show(200);

                // $(".StatsField").text(deliveryItem[0].status);
                $(".NameField").text(deliveryItem[0].Nome);
                $(".CodeField").text(deliveryItem[0].CodigoConsultora);
                $(".WeekField").text(deliveryItem[0].Semana);
                $(".DeliveryPrevisionField").text(deliveryItem[0].Previsao);
                $(".roteConsult").text(deliveryItem[0].Rota);
                // $(".DeliveryDateField").text(deliveryItem[0].DataEntrega);
                // $(".HourDeliveryField").text(deliveryItem[0].HorarioEntrega);
                // $(".NameRecipientField").text(deliveryItem[0].NomeRecebidor);
                $(".ObsField").text(deliveryItem[0].Observacao);

                $("html, body").animate({
                    scrollTop: ($(".deliveryView").first().offset().top)
                }, 1000)
            } else {
                alert("Codigo não encontrado!")
            }

        });
    }
}