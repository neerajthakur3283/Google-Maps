function neos_addScript(href, type, onload) {
    var toAdd = null;
    if (type == "css") {
        toAdd = document.createElement('link');
        toAdd.rel = "stylesheet";
        toAdd.href = href;
        toAdd.async = false;
    } else {
        var toAdd = document.createElement('script');
        toAdd.type = "text/javascript";
        toAdd.src = href;
    }
    if (onload) toAdd.onload = onload;
    document.getElementsByTagName('head')[0].appendChild(toAdd);
}

var neos_scriptsLoaded = false;
if (!window.jQuery) {
    neos_addScript("https://code.jquery.com/jquery-3.6.0.min.js", "js", function () {
        neos_loadScriptsAfterJQuery($ ?? jQuery);
    });
} else {
    neos_loadScriptsAfterJQuery($ ?? jQuery);
}

function neos_loadScriptsAfterJQuery($) {
    neos_addScript('https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.13.3/css/selectize.css', 'css');
    neos_addScript('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css', 'css');
    neos_addScript('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css', 'css');

    $.when(
        $.getScript("https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"),
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.16.0/jquery.validate.min.js"),
        $.Deferred(function (deferred) {
            $(deferred.resolve);
        })
    ).done(function () {
        $.when(
            $.getScript("https://jqueryvalidation.org/files/dist/additional-methods.min.js"),
            $.getScript("https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.13.3/js/standalone/selectize.min.js"),
            $.getScript("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"),
            $.getScript("https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"),
            $.Deferred(function (deferred) {
                $(deferred.resolve);
            })
        ).done(function () {
            neos_define_pricing_widget($ ?? jQuery);
            neos_scriptsLoaded = true;
        });
    });
}

function neos_waitFor(conditionFunction) {
    const poll = resolve => {
        if (conditionFunction()) resolve();
        else setTimeout(_ => poll(resolve), 400);
    }
    return new Promise(poll);
}

async function neos_init_pricing_widget(opts) {
    console.log("widget init");
    await neos_waitFor(_ => neos_scriptsLoaded === true);
    console.log("scripts loaded");
    jQuery("#" + opts.containerId).myWidget(opts);
}

