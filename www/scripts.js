let buttonsgray = true;
let assistTable = true;
let toggleAssistVal = true

function bombInfoChanged() {
    if (toggleAssistVal == true) {
        let batteryCount = $("#batteryCount").val();
        if (batteryCount == "") {
            batteryCount = 0
        }
        let serial = {
            "even": $("#even")[0].checked,
            "vowel": $("#vowel")[0].checked
        };
        let parallel = $("#parallel")[0].checked;
        let lights = {
            "car": $("#car")[0].checked,
            "frk": $("#frk")[0].checked
        };

        if (serial.even == false) {
            $(".isSerialOdd").removeClass("strike-through");
        } else {
            $(".isSerialOdd").addClass("strike-through");
        }
        if (buttonsgray == true) {
            if (batteryCount >= 2) {
                $(".buttonDetMoreBat").removeClass("disabledBat");
                $(".buttonDetLessBat").addClass("disabledBat");
            } else {
                $(".buttonDetMoreBat").addClass("disabledBat");
                $(".buttonDetLessBat").removeClass("disabledBat");
            }
            if (lights.car == false) {
                $(".buttonLightCar").addClass("disabledCar");
                $(".buttonNoLightCar").removeClass("disabledCar");
            } else {
                $(".buttonLightCar").removeClass("disabledCar");
                $(".buttonNoLightCar").addClass("disabledCar");
            }
            if (lights.frk == true && batteryCount >= 3) {
                $(".buttonCCheck").text("P")
            } else {
                $(".buttonCCheck").text("H")
            }
        } else {
            $(".buttonDetMoreBat").removeClass("disabledBat");
            $(".buttonDetLessBat").removeClass("disabledBat");
            $(".buttonLightCar").removeClass("disabledCar");
            $(".buttonNoLightCar").removeClass("disabledCar");
            $(".buttonCCheck").removeClass("disabledC");
            $(".buttonCCheck").text("C")
        }
        if (serial.vowel == false) {
            $("#withVowel").addClass("imgDisabled")
            $("#withoutVowel").removeClass("imgDisabled")
        } else {
            $("#withVowel").removeClass("imgDisabled")
            $("#withoutVowel").addClass("imgDisabled")
        }
        if (assistTable == true) {
            if (batteryCount >= 2) {
                $(".ifBatteryMore2").addClass("wireCut")
                $(".ifBatteryMore2").removeClass("wireDontCut")
            } else {
                $(".ifBatteryMore2").removeClass("wireCut")
                $(".ifBatteryMore2").addClass("wireDontCut")
            }
            if (serial.even == true) {
                $(".ifSerial").addClass("wireCut")
                $(".ifSerial").removeClass("wireDontCut")
            } else {
                $(".ifSerial").removeClass("wireCut")
                $(".ifSerial").addClass("wireDontCut")
            }
            if (parallel == true) {
                $(".ifParallel").addClass("wireCut")
                $(".ifParallel").removeClass("wireDontCut")
            } else {
                $(".ifParallel").removeClass("wireCut")
                $(".ifParallel").addClass("wireDontCut")
            }
        } else {
            $(".ifBatteryMore2").removeClass("wireCut")
            $(".ifBatteryMore2").removeClass("wireDontCut")
            $(".ifSerial").removeClass("wireCut")
            $(".ifSerial").removeClass("wireDontCut")
            $(".ifParallel").removeClass("wireCut")
            $(".ifParallel").removeClass("wireDontCut")
        }
    } else {
        $("#withVowel").removeClass("imgDisabled")
        $("#withoutVowel").removeClass("imgDisabled")
        $(".buttonCCheck").text("C")
        $(".buttonLightCar").removeClass("disabledCar");
        $(".buttonNoLightCar").removeClass("disabledCar");
        $(".buttonDetLessBat").removeClass("disabledBat");
        $(".buttonDetMoreBat").removeClass("disabledBat")
        $(".isSerialOdd").removeClass("strike-through");
        $(".ifBatteryMore2").removeClass("wireCut")
            $(".ifBatteryMore2").removeClass("wireDontCut")
            $(".ifSerial").removeClass("wireCut")
            $(".ifSerial").remonavveClass("wireDontCut")
            $(".ifParallel").removeClass("wireCut")
            $(".ifParallel").removeClass("wireDontCut")
    }
}

$(function () {
    bombInfoChanged();
});

function enableButtonGray() {
    if (buttonsgray == true) {
        buttonsgray = false;
    } else {
        buttonsgray = true;
    }
    bombInfoChanged();
}

function enableAssistedTable(params) {
    if (assistTable == true) {
        assistTable = false;
    } else {
        assistTable = true;
    }
    bombInfoChanged();
}

$("th.wireSeqStrike").click(function () {
    if (!$(this).hasClass("strike-through")) {
        $(this).addClass("strike-through")
    } else {
        $(this).removeClass("strike-through")
    }
});;

