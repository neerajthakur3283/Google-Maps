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
			$.getScript("https://maps.googleapis.com/maps/api/js?key=[yourapikey]&libraries=places"),
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

	$(function () {
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

				const formId = `form-${Math.floor(Math.random() * 100000)}`;
				const postcodeBId = `postcode-b-${Math.floor(Math.random() * 100000)}`;
				const productTypeTabPointId = `tab-point-${Math.floor(Math.random() * 100000)}`;
				const productTypeTabNNIId = `tab-nni-${Math.floor(Math.random() * 100000)}`;
				const postcodeAId = `postcode-a-${Math.floor(Math.random() * 100000)}`;
				const nniId = `nni-${Math.floor(Math.random() * 100000)}`;
				const portBId = `port-b-${Math.floor(Math.random() * 100000)}`;
				const bandwidthId = `bandwidth-${Math.floor(Math.random() * 100000)}`;
				const termId = `term-${Math.floor(Math.random() * 100000)}`;
				const quotesContainerId = `quotesContainer-${Math.floor(Math.random() * 100000)}`;
				const mapId = `map-${Math.floor(Math.random() * 100000)}`;

				const formHtml = `
			<div class="neos-pricing-widget ${this.options.cssWrapperClass}">
				<form id="${formId}">
					<h6>Select your location(s)</h6>
					<div class="product-type">
						<div class="horizontal-row">
								<div class="product-type-item">
									<div class="point">Point</div>
									<div class="postcode-b">
										<p>Search your location</p><i class="fa fa-info-circle"></i>
										<span class="postcode-tooltip">You can search a landmark, street, building or a postcode</span>
									</div>
									<div class=postcode-input>
										<input type="text" id="${postcodeBId}" name="postcode-b" required/>
									</div>
									<div class="postcodeB-error"></div>
								</div>
								<div class="product-type-item">
									<div class="product-type-list">
										<div class="product-type-nav">
											<div class="point-nav active" id="${productTypeTabPointId}-tab">Point</div>
											<div class="nni-nav" id="${productTypeTabNNIId}-tab">NNI</div>
										</div>
									</div>
									<div class="product-type-tab-content">
										<div id="${productTypeTabPointId}">
											<div class="postcode-a">
												<p>Search your location</p><i class="fa fa-info-circle"></i>
												<span class="postcode-tooltip">You can search a landmark, street, building or a postcode</span>
											</div>
											<div class=postcode-input>
												<input type="text" id="${postcodeAId}" name="postcode-a" required/>
											</div>
											<div class="postcodeA-error"></div>
										</div>
										<div id="${productTypeTabNNIId}">
											<div class="tab-nni">
												<select id="${nniId}" name="nni" class="searchable" placeholder="Select NNI">
												</select>
											</div>
										</div>    
									</div>
								</div>
						</div>
						<div class="horizontal-row">
							<div id="${mapId}" style="overflow: hidden;height: 320px;width: 100%;margin-top: 4%;position: relative;"></div>
						</div>
						<hr>
					</div>
					<div class="horizontal-row">
						<div id="${portBId}-container" class="port">
							<h6>Port</h6>
							<select id="${portBId}" name="port-b">
								<option value="100">100M</option>
								<option value="1000" selected>1G</option>
								<option value="10000">10G</option>
							</select>
						</div>
						<div id="${bandwidthId}-container" class="bandwidth">
							<h6>Bandwidth</h6>
							<select id="${bandwidthId}" name="bandwidth">
							</select>
						</div>
						<div id="${termId}-container" class="term">
							<h6>Term</h6>
							<select id="${termId}" name="term">
								<option value="12">1 year</option>
								<option value="24">2 years</option>
								<option value="36" selected>3 years</option>
								<option value="48">4 years</option>
								<option value="60">5 years</option>
							</select>
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
				$("#" + productTypeTabNNIId).hide();

				var $bandwidth = $("#" + bandwidthId);
				for (var i = 100; i <= 1000; i += 100) {
					$bandwidth.append(`<option value="${i}" ${i == 1000 ? "selected" : ""}>${i}M</option>`);
					$bandwidth.prop("disabled", false);
				}
				var $nni = $("#" + nniId);
				var agreementsFromStorage = JSON.parse(localStorage.getItem("NNIAgreements"))?.NNIAgreements;
				$nni.empty();
				$nni.append('<option value=""></option>');
				if (agreementsFromStorage) {
					for (i = 0; i < agreementsFromStorage.length; i++) {
						$nni.append('<option value="' + agreementsFromStorage[i].Id + '">' +
							agreementsFromStorage[i].Port + "," + agreementsFromStorage[i].Postcode + "," +
							agreementsFromStorage[i].EthernetBearerReference + "</option>");
					}
					$nni.prop("disabled", false);
					$nni.selectize({
						sortField: "text",
					});
				}
				else {
					$(".loader").show();
					var data_getNNIAgreements = `<?xml version="1.0" encoding="utf-8"?>
						<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
						  <soap12:Body>
							<GetNNIAgreements xmlns="com.neosnetworks.livequote.api.v5_0">
							  <Username>${username}</Username>
							  <ApiKey>${apiKey}</ApiKey>
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
								$nni.append('<option value="' + agreementsFromStorage[i].Id + '">' +
									agreementsFromStorage[i].Port + "," + agreementsFromStorage[i].Postcode + "," +
									agreementsFromStorage[i].EthernetBearerReference + "</option>");
							}
							$nni.prop("disabled", false);
							$nni.selectize({
								sortField: "text",
							});
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
						},
					});
					$(".loader").hide();
				}
				var quoteType = "P2P";

				this.element.find("#" + productTypeTabNNIId + "-tab").on("click", function () {
					$("#" + productTypeTabPointId).hide();
					$("#" + productTypeTabNNIId).show();
					$(this).addClass("active");
					$("#" + productTypeTabPointId + "-tab").removeClass("active");
					quoteType = "NNI";
				});

				this.element.find("#" + productTypeTabPointId + "-tab").on("click", function () {
					$("#" + productTypeTabNNIId).hide();
					$("#" + productTypeTabPointId).show();
					$(this).addClass("active");
					$("#" + productTypeTabNNIId + "-tab").removeClass("active");
					quoteType = "P2P";
				});

				$(`#${portBId}`).on('change', function () {
					$bandwidth.empty();
					var optionsHtml = '';
					var selectedPort = $(this).val();
					switch (selectedPort) {
						case '100':
							for (var i = 10; i <= 100; i += 10) {
								optionsHtml += '<option value="' + i + '">' + i + "M</option>";
							}
							$bandwidth.prop("disabled", false);
							break;
						case '1000':
							for (var i = 100; i <= 1000; i += 100) {
								optionsHtml += '<option value="' + i + '">' + i + "M</option>";
							}
							$bandwidth.prop("disabled", false);
							break;
						case '10000':
							for (var i = 1000; i <= 10000; i += 1000) {
								optionsHtml += '<option value="' + i + '">' + i + "M</option>";
							}
							$bandwidth.prop("disabled", false);
							break;
						default:
							$bandwidth.prop("disabled", true);
					}
					$bandwidth.append(optionsHtml);
				});

				function resetPostalInput() {
					activeField = '';
					postcodeAInput.css('background', '#f4f5f5');
					postcodeAInput.css('border', '2px solid #ccc');
					postcodeBInput.css('background', '#f4f5f5');
					postcodeBInput.css('border', '2px solid #ccc');
				}
				$(`#${productTypeTabNNIId}`).on('click', function () {
					resetPostalInput();
				})
				$(`#${portBId}`).on('click', function () {
					resetPostalInput();
				})
				$(`#${bandwidthId}`).on('click', function () {
					resetPostalInput();
				})
				$(`#${termId}`).on('click', function () {
					resetPostalInput();
				})
				/* Map */
				var map = new google.maps.Map(document.getElementById(mapId), {
					center: { lat: 51.5074, lng: -0.1278 },
					zoom: 13,
				});
				geocoder = new google.maps.Geocoder();
				var postalBinput = document.getElementById(postcodeBId);
				var postalAinput = document.getElementById(postcodeAId);
				var autocomplete = new google.maps.places.Autocomplete(postalBinput);
				autocomplete.bindTo("bounds", map);
				var autocomplete2 = new google.maps.places.Autocomplete(postalAinput);
				autocomplete2.bindTo("bounds", map);
				var infowindow = new google.maps.InfoWindow();
				var activeField;
				var postcodeId;
				const createMarker = (position, url) => {
					var m = new google.maps.Marker({
						position,
						map,
						icon: {
							url: url,
							scaledSize: new google.maps.Size(40, 40),
							anchorPoint: new google.maps.Point(0, -29),
						},
					});
					return m;
				}
				var url1 = "./Assets/Point-A.png";
				var url2 = "./Assets/Point-B.png";
				let marker1 = createMarker(map.getCenter(), url1);
				let marker2 = createMarker(map.getCenter(), url2);
				marker1.setVisible(false);
				marker2.setVisible(false);
				map.addListener("click", (event) => {
					var latlng = event.latLng;
					geocoder.geocode({ location: latlng }, (results, status) => {
						if (status === "OK" && results[0]) {
							const marker = activeField === 'B' ? marker1 : activeField === 'A' ? marker2 : null;
							if (marker) {
								postcodeId = activeField === 'A' ? postcodeAId : postcodeBId;
								var postalCode = getPostalCode(results[0], marker);
								document.getElementById(postcodeId).value = postalCode ? postalCode : "";
								if (postalCode && postalCode.length > 0) {
									marker.setMap(null);
									marker1 = activeField === 'B' ? createMarker(latlng, url1) : marker1;
									marker2 = activeField === 'A' ? createMarker(latlng, url2) : marker2;
									$(activeField === 'A' ? '.postcodeA-error' : '.postcodeB-error').text('');
									fitBounds();
								}
							} else $('.postcodeB-error').text('Please select postal code field first');
						} else {
							$(activeField === 'A' ? '.postcodeA-error' : '.postcodeB-error').text(status === 'ZERO_RESULTS' ? 'postal code not found' : `Geocoder failed due to: ${status}`);
						}
					});
				});
				const autocompleteHandler = (autocomplete, url) => {
					infowindow.close();
					const place = autocomplete.getPlace();
					if (!place.geometry) {
						window.alert("Autocomplete's returned place contains no geometry");
						return;
					}
					if (place.geometry.viewport) {
						map.fitBounds(place.geometry.viewport);
					} else {
						map.setCenter(place.geometry.location);
						map.setZoom(12);
					}
					let postalCode;
					for (const component of place.address_components) {
						if (component.types.includes("postal_code")) {
							postalCode = component.long_name;
							break;
						}
					}
					if (!postalCode || !postcodeRegex.test(postalCode)) {
						$(activeField === 'A' ? '.postcodeA-error' : '.postcodeB-error').text(postalCode ? `Please enter valid UK address: ${postalCode}` : 'Please enter valid UK address');
						return;
					}
					let marker = activeField === 'B' ? marker1 : marker2;
					postcodeId = activeField === 'A' ? postcodeAId : postcodeBId;

					marker.setMap(null);
					marker1 = activeField === 'B' ? createMarker(place.geometry.location, url) : marker1;
					marker2 = activeField === 'A' ? createMarker(place.geometry.location, url) : marker2;
					document.getElementById(postcodeId).value = postalCode;
					$(activeField === 'A' ? '.postcodeA-error' : '.postcodeB-error').text('');
					fitBounds();
				}
				autocomplete.addListener("place_changed", () => {
					postcodeId = postcodeBId;
					autocompleteHandler(autocomplete, url1);
				});
				autocomplete2.addListener("place_changed", () => {
					postcodeId = postcodeAId;
					autocompleteHandler(autocomplete2, url2);
				});
				function getPostalCode(result, marker) {
					var postalCode = "";
					for (var i = 0; i < result.address_components.length; i++) {
						var component = result.address_components[i];
						if (component.types.indexOf("postal_code") !== -1) {
							postalCode = component.short_name;
							var postal_code = component.short_name;
							if (!postcodeRegex.test(postal_code)) {
								marker.setMap(null);
								$(activeField === 'A' ? '.postcodeA-error' : '.postcodeB-error').text('Please enter valid UK address: ' + component.short_name);
								return;
							}
							$(activeField === 'A' ? '.postcodeA-error' : '.postcodeB-error').text('');
							break;
						}
						else {
							marker.setMap(null);
							$(activeField === 'A' ? '.postcodeA-error' : '.postcodeB-error').text('Please try selecting location again');
						}
					}
					return postalCode;
				}
				var lineBetwenMarkers = null;
				function fitBounds() {
					if (marker1 == null || marker2 == null || marker1.getMap() == null || marker2.getMap() == null
						|| !marker1.getVisible() || !marker2.getVisible()) return;
					var positions = [marker1.getPosition(), marker2.getPosition()];
					var bounds = new google.maps.LatLngBounds();
					for (var i = 0; i < positions.length; i++) {
						bounds.extend(positions[i]);
					}
					map.fitBounds(bounds);

					if (lineBetwenMarkers) lineBetwenMarkers.setMap(null);
					lineBetwenMarkers = new google.maps.Polyline({
						path: positions,
						geodesic: true,
						strokeColor: "##35495e",
						strokeOpacity: 0.8,
						strokeWeight: 3
					});
					lineBetwenMarkers.setMap(map);
				}

				/* /Map */
				const postcodeAInput = this.element.find("#" + postcodeAId);
				const postcodeBInput = this.element.find("#" + postcodeBId);
				postcodeBInput.on("focus", () => {
					activeField = 'B';
					postcodeAInput.css("background", "#f4f5f5");
					postcodeAInput.css("border", "2px solid #ccc");
					postcodeBInput.css("background", "#d7edf0");
					postcodeBInput.css("border", "2px solid black");
				});
				postcodeAInput.on("focus", () => {
					activeField = 'A';
					postcodeBInput.css("background", "#f4f5f5");
					postcodeBInput.css("border", "2px solid #ccc");
					postcodeAInput.css("background", "#d7edf0");
					postcodeAInput.css("border", "2px solid black");
				});
				this.element.find("#" + formId).validate({
					rules: {
						"postcode-b": {
							required: true,
						},
						"postcode-a": {
							required: true,
						},
						nni: {
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
						const portB = $(form).find("#" + portBId).val();
						const bandwidth = $(form).find("#" + bandwidthId).val();
						const term = $(form).find("#" + termId).val();
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
														<div><b>PoP A:</b> ${quotes[i].AEndPoPPostcode}</div>
													</div>
													<ul style="margin: -10px 0 15px 10px">
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
														<div><b>End B:</b> ${postcodeB}</div>
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
	});
}