function neos_define_pricing_widget($) {
    console.log('Versions: jQuery = ' + jQuery.fn.jquery + ", ui = " + jQuery.ui.version);

    $.widget("custom.myWidget", {
        options: {
            cssWrapperClass: "",
            theme: "default_theme",
            username: "default_username",
            apiKey: "default_apiKey",
            debug: false,
        },
        _create: function () {
            var username = this.options.username;
            var apiKey = this.options.apiKey;
            var postcodeRegex = /^[A-Za-z]{1,2}\d{1}([A-Za-z]|\d{1,2})?\s\d[A-Za-z]{2}$/;
            var service_url = "https://iquote-custapi.kinnersleysoftware.com/v5_0/API.asmx";

            const randId = Math.floor(Math.random() * 100000);
            const formId = `form-${randId}`;
            const postcodeBId = `postcode-b-${randId}`;
            const productTypeTabPointId = `tab-point-${randId}`;
            const productTypeTabNNIId = `tab-nni-${randId}`;
            const postcodeAId = `postcode-a-${randId}`;
            const nniId = `nni-${randId}`;
            //const portAId = `port-a-${randId}`;
            const portBId = `port-b-${randId}`;
            const bandwidthId = `bandwidth-${randId}`;
            const termId = `term-${randId}`;
            const quotesContainerId = `quotesContainer-${randId}`;

            const formHtml = `
			<div class="neos-pricing-widget ${this.options.cssWrapperClass}">
				<form id="${formId}">
					<h6>Select your location(s)</h6>
					<div class="product-type">
                        <div class="row">
                            <div class="product-type-col">
                                <div class="product-type-item">
                                    <div class="point">Point</div>
                                    <a class="postcode">
                                        <h6>Point</h6>
                                        <p>You can enter a postcode</p>
                                        <input type="text" id="${postcodeBId}" name="postcode-b" required/>
                                    </a>
                                </div>
                            </div>
                            <div class="product-type-col">
                                <div class="product-type-item">
                                    <nav class="product-type-list">
                                        <div class="product-type-nav">
                                            <a class="point-nav" id="${productTypeTabPointId}-tab">Point</a>
                                            <a class="nni-nav" id="${productTypeTabNNIId}-tab">NNI</a>
                                        </div>
                                    </nav>
                                    <div class="tab-content">
                                        <div id="${productTypeTabPointId}">
                                            <div class="postcode-a">
                                                <h6>Point</h6>
                                                <p>You can enter a postcode</p>
                                                <input type="text" id="${postcodeAId}" name="postcode-a" required/>
                                            </div>
                                        </div>
                                        <div id="${productTypeTabNNIId}">
                                            <div class="tab-nni">
                                                <h6>Select your NNI</h6>
                                                <select id="${nniId}" name="nni" class="searchable" placeholder="Search for nni...">
                                                </select>
                                            </div>
                                        </div>    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
					<div id="${portBId}-container" class="port">
						<div class="port-b">
							<label for="${portBId}">Port:</label>
						</div>
						<div class="port-radios">
							<div class="port-radio">
								<input id="${portBId}_1" type="radio" value="100" name="port-b" > 
								<label for="${portBId}_1" >100M</label>
							</div>
							<div class="port-radio">
								<input id="${portBId}_2" type="radio" value="1000" name="port-b" >
								<label for="${portBId}_2" >1G</label>
							</div>
							<div class="port-radio">
								<input id="${portBId}_3" type="radio" value="10000" name="port-b" >
								<label for="${portBId}_3" >10G</label>
							</div>
						</div>
					</div>
					<div id="${bandwidthId}-container">
						<div class="bandwidth">
							<label for="${bandwidthId}">Bandwidth:</label>
						</div>
						<div class="bandwidth-radios">
							<div id="${bandwidthId}-radioContainer" class="row"></div>
						</div>
					</div>
					<div id="${termId}-container">
						<div class="term">
							<label for="${termId}">Term:</label>
						</div>
						<div class="term-radios">
							<div class="term-radio">
								<input id="${termId}_1" type="radio" value="12" name="term" > 
								<label for="${termId}_1" >1 year</label>
							</div>
							<div class="term-radio">
								<input id="${termId}_2" type="radio" value="24" name="term" >
								<label for="${termId}_2" >2 years</label>
							</div>
							<div class="term-radio">
								<input id="${termId}_3" type="radio" value="36" name="term" >
								<label for="${termId}_3" >3 years</label>
							</div>
							<div class="term-radio">
								<input id="${termId}_4" type="radio" value="48" name="term" >
								<label for="${termId}_4" >4 years</label>
							</div>
							<div class="term-radio">
								<input id="${termId}_5" type="radio" value="60" name="term" >
								<label for="${termId}_5" >5 years</label>
							</div>
						</div>
					</div>
					<div class="error-message"></div>
            		<button type="submit">Generate Quotation</button>
				</form>
				<div class="loader">
                	<div class="spinner"></div>
                </div>
				
			</div>`;

            var quotesContainer = `<div id=${quotesContainerId}></div>`;
            const mainContainer = `
			<div>
				${formHtml}
				${quotesContainer}
			</div>`;
            this.element.append(mainContainer);
            $("#" + bandwidthId + "-container").hide();
            $("#" + productTypeTabNNIId).hide();
            var $nni = $("#" + nniId);
            var agreementsFromStorage = JSON.parse(localStorage.getItem("NNIAgreements"))?.NNIAgreements;
            $nni.empty();
            $nni.append('<option value=""></option>');
            if (agreementsFromStorage) {
                for (i = 0; i < agreementsFromStorage.length; i++) {
                    $nni.append(
                        '<option value="' +
                        agreementsFromStorage[i].Id +
                        '">' +
                        agreementsFromStorage[i].EthernetBearerReference +
                        "</option>"
                    );
                }
                $nni.prop("disabled", false);
                $nni.selectize({
                    sortField: "text",
                });
            } else {
                $(".loader").show();
                var data_getNNIAgreements = `<?xml version="1.0" encoding="utf-8"?>
						<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
						  <soap12:Body>
							<GetNNIAgreements xmlns="com.neosnetworks.livequote.api.v5_0">
							  <Username>${this.options.username}</Username>
							  <ApiKey>${this.options.apiKey}</ApiKey>
							</GetNNIAgreements>
						  </soap12:Body>
						</soap12:Envelope>`;

                $.ajax({
                    url: service_url,
                    type: "POST",
                    contentType: "application/soap+xml",
                    dataType: "json",
                    dataType: "xml",
                    data: data_getNNIAgreements,
                    success: function (data) {
                        var agreements = [];
                        $(data).find("NNIAgreement").each(function () {
                            var agreement = {}
                            agreement.Id = $(this).find("Id").text();
                            agreement.Port = $(this).find("Port").text();
                            agreement.Postcode = $(this).find("Postcode").text();
                            agreement.EthernetBearerReference = $(this).find("EthernetBearerReference").text();
                            agreements.push(agreement);
                        });
                        var jsonData = {
                            NNIAgreements: agreements,
                        };
                        localStorage.setItem("NNIAgreements", JSON.stringify(jsonData));
                        agreementsFromStorage = JSON.parse(localStorage.getItem("NNIAgreements")).NNIAgreements;
                        for (i = 0; i < agreementsFromStorage.length; i++) {
                            $nni.append(
                                '<option value="' + agreementsFromStorage[i].Id + '">' + agreementsFromStorage[i].Port + "," +
                                agreementsFromStorage[i].EthernetBearerReference + "," + agreementsFromStorage[i].Postcode +
                                "</option>"
                            );
                        }
                        $nni.prop("disabled", false);
                        $nni.selectize({
                            sortField: "text",
                        });
                        $(".loader").hide();
                    },
                    error: function (error) {
                        var fault = $(error.responseXML).find("soap\\:Fault");
                        var errorMessage = $(fault)
                            .find("soap\\:Text")
                            .text()
                            .trim()
                            .split("\n")[0]
                            .trim();
                        $(".error-message").html(errorMessage).show();
                        $(".loader").hide();
                    },
                });
            }

            var quoteType = "P2P";

            this.element.find("#" + productTypeTabNNIId + "-tab").on("click", function () {
                $("#" + productTypeTabPointId).hide();
                $("#" + productTypeTabNNIId).show();
                quoteType = "NNI";
            })

            this.element.find("#" + productTypeTabPointId + "-tab").on("click", function () {
                $("#" + productTypeTabNNIId).hide();
                $("#" + productTypeTabPointId).show();
                quoteType = "P2P";
            })

            $("input:radio").on("click", function () {
                $("input:radio[name=" + $(this).attr("name") + "]")
                    .parent()
                    .removeClass("active");
                $(this).parent().addClass("active");
            });

            this.element.find("#" + portBId + "_1").on("click", function () {
                $("#" + bandwidthId + "-container").show();
                if ($(this).prop("checked")) {
                    var bandwidthContainer = $("#" + bandwidthId + "-radioContainer");
                    bandwidthContainer.empty();
                    for (let i = 10; i <= 100; i += 10) {
                        radioHtml = `
						<div class="col-lg-5ths">
							<div class="bandwidth-radio">
								<input id="${bandwidthId}_${i + 1}" type="radio" name="bandwidth" value="${i}">
								<label for="${bandwidthId}_${i + 1}">${i}M</label>
							</div>
						</div>`;
                        bandwidthContainer.append(radioHtml);
                    }
                }
            });

            this.element.find("#" + portBId + "_2").on("click", function () {
                $("#" + bandwidthId + "-container").show();
                if ($(this).prop("checked")) {
                    var bandwidthContainer = $("#" + bandwidthId + "-radioContainer");
                    bandwidthContainer.empty();
                    for (let i = 100; i <= 1000; i += 100) {
                        radioHtml = `<div class="col-lg-5ths">
						<div class="bandwidth-radio"><input id="${bandwidthId}_${i + 1
                            }" type="radio" name="bandwidth" value="${i}">
						<label for="${bandwidthId}_${i + 1}">${i}M</label></div></div>`;
                        bandwidthContainer.append(radioHtml);
                    }
                }
            });

            this.element.find("#" + portBId + "_3").on("click", function () {
                $("#" + bandwidthId + "-container").show();
                if ($(this).prop("checked")) {
                    var bandwidthContainer = $("#" + bandwidthId + "-radioContainer");
                    bandwidthContainer.empty();
                    for (let i = 1000; i <= 10000; i += 1000) {
                        radioHtml = `<div class="col-lg-5ths">
						<div class="bandwidth-radio"><input id="${bandwidthId}_${i + 1
                            }" type="radio" name="bandwidth" value="${i}">
						<label for="${bandwidthId}_${i + 1}">${i}M</label></div></div>`;
                        bandwidthContainer.append(radioHtml);
                    }
                }
            });

            this.element.on("click", "input[name='bandwidth']", function () {
                $("input[name='bandwidth']").parent().removeClass("active");
                $(this).parent().addClass("active");
            });

            const postcodeAInput = this.element.find("#" + postcodeAId);
            const postcodeBInput = this.element.find("#" + postcodeBId);

            postcodeAInput.on("input", () => {
                let postcode = postcodeAInput.val();
                postcode = postcode.replace(/\s+/g, "");
                postcode = postcode.toUpperCase();
                const regex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}$/;
                if (regex.test(postcode)) {
                    postcode = postcode.slice(0, -3) + " " + postcode.slice(-3);
                    postcodeAInput.val(postcode);
                }
            });

            postcodeBInput.on("input", () => {
                let postcode = postcodeBInput.val();
                postcode = postcode.replace(/\s+/g, "");
                postcode = postcode.toUpperCase();
                const regex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}$/;
                if (regex.test(postcode)) {
                    postcode = postcode.slice(0, -3) + " " + postcode.slice(-3);
                    postcodeBInput.val(postcode);
                }
            });

            this.element.find("#" + formId).validate({
                rules: {
                    "postcode-b": {
                        required: true,
                        pattern: postcodeRegex,
                        maxlength: 8,
                    },
                    "postcode-a": {
                        required: true,
                        pattern: postcodeRegex,
                        maxlength: 8,
                    },
                    nni: {
                        required: true,
                    },
                    "port-a": {
                        required: true,
                    },
                    "port-b": {
                        required: true,
                    },
                    term: {
                        required: true,
                    },
                    bandwidth: {
                        required: true,
                    },
                },
                messages: {
                    "postcode-a": {
                        pattern: "Please enter a valid UK postcode",
                    },
                    "postcode-b": {
                        pattern: "Please enter a valid UK postcode",
                    },
                },
                errorPlacement: function (error, element) {
                    if (element.is(":radio")) {
                        error.appendTo(element.parents('.port-radios'));
                        error.appendTo(element.parents('.term-radios'));
                        error.appendTo(element.parents('.bandwidth-radios'));
                    }
                    else {
                        error.insertAfter(element);
                    }
                },
                submitHandler: function (form, event) {
                    $(".error-message").empty();

                    function initCarousel() {
                        $('.team-slider').owlCarousel({
                            margin: 10,
                            nav: true,
                            autoplay: false,
                            dots: true,
                            navText: [
                                "<i class='fa fa-chevron-left'></i>",
                                "<i class='fa fa-chevron-right'></i>"
                            ],
                            responsive: {
                                0: {
                                    items: 1
                                },
                                600: {
                                    items: 2
                                },
                                1000: {
                                    items: 3
                                }
                            }
                        });
                    };

                    function formatDate(date) {
                        var date_components = date.split('T')[0].split('-');
                        var time_components = date.split('T')[1].split(':');
                        var hour = parseInt(time_components[0], 10);
                        var ampm = hour >= 12 ? 'PM' : 'AM';
                        hour = hour % 12;
                        hour = hour ? hour : 12;
                        var formatted_date = date_components[2] + '/' + date_components[1] + '/' + date_components[0].substring(2) + ' ' + hour + ':' + time_components[1] + ' ' + ampm;
                        return formatted_date;
                    }

                    function formatPrice(price) {
                        var GBP = new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: 'GBP',
                        });
                        var formattedPrice = GBP.format(price);
                        return formattedPrice;
                    }

                    $(".loader").show();
                    event.preventDefault();

                    var productType = "";
                    const postcodeA = $(form).find("#" + postcodeAId).val();
                    const postcodeB = $(form).find("#" + postcodeBId).val();
                    const nni = $(form).find("#" + nniId).val();
                    //const portA = $('input[name="port-a"]:checked').val();
                    const portB = $('input[name="port-b"]:checked').val();
                    const bandwidth = $('input[name="bandwidth"]:checked').val();
                    const term = $('input[name="term"]:checked').val();
                    if (quoteType == "NNI") {
                        productType = "NNI";
                    } else {
                        productType = "P2P";
                    }

                    var circuit = "";
                    if (productType === "NNI") {
                        circuit = `<circuit>
						<ProductType>${productType}</ProductType>
						<AEndNNIId>${nni}</AEndNNIId>
						<BEndPostcode>${postcodeB}</BEndPostcode>
						<PortAndBandwidths>
						  <PortAndBandwidth>
							<BEndPort>${portB}</BEndPort>
							<Bandwidth>${bandwidth}</Bandwidth>
						  </PortAndBandwidth>
						</PortAndBandwidths>
						<TermLengthInMonths><int>${term}</int></TermLengthInMonths>
					  </circuit>`;
                    }
                    if (productType === "P2P") {
                        circuit = `<circuit>
						<ProductType>${productType}</ProductType>
						<AEndPostcode>${postcodeA}</AEndPostcode>
						<BEndPostcode>${postcodeB}</BEndPostcode>
						<PortAndBandwidths>
						  <PortAndBandwidth>
							<AEndPort>${portB}</AEndPort>
							<BEndPort>${portB}</BEndPort>
							<Bandwidth>${bandwidth}</Bandwidth>
						  </PortAndBandwidth>
						</PortAndBandwidths>
						<TermLengthInMonths><int>${term}</int></TermLengthInMonths>
					  </circuit>`;
                    }
                    var data_generateQuotation = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns="com.neosnetworks.livequote.api.v5_0">
					    <soap:Body>
					      <GenerateQuotation>
						    <Username>${username}</Username>
						    <ApiKey>${apiKey}</ApiKey>
						    ${circuit}
					      </GenerateQuotation>
					    </soap:Body>
				      </soap:Envelope>`;

                    function GetAccessTypeImage(at) {
                        var ret = "";
                        switch (at) {
                            case 'BT_OpenReach':
                                ret = "./Assets/BTOpenReach.jpg";
                                break;
                            case 'VM_Extensions':
                                ret = "./Assets/VM_Extensions.png";
                                break;
                            case 'BT_Wholesale':
                                ret = "./Assets/BT_Wholesale.png";
                                break;
                            case 'TalkTalk':
                                ret = "./Assets/TalkTalk.png";
                                break;
                            case 'VM_National':
                                ret = "./Assets/Virgin_Media.png";
                                break;
                            case 'Vodafone_National':
                                ret = "./Assets/Vodafone_National.png";
                                break;
                            case 'Colt':
                                ret = "./Assets/Colt.png";
                                break;
                            case 'Sky':
                                ret = "./Assets/Sky.png";
                                break;
                            case 'CityFibre':
                                ret = "./Assets/CityFibre.png";
                                break;
                            case 'None':
                                ret = "./Assets/Neos_Network.png";
                                break;
                            case 'NNAT':
                                ret = "./Assets/Neos_Network.png";
                                break;
                            default:
                                ret = "./Assets/Neos_Network.png";
                                break;
                        }
                        return ret;
                    }

                    $.ajax({
                        url: service_url,
                        type: "POST",
                        contentType: "application/soap+xml",
                        dataType: "xml",
                        data: data_generateQuotation,
                        success: function (response) {
                            console.log(response);
                            var quotes = [];
                            $(response).find("QuotationLine").each(function () {
                                var quote = {};
                                quote.QuotationId = $(this).find("QuotationId").text();
                                quote.DateCreated = $(this).find("DateCreated").text();
                                quote.AEndAccessType = $(this).find("AEndAccessType").text();
                                quote.BEndAccessType = $(this).find("BEndAccessType").text();
                                quote.AEndInfo = (productType === "NNI") ? ("NNI, " + $(this).find("NNIEthernetBearerReference").text()) : postcodeA
                                quote.AEndPoPPostcode = $(this).find("AEndPoPPostcode").text();
                                quote.BEndPoPPostcode = $(this).find("BEndPoPPostcode").text();
                                quote.SetupPrice = $(this).find("SetupPrice").text();
                                quote.AnnualPrice = $(this).find("AnnualPrice").text();
                                quote.AdditionalServices = $(this).find("AdditionalServices").text();
                                quotes.push(quote);
                            });

                            if (quotes.length > 0) {
                                var cardsHtml = ``;
                                for (var i = 0; i < quotes.length; i++) {
                                    var aEndlogo = GetAccessTypeImage(quotes[i].AEndAccessType);
                                    var bEndlogo = GetAccessTypeImage(quotes[i].BEndAccessType);

                                    var cardHtml = `
										<div class="single-box text-center">
											<div class="card"">
												<div class="card-body">
                                                <div class="a-end">
													<h5 class="card-title">Option ${i + 1}</h5>
                                                    <p><b>End A:</b> ${quotes[i].AEndInfo}</p>
                                                    <div class=img-area>
														<img src="${aEndlogo}" alt="${quotes[i].AEndAccessType}"> 
													</div>
                                                    <p><b>PoP A:</b> ${quotes[i].AEndPoPPostcode}</p>
                                                </div>
                                                <ul style="margin: -10px 0 25px 20px">
												    <li style='height: 10px;'></li>
												    <li style='height: 10px;'></li>
												    <li style='height: 10px;'>${bandwidth}Mbps</li>
												    <li style='height: 10px;'></li>
												    <li style='height: 10px;'></li>
												</ul>
                                                <div class="b-end">
                                                    <p><b>PoP B:</b> ${quotes[i].BEndPoPPostcode}</p>
													<div class=img-area>
														<img src="${bEndlogo}" alt="${quotes[i].BEndAccessType}"> 
													</div>
                                                    <p><b>End B:</b> ${postcodeB}</p>
                                                </div>
                                                <div style="border-bottom: 2px solid #cf7938;height: 15px;margin: 0 -10px;">&nbsp;</div>
                                                <div>
													<p class="card-text">Product: <span class="price">${quotes[i].AdditionalServices}</span></p>
													<p class="card-text">Install:&nbsp;&nbsp;&nbsp; <span class="price">${formatPrice(quotes[i].SetupPrice)}</span></p>
													<p class="card-text">Annual:&nbsp; <span class="price">${formatPrice(quotes[i].AnnualPrice)}</span></p>
													<a class="btn text-white" style="background-color: #39a5b4;" href="#!" role="button">
														<i class="fa fa-download"></i> Order
													</a>
												</div>
												</div>
											</div>
										</div>`;
                                    cardsHtml += cardHtml;
                                }
                                var quotesHtml = `
									<div>
										<div class= container>
											<div class = "row">
												<div class="col-lg-8 offset-lg-2 col-md-10 offset-md-1">
													<div class="quotesHeading">
														<h3>Q${quotes[0].QuotationId}</h3>
														<h4>${formatDate(quotes[0].DateCreated)}</h4>
													</div>
												</div>
											</div> 
										</div>
										<div class= "testimonial-box">
											<div class="conatiner">
												<div class="row">
													<div class="col-lg-12">
														<div class="team-slider owl-carousel">
															${cardsHtml}
														</div>
													</div>
												</div>
											</div>
										</div>
										<button id="back-button" type="button" class="back-button"> < New Quotation</button>
									</div>`;
                                $("#" + formId).hide();
                                $("#" + quotesContainerId).html(quotesHtml).show();
                                initCarousel();
                                $(".loader").hide();
                                $("#back-button").on("click", function () {
                                    $(".loader").show();
                                    $("#" + quotesContainerId).html(quotesHtml).hide();
                                    $("#" + formId).show();
                                    $(".loader").hide();
                                });
                            }
                            else {
                                var error_element = $(response).find("GenerateQuotationResult ErrorMessage")
                                var error_message = error_element.text();
                                $(".error-message").html(error_message).show();
                                $(".loader").hide();
                            }
                        },
                        error: function (error) {
                            var fault = $(error.responseXML).find("soap\\:Fault");
                            var errorMessage = $(fault).find("soap\\:Text").text().trim().split("\n")[0].trim();
                            $(".error-message").html(errorMessage).show();
                            $(".loader").hide();
                        },
                    });
                },
            });
        },
    });
}