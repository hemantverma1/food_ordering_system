function fillTezEmail() {
    var tez_email = $("#tez-email").val(),
        index = tez_email.indexOf("@gmail.com");
    if (index != -1) {
        var arr = tez_email.split("@gmail.com");
        if (arr.length > 0) {
            var patternMatch = null !== arr[0].match(/^([A-Za-z0-9-_.]+)$/);
            patternMatch && $("#tez_vpa").val(arr[0])
        }
    }
}

function main() {
    initTabs(), initDetailsToggle(), tryAgain(), setTimeout(function() {
        addAdditionalCharges(!0)
    }, 100), "NB" == $("#selected_tab").val() && ($("#netbanking_select").val($("#bank_code").val()).attr("selected", !0), $(".NetBankingBankName").html($("#netbanking_select option:selected").text())), setTimeout(function() {
        netBankingDownFlags()
    }, 200), $.browser.msie ? jQuery("input[name=ccard-type]").click(function(e) {
        initCreditCard(this.value)
    }) : jQuery("input[name=ccard-type]").change(function(e) {
        initCreditCard(this.value)
    });
    var tabSelect = getBinDetails();
    "creditcard" == tabSelect.parentcat && setDefaultCCIbiboCode(), "upi" == tabSelect.parentcat && "#google-tez" == $("li.ui-state-default.ui-corner-top.ui-tabs-selected.ui-state-active a").attr("href") && (ibibo_code = "TEZ"), CodAgain(), 1 == $("#invalid_card_flag").val() && setTimeout(function() {
        $("#invalid_card_error").slideUp(500)
    }, 3e4), $("#cardlessemitab") && (ibiboCodesDetails.cardlessemi && ibiboCodesDetails.cardlessemi.ZCLEMI ? ($("#cardlessemitab").html("0% Cardless <br> EMI"), $("#cardlessemitab").addClass("cardlessemitabpadding"), $("#cardlessemi #note").html("*Overdue fees/interests may apply if you don't pay your EMI in time."), updateKreditectEmi(transaction_fee, 0, 0, .18)) : ibiboCodesDetails.cardlessemi && ibiboCodesDetails.cardlessemi.CLEMI && ($("#cardlessemitab").html("Cardless EMI"), $("#cardlessemi #note").html("*The amounts and rates indicated above are non-binding examples.  Our final offer can only be determined and presented to you after you have completed the online EMI application.  Our final offer may be as high as 26.5% interest per year plus a one-off processing fee of 1.5% of total amount granted"), $("#cardlessemitab").removeClass("cardlessemitabpadding"), updateKreditectEmi(transaction_fee, .01, .015, .18))), setSurchargeMsg(tabSelect.parentcat, defaultCCIbiboCode), RemoveStoreCardLinkInSi()
}

function initCreditCard(value) {
    switch (setDefaultCCIbiboCode(), value) {
        case "2":
        case "5":
            PayU.init("creditcard", "AMEX");
            break;
        case "3":
        case "4":
            PayU.init("creditcard", "DINR");
            break;
        default:
            PayU.init("creditcard", defaultCCIbiboCode)
    }
}

function setDefaultCCIbiboCode() {
    ibiboCodesDetails && (ibiboCodesDetails.creditcard ? ibiboCodesDetails.creditcard.CC ? defaultCCIbiboCode = "CC" : ibiboCodesDetails.creditcard.VISACC ? defaultCCIbiboCode = "VISACC" : ibiboCodesDetails.creditcard.MASTCC && (defaultCCIbiboCode = "MASTCC") : defaultCCIbiboCode = "CC")
}

function submitTez() {
    var valid = window.validator.checkForm();
    return valid ? (form_params(), void $("#paymentForm").submit()) : void window.validator.showErrors()
}

function RemoveStoreCardLinkInSi() {
    var store_card_show_hide_flag = $("#removeStoreCardLink").val();
    1 == store_card_show_hide_flag && $("#storeCardLink").html("").hide()
}

function netBankingDownFlags() {
    var ibibo_code = PayUCheckout.getIbiboCodes();
    if (ibibo_code.netbanking) {
        var result = PayUCheckout.getNbGatewayInfoAPI();
        result.success(function(data) {
            if (1 == data.status) {
                var gateway_info = data.gateway_info;
                $("#netbanking_select option").each(function(index) {
                    var opt_val = $(this).val() + "",
                        gateway_obj = gateway_info[opt_val];
                    for (var i in gateway_obj) "up_status" == i && ($(this).attr("gateway_status", gateway_obj[i]), 0 == gateway_obj[i] && $(this).css("color", "#E1E1E1"), 3 == gateway_obj[i] && $(this).css("color", "#808080"))
                })
            }
        }), result.error(function(xhr, status, error) {})
    }
}

function initTabs() {
    function ccFormToggle(radval) {
        document.getElementById("payment-tabs");
        if ("#emi" == $("li.ui-state-active > a", "#payment-tabs").attr("href") && $("#bankEmiList").trigger("change"), "undefined" == typeof radval && (radval = $(".hide-cc-form:checked").val(), $(".show-cc-form").is(":checked") && (radval = $(".show-cc-form:checked").val())), getStoreCardToDefaultState(), 1 != $("#down_flag").val() ? ($("#credit_card_error_div").slideUp(500), $("#show_notification_credit").slideUp(200), handleStandingInstruction().messagesHandler("debit_card_si_error_div").hide(), handleStandingInstruction().messagesHandler("credit_card_si_error_div").hide(), handleStandingInstruction().messagesHandler("credit_card_si_error_default_div").hide(), $("#not_debit_card_error").slideUp(500)) : $("#down_flag").val(0), ib_downtime_show = 0, $("input[name=ccvv_number]").attr("maxlength", 3), 1 != radval && 4 != radval && 5 != radval && 6 != radval) {
            var cc_form = $(".cc-form", this.form);
            2 == radval ? ibibo_code = "AMEX" : 3 == radval ? ibibo_code = "DINR" : 7 == radval && (ibibo_code = "RUPAYCC");
            var redirect_message = $(".redirect-message", this.form);
            $(".chk_outer").length ? $(".chk_outer").fadeOut("fast", function() {
                redirect_message.length ? cc_form.fadeOut("fast", function() {
                    redirect_message.fadeIn("fast")
                }) : cc_form.fadeOut("fast")
            }) : cc_form.fadeOut("fast"), $("input:enabled, textarea:enabled, select:enabled", cc_form).attr("disabled", "disabled")
        } else {
            ibibo_code = "", 4 == radval && (ibibo_code = "DINR"), 5 == radval && (ibibo_code = "AMEX", $("input[name=ccvv_number]").attr("maxlength", 4)), 6 == radval && (ibibo_code = "RUPAYCC", $("input[name=ccvv_number]").attr("maxlength", 3));
            var cc_form = $(".cc-form", this.form),
                redirect_message = $(".redirect-message", this.form);
            redirect_message.length ? redirect_message.fadeOut("fast", function() {
                cc_form.fadeIn("fast")
            }) : cc_form.fadeIn("fast"), $(".chk_outer").fadeIn("fast"), $("input, textarea, select", cc_form).prop("disabled", !1)
        }
        var ccOfferTag = $("#checkOfferTagcc", this.form);
        ccOfferTag.length && (ccOfferTag.removeClass().addClass("check_offer"), ccOfferTag.html('<a id="checkOffercc" href="#" class="help-link" onclick ="checkOfferValidity(); return false;"> Check Offer </a>')), store_cards || $("#ccvv_help_img").attr("src", baseImagePath + "cvv_new/cvv_visa_master_new.png?v=1.1"), $("#CVVHelpText").text("A 3-digit number in reverse italics on the back of your card")
    }
    $("#content").show();
    var $tabs = $("#payment-tabs");
    $(".help-link").click(function(e) {
        e.preventDefault(), $(this.hash).fadeToggle()
    }), $.browser.msie ? $('input[name="ccard-type"]', $tabs).click(function() {
        ccFormToggle(this.value)
    }) : $('input[name="ccard-type"]', $tabs).change(function() {
        ccFormToggle()
    }), jQuery.validator.addMethod("currentOrFutureMonth", function(value, element, year_field) {
        if (element.form && element.form[year_field]) {
            var today = new Date,
                selection = {
                    month: parseInt(element.value, 10),
                    year: parseInt(element.form[year_field].value),
                    month_offset: parseInt(element.options[0].value)
                },
                setDate = new Date;
            return setDate.setYear(selection.year), setDate.setMonth(selection.month), today < setDate
        }
        return !0
    }, "Invalid Expiry Date"), jQuery.validator.addMethod("onlyAlphaSpaces", function(value, element) {
        return !element.form || /^[a-z ]+$/i.test(value)
    }, "Only alphabets and spaces allowed."), jQuery.validator.addMethod("onlyAlphaSpacesNonRequired", function(value, element) {
        return !value.length || !element.form || /^[a-z0-9 ]+$/i.test(value)
    }, "Only alphabets and spaces allowed."), jQuery.validator.addMethod("onlyAlphaNumSpaceUnderScore", function(value, element) {
        return !value.length || !element.form || /^[a-z0-9_* ]+$/i.test(value)
    }, "Only alphanumeric,spaces,* and _ allowed."), jQuery.validator.addMethod("onlyAlphaNumeric", function(value, element) {
        return !value.length || !element.form || /^[a-z0-9]+$/i.test(value)
    }, "Only alphanumerics allowed."), jQuery.validator.addMethod("onlyAlphaSpacesNonRequiredCod", function(value, element) {
        return !value.length || !element.form || /^[a-z]+$/i.test(value)
    }, "Only alphabets are allowed."), jQuery.validator.addMethod("nameOnCardValidation", function(value, element) {
        return !value.length || !element.form || /^[a-z0-9\.\- ]+$/i.test(value.trim())
    }, "Invalid name on card."), jQuery.validator.addMethod("checkingPattern", function(value, element) {
        return !value.length || !element.form || /^[^|]+$/i.test(value)
    }, "Special character | is not allowed."), jQuery.validator.addMethod("creditcard", function(value, element) {
        var cardTest = PayUCheckout.validate(value),
            card_valid = cardTest.length_valid && cardTest.luhn_valid;
        showIbDown(card_valid), additionalChargeBinCategoryWise !== !1 && getAdditonalChargeBinsWise(card_valid);
        var details = checkIfCardIsCreditCard();
        if (card_valid && "creditcard" == details.parentcat && PayU.getSiPayNowAndMessageControlFlag() && (PayU.getSiEnableDcFlag() ? showAllowedDebitCardForSIinCC() : showCreditCardAllowedOnly(card_valid)), PayUCheckout.isMCPapplicable(details.parentcat)) {
            var mcpCont = $("#mcp_" + details.parentcat);
            !card_valid || "" != mcpCont.html() && enteredCard == value ? card_valid || "" == mcpCont.html() || (mcpCont.html(""), resetToBase(void 0, "initialValues")) : (getMCPofCC(details.parentcat, $("#paymentForm input[name=txtid]").val(), details.ccnum.substring(0, 6)), enteredCard = value)
        }
        return card_valid
    }, "Invalid credit card number."), jQuery.validator.addMethod("debitcard", function(value, element) {
        var cc_deactivated = document.getElementById("CC_deactivated");
        if (null != cc_deactivated) {
            CC_deactivated = document.getElementById("CC_deactivated").value;
            var cardTest = PayUCheckout.validate(value),
                card_valid = cardTest.length_valid && cardTest.luhn_valid;
            return showIbDown(card_valid), showDebitCardAllowedOnly(card_valid), card_valid
        }
        return PayU.getSiPayNowAndMessageControlFlag() && PayU.getSiEnableDcFlag() && showAllowedDebitCardForSI(), !0
    }, "Invalid debit card number."), jQuery.validator.addMethod("checkingPattern", function(value, element) {
        return !value.length || !element.form || /^[^|]+$/i.test(value)
    }, "Special character | is not allowed."), jQuery.validator.addMethod("impsMobile", function(value, element) {
        if (value.length) return /^[0-9]{10}$/.test(value)
    }, "Invalid Mobile"), jQuery.validator.addMethod("impsMmid", function(value, element) {
        if (value.length) return /^[0-9]{7}$/.test(value)
    }, "Invalid MMID"), jQuery.validator.addMethod("impsOtp", function(value, element) {
        if (value.length) return /^[0-9]{6}$/.test(value)
    }, "Invalid OTP"), jQuery.validator.addMethod("currentOrFutureMonthBlank", function(value, element, year_field) {
        return 0 !== value.length || 0 === element.form[year_field].value.length
    }, "Please select month."), jQuery.validator.addMethod("currentOrFutureYearBlank", function(value, element, year_field) {
        return 0 !== element.form[year_field].value.length || 0 === value.length
    }, "Please select year."), jQuery.validator.addMethod("currentOrFutureDateBlank", function(value, element, year_field) {
        return 0 !== value.length && 0 !== element.form[year_field].value.length
    }, "Please select date"), jQuery.validator.addMethod("validateStoreCardName", function(value, element) {
        if (value.length) {
            var cardNumber, className = element.name;
            "ccard-name" == className ? cardNumber = $("#ccard_number").val() : "dcard-name" == className ? cardNumber = $("#dcard_number").val() : "rcard-name" == className && (cardNumber = $("#rcard_number").val());
            try {
                return PayUCheckout.validateStoreCardName(cardNumber, value), !0
            } catch (e) {
                return !1
            }
        }
        return !0
    }, "Cardname must not contain card number."), jQuery.validator.addMethod("validccvv", function(value, element) {}), jQuery.validator.addMethod("validccvv", function(value, element) {
        try {
            return PayUCheckout.validateCardCVV(value), !0
        } catch (e) {
            return !1
        }
    }, "Invalid CVV number."), jQuery.validator.addMethod("validvpa", function(value, element) {
        try {
            if ("undefined" != typeof allVpaValues[value]) return allVpaValues[value];
            var patternMatch = null !== value.match(/^([A-Za-z0-9-\.])+\@[A-Za-z0-9]+$/),
                lengthValid = value.length <= 50 && value.length >= 1;
            if (lengthValid && patternMatch) {
                allVpaValues[value] = !1;
                makeAjaxCallForValidateVpa(value)
            }
            return allVpaValues[value]
        } catch (e) {
            return !1
        }
    }, "Invalid VPA"), jQuery.validator.addMethod("validateEmail", function(value, element) {
        try {
            var patternMatch = null !== value.match(/^[a-z0-9]+([_\\.-][a-z0-9]+)*@([a-z0-9]+([\.-][a-z0-9]+){1,2})/i);
            return patternMatch
        } catch (e) {
            return !1
        }
    }), jQuery.validator.addMethod("validateMobile", function(value, element) {
        try {
            return /^[0-9]{10}$/.test(value)
        } catch (e) {
            return !1
        }
    }), jQuery.validator.addMethod("validtez_vpa", function(value, element) {
        var patternMatch = null !== value.match(/^([A-Za-z0-9-_.]+)$/),
            lengthValid = value.length <= 50 && value.length >= 1,
            valid = lengthValid && patternMatch;
        return valid
    }), jQuery.validator.addMethod("sodexocard", function(value, element) {
        try {
            return value = value.replace(/\s/g, ""), PayUCheckout.getSodexoBins().indexOf(value.substr(0, 6)) > -1 && 16 == value.length
        } catch (e) {
            return !1
        }
    });
    var cvv_rules = {
            minlength: 3
        },
        $form = $tabs.parent("form"),
        validator = $form.validate({
            rules: {
                icici_emi_terms: {
                    required: {
                        depends: function(element) {
                            return !$("#icici_emi_terms_container").hasClass("hidden")
                        }
                    }
                },
                axis_emi_terms: {
                    required: {
                        depends: function(element) {
                            return !$("#axis_emi_terms_container").hasClass("hidden")
                        }
                    }
                },
                cname_on_card: {
                    nameOnCardValidation: !0
                },
                dname_on_card: {
                    nameOnCardValidation: !0
                },
                rname_on_card: {
                    nameOnCardValidation: !0
                },
                ename_on_card: {
                    nameOnCardValidation: !0
                },
                chname_on_card: {
                    nameOnCardValidation: !0
                },
                dcvv_number: cvv_rules,
                rcvv_number: cvv_rules,
                ecvv_number: cvv_rules,
                chcvv_number: cvv_rules,
                cexpiry_date_month: {
                    currentOrFutureYearBlank: "cexpiry_date_year",
                    currentOrFutureMonthBlank: "cexpiry_date_year",
                    currentOrFutureDateBlank: "cexpiry_date_year",
                    currentOrFutureMonth: "cexpiry_date_year"
                },
                dexpiry_date_month: {
                    currentOrFutureYearBlank: "dexpiry_date_year",
                    currentOrFutureMonthBlank: "dexpiry_date_year",
                    currentOrFutureDateBlank: "dexpiry_date_year",
                    currentOrFutureMonth: "dexpiry_date_year"
                },
                rexpiry_date_month: {
                    currentOrFutureYearBlank: "rexpiry_date_year",
                    currentOrFutureMonthBlank: "rexpiry_date_year",
                    currentOrFutureDateBlank: "rexpiry_date_year",
                    currentOrFutureMonth: "rexpiry_date_year"
                },
                eexpiry_date_month: {
                    currentOrFutureYearBlank: "eexpiry_date_year",
                    currentOrFutureMonthBlank: "eexpiry_date_year",
                    currentOrFutureDateBlank: "eexpiry_date_year",
                    currentOrFutureMonth: "eexpiry_date_year"
                },
                chexpiry_date_month: {
                    currentOrFutureYearBlank: "chexpiry_date_year",
                    currentOrFutureMonthBlank: "chexpiry_date_year",
                    currentOrFutureDateBlank: "chexpiry_date_year",
                    currentOrFutureMonth: "chexpiry_date_year"
                },
                vpa: {
                    required: !0,
                    validvpa: {
                        depends: function(element) {
                            return "none" == jQuery(".autocompleteOutput").css("display")
                        }
                    }
                },
                tez_vpa: {
                    required: !0,
                    validtez_vpa: !0
                },
                tez_handle: {
                    required: !0
                },
                challan: {
                    required: !0
                },
                lazypay_mobile: {
                    required: !0,
                    validateMobile: !0
                },
                lazypay_email: {
                    required: !0,
                    validateEmail: !0
                },
                lazypay_otp: {
                    required: !0
                },
                tcncheckbox: {
                    required: !0
                }
            },
            errorPlacement: function(error, element) {
                "icici_emi_terms" == element.attr("name") ? error.insertAfter("#icici_emi_terms_label") : "yesw_apply_deal_code" == element.attr("name") ? error.insertAfter("#yeswApplyDealCodeRadio") : "axis_emi_terms" == element.attr("name") ? error.insertAfter("#axis_emi_terms_label") : error.insertAfter(element)
            },
            messages: {
                ccard_number: "Invalid credit card number.",
                dcard_number: "Invalid debit card number.",
                rcard_number: "Invalid credit card number.",
                ecard_number: "Invalid card number.",
                enocost_card_number: "Invalid card number.",
                ccvv_number: "Invalid CVV number.",
                dcvv_number: "Invalid CVV number.",
                rcvv_number: "Invalid CVV number.",
                ecvv_number: "Invalid CVV number.",
                chcvv_number: "Invalid CVV number.",
                ephone_cust: "Phone number is mandatory.",
                enocost_phone_cust: "Phone number is mandatory.",
                icici_emi_terms: "This field is required.",
                axis_emi_terms: "This field is required.",
                vpa: {
                    required: "Please fill VPA"
                },
                challan: {
                    required: "Please select challan"
                },
                lazypay_mobile: {
                    required: "Please enter mobile no",
                    validateMobile: "Invalid mobile no"
                },
                lazypay_email: {
                    required: "Please enter email",
                    validateEmail: "Invalid Email"
                },
                tez_vpa: {
                    required: "Please fill Tez UPI Id",
                    validtez_vpa: "Invalid Vpa"
                },
                tez_handle: {
                    required: "Please select bank"
                },
                tcncheckbox: {
                    required: "Your consent is required to proceed"
                }
            },
            // submitHandler: function(form) {}
        });
    window.validator = validator, $("#cexpiry_date_year").change(function() {
        $("#cexpiry_date_month").trigger("focusout")
    }), $("#dexpiry_date_year").change(function() {
        $("#dexpiry_date_month").trigger("focusout")
    }), $("#rexpiry_date_year").change(function() {
        $("#rexpiry_date_month").trigger("focusout")
    }), $("#eexpiry_date_year").change(function() {
        $("#eexpiry_date_month").trigger("focusout")
    }), $("#chexpiry_date_year").change(function() {
        $("#chexpiry_date_month").trigger("focusout")
    }), $("#ccard_number").change(function() {
        $("#ccard_name").length > 0 && $("#ccard_name").trigger("focusout")
    }), $("#dcard_number").change(function() {
        $("#dcard_name").length > 0 && $("#dcard_name").trigger("focusout")
    }), $("#rcard_number").change(function() {
        $("#rcard_name").length > 0 && $("#rcard_name").trigger("focusout");
        var cardNumber = $("#rcard_number").val();
        if (cardNumber = cardNumber.replace(/\s+/g, ""), cardNumber.length >= 8) {
            var regexp = /^([0-9])+$/;
            cardNumber.match(regexp) && citiRewardHandling(cardNumber.slice(0, 8))
        }
    }), $("#ccard_name, #dcard_name").data("holder", $("#ccard_name, #dcard_name").attr("placeholder")), $("#ccard_name, #dcard_name").focusin(function() {
        $(this).attr("placeholder", "")
    }), $("#ccard_name, #dcard_name").focusout(function() {
        $(this).attr("placeholder", $(this).data("holder"))
    }), $form.bind("reset", function() {
        validator.resetForm()
    }), $(".GatewayDownErrorSubmit").click(function() {
        var Parent = $("#" + $(this).attr("data-parent-id")),
            input_type = $(this).attr("data-type"),
            input_obj = "email" === input_type ? Parent.find(".email_address") : Parent.find(".mobile_number"),
            mode = $(this).attr("data-down-type"),
            valid = validateEmailOrMobile(input_obj, input_type);
        if ("CC" === mode || "DC" === mode) var issuing_bank = $("#issuing_bank").val(),
            details = getBinDetails(),
            ccnum = details.ccnum,
            masked_card = ccnum.substring(0, 6) + "XXXXXX" + ccnum.substring(ccnum.length - 4);
        else var issuing_bank = $("#netbanking_select").val(),
            masked_card = "";
        if (valid === !0 && 0 == ongoing_down_request) {
            ongoing_down_request = 1;
            var result = PayUCheckout.setUserDataForDownIb(input_obj.val(), input_type, issuing_bank, mode, masked_card);
            result.success(function(data) {
                1 == data.status && (Parent.find(".thankyou_note").show(), Parent.find(".email").hide(), Parent.find(".sms").hide(), ongoing_down_request = 0)
            })
        }
    }), $tabs.length && $.ui.tabs && ($tabs.removeClass("initial"), $tabs.tabs({
        fx: {
            opacity: "toggle",
            height: "toggle",
            duration: "normal"
        },
        select: function(event, ui) {
            switch ($("#netbanking_select").val(""), addToEventsCookie(event.type, ui.panel.id, ""), $form[0].reset(), tempDebitCardStoreSi = null, tempCreditCardStoreSi = null, showAllowedDebitCardForSI(), ccFormToggle(), nbFormToggle(), rcFormToggle(), handleStandingInstruction().payNowButtonHandler.enable(), $("input:enabled, textarea:enabled, select:enabled", this).prop("disabled", "disabled"), $("input, textarea, select", ui.panel).prop("disabled", !1), jQuery("#debit_card_select").trigger("change"), ui.panel.id) {
                case "rewards":
                    jQuery("#rewards_card_select").val("rewards_CITIR_1").trigger("change");
                    break;
                case "upi":
                    ibibo_code = "UPI", setTimeout(function() {
                        addAdditionalCharges(!1)
                    }, 100);
                    break;
                case "cod":
                case "wallet":
                    jQuery("form > div.payment-buttons.append-bottom", "#payment").addClass("hidden");
                    break;
                case "credit":
                    setTimeout(function() {
                        addAdditionalCharges(!0)
                    }, 100), initCreditCard(jQuery("input[name=ccard-type]").val());
                    break;
                case "imps":
                    ibibo_code = "IMPS", setTimeout(function() {
                        addAdditionalCharges(!0)
                    }, 100);
                    break;
                case "AmexezeClick":
                    ibibo_code = "AMEXZ", setTimeout(function() {
                        addAdditionalCharges(!0)
                    }, 100);
                    break;
                case "imps":
                    ibibo_code = "IMPS", setTimeout(function() {
                        addAdditionalCharges(!0)
                    }, 100);
                    break;
                case "paypal":
                    ibibo_code = "PAYPAL";
                    break;
                case "visac":
                    ibibo_code = "VISAC", setTimeout(function() {
                        addAdditionalCharges(!1)
                    }, 100);
                    break;
                case "lazypay":
                    ibibo_code = "lazypay";
                    break;
                case "loanemi":
                    ibibo_code = "LOANEMI";
                    break;
                case "cardlessemi":
                    ibibo_code = "cardlessemi";
                    break;
                case "google-tez":
                    ibibo_code = "TEZ", fillTezEmail();
                    break;
                case "sodexo":
                    ibibo_code = "sodexo";
                    break;
                default:
                    jQuery("form > div.payment-buttons.append-bottom", "#payment").removeClass("hidden")
            }
            $(".wallet_email input, .wallet_mobile input").blur(), hideAdditionalCharges(500)
        },
        create: function(event, ui) {
            if ($("#TriggerBlock").css("min-height", $(".pcpPanel:visible").height()), "string" == typeof window.def_tab) switch (window.def_tab) {
                case "CC":
                    $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#credit]")));
                    break;
                case "DC":
                    $(event.target).bind("tabsshow", function(event) {
                        setPaymentOptionByDefault(), $(this).unbind(event)
                    }), $("#dcard_number").trigger("change"), $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#debit]")));
                    break;
                case "NB":
                    $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#netbanking]")));
                    break;
                case "imps":
                    $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#imps]")));
                    break;
                case "ezeClick":
                    $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#AmexezeClick]")));
                    break;
                case "COD":
                    $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#cod]")));
                    break;
                case "UPI":
                    $(event.target).bind("tabsshow", function(event) {
                        window.validator.prepareForm();
                        var valid = window.validator.checkForm();
                        if (!valid) return void window.validator.showErrors()
                    }), "TEZ" == window.bank_code ? $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#google-tez]"))) : $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#upi]")));
                    break;
                case "PAYPAL":
                    $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#paypal]")));
                    break;
                case "SODEXO":
                    $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#sodexo]")));
                    break;
                case "CASH":
                    $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#cashcard]")));
                    break;
                case "WALLET":
                    $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#wallet]")));
                    break;
                case "EMI":
                    $(event.target).bind("tabsshow", function(event) {
                        $("#bankEmiList").trigger("change"), window.bank_code.length && "undefined" != typeof jQuery("option[value=" + window.bank_code + "]").parent().attr("id") && (jQuery("option[value!=" + jQuery("option[value=" + window.bank_code + "]").parent().attr("id").split("_").pop() + "]", "#bankEmiList"), jQuery("#bankEmiList").val(jQuery("option[value=" + window.bank_code + "]").parent().attr("id").split("_").pop()).trigger("change"), jQuery("option[value=" + window.bank_code + "]").parent().val(window.bank_code).trigger("change"), $(this).unbind(event))
                    }), 1 === $("ul >li", event.target).size() && $(event.target).trigger("tabsshow"), $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#emi]")));
                    break;
                case "NOCOSTEMI":
                    $(".noCostEmiClassDefault").hide(), $(event.target).bind("tabsshow", function(event) {
                        if (window.bank_code.length && "undefined" != typeof jQuery("option[value=" + window.bank_code + "]").parent().attr("id")) {
                            var getSelectedDurationPg = function() {
                                $(".noCostEmiDurationClass").find("select.emiOptionsList option").each(function() {
                                    var val = $(this).val();
                                    if (val == window.bank_code) {
                                        $(this).prop("selected", !0);
                                        var pgId = $(this).parent().attr("id").split("_").pop();
                                        $("#bankNoCostEmiList option").each(function() {
                                            $(this).val() == pgId && $(this).prop("selected", !0)
                                        }), $(this).parent("select").parent(".noCostEmiDurationClass").show(), $(this).parent().trigger("change")
                                    }
                                })
                            };
                            getSelectedDurationPg(), $(this).unbind(event)
                        }
                    }), 1 === $("ul >li", event.target).size() && $(event.target).trigger("tabsshow"), $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#nocostemi]")));
                    break;
                case "CHALLANPAYMENTS":
                    $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#challanpayments]")));
                    break;
                case "VISAC":
                    $(event.target).tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#visac]")))
            } else $(event.target).bind("tabsshow", function(event) {
                $("#bankEmiList").trigger("change")
            }), $(event.target).trigger("tabsshow")
        }
    }), jQuery("#payment-tabs").trigger("tabsshow")), $("#payment-tabs").parent("form").bind("reset", function() {
        return $("#bankEmiList").trigger("change"), $(".emi-form", this).hide(), $(".emiText").hide(), !0
    }), $("input[name='yesw_apply_deal_code']").change(function() {
        "yes" == this.value ? $("#yesw_campaignCodeContainer").removeClass("hidden") : $("#yesw_campaignCodeContainer").addClass("hidden").find("label.error").remove()
    })
}

