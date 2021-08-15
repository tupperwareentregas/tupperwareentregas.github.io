var json_worksheet = {}
var lastDelivery = ""

function initAnimate() {

    $(".logoInit").animate({
        "margin-left": "40%"
    }, 1500, function() {
        $(".logoInit").hide();
        $(".HomeScreen").show(100);
    });
}

function finishDelivery() {
    $(".finishDeliveryView").show()

    $("html, body").animate({
        scrollTop: ($(".finishDeliveryView").first().offset().top)
    }, 1000)
}

function consultDeliveryView() {
    $(".consultDeliveryView").show()

    $("html, body").animate({
        scrollTop: ($(".consultDeliveryView").first().offset().top)
    }, 1000)
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
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets.Planilha1);

            json_worksheet = []

            for (var i = 0; i < XL_row_object.length; i++) {
                json_worksheet.push({
                    "NumeroSequencial": XL_row_object[i].NumeroSequencial == undefined ? "null" : XL_row_object[i].NumeroSequencial,
                    "CodigoConsultora": XL_row_object[i].CodigoConsultora == undefined ? "null" : XL_row_object[i].CodigoConsultora,
                    // "qtdeVolume": XL_row_object[i].qtdeVolume == undefined ? "null" : XL_row_object[i].qtdeVolume,
                    "Previsao": XL_row_object[i].Previsao == undefined ? "null" : XL_row_object[i].Previsao,
                    "Nome": XL_row_object[i].Nome == undefined ? "null" : XL_row_object[i].Nome,
                    // "DataEntrega": XL_row_object[i].DataEntrega == undefined ? "null" : XL_row_object[i].DataEntrega,
                    // "HorarioEntrega": XL_row_object[i].HorarioEntrega == undefined ? "null" : XL_row_object[i].HorarioEntrega,
                    // "NomeRecebidor": XL_row_object[i].NomeRecebidor == undefined ? "null" : XL_row_object[i].NomeRecebidor,
                    // "DocumentoRecebidor": XL_row_object[i].DocumentoRecebidor == undefined ? "null" : XL_row_object[i].DocumentoRecebidor,
                    "Rota": XL_row_object[i].Rota == undefined ? "null" : XL_row_object[i].Rota,
                    "Semana": XL_row_object[i].Semana == undefined ? "null" : XL_row_object[i].Semana,
                    "Observacao": XL_row_object[i].Observacao == undefined ? "null" : XL_row_object[i].Observacao,
                    // "status": XL_row_object[i].status == undefined ? "null" : XL_row_object[i].status
                })
            }

        };

        reader.onerror = function(ex) {
            console.log(ex);
        };

        reader.readAsBinaryString(file, "UTF-8");
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

        // var TemporaryJson = []

        // for (var i = 0; i < Worksheet.length; i++) {
        //     TemporaryJson.push({ "status": Worksheet[i].status, "Nome": Worksheet[i].Nome, "CodigoConsultora": Worksheet[i].CodigoConsultora, "Semana": Worksheet[i].Semana, "Previsao": Worksheet[i].Previsao, "DataEntrega": Worksheet[i].DataEntrega, "HorarioEntrega": Worksheet[i].HorarioEntrega, "NomeRecebidor": Worksheet[i].NomeRecebidor, "Observacao": Worksheet[i].Observacao });
        // }

        // DatajsonOnGit.entregasVisualizacao = TemporaryJson

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
            "Authorization": "Basic dHVwcGVyd2FyZWVudHJlZ2FzOmdocF9qNHBzRXVhbzdPNjRwYlIwYjV4UWJtT1lvdXdDMUgzR0NhSjU=",
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "message": "Update" + sha,
            "content": btoa(JSON.stringify(DatajsonOnGit).replaceAll("null", "").normalize('NFD').replace(/[\u0300-\u036f]/g, "")),
            "sha": sha
        }),
    };

    $.ajax(settings).done(function(response) {
        console.log(response);
        $(".upWorksheet").hide(400);
        $(".WorksheetInput").val(null);
        $(".custom-file-upload").text("Escolher arquivo")
        $(".entregarView").hide(700);
        $(".finishDeliveryView").hide(700);
        alert("Upload Enviado");
    });
}

function searchDeliveryToFinish() {

    var dataJson = {}
    var date = new Date();

    if ($(".numeroEntrega").val() != "") {

        $.get("https://raw.githubusercontent.com/tupperwareentregas/tupperwareentregas.github.io/main/data/data.json", function(data) {
            dataJson = JSON.parse(data)
            var DataEHorario = new Date();
            var DataAtual = DataEHorario.toLocaleString().split(" ")[0]
            var HorarioAtual = DataEHorario.toLocaleString().split(" ")[1]

            var deliveryItem = dataJson.entregasBase.filter(function(delivery) {
                return delivery.NumeroSequencial == $(".numeroEntrega").val();
            });

            if (deliveryItem.length > 0) {

                if (deliveryItem[0].status != "Entregue") {
                    $(".entregarView").show(200);

                    $(".Number").text(deliveryItem[0].NumeroSequencial);
                    $(".NameField").text(deliveryItem[0].Nome);
                    $(".CodeField").text(deliveryItem[0].CodigoConsultora);
                    $(".WeekField").text(deliveryItem[0].Semana)
                    $(".rote").text(deliveryItem[0].Rota)
                    $(".DeliveryDateField").text(DataAtual)
                    $(".HourDeliveryField").text(HorarioAtual)
                    $(".DeliveryPrevisionField").text(deliveryItem[0].Previsao)
                    $(".qtdeVolume").val("");
                    $(".NameRecipientField").val("");
                    $(".DocumentsRecipientField").val("");
                    $(".ObsField").val("");

                    $("html, body").animate({
                        scrollTop: ($(".entregarView").first().offset().top)
                    }, 1000)
                } else {
                    alert("Ja Entregue");
                }

            } else {
                alert("Código não encontrado!");
            }

        });
    }
}