function checkCoord() {
    if (toggleAssistVal == true) {
        $(".mazeImage").each(function () {
            $(this).css("background-color", "unset");
            $(this).removeClass("hidden");
        });
        let input = $("#coord").val();

        let regex = /^[a-fA-F][1-6]$/im;
        if (regex.test(input) == true) {
            match = false;
            matchAlt = "";
            $(".mazeImage").each(function () {
                let coords = $(this).attr("alt");

                if (coords.toLowerCase().includes(input.toLowerCase())) {
                    match = true;
                    matchAlt = coords;
                }
            })
            if (match == true) {
                $(".mazeImage").each(function () {
                    if ($(this).attr("alt") !== matchAlt) {
                        $(this).addClass("hidden");
                    } else {
                        $(this).removeClass("hidden");
                    }

                })
            }
        } else {
            $(".mazeImage").each(function () {
                $(this).css("background-color", "none");
                $(this).removeClass("hidden");
            })
        }
    } else {
        $(".mazeImage").each(function () {
            $(this).css("background-color", "unset");
            $(this).removeClass("hidden");
        });
    }
}

$(".mazeImage").on("click", function (e) {
    e.stopPropagation()
    isThereHidden = false;
    $(".mazeImage").each(function () {
        if ($(this).hasClass("hidden")) {
            isThereHidden = true
        }
    });
    if (isThereHidden) {
        $(".mazeImage").each(function () {
            $(this).removeClass("hidden");
        });
    } else {
        let coords = $(this).attr("alt");
        $(".mazeImage").each(function () {
            if ($(this).attr("alt") !== coords) {
                $(this).addClass("hidden");
            } else {
                $(this).removeClass("hidden");
            }
        });
    }
});

$("#maze").children(".card-body").on("click", function () {
    isThereHidden = false;
    $(".mazeImage").each(function () {
        if ($(this).hasClass("hidden")) {
            isThereHidden = true
        }
    });
    if (isThereHidden) {
        $(".mazeImage").each(function () {
            $(this).removeClass("hidden");
        });
    }
});

function passwordsSearch() {
    if (toggleAssistVal == true) {
        let letters = $("#passwordInput").val().split("");
        if ($("#passwordInput").val() == "") {
            $("#passwordsTable").children().first().children().each(function () {
                $(this).children().each(function () {
                    $(this).removeClass("hidden")
                })
            })
        } else {
            $("#passwordsTable").children().first().children().each(function () {
                $(this).children().each(function () {
                    $(this).addClass("hidden")
                    letters.forEach(letter => {
                        if (letter.toLowerCase() === $(this).text().charAt(0).toLowerCase()) {
                            $(this).removeClass("hidden")
                        }
                    });
                })
            })
        }
    } else {
        $("#passwordsTable").children().first().children().each(function () {
            $(this).children().each(function () {
                $(this).removeClass("hidden")
            })
        })
    }
}

if ($(window).width() >= 1310) {
    $(".nav-content").show();
} else {
    $("#navbar button").on("mouseover", function () {
        $(".nav-content").fadeIn();
    })
    $(".nav-content").on("mouseleave", function () {
        $(".nav-content").fadeOut();
    })
}

$(window).resize(function(){
    if ($(window).width() >= 1310) {
        $(".nav-content").show();
        $("#navbar button").off("mouseover");
        $(".nav-content").off("mouseleave");
    } else {
        $(".nav-content").hide();
        $("#navbar button").on("mouseover", function () {
            $(".nav-content").fadeIn();
        })
        $(".nav-content").on("mouseleave", function () {
            $(".nav-content").fadeOut();
        })
    }
});

function resetModules() {
    // WOF
    $("#wof2 input").val("");
    $("#wof2Table").children().first().children().each(function () {
        $(this).removeClass("hidden")
    })

    // MEMORY
    $("#memory input").each(function () {
        $(this).val("")
    })

    // WIRE SEQ
    $("th.wireSeqStrike").each(function () {
        $(this).removeClass("strike-through")
    })

    // MAZES
    $(".mazeImage").each(function () {
        $(this).removeClass("hidden");
    });
    $("#maze").find("input").val("");

    // PASSWORDS
    $("#password input").val("");
    $("#passwordsTable").children().first().children().each(function () {
        $(this).children().each(function () {
            $(this).removeClass("hidden")
        })
    })
}

function switchLabelPos() {
    let tableLocation = $("#memory").find(".card-body").find(".row:eq(2)").find(".col-6:eq(1)").find("table").find("tbody");
    if ($("#labelCheck").is(':checked')) {
        tableLocation.find("tr:eq(0)").find("th").text("Position");
        tableLocation.find("tr:eq(1)").find("th").text("Label");
    } else {
        tableLocation.find("tr:eq(1)").find("th").text("Position");
        tableLocation.find("tr:eq(0)").find("th").text("Label");
    }
}

$("#nav-bbm").click(function () {
    window.scrollTo(0, 0);
})

function newBomb() {
    resetModules();

    //BATTERY COUNT

    $("#batteryCount").val("");
    $("#bombInfo input:checkbox").each(function() {
        $(this).prop("checked", false);
    })
}

function toggleAssist() {
    if (toggleAssistVal == true) {
        toggleAssistVal = false
    } else {
        toggleAssistVal = true
    }
    bombInfoChanged()
    lookInTable()
    passwordsSearch()
}