function getAdditonalChargeBinsWise(card_valid) {
    if (card_valid) {
        var additionalChargeBinWise = additionalChargeBinCategoryWise,
            details = getBinDetails(),
            parentcat = details.parentcat,
            ccnum = details.ccnum,
            card_bin = ccnum.substring(0, 6),
            data = getBinAdditionalCharge(additionalChargeBinWise, card_bin, parentcat);
        if (0 !== data.value && data.value !== !1) {
            var initialAmt = parseFloat($("#initialAmount").html()),
                d = getServiceTax(data.value, parentcat),
                conFee = parseFloat(d.conFee),
                serviceTax = parseFloat(d.tax),
                totalAmt = initialAmt + conFee + serviceTax;
            totalAmt = totalAmt.toFixed(2), conFee = conFee.toFixed(2), serviceTax = serviceTax.toFixed(2), resetTotalAmount(totalAmt), $("#conFeeAmount").html(conFee), $("#conServiceTax").html(serviceTax), $("#additionalChargesInfo").hasClass("vhidden") || $("#additionalChargesInfo").slideDown(300), $("#amountTag").html("Total Amount")
        } else 0 === data.value ? hideAdditionalCharges(100) : addAdditionalCharges(!1);
        enteredCard != ccnum.replace(/\s+/g, "") && PayUCheckout.isMCPapplicable(details.parentcat) && 0 == payButtonClicked && resetToBase()
    } else addAdditionalCharges(!1)
}

function getServiceTax(fee, parentcat) {
    var serviceTaxPercent, serviceTaxCat = JSON.parse(serviceTax);
    serviceTaxPercent = void 0 != serviceTaxCat[parentcat] ? parseFloat(serviceTaxCat[parentcat]) : parseFloat(serviceTaxCat["default"]);
    var conFee = fee / ((serviceTaxPercent + 100) / 100);
    return {
        conFee: conFee,
        tax: fee - conFee
    }
}

function getBinAdditionalCharge(additionalChargeBinWise, card_bin, parentcat) {
    var result = {};
    for (var i in additionalChargeBinWise)
        if (parentcat === additionalChargeBinWise[i].category)
            for (var j in additionalChargeBinWise[i].bins_arr)
                if (additionalChargeBinWise[i].bins_arr[j] === card_bin) return result.issuing_bank = additionalChargeBinWise[i].issuing_bank, result.value = parseFloat(additionalChargeBinWise[i].value), result;
    return result.value = !1, result
}

function hideAdditionalCharges(timeCnt) {
    appliedAdditionalCharge && ($("#additionalChargesInfo").slideUp(timeCnt), resetTotalAmount($("#initialAmount").html()), $("#amountTag").html("Amount"))
}

function addAdditionalCharges(callBinWise) {
    if (appliedAdditionalCharge) {
        var details = getBinDetails(),
            parentcat = details.parentcat,
            ibibocode = details.ibibocode || ibibo_code || bank_code,
            ccnum = details.ccnum;
        if (ccnum && callBinWise) return void getAdditonalChargeBinsWise(!0);
        var additionalCharge = 0;
        if (ibiboCodesDetails[parentcat] && ibiboCodesDetails[parentcat][ibibocode] && ibiboCodesDetails[parentcat][ibibocode].additional_charge && (additionalCharge = ibiboCodesDetails[parentcat][ibibocode].additional_charge), additionalCharge) {
            var initialAmt = parseFloat($("#initialAmount").html()),
                d = getServiceTax(additionalCharge, parentcat),
                conFee = parseFloat(d.conFee),
                serviceTax = parseFloat(d.tax),
                totalAmt = initialAmt + conFee + serviceTax;
            totalAmt = totalAmt.toFixed(2), conFee = conFee.toFixed(2), serviceTax = serviceTax.toFixed(2), resetTotalAmount(totalAmt), $("#conFeeAmount").html(conFee), $("#conServiceTax").html(serviceTax), $("#additionalChargesInfo").hasClass("vhidden") || $("#additionalChargesInfo").slideDown(300), $("#amountTag").html("Total Amount")
        } else hideAdditionalCharges(500)
    }
}

function checkOfferValidity() {
    var details = collect_details(),
        parentcat = details.parentcat,
        ccnum = details.ccnum.replace(/ /g, ""),
        ccname = details.ccname,
        ibibocode = details.ibibocode,
        card_token = "",
        needCardDetails = PayUCheckout.needsCardDetails(),
        selector = "";
    if ("creditcard" == parentcat ? PayUCheckout.needsCardDetails() && (mode = "CC", selector = jQuery("#checkOffercc")) : "debitcard" == parentcat ? PayUCheckout.needsCardDetails() && (mode = "DC", selector = jQuery("#checkOfferdc")) : "netbanking" == parentcat ? (mode = "NB", selector = jQuery("#checkOffernb"), needCardDetails = !1) : "cashcard" == parentcat && (mode = "CASH", selector = jQuery("#checkOffercash"), needCardDetails = !1), "" == ccnum && "netbanking" != parentcat && "cashcard" != parentcat) return void alert("Please enter Card Number to check offer.");
    "undefined" != typeof window.cardToken && (card_token = window.cardToken);
    var result = PayUCheckout.validateOfferAPI(mode, ccnum, ccname, ibibocode || ibibo_code || bank_code, card_token);
    result.success(function(data) {
        1 == data.status ? needCardDetails ? (selector.parent().removeClass("check_offer").addClass("offer_success"), selector.parent().html("Your card is valid for offer. You will get a discount of Rs " + data.discount + ". Please complete the transaction to avail the offer.")) : (selector.parent().removeClass("check_offer_nb").addClass("offer_success"), selector.parent().html("Payment method selected is valid for offer. You will get a discount of Rs " + data.discount + ". Please complete the transaction to avail the offer.")) : needCardDetails ? (selector.parent().removeClass("check_offer").addClass("offer_fail"), selector.parent().html("Your card is not eligible for an offer. Please try with other card to avail the offer.</span>")) : (selector.parent().removeClass("check_offer_nb").addClass("offer_fail"), selector.parent().html("Payment method selected is not eligible for an offer. Please try with other payment method to avail the offer.</span>"))
    }), result.error(function(xhr, status, error) {
        selector.html("Try Again!")
    })
}

function initDetailsToggle() {
    $(".pane").click(function(e) {
        e.preventDefault(), Modernizr.csstransforms && $(this).find(".hide-show-button").children("img").toggleClass("rotate"), $(this).find("span.details").fadeToggle(), $(this).next().slideToggle("slow", function() {
            txt = $(this).is(":visible") ? "Hide Details" : "Show Details", hide_show_button = $(this).prev(".pane").find("span.hide-show-button"), hide_show_button.children("span.text").text(txt), Modernizr.csstransforms || (source = $(this).is(":visible") ? baseImagePath + "up.jpg" : baseImagePath + "down.jpg", hide_show_button.children("img").attr("src", source))
        })
    })
}