function cancelDeliveryFinish() {

    $(".entregarView").hide(700);
    $(".finishDeliveryView").hide(700);
}

function confirmDeliveryFinish() {

    $.get("https://api.github.com/repos/tupperwareentregas/tupperwareentregas.github.io/git/refs/heads/main", function(data) {

        var commitURL = data.object.url;

        $.get(commitURL, function(data) {

            var treeURL = data.tree.url;

            $.get(treeURL, function(data) {

                var tree = data.tree;

                for (var i = 0; i < tree.length; i++) {
                    if (tree[i].path == "data") {
                        $.get(tree[i].url, function(data) {

                            var TreeFile = data.tree[0].url;

                            getAndUploadJsonFile(TreeFile);
                        });
                    }
                }
            });

        });
    });
}

function getAndUploadJsonFile(url) {

    var jsonToSend = {
        "entregasBase": [{
            "NumeroSequencial": $(".Number").text(),
            "CodigoConsultora": $(".CodeField").text(),
            "qtdeVolume": $(".qtdeVolume").val(),
            "Previsao": $(".DeliveryPrevisionField").text(),
            "Nome": $(".NameField").text(),
            "DataEntrega": $(".DeliveryDateField").text(),
            "HorarioEntrega": $(".HourDeliveryField").text(),
            "NomeRecebidor": $(".NameRecipientField").val(),
            "DocumentoRecebidor": $(".DocumentsRecipientField").val(),
            "Rota": $(".rote").text(),
            "Semana": $(".WeekField").text(),
            "Observacao": $(".ObsField").val(),
            "status": "Entregue"
        }],
        "entregasVisualizacao": [{
            "status": "Entregue",
            "Nome": $(".NameField").text(),
            "CodigoConsultora": $(".CodeField").text(),
            "Semana": $(".WeekField").text(),
            "Previsao": $(".DeliveryPrevisionField").text(),
            "DataEntrega": $(".DeliveryDateField").text(),
            "HorarioEntrega": $(".HourDeliveryField").text(),
            "NomeRecebidor": $(".NameRecipientField").val(),
            "Observacao": $(".ObsField").val()
        }]
    }

    $.get(url, function(data) {

        var dataJson = JSON.parse(atob(data.content));

        dataJson.entregasBase[parseInt($(".Number").text()) - 1] = jsonToSend.entregasBase[0];
        dataJson.entregasVisualizacao[parseInt($(".Number").text()) - 1] = jsonToSend.entregasVisualizacao[0];

        lastDelivery = dataJson;

        uploadInGitHub(dataJson);
    });
}

function FinalReport() {

    $.get("https://raw.githubusercontent.com/tupperwareentregas/tupperwareentregas.github.io/main/data/data.json", function(data) {
        var dataJson = JSON.parse(data).entregasBase;

        downloadWorkSheet(dataJson, "NilsonEntregas");
    })
}

function downloadWorkSheet(JsonData, NameOfFile) {

    var opts = [{ sheetid: 'Planilha1', header: true }];
    var result = alasql('SELECT * INTO XLSX("' + NameOfFile + '.xlsx",?) FROM ?', [opts, [JsonData]]);
}

function searchDeliveryToConsult() {
    var dataJson = {}

    if ($(".numeroEntregaConsult").val() != "") {

        $.get("https://raw.githubusercontent.com/tupperwareentregas/tupperwareentregas.github.io/main/data/data.json", function(data) {
            dataJson = JSON.parse(data)

            var deliveryItem = dataJson.entregasBase.filter(function(delivery) {
                return delivery.NumeroSequencial == $(".numeroEntregaConsult").val();
            });

            if (deliveryItem.length > 0) {

                $(".entregarViewConsult").show(200);

                // $(".StatusConsult").text(deliveryItem[0].status);
                $(".NumberConsult").text(deliveryItem[0].NumeroSequencial);
                $(".NameFieldConsult").text(deliveryItem[0].Nome);
                $(".CodeFieldConsult").text(deliveryItem[0].CodigoConsultora);
                $(".WeekFieldConsult").text(deliveryItem[0].Semana);
                $(".roteConsult").text(deliveryItem[0].Rota);
                // $(".DeliveryDateFieldConsult").text(deliveryItem[0].DataEntrega);
                // $(".HourDeliveryFieldConsult").text(deliveryItem[0].HorarioEntrega);
                $(".DeliveryPrevisionFieldConsult").text(deliveryItem[0].Previsao);
                // $(".qtdeVolumeConsult").text(deliveryItem[0].qtdeVolume);
                // $(".NameRecipientFieldConsult").text(deliveryItem[0].NomeRecebidor);
                // $(".DocumentsRecipientFieldConsult").text(deliveryItem[0].DocumentoRecebidor);
                $(".ObsFieldConsult").text(deliveryItem[0].Observacao);

                $("html, body").animate({
                    scrollTop: ($(".entregarViewConsult").first().offset().top)
                }, 1000)
            } else {
                alert("Código não encontrado!");
            }

        });
    }
}

function cancelDeliveryToConsult() {
    $(".consultDeliveryView").hide(200);
}