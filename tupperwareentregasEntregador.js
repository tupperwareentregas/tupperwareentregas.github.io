var json_worksheet = {}

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
                $(".CodeField").text("Nome Consultor(a): " + deliveryItem[0].CodigoConsultora);
                $(".WeekField").text("Semana: " + deliveryItem[0].semana)
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

function upWorksheet() {

    $(".upWorksheet").show()

    $("html, body").animate({
        scrollTop: ($(".upWorksheet").first().offset().top)
    }, 1000)
}

function alterDescriptions() {
    nameofFile = $("#file-upload").val().split("C:\\fakepath\\")

    if (nameofFile[1] != undefined) {

        $(".custom-file-upload").text("Escolher arquivo | " + nameofFile[1])
    } else {
        $(".custom-file-upload").text("Escolher arquivo")
    }


}

function CancelUpWorksheet() {
    $(".upWorksheet").hide()
}

var ExcelToJSON = function() {

    this.parseExcel = function(file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function(sheetName) {
                // Here is your object
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                json_worksheet = XL_row_object;
            })
        };

        reader.onerror = function(ex) {
            console.log(ex);
        };

        reader.readAsBinaryString(file);
    };
};

function handleFileSelect(evt) {

    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
}

function finishUpWorksheet() {

    var DatajsonOnGit = {}
    var Worksheet = json_worksheet

    $.get("https://raw.githubusercontent.com/tupperwareentregas/tupperwareentregas.github.io/main/data/data.json", function(data) {

        DatajsonOnGit = JSON.parse(data);

        DatajsonOnGit.entregasBase = Worksheet

        var TemporaryJson = []

        for (var i = 0; i < Worksheet.length; i++) {
            TemporaryJson.push({ "status": Worksheet[i].status, "Nome": Worksheet[i].Nome, "CodigoConsultora": Worksheet[i].CodigoConsultora, "semana": Worksheet[i].semana, "DataEntrega": Worksheet[i].DataEntrega, "HorarioEntrega": Worksheet[i].HorarioEntrega, "NomeRecebidor": Worksheet[i].NomeRecebidor, "observacao": Worksheet[i].observacao });
        }

        DatajsonOnGit.entregasVisualizacao = TemporaryJson

        uploadInGitHub(DatajsonOnGit);
    })
}

function uploadInGitHub(DatajsonOnGit) {

    $.get("https://api.github.com/repos/tupperwareentregas/tupperwareentregas.github.io/contents/data/data.json", function(data) {

        var sha = data.sha

        gitUpload(sha, DatajsonOnGit);
    })
}

function gitUpload(sha, DatajsonOnGit) {

    var settings = {
        "url": "https://api.github.com/repos/tupperwareentregas/tupperwareentregas.github.io/contents/data/data.json",
        "method": "PUT",
        "headers": {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": "token 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",
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "message": "Update" + sha,
            "content": btoa(JSON.stringify(DatajsonOnGit).replaceAll("null", "")),
            "sha": sha
        }),
    };

    $.ajax(settings).done(function(response) {
        console.log(response);
        $(".upWorksheet").hide(400);
        $(".WorksheetInput").val(null);
        $(".custom-file-upload").text("Escolher arquivo")
        alert("Planilha Enviada");
    });
}