function collect_details() {
    var form = document.getElementById("paymentForm"),
        parentcat = $("li.ui-state-default.ui-corner-top.ui-tabs-selected.ui-state-active").attr("data-cat");
    $("fieldset.credit-card-form");
    parentcat = trim(parentcat), parentcat = parentcat.toLowerCase(), parentcat = removeSpaces(parentcat);
    var ibibocode, ccnum = "",
        ccvv = "",
        ccname = "",
        ccexpmon = "",
        ccexpyr = "";
    if ("creditcard" == parentcat && "AMEX" != ibibo_code && "DINR" != ibibo_code && (ibibocode = defaultCCIbiboCode), "upi" == parentcat && (ibibocode = "TEZ" == ibibo_code ? "TEZ" : ifVpaField ? form.vpa.disabled ? "UPIQR" : "UPI" : "UPIQR"), "cardlessemi" == parentcat && (ibiboCodesDetails.cardlessemi && ibiboCodesDetails.cardlessemi.ZCLEMI ? ibibocode = "ZCLEMI" : ibiboCodesDetails.cardlessemi && ibiboCodesDetails.cardlessemi.CLEMI && (ibibocode = "CLEMI")), "lazypay" == parentcat && (ibibocode = "lazypay"), "sodexo" == parentcat && (ibibocode = "sodexo"), console.log("ic - " + ibibocode), console.log("i_c - " + ibibo_code), "visac" == parentcat && (ibibocode = ibibo_code = "VISAC"), PayUCheckout.init(parentcat, ibibocode || ibibo_code || bank_code), "creditcard" == parentcat) {
        if (PayUCheckout.needsCardDetails()) var ccnum = form.ccard_number.value,
            ccvv = form.ccvv_number.value,
            ccname = form.cname_on_card.value,
            ccexpmon = form.cexpiry_date_month.value,
            ccexpyr = form.cexpiry_date_year.value
    } else if ("debitcard" == parentcat) {
        var ccnum = form.dcard_number.value,
            ccname = form.dname_on_card.value;
        if (window.maestroCard.codes.indexOf(ibibo_code) != -1 && 1 == $("#dcvv_number").is(":disabled")) var ccvv = "";
        else var ccvv = form.dcvv_number.value;
        if (window.maestroCard.codes.indexOf(ibibo_code) != -1 && 1 == $("#dexpiry_date_year").is(":disabled")) var ccexpmon = "12",
            ccexpyr = "2049";
        else var ccexpmon = form.dexpiry_date_month.value,
            ccexpyr = form.dexpiry_date_year.value
    } else if ("rewards" == parentcat) var ccnum = form.rcard_number.value,
        ccvv = form.rcvv_number.value,
        ccname = form.rname_on_card.value,
        ccexpmon = form.rexpiry_date_month.value,
        ccexpyr = form.rexpiry_date_year.value;
    else if ("emi" == parentcat) var ccnum = form.ecard_number.value,
        ccvv = form.ecvv_number.value,
        ccname = form.ename_on_card.value,
        ccexpmon = form.eexpiry_date_month.value,
        ccexpyr = form.eexpiry_date_year.value;
    else if ("nocostemi" == parentcat) var ccnum = form.enocost_card_number.value,
        ccvv = form.enocost_cvv_number.value,
        ccname = form.enocost_name_on_card.value,
        ccexpmon = form.enocost_expiry_date_month.value,
        ccexpyr = form.enocost_expiry_date_year.value;
    else if ("cashcard" == parentcat) var ccnum = form.chcard_number.value,
        ccvv = form.chcvv_number.value,
        ccname = form.chname_on_card.value,
        ccexpmon = form.chexpiry_date_month.value,
        ccexpyr = form.chexpiry_date_year.value;
    else window.cardToken = void 0;
    return "" != ccname && null != ccname || (ccname = "PayU"), {
        parentcat: parentcat,
        ccnum: ccnum,
        ccvv: ccvv,
        ccname: ccname,
        ccexpmon: ccexpmon,
        ccexpyr: ccexpyr,
        ibibocode: ibibocode
    }
}

function form_params() {
    console.log("Credit card payment");
}

function tryAgain() {
    return $("#try-again-button").click(function(e) {
        e.preventDefault(), $("#retry").fadeOut("fast", function() {
            $(".order-summary").removeClass("vhidden"), $("#content").removeClass("vhidden"), $("#additionalChargesInfo").removeClass("vhidden"), addAdditionalCharges(!0)
        })
    }), !1
}

function CodAgain() {
    jQuery("#cod-button1").click(function(e) {
        return e.preventDefault(), $("#retry").fadeOut("fast", function() {
            $(".order-summary").removeClass("vhidden"), $("#content").removeClass("vhidden"), $("#additionalChargesInfo").removeClass("vhidden")
        }), $("#payment-tabs").tabs("select", jQuery("li > a", "#payment-tabs").index(jQuery("@[href=#cod]"))), !1
    })
}

function select_netbanking(select_obj) {
    var selectValue = $(select_obj).val(),
        select_id = $(select_obj).attr("id"),
        nbFormTag = $("#checkOfferTagnb", this.form);
    if (nbFormTag.length && (selectValue ? (nbFormTag.removeClass().addClass("cvv_help"), nbFormTag.html('<a id="checkOfferdnb" href="#" class="help-link" onclick ="checkOfferValidity(); return false;"> Check Offer </a>')) : nbFormTag.addClass("hidden")), "CITNB" != selectValue && ($(".NetBankingBankName").html($("#netbanking_select option:selected").text()), 0 == $("#" + select_id + " option:selected").attr("gateway_status") ? ($("#netbanking_error_div_partial").slideUp(200), $("#netbanking_error_div").slideDown(200)) : 3 == $("#" + select_id + " option:selected").attr("gateway_status") ? ($("#netbanking_error_div").slideUp(200), $("#netbanking_error_div_partial").slideDown(200)) : ($("#netbanking_error_div").slideUp(500), $("#netbanking_error_div_partial").slideUp(500))), ibibo_code = selectValue, show_form = 0, "CITNB" == selectValue) {
        jQuery("#debit_card_select").val("debitcard_CITD_1").trigger("change"), jQuery("#payment-tabs").parent("form").one("reset", function(event) {
            return event.stopPropagation(), !1
        }), jQuery('a[href="#debit"]').trigger("click"), $("#netbanking_error_div").slideUp(500), $("#netbanking_error_div_partial").slideUp(500)
    }
    "" !== selectValue ? addAdditionalCharges(!0) : hideAdditionalCharges(500)
}

function select_atm_card(obj) {
    var selected_atm_card = $(obj).val();
    "" !== selected_atm_card ? (ibibo_code = selected_atm_card, addAdditionalCharges(!1)) : hideAdditionalCharges(500)
}

function nbFormToggle() {
    var nbOfferTag = $("#checkOfferTagnb", this.form);
    nbOfferTag.length && nbOfferTag.addClass("hidden"), getStoreCardToDefaultState();
    var selected_obj = $("#netbanking_select option:selected");
    if (selected_obj.attr("gateway_status")) {
        if (0 == selected_obj.attr("gateway_status")) return $("#netbanking_error_div_partial").slideUp(200), void $("#netbanking_error_div").slideDown(200);
        if (3 == selected_obj.attr("gateway_status")) return $("#netbanking_error_div").slideUp(200), void $("#netbanking_error_div_partial").slideDown(200)
    }
    $("#netbanking_error_div").slideUp(500), $("#netbanking_error_div_partial").slideUp(500)
}

function select_cashcard(selectValue) {
    ibibo_code = selectValue, show_form = 0, chcFormToggle("CPMC" == ibibo_code ? 1 : 0)
}

function chcFormToggle(showform) {
    if (showform > 0) {
        var chc_form = $(".chc-form", this.form);
        clearForm(chc_form), $(".error").attr("generated", "false"), $("label").remove(".error"), chc_form.removeClass("hidden"), chc_form.fadeIn("fast")
    } else {
        var chc_form = $(".chc-form", this.form);
        clearForm(chc_form), chc_form.fadeOut("fast", function() {})
    }
    getStoreCardToDefaultState()
}

function select_emi(selectValue) {
    if ("" != selectValue) {
        ibibo_code = selectValue, PayUCheckout.init("emi", ibibo_code);
        "ICICID" == $("#bankEmiList").val() ? $("#icici_emi_terms_container").removeClass("hidden") : $("#icici_emi_terms_container").addClass("hidden"), ibibo_code.indexOf("EMIICD") != -1 ? $("#icici_dc_emi_rupee1_message").removeClass("hidden") : $("#icici_dc_emi_rupee1_message").addClass("hidden"), "AXISD" == $("#bankEmiList").val() ? ($("#axis_emi_terms_container").removeClass("hidden"), $("#axis_ephone_customer").removeClass("hidden")) : ($("#axis_emi_terms_container").addClass("hidden"), $("#axis_ephone_customer").addClass("hidden")), emiFormToggle(1), $(".emiText").hide(), $("#emi_text_div_" + ibibo_code).show(), addAdditionalCharges(!0)
    } else emiFormToggle(0), $(".emiText").hide(), hideAdditionalCharges(500)
}

function select_bank_emi(selectValue) {
    $("#NotEligibleCardEmiMsg").addClass("hidden"), "" != selectValue ? ($(".emiClassDefault").hide(), $(".emiClass").hide(), $("#emi_duration_div_" + selectValue).show(), mode = selectValue) : ($(".emiClassDefault").show(), $(".emiClass").hide()), PayUCheckout.bankName = selectValue, "ICICID" != selectValue && $("#icici_emi_terms_container").addClass("hidden"), "AXISD" != selectValue && ($("#axis_emi_terms_container").addClass("hidden"), $("#axis_ephone_customer").addClass("hidden")), 54 == selectValue ? $("#ecvv_number").attr("maxlength", 4) : $("#ecvv_number").attr("maxlength", 3), emiFormToggle(0), $("#bank_emi_list_" + selectValue).val(""), $(".emiText").hide(), hideAdditionalCharges(500)
}

function emiFormToggle(showform) {
    if (showform > 0) {
        var emi_form = $(".emi-form", this.form);
        clearForm(emi_form), clearForm($("#icici_emi_terms_container", this.form)), clearForm($("#axis_emi_terms_container", this.form)), clearForm($("#axis_ephone_customer"), this.form), $(".error").attr("generated", "false"), $("label").remove(".error"), emi_form.removeClass("hidden"), emi_form.fadeIn("fast")
    } else {
        var emi_form = $(".emi-form", this.form);
        emi_form.fadeOut("fast", function() {})
    }
    $("#emi_error_div").slideUp(200), $("#show_notification_emi").slideUp(200), $("#icici_dc_emi_fail").slideUp(200), getStoreCardToDefaultState()
}

function select_debitcard(selectValue) {
    tempDebitCardStoreSi = null, tempCreditCardStoreSi = null, $("#not_debit_card_error").slideUp(500);
    var arr_obj = selectValue.split("_"),
        txn_mode = arr_obj[0];
    if (ibibo_code = arr_obj[1], setSurchargeMsg(parentCat, ibibo_code || defaultCCIbiboCode), "cashcard" == txn_mode) {
        var cashFormTag = $("#checkOfferTagcash", this.form);
        cashFormTag.length && (selectValue ? (cashFormTag.removeClass().addClass("cvv_help"), cashFormTag.html('<a id="checkOfferdcash" href="#" class="help-link" onclick ="checkOfferValidity(); return false;"> Check Offer </a>')) : cashFormTag.addClass("hidden"))
    }
    if ("cashcard" == txn_mode) {
        var $cashCardForm = $("#cashcard");
        if ("YESW" == ibibo_code) return null != PayUCheckout.getIbiboAliases() && PayUCheckout.init(txn_mode, ibibo_code), $cashCardForm.find("#YesWalletPaymentForm").removeClass("hidden"), $cashCardForm.find("#yesw_generate_otp_button").removeClass("hidden"), $cashCardForm.find("#pay_button").addClass("hidden"), $cashCardForm.find("#getOtpYesWalletNote").removeClass("hidden"), $cashCardForm.find("#cashcardEndnote").addClass("hidden"), void $cashCardForm.find("#CashCardPaymentForm").addClass("hidden");
        $cashCardForm.find("#YesWalletPaymentForm").addClass("hidden"), $cashCardForm.find("#yesw_generate_otp_button").addClass("hidden"), $cashCardForm.find("#pay_button").removeClass("hidden"), $cashCardForm.find("#getOtpYesWalletNote").addClass("hidden"), $cashCardForm.find("#cashcardEndnote").removeClass("hidden")
    }
    txn_mode.length && ibibo_code.length && null != PayUCheckout.getIbiboAliases() && PayUCheckout.init(txn_mode, ibibo_code), window.maestroCard.codes.indexOf(ibibo_code) != -1 ? window.maestroCard.enableFormControls(ibibo_code) : window.maestroCard.disableFormControls();
    var showform = arr_obj[2];
    dcFormToggle(showform), "" == selectValue ? (null != document.getElementById("dc_msg_disp") && (document.getElementById("dc_msg_disp").style.display = "none"), hideAdditionalCharges(500)) : (null != document.getElementById("dc_msg_disp") && (document.getElementById("dc_msg_disp").style.display = "block"), addAdditionalCharges(!0)), "MAES" === ibibo_code || "SMAE" === ibibo_code ? $("#dcvv_number").removeClass("required") : $("#dcvv_number").hasClass("required") || $("#dcvv_number").addClass("required")
}

function select_rewards(selectValue) {
    $("#citi_reward_error").html("");
    var arr_obj = selectValue.split("_"),
        txn_mode = arr_obj[0];
    ibibo_code = arr_obj[1], txn_mode.length && ibibo_code.length && PayUCheckout.init(txn_mode, ibibo_code);
    var showform = arr_obj[2];
    rcFormToggle(showform), "" !== selectValue ? addAdditionalCharges(!0) : hideAdditionalCharges(500)
}

function rcFormToggle(showform) {
    var rc_form = $(".rc-form", this.form),
        rc_save = $(".rc-save", this.form);
    getStoreCardToDefaultState(), showform > 0 ? (clearForm(rc_form), $(".error").attr("generated", "false"), $("label").remove(".error"), rc_form.removeClass("hidden"), rc_form.fadeIn("fast"), rc_save.removeClass("hidden"), rc_save.fadeIn("fast"), $("#rc_msg_disp").show()) : (clearForm(rc_form), rc_save.addClass("hidden"), rc_form.fadeOut("fast", function() {}), $("#rc_msg_disp").hide())
}

function redirect(url) {
    document.location = url
}

function trim(str) {
    return str && "string" == typeof str ? str.replace("/^s+|s+$/g", "") : null
}

function yesw_change_mobile() {
    var $cashcardForm = $("#cashcard");
    $cashcardForm.find("#yesw_mobile_number").prop("disabled", !1).css("background", "transparent"), $cashcardForm.find("#yesw_change_mobile").addClass("hidden"), $cashcardForm.find("#yesWalletOtpContainer").addClass("hidden").find("#yesw_otp").val("").removeClass("error").next("label.error").remove(), $cashcardForm.find("#yeswApplyDealCodeRadioContainer").addClass("hidden").find('input[name="yesw_apply_deal_code"]').prop("checked", !1), $cashcardForm.find("#yeswApplyDealCodeRadioContainer label.error").remove(), $cashcardForm.find("#yesw_campaignCodeContainer").addClass("hidden").find("#yesw_campaign_code").val("").removeClass("error").next("label.error").remove(), $cashcardForm.find("#getOtpYesWalletNote").removeClass("hidden"), $cashcardForm.find("#yesw_generate_otp_button").removeClass("hidden"), $cashcardForm.find("#pay_button").addClass("hidden"), $cashcardForm.find("#cashcardEndnote").addClass("hidden")
}

function generateOtpYesWallet() {
    if ($("#yesw_mobile_number").valid()) {
        var $cashcardForm = $("#cashcard");
        $cashcardForm.find("#yesw_otp_loader").removeClass("hidden"), $cashcardForm.find("#getOtpYesWalletNote").addClass("hidden"), $cashcardForm.find("#yesw_generate_otp_button").addClass("hidden");
        var result = PayUCheckout.generateOtpForYesWallet($("#yesw_mobile_number").val());
        result.success(function(data) {
            $cashcardForm.find("#yesw_otp_loader").addClass("hidden"), "ERROR" == data.status_code ? (window.validator.showErrors({
                yesw_mobile_number: "Invalid Mobile Number"
            }), $cashcardForm.find("#getOtpYesWalletNote").removeClass("hidden"), $cashcardForm.find("#yesw_generate_otp_button").removeClass("hidden"), $cashcardForm.find("#yeswApplyDealCodeRadioContainer").addClass("hidden")) : "EMPTY" == data.status_code ? (window.validator.showErrors({
                yesw_mobile_number: "Unable to process your request. Please try after some time."
            }), $cashcardForm.find("#getOtpYesWalletNote").removeClass("hidden"), $cashcardForm.find("#yesw_generate_otp_button").removeClass("hidden"), $cashcardForm.find("#yeswApplyDealCodeRadioContainer").addClass("hidden")) : ($cashcardForm.find("#yesWalletOtpContainer").removeClass("hidden"), $cashcardForm.find("#yesw_mobile_number").css("background", "#eee").prop("disabled", !0), $cashcardForm.find("#yesw_change_mobile").removeClass("hidden"), $cashcardForm.find("#yeswApplyDealCodeRadioContainer").removeClass("hidden"), $cashcardForm.find("#pay_button").removeClass("hidden"))
        }), result.error(function(xhr, status, error) {})
    }
    return !1
}

function dcFormToggle(showform) {
    var dc_form = $(".dc-form", this.form),
        dc_save = $(".dc-save", this.form),
        cc_dc_form = $(".cc-dc-form", this.form),
        cashOfferTag = $("#checkOfferTagcash", this.form);
    if ($("#debit_card_error_div").slideUp(500), $("#show_notification_debit").slideUp(200), $("#debit_card_si_error_div") && handleStandingInstruction().messagesHandler("debit_card_si_error_div").hide(), getStoreCardToDefaultState(), cashOfferTag.length && cashOfferTag.addClass("hidden"), dc_form.addClass("hidden"), showform > 0) {
        $(".redirect-message", this.form);
        clearForm(dc_form), $(".error").attr("generated", "false"), $("label").remove(".error"), dc_save.removeClass("hidden"), dc_save.fadeIn("fast"), cc_dc_form.css("display", "block"), dc_form.removeClass("hidden"), dc_form.fadeIn("fast")
    } else dc_save.addClass("hidden"), dc_form.fadeOut("fast")
}

function getStoreCardToDefaultState() {
    1 == storeCardOnByDefault && ($(".card-name").removeClass("hidden"), $("#storeCardLink").html("Undo save"), $(".debit-card-name").removeClass("hidden"), $("#storeDebitCardLink").html("Undo save"), $(".reward-card-name").removeClass("hidden"), $("#storeRewardCardLink").html("Undo save"), $(".emi-card-name").removeClass("hidden"), $("#storeEMICardLink").html("Undo save"))
}

function clearForm(form) {
    $(":input", form).each(function() {
        var type = this.type,
            tag = this.tagName.toLowerCase();
        "text" == type || "password" == type || "textarea" == tag ? this.value = "" : "select" == tag ? this.selectedIndex = -1 : "checkbox" == type && (this.checked = !1)
    })
}

function removeSpaces(string) {
    return string.split(" ").join("")
}

function showRegPopup(title, actionText, content, height) {
    $("#general_popup_title").text(title), $("#action_button").click(function() {
        $("#general_popup_div").dialog("close")
    }), $("#cancel_button").val(actionText), $("#general_popup_content").html(content), $("#general_popup_div").css("height", height), $("#cancel_button").css("margin-left", "140px"), $("#action_button").css("display", "none"), $("#general_popup_div").dialog({
        modal: !0,
        width: "auto",
        resizable: !1,
        draggable: !1
    }), $(".ui-dialog-titlebar").hide(), $(".ui-widget-content").css("border", 0), $(".ui-dialog").css("padding", 0), $(".ui-dialog-content").css("padding", 0), $(".ui-widget").css("font-family", "Arial"), $(".ui-widget input").css("font-size", "14px"), $(".ui-widget input").css("font-family", "Arial")
}

function setPaymentOptionByDefault() {
    "DC" == window.def_tab && $("#debit_card_select").val("debitcard_" + window.bank_code).trigger("change"), jQuery("#payment-tabs").parent("form").one("reset", function(event) {
        return event.stopPropagation(), !1
    })
}

function maskSensitveValues(elementId, value) {
    switch (elementId) {
        case "ccard_number":
        case "ccvv_number":
        case "cexpiry_date_month":
        case "cexpiry_date_year":
        case "dcard_number":
        case "dcvv_number":
        case "dexpiry_date_month":
        case "dexpiry_date_year":
        case "ecard_number":
        case "ecvv_number":
        case "eexpiry_date_month":
        case "eexpiry_date_year":
        case "chexpiry_date_month":
        case "chexpiry_date_year":
            value = value.replace(/(\d)/g, "X")
    }
    return value
}

function addToEventsCookie(eventType, targetId, targetValue) {}

function getWalletData() {
    var walletData = "";
    return walletData = walletData + "wallet_email=" + document.getElementById("wallet_email_input").value, walletData = walletData + "|wallet_phone=" + document.getElementById("wallet_mobile_input").value
}

function getImpsData() {
    var imps_data = "";
    return imps_data += "imps_mobile_number=" + $("#imps_mobile_number").val(), imps_data += "|imps_mmid=" + $("#imps_mmid").val(), imps_data += "|imps_otp=" + $("#imps_otp").val()
}

function getYesWalletData() {
    var yesWalletData = "";
    return yesWalletData = yesWalletData + "yes_wallet_phone=" + document.getElementById("yesw_mobile_number").value, yesWalletData = yesWalletData + "|yes_wallet_otp=" + document.getElementById("yesw_otp").value, "no" == $("input[name='yesw_apply_deal_code']:checked").val() ? yesWalletData += "|yes_wallet_campaign_code=0" : yesWalletData = yesWalletData + "|yes_wallet_campaign_code=" + document.getElementById("yesw_campaign_code").value, yesWalletData
}

function getAxisData() {
    var axis_data = "";
    return axis_data += "ephone_cust=" + $("#ephone_cust").val()
}

function getCodData() {
    var codData = "";
    return codform ? codData = codData + "shipping_phone=" + document.getElementById("shipping_mob").value : (codData = codData + "shipping_firstname=" + document.getElementById("shipping_firstname").value, codData = codData + "|shipping_lastname=" + document.getElementById("shipping_lastname").value, codData = codData + "|shipping_address1=" + document.getElementById("shipping_address1").value, codData = codData + "|shipping_address2=" + document.getElementById("shipping_address2").value, codData = codData + "|shipping_city=" + document.getElementById("shipping_city").value, codData = codData + "|shipping_country=" + document.getElementById("shipping_country").value, codData = codData + "|shipping_state=" + document.getElementById("shipping_state").value, codData = codData + "|shipping_zipcode=" + document.getElementById("shipping_zipcode").value, codData = codData + "|shipping_phone=" + document.getElementById("shipping_phone").value), codData
}

function submitCod() {
    ibibo_code = "COD", form_params(), $("#paymentForm").submit()
}

function submitMobCod() {
    ibibo_code = "COD", codform = "true", form_params(), $("#paymentForm").submit()
}

function validateCod() {
    window.validator.prepareForm();
    var x = window.validator.checkForm();
    0 == x ? window.validator.showErrors() : submitCod()
}

function codmobsubmit() {
    window.validator.prepareForm();
    var x = window.validator.checkForm();
    0 == x ? window.validator.showErrors() : submitMobCod()
}

function changeDetails(edit_cod) {
    window.location = "cancel.php?mode=COD&status=retry&edit_cod=" + edit_cod + "&mihpayid=<?php echo $encoded_mihpayid ?>"
}

function image() {
    $("#mobileDetails").css("display", "none"), $("#allDetails").css("display", "block")
}

function getWinCenterLeftPosition(popW) {
    var w = $(window).width(),
        x = 0;
    return window.screenX ? x = window.screenX : window.screenLeft && (x = window.screenLeft), leftPos = (w - popW) / 2 + x, leftPos
}

function getOuterHeight() {
    var totalW, totalH;
    return window.outerHeight ? (totalW = window.outerWidth, totalH = window.outerHeight) : screen.availHeight && (totalH = screen.availHeight, totalW = screen.availWidth), {
        totalHeight: totalH,
        toalWidth: totalW
    }
}

function checkIfPopupExists(poppedWindow) {
    var result = !0;
    return result = "undefined" != typeof poppedWindow && ((!poppedWindow || !poppedWindow.closed) && !!poppedWindow)
}

function is3dNBAllowed(selectedMode, nbIbiboCode) {
    var nbAllowed = ["HDFB", "AXIB", "SBIB", "ICIB"];
    return "#netbanking" === selectedMode && window3DNBEnabled && $.inArray(nbIbiboCode, nbAllowed) !== -1
}

function Process3dWindow() {
    var selectedMode = $("li.ui-state-active > a", "#payment-tabs").attr("href"),
        window3DStatus = "",
        cashcardCitimPM = !1;
    if ($.browser.msie && parseInt($.browser.version, 10) < 8) return window3DStatus;
    var user_string = navigator.userAgent;
    if (screen.width <= 650 || screen.height <= 650 || /iPhone|iPad|ipod|Android/i.test(user_string)) return window3DStatus;
    if ("#cashcard" == selectedMode && "CPMC" == ibibo_code && (cashcardCitimPM = !0), is3d_nballowed = is3dNBAllowed(selectedMode, ibibo_code), window3DEnabled && ("#debit" == selectedMode || "#credit" == selectedMode || "#emi" == selectedMode || cashcardCitimPM || "#rewards" == selectedMode) || is3d_nballowed) {
        var windowOpened = open3DWindow(selectedMode);
        if (windowOpened) {
            window3DStatus = "Opened";
            var popW = 600,
                leftPos = getWinCenterLeftPosition(popW),
                topPos = 250;
            $("#backBlackScreenMsg").show(), $(".win_3d_load_bx").dialog({
                autoOpen: !1,
                draggable: !1,
                resizable: !1,
                height: 130,
                width: 580,
                modal: !0,
                open: function(event, ui) {
                    $(event.target).parent().css("position", "fixed"), $(event.target).parent().css("top", topPos), $(event.target).parent().css("left", leftPos)
                }
            }), "#netbanking" == selectedMode && $("#popupmsg").html("Please enter your NetBanking Login details in the new window </br> that appeared on your screen."), $(".win_3d_load_bx").dialog("open"), threeDWindow && threeDWindow.focus()
        }
    }
    return window3DStatus
}

function open3DWindow(selectedMode) {
    popH = 560, popW = 950, topPos = screen.height / 2 - popH / 2 + 10, leftPos = screen.width / 2 - popW / 2;
    var winNumber = $("#paymentForm input[name=txtid]").val();
    if (threeDWindow = "threeDWindow_" + winNumber, threeDWindow = threeDWindow.replace(/[^A-Za-z0-9_]+/g, ""), threeDWindow = window.open("", threeDWindow, "status=0,toolbar=0,menubar=0,resizable=1,scrollbars=1,titlebar=0,dependent=on,width=" + popW + ",height=" + popH + ",top=" + topPos + ",left=" + leftPos), window.onunload = function() {
            threeDWindow && !threeDWindow.closed && threeDWindow.close()
        }, !checkIfPopupExists(threeDWindow)) return !1;
    var loadingMsg = "<html>";
    loadingMsg += "<title> PayU </title>", loadingMsg += "<body>", loadingMsg += "<br><br><br><br><br><center>", loadingMsg += '<img src="data:image/gif;base64, R0lGODlhIAAgAPYAAP///wCc4vr8/eLz+tLt+dTt+e73/Pz9/fb6/bji9mzF7US26U666ojQ8Nbu+fT6/Mbo90y56gSd4h6n5eDy+ur2+57Y86bc9PL5/IrR8Rqm5Daw57rj9t7x+trw+nrL7zyz6Cir5iys5qjc9HbJ7w6h4yKp5ard9Fa96+z3/IbP8CCo5Qyg46ze9Bym5cjp+Bak5Aqf4yaq5oTO8MLm9z6z6BKi43TI7pLU8pDT8Ril5IzS8bbi9jCu57zk9pTV8kK16djv+aTb9MDm98rp+Mzq+Fq+6ySp5Y7S8X7M73LH7oDN8Aif4r7l9q7f9XzL75bV8mjE7WrE7bTh9dzw+mDB7LLg9bDf9XjK787r+ILO8Fi96zKv58Tn9+Tz+/j7/fD4/Ob0+yqs5mLB7F7A7Oj1+3DH7gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhYaHiImKi4yNjQeGCCkCjoYpBDQFKYMCHDMElYQeKgw1DA1BkAg5QAmhghUfKxK0Jh8VBwcOPBWFFR0PiQIJILTGGwmQALmEKUtGTgiIDxYhxrUW0ocEGyUKBogIFyLXEiEnlIcVz9GIBwQMLNcMRMrqHsGJBiMLGjYuC4RgeFXoAAYPLVSQ2OEDHMFBCCBkIJGBwwAD6Rwx45QggoYSAF+8cmDBAoVBAxSUu5GvUYUnE0zscEhgQbkFvRxRMEJLQc4CDMoxyNkIA5QaC0YMBGCgwQRjLnBkbGSACBGHyxwo2GBiA4mTDwtS4HAigQOMYQ89eGEhBy97iZg2uoOAQsYEED82xSVigcZSdSRgGAMyJC6HGi42ZEPUAUUMYyFGKEOAQRtTEiVoRaGCqIKCzLRA+AAgoAiSJCdyYlABg0kJKUQLdtSgo8eMAbqMwCjRwwK4d0ZqGJkytdCDBDM+WOhwQJwMY0Y8CDrgoUkBy4gEVKiQD4GQI7RKRCcENxQB3bwt/E1LmsYMJSbZFxJggLujQAAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEgwcVVFQpB4WNjo4PEEkoKEsvD4+ZjQI0RhoSEhpGEAKapgAVSxOgoBNJFaeFBg4EFQJBRkysoEZBsYIHDg0oDFhNREa7EiW9vwADJKsSOihOSdKgLq+CFRWMjwI8G7sTGTwoMKA2W0OlqUkDmQhCIcokFUVaDAwzBAjcUaI4yCTAyjhWK3JgQpAiBYJvAG4FKZWJgpJPEmAwgOBM3osnDCIoSIChYyMMBYYQCUKg1j+ThDA4MbIAhQVbMAsdGBKhBKgNJyDGQgDBAgGKD35gK0ECk7MORkIogAXgAY6lTTt6iCKDRDwAB5r0lMBiQwuhpxB0MUoRgAEnVZxq3syJFgDKIQQM5NQk4IAADA/q7nXLAQkUf6ceOOR7ZcGKI1GyCB6UwgKJESUfVVCQTsIRKE4dHbDSo0SNJhWjsJqAJHPEtmBHmJDAZUomDDhEMIGxIEGpAwWECCnQtoOSCEu+asYRRcoVvQA8SDGxIgoVQhVqmTqAgQJOsDx6gOrBY7LJISBAgRhivmOFHCFzUB2MvUiR+fQHBwIAIfkECQoAAAAsAAAAACAAIAAAB/+AAIKDhIUAB4aJiokHFUVdQQ+Lk4YHDksLNUYjFZSeABRPKxISJUAtkgcPGAieDwMFAwgCPkBMpBI6HwMYRBY4Jw4CixhOClsKPBUtXLilUQQnWyImGwovX4m0CyUlOgwJTRHOLk8XESW4LgpUiQYNOrgmOUEqR6QsEU4ZJs4SCxwQFUqRBAYuDRkMVLBghMGHLhWWxHO2ocWwQghOcIkhgQkIJ4gOKMQA4AGUe7hYAPFxsVAFFQt6RMgxQFEXFDbkfeigCEGFJi2GVBBoCMMVIz1CbLhBpJUhBBhCEu1ZwIkQHhSmCsJAQIiQAi09IZilrcmWEDKMQPhUSFW2QQa1VGggpUGLU7YAPEBxYmBQBRLpSim4y5YGil2DEFjg0m2DhbCfKnBoSqgCDiNGLNTEO+lACg8OOnEeTdoTBgNaSw86QADJEh+SKKUg4CU1oQ5RNMAACLnQgxw1lFCYBGEDKRNQYitKoQBGhCKTgmyBUeLj3QcUhg4ScEUKFNGKHjiJknkzAAwjoiQhQNQnSUoIKATpO8jBuCM53qsmVIBBiSM46LefIAZcoB57AxaCQXaEJUhaIAAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhQcCB4WKi4yCBgRTTRSJjZWFDxdbG0BLBJSWlQdEDCUSEmIZFaCKCGAIgggtYqYSJVEOAhVFEEEPlgMtGRdBAghOIrS2BQQqDAtRLSmNFSobGj1JHQceYzC1GxYvWEemJRFTr4tFC7Q1CQAITQoLDBYePDW0EhpJqosvNZiY2mBF0IEKHSg8ENCihz5bHhhVUGCihIkoBBg1WVDKlIkZ/hQdeKHCyJImvhYN0NIjhgQYKDikW3TQQYWZigQ4yGGEgQIhQVLgXLUIQ5AuV3AsyXBlwCcwHQYMtXQAgoIeLkwAQeJvAI4tRloYIAqgAgkX+jZcACBgCoiXDLUyEiWQTx8MBfAshBjogywBhw/JADhAA8WEIwqCkA0SgYU+HUkEpeDRAAeRqY0e5GhpCgaDIYMQpDDwiaiHHQt6bIhyZSxZRge7OJlCAMNrUAdKK6pQIIxuRohAdViyQIEnS0GQJMA86MAVLqcspGyUYIEK17B9RNAB5MpMASlsEwJGRIClFC1ICAkp4EUDCyEFBQeFoMKDTwZUHInQ5fftQQ9YUANG/1VCAQcviFcgcP4tWGAgACH5BAkKAAAALAAAAAAgACAAAAf/gACCg4SFhoeIiQAYQURBD4qRhQ88UREKPBiSkgcFRjASMFFFB4OlmwgPpwc+GxKvQDwCAAgdRUGaiQcOFxZEkAcvESUSJQxdAgYJCgxRIxWJHVg9MlEQpRU/QGILFhUIQ1s6oQtWkIdDNa89FucVHBZN0Bg/Mq8SKzPQhgdEwxIbTpwTdAqAgRxH7rl4MgBRCgsoIjToULAQAh4LSjApAUJILn4ViNAYUNFQBQsMNkTYQVHRgZKHBFR4YYUHgQEYYG4CmWDHEgsEEBR6uXMQghYoTGgQoYDAqQdELFjZt7ODEWKvTGRIAWCXAjEgLgyUBKHHvWJGOnSFsECCCxVcyHcScXWvRBQqgjwkqcFgitCdA6KMeyUGSS4BHXy8MFCUVoIqXEKASFKg4AEBOhEdMBAEQgsoP1oEmdWYEAICOaKgUGDBQc7ShYJgEfEKxgIhcQ8d6PDCS2YEFjYwuSeKAGlDHT4sQEK1kAEtg++BsHK8EIEtExSoPZRiSfRXNaZUJ1Thwo1MhAS8Bs7lrA4jpBI9+Jb+BVBBQZ70sFFCQwTcpT0AkROlCFAADlEYocAJze0kgH0OmFKBAwVQ8FFpAqgC24YcdhgIACH5BAkKAAAALAAAAAAgACAAAAf/gACCg4SFhoeIiYIHD1+Kj4cYL0JTFAKQmAddRj1AOQOYkA9QJhIlW0QHgweqkAeXgw8WMqZGBKoHFC9EFa2IBl1XQbACRWYgDBYVAAcESgsRM0G+hQIJWyBJHoMIDlMQvQApSLQSG0IYiBgNExILPtSFFAolEhIrWsuHCC0RPQq3ElVoUIoFF2UCr1jo8kARAghSNtTAQgDWoQMIMFhM9IDAFR4OGobKxOrBg40jESEIcuXECwOEDmCogCAlAAEQonDpkQwmswpCZjQRGWrAk3amUEAQhGAIChkfQI0kgKKevR4nBhFQEAGKvlBBolhlAoIHtwJdpI5MIQSIDhgiyT50KBTP1QMPFqJE2VGkps1BAgb4GNGiCwECFVCmPBAkw4IeIG4wfFS3UAoLG+xJCJFkrkAeBPwCAFNg14AvBaLA0CwhwpDKN4cwyFCGGYUfDLiAUJCgSVXWC5rAZoxkCoYDFTBrnmDkwo0VmmFEIaDoQIqGOH9rlpGhRZUjOiZEuJAilAAeNVhLgIHFwZAdCpJM+QpJQJMITFjrmEGzQocK6aQUhBIuaBYDCC0Q9RcADzRhhAklwACCCp4tGMsLGUShxAUdKFZIIAAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhYaHiImKi4wCFR0pB4yTggUZChYVlIwIFhsaKBCSm4mdIiULNKMAGBQUD4wYYbCDBElGUJqCFRZSCk4pigZXWjwYgwgUBRUCggddDDAuRkTNiARGRwpBig8jIRISNTwIiQMqEUgDis8MLiZRRauGAg4cQdaJBk4kT8aLBwTMS/SAwgBapBIq7DaAgoGBACBOqiAkSpQfHlY9cABB16YHToDAkLABioFBA3ZEaSIxUYUMLsKViEJlUIoTOwi0RGTgBzgJLpR4ZFWhHKkDL6L0EIGixTFDAXcaegDhRw4eQwUJoOBjxBUCJxcJEIAgRQWEg+qpWMBlQ5QrYdEPpSiSoGPLCkh6lAinwQiNfIQqjDBSg0GODhAP0EARrnGIHBUOgPFSFAACDhFGlthgIVghBFNqxGgsQQMWBzRUGMEUpAKUnxJ0KOkAdQgD0hJWLJlixESJElxUELHQo/GED7QNeXhigonMBRYyyCC9oAUHIy5KwAAyIi4hBEOicJkQIgKUISR0kBZhYcAUKSiMWKCQCMPwGTmmuJqxgvSGFghgQEAXBETGDgYVpFDOAzwssFduUhAwSEALpWDBFhvUoMAQaC0kiH1XcNCBUYoEAgAh+QQJCgAAACwAAAAAIAAgAAAH/4AAgoOEhYaHiImKi4wAB18HjZIADwQ+HZGTi0FPKFAVmotEKCEfA4QPBg+Nj5mCFRZPPBiDFS0NLaCKAh0+A64CKRS0ggJDDCYMCQiKBhZbLcSICE5cEhsXq4kPTTtEzIkHBQoRJASuiBgV2ooIlgTshQcCCAIH6Lv26Q4+Vl0UAkIdejAESwQgKHZ4wLfoAAYMAQEIIBJlhQQJJUTk0NXInYUcPkClsNDjoskIRBgiCoJFxJEtHBAM+ODC5EUuHFQaOjBkwUUxPwxUaGDCpgQQTSI2JGBERwkQQh48uBKhhEkYChaySjEiCooMDu51QFJjAgwZDKZIa1SBSJcO4OB4nVCBRYUFHwUqKGV0z9CDCgVOfNgSBQeBvYUEVOigNxGCF1GOlIDBRUuHaUR2KMjwDVEKHEdsApkCjtABB1gkH1FQQGWFJzpsirBQIUUQAlRWCfDh8+ICHqUJVchQ9CKTDSOCXJCC4kMTDAiGVMW4wEfwQQg4MNDBRMLqJiMWwJBgIsqLBx1UbDCxYYnWQ7aiRGBAggMBmia5WDCAoICFJRYQcJ1pFRDAQRMO2KZEbBf1AIUBACBQAQWNLSLAhZHA0kN3JUTAQzwCRVjAEkBwwYAFFIRoCC9XXBCSToQEAgA7AAAAAAAAAAAA" width="32" height="32" alt="Processing..." />', loadingMsg += "<br><p><b>", loadingMsg += '<span style="font-family: arial bold; font-size:14px ">You will be redirected to your bank\'s website for authentication.</span></b><br/>', loadingMsg += '<span style="font-family: arial; font-size:14px "> This may take a few seconds. Please do not refresh the page or click the "back button" or close the browser window.</span></p></center>', loadingMsg += "</body> </html>", threeDWindow.document.write(loadingMsg), threeDWindow.document.close(), threeDWindow.focus(), window.timer_expired = !1;
    var expiryTime;
    return expiryTime = "#netbanking" == selectedMode ? 9e5 : 48e4, intervalId = setInterval(function() {
        checkIfPopupExists(threeDWindow) || "yes" == window.self_closed || (loadSelfHelp(window.timer_expired ? "timer_expired" : "user_cancelled"), clearInterval(intervalId)), "undefined" == typeof this.timeSinceOpen && (this.timeSinceOpen = 0), timeSinceOpen > expiryTime && checkIfPopupExists(threeDWindow) && (threeDWindow.close(), window.timer_expired = !0),
            this.timeSinceOpen += 200
    }, 200), !0
}

function loadSelfHelp(trackVar) {
    $(".opening3dMsg").hide(), window.timer_expired ? $(".timer_expired").show() : $(".bank_verify").show();
    var mihpayuid = $("#paymentForm input[name=txtid]").val();
    trackVar ? postData = {
        mihpayid: mihpayuid,
        from: trackVar
    } : postData = {
        mihpayid: mihpayuid
    }, request = jQuery.ajax({
        type: "POST",
        url: "selfHelp.php",
        data: postData,
        dataType: "json",
        timeout: 6e4
    }), request.done(function(response) {
        window.location = response.url
    })
}

function ShowCvvImage(pObj, pE) {
    var div_obj = $("#divBlock");
    "hidden" == div_obj.css("visibility") && (GetDivPos(div_obj, pObj), div_obj.css("visibility", ""), ShowDiv(pE))
}

function GetDivPos(pDivObj, pObj) {
    var position = pObj.position();
    pDivObj.length > 0 && pObj.length > 0 && (pDivObj.css("left", position.left + "px"), pDivObj.css("top", position.top + parseInt(pObj.height(), 10) + "px"))
}

function ShowDiv(pE) {
    navigator.userAgent.search("MSIE") > 0 ? pE.cancelBubble = !0 : (pE.preventDefault && pE.preventDefault(), pE.stopPropagation && pE.stopPropagation())
}

function HideDiv() {
    $("#divBlock").css("visibility", "hidden")
}

function processWallet() {
    ibibo_code = "PAYUW", form_params(), $("#paymentForm").submit()
}

function processIMPS() {
    ibibo_code = "IMPS", form_params(), validateInput() || $("#paymentForm").submit()
}

function processEzeClick() {
    ibibo_code = "AMEXZ", PayUCheckout.init("AMEXZ", ibibo_code), $("#paymentForm").submit()
}

function numbersOnly(event) {
    var keycode = getKeyCode(event),
        shiftKeyPressed = event.shiftKey;
    if ((keycode < 46 || keycode > 58) && 8 !== keycode && 9 !== keycode || shiftKeyPressed === !0) return !1
}

function getKeyCode(event) {
    var keycode = null;
    return window.event ? keycode = window.event.keyCode : event && (keycode = event.which), keycode
}

function validateEmailOrMobile(input_obj, input_type) {
    var input_val = input_obj.val(),
        email_regex = /^[a-z0-9]+([_\\.-][a-z0-9]+)*@([a-z0-9]+([\.-][a-z0-9]+){1,2})/i;
    return "sms" === input_type && 10 !== input_val.length ? (input_obj.addClass("pg_down_input_error"), !1) : !("email" === input_type && !email_regex.test(input_val)) || (input_obj.addClass("pg_down_input_error"), !1)
}

function validateInput() {
    var error_flag = !1;
    10 !== $("#wallet_mobile_input").val().length && ($(".wallet_mobile").addClass("wallet_error"), error_flag = !0);
    var email_val = $("#wallet_email_input").val(),
        email_regex = /^[a-z0-9]+([_\\.-][a-z0-9]+)*@([a-z0-9]+([\.-][a-z0-9]+){1,2})/i;
    return "" !== email_val && email_regex.test(email_val) || ($(".wallet_email").addClass("wallet_error"), error_flag = !0), error_flag
}

function removeError(cls, event, removeClass) {
    var keycode = getKeyCode(event);
    8 !== keycode && $("." + cls).hasClass(removeClass) && $("." + cls).removeClass(removeClass)
}

function TabsHeightFix(id) {
    var cH = $(id).height();
    $("#TriggerBlock").css("min-height", Math.max(dH, cH)), $(id).css("min-height", Math.max(dH, cH))
}

function getBinUpDownStatus(bin_list_banks, card_bin) {
    var result = {};
    for (var i in bin_list_banks)
        for (var j in bin_list_banks[i].bins_arr)
            if (bin_list_banks[i].bins_arr[j] === card_bin) return result.issuing_bank = bin_list_banks[i].issuing_bank, 2 == bin_list_banks[i].status ? result.up_status = 2 : result.up_status = 0, result.title = bin_list_banks[i].title, result;
    return result.up_status = 1, result
}

function showIbDown(card_valid) {
    var issuing_bank_down = PayU.getIssuingBankGenericDownFlag();
    if (0 === issuing_bank_down) return !0;
    if (card_valid) {
        var details = getBinDetails(),
            parentcat = details.parentcat;
        if ("creditcard" !== parentcat && "debitcard" !== parentcat && "emi" !== parentcat) return !0;
        var ccnum = details.ccnum,
            card_bin = ccnum.substring(0, 6),
            result = PayU.getDownIssuingBankBins(),
            data = getBinUpDownStatus(result, card_bin);
        if (0 == data.up_status || 2 == data.up_status) return $("#issuing_bank").val(data.title), "creditcard" === parentcat ? ($(".CreditCardBankName").html(data.title), $("#credit_card_error_div").slideDown(200), 0 == data.up_status && $("#show_notification_credit").slideDown(200), ib_downtime_show = 1) : "debitcard" == parentcat ? ($(".DebitCardBankName").html(data.title), $("#debit_card_error_div").slideDown(200), 0 == data.up_status && $("#show_notification_debit").slideDown(200)) : "emi" == parentcat && ($(".EmiCardBankName").html(data.title), $("#emi_error_div").slideDown(200), 0 == data.up_status && $("#show_notification_emi").slideDown(200)), !1
    }
    return $("#debit_card_error_div").slideUp(200), $("#credit_card_error_div").slideUp(200), $("#emi_error_div").slideUp(200), $("#show_notification_credit").slideUp(200), $("#show_notification_debit").slideUp(200), $("#show_notification_emi").slideUp(200), ib_downtime_show = 0, !0
}

function showCreditCardAllowedOnly(card_valid) {
    if (handleStandingInstruction().messagesHandler("credit_card_si_error_div").hide(), handleStandingInstruction().messagesHandler("credit_card_si_error_default_div").hide(), 0 === ib_downtime_show) {
        var si_transaction = 0;
        if ($("#removeStoreCardLink").length > 0) var si_transaction = parseInt($("#removeStoreCardLink").val(), 10);
        if (0 === si_transaction) return !0
    }
    if (card_valid) {
        var details = getBinDetails(),
            parentcat = details.parentcat;
        if ("creditcard" !== parentcat) return !0;
        var ccnum = details.ccnum,
            card_bin = ccnum.substring(0, 6)
    }
    var result = PayU.checkIfCardIsCredit(card_bin);
    return result.success(function(data) {
        var enable_si_dc = PayU.getSiEnableDcFlag(),
            msgId = enable_si_dc ? "credit_card_si_error_div" : "credit_card_si_error_default_div",
            status = parseInt(data.status, 10);
        return PayU.setCreditCardBin(card_bin, status), 0 === status ? (handleStandingInstruction().messagesHandler(msgId).show(), !1) : void handleStandingInstruction().messagesHandler(msgId).hide()
    }), !0
}

function showDebitCardAllowedOnly(card_valid) {
    if (0 === ib_downtime_show && card_valid) {
        var details = getBinDetails(),
            ccnum = details.ccnum,
            card_bin = ccnum.substring(0, 6),
            debit_card_bins = PayU.getDebitCardBin();
        for (var bin in debit_card_bins)
            if (card_bin == bin) return 1 === debit_card_bins[bin] ? ($("#not_debit_card_error").slideDown(200), !1) : ($("#not_debit_card_error").slideUp(500), !0);
        var result = PayU.checkIfCardIsCredit(card_bin);
        result.success(function(data) {
            var status = parseInt(data.status, 10);
            return PayU.setDebitCardBin(card_bin, status), 1 === status ? ($("#not_debit_card_error").slideDown(200), !1) : ($("#not_debit_card_error").slideUp(500), !0)
        })
    }
}

function checkIfCardIsCreditCard() {
    var details = getBinDetails();
    return details
}

function showAllowedDebitCardForSI() {
    PayU.getSiPayNowAndMessageControlFlag() && PayU.getSiEnableDcFlag() && setTimeout(function() {
        var details = getBinDetails(),
            ccnum = details.ccnum;
        if (details.ccnum != tempDebitCardStoreSi)
            if (tempDebitCardStoreSi = details.ccnum, ccnum) {
                var card_bin = ccnum.substring(0, 6),
                    result = PayU.checkIfBankAllowedForDCSI(card_bin);
                result.success(function(data) {
                    var status = parseInt(data.status, 10);
                    0 === status ? handleStandingInstruction().messagesHandler("debit_card_si_error_div").show() : handleStandingInstruction().messagesHandler("debit_card_si_error_div").hide()
                })
            } else handleStandingInstruction().messagesHandler("debit_card_si_error_div").hide()
    }, 0)
}

function showAllowedDebitCardForSIinCC() {
    setTimeout(function() {
        var details = getBinDetails(),
            ccnum = details.ccnum;
        if (details.ccnum != tempCreditCardStoreSi)
            if (tempCreditCardStoreSi = details.ccnum, ccnum) {
                var card_bin = ccnum.substring(0, 6),
                    result = PayU.checkIfBankAllowedForDCSI(card_bin);
                result.success(function(data) {
                    var status = parseInt(data.status, 10);
                    0 === status ? handleStandingInstruction().messagesHandler("credit_card_si_error_div").show() : handleStandingInstruction().messagesHandler("credit_card_si_error_div").hide()
                })
            } else handleStandingInstruction().messagesHandler("credit_card_si_error_div").hide()
    }, 0)
}

function getBinDetails() {
    var form = document.getElementById("paymentForm"),
        parentcat = $("li.ui-state-active").attr("data-cat");
    parentcat = removeSpaces(parentcat.toLowerCase());
    var ibibocode, ccnum = "";
    if ("creditcard" === parentcat && "AMEX" !== ibibo_code && "DINR" !== ibibo_code && (ibibocode = defaultCCIbiboCode), "creditcard" === parentcat) var ccnum = form.ccard_number.value;
    else if ("debitcard" === parentcat) var ccnum = form.dcard_number.value;
    else if ("emi" === parentcat) var ccnum = form.ecard_number.value;
    else if ("nocostemi" === parentcat) var ccnum = form.enocost_card_number.value;
    else if ("rewards" === parentcat) var ccnum = form.rcard_number.value;
    else if ("cashcard" === parentcat) var ccnum = form.chcard_number.value;
    return {
        parentcat: parentcat,
        ccnum: removeSpaces(ccnum),
        ibibocode: ibibocode
    }
}

function putNewStyles() {
    $(".footer_class").hide(), $("#order-summary").hide(), $("#payu_logo").hide(), $("#header").css("width", "100%").css("margin-top", "10%"), $("#processing").css("border", "0px").css("padding", "0px"), $("#merchantLogo").css("float", "none").css("margin", "0 auto"), $(".disclaimer").hide()
}

function getCardEmiEligibility() {
    var cardNumber = $("#ecard_number").val().trim().replace(" ", "");
    if (cardNumber.length < 6) return $("#minAmountMsgDiv").addClass("hidden"), $("#NotEligibleCardEmiMsg").addClass("hidden"), $("#ecard_number").removeClass("redText"), void $(".EmiPayNowButton").attr("disabled", !1);
    if (!(cardNumber.length > 6)) {
        var cardBin = cardNumber.substring(0, 6);
        cardBin && checkCardEmiEligibility(cardBin)
    }
}

function checkCardEmiEligibility(cardBin) {
    if (!cardBin) {
        var cardBin = $("#ecard_number").val().trim().replace(" ", "").substring(0, 6);
        if (cardBin.length < 6) return
    }
    var EligibleBins = (parseFloat($("#initialAmount").html()), PayUCheckout.getEligibleBinsForEMI("bin", cardBin, $("#bankEmiList").val()));
    EligibleBins.success(function(data) {
        0 == data.status && ($("#ecard_number").addClass("redText"), $("#NotEligibleCardEmiMsg").removeClass("hidden"), $("#NotEligibleCardEmiMsg").addClass("pnote"), $("#NotEligibleCardEmiMsg").addClass("emiCardEligibilityError"), $(".EmiPayNowButton").attr("disabled", !0))
    })
}

function processPayZapp() {
    ibibo_code = "PAYZ", form_params(), $("#paymentForm").submit()
}

function makeAjaxCallForValidateVpa(value) {
    var result = 0;
    return $.ajax({
        url: "ValidateVpa.php",
        method: "POST",
        async: !1,
        data: {
            mihpayuid: $("#paymentForm input[name=txtid]").val(),
            vpa: value
        },
        success: function(res) {
            allVpaValues[value] = 1 == res
        },
        error: function() {
            allVpaValues[value] = !0
        }
    }), result
}

function payUsingQR() {
    $("#vpa").attr("disabled", !0), form_params(), $("#paymentForm").submit()
}

function getMCPofPaypal(cardtype, payuid, bin) {
    PayUCheckout.getMCPofCC(payuid, bin, "paypal").success(function(res) {
        if (document.getElementById("paypal_loader").style.visibility = "hidden", null != res && "0" == res.resultCode) {
            mcpBaseAmount = res.baseAmount, mcpBaseAmount.value = parseFloat(mcpBaseAmount.value).toFixed(2), mcpBaseAmount.type = res.productType, mcpBaseAmount.dccDefault = {}, "" != $("#mcp_" + cardtype).html() && resetToBase();
            cardtype.replace("card", "");
            res.mcpConversionBeans.unshift({
                offerCurrency: mcpBaseAmount.currency,
                offerAmount: mcpBaseAmount.value,
                lookupId: ""
            });
            for (var mcpOptions = "", amtinfo = "", checked = "", dataArr = {}, i = 1; i < res.mcpConversionBeans.length; i++) dataArr[res.mcpConversionBeans[i].offerCurrency] = {
                amount: parseFloat(res.mcpConversionBeans[i].offerAmount).toFixed(2),
                currency: res.mcpConversionBeans[i].offerCurrency,
                exchangeRate: res.mcpConversionBeans[i].offerExchangeRate
            }, checked = res.mcpConversionBeans[i].offerCurrency == mcpBaseAmount.currency ? 'checked="true"' : "", "" == checked && $("#paypal_submit").attr("disabled", !0), amtinfo = res.mcpConversionBeans[i].offerCurrency + " " + res.mcpConversionBeans[i].offerAmount, i == res.mcpConversionBeans.length - 1 && (mcpBaseAmount.dccDefault = {
                value: res.mcpConversionBeans[i].offerAmount,
                currency: res.mcpConversionBeans[i].offerCurrency
            }), mcpOptions += '<li><input style="display:inline-block;padding:0;float:left; margin: 15px 0 0 0;" class="currency_radio mcp_other paypal-input" id="' + res.mcpConversionBeans[i].offerCurrency + '" ' + checked + '  type="radio" name="mcp_cc" value="' + res.mcpConversionBeans[i].lookupId + '"><div class="paypal-label-wrap" style="display:inline-block;padding-left:10px;"><label title="' + amtinfo + '" for="' + res.mcpConversionBeans[i].offerCurrency + '" class="paypal-amount-type">Amount</label><br><span style="font-size: 18px;color:#78726b;font-weight: normal;">' + amtinfo + "</span></div></li>";
            mcpOptions += "</div>", $("#mcp_" + cardtype).html(mcpOptions), $(".mcp_other").change(function() {
                if ($("#paypal_submit").attr("disabled", !1), $(this).is("select")) var selCurr = $(this).find("option:selected").text();
                else var selCurr = $(this).attr("id");
                if ("Other" == selCurr || "other_radio" == selCurr || selCurr == mcpBaseAmount.currency && "MCP" == res.productType) return void resetToBase();
                if ("MCP" == res.productType) var equivText = "Equivalent of " + getCurrCode(mcpBaseAmount.currency) + mcpBaseAmount.value;
                if ("DCC" == res.productType)
                    if (selCurr == mcpBaseAmount.currency) var equivText = "Equivalent of " + amtinfo;
                    else var equivText = "Equivalent of " + getCurrCode(mcpBaseAmount.currency) + mcpBaseAmount.value;
                $("#order-summary").find("#selectedCurrency").html(getCurrCode(selCurr)), $("#totalAmount").html(dataArr[selCurr].amount), $(".inr-equiv").css("display", "block").html(equivText), PayUCheckout.setMCPofCC($(this).val(), selCurr, dataArr[selCurr].amount, dataArr[selCurr].exchangeRate)
            }), $("#other_radio").change(function() {
                resetToBase(0), $("#mcp_other").attr("disabled", !1)
            }), $(".currency_radio").change(function() {
                resetOtherDdn()
            }), "DCC" == res.productType && $('input[name="mcp_cc"]:last').click()
        } else $("#mcp_" + cardtype).html(""), resetToBase(void 0, "initialValues")
    })
}

function getMCPofCC(cardtype, payuid, bin) {
    PayUCheckout.getMCPofCC(payuid, bin).success(function(res) {
        function showInfoTextOnTop(amtInfo) {
            var optionTextEnd, optionInfo = "For your convenience, we offer you the choice of paying in ";
            optionTextEnd = "DCC" == res.productType ? "<b>" + amtInfo + "</b>" : "one of the major currencies available.", notifyCurrency.show().html(optionInfo + optionTextEnd)
        }

        function getLabelToolTipText() {
            var str = '<label class="span-3" for="cc_mcp">Currency<a class="custom-tooltip"  href="javascript:void(0)">';
            return str += ' <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><path fill="#00ADF2" fill-rule="nonzero" d="M6.3 4.9h1.4V3.5H6.3v1.4zm.7 7.7A5.607 5.607 0 0 1 1.4 7c0-3.087 2.513-5.6 5.6-5.6 3.087 0 5.6 2.513 5.6 5.6 0 3.087-2.513 5.6-5.6 5.6zM7 0a7 7 0 1 0 0 14A7 7 0 0 0 7 0zm-.7 10.5h1.4V6.3H6.3v4.2z"/></svg>', str += '<div class="inner-container">' + PayUCheckout.getMCPinfo(null, !1) + "</div>", str += "</a></label>"
        }
        var mcpContainer = $("#mcp_" + cardtype);
        if (null != res && "0" == res.resultCode) {
            var cardInfo = cardtype.replace("card", ""),
                notifyCurrency = $("#" + cardInfo + " .notify-currency");
            mcpBaseAmount = res.baseAmount, mcpBaseAmount.value = parseFloat(mcpBaseAmount.value).toFixed(2), mcpBaseAmount.type = res.productType, mcpBaseAmount.dccDefault = {}, "" != mcpContainer.html() && resetToBase(), mcpOptions = getLabelToolTipText(), mcpOptions += '<div class="currency-block">';
            var amtinfo = "",
                checked = "",
                dataArr = {};
            if ("MCP" == res.productType) {
                var mcpCurrRes = jQuery.extend(!0, [], res.mcpConversionBeans);
                mcpCurrRes.unshift({
                    offerCurrency: mcpBaseAmount.currency,
                    offerAmount: mcpBaseAmount.value,
                    lookupId: ""
                });
                for (var len = mcpCurrRes.length < 3 ? mcpCurrRes.length : 3, i = 0; i < len; i++) dataArr[mcpCurrRes[i].offerCurrency] = {
                    amount: parseFloat(mcpCurrRes[i].offerAmount).toFixed(2),
                    currency: mcpCurrRes[i].offerCurrency,
                    exchangeRate: mcpCurrRes[i].offerExchangeRate
                }, checked = mcpCurrRes[i].offerCurrency == mcpBaseAmount.currency ? 'checked="true"' : "", amtinfo = currMap[mcpCurrRes[i].offerCurrency] + " " + mcpCurrRes[i].offerAmount, i == len - 1 && (mcpBaseAmount.dccDefault = {
                    value: mcpCurrRes[i].offerAmount,
                    currency: mcpCurrRes[i].offerCurrency
                }), mcpOptions += '<input class="currency_radio mcp_other" id="' + mcpCurrRes[i].offerCurrency + '" ' + checked + ' type="radio" name="mcp_cc" value="' + mcpCurrRes[i].lookupId + '"><label title="' + amtinfo + '" for="' + mcpCurrRes[i].offerCurrency + '">' + currMap[mcpCurrRes[i].offerCurrency] + " " + mcpCurrRes[i].offerCurrency + "</label>";
                var other = mcpCurrRes.splice(len);
                mcpOptions += '<input type="radio" value="" name="mcp_cc" id="other_radio"> &nbsp;', mcpOptions += '<select disabled title="Select Currency" name="mcp_cc" id="mcp_other" class="mcp_other">', mcpOptions += '<option  value="">Other</option>';
                for (var i = 0; i < other.length; i++) dataArr[other[i].offerCurrency] = {
                    amount: other[i].offerAmount,
                    currency: other[i].offerCurrency,
                    exchangeRate: other[i].offerExchangeRate
                }, mcpOptions += '<option  value="' + other[i].lookupId + '">' + other[i].offerCurrency + "</option>";
                mcpOptions += "</select>"
            } else {
                var dccCurrRes = res.mcpConversionBeans[0];
                amtinfo = currMap[dccCurrRes.offerCurrency] + " " + dccCurrRes.offerAmount, dataArr[dccCurrRes.offerCurrency] = {
                    amount: parseFloat(dccCurrRes.offerAmount).toFixed(2),
                    currency: dccCurrRes.offerCurrency,
                    exchangeRate: dccCurrRes.offerExchangeRate
                };
                var checkboxDisplay = "1" == dccHardRestrict ? "visibility:hidden;margin-right:-15px" : "visibility:initial;margin-right:0;";
                mcpOptions += '<input style="' + checkboxDisplay + '" class="currency_radio mcp_other dccCheckbox" type="checkbox" name="mcp_cc" id="' + dccCurrRes.offerCurrency + '" value="' + dccCurrRes.lookupId + '">', mcpOptions += '<label title="' + amtinfo + '" for="' + dccCurrRes.offerCurrency + '"><b>' + currMap[dccCurrRes.offerCurrency] + " " + dccCurrRes.offerCurrency + "</b></label>"
            }
            mcpOptions += "</div>", mcpContainer.html(mcpOptions), showInfoTextOnTop(amtinfo), $(".mcp_other").change(function() {
                if ($(this).is("select")) var selCurr = $(this).find("option:selected").text();
                else var selCurr = $(this).attr("id");
                if ("Other" == selCurr || "other_radio" == selCurr || selCurr == mcpBaseAmount.currency && "MCP" == res.productType) return void resetToBase();
                if ("MCP" == res.productType) var equivText = "Equivalent of " + getCurrCode(mcpBaseAmount.currency) + mcpBaseAmount.value;
                if ("DCC" == res.productType)
                    if (selCurr == mcpBaseAmount.currency) var equivText = "Equivalent of " + amtinfo;
                    else var equivText = "Equivalent of " + getCurrCode(mcpBaseAmount.currency) + mcpBaseAmount.value;
                $("#order-summary").find("#selectedCurrency").html(getCurrCode(selCurr)), $("#totalAmount").html(dataArr[selCurr].amount), $(".inr-equiv").css("display", "block").html(equivText), PayUCheckout.setMCPofCC($(this).val(), selCurr, dataArr[selCurr].amount, dataArr[selCurr].exchangeRate)
            }), $(".creditcard, debitcard").on("keyup", function() {
                "" == this.value && ($("#mcp_" + cardtype).html(""), resetToBase(void 0, "initialValues"))
            }), $(".currency-block #other_radio").change(function() {
                resetToBase(0), $("#mcp_other").attr("disabled", !1)
            }), $(".currency-block .currency_radio").change(function() {
                resetOtherDdn()
            }), $(".creditcard, #cname_on_card, #cexpiry_date_month, #cexpiry_date_year, .debitcard, #dname_on_card, #dexpiry_date_month, #dexpiry_date_year, .validccvv").change(function() {
                payButtonClicked = !1
            }), $(".currency-block .dccCheckbox").change(function() {
                "hidden" != $(this).css("visibility") && ($(this).prop("checked") !== !0 ? resetToBase(void 0, "initialValues") : "none" == notifyCurrency.css("display") && notifyCurrency.show())
            }), "DCC" == res.productType && $('input[name="mcp_cc"]:last').click()
        } else 5 == res.resultCode && res.baseAmount && (mcpBaseAmount = res.baseAmount), mcpContainer.html(""), resetToBase(void 0, "initialValues")
    })
}

function resetToBase(preventSelectRadio, initialValues) {
    if (void 0 != mcpBaseAmount && Object.keys(mcpBaseAmount).length > 0) {
        if ("DCC" == mcpBaseAmount.type && void 0 == initialValues) {
            var dccOptionInput = $('input[name="mcp_cc"]:last');
            dccOptionInput.length > 1 && (dccOptionInput.click(), setTimeout(function() {
                mcpBaseAmount.dccDefault && mcpBaseAmount.dccDefault.value && $("#totalAmount").html(parseFloat(mcpBaseAmount.dccDefault.value).toFixed(2))
            }, 0))
        } else $("#selectedCurrency").html(getCurrCode(mcpBaseAmount.currency)), mcpBaseAmount.value && $("#totalAmount").html(parseFloat(mcpBaseAmount.value).toFixed(2)), $(".inr-equiv").hide().html(""), $(".currency_radio").removeAttr("checked"), void 0 == preventSelectRadio && $("#" + mcpBaseAmount.currency).attr("checked", !0), void 0 != initialValues && $(".notify-currency").hide(), resetOtherDdn();
        PayUCheckout.setMCPofCC()
    }
}

function resetOtherDdn() {
    $("#mcp_other").attr("disabled", !0), $("#mcp_other").val("")
}

function getCurrCode(curr) {
    return "INR" == curr ? res = "Rs. " : "AUD" == curr ? res = "AUD " : "HKD" == curr ? res = "HKD " : "SGD" == curr ? res = "HKD " : "NZD" == curr ? res = "NZD " : res = currMap[curr] + " ", res
}

function resetTotalAmount(amt) {
    $("#totalAmount").html(amt)
}

function citiRewardHandling(ccnum) {
    postData = {
        catalogue: citiRewardsCatalogue,
        bin: ccnum
    }, request = jQuery.ajax({
        type: "POST",
        url: "ValidateCitiRewardsBin.php",
        data: postData,
        dataType: "json",
        timeout: 6e4
    }), request.done(function(result) {
        document.getElementById("pg_down_div");
        0 == result.status ? ($("#rcard_number").val(""), $("#citi_reward_error").html('<div class="pg_down_div"  style="display: block;" id="netbanking_error_div"> <div class="nb_m" > Looks like you have selected the wrong card. Please check once again and select the card type that you have</div></div>')) : $("#citi_reward_error").html("")
    })
}
var PricingAPI = function(t) {
        "use strict";
        var n = [3, 6, 12, 24],
            a = {
                CalculateMultipleInstallmentPlans: function(t, a, l, r) {
                    var u = t * (1 + l * (1 + r));
                    return n.map(function(t) {
                        var n = function(t, n, a) {
                            if (0 === t) return a / n;
                            var l = Math.pow(1 + t, n);
                            return a * t * l / (l - 1)
                        }(a, t, u);
                        return {
                            Duration: t,
                            AverageInstallmentAmount: Math.round(n),
                            TotalCost: Math.round(n * t)
                        }
                    })
                }
            },
            l = a.CalculateMultipleInstallmentPlans;
        return t["default"] = a, t.CalculateMultipleInstallmentPlans = l, t
    }({}),
    paymentLazyPay = function() {
        function checkIfRegsiteredLazyPay() {
            hide_error(), hide_success(), window.validator.prepareForm();
            var valid = window.validator.checkForm();
            if (!valid) return void window.validator.showErrors();
            showLoading("check-if-registered");
            var mihpayid = $("#mihpayid").val(),
                email = $("#lazypay_email").val(),
                phone = $("#lazypay_mobile").val();
            jQuery.ajax({
                type: "POST",
                url: "LazyPayApi.php",
                data: {
                    email: email,
                    mobile: phone,
                    mihpayid: mihpayid
                },
                dataType: "json"
            }).then(function(data) {
                hideLoading("check-if-registered");
                var dataObject = data;
                1 == data.status ? ($("#lazypay_type").val(dataObject.type), "OTP" == dataObject.type ? ($("#lazypay-details").addClass("hidden"), $("#lazypay-otp").removeClass("hidden"), $("#otp-message").html("An OTP has been sent on " + $("#lazypay_mobile").val())) : (1 == data.status ? $("#lazypay_status").val(statusObject[data.status]) : $("#lazypay_status").val(statusObject[0]), form_params(), $("#paymentForm").submit())) : (show_error(data.message), void 0 != data.url && setTimeout(function() {
                    window.location.href = data.url
                }, 5e3))
            }).fail(function(data) {
                throw hideLoading("check-if-registered"), show_error(), new PayUException("Some error occured")
            })
        }

        function _form_submit() {
            form_params(), $("#paymentForm").submit()
        }

        function checkOTP() {
            hide_error(), hide_success();
            var mihpayid = $("#mihpayid").val();
            window.validator.prepareForm();
            var valid = window.validator.checkForm();
            return valid ? (showLoading("check-otp"), void jQuery.ajax({
                type: "POST",
                url: "LazyPayApi.php",
                data: {
                    lazypay_otp: $("#lazypay_otp").val(),
                    txnid: mihpayid
                },
                dataType: "json"
            }).done(function(data) {
                hideLoading("check-otp"), 1 == data.status ? ($("#lazypay_status").val(statusObject[data.status]), _form_submit()) : (data.message ? show_error(data.message) : show_error(), null == data.attempts && ($("#lazypay_status").val(statusObject[0]), _form_submit()))
            }).fail(function(data) {
                throw hideLoading("check-otp"), show_error(), new PayUException("Some error occured")
            })) : void window.validator.showErrors()
        }

        function resendOTP() {
            hide_error(), hide_success();
            var mihpayid = $("#mihpayid").val();
            $("#lazypay_otp").val(""), jQuery.ajax({
                type: "POST",
                url: "LazyPayApi.php",
                data: {
                    resendotp: 1,
                    txnid: mihpayid
                },
                dataType: "json"
            }).done(function(data) {
                1 == data.status && data.attempts ? show_success(data.message) : show_error(data.message)
            }).fail(function(data) {
                throw show_error(), new PayUException("Some error occured")
            })
        }

        function show_error(message) {
            message ? ($("#error_container").html(message), $("#error_container").removeClass("hidden")) : ($("#error_container").html(error_msg_default), $("#error_container").removeClass("hidden"))
        }

        function hide_error() {
            $("#error_container").html("").addClass("hidden")
        }

        function show_success(message) {
            message ? ($("#success_container").html(message), $("#success_container").removeClass("hidden")) : ($("#success_container").html(success_msg_default), $("#success_container").removeClass("hidden"))
        }

        function hide_success() {
            $("#success_container").html("").addClass("hidden")
        }

        function showLoading(id, message) {
            message ? $("#" + id).html(message) : $("#" + id).html(loading_text)
        }

        function hideLoading(id, message) {
            message ? $("#" + id).html(message) : $("#" + id).html(default_button_text)
        }
        var error_msg_default = "Some error occured",
            success_msg_default = "Some error occured",
            default_button_text = "Proceed",
            loading_text = "Please Wait ...",
            statusObject = {
                0: "FAIL",
                1: "SUCCESS"
            };
        return {
            resendOTP: resendOTP,
            checkIfRegsiteredLazyPay: checkIfRegsiteredLazyPay,
            checkOTP: checkOTP,
            hide_error: hide_error,
            show_error: show_error,
            show_success: show_success,
            hide_success: hide_success,
            showLoading: showLoading,
            hideLoading: hideLoading
        }
    }(),
    ibibo_code, showform, PayUCheckout = PayU,
    currMap = PayUCheckout.getCurrMap(),
    cardToken, nStoreCard, mode = "",
    nIsOffer, strCardName = "cname_on_card",
    strCardNum = "ccard_number",
    threeDWindow, store_cards = !1,
    CC_deactivated = 0,
    submit_done_flag = 0,
    ongoing_down_request = 0,
    beforeUnloadFlag = 0,
    ib_downtime_show = 0,
    dH = $("#TriggerBlock").height(),
    appliedAdditionalCharge = PayU.getAppliedAdditionalCharge(),
    ibiboCodesDetails = PayU.getIbiboCodes(),
    additionalChargeBinCategoryWise = PayU.getAdditionalChargeBinsCategoryWise(),
    defaultCCIbiboCode = "CC",
    showLoader = !0,
    tempCreditCardStoreSi = null,
    tempDebitCardStoreSi = null,
    payButtonClicked = !1,
    allVpaValues = {},
    mcpBaseAmount, enteredCard, bank_code, ifVpaField = $("#vpa").length > 0,
    parentCat, flagReset = !1;
! function(w) {
    function updateKreditectEmi(amount, interest, fee, gst) {
        var pricingData = PricingAPI.CalculateMultipleInstallmentPlans(amount, interest, fee, gst);
        if (pricingData && 0 != pricingData.length) {
            var tstr = "<tbody>";
            tstr += "<tr>", tstr += "<th>Duration</th>", tstr += "<th>EMI</th>", tstr += "<th>Annual interest</th>", tstr += "<th>Total Cost</th>", tstr += "</tr>";
            for (var i = 0; i < pricingData.length; i++) tstr += i == pricingData.length - 1 ? '<tr class="last">' : "<tr>", tstr += "<td>" + pricingData[i].Duration + " months</td>", tstr += '<td> <span class="WebRupee">Rs.</span>' + pricingData[i].AverageInstallmentAmount + "/month</td>", tstr += "<td>" + 12 * interest * 100 + "% </td>", tstr += '<td> <span class="WebRupee">Rs.</span>' + pricingData[i].TotalCost + "</td>", tstr += "</tr>";
            tstr += "</tbody>", $("#pricing_table").html(tstr)
        }
    }
    w.updateKreditectEmi = updateKreditectEmi
}(window), $(document).ready(function() {
    window.parentCat = $("#TriggerBlock li").data("cat"), $("#TriggerBlock a").click(function() {
        window.parentCat = $(this).parent("li").data("cat")
    }), $("#paymentForm input[name='ccard-type']").click(function(e) {
        flagReset = !0, $("#paymentForm")[0].reset(), $(this).attr("checked", !0), tempCreditCardStoreSi = null, tempDebitCardStoreSi = null
    })
}), $(main), Array.prototype.indexOf || (Array.prototype.indexOf = function(searchElement) {
    "use strict";
    if (null == this) throw new TypeError;
    var t = Object(this),
        len = t.length >>> 0;
    if (0 === len) return -1;
    var n = 0;
    if (arguments.length > 0 && (n = Number(arguments[1]), n != n ? n = 0 : 0 != n && n != 1 / 0 && n != -(1 / 0) && (n = (n > 0 || -1) * Math.floor(Math.abs(n)))), n >= len) return -1;
    for (var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++)
        if (k in t && t[k] === searchElement) return k;
    return -1
});
var handleStandingInstruction = function(messageContainerId) {
        var getSiConfiguration = function(flag) {
                var defaultConf = {
                        warning: !1,
                        disable: !1
                    },
                    siFlagsConf = {
                        0: {
                            warning: !0,
                            disable: !0
                        },
                        1: {
                            warning: !0,
                            disable: !0
                        },
                        2: {
                            warning: !0,
                            disable: !1
                        }
                    },
                    flag = siFlagsConf[flag];
                return flag || (flag = defaultConf), flag
            },
            messagesHandler = function(messageContainerId) {
                var siPayNowAndMessageControlFlag = PayU.getSiPayNowAndMessageControlFlag(),
                    messageRef = $("#" + messageContainerId),
                    config = getSiConfiguration(siPayNowAndMessageControlFlag),
                    show = function() {
                        messageRef.length && (config.warning && messageRef.show(), config.disable && payNowButtonHandler.disable())
                    },
                    hide = function() {
                        messageRef.length && messageRef.hide(), payNowButtonHandler.enable()
                    };
                return {
                    show: show,
                    hide: hide
                }
            },
            payNowButtonHandler = function() {
                var debitCardSubmitButton = $(".credit_pay_button"),
                    creditCardSubmitButton = $(".debit_pay_button"),
                    disable = function() {
                        debitCardSubmitButton.addClass("disabled").removeClass("active"), creditCardSubmitButton.addClass("disabled").removeClass("active"), debitCardSubmitButton.prop("disabled", !0), creditCardSubmitButton.prop("disabled", !0)
                    },
                    enable = function() {
                        debitCardSubmitButton.prop("disabled", !1), creditCardSubmitButton.prop("disabled", !1)
                    };
                return {
                    disable: disable,
                    enable: enable
                }
            }(),
            doAjax = function(card_bin) {
                payNowButtonHandler.enable(), PayU.checkIfBankAllowedForDCSI(card_bin).success(function(data) {
                    var status = parseInt(data.status, 10);
                    0 === status ? messagesHandler("debit_card_si_error_div").show() : messagesHandler("credit_card_si_error_div").hide()
                })
            };
        return {
            doAjax: doAjax,
            messagesHandler: messagesHandler,
            payNowButtonHandler: payNowButtonHandler
        }
    },
    codform;
jQuery(document).ready(function() {
    function handleAutocompleteCB() {
        var acOutput = jQuery(".autocompleteOutput");
        "none" == acOutput.css("display") ? jQuery("#vpa").on("keyup", function(e) {
            10 == e.which | 13 == e.which && (form_params(), $("#paymentForm").submit())
        }) : (acOutput.hide(), setTimeout(function() {
            $("#vpa").trigger("blur").focus()
        }, 0))
    }
    if (ifVpaField) {
        var aC = PayUCheckout.autoComplete({
            inputId: "vpa",
            data: PayUCheckout.getUPIhandles(),
            callback: handleAutocompleteCB,
            visibleItems: 7
        });
        aC !== !1 && aC.init()
    }
}), window.setTimeout(function() {
    jQuery("#ccard_number").payment("formatCardNumber"), jQuery("#dcard_number").payment("formatCardNumber"), jQuery("#rcard_number").payment("formatCardNumber"), jQuery("#chcard_number").payment("formatCardNumber"), jQuery("#ecard_number").payment("formatCardNumber"), jQuery("#enocost_card_number").payment("formatCardNumber"), jQuery("#ccvv_number").payment("restrictNumeric"), jQuery("#dcvv_number").payment("restrictNumeric"), jQuery("#ecvv_number").payment("restrictNumeric"), jQuery("#enocost_cvv_number").payment("restrictNumeric"), jQuery("#rcvv_number").payment("restrictNumeric"), jQuery("#chcvv_number").payment("restrictNumeric"), jQuery("#ephone_cust").payment("restrictNumeric"), jQuery("#enocost_phone_cust").payment("restrictNumeric")
}, 100), jQuery("#dcard_number").on("keyup change", function() {
    var dcard_number = $("#dcard_number").val();
    dcard_number = dcard_number.replace(/[ \-]/g, "");
    var dcard_type = $("#debit_card_select").val();
    ("debitcard_MAES_1" == dcard_type || "debitcard_SMAE_1" == dcard_type) && dcard_number.length >= 2 && (dcard_number.match(/^(4|5[1-5])[0-9]*/) ? ($("#dcvv_number").addClass("required"), window.maestroCard.disableFormControls()) : dcard_number.match(/^(50)[0-9]*/) ? ($("#dcvv_number").removeClass("required").prop("disabled", !0), window.maestroCard.enableFormControls(ibibo_code)) : ($("#dcvv_number").removeClass("required").prop("disabled", !1), window.maestroCard.enableFormControls(ibibo_code, !0)))
}), $("#bankEmiList").change(function() {
    var pgId = this.value;
    "" != pgId ? ($(".emiClassDefault").hide(), $(".emiClass").hide(), $("#emi_duration_div_" + pgId).show(), $(".emiOptionsList").val("-1")) : ($(".emiClassDefault").show(), $(".emiClass").hide())
});
var maestroCard = {
    codes: ["MAES", "SMAE"],
    toggleCvvExp: function(enable) {
        1 == $("#dcvv_number").is(":disabled") || "undefined" != typeof enable && 1 == enable ? (jQuery("div.cvvExpLabel input, div.cvvExpLabel select").prop("disabled", !1), jQuery(".cvvExpLabel").show(), $("#dcvv_number").addClass("required"), $("label[for='dexpiry_date_month']").remove(".error"), $(".cvvExp").css("color", "#444444")) : (jQuery("div.cvvExpLabel input, div.cvvExpLabel select").attr("disabled", "disabled"), jQuery(".cvvExpLabel").attr({
            style: "display:none;"
        }), $("#dcvv_number").removeClass("required"), $("label[for='dcvv_number']").remove(".error"), $("label[for='dexpiry_date_month']").remove(".error"), $(".cvvExp").css("color", "#C0C0C0"))
    },
    showControl: function() {
        1 == $("#dcvv_number").is(":disabled") ? "SMAE" == ibibo_code ? ($("#disableCvvExpDiv").hide(), $("#enableCvvExpDiv").hide(), $("#disableCvvExpDivSBI").hide(), $("#enableCvvExpDivSBI").show()) : ($("#disableCvvExpDiv").hide(), $("#enableCvvExpDiv").show(), $("#disableCvvExpDivSBI").hide(), $("#enableCvvExpDivSBI").hide()) : "SMAE" == ibibo_code ? ($("#enableCvvExpDiv").hide(), $("#disableCvvExpDiv").hide(), $("#enableCvvExpDivSBI").hide(), $("#disableCvvExpDivSBI").show()) : ($("#enableCvvExpDiv").hide(), $("#disableCvvExpDiv").show(), $("#enableCvvExpDivSBI").hide(), $("#disableCvvExpDivSBI").hide())
    },
    enableFormControls: function(ibibo_code, card_no_check) {
        "SMAE" == ibibo_code || "undefined" != typeof card_no_check ? this.toggleCvvExp(!1) : this.toggleCvvExp(!0), this.showControl(ibibo_code)
    },
    disableFormControls: function() {
        this.toggleCvvExp(!0), $("#disableCvvExpDiv").hide(), $("#enableCvvExpDiv").hide(), $("#disableCvvExpDivSBI").hide(), $("#enableCvvExpDivSBI").hide();
    }
};
jQuery(function() {
        jQuery("div.enableDisableCvvExp.row").click(function() {
            maestroCard.toggleCvvExp(), maestroCard.showControl()
        })
    }), jQuery(function() {
        var UserCards = PayU.getUserCards(),
            userHasCards = !1;
        for (userCard in UserCards)
            if (UserCards.hasOwnProperty(userCard)) {
                userHasCards = !0;
                break
            }
        if (store_cards = userHasCards, userHasCards) {
            var source = jQuery("#cardList").html(),
                template = Handlebars.compile(source);
            for (var card_token in UserCards) {
                var html = template(UserCards[card_token]);
                switch (UserCards[card_token].card_mode) {
                    case "CC":
                        jQuery("#drop_list_1 ul").prepend(html);
                        break;
                    case "DC":
                        jQuery("#drop_list_2 ul").prepend(html);
                        break;
                    case "RD":
                        jQuery("#drop_list_3 ul").prepend(html);
                        break;
                    case "IVR":
                        jQuery("#drop_list_1 ul").prepend(html);
                        break;
                    case "IVRDC":
                        jQuery("#drop_list_2 ul").prepend(html)
                }
            }
            jQuery("p.card-options").hide(), jQuery("div.user-card-options").removeClass("hidden"), $.each($(".payment_card_type"), function() {
                    var temp = $(this).attr("rel");
                    temp && temp.length > 1 && UserCards[temp] && $(this).attr("card_type", UserCards[temp].card_type)
                }),
                function() {
                    function dropDown(targetEl, resultsEl, actionButton, callbackFunction) {
                        if (objTarget = document.getElementById(targetEl), hideDropDown(targetEl), assignButtonClick(objTarget, actionButton), assignChildNodeClick(objTarget, targetEl, resultsEl, callbackFunction), !document.getElementById("openDropDown")) {
                            var hiddenElement = document.createElement("input");
                            hiddenElement.setAttribute("type", "hidden"), hiddenElement.setAttribute("id", "openDropDown"), document.body.appendChild(hiddenElement)
                        }
                    }

                    function hideDropDown(target) {
                        objEL = document.getElementById(target), objEL ? "block" != objEL.style.display && objEL.style.display || (objEL.style.display = "none") : alert("There is some problem with drop down with id : " + target)
                    }

                    function assignButtonClick(target, actionButtonID) {
                        actionButton = document.getElementById(actionButtonID), actionButton.onclick = function() {
                            currentOpenDD = document.getElementById("openDropDown").value, "" != currentOpenDD && currentOpenDD == target.id + ";;" + actionButtonID ? document.getElementById("openDropDown").value = "" : "" != currentOpenDD ? (values = currentOpenDD.split(";;"), hideDropDown(values[0]), document.getElementById("openDropDown").value = target.id + ";;" + actionButtonID) : document.getElementById("openDropDown").value = target.id + ";;" + actionButtonID, "block" != target.style.display && target.style.display ? target.style.display = "block" : target.style.display = "none"
                        }
                    }

                    function assignChildNodeClick(target, targetEl, resultsEl, callback) {
                        for (arrListElements = target.getElementsByTagName("LI"), i = 0; i < arrListElements.length; i++)
                            for (arrAnchorChild = arrListElements[i].getElementsByTagName("A"), j = 0; j < arrAnchorChild.length; j++) currentNode = arrAnchorChild[j], currentNode.onclick = function() {
                                callback ? callback.call(this, this, targetEl, resultsEl) : processClick(this, targetEl, resultsEl)
                            }
                    }

                    function processClick(objAnchor, targetEl, resultsEl) {
                        document.getElementById(targetEl).style.display = "none", document.getElementById(resultsEl).innerHTML = trim(objAnchor.innerHTML);
                        var selected_value = trim(objAnchor.rel);
                        arr = selected_value.split("_")
                    }

                    function captureClick(e) {
                        window.event ? target = window.event.srcElement : target = e.target ? e.target : e.srcElement, document.getElementById("openDropDown") && "" != document.getElementById("openDropDown").value && (arrValues = document.getElementById("openDropDown").value.split(";;"), checkParent(target, arrValues[0]) || target.id != arrValues[1] && (hideDropDown(arrValues[0]), document.getElementById("openDropDown").value = ""))
                    }

                    function loadEvents() {
                        null != document.getElementById("drop_list_1") && (dropDown("drop_list_1", "drop_box_1", "drop_image_1", cardSelector), jQuery("ul > li:first > a", "#drop_list_1").trigger("click")), null != document.getElementById("drop_list_2") && dropDown("drop_list_2", "drop_box_2", "drop_image_2", cardSelector2), null != document.getElementById("drop_list_3") && dropDown("drop_list_3", "drop_box_3", "drop_image_3", cardSelectorRewards), jQuery("#payment-tabs").bind("tabsshow", function(event, ui) {
                            switch (jQuery(ui.panel).attr("id")) {
                                case "debit":
                                    jQuery("ul > li:first > a", "#drop_list_2").trigger("click");
                                    break;
                                case "credit":
                                    jQuery("ul > li:first > a", "#drop_list_1").trigger("click");
                                    break;
                                case "rewards":
                                    jQuery("ul > li:first > a", "#drop_list_3").trigger("click")
                            }
                        })
                    }

                    function checkParent(objEl, parentID) {
                        return null != objEl.parentNode && (objEl.parentNode.id == parentID || "BODY" != objEl.parentNode.nodeName && checkParent(objEl.parentNode, parentID))
                    }

                    function trim(str, charlist) {
                        var whitespace, l = 0,
                            i = 0;
                        for (str += "", charlist ? (charlist += "", whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "$1")) : whitespace = " \n\r\t\f\x0B            ​\u2028\u2029　", l = str.length, i = 0; i < l; i++)
                            if (whitespace.indexOf(str.charAt(i)) === -1) {
                                str = str.substring(i);
                                break
                            }
                        for (l = str.length, i = l - 1; i >= 0; i--)
                            if (whitespace.indexOf(str.charAt(i)) === -1) {
                                str = str.substring(0, i + 1);
                                break
                            }
                        return whitespace.indexOf(str.charAt(0)) === -1 ? str : ""
                    }

                    function cardSelector(objAnchor, targetEl, resultsEl) {
                        validator && (validator.prepareForm(), validator.hideErrors());
                        var payuCards = PayU.getUserCards();
                        if (jQuery(objAnchor).hasClass("cardPayment")) {
                            jQuery("#card-radios input:radio").prop("checked", !1);
                            var cardDetails = payuCards[trim(objAnchor.rel)];
                            "IVR" == cardDetails.card_type ? window.ibibo_code = "CC" : window.ibibo_code = cardDetails.card_type, jQuery("#ccard_number").payment("reset"), jQuery("#cname_on_card").val(cardDetails.name_on_card).attr("disabled", "disabled"), jQuery("#ccard_number").val(cardDetails.card_no).attr("disabled", "disabled"), window.setTimeout(function() {
                                jQuery("#ccard_number").val(cardDetails.card_no).attr("disabled", "disabled")
                            }), jQuery("#cexpiry_date_month, #cexpiry_date_year").attr("disabled", "disabled").addClass("hidden"), jQuery("span.hide-ccExpiry").removeClass("hidden"), jQuery("#ccvv_number").val("").removeAttr("disabled"), jQuery(".cc-form.credit-card-form").hide(), window.cardToken = trim(objAnchor.rel), PayU.init("creditcard", window.ibibo_code), setCvvLength(window.ibibo_code), jQuery("#storeCardLink").parent().addClass("hidden"), jQuery("#manageCardLink").parent().removeClass("hidden"), showIbDown(!0), additionalChargeBinCategoryWise !== !1 && getAdditonalChargeBinsWise(!0), showCreditCardAllowedOnly(!0)
                        } else jQuery("#cname_on_card, #ccard_number").val("").removeAttr("disabled"), jQuery("#ccvv_number").val(""), jQuery("#ccard_number").payment("formatCardNumber"), jQuery("#cexpiry_date_month, #cexpiry_date_year").removeAttr("disabled").removeClass("hidden"), jQuery("span.hide-ccExpiry").addClass("hidden"), jQuery(".cc-form.credit-card-form").show(), window.cardToken = void 0, window.ibibo_code = void 0, jQuery("#storeCardLink").parent().removeClass("hidden"), jQuery("#manageCardLink").parent().addClass("hidden");
                        tempDebitCardStoreSi = null, tempCreditCardStoreSi = null, jQuery("input[value=" + trim(objAnchor.rel) + "]", "#card-radios").trigger("click"), document.getElementById(targetEl).style.display = "none", document.getElementById(resultsEl).innerHTML = trim(objAnchor.innerHTML)
                    }

                    function cardSelector2(objAnchor, targetEl, resultsEl) {
                        validator && (validator.prepareForm(), validator.hideErrors());
                        var payuCards = PayU.getUserCards();
                        if (jQuery(objAnchor).hasClass("cardPayment")) {
                            dcFormToggle(1), tempDebitCardStoreSi = null, tempCreditCardStoreSi = null, showAllowedDebitCardForSI();
                            var cardDetails = payuCards[trim(objAnchor.rel)];
                            jQuery("#dname_on_card").val(cardDetails.name_on_card).attr("disabled", "disabled"), jQuery("#dcard_number").payment("reset"), jQuery("#dcard_number").val(cardDetails.card_no).attr("disabled", "disabled"), window.setTimeout(function() {
                                jQuery("#dcard_number").val(cardDetails.card_no).attr("disabled", "disabled")
                            }), jQuery("#dexpiry_date_month, #dexpiry_date_year").attr("disabled", "disabled").addClass("hidden"), jQuery("span.hide-dcExpiry").removeClass("hidden"), jQuery("#dcvv_number").val("").removeAttr("disabled"), jQuery("#dcSaveCardDetails").addClass("hidden"), window.cardToken = trim(objAnchor.rel), "IVR" == cardDetails.card_type ? window.ibibo_code = "VISA" : window.ibibo_code = cardDetails.card_type, window.maestroCard.codes.indexOf(window.ibibo_code) != -1 ? window.maestroCard.enableFormControls() : window.maestroCard.disableFormControls(), PayU.init("debitcard", window.ibibo_code), jQuery("#storeDebitCardLink").parent().addClass("hidden"), jQuery("#manageDebitCardLink").parent().removeClass("hidden"), showIbDown(!0), additionalChargeBinCategoryWise !== !1 && getAdditonalChargeBinsWise(!0), showDebitCardAllowedOnly(!0)
                        } else jQuery("#dname_on_card, #dcard_number").val("").removeAttr("disabled"), jQuery("#dcvv_number").val(""), jQuery("#dcard_number").payment("formatCardNumber"), window.ibibo_code = void 0, jQuery("#debit_card_select").val(objAnchor.rel).trigger("change"), jQuery("#dexpiry_date_month, #dexpiry_date_year").removeAttr("disabled").removeClass("hidden"), jQuery("span.hide-dcExpiry").addClass("hidden"), window.cardToken = void 0, jQuery("#storeDebitCardLink").parent().removeClass("hidden"), jQuery("#manageDebitCardLink").parent().addClass("hidden");
                        jQuery("input[value=" + trim(objAnchor.rel) + "]", "#card-radios").trigger("click"), document.getElementById(targetEl).style.display = "none", document.getElementById(resultsEl).innerHTML = trim(objAnchor.innerHTML)
                    }

                    function cardSelectorRewards(objAnchor, targetEl, resultsEl) {
                        validator && (validator.prepareForm(), validator.hideErrors());
                        var payuCards = PayU.getUserCards();
                        if (jQuery(objAnchor).hasClass("cardPayment")) {
                            rcFormToggle(1);
                            var cardDetails = payuCards[trim(objAnchor.rel)];
                            jQuery("#rname_on_card").val(cardDetails.name_on_card).attr("disabled", "disabled"), jQuery("#rcard_number").payment("reset"), jQuery("#rcard_number").val(cardDetails.card_name).attr("disabled", "disabled"), window.setTimeout(function() {
                                jQuery("#rcard_number").val(cardDetails.card_name).attr("disabled", "disabled")
                            }), jQuery("#rexpiry_date_month, #rexpiry_date_year").attr("disabled", "disabled").addClass("hidden"), jQuery("span.hide-rcExpiry").removeClass("hidden"), jQuery("#rcvv_number").val("").removeAttr("disabled"), jQuery("#rcSaveCardDetails").addClass("hidden"), window.cardToken = trim(objAnchor.rel), window.ibibo_code = cardDetails.card_type, PayU.init("rewards", window.ibibo_code), jQuery("fieldset.rc-form").show("slow"), jQuery(".rc-form.debit-card-form").hide(), jQuery("#storeRewardCardLink").parent().addClass("hidden"), jQuery("#manageRewardCardLink").parent().removeClass("hidden")
                        } else jQuery("#rname_on_card, #rcard_number").val("").removeAttr("disabled"), jQuery("#rcvv_number").val(""), jQuery("#rcard_number").payment("formatCardNumber"), window.ibibo_code = void 0, jQuery("#rewards_card_select").val(objAnchor.rel).trigger("change"), jQuery("#rexpiry_date_month, #rexpiry_date_year").removeAttr("disabled").removeClass("hidden"), jQuery("span.hide-rcExpiry").addClass("hidden"), window.cardToken = void 0, jQuery(".rc-form.debit-card-form").show(), jQuery("#storeRewardCardLink").parent().removeClass("hidden"), jQuery("#manageRewardCardLink").parent().addClass("hidden");
                        jQuery("input[value=" + trim(objAnchor.rel) + "]", "#card-radios").trigger("click"), document.getElementById(targetEl).style.display = "none", document.getElementById(resultsEl).innerHTML = trim(objAnchor.innerHTML)
                    }

                    function setCvvLength(ibibo_code) {
                        "AMEX" == ibibo_code ? $("input[name=ccvv_number]").attr("maxlength", 4) : $("input[name=ccvv_number]").attr("maxlength", 3)
                    }
                    window.document.addEventListener ? window.document.addEventListener("click", captureClick, !1) : window.document.attachEvent && window.document.attachEvent("onclick", captureClick), jQuery(document).ready(loadEvents)
                }()
        }
        $(".payment_card_type").on("click", function(evt) {
            var card_type = $(this).attr("card_type").toLowerCase();
            switch (card_type) {
                case "amex":
                    var img_src = baseImagePath + "cvv_new/cvv_amex_new.png?v=1.1",
                        cvvText = "A 4-digit number on the front, just above your credit card number";
                    break;
                default:
                    var img_src = baseImagePath + "cvv_new/cvv_visa_master_new.png?v=1.1",
                        cvvText = "A 3-digit number in reverse italics on the back of your card"
            }
            ibibo_code = $(this).attr("card_type"), setSurchargeMsg(parentCat, ibibo_code), setTimeout(function() {
                $("#ccvv_help_img").attr("src", img_src), $("#CVVHelpText").text(cvvText), addAdditionalCharges(!0)
            }, 200)
        })
    }), window.document.addEventListener ? window.addEventListener("beforeunload", function(e) {
        if (beforeUnloadFlag++, checkIfPopupExists(threeDWindow) && "yes" != window.self_closed && 1 == beforeUnloadFlag) {
            var confirmationMessage = "If you leave this page, your current transaction will be aborted.";
            return (e || window.event).returnValue = confirmationMessage, confirmationMessage
        }
    }) : window.document.attachEvent && window.document.attachEvent("beforeunload", function(e) {
        if (beforeUnloadFlag++, checkIfPopupExists(threeDWindow) && "yes" != window.self_closed && 1 == beforeUnloadFlag) {
            var confirmationMessage = "If you leave this page, your current transaction will be aborted.";
            return (e || window.event).returnValue = confirmationMessage, confirmationMessage
        }
    }), $(".overlay_img").mouseover(function(event) {
        $("div.user-card-options").hasClass("hidden") || $(this).hasClass("visa_img") && ($("#ccvv_help_img").attr("src", baseImagePath + "cvv_new/cvv_visa_master_new.png?v=1.1"), $("#CVVHelpText").text("A 3-digit number in reverse italics on the back of your card")), ShowCvvImage($(this), event)
    }), $(".overlay_img").mouseout(function(event) {
        HideDiv()
    }), $(".eye").click(function() {
        var textElem = $(this).parent(".row.relative").find(".text");
        "text" == textElem.prop("type") ? (textElem.prop("type", "password"), $(this).css("background-color", "#666666")) : (textElem.prop("type", "text"), $(this).css("background-color", "#02acf5"))
    }),
    function(w, $) {
        function evaluateFinalRule(finalRule) {
            var msg = "";
            return finalRule && finalRule.flatFee && finalRule.flatFee > 0 ? msg = "Convenience Fee of Rs. " + parseFloat(finalRule.flatFee).toFixed(2) + " will be charged on transaction amount plus applicable taxes will apply" : finalRule && finalRule.percentFee && finalRule.percentFee > 0 && (msg = finalRule.displayType && 1 == finalRule.displayType ? "Convenience Fee of Rs. " + parseFloat(transaction_fee * (finalRule.percentFee / 100)).toFixed(2) + " will be charged on transaction amount plus applicable taxes will apply" : "Convenience Fee of " + parseFloat(finalRule.percentFee).toFixed(2) + "% will be charged on transaction amount plus applicable taxes will apply"), msg
        }

        function surchargeMsg(catSelected, ibibocode) {
            var msg = "";
            return "upi" == catSelected ? msg = "No convenience fee or service charge is payable by the customer on UPI transactions" : "debitcard" == catSelected ? msg = "No convenience fee or service charge is payable by the customer on debit card transactions" : void 0 != ibibocode && surcharge_data[catSelected] && void 0 != surcharge_data[catSelected][ibibocode] ? msg = evaluateFinalRule(surcharge_data[catSelected][ibibocode]) : surcharge_data[catSelected] && void 0 != surcharge_data[catSelected]["default"] && (msg = evaluateFinalRule(surcharge_data[catSelected]["default"])), msg
        }
        var surcharge_data, surchargeCats = ["creditcard", "debitcard", "netbanking", "upi"],
            surchargeInfoElem = $("#additionalChargesInfoHdfc"),
            setSurchargeMessage = function(catSelected, ibibocode) {
                var msg = "";
                "" !== w.surchargeData && void 0 !== w.surchargeData && (surcharge_data = JSON.parse(w.surchargeData), "[object Object]" === Object.prototype.toString.call(surcharge_data) && (surchargeCats.indexOf(catSelected) > -1 && (msg = surchargeMsg(catSelected, ibibocode)), "" != msg ? surchargeInfoElem.show().html(msg) : surchargeInfoElem.hide().html("")))
            };
        w.setSurchargeMsg = setSurchargeMessage
    }(window, $), PayuUtilObject.controlPopup("kredTncModal", "tnnatag", "tncmodalclose");
var noCostEmiObj = function() {
    var bankNoCostEmiListHandler = function() {
            $("#bankNoCostEmiList").change(function() {
                var pgId = this.value;
                "" != pgId ? ($(this).find(".noCostEmiClassDefault").hide(), $(this).find(".noCostEmiDurationClass").show(), $(this).find("#no_cost_emi_duration_div_" + pgId).show(), $(this).find(".emiOptionsList").val("-1")) : ($(this).find(".noCostEmiClassDefault").show(), $(this).find(".noCostEmiDurationClass").hide())
            })
        },
        select_bank_no_cost_emi = function(selectValue) {
            $("#NotEligibleCardNoCostEmiMsg").addClass("hidden"), $(".noCostEmiDurationClass").hide(), "" != selectValue ? ($(".noCostEmiClassDefault").hide(), $("#no_cost_emi_duration_div_" + selectValue).show(), mode = selectValue) : (noCostEmiObj.emiFormToggle(0), $(".noCostEmiClassDefault").show(), $(".noCostEmiDurationClass").hide()), PayUCheckout.bankName = selectValue, "ICICID" != selectValue && $("#icici_nocostemi_terms_container").addClass("hidden"), "AXISD" != selectValue && ($("#axis_nocostemi_terms_container").addClass("hidden"), $("#axis_enocost_phone_customer").addClass("hidden")), 54 == selectValue ? $("#enocost_cvv_number").attr("maxlength", 4) : $("#enocost_cvv_number").attr("maxlength", 3), noCostEmiObj.emiFormToggle(0), $("#bank_no_cost_emi_list_" + selectValue).val(""), $(".emiText").hide(), hideAdditionalCharges(500)
        },
        select_no_cost_emi = function(selectValue) {
            if ("" != selectValue) {
                ibibo_code = selectValue, PayUCheckout.init("nocostemi", ibibo_code);
                "ICICID" == $("#bankNoCostEmiList").val() ? $("#icici_nocostemi_terms_container").removeClass("hidden") : $("#icici_nocostemi_terms_container").addClass("hidden"), "AXISD" == $("#bankNoCostEmiList").val() ? ($("#axis_nocostemi_terms_container").removeClass("hidden"), $("#axis_enocost_phone_customer").removeClass("hidden")) : ($("#axis_nocostemi_terms_container").addClass("hidden"), $("#axis_enocost_phone_customer").addClass("hidden")), noCostEmiObj.emiFormToggle(1), $(".emiText").hide(), $("#no_cost_emi_text_div_" + ibibo_code).show(), addAdditionalCharges(!0)
            } else noCostEmiObj.emiFormToggle(0), $(".emiText").hide(), hideAdditionalCharges(500)
        },
        emiFormToggle = function(showform) {
            if (showform > 0) {
                var emi_form = $("#no-cost-emi-form", this.form);
                clearForm(emi_form), clearForm($("#icici_nocostemi_terms_container", this.form)), clearForm($("#axis_nocostemi_terms_container", this.form)), clearForm($("#axis_enocost_phone_customer"), this.form), $(".error").attr("generated", "false"), $("label").remove(".error"), emi_form.removeClass("hidden"), emi_form.fadeIn("fast")
            } else {
                var emi_form = $("#no-cost-emi-form", this.form);
                emi_form.hide("fast", function() {})
            }
            $("#nocostemi_error_div").slideUp(200), $("#show_notification_nocostemi").slideUp(200), getStoreCardToDefaultState()
        },
        getCardNoCostEmiEligibility = function() {
            var cardNumber = $("#enocost_card_number").val().trim().replace(" ", "");
            if (cardNumber.length < 6) return $("#noCostMinAmountMsgDiv").addClass("hidden"), $("#NotEligibleCardNoCostEmiMsg").addClass("hidden"), $("#enocost_card_number").removeClass("redText"), void $(".NoCostEmiPayNowButton").attr("disabled", !1);
            if (!(cardNumber.length > 6)) {
                var cardBin = cardNumber.substring(0, 6);
                cardBin && checkCardNoCostEmiEligibility(cardBin)
            }
        },
        checkCardNoCostEmiEligibility = function(cardBin) {
            if (!cardBin) {
                var cardBin = $("#enocost_card_number").val().trim().replace(" ", "").substring(0, 6);
                if (cardBin.length < 6) return
            }
            var EligibleBins = (parseFloat($("#initialAmount").html()), PayUCheckout.getEligibleBinsForEMI("bin", cardBin, $("#bankNoCostEmiList").val()));
            EligibleBins.success(function(data) {
                0 == data.status && ($("#enocost_card_number").addClass("redText"), $("#NotEligibleCardNoCostEmiMsg").removeClass("hidden"), $("#NotEligibleCardNoCostEmiMsg").addClass("pnote"), $("#NotEligibleCardNoCostEmiMsg").addClass("emiCardEligibilityError"), $(".NoCostEmiPayNowButton").attr("disabled", !0))
            })
        },
        bindEventOnEcardNumber = function() {
            jQuery("#enocost_card_number").bind("keyup, keypress, keydown", function(event) {
                window.setTimeout(function() {
                    getCardNoCostEmiEligibility()
                })
            }), jQuery("#enocost_card_number").bind("blur", function() {
                checkCardNoCostEmiEligibility()
            })
        };
    return function() {
        bindEventOnEcardNumber(), bankNoCostEmiListHandler()
    }(), {
        emiFormToggle: emiFormToggle,
        select_no_cost_emi: select_no_cost_emi,
        select_bank_no_cost_emi: select_bank_no_cost_emi,
        checkCardNoCostEmiEligibility: checkCardNoCostEmiEligibility,
        getCardNoCostEmiEligibility: getCardNoCostEmiEligibility
    }
}();