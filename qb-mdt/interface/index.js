let canSearchForProfiles = true
let canSaveProfile = true
let canRefreshBolo = true
let canRefreshReports = true
let canRefreshIncidents = true
let canInputTag = true
let canInputBoloTag = true
let canInputBoloOfficerTag = true
let canSearchReports = true
let canCreateBulletin = 0
let mouse_is_inside = false;
let currentTab = ".dashboard-page-container"
let MyName = ""
let canInputReportTag = true
let canInputReportOfficerTag = true
let canInputReportCivilianTag = true
let canSearchForVehicles = true
let canSearchForReports = true
let canSaveVehicle = true
var LastName = ""
var DispatchNum = 0
let PoliceRoster = ""
let EMSRoster = ""
var isPublicRecords = false

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    if (prefomattedDate) {
        return `${prefomattedDate} at ${hours}:${minutes}`;
    }

    if (hideYear) {
        return `${day}. ${month} at ${hours}:${minutes}`;
    }

    return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
}

function timeAgo(dateParam) {
    if (!dateParam) {
        return null;
    }

    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000;
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();

    if (seconds < 5) {
        return 'Just Now';
    } else if (seconds < 60) {
        return `${seconds} Seconds ago`;
    } else if (seconds < 90) {
        return 'About a minute ago';
    } else if (minutes < 60) {
        return `${minutes} Minutes ago`;
    } else if (isToday) {
        return getFormattedDate(date, 'Today');
    } else if (isYesterday) {
        return getFormattedDate(date, 'Yesterday');
    } else if (isThisYear) {
        return getFormattedDate(date, false, true);
    }

    return getFormattedDate(date);
}

$(document).ready(() => {

    $(".header").hover(function () {
        $(".close-all").css("opacity", "0.5");
    }, function () {
        $(".close-all").css("opacity", "1");
    });
    $(".nav-item").click(function () {
        if ($(this).hasClass("active-nav") == false) {
            fidgetSpinner($(this).data("page"));
            currentTab = $(this).data("page");
        }
    });
    $(".profile-items").on("click", ".profile-item", function () {
        let id = $(this).data("id");
        $.post(`https://${GetParentResourceName()}/getProfileData`, JSON.stringify({
            id: id
        }));
    })
    $(".profile-items").on("contextmenu", ".profile-item", function (e) {
        var args = ""
        args = [
            {
                "className": "profile-jail",
                "icon": "fas fa-circle",
                "text": "Jail Citizen",
                "info": $(this).data("id"),
                "status": ""
            },
            {
                "className": "profile-missing",
                "icon": "fas fa-circle",
                "text": "Missing Citizen",
                "info": $(this).data("id"),
                "status": ""
            },
        ]
        if (currentJob == "police") {
            openContextMenu(e, args);
        }
    })
    $(".bulletin-add-btn").click(function () {
        if (canCreateBulletin == 0) {
            $(this).removeClass('fa-plus').addClass('fa-minus');
            let BulletinId = Number($('.bulletin-item').first().data("id")) + 1
            if (Number.isNaN(BulletinId)) { BulletinId = 1 }
            canCreateBulletin = BulletinId
            $('.bulletin-items-continer').prepend(`<div class="bulletin-item" data-id="${canCreateBulletin}">
                <span contenteditable="true" class="bulletin-item-title"></span>
                <span contenteditable="true" class="bulletin-item-info"></span>
                <div class="bulletin-bottom-info">
                <div class="bulletin-id">ID: ${BulletinId}</div>
                <div class="bulletin-date">${MyName} - Just Now</div>
                </div>
            </div>`)
        } else {
            $(this).removeClass('fa-minus').addClass('fa-plus');
            $(".bulletin-items-continer").find("[data-id='" + canCreateBulletin + "']").remove();
            canCreateBulletin = 0
        }
    })
    $(".bulletin-items-continer").on("keydown", ".bulletin-item", function (e) {
        if (e.keyCode === 13) {
            $(".bulletin-add-btn").removeClass('fa-minus').addClass('fa-plus');
            let id = $(this).find(".bulletin-id").text()
            let date = $(this).find(".bulletin-date").text()
            let title = $(this).find(".bulletin-item-title").text()
            let info = $(this).find(".bulletin-item-info").text()
            let time = new Date()
            $.post(`https://${GetParentResourceName()}/newBulletin`, JSON.stringify({
                title: title,
                info: info,
                time: time.getTime()
            }));
            $(".bulletin-items-continer").find("[data-id='" + canCreateBulletin + "']").remove();
            $('.bulletin-items-continer').prepend(`<div class="bulletin-item" data-id="${canCreateBulletin}">
                <div class="bulletin-item-title">${title}</div>
                <div class="bulletin-item-info">${info}</div>
                <div class="bulletin-bottom-info">
                    <div class="bulletin-id">ID: ${canCreateBulletin}</div>
                    <div class="bulletin-date">${MyName} - ${timeAgo(Number(time.getTime()))}</div>
                </div>
            </div>`)
            canCreateBulletin = 0
        }
    });
    $(".bulletin-items-continer").on("contextmenu", ".bulletin-item", function (e) {
        let args = [
            {
                "className": "remove-bulletin",
                "icon": "fas fa-times",
                "text": "Remove Item",
                "info": $(this).data("id"),
                "status": ""
            }
        ]
        openContextMenu(e, args);
    })
    $(".contextmenu").on("click", ".remove-bulletin", function () {
        let BulletinId = $(this).data("info")
        let time = new Date()
        $(".bulletin-items-continer").find("[data-id='" + BulletinId + "']").remove();
        $.post(`https://${GetParentResourceName()}/deleteBulletin`, JSON.stringify({
            id: BulletinId,
            time: time.getTime()
        }));
        if (canCreateBulletin == BulletinId) { canCreateBulletin = 0 }
        if ($(".bulletin-add-btn").hasClass("fa-minus")) { $(".bulletin-add-btn").removeClass('fa-minus').addClass('fa-plus'); }
    });
    $(".associated-incidents-tags-add-btn").on("click", "", function () {
        IncidentSearchType = "person"
        document.addEventListener('mouseup', onMouseDownIcidents);
        $(".icidents-person-search-container").fadeIn(250)
        $(".close-all").css("filter", "brightness(15%)");
    });
    $(".gallery-add-btn").click(function () {
        if ($(".manage-profile-citizenid-input").val()) {
            if ($(".gallery-upload-input").css("display") == "none") {
                $(".gallery-upload-input").slideDown(250);
                $(".gallery-upload-input").css("display", "block")
                $(this).removeClass('fa-plus').addClass('fa-minus');
            } else {
                $(".gallery-upload-input").slideUp(250);
                setTimeout(() => {
                    $(".gallery-upload-input").css("display", "none")
                }, 250);
                $(this).removeClass('fa-minus').addClass('fa-plus');
            }
        } else {
            $(this).effect("shake", { times: 2, distance: 2 }, 500)
        }
    });
    $('#gallery-upload-input').keydown(function (e) {
        if (e.keyCode === 13) {
            let URL = $("#gallery-upload-input").val();
            let cid = $(".manage-profile-citizenid-input").val();
            if (URL !== "") {
                let randomNum = Math.ceil(Math.random() * 10).toString()
                $('.gallery-inner-container').prepend(`<img src="${URL}" class="gallery-img ${randomNum}" onerror="this.src='https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg'">`);
                setTimeout(() => {
                    URL = $("." + randomNum).attr("src")
                    $.post(`https://${GetParentResourceName()}/addGalleryImg`, JSON.stringify({
                        cid: cid,
                        URL: URL
                    }));
                }, 250);
                $("#gallery-upload-input").val("");
                $(".gallery-upload-input").slideUp(250);
                setTimeout(() => {
                    $(".gallery-upload-input").css("display", "none")
                }, 250);
                $(".gallery-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
        }
    });
    $(".manage-profile-save").click(function () {
        if (canSaveProfile == true) {
            canSaveProfile = false
            $(".manage-profile-save").empty();
            $('.manage-profile-save').prepend(`<span class="fas fa-check"></span>`);
            setTimeout(() => {
                $(".manage-profile-save").empty();
                $(".manage-profile-save").html("Save");
                canSaveProfile = true
            }, 750);
            setTimeout(() => {
                let pfp = $(".manage-profile-pic").attr("src");
                let newpfp = $(".manage-profile-url-input").val();
                if (newpfp.includes("base64")) {
                    newpfp = "https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg"
                } else {
                    pfp = newpfp
                }
                let description = $(".manage-profile-info").val();
                let id = $(".manage-profile-citizenid-input").val();

                const fName = $(".manage-profile-name-input-1").val()
                const sName = $(".manage-profile-name-input-2").val()

                $.post(`https://${GetParentResourceName()}/saveProfile`, JSON.stringify({
                    pfp: pfp,
                    description: description,
                    id: id,
                    fName: fName,
                    sName: sName
                }));
                $(".manage-profile-pic").attr("src", newpfp);
            }, 250);
        }
    });
    $(".manage-incidents-title-holder").on("click", ".manage-incidents-save", function () {
        if (canSaveProfile == true) {
            canSaveProfile = false
            $(".manage-incidents-save").empty();
            $('.manage-incidents-save').prepend(`<span class="fas fa-check style="margin-top: 3.5px;""></span>`);
            setTimeout(() => {
                $(".manage-incidents-save").empty();
                $('.manage-incidents-save').prepend(`<span class="fas fa-save" style="margin-top: 3.5px;"></span>`);
                canSaveProfile = true
            }, 750);

            // Title, information, tags, officers involved, civs involved, evidence
            const title = $('#manage-incidents-title-input').val()
            const information = $('.manage-incidents-reports-content').val()
            const dbid = $(".manage-incidents-editing-title").data("id")
            
            let tags = new Array()
            let officers = new Array()
            let civilians = new Array()
            let evidence = new Array()
    
            $('.manage-incidents-tags-holder').find('div').each(function(){
                if ($(this).text() != "") { tags.push($(this).text()) }
            });

            $(".manage-incidents-officeun-holder").find('div').each(function(){
                if ($(this).text() != "") { officers.push($(this).text()) }
            });

            $(".manage-incidents-civilians-holder").find('div').each(function(){
                if ($(this).text() != "") { civilians.push($(this).text()) }
            });
    
            $(".manage-incidents-evidence-holder").find('img').each(function(){
                if ($(this).attr("src") != "") { evidence.push($(this).attr("src")) }
            });
    
            let time = new Date()

            let associated = new Array()

            $(".associated-incidents-user-container").each(function(index) {
                var cid = $(this).data("id")
                var guilty = false
                var warrant = false
                var processed = false
                var isassociated = false
                var charges = new Array()

                $(".associated-incidents-user-tags-holder").children('div').each(function(index) {
                    if ($(this).data("id") == cid) {
                        if ($(this).hasClass("green-tag")) {
                            if ($(this).text() == 'Guilty') { guilty = true }
                            if ($(this).text() == 'Warrant') { warrant = true }
                            if ($(this).text() == 'Processed') { processed = true }
                            if ($(this).text() == 'Associated') { isassociated = true }
                        } 
                    }             
                });

                $(".associated-incidents-user-holder").children('div').each(function(index) {
                    if ($(".associated-incidents-user-holder").children().eq(index).data("id") == cid) {
                        charges.push($(".associated-incidents-user-holder").children().eq(index).html())
                    }            
                });

                associated.push({
                    Cid: $(this).data("id"),
                    Warrant: warrant,
                    Guilty: guilty,
                    Processed: processed,
                    Isassociated: isassociated,
                    Charges: charges,
                    Fine: $(".fine-amount").filter("[data-id='" + $(this).data("id") + "']").val(),
                    Sentence: $(".sentence-amount").filter("[data-id='" + $(this).data("id") + "']").val(),
                    recfine: $(".fine-recommended-amount").filter("[data-id='" + $(this).data("id") + "']").val(),
                    recsentence: $(".sentence-recommended-amount").filter("[data-id='" + $(this).data("id") + "']").val(),
                })
            })

            $.post(`https://${GetParentResourceName()}/saveIncident`, JSON.stringify({
                ID: dbid,
                title: title,
                information: information,
                tags: tags,
                officers: officers,
                civilians: civilians,
                evidence: evidence,
                associated: associated,
                time: time.getTime()
            }));

            setTimeout(() => {
                if (canRefreshIncidents == true) {
                    canRefreshIncidents = false
                    $(".incidents-search-refresh").empty();
                    $('.incidents-search-refresh').prepend(`<span class="fas fa-spinner fa-spin"></span>`);
                    setTimeout(() => {
                        $(".incidents-search-refresh").empty();
                        $(".incidents-search-refresh").html("Refresh");
                        canRefreshIncidents = true
                        $.post(`https://${GetParentResourceName()}/getAllIncidents`, JSON.stringify({}));
                    }, 1500);
                }
            }, 1000);

        }
    });
    $(".manage-incidents-title-holder").on("click", ".manage-incidents-create", function () {
        if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
            $(".manage-incidents-reports-content").val("ICU Room #: [ # ]\n\nReport ID: [ Report ID ]\n\nTime Admitted: [ Date and Time Here ]\n\nSurgery: [Yes/No]\n\nInjuries/Ailments:\n - [ Enter List Of Injuries Here ]\n\n\nAdditional Attending:\n - [ List Any Other Staff Here ]\n\n\n🧑‍🤝‍🧑 Additonal Emergency Contacts:\n - [ Name And Number ]\n\n\nNotes:\n[Additional Notes Here]");
            $("#manage-incidents-title-input").val("Name - " + $(".date").html());
            $(".manage-incidents-editing-title").html("You are currently creating a new check-in report");
            $(".manage-incidents-title-holder").empty();
            $(".manage-incidents-title-holder").prepend(
                `
                <div class="manage-incidents-title">Manage ICU Check-in</div>
                <div class="manage-incidents-create"> <span class="fas fa-plus" style="margin-top: 3.5px;"></span></div>
                <div class="manage-incidents-save"><span class="fas fa-save" style="margin-top: 3.5px;"></span></div>
                `
            );
        } else {
            $(".manage-incidents-reports-content").val("📝 Summary:\n\n[Insert Report Summary Here]\n\n🧍 Hostage: [Name Here]\n\n🔪 Weapons/Items Confiscated:\n\n· [Insert List Here]\n\n-----\n💸 Fine:\n⌚ Sentence:\n-----");
            $("#manage-incidents-title-input").val("Name - Charge - " + $(".date").html());
            $(".manage-incidents-editing-title").html("You are currently creating a new Incident");
            $(".manage-incidents-title-holder").empty();
            $(".manage-incidents-title-holder").prepend(
                `
                <div class="manage-incidents-title">Manage Incident</div>
                <div class="manage-incidents-create"> <span class="fas fa-plus" style="margin-top: 3.5px;"></span></div>
                <div class="manage-incidents-save"><span class="fas fa-save" style="margin-top: 3.5px;"></span></div>
                `
            );
        }
        $(".manage-incidents-tags-holder").empty();
        $(".manage-incidents-officeun-holder").empty();
        $(".manage-incidents-civilians-holder").empty();
        $(".manage-incidents-evidence-holder").empty();
        $(".manage-incidents-title").css("width", "66%");
        $(".manage-incidents-create").css("margin-right", "0px");
        $(".incidents-ghost-holder").html("")
        $(".associated-incidents-tags-holder").html("")
        $(".manage-incidents-editing-title").data("id", 0);
        $(".manage-incidents-tags-add-btn").css("pointer-events", "auto")
        $(".manage-incidents-reports-content").css("pointer-events", "auto")
        $(".manage-incidents-officeun-add-btn").css("pointer-events", "auto")
        $(".manage-incidents-civilians-add-btn").css("pointer-events", "auto")
        $(".manage-incidents-evidence-add-btn").css("pointer-events", "auto")
        $(".associated-incidents-tags-add-btn").css("pointer-events", "auto")
    });
    $(".tags-add-btn").click(function () {
        if ($(".manage-profile-citizenid-input").val()) {
            if (canInputTag) {
                $(this).removeClass('fa-plus').addClass('fa-minus');
                $('.tags-holder').prepend(`<span contenteditable="true" class="tag-input"></span>`);
                canInputTag = false
            } else if (!canInputTag) {
                $(this).removeClass('fa-minus').addClass('fa-plus');
                $(".tag-input").remove()
                canInputTag = true
            }

        } else {
            $(this).effect("shake", { times: 2, distance: 2 }, 500)
        }
    });
    $(".weapons-add-btn").click(function () {
        if ($(".manage-profile-citizenid-input").val()) {
            if (canInputTag) {
                $(this).removeClass('fa-plus').addClass('fa-minus');
                $('.weapons-holder').prepend(`<span contenteditable="true" class="weapon-input"></span>`);
                canInputTag = false
            } else if (!canInputTag) {
                $(this).removeClass('fa-minus').addClass('fa-plus');
                $(".weapon-input").remove()
                canInputTag = true
            }
        } else {
            $(this).effect("shake", { times: 2, distance: 2 }, 500)
        }
    });
    $(".weapons-holder").on("keydown", ".weapon-input", function (e) {
        if (e.keyCode === 13) {
            addWeapon($(".weapon-input").text())
            if ($(".weapons-add-btn").hasClass("fa-minus")) {
                $(".weapons-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
            $(".weapon-input").remove()
        }
    });
    $(".tags-holder").on("keydown", ".tag-input", function (e) {
        if (e.keyCode === 13) {
            addTag($(".tag-input").text())
            if ($(".tags-add-btn").hasClass("fa-minus")) {
                $(".tags-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
            $(".tag-input").remove()
        }
    });
    $(".contextmenu").on("click", ".search-vehicle", function () {
       let plate = $(this).data("info");
       fidgetSpinner(".dmv-page-container");
       currentTab = ".dmv-page-container";
       setTimeout(() => {
           $(".dmv-search-input").slideDown(250);
           $(".dmv-search-input").css("display", "block")
           setTimeout(() => {
               $("#dmv-search-input:text").val(plate.toString());
               $.post(`https://${GetParentResourceName()}/searchVehicles`, JSON.stringify({
                   name: plate.toString()
               }));
               $(".dmv-items").empty();
                $('.dmv-items').prepend(`<div class="profile-loader"></div>`);
               setTimeout(() => {
                   $.post(`https://${GetParentResourceName()}/getVehicleData`, JSON.stringify({
                       plate: plate.toString()
                   }));
               }, 250);

           }, 250);
       }, 250);

    });
    $(".contextmenu").on("click", ".search-weapon", function () {
        let plate = $(this).data("info");
        fidgetSpinner(".weapons-page-container");
        currentTab = ".weapons-page-container";
        setTimeout(() => {
            $(".weapons-search-input").slideDown(250);
            $(".weapons-search-input").css("display", "block")
            setTimeout(() => {
                $("#weapons-search-input:text").val(plate.toString());
                $.post(`https://${GetParentResourceName()}/searchWeapon`, JSON.stringify({
                    name: plate.toString()
                }));
                $(".weapons-items").empty();
                $('.weapons-items').prepend(`<div class="profile-loader"></div>`);
                setTimeout(() => {
                    $.post(`https://${GetParentResourceName()}/getWeaponData`, JSON.stringify({
                        serialnumber: plate.toString()
                    }));
                }, 250);
            }, 250);
        }, 250);
    });
    $(".vehs-holder").on("contextmenu", ".veh-tag", function (e) {
        let args = [
            {
                "className": "search-vehicle",
                "icon": "fas fa-car",
                "text": "Search Vehicle",
                "info": $(this).data("plate"),
                "status": ""
            }
        ]
        openContextMenu(e, args);
    })
    $(".weapons-holder").on("contextmenu", ".tag", function (e) {
        let args = [
            {
                "className": "search-weapon",
                "icon": "fas fa-circle",
                "text": "Search Weapon",
                "info": $(this).data("plate"),
                "status": ""
            }
        ]
        openContextMenu(e, args);
    })
    $(".gallery-inner-container").on("click", ".gallery-img", function () {
        if ($(this).css("filter") == "none") {
            $(this).css("filter", "blur(5px)");
        } else {
            $(this).css("filter", "none");
        }
    })
    $(".contextmenu").on("click", ".expand-image", function () {
        expandImage($(this).data("info"));
    });
    $(".contextmenu").on("click", ".remove-image", function () {
        removeImage($(this).data("info"));
    });
    $(".contextmenu").on("click", ".remove-image-incident", function () {
        $(".manage-incidents-evidence-holder img").filter("[src='" + $(this).data("info") + "']").remove();
    });
    $(".gallery-inner-container").on("contextmenu", ".gallery-img", function (e) {
        let args = [
            {
                "className": "remove-image",
                "icon": "fas fa-times",
                "text": "Remove Image",
                "info": $(this).attr("src"),
                "status": ""
            },
            {
                "className": "expand-image",
                "icon": "fas fa-expand",
                "text": "Expand Image",
                "info": $(this).attr("src"),
                "status": $(this).css("filter")
            },
        ]
        openContextMenu(e, args);
    })
    $(".licenses-holder").on("contextmenu", ".license-tag", function (e) {
        const licenseStatus = $(this).data("type")
        let type = $(this).html();
        if (type == "Car") {
            info = "driver";
        } else if (type == "Bike") {
            info = "drive_bike";
        } else if (type == "Truck") {
            info = "drive_truck";
        } else if (type == "Pilot") {
            info = "pilot";
        } else if (type == "Weapon") {
            info = "weapon";
        } else {
            info = type
        };
        if ($(this).hasClass("green-tag")) {
            openContextMenu(e, [{
                "className": "revoke-licence",
                "icon": "fas fa-times",
                "text": "Revoke License",
                "info": info,
                "status": licenseStatus
            }]);
        } else if ($(this).hasClass("red-tag")) {
            openContextMenu(e, [{
                "className": "give-licence",
                "icon": "fas fa-check",
                "text": "Give License",
                "info": info,
                "status": licenseStatus
            }]);
        }
    })
    $(".contextmenu").on("click", ".revoke-licence", function () {
        $.post(`https://${GetParentResourceName()}/updateLicence`, JSON.stringify({
            cid: $(".manage-profile-citizenid-input").val(),
            type: $(this).data("info"),
            status: "revoke"
        }));
        const Elem = $(this).data("status")
        $(".license-tag").filter(`[data-type="${Elem}"]`).removeClass("green-tag").addClass("red-tag")
        onMouseDown()
    })
    $(".contextmenu").on("click", ".give-licence", function () {
        $.post(`https://${GetParentResourceName()}/updateLicence`, JSON.stringify({
            cid: $(".manage-profile-citizenid-input").val(),
            type: $(this).data("info"),
            status: "give"
        }));
        const Elem = $(this).data("status")
        $(".license-tag").filter(`[data-type="${Elem}"]`).removeClass("red-tag").addClass("green-tag")
        onMouseDown()
    })
    $(".profile-title").click(function () {
        if (canSearchForProfiles == true) {
            if ($(".profile-search-input").css("display") == "none") {
                $(".profile-search-input").slideDown(250);
                $(".profile-search-input").css("display", "block")
            } else {
                $(".profile-search-input").slideUp(250);
                setTimeout(() => {
                    $(".profile-search-input").css("display", "none")
                }, 250);
            }
        }
    });
    $('#profile-search-input').keydown(function (e) {
        if (e.keyCode === 13 && canSearchForProfiles == true) {
            let name = $("#profile-search-input").val()
            if (name !== "") {
                canSearchForProfiles = false
                $.post(`https://${GetParentResourceName()}/searchProfiles`, JSON.stringify({
                    name: name
                }));
                $(".profile-items").empty();
                $('.profile-items').prepend(`<div class="profile-loader"></div>`);
            }
        }
    });
    $(".incidents-title").click(function () {
        if (canSearchForProfiles == true) {
            if ($(".incidents-search-input").css("display") == "none") {
                $(".incidents-search-input").slideDown(250);
                $(".incidents-search-input").css("display", "block")
            } else {
                $(".incidents-search-input").slideUp(250);
                setTimeout(() => {
                    $(".incidents-search-input").css("display", "none")
                }, 250);
            }
        }
    });
    $('#incidents-search-input').keydown(function (e) {
        if (e.keyCode === 13 && canSearchForProfiles == true) {
            let incident = $("#incidents-search-input").val()
            if (incident !== "") {
                canSearchForProfiles = false
                $.post(`https://${GetParentResourceName()}/searchIncidents`, JSON.stringify({
                    incident: incident
                }));
                $(".incidents-items").empty();
                $('.incidents-items').prepend(`<div class="profile-loader"></div>`);
            }
        }
    });

    $('#dispatchmsg').keydown(function (e) {
        const keyCode = e.which || e.keyCode;
        if (keyCode === 13 && !e.shiftKey) {
            e.preventDefault()
            const time = new Date()
            $.post(`https://${GetParentResourceName()}/dispatchMessage`, JSON.stringify({
                message: $(this).val(),
                time: time.getTime()
            }));
            $(this).val("")
        }
    });

    $(".incidents-items").on("click", ".incidents-item", function () {
        const id = $(this).data("id");
        $.post(`https://${GetParentResourceName()}/getIncidentData`, JSON.stringify({
            id: id
        }));
    })
    $(".manage-incidents-civilians-holder").on("click", ".manage-incidents-civilians", function () {
        const name = $(this).text();
        fidgetSpinner(".profile-page-container");
        currentTab = ".profile-page-container";
        setTimeout(() => {
            $(".profile-search-input").slideDown(250);
            $(".profile-search-input").css("display", "block")
            setTimeout(() => {
                $("#profile-search-input:text").val(name);
                canSearchForProfiles = false
                $.post(`https://${GetParentResourceName()}/searchProfiles`, JSON.stringify({
                    name: name
                }));
                $(".profile-items").empty();
                $('.profile-items').prepend(`<div class="profile-loader"></div>`);
                setTimeout(() => {
                    $.post(`https://${GetParentResourceName()}/getProfileData`, JSON.stringify({
                        id: name
                    }));
                }, 250);
            }, 250);
        }, 250);
    })
    document.onkeyup = function (data) {
        if (data.which == 27) {
            let shouldClose = true

            if ($(".respond-calls-container").css("display") == "block") {
                shouldClose = false
                $(".respond-calls-container").fadeOut(500)
                setTimeout(() => { $(".close-all").css("filter", "none"); }, 250);
            }

            if ($(".gallery-image-enlarged").css("display") == "block") {
                shouldClose = false
                $(".gallery-image-enlarged").fadeOut(150);
                $(".gallery-image-enlarged").css("display", "none");
                $(".close-all").css("filter", "none");
            }

            if ($(".incidents-image-enlarged").css("display") == "block") {
                shouldClose = false
                $(".incidents-image-enlarged").fadeOut(150);
                $(".incidents-image-enlarged").css("display", "none");
            }

            if ($(".icidents-person-search-container").css("display") != "none") {
                shouldClose = false
                $(".icidents-person-search-container").fadeOut(250);
                $(".close-all").css("filter", "none");
            }

            if ($(".incidents-charges-table").css("display") != "none") {
                shouldClose = false
                $(".incidents-charges-table").slideUp(500);
                $(".incidents-charges-table").fadeOut(500);
                setTimeout(() => {
                    $(".close-all").css("filter", "none");
                }, 250);
            }

            if ($(".dispatch-attached-units").css("display") != "none") {
                shouldClose = false
                $(".dispatch-attached-units").slideUp(500);
                $(".dispatch-attached-units").fadeOut(500);
                setTimeout(() => {
                    $(".close-all").css("filter", "none");
                }, 250);
            }

            if (shouldClose == true) {
                $.post(`https://${GetParentResourceName()}/escape`, JSON.stringify({}));
            }
        }
    };
    $(".manage-incidents-tags-add-btn").click(function () {
        if ($(".tag-incident-input")[0]) {
            $(this).removeClass('fa-minus').addClass('fa-plus');
            $(".tag-incident-input").remove()
        } else {
            $(this).removeClass('fa-plus').addClass('fa-minus');
            $('.manage-incidents-tags-holder').prepend(`<span contenteditable="true" class="tag-incident-input"></span>`);
        }
    });

    $(".icidents-person-search-name-input").on("keydown", "", function (e) {
        if (e.keyCode === 13) {
            let name = $(".icidents-person-search-name-input").val();
            $.post(`https://${GetParentResourceName()}/incidentSearchPerson`, JSON.stringify({
                name: name
            }));
        }
    });

    $(".manage-incidents-tags-holder").on("keydown", ".tag-incident-input", function (e) {
        if (e.keyCode === 13) {
            $('.manage-incidents-tags-holder').prepend(`<div class="manage-incidents-tag tag">${$(".tag-incident-input").text()}</div>`);
            if ($(".manage-incidents-tags-add-btn").hasClass("fa-minus")) {
                $(".manage-incidents-tags-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
            $(".tag-incident-input").remove()
        }
    });
    
    $(".manage-incidents-officeun-add-btn").click(function () {
        IncidentSearchType = "officer"
        document.addEventListener('mouseup', onMouseDownIcidents);
        $(".icidents-person-search-container").fadeIn(250)
        $(".close-all").css("filter", "brightness(15%)");
    });

    $(".manage-incidents-officeun-holder").on("keydown", ".officeun-incident-input", function (e) {
        if (e.keyCode === 13) {
            $('.manage-incidents-officeun-holder').prepend(`<div class="manage-incidents-officers">${$(".officeun-incident-input").text()}</div>`);
            // Have it save instantly if it's an existing report.
            if ($(".manage-incidents-officeun-add-btn").hasClass("fa-minus")) {
                $(".manage-incidents-officeun-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
            $(".officeun-incident-input").remove()
        }
    });

    $(".manage-incidents-civilians-add-btn").click(function () {
        IncidentSearchType = "civilian"
        document.addEventListener('mouseup', onMouseDownIcidents);
        $(".icidents-person-search-container").fadeIn(250)
        $(".close-all").css("filter", "brightness(15%)");
    });

    $(".manage-incidents-civilians-holder").on("keydown", ".civilians-incident-input", function (e) {
        if (e.keyCode === 13) {
            $('.manage-incidents-civilians-holder').prepend(`<div class="manage-incidents-civilians">${$(".civilians-incident-input").text()}</div>`);
            // Have it save instantly if it's an existing report.
            if ($(".manage-incidents-civilians-add-btn").hasClass("fa-minus")) {
                $(".manage-incidents-civilians-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
            $(".civilians-incident-input").remove()
        }
    });

    $(".manage-incidents-evidence-add-btn").click(function () {
        if ($(".incidents-upload-input").css("display") == "none") {
            $(".incidents-upload-input").slideDown(250);
            $(".incidents-upload-input").css("display", "block")
            $(this).removeClass('fa-plus').addClass('fa-minus');
        } else {
            $(".incidents-upload-input").slideUp(250);
            setTimeout(() => {
                $(".incidents-upload-input").css("display", "none")
            }, 250);
            $(this).removeClass('fa-minus').addClass('fa-plus');
        }
    });

    $('#incidents-upload-input').keydown(function (e) {
        if (e.keyCode === 13) {
            let URL = $("#incidents-upload-input").val();
            let cid = $(".manage-profile-citizenid-input").val();
            if (URL !== "") {
                let randomNum = Math.ceil(Math.random() * 10).toString()
                $('.manage-incidents-evidence-holder').prepend(`<img src="${URL}" class="incidents-img ${randomNum}" onerror="this.src='https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg'">`);
                $("#incidents-upload-input").val("");
                $(".incidents-upload-input").slideUp(250);
                setTimeout(() => {
                    $(".incidents-upload-input").css("display", "none")
                }, 250);
                $(".manage-incidents-evidence-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
        }
    });

    $(".manage-incidents-evidence-holder").on("click", ".incidents-img", function () {
        if ($(this).css("filter") == "none") {
            $(this).css("filter", "blur(5px)");
        } else {
            $(this).css("filter", "none");
        }
    })

    $(".manage-bolos-title-holder").on("click", ".manage-bolos-new", function () {
        //if ($(".manage-bolos-editing-title").html() == 'You are currently creating a new BOLO') {
            //$(".manage-bolos-new").effect("shake", { times: 2, distance: 2 }, 500)
        //} else {
            var template = "";
            if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
                template = "ICU Room #: [ # ]\n\nReport ID: [ Report ID ]\n\nTime Admitted: [ Date and Time Here ]\n\nSurgery: [Yes/No]\n\nInjuries/Ailments:\n - [ Enter List Of Injuries Here ]\n\n\nAdditional Attending:\n - [ List Any Other Staff Here ]\n\n\n🧑‍🤝‍🧑 Additonal Emergency Contacts:\n - [ Name And Number ]\n\n\nNotes:\n[Additional Notes Here]"
            }
            $(".manage-bolos-editing-title").html("You are currently creating a new BOLO")
            $(".manage-bolos-input-title").val('');
            $(".manage-bolos-input-plate").val('');
            $(".manage-bolos-input-owner").val('');
            $(".manage-bolos-input-individual").val('');
            $(".manage-bolos-reports-content").val(template);
            $(".manage-bolos-tags-holder").empty();
            $(".bolo-gallery-inner-container").empty();
            $(".manage-officeun-tags-holder").empty();

            if ($(".manage-bolos-tags-add-btn").hasClass("fa-minus")) { $(".manage-bolos-tags-add-btn").removeClass('fa-minus').addClass('fa-plus'); }
            if ($(".bolo-gallery-add-btn").hasClass("fa-minus")) { $(".bolo-gallery-add-btn").removeClass('fa-minus').addClass('fa-plus'); }
            if ($(".officeun-add-btn").hasClass("fa-minus")) { $(".officeun-add-btn").removeClass('fa-minus').addClass('fa-plus'); }

            if ($(".bolo-gallery-upload-input").css("display") == "block") {
                $(".bolo-gallery-upload-input").slideUp(250);
                setTimeout(() => {
                    $(".bolo-gallery-upload-input").css("display", "none")
                }, 250);
            }

            canInputTag = true
            canInputBoloTag = true
            canInputBoloOfficerTag = true

            $(".tag-bolo-input").remove()
            canInputBoloTag = true

        //}
    })

    $(".manage-bolos-title-holder").on("click", ".manage-bolos-save", function () {
        let existing = !($(".manage-bolos-editing-title").html() == 'You are currently creating a new BOLO')
        let id = $(".manage-bolos-editing-title").data("id");
        let title = $("#bolotitle").val()
        let plate = $("#boloplate").val()
        let owner = $("#boloowner").val()
        let individual = $("#boloindividual").val()
        let detail = $("#bolodetail").val();
        
        let tags = new Array()
        let gallery = new Array()
        let officers = new Array()

        $(".manage-bolos-tags-holder").each(function( index ) {
            if ($(this).text() != "") {
                tags.push($(this).text())
            }
            
        });

        $(".bolo-gallery-inner-container").find('img').each(function(){
            if ($(this).attr("src") != "") { gallery.push($(this).attr("src")) }
        });

        $(".manage-officeun-tags-holder").each(function( index ) {
            if ($(this).text() != "") {
                officers.push($(this).text())
            }
        });

        let time = new Date()

        $.post(`https://${GetParentResourceName()}/newBolo`, JSON.stringify({
            existing: existing,
            id: id,
            title: title,
            plate: plate,
            owner: owner,
            individual: individual,
            detail: detail,
            tags: tags,
            gallery: gallery,
            officers: officers,
            time: time.getTime()
        }));
    })

    $(".manage-incidents-evidence-holder").on("contextmenu", ".incidents-img", function (e) {
        let args = [
            {
                "className": "remove-image-incident",
                "icon": "fas fa-times",
                "text": "Remove Image",
                "info": $(this).attr("src"),
                "status": ""
            },
            {
                "className": "expand-image",
                "icon": "fas fa-expand",
                "text": "Expand Image",
                "info": $(this).attr("src"),
                "status": $(this).css("filter")
            },
        ]
        openContextMenu(e, args);
    })

    $(".bolos-search-title").click(function () {
        if (canSearchForProfiles == true) {
            if ($(".bolos-search-input").css("display") == "none") {
                $(".bolos-search-input").slideDown(250);
                $(".bolos-search-input").css("display", "block")
            } else {
                $(".bolos-search-input").slideUp(250);
                setTimeout(() => {
                    $(".bolos-search-input").css("display", "none")
                }, 250);
            }
        }
    });

    $('#bolos-search-input').keydown(function (e) {
        if (e.keyCode === 13 && canSearchForProfiles == true) {
            let searchVal = $("#bolos-search-input").val()
            if (searchVal !== "") {
                canSearchForProfiles = false
                $.post(`https://${GetParentResourceName()}/searchBolos`, JSON.stringify({
                    searchVal: searchVal
                }));
                $(".bolos-items").empty();
                $('.bolos-items').prepend(`<div class="profile-loader"></div>`);
            }
        }
    });

    $(".bolos-search-refresh").click(function () {
        if (canRefreshBolo == true) {
            canRefreshBolo = false
            $(".bolos-search-refresh").empty();
            $('.bolos-search-refresh').prepend(`<span class="fas fa-spinner fa-spin"></span>`);
            setTimeout(() => {
                $(".bolos-search-refresh").empty();
                $(".bolos-search-refresh").html("Refresh");
                canRefreshBolo = true
                $.post(`https://${GetParentResourceName()}/getAllBolos`, JSON.stringify({}));
            }, 1500);
        }
    });

    $(".manage-bolos-tags-add-btn").click(function () {
        if (canInputBoloTag) {
            $(this).removeClass('fa-plus').addClass('fa-minus');
            $('.manage-bolos-tags-holder').prepend(`<span contenteditable="true" class="tag-bolo-input"></span>`);
            canInputBoloTag = false
        } else if (!canInputBoloTag) {
            $(this).removeClass('fa-minus').addClass('fa-plus');
            $(".tag-bolo-input").remove()
            canInputBoloTag = true
        }
    });

    $(".manage-bolos-tags-holder").on("keydown", ".tag-bolo-input", function (e) {
        if (e.keyCode === 13) {
            $('.manage-bolos-tags-holder').prepend(`<div class="tag">${$(".tag-bolo-input").text()}</div>`);
            // Have it save instantly if it's an existing report.
            if ($(".manage-bolos-tags-add-btn").hasClass("fa-minus")) {
                $(".manage-bolos-tags-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
            $(".tag-bolo-input").remove()
            canInputBoloTag = true
        }
    });

    $(".bolo-gallery-add-btn").click(function () {
        //if ($(".manage-profile-citizenid-input").val()) {
            if ($(".bolo-gallery-upload-input").css("display") == "none") {
                $(".bolo-gallery-upload-input").slideDown(250);
                $(".bolo-gallery-upload-input").css("display", "block")
                $(this).removeClass('fa-plus').addClass('fa-minus');
            } else {
                $(".bolo-gallery-upload-input").slideUp(250);
                setTimeout(() => {
                    $(".bolo-gallery-upload-input").css("display", "none")
                }, 250);
                $(this).removeClass('fa-minus').addClass('fa-plus');
            }
        //} else {
           // $(this).effect("shake", { times: 2, distance: 2 }, 500)
       // }
    });

    $('#bolo-gallery-upload-input').keydown(function (e) {
        if (e.keyCode === 13) {
            let URL = $("#bolo-gallery-upload-input").val();
            let cid = $(".manage-profile-citizenid-input").val();
            if (URL !== "") {
                let randomNum = Math.ceil(Math.random() * 10).toString()
                $('.bolo-gallery-inner-container').prepend(`<img src="${URL}" class="bolo-img ${randomNum}" onerror="this.src='https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg'">`);
                $("#bolo-gallery-upload-input").val("");
                $(".bolo-gallery-upload-input").slideUp(250);
                setTimeout(() => {
                    $(".bolo-gallery-upload-input").css("display", "none")
                }, 250);
                $(".bolo-gallery-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
        }
    });

    $(".bolos-items").on("click", ".bolo-item", function () {
        if ($(".manage-bolos-tags-add-btn").hasClass("fa-minus")) { $(".manage-bolos-tags-add-btn").removeClass('fa-minus').addClass('fa-plus'); }
        if ($(".bolo-gallery-add-btn").hasClass("fa-minus")) { $(".bolo-gallery-add-btn").removeClass('fa-minus').addClass('fa-plus'); }
        if ($(".officeun-add-btn").hasClass("fa-minus")) { $(".officeun-add-btn").removeClass('fa-minus').addClass('fa-plus'); }

        if ($(".bolo-gallery-upload-input").css("display") == "block") {
            $(".bolo-gallery-upload-input").slideUp(250);
            setTimeout(() => {
                $(".bolo-gallery-upload-input").css("display", "none")
            }, 250);
        }
        
        canInputTag = true
        canInputBoloTag = true
        canInputBoloOfficerTag = true
        let id = $(this).data("id");
        $.post(`https://${GetParentResourceName()}/getBoloData`, JSON.stringify({
            id: id
        }));
    })

    $(".contextmenu").on("click", ".bolo-delete", function () { 
        
        if ($(this).data("info") != 0) {
            if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
                $(".bolos-items").find("[data-id='" + $(this).data("info") + "']").remove();
                $.post(`https://${GetParentResourceName()}/deleteICU`, JSON.stringify({
                id: $(this).data("info")
            }));
        }
        $(".bolos-items").find("[data-id='" + $(this).data("info") + "']").remove();
        $.post(`https://${GetParentResourceName()}/deleteBolo`, JSON.stringify({
            id: $(this).data("info"),
            time: new Date().getTime()
        }));
        }
        
    });

    $(".contextmenu").on("click", ".incident-delete", function () { 
        $(".incidents-items").find("[data-id='" + $(this).data("info") + "']").remove();
        $.post(`https://${GetParentResourceName()}/deleteIncident`, JSON.stringify({
            id: $(this).data("info"),
            time: new Date().getTime()
        }));
    });

    $(".contextmenu").on("click", ".missing-delete", function () { 
        $(".missing-items").find("[data-id='" + $(this).data("info") + "']").remove();
        $.post(`https://${GetParentResourceName()}/deleteMissing`, JSON.stringify({
            id: $(this).data("info"),
            time: new Date().getTime()
        }));
    });


    $(".contextmenu").on("click", ".profile-jail", function () { 
        $(".jail-container").fadeIn(0)
        $(".jail-inner-container").slideDown(500)
        $(".jail-inner-container").fadeIn(500)
        $(".jail-container").data("id", $(this).data("info"))
    });

    $(".contextmenu").on("click", ".profile-missing", function () { 
        $.post(`https://${GetParentResourceName()}/missingCitizen`, JSON.stringify({
            cid: $(this).data("info"),
            bool: new Date().getTime()
        }));
    });

    $(".contextmenu").on("click", ".report-delete", function () { 
        $(".reports-items").find("[data-id='" + $(this).data("info") + "']").remove();
        $.post(`https://${GetParentResourceName()}/deleteReport`, JSON.stringify({
            id: $(this).data("info"),
            time: new Date().getTime()
        }));
    });

    $(".incidents-items").on("contextmenu", ".incidents-item", function (e) {
        var args = ""
        args = [
            {
                "className": "incident-delete",
                "icon": "fas fa-times",
                "text": "Delete Incident",
                "info": $(this).data("id"),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    })

    $(".missing-items").on("contextmenu", ".missing-item", function (e) {
        var args = ""
        args = [
            {
                "className": "missing-delete",
                "icon": "fas fa-times",
                "text": "Remove",
                "info": $(this).data("dbid"),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    })

    $(".reports-items").on("contextmenu", ".reports-item", function (e) {
        var args = ""
        args = [
            {
                "className": "report-delete",
                "icon": "fas fa-times",
                "text": "Delete Report",
                "info": $(this).data("id"),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    })

    $(".bolos-items").on("contextmenu", ".bolo-item", function (e) {
        var args = ""
        args = [
            {
                "className": "bolo-delete",
                "icon": "fas fa-times",
                "text": "Delete Bolo",
                "info": $(this).data("id"),
                "status": ""
            },
        ]
        if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
            args = [
                {
                    "className": "bolo-delete",
                    "icon": "fas fa-times",
                    "text": "Delete Check-In",
                    "info": $(this).data("id"),
                    "status": ""
                },
            ]}
        openContextMenu(e, args);
    })
    $(".incidents-ghost-holder").on("contextmenu", ".associated-incidents-user-holder", function (e) {
        let args = [
            {
                "className": "add-charge",
                "icon": "fas fa-check",
                "text": "Add Charge",
                "info": $(this).data("name"),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    })    
    $(".contextmenu").on("click", ".add-charge", function () { 
        let stupidasscid = $(this).data("info")
        $(".incidents-charges-table").slideDown(500);
        $(".incidents-charges-table").fadeIn(500);
        $("#current-charges-holder").data("cid", $(this).data("info"));
        $("#current-charges-holder").html("")
        $(".associated-incidents-user-holder").children('div').each(function(index) {
            if ($(".associated-incidents-user-holder").children().eq(index).data("id") == stupidasscid) {
                const randomNum = Math.ceil(Math.random() * 1000).toString()
                $("#current-charges-holder").prepend(`<div class="current-charges-tag" data-link="${randomNum}">${$(".associated-incidents-user-holder").children().eq(index).html()}</div>`)
            }            
        });
        setTimeout(() => {
            $(".close-all").css("filter", "brightness(30%)");
        }, 250);
        $.post(`https://${GetParentResourceName()}/getPenalCode`, JSON.stringify({}));
    });

    var shiftPressed = false;
    $(document).keydown(function(event) {
        shiftPressed = event.keyCode==16;
    });
    $(document).keyup(function(event) {
        if( event.keyCode==16 ){ shiftPressed = false; }
    });


    $(".offenses-main-container").on("mousedown", ".offense-item", function (e) {
        const cid = $("#current-charges-holder").data("cid")
        const newItem = $(this).find(".offense-item-offense").html()
        const Fine = +$(this).data("fine")
        const Sentence = +$(this).data("sentence")
        if (e.which == 1) {
            let randomNum = Math.ceil(Math.random() * 1000).toString()
            $(`[data-name="${cid}"]`).prepend(`<div class="white-tag" data-link="${randomNum}" data-id="${cid}">${$(this).find(".offense-item-offense").html()}</div>`);
            $("#current-charges-holder").prepend(`<div class="current-charges-tag" data-link="${randomNum}">${$(this).find(".offense-item-offense").html()}</div>`)

            const CurrRfine = $(".fine-recommended-amount").val()
            const NewFine = +CurrRfine + +Fine
            $(".fine-recommended-amount").val(NewFine)
            const CurrRsentence = $(".sentence-recommended-amount").val()
            const NewSentence = +CurrRsentence + +Sentence
            $(".sentence-recommended-amount").val(NewSentence)

        } else if (e.which == 3) {
            $(".associated-incidents-user-holder").children('div').each(function(index) {
                if ($(".associated-incidents-user-holder").children().eq(index).data("id") == cid) {
                    if ($(".associated-incidents-user-holder").children().eq(index).html() == newItem) {
                        const linkedId = $(".associated-incidents-user-holder").children().eq(index).data("link")
                        //$(".current-charges-tag").filter(`[data-link="${linkedId}"]`).remove()
                        $(".white-tag").filter(`[data-link="${linkedId}"]`).remove()

                        var stop = false

                        $("#current-charges-holder").children('div').each(function(index) {
                            if (stop == false) {
                                if ($("#current-charges-holder").children().eq(index).html() == newItem) {
                                    const linkedId = $("#current-charges-holder").children().eq(index).data("link")
                                    $(".current-charges-tag").filter(`[data-link="${linkedId}"]`).remove()
                                    stop = true
                                }
                            }
                        })

                        const CurrRfine = $(".fine-recommended-amount").val()
                        const NewFine = +CurrRfine - Fine
                        $(".fine-recommended-amount").val(NewFine)
                        //
                        const CurrRsentence = $(".sentence-recommended-amount").val()
                        const NewSentence = +CurrRsentence - +Sentence
                        $(".sentence-recommended-amount").val(NewSentence)

                        return false;
                    }
                }
            })
        }
    })

    $(".bolo-gallery-inner-container").on("click", ".bolo-img", function () {
        if ($(this).css("filter") == "none") {
            $(this).css("filter", "blur(5px)");
        } else {
            $(this).css("filter", "none");
        }
    })
    $(".contextmenu").on("click", ".bolo-remove-image", function () { $(".bolo-gallery-inner-container img").filter("[src='" + $(this).data("info") + "']").remove(); });
    $(".bolo-gallery-inner-container").on("contextmenu", ".bolo-img", function (e) {
        let args = [
            {
                "className": "bolo-remove-image",
                "icon": "fas fa-times",
                "text": "Remove Image",
                "info": $(this).attr("src"),
                "status": ""
            },
            {
                "className": "expand-image",
                "icon": "fas fa-expand",
                "text": "Expand Image",
                "info": $(this).attr("src"),
                "status": $(this).css("filter")
            },
        ]
        openContextMenu(e, args);
    })

    $(".officeun-add-btn").click(function () {
        IncidentSearchType = "bolos_officer"
        document.addEventListener('mouseup', onMouseDownIcidents);
        $(".icidents-person-search-container").fadeIn(250)
        $(".close-all").css("filter", "brightness(15%)");
    });

    $(".manage-officeun-tags-holder").on("keydown", ".officer-tag-bolo-input", function (e) {
        if (e.keyCode === 13) {
            $('.manage-officeun-tags-holder').prepend(`<div class="manage-bolos-officers">${$(".officer-tag-bolo-input").text()}</div>`);
            // Have it save instantly if it's an existing report.
            if ($(".officeun-add-btn").hasClass("fa-minus")) {
                canInputBoloOfficerTag = true
                $(".officeun-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
            canInputBoloOfficerTag = true
            $(".officer-tag-bolo-input").remove()
        }
    });
    $(".incidents-ghost-holder").on("click", ".associated-incidents-user-tag", function() {
        if ($(this).hasClass("red-tag")) {
            $(this).removeClass("red-tag");
            $(this).addClass("green-tag");
            if ($(this).text() == 'Associated') {
                $(".associated-incidents-user-holder").filter(`[data-name="${$(this).data("id")}"]`).css("display", "none")
                $(".associated-incidents-fine-input").filter(`[data-id="${$(this).data("id")}"]`).css("display", "none")
                $(".manage-incidents-title-tag").filter(`[data-id="${$(this).data("id")}"]`).css("display", "none")
                $(".associated-incidents-sentence-input").filter(`[data-id="${$(this).data("id")}"]`).css("display", "none")
            }
        } else {
            $(this).removeClass("green-tag");
            $(this).addClass("red-tag");
            if ($(this).text() == 'Associated') {
                $(".associated-incidents-user-holder").filter(`[data-name="${$(this).data("id")}"]`).fadeIn(100)
                $(".associated-incidents-fine-input").filter(`[data-id="${$(this).data("id")}"]`).fadeIn(100)
                $(".manage-incidents-title-tag").filter(`[data-id="${$(this).data("id")}"]`).fadeIn(100)
                $(".associated-incidents-sentence-input").filter(`[data-id="${$(this).data("id")}"]`).fadeIn(100)
            }
        }
    });
    $(".contextmenu").on("click", ".associated-incidents-remove-tag", function () { 
        $(`.associated-incidents-tag:contains(${$(this).data("info")})`).remove();
        $(`.associated-incidents-user-title:contains(${$(this).data("info")})`).parent().remove();
        const incidentId = $(".manage-incidents-editing-title").data("id")
        if (incidentId != 0) {
            $.post(`https://${GetParentResourceName()}/removeIncidentCriminal`, JSON.stringify({
                cid: $(this).data("status"),
                incidentId: incidentId
            }));
        }
    });
    $(".associated-incidents-tags-holder").on("contextmenu", ".associated-incidents-tag", function(e) {
        let args = [
            {
                "className": "associated-incidents-remove-tag",
                "icon": "fas fa-times",
                "text": "Remove Tag",
                "info": $(this).html(),
                "status": $(this).data("id")
            },
        ]
        openContextMenu(e, args);
    });
    $(".icidents-person-search-holder").on("click", ".icidents-person-search-item", function () {
        if (IncidentSearchType == "person") {
            $(".icidents-person-search-container").fadeOut(250);
            $(".close-all").css("filter", "none");
            $(".associated-incidents-tags-holder").prepend(
                `<div class="associated-incidents-tag" data-id="${$(this).data("id")}">${$(this).data("name")}</div>`
            );
            if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
                $(".incidents-ghost-holder").prepend(
                    `
                    <div class="associated-incidents-user-container" data-id="${$(this).data("cid")}">
                        <div class="associated-incidents-user-title">${$(this).data("info")}</div>
                        <div class="associated-incidents-user-tags-holder">
                            <div class="associated-incidents-user-tag red-tag" data-id="${$(this).data("cid")}">Processed</div>
                            <div class="associated-incidents-user-tag red-tag" data-id="${$(this).data("cid")}">Associated</div>
                        </div>
                        <div class="associated-incidents-user-holder" data-name="${$(this).data("cid")}">
                        </div>
                        <div class="manage-incidents-title-tag" data-id="${$(this).data("cid")}">Recommended Fine</div>
                        <div class="associated-incidents-fine-input" data-id="${$(this).data("cid")}"><img src="https://i.imgur.com/h7S5f9J.png"> <input disabled placeholder="0" class="fine-recommended-amount" id="fine-recommended-amount" data-id="${$(this).data("cid")}" type="number"></div>
                        <div class="manage-incidents-title-tag" data-id="${$(this).data("cid")}">Fine</div>
                        <div class="associated-incidents-fine-input" data-id="${$(this).data("cid")}"><img src="https://i.imgur.com/h7S5f9J.png"> <input placeholder="Enter fine here..." value="0" class="fine-amount" data-id="${$(this).data("cid")}" type="number"></div>
                    </div>
                    `
                );
            } else {
                $(".incidents-ghost-holder").prepend(
                    `
                    <div class="associated-incidents-user-container" data-id="${$(this).data("cid")}">
                        <div class="associated-incidents-user-title">${$(this).data("info")}</div>
                        <div class="associated-incidents-user-tags-holder">
                            <div class="associated-incidents-user-tag red-tag" data-id="${$(this).data("cid")}">Warrant</div>
                            <div class="associated-incidents-user-tag red-tag" data-id="${$(this).data("cid")}">Guilty</div>
                            <div class="associated-incidents-user-tag red-tag" data-id="${$(this).data("cid")}">Processed</div>
                            <div class="associated-incidents-user-tag red-tag" data-id="${$(this).data("cid")}">Associated</div>
                        </div>
                        <div class="associated-incidents-user-holder" data-name="${$(this).data("cid")}">
                        </div>
                        <div class="manage-incidents-title-tag" data-id="${$(this).data("cid")}">Recommended Fine</div>
                        <div class="associated-incidents-fine-input" data-id="${$(this).data("cid")}"><img src="https://i.imgur.com/h7S5f9J.png"> <input disabled placeholder="0" class="fine-recommended-amount" id="fine-recommended-amount" data-id="${$(this).data("cid")}" type="number"></div>
                        <div class="manage-incidents-title-tag" data-id="${$(this).data("cid")}">Recommended Sentence</div>
                        <div class="associated-incidents-sentence-input" data-id="${$(this).data("cid")}"><img src="https://i.imgur.com/9Xn6xXK.png"> <input disabled placeholder="0" class="sentence-recommended-amount" id="sentence-recommended-amount" data-id="${$(this).data("cid")}" type="number"></div>
                        <div class="manage-incidents-title-tag" data-id="${$(this).data("cid")}">Fine</div>
                        <div class="associated-incidents-fine-input" data-id="${$(this).data("cid")}"><img src="https://i.imgur.com/h7S5f9J.png"> <input placeholder="Enter fine here..." value="0" class="fine-amount" data-id="${$(this).data("cid")}" type="number"></div>
                        <div class="manage-incidents-title-tag" data-id="${$(this).data("cid")}">Sentence</div>
                        <div class="associated-incidents-sentence-input" data-id="${$(this).data("cid")}"><img src="https://i.imgur.com/9Xn6xXK.png"> <input placeholder="Enter months here..." value="0" class="sentence-amount" data-id="${$(this).data("cid")}" type="number"></div>
                    </div>
                    `
                );
            }
        } else if (IncidentSearchType == "officer") {
            $(".icidents-person-search-container").fadeOut(250);
            $(".close-all").css("filter", "none");
            $(".manage-incidents-officeun-holder").append(`<div class="manage-incidents-officers">${$(this).data("name")}</div>`);
        } else if (IncidentSearchType == "civilian") {
            $(".icidents-person-search-container").fadeOut(250);
            $(".close-all").css("filter", "none");
            $(".manage-incidents-civilians-holder").append(`<div class="manage-incidents-civilians">${$(this).data("name")}</div>`);
        } else if (IncidentSearchType == "reports_officer") {
            $(".icidents-person-search-container").fadeOut(250);
            $(".close-all").css("filter", "none");
            $('.reports-officeun-tags-holder').append(`<div class="manage-reports-officers">${$(this).data("name")}</div>`);
        } else if (IncidentSearchType == "reports_civilian") {
            $(".icidents-person-search-container").fadeOut(250);
            $(".close-all").css("filter", "none");
            $('.reports-civilians-tags-holder').append(`<div class="manage-reports-civilians">${$(this).data("name")}</div>`);
        } else if (IncidentSearchType == "bolos_officer") {
            $(".icidents-person-search-container").fadeOut(250);
            $(".close-all").css("filter", "none");
            $('.manage-officeun-tags-holder').append(`<div class="manage-bolos-officers">${$(this).data("name")}</div>`);
        }
    });

    $(".contextmenu").on("click", ".incidents-remove-tag", function () { 
        $(`.tag:contains(${$(this).data("info")})`).remove()
    });
    $(".manage-incidents-tags-holder").on("contextmenu", ".tag", function (e) {
        let args = [
            {
                "className": "incidents-remove-tag",
                "icon": "fas fa-times",
                "text": "Remove Tag",
                "info": $(this).html(),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    });

    $(".contextmenu").on("click", ".incidents-remove-officer-tag", function () { 
        $(`.manage-incidents-officers:contains(${$(this).data("info")})`).remove()
    });
    $(".manage-incidents-officeun-holder").on("contextmenu", ".manage-incidents-officers", function (e) {
        let args = [
            {
                "className": "incidents-remove-officer-tag",
                "icon": "fas fa-times",
                "text": "Remove Tag",
                "info": $(this).html(),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    });

    $(".contextmenu").on("click", ".incidents-remove-civ-tag", function () { 
        $(`.manage-incidents-civilians:contains(${$(this).data("info")})`).remove()
    });
    $(".manage-incidents-civilians-holder").on("contextmenu", ".manage-incidents-civilians", function (e) {
        let args = [
            {
                "className": "incidents-remove-civ-tag",
                "icon": "fas fa-times",
                "text": "Remove Tag",
                "info": $(this).html(),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    });

    $(".contextmenu").on("click", ".reports-remove-civ-tag", function () { 
        $(`.manage-reports-civilians:contains(${$(this).data("info")})`).remove()
    });
    $(".reports-civilians-tags-holder").on("contextmenu", ".manage-reports-civilians", function (e) {
        let args = [
            {
                "className": "reports-remove-civ-tag",
                "icon": "fas fa-times",
                "text": "Remove Tag",
                "info": $(this).html(),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    });

    $(".contextmenu").on("click", ".bolos-remove-officer-tag", function () { 
        $(`.manage-bolos-officers:contains(${$(this).data("info")})`).remove()
    });
    $(".manage-officeun-tags-holder").on("contextmenu", ".manage-bolos-officers", function (e) {
        let args = [
            {
                "className": "bolos-remove-officer-tag",
                "icon": "fas fa-times",
                "text": "Remove Tag",
                "info": $(this).html(),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    });

    $(".contextmenu").on("click", ".bolos-remove-tags-tag", function () { 
        $(`.tag-bolo-input:contains(${$(this).data("info")})`).remove()
    });
    $(".manage-bolos-tags-holder").on("contextmenu", ".tag-bolo-input", function (e) {
        let args = [
            {
                "className": "bolos-remove-tags-tag",
                "icon": "fas fa-times",
                "text": "Remove Tag",
                "info": $(this).html(),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    });

    $(".contextmenu").on("click", ".reports-remove-tags-tag", function () { 
        $(`.manage-reports-tags:contains(${$(this).data("info")})`).remove()
    });
    $(".manage-reports-tags-holder").on("contextmenu", ".manage-reports-tags", function (e) {
        let args = [
            {
                "className": "reports-remove-tags-tag",
                "icon": "fas fa-times",
                "text": "Remove Tag",
                "info": $(this).html(),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    });

    $(".contextmenu").on("click", ".reports-remove-officer-tag", function () { 
        $(`.manage-reports-officers:contains(${$(this).data("info")})`).remove()
    });
    $(".reports-officeun-tags-holder").on("contextmenu", ".manage-reports-officers", function (e) {
        let args = [
            {
                "className": "reports-remove-officer-tag",
                "icon": "fas fa-times",
                "text": "Remove Tag",
                "info": $(this).html(),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    });

    $(".incidents-search-refresh").click(function () {
        if (canRefreshIncidents == true) {
            canRefreshIncidents = false
            $(".incidents-search-refresh").empty();
            $('.incidents-search-refresh').prepend(`<span class="fas fa-spinner fa-spin"></span>`);
            setTimeout(() => {
                $(".incidents-search-refresh").empty();
                $(".incidents-search-refresh").html("Refresh");
                canRefreshIncidents = true
                $.post(`https://${GetParentResourceName()}/getAllIncidents`, JSON.stringify({}));
            }, 1500);
        }
    });

    $(".contextmenu").on("click", ".incidents-remove-normal-tag", function () { 
        $(`.tag:contains(${$(this).data("info")})`).remove()
        let cid = $(".manage-profile-citizenid-input").val();
        if (cid) {
            $.post(`https://${GetParentResourceName()}/removeProfileTag`, JSON.stringify({
                cid: cid,
                text: $(this).data("info")
            }));
        }
    });
    $(".tags-holder").on("contextmenu", ".tag", function (e) {
        let args = [
            {
                "className": "incidents-remove-normal-tag",
                "icon": "fas fa-times",
                "text": "Remove Tag",
                "info": $(this).html(),
                "status": ""
            },
        ]
        openContextMenu(e, args);
    });
    $(".reports-search-title").click(function () {
        if (canSearchReports == true) {
            if ($(".reports-search-input").css("display") == "none") {
                $(".reports-search-input").slideDown(250);
                $(".reports-search-input").css("display", "block")
            } else {
                $(".reports-search-input").slideUp(250);
                setTimeout(() => {
                    $(".reports-search-input").css("display", "none")
                }, 250);
            }
        }
    });
    $('.icidents-person-search-container').hover(function(){ 
        mouse_is_inside=true; 
    }, function(){ 
        mouse_is_inside=false; 
    });
    $(".reports-search-refresh").click(function () {
        if (canRefreshReports == true) {
            canRefreshReports = false
            $(".reports-search-refresh").empty();
            $('.reports-search-refresh').prepend(`<span class="fas fa-spinner fa-spin"></span>`);
            setTimeout(() => {
                $(".reports-search-refresh").empty();
                $(".reports-search-refresh").html("Refresh");
                canRefreshReports = true
                $.post(`https://${GetParentResourceName()}/getAllReports`, JSON.stringify({}));
            }, 1500);
        }
    });
    $(".dispatch-comms-refresh").click(function(){
        $(".dispatch-comms-refresh").empty();
        $('.dispatch-comms-refresh').prepend(`<span class="fas fa-spinner fa-spin"></span>`);
        setTimeout(() => {
            $(".dispatch-comms-refresh").empty();
            $(".dispatch-comms-refresh").html("Refresh");
            canRefreshReports = true
            $.post(`https://${GetParentResourceName()}/refreshDispatchMsgs`, JSON.stringify({}));
        }, 1500);
    })
    $(".reports-items").on("click", ".reports-item", function () {

        if (currentTab != ".reports-page-container") {
            fidgetSpinner(".reports-page-container");
            currentTab = ".reports-page-container";
        }

        if ($(".manage-reports-tags-add-btn").hasClass("fa-minus")) { $(".manage-reports-tags-add-btn").removeClass('fa-minus').addClass('fa-plus'); }
        if ($(".reports-gallery-add-btn").hasClass("fa-minus")) { $(".reports-gallery-add-btn").removeClass('fa-minus').addClass('fa-plus'); }
        if ($(".reports-officeun-add-btn").hasClass("fa-minus")) { $(".reports-officeun-add-btn").removeClass('fa-minus').addClass('fa-plus'); }

        if ($(".reports-gallery-upload-input").css("display") == "block") {
            $(".reports-gallery-upload-input").slideUp(250);
            setTimeout(() => {
                $(".reports-gallery-upload-input").css("display", "none")
            }, 250);
        }
        
        canInputTag = true
        canInputReportTag = true
        canInputReportOfficerTag = true
        let id = $(this).data("id");
        $.post(`https://${GetParentResourceName()}/getReportData`, JSON.stringify({
            id: id
        }));
    })

    $(".manage-reports-tags-add-btn").click(function () {
        if (canInputReportTag) {
            $(this).removeClass('fa-plus').addClass('fa-minus');
            $('.manage-reports-tags-holder').prepend(`<span contenteditable="true" class="tag-reports-input"></span>`);
            canInputReportTag = false
        } else if (!canInputReportTag) {
            $(this).removeClass('fa-minus').addClass('fa-plus');
            $(".tag-reports-input").remove()
            canInputReportTag = true
        }
    });

    $(".manage-reports-tags-holder").on("keydown", ".tag-reports-input", function (e) {
        if (e.keyCode === 13) {
            $('.manage-reports-tags-holder').prepend(`<div class="manage-reports-tags">${$(".tag-reports-input").text()}</div>`);
            // Have it save instantly if it's an existing report.
            if ($(".manage-reports-tags-add-btn").hasClass("fa-minus")) {
                $(".manage-reports-tags-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
            $(".tag-reports-input").remove()
            canInputReportTag = true
        }
    });

    $(".reports-gallery-add-btn").click(function () {
        //if ($(".manage-profile-citizenid-input").val()) {
            if ($(".reports-gallery-upload-input").css("display") == "none") {
                $(".reports-gallery-upload-input").slideDown(250);
                $(".reports-gallery-upload-input").css("display", "block")
                $(this).removeClass('fa-plus').addClass('fa-minus');
            } else {
                $(".reports-gallery-upload-input").slideUp(250);
                setTimeout(() => {
                    $(".reports-gallery-upload-input").css("display", "none")
                }, 250);
                $(this).removeClass('fa-minus').addClass('fa-plus');
            }
        //} else {
           // $(this).effect("shake", { times: 2, distance: 2 }, 500)
       // }
    });

    $('#reports-gallery-upload-input').keydown(function (e) {
        if (e.keyCode === 13) {
            let URL = $("#reports-gallery-upload-input").val();
            let cid = $(".manage-profile-citizenid-input").val();
            if (URL !== "") {
                let randomNum = Math.ceil(Math.random() * 10).toString()
                $('.reports-gallery-inner-container').prepend(`<img src="${URL}" class="reports-img ${randomNum}" onerror="this.src='https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg'">`);
                $("#reports-gallery-upload-input").val("");
                $(".reports-gallery-upload-input").slideUp(250);
                setTimeout(() => {
                    $(".reports-gallery-upload-input").css("display", "none")
                }, 250);
                $(".reports-gallery-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
        }
    });

    $(".reports-gallery-inner-container").on("click", ".reports-img", function () {
        if ($(this).css("filter") == "none") {
            $(this).css("filter", "blur(5px)");
        } else {
            $(this).css("filter", "none");
        }
    })
    $(".contextmenu").on("click", ".reports-remove-image", function () { $(".reports-gallery-inner-container img").filter("[src='" + $(this).data("info") + "']").remove(); });
    $(".reports-gallery-inner-container").on("contextmenu", ".reports-img", function (e) {
        let args = [
            {
                "className": "reports-remove-image",
                "icon": "fas fa-times",
                "text": "Remove Image",
                "info": $(this).attr("src"),
                "status": ""
            },
            {
                "className": "expand-image",
                "icon": "fas fa-expand",
                "text": "Expand Image",
                "info": $(this).attr("src"),
                "status": $(this).css("filter")
            },
        ]
        openContextMenu(e, args);
    })

    $(".reports-officeun-add-btn").click(function () {
        IncidentSearchType = "reports_officer"
        document.addEventListener('mouseup', onMouseDownIcidents);
        $(".icidents-person-search-container").fadeIn(250)
        $(".close-all").css("filter", "brightness(15%)");
    });

    $(".reports-officeun-tags-holder").on("keydown", ".officer-tag-reports-input", function (e) {
        if (e.keyCode === 13) {
            $('.reports-officeun-tags-holder').prepend(`<div class="manage-reports-officers">${$(".officer-tag-reports-input").text()}</div>`);
            // Have it save instantly if it's an existing report.
            if ($(".reports-officeun-add-btn").hasClass("fa-minus")) {
                canInputReportOfficerTag = true
                $(".reports-officeun-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
            canInputReportOfficerTag = true
            $(".officer-tag-reports-input").remove()
        }
    });

    $(".reports-civilians-add-btn").click(function () {
        IncidentSearchType = "reports_civilian"
        document.addEventListener('mouseup', onMouseDownIcidents);
        $(".icidents-person-search-container").fadeIn(250)
        $(".close-all").css("filter", "brightness(15%)");
    });

    $(".reports-civilians-tags-holder").on("keydown", ".civilian-tag-reports-input", function (e) {
        if (e.keyCode === 13) {
            $('.reports-civilians-tags-holder').prepend(`<div class="manage-reports-civilians">${$(".civilian-tag-reports-input").text()}</div>`);
            // Have it save instantly if it's an existing report.
            if ($(".reports-civilians-add-btn").hasClass("fa-minus")) {
                canInputReportCivilianTag = true
                $(".reports-civilians-add-btn").removeClass('fa-minus').addClass('fa-plus');
            }
            canInputReportCivilianTag = true
            $(".civilian-tag-reports-input").remove()
        }
    });

    $(".manage-reports-title-holder").on("click", ".manage-reports-new", function () {
        //if ($(".manage-bolos-editing-title").html() == 'You are currently creating a new BOLO') {
            //$(".manage-bolos-new").effect("shake", { times: 2, distance: 2 }, 500)
        //} else {
            $(".manage-reports-editing-title").html("You are currently creating a new report")
            $(".manage-reports-input-title").val('');
            $(".manage-reports-input-type").val('');
            $(".manage-reports-reports-content").val('');
            $(".manage-reports-tags-holder").empty();
            $(".reports-gallery-inner-container").empty();
            $(".reports-officeun-tags-holder").empty();
            $(".reports-civilians-tags-holder").empty();

            if ($(".manage-reports-tags-add-btn").hasClass("fa-minus")) { $(".manage-reports-tags-add-btn").removeClass('fa-minus').addClass('fa-plus'); }
            if ($(".reports-gallery-add-btn").hasClass("fa-minus")) { $(".reports-gallery-add-btn").removeClass('fa-minus').addClass('fa-plus'); }
            if ($(".officeun-add-btn").hasClass("fa-minus")) { $(".officeun-add-btn").removeClass('fa-minus').addClass('fa-plus'); }

            if ($(".reports-gallery-upload-input").css("display") == "block") {
                $(".reports-gallery-upload-input").slideUp(250);
                setTimeout(() => {
                    $(".reports-gallery-upload-input").css("display", "none")
                }, 250);
            }

            canInputTag = true
            canInputReportTag = true
            canInputReportOfficerTag = true

            $(".tag-reports-input").remove()
            canInputReportTag = true

        //}
    })

    $('#reports-search-input').keydown(function (e) {
        if (e.keyCode === 13 && canSearchForReports == true) {
            let name = $(this).val()
            if (name !== "") {
                canSearchForReports = false
                $.post(`https://${GetParentResourceName()}/searchReports`, JSON.stringify({
                    name: name
                }));
                $(".reports-items").empty();
                $('.reports-items').prepend(`<div class="profile-loader"></div>`);
            }
        }
    });

    $(".manage-reports-title-holder").on("click", ".manage-reports-save", function () {
        let existing = !($(".manage-reports-editing-title").html() == 'You are currently creating a new report')
        let id = $(".manage-reports-editing-title").data("id");
        let title = $("#reporttitle").val()
        let type = $("#reporttype").val()
        let detail = $("#reportdetail").val();
        let tags = new Array()
        let gallery = new Array()
        let officers = new Array()
        let civilians = new Array()

        $('.manage-reports-tags-holder').find('div').each(function(){
            if ($(this).text() != "") { tags.push($(this).text()) }
        });

        $(".reports-gallery-inner-container").find('img').each(function(){
            if ($(this).attr("src") != "") { gallery.push($(this).attr("src")) }
        });

        $(".reports-officeun-tags-holder").find('div').each(function(){
            if ($(this).text() != "") { officers.push($(this).text()) }
        });

        $(".reports-civilians-tags-holder").find('div').each(function(){
            if ($(this).text() != "") { civilians.push($(this).text()) }
        });

        let time = new Date()

        $.post(`https://${GetParentResourceName()}/newReport`, JSON.stringify({
            existing: existing,
            id: id,
            title: title,
            type: type,
            detail: detail,
            tags: tags,
            gallery: gallery,
            officers: officers,
            civilians: civilians,
            time: time.getTime()
        }));
    })

    $(".dmv-search-title").click(function () {
        if (canSearchForVehicles == true) {
            if ($(".dmv-search-input").css("display") == "none") {
                $(".dmv-search-input").slideDown(250);
                $(".dmv-search-input").css("display", "block")
            } else {
                $(".dmv-search-input").slideUp(250);
                setTimeout(() => {
                    $(".dmv-search-input").css("display", "none")
                }, 250);
            }
        }
    });

    $(".weapons-search-title").click(function () {
        if (canSearchForVehicles == true) {
            if ($(".weapons-search-input").css("display") == "none") {
                $(".weapons-search-input").slideDown(250);
                $(".weapons-search-input").css("display", "block")
            } else {
                $(".weapons-search-input").slideUp(250);
                setTimeout(() => {
                    $(".weapons-search-input").css("display", "none")
                }, 250);
            }
        }
    });

    $(".missing-search-title").click(function () {
        if (canSearchForVehicles == true) {
            if ($(".missing-search-input").css("display") == "none") {
                $(".missing-search-input").slideDown(250);
                $(".missing-search-input").css("display", "block")
            } else {
                $(".missing-search-input").slideUp(250);
                setTimeout(() => {
                    $(".missing-search-input").css("display", "none")
                }, 250);
            }
        }
    });

    $('#weapons-search-input').keydown(function (e) {
        if (e.keyCode === 13 && canSearchForVehicles == true) {
            let name = $("#weapons-search-input").val()
            if (name !== "") {
                canSearchForVehicles = false
                $.post(`https://${GetParentResourceName()}/searchWeapon`, JSON.stringify({
                    name: name
                }));
                $(".weapons-items").empty();
                $('.weapons-items').prepend(`<div class="profile-loader"></div>`);
            }
        }
    });

    $('#missing-search-input').keydown(function (e) {
        if (e.keyCode === 13) {
            let name = $("#missing-search-input").val()
            if (name !== "") {
                $.post(`https://${GetParentResourceName()}/searchMissing`, JSON.stringify({
                    name: name
                }));
                $(".missing-items").empty();
                $('.missing-items').prepend(`<div class="profile-loader"></div>`);
            }
        }
    });

    $('#dmv-search-input').keydown(function (e) {
        if (e.keyCode === 13 && canSearchForVehicles == true) {
            let name = $("#dmv-search-input").val()
            if (name !== "") {
                canSearchForVehicles = false
                $.post(`https://${GetParentResourceName()}/searchVehicles`, JSON.stringify({
                    name: name
                }));
                $(".dmv-items").empty();
                $('.dmv-items').prepend(`<div class="profile-loader"></div>`);
            }
        }
    });

    $(".dmv-items").on("click", ".dmv-item", function () {
        $.post(`https://${GetParentResourceName()}/getVehicleData`, JSON.stringify({
            plate: $(this).data("plate")
        }));
    });

    $(".weapons-items").on("click", ".weapon-item", function () {
        $.post(`https://${GetParentResourceName()}/getWeaponData`, JSON.stringify({
            serialnumber: $(this).data("plate")
        }));
    });

    $(".missing-items").on("click", ".missing-item", function () {
        $.post(`https://${GetParentResourceName()}/getMissingData`, JSON.stringify({
            id: $(this).data("dbid")
        }));
    });

    $(".vehicle-information-title-holder").on("click", ".vehicle-information-save", function () {
        if (canSaveVehicle) {
            canSaveVehicle = false
            $(".vehicle-information-save").empty();
            $('.vehicle-information-save').prepend(`<span class="fas fa-check"></span>`);
            setTimeout(() => {
                $(".vehicle-information-save").empty();
                $(".vehicle-information-save").html("Save");
                canSaveVehicle = true
            }, 750);
            setTimeout(() => {
                let dbid = $(".vehicle-information-title-holder").data("dbid")
                let plate = $(".vehicle-info-plate-input").val()
                let notes = $(".vehicle-info-content").val()

                let imageurl = $(".vehicle-info-image").attr("src");
                let newImageurl = $(".vehicle-info-imageurl-input").val()
                if (newImageurl.includes("base64")) {
                    imageurl = "https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg"
                } else {
                    imageurl = newImageurl
                }

                let code5 = false
                let code5Tag = $(".vehicle-tags").find(".code5-tag")
                if ( code5Tag.hasClass("green-tag")) {
                    code5 = true
                }

                let stolen = false
                let stolenTag = $(".vehicle-tags").find(".stolen-tag")
                if ( stolenTag.hasClass("green-tag")) {
                    stolen = true
                }

                $.post(`https://${GetParentResourceName()}/saveVehicleInfo`, JSON.stringify({
                    dbid: dbid,
                    plate: plate,
                    imageurl: imageurl,
                    notes: notes,
                    code5: code5,
                    stolen: stolen,
                }));

                $(".vehicle-info-image").attr("src", newImageurl);
            }, 250);
        }
    })

    $(".weapon-information-title-holder").on("click", ".weapon-information-save", function () {
        if (canSaveVehicle) {
            canSaveVehicle = false
            $(".weapon-information-save").empty();
            $('.weapon-information-save').prepend(`<span class="fas fa-check"></span>`);
            setTimeout(() => {
                $(".weapon-information-save").empty();
                $(".weapon-information-save").html("Save");
                canSaveVehicle = true
            }, 750);
            setTimeout(() => {
                let dbid = $(".weapon-information-title-holder").data("dbid")
                let serialnumber = $(".weapon-info-plate-input").val()
                let notes = $(".weapon-info-content").val()
                let brand = $(".weapon-info-class-input").val() 
                let type = $(".weapon-info-model-input").val() 
                let imageurl = $(".weapon-info-image").attr("src");
                let newImageurl = $(".weapon-info-imageurl-input").val()
                if (newImageurl.includes("base64")) {
                    imageurl = "https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg"
                } else {
                    imageurl = newImageurl
                }
                $.post(`https://${GetParentResourceName()}/saveWeaponInfo`, JSON.stringify({
                    dbid: dbid,
                    serialnumber: serialnumber,
                    imageurl: imageurl,
                    brand: brand,
                    type: type,
                    notes: notes
                }));
                $(".weapon-info-image").attr("src", newImageurl);
            }, 250);
        }
    })

    $(".missing-information-title-holder").on("click", ".missing-information-save", function () {
        if (canSaveVehicle) {
            canSaveVehicle = false
            $(".missing-information-save").empty();
            $('.missing-information-save').prepend(`<span class="fas fa-check"></span>`);
            setTimeout(() => {
                $(".missing-information-save").empty();
                $(".missing-information-save").html("Save");
                canSaveVehicle = true
            }, 750);
            setTimeout(() => {
                let dbid = $(".missing-information-title-holder").data("dbid")
                let notes = $(".missing-info-content").val()
                let imageurl = $(".missing-info-image").attr("src");
                let newImageurl = $(".missing-info-imageurl-input").val()
                if (newImageurl.includes("base64")) {
                    imageurl = "https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg"
                } else {
                    imageurl = newImageurl
                }
                $.post(`https://${GetParentResourceName()}/saveMissingInfo`, JSON.stringify({
                    id: dbid,
                    imageurl: imageurl,
                    notes: notes
                }));
                $(".weapon-info-image").attr("src", newImageurl);
            }, 250);
        }
    })

    $(".contextmenu").on("click", ".mark-code-5", function () { 
        let tag = $(".vehicle-tags").find(".code5-tag")
        if ( tag.hasClass("red-tag")) {
            tag.removeClass('red-tag').addClass('green-tag'); 
            $.post(`https://${GetParentResourceName()}/knownInformation`, JSON.stringify({
                dbid: $(".vehicle-information-title-holder").data("dbid"),
                type: "code5",
                status: true,
                plate: $(this).data("info")
            }));
        }
    });

    $(".contextmenu").on("click", ".remove-code-5", function () { 
        let tag = $(".vehicle-tags").find(".code5-tag")
        if ( tag.hasClass("green-tag")) {
            tag.removeClass('green-tag').addClass('red-tag'); 
            $.post(`https://${GetParentResourceName()}/knownInformation`, JSON.stringify({
                dbid: $(".vehicle-information-title-holder").data("dbid"),
                type: "code5",
                status: false,
                plate: $(this).data("info")
            }));
        }
    });

    $(".vehicle-tags").on("contextmenu", ".code5-tag", function (e) {
        let plate = $(".vehicle-info-plate-input").val()
        if (plate) {
            let args = []
            if ($(this).hasClass("red-tag")) {
                args = [
                    {
                        "className": "mark-code-5",
                        "icon": "fas fa-check",
                        "text": "Mark as Code 5",
                        "info": plate,
                        "status": ""
                    }
                ]
            } else {
                args = [
                    {
                        "className": "remove-code-5",
                        "icon": "fas fa-times",
                        "text": "Remove Code 5 Status",
                        "info": plate,
                        "status": ""
                    }
                ]
            }
            
            openContextMenu(e, args);
    
        }
    })

    $(".contextmenu").on("click", ".mark-stolen", function () { 
        let tag = $(".vehicle-tags").find(".stolen-tag")
        if ( tag.hasClass("red-tag")) {
            tag.removeClass('red-tag').addClass('green-tag'); 
            $.post(`https://${GetParentResourceName()}/knownInformation`, JSON.stringify({
                dbid: $(".vehicle-information-title-holder").data("dbid"),
                type: "stolen",
                status: true,
                plate: $(this).data("info")
            }));
        }
    });

    $(".contextmenu").on("click", ".remove-stolen", function () { 
        let tag = $(".vehicle-tags").find(".stolen-tag")
        if ( tag.hasClass("green-tag")) {
            tag.removeClass('green-tag').addClass('red-tag'); 
            $.post(`https://${GetParentResourceName()}/knownInformation`, JSON.stringify({
                dbid: $(".vehicle-information-title-holder").data("dbid"),
                type: "stolen",
                status: false,
                plate: $(this).data("info")
            }));
        }
    });

    $(".vehicle-tags").on("contextmenu", ".stolen-tag", function (e) {
        let plate = $(".vehicle-info-plate-input").val()
        if (plate) {
            let args = []
            if ($(this).hasClass("red-tag")) {
                args = [
                    {
                        "className": "mark-stolen",
                        "icon": "fas fa-check",
                        "text": "Mark as Stolen",
                        "info": plate,
                        "status": ""
                    }
                ]
            } else {
                args = [
                    {
                        "className": "remove-stolen",
                        "icon": "fas fa-times",
                        "text": "Remove Code 5 Status",
                        "info": plate,
                        "status": ""
                    }
                ]
            }
            
            openContextMenu(e, args);
    
        }
    })

    $(".contextmenu").on("click", ".view-profile", function () { 
        const cid = $(this).data("info");
        fidgetSpinner(".profile-page-container");
        currentTab = ".profile-page-container";
        setTimeout(() => {
            $(".profile-search-input").slideDown(250);
            $(".profile-search-input").css("display", "block")
            setTimeout(() => {
                $("#profile-search-input:text").val(cid.toString());
                canSearchForProfiles = false
                $.post(`https://${GetParentResourceName()}/searchProfiles`, JSON.stringify({
                    name: cid.toString()
                }));
                $(".profile-items").empty();
                $('.profile-items').prepend(`<div class="profile-loader"></div>`);
                setTimeout(() => {
                    $.post(`https://${GetParentResourceName()}/getProfileData`, JSON.stringify({
                        id: cid.toString()
                    }));
                }, 250);
            }, 250);
        }, 250);
    });

    $(".contextmenu").on("click", ".view-incident", function () { 
        const incidentId = $(this).data("info");
        fidgetSpinner(".incidents-page-container");
        currentTab = ".incidents-page-container";
        setTimeout(() => {
            $(".incidents-search-input").slideDown(250);
            $(".incidents-search-input").css("display", "block")
            setTimeout(() => {
                $("#incidents-search-input:text").val(incidentId.toString());
                canSearchForProfiles = false
                $.post(`https://${GetParentResourceName()}/searchIncidents`, JSON.stringify({
                    incident: incidentId.toString()
                }));
                $(".incidents-items").empty();
                $('.incidents-items').prepend(`<div class="profile-loader"></div>`);
                setTimeout(() => {
                    $.post(`https://${GetParentResourceName()}/getIncidentData`, JSON.stringify({
                        id: incidentId.toString()
                    }));
                }, 250);
            }, 250);
        }, 250);
    });


    $(".warrants-items").on("contextmenu", ".warrants-item", function (e) {
        //let information = $(this).html()
        //if (information) {
            args = [
                {
                    "className": "view-profile",
                    "icon": "far fa-eye",
                    "text": "View Profile",
                    "info": $(this).data("cid"),
                    "status": ""
                },
                {
                    "className": "view-incident",
                    "icon": "fas fa-search",
                    "text": "View Incident",
                    "info": $(this).data("id"),
                    "status": ""
                },
            ]
            openContextMenu(e, args);
        //}
    })

    $(".contextmenu").on("click", ".toggle-duty", function () { 
        let info = $(this).data("info")
        let currentStatus = $(`[data-id="${info}"]`).find(".unit-status").html()
        if (currentStatus == "10-8") {
            $(`[data-id="${info}"]`).find(".unit-status").html("10-7")
            $(`[data-id="${info}"]`).find(".unit-status").removeClass('green-status').addClass('yellow-status'); 
            $.post(`https://${GetParentResourceName()}/toggleDuty`, JSON.stringify({
                cid: info,
                status: 0
            }));
        } else if (currentStatus == "10-7") {
            $(`[data-id="${info}"]`).find(".unit-status").html("10-8")
            $(`[data-id="${info}"]`).find(".unit-status").removeClass('yellow-status').addClass('green-status'); 
            $.post(`https://${GetParentResourceName()}/toggleDuty`, JSON.stringify({
                cid: info,
                status: 1
            }));
        }
    });

    $(".contextmenu").on("click", ".set-callsign", function () { 
        let info = $(this).data("info")
        $(".callsign-container").fadeIn(0)
        $(".callsign-inner-container").slideDown(500)
        $(".callsign-inner-container").fadeIn(500)
        $(".callsign-container").data("id", info)
    })

    $(".contextmenu").on("click", ".set-waypoint", function () { 
        let info = $(this).data("info")
        $.post(`https://${GetParentResourceName()}/setWaypointU`, JSON.stringify({
            cid: info,
        }));
    })

    $(".active-unit-list").on("contextmenu", ".active-unit-item", function (e) {
        let cid = $(this).data("id")
        if (cid) {
            args = [
                {
                    "className": "toggle-duty",
                    "icon": "fas fa-thumbtack",
                    "text": "Toggle Duty",
                    "info": cid,
                    "status": ""
                },
                {
                    "className": "set-callsign",
                    "icon": "far fa-id-badge",
                    "text": "Set Callsign",
                    "info": cid,
                    "status": ""
                },
                {
                    "className": "set-waypoint",
                    "icon": "fas fa-map-marker-alt",
                    "text": "Set Waypoint",
                    "info": cid,
                    "status": ""
                },
            ]
            openContextMenu(e, args);
        }
    })

    $(".contextmenu").on("click", ".set-waypoint", function () { 
        const callId = $(this).data("info")
        $.post(`https://${GetParentResourceName()}/setWaypoint`, JSON.stringify({
            callid: callId,
        }));
    })

    $(".contextmenu").on("click", ".call-attach", function () { 
        const callId = $(this).data("info")
        $.post(`https://${GetParentResourceName()}/callAttach`, JSON.stringify({
            callid: callId,
        }));
    })

    $(".contextmenu").on("click", ".call-detach", function () { 
        const callId = $(this).data("info")
        $.post(`https://${GetParentResourceName()}/callDetach`, JSON.stringify({
            callid: callId
        }));
    })

    $(".contextmenu").on("click", ".remove-call", function () { 
        const callId = $(this).data("info")
        $(".active-calls-item").filter("[data-id='" + callId + "']").remove()
        $.post(`https://${GetParentResourceName()}/removeCall`, JSON.stringify({
            callid: callId
        }));
    })

    $(".contextmenu").on("click", ".attached-units", function () { 
        const callId = $(this).data("info")
        $.post(`https://${GetParentResourceName()}/attachedUnits`, JSON.stringify({
            callid: callId
        }));
    })

    $('#respondcalls').keydown(function (e) {
        const keyCode = e.which || e.keyCode;
        if (keyCode === 13 && !e.shiftKey) {
            const callid = $(".respond-calls-container").data("id")
            e.preventDefault();
            const time = new Date()
            $.post(`https://${GetParentResourceName()}/sendCallResponse`, JSON.stringify({
                message: $(this).val(),
                time: time.getTime(),
                callid: callid
            }));
            $(this).val("")
        }
    });

    $(".contextmenu").on("click", ".respond-call", function () {
        const callId = $(this).data("info")
        $.post(`https://${GetParentResourceName()}/getCallResponses`, JSON.stringify({
            callid: callId
        }));
        /**$(".respond-calls").fadeIn(0)
        $(".respond-calls-container").fadeIn(250)
        $(".close-all").css("filter", "brightness(15%)");
        $("#respondcalls").val("")*/
    })

    
    $(".active-calls-list").on("contextmenu", ".active-calls-item", function (e) {
        const callId = $(this).data("id")
        const canRespond = $(this).data("canrespond")
        if (callId) {
            if (canRespond == true) {
                args = [
                    {
                        "className": "respond-call",
                        "icon": "fas fa-reply",
                        "text": "Respond to Call",
                        "info": callId,
                        "status": ""
                    },
                    {
                        "className": "attached-units",
                        "icon": "fas fa-link",
                        "text": "Attached Units",
                        "info": callId,
                        "status": ""
                    },
                    {
                        "className": "remove-call",
                        "icon": "fas fa-circle",
                        "text": "Remove Call",
                        "info": callId,
                        "status": ""
                    },
                    {
                        "className": "call-detach",
                        "icon": "fas fa-sign-out-alt",
                        "text": "Detach",
                        "info": callId,
                        "status": ""
                    },
                    {
                        "className": "call-attach",
                        "icon": "fas fa-sign-in-alt",
                        "text": "Respond",
                        "info": callId,
                        "status": ""
                    },
                    {
                        "className": "set-waypoint",
                        "icon": "fas fa-map-marker-alt",
                        "text": "Set Waypoint",
                        "info": callId,
                        "status": ""
                    },
                ]
            } else if (canRespond == false) {
                args = [
                    {
                        "className": "attached-units",
                        "icon": "fas fa-link",
                        "text": "Attached Units",
                        "info": callId,
                        "status": ""
                    },
                    {
                        "className": "call-detach",
                        "icon": "fas fa-sign-out-alt",
                        "text": "Detach",
                        "info": callId,
                        "status": ""
                    },
                    {
                        "className": "remove-call",
                        "icon": "fas fa-circle",
                        "text": "Remove Call",
                        "info": callId,
                        "status": ""
                    },
                    {
                        "className": "call-attach",
                        "icon": "fas fa-sign-in-alt",
                        "text": "Respond",
                        "info": callId,
                        "status": ""
                    },
                    {
                        "className": "set-waypoint",
                        "icon": "fas fa-map-marker-alt",
                        "text": "Set Waypoint",
                        "info": callId,
                        "status": ""
                    },
                ]
            }
            
            openContextMenu(e, args);
        }
    })

    $(".contextmenu").on("click", ".call-dispatch-detach", function () { 
        const cid = $(this).data("info")
        $.post(`https://${GetParentResourceName()}/callDispatchDetach`, JSON.stringify({
            callid: $(".dispatch-attached-units-container").attr("id"),
            cid: cid
        }));
        $(".dispatch-attached-unit-item").filter(`[data-id="${cid}"]`).remove()
    })

    $(".contextmenu").on("click", ".Set-Dispatch-Waypoint", function () { 
        const cid = $(this).data("info")
        $.post(`https://${GetParentResourceName()}/setDispatchWaypoint`, JSON.stringify({
            callid: $(".dispatch-attached-units-container").attr("id"),
            cid: cid
        }));
    })

    $(".dispatch-attached-units-holder").on("contextmenu", ".dispatch-attached-unit-item", function (e) {
        const cid = $(this).data("id")
        if (cid) {
            args = [
                {
                    "className": "call-dispatch-detach",
                    "icon": "fas fa-sign-out-alt",
                    "text": "Detach",
                    "info": cid,
                    "status": ""
                },
                {
                    "className": "Set-Dispatch-Waypoint",
                    "icon": "fas fa-map-marker-alt",
                    "text": "Set Waypoint",
                    "info": cid,
                    "status": ""
                },
            ]
            openContextMenu(e, args);
        }
    })

    $(".callsign-buttons").on("click", ".callsign-cancel", function () {
        $(".callsign-inner-container").slideUp(500)
        $(".callsign-inner-container").fadeOut(500)
        setTimeout(() => {
            $(".callsign-container").slideUp(500)
            $(".callsign-container").fadeOut(500)
            $(".callsign-input").val("")
        }, 500)
    })

    $(".jail-buttons").on("click", ".jail-cancel", function () {
        $(".jail-inner-container").slideUp(500)
        $(".jail-inner-container").fadeOut(500)
        setTimeout(() => {
            $(".jail-container").slideUp(500)
            $(".jail-container").fadeOut(500)
            $(".jail-input").val("")
        }, 500)
    })

    $(".jail-buttons").on("click", ".jail-submit", function () {
        const time = $(".jail-input").val()
        if (time.length > 0) {
            let cid = $(".jail-container").data("id")
            $.post(`https://${GetParentResourceName()}/jailPlayer`, JSON.stringify({
                cid: cid,
                time: time
            }));
            $(".jail-inner-container").slideUp(500)
            $(".jail-inner-container").fadeOut(500)
            setTimeout(() => {
                $(".jail-container").slideUp(500)
                $(".jail-container").fadeOut(500)
                $(".jail-input").val("")
            }, 500)
        }
    })

    $(".callsign-buttons").on("click", ".callsign-submit", function () {
        const callsign = $(".callsign-input").val()
        if (callsign.length > 2) {
            let editingcallsign = $(".callsign-container").data("id")
            let name = $(`[data-id="${editingcallsign}"]`).find(".unit-name").html().replace( /\s*(?:\[[^\]]*\]|\([^)]*\))\s*/g, "" )
            let newunitname = `(${callsign}) ${name}`
            $(`[data-id="${editingcallsign}"]`).find(".unit-name").html(newunitname)
            $.post(`https://${GetParentResourceName()}/setCallsign`, JSON.stringify({
                cid: editingcallsign,
                newcallsign: callsign
            }));
            
            $(".callsign-inner-container").slideUp(500)
            $(".callsign-inner-container").fadeOut(500)
            setTimeout(() => {
                $(".callsign-container").slideUp(500)
                $(".callsign-container").fadeOut(500)
                $(".callsign-input").val("")
            }, 500)
        }
    })

    var draggedElement = 0
    var dragging = false

    $(".active-unit-list").on("click", ".active-unit-item", function (e) {
        if (dragging) {
            $('#draggedItem').css('opacity', 0.0);
            document.getElementById('draggedItem').innerHTML = "";
            dragging = false
        } else {
            dragging = true
            draggedElement = $(this).data("id")
            let draggedItemHtml = $(this).html()
            document.getElementById('draggedItem').innerHTML = draggedItemHtml;
            document.getElementById('draggedItem').style.left = 'cursorX-50';
            document.getElementById('draggedItem').style.top = 'cursorY-50';
            document.getElementById('draggedItem').style.opacity = '0.5';
        }
    })

    document.onmousemove = handleMouseMove;

    function handleMouseMove(event) {
        let dot, eventDoc, doc, body, pageX, pageY;
        event = event || window.event; // IE-ism
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        }

        if (dragging) {
            cursorX = event.pageX
            cursorY = event.pageY
            document.getElementById('draggedItem').style.left = '' + cursorX - 50 + 'px';
            document.getElementById('draggedItem').style.top = '' + cursorY - 50 + 'px';
        }
    }

    $(".active-calls-list").on("click", ".active-calls-item", function (e) {
        const callId = $(this).data("id")
        $('#draggedItem').css('opacity', 0.0);
        document.getElementById('draggedItem').innerHTML = "";
        dragging = false
        if (callId && draggedElement) {
            $.post(`https://${GetParentResourceName()}/callDragAttach`, JSON.stringify({
                callid: callId,
                cid: draggedElement
            }));
            draggedElement = 0
        }
    })

    function JobColors(sentJob) {
        currentJob = sentJob
        if (sentJob) {
            if (sentJob == 'police') {
                document.documentElement.style.setProperty('--color-1', '#1E3955');
                document.documentElement.style.setProperty('--color-2', '#213F5F');
                document.documentElement.style.setProperty('--color-3', '#2C537B');
                document.documentElement.style.setProperty('--color-4', '#23405E');
                document.documentElement.style.setProperty('--color-5', '#152638');
                document.documentElement.style.setProperty('--color-6', '#121f2c');
                document.documentElement.style.setProperty('--color-7', 'rgb(28, 54, 82)');
                document.documentElement.style.setProperty('--color-8', '#2554cc');
                $(".badge-logo").attr('src','https://cdn.discordapp.com/attachments/770324167894761522/912602343483260958/sasp_badge.png');
                $(".header-title").html("SAN ANDREAS STATE POLICE");
                $(".bolo-nav-item").html('<i class="fas fa-car"></i> BOLOS');
                $(".bolos-search-title").html("Bolos");                
                $("#bolos-search-input").attr('placeholder','Search Bolo...');
                $(".manage-bolos-title").html("Manage Bolo");
                $(".manage-bolos-editing-title").html("You are currently creating a new BOLO");
                $(".boloplate-title").html("Plate");
                $(".boloowner-title").html("Owner");
                $(".boloindividual-title").html("Individual");
                $("#boloplate").attr('placeholder','Place plate here...');
                $("#bolodetail").attr('placeholder','Bolo detail goes here...');
                $(".convictions-title").html("Known Convictions");   
                $("#boloowner").attr('placeholder','Place vehicle owner here...');
                $("#boloindividual").attr('placeholder','Place invidivual here...');
                $("#home-warrants-container").fadeIn(0)
                $("#home-reports-container").fadeOut(0)
                $(".quote-span").html("Our lives on the line, just for the media to whine");
                $(".incidents-nav-item").show()
                $(".bolo-nav-item").show()
                $(".penalcode-nav-item").show()
                $(".dmv-nav-item").show()
                $(".weapons-nav-item").show()
                $(".missing-nav-item").show()
                $(".reports-nav-item").show()
                $(".dashboard-nav-item").show()
                $(".dispatch-title-ofsomesort").html("Dispatch")
                $(".dispatch-comms-container").fadeIn(0)
                $(".manage-profile-name-input-1").attr("readonly", true)
                $(".manage-profile-name-input-2").attr("readonly", true)
                $("#reports-officeun-involved-tag-title").html("Officers Involved")
                $(".roster-iframe").attr("src", PoliceRoster)    
                $(".incidents-nav-item").html('<i class="fas fa-stethoscope"></i> INCIDENTS');
                $(".incidents-title").html("Incidents");
                $("#incidents-search-input").attr('placeholder', 'Search Incident...');
                $(".manage-incidents-reports-content").attr('placeholder', 'Incident report content goes here...');
                $(".manage-incidents-title").html("Manage Incident");
                $(".manage-incidents-editing-title").html("You are currently creating a new Incident");
                $(".manage-incidents-officeun-title").html("Officers Involved");
                $(".manage-incidents-evidence-title").html("Evidence");
                $(".associated-incidents-tags-title").html("Criminals Involved");
                $(".convictions-title").html("Known Convictions");   
            } else if (sentJob == 'ambulance') {
                $("#home-warrants-container").fadeOut(0)
                $("#home-reports-container").fadeIn(0)
                document.documentElement.style.setProperty('--color-1', '#551e1e');
                document.documentElement.style.setProperty('--color-2', '#5f2121');
                document.documentElement.style.setProperty('--color-3', '#7b2c2c');
                document.documentElement.style.setProperty('--color-4', '#5e2323');
                document.documentElement.style.setProperty('--color-5', '#381515');
                document.documentElement.style.setProperty('--color-6', '#2c1212');
                document.documentElement.style.setProperty('--color-7', 'rgb(82, 28, 28)');
                document.documentElement.style.setProperty('--color-8', '#cc2525');
                $(".badge-logo").attr('src','https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png');
                $(".header-title").html("SAN ANDREAS MEDICAL DEPARTMENT");
                $(".quote-span").html("The simplest explanation is almost always somebody screwed up.");
                $(".incidents-nav-item").html('<i class="fas fa-stethoscope"></i> ICU');
                $(".incidents-title").html("ICU Check-ins");
                $("#incidents-search-input").attr('placeholder','Search Check-ins...');
                $(".manage-incidents-reports-content").attr('placeholder','Check-in content goes here...');
                $(".manage-incidents-title").html("Manage ICU Check-in");
                $(".manage-incidents-editing-title").html("You are creating a new ICU Check-in");
                $(".manage-incidents-officeun-title").html("EMS Involved");
                $(".manage-incidents-evidence-title").html("Gallery");
                $(".associated-incidents-tags-title").html("Patient Involved");
                $(".convictions-title").html("Treatments");                
                // $(".bolos-tags-title").html("EMS Involved")
                // $(".boloplate-title").html("Estimated Recovery");
                // $(".boloowner-title").html("Emergency Contact");
                // $(".boloindividual-title").html("Patient");
                // $("#boloplate").attr('placeholder','Enter recovery time here...');
                // $("#bolodetail").attr('placeholder','Enter ICU Check-in details here...');
                // $("#boloowner").attr('placeholder','Enter emergency contact here...');
                // $("#boloindividual").attr('placeholder','Enter patient name and CID here...');
                $(".incidents-nav-item").show()
                $(".dmv-nav-item").hide()
                $(".weapons-nav-item").hide()
                $(".dashboard-nav-item").show()
                $(".bolo-nav-item").hide()
                $(".reports-nav-item").show()
                $(".penalcode-nav-item").show()
                $(".missing-nav-item").hide()
                $("#reports-officeun-involved-tag-title").html("EMS Involved")
                $(".dispatch-title-ofsomesort").html("Dispatch")
                $(".dispatch-comms-container").fadeIn(0)
                $(".manage-profile-name-input-1").attr("readonly", true)
                $(".manage-profile-name-input-2").attr("readonly", true)
                $(".roster-iframe").attr("src", EMSRoster)
            } else if (sentJob == "publicrecords") {
                document.documentElement.style.setProperty('--color-1', '#553a1e');
                document.documentElement.style.setProperty('--color-2', '#5f4321');
                document.documentElement.style.setProperty('--color-3', '#7b552c');
                document.documentElement.style.setProperty('--color-4', '#5e4123');
                document.documentElement.style.setProperty('--color-5', '#382815');
                document.documentElement.style.setProperty('--color-6', '#2c2312');
                document.documentElement.style.setProperty('--color-7', 'rgb(82, 60, 28)');
                document.documentElement.style.setProperty('--color-8', '#cc9225');
                $(".badge-logo").attr('src', 'https://cdn.discordapp.com/attachments/780004019820298251/919168234626883634/court.png');
                $(".header-title").html("DEPARTMENT OF JUSTICE");
            }
        }
    }

    window.addEventListener('message', function (event) {
        let e = event.data;
        $(".dispatch-msg-notif").fadeIn(500)
        if (e.type == "show") {
            if (e.enable == true) {
                isPublicRecords = false
                JobColors(e.job)
                $("body").fadeIn(0);
                $(".close-all").css("filter", "none");
                $(".close-all").fadeOut(0);
                $(currentTab).slideDown(250);
                timeShit();
                if (e.isAdmin) {
                    $(".stafflogs-nav-item").show()
                } else {
                    $(".stafflogs-nav-item").hide()
                }
                $(".tags-add-btn").show()
                $(".weapons-add-btn").show()
                $(".gallery-add-btn").show()
                $(".tags-title").removeClass("tags-title-publicrecords")
                $(".weapons-title").removeClass("weapons-title-publicrecords")
                $(".gallery-title").removeClass("gallery-title-publicrecords")
                $('.manage-profile-url-input').removeAttr('readonly');
            } else {
                $(".callsign-inner-container").fadeOut(0)
                $(".callsign-container").fadeOut(0)
                $(".icidents-person-search-container").fadeOut(0)
                $(".dispatch-attached-units").fadeOut(0)
                $(".respond-calls").fadeOut(0)
                $(".respond-calls-container").fadeOut(0)
                $("body").slideUp(250);
                $(".close-all").slideUp(250);
            }
        } else if (e.type == "PublicRecords") {
            isPublicRecords = true
            $(".tags-title").removeClass("tags-title-publicrecords")
            $(".weapons-title").removeClass("weapons-title-publicrecords")
            $(".gallery-title").removeClass("gallery-title-publicrecords")
            JobColors("publicrecords")
            $("body").fadeIn(0);
            $(".close-all").css("filter", "none");
            $(".close-all").fadeOut(0);
            $(".profile-page-container").slideDown(250);
            timeShit();
            $(".incidents-nav-item").hide()
            $(".bolo-nav-item").hide()
            $(".penalcode-nav-item").hide()
            $(".dmv-nav-item").hide()
            $(".weapons-nav-item").hide()
            $(".missing-nav-item").hide()
            $(".stafflogs-nav-item").hide()
            $(".reports-nav-item").hide()
            $(".dashboard-nav-item").hide()
            $(".tags-add-btn").hide()
            $(".weapons-add-btn").hide()
            $(".gallery-add-btn").hide()
            $(".tags-title").toggleClass("tags-title-publicrecords")
            $(".weapons-title").toggleClass("weapons-title-publicrecords")
            $(".gallery-title").toggleClass("gallery-title-publicrecords")
            if (e.settings['AllowImageChange']) {
                $('.manage-profile-url-input').removeAttr('readonly');
            } else {
                $('.manage-profile-url-input').attr('readonly', true)
            }
        } else if (e.type == "data") {
            $(".name-shit").html(e.name)
            $(".header-location").html(" " + e.location)
            MyName = e.fullname
        } else if (e.type == "profileData") {
            let table = e.data
            if (!canInputTag) {
                if ($(".tags-add-btn").hasClass("fa-minus")) { $(".tags-add-btn").removeClass('fa-minus').addClass('fa-plus'); }
                $(".tag-input").remove()
                canInputTag = true
            }

            if ($(".gallery-upload-input").css("display") == "block") {
                $(".gallery-upload-input").slideUp(250);
                setTimeout(() => { $(".gallery-upload-input").css("display", "none") }, 250);
            }

            if ($(".gallery-add-btn").hasClass("fa-minus")) { $(".gallery-add-btn").removeClass('fa-minus').addClass('fa-plus'); }


            $(".manage-profile-editing-title").html("You are currently editing " + table["firstname"] + " " + table["lastname"])
            $(".manage-profile-citizenid-input").val(table["cid"]);
            $(".manage-profile-name-input-1").val(table["firstname"])
            $(".manage-profile-name-input-2").val(table["lastname"])
            $(".manage-profile-dob-input").val(table["dateofbirth"]);
            $(".manage-profile-job-input").val(table["job"]);
            $(".manage-profile-phone-input").val(table["phone"]);
            $(".manage-profile-url-input").val(table["profilepic"]);
            $(".manage-profile-info").val(table["policemdtinfo"]);
            if (isPublicRecords == false) {
                $('.manage-profile-info').removeAttr('disabled');
            }
            $(".manage-profile-pic").attr("src", table["profilepic"]);

            let car = ""
            if (table["car"] == true) {
                car = "green-tag"
            } else {
                car = "red-tag"
            }

            let bike = ""
            if (table["bike"] == true) {
                bike = "green-tag"
            } else {
                bike = "red-tag"
            }

            let truck = ""
            if (table["truck"] == true) {
                truck = "green-tag"
            } else {
                truck = "red-tag"
            }

            let weapon = ""
            if (table["weapon"] == true) {
                weapon = "green-tag"
            } else {
                weapon = "red-tag"
            }

            let pilot = ""
            if (table["pilot"] == true) {
                pilot = "green-tag"
            } else {
                pilot = "red-tag"
            }
            $(".licenses-holder").empty();
            $('.licenses-holder').prepend(
                `
                <div class="license-tag ${car} car" data-type="car">Car</div>
                <div class="license-tag ${bike} bike" data-type="bike">Bike</div>
                <div class="license-tag ${truck} truck" data-type="truck">Truck</div>
                <div class="license-tag ${weapon} weapon" data-type="weapon">Weapon</div>
                <div class="license-tag ${pilot} pilot" data-type="pilot">Pilot</div>
            `);
            $(".tags-holder").empty();
            $(".vehs-holder").empty();
            $(".weapons-holder").empty();
            $(".gallery-inner-container").empty();
            $(".convictions-holder").empty();
            if (table["tags"]) {
                $.each(JSON.parse(table["tags"]), function (index, value) {
                    $('.tags-holder').prepend(`<div class="tag">${value}</div>`);
                })
            }
            if (table["weapons"]) {
                $.each(table["weapons"], function (index, value) {
                    $('.weapons-holder').prepend(`<div class="tag" data-plate="${value}">${value}</div>`);
                })
            }
            if (table["vehicles"]) {
                $.each(table["vehicles"], function (index, value) {
                    $('.vehs-holder').prepend(`<div class="veh-tag" data-plate="${value.plate}">${value.plate} - ${value.model} </div>`);
                })
            }
            if (table["gallery"]) {
                $.each(JSON.parse(table["gallery"]), function (index, value) {
                    $('.gallery-inner-container').prepend(`<img src="${value}" class="gallery-img" onerror="this.src='https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg'">`);
                })
            }
            if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602343483260958/sasp_badge.png') {
                if (table["convictions"]) {
                    $.each(JSON.parse(table["convictions"]), function (index, value) {
                        $('.convictions-holder').prepend(`<div class="white-tag">${value} </div>`);
                    })
                }
            } else  if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
                if (table["treatments"]) {
                    $.each(JSON.parse(table["treatments"]), function (index, value) {
                        $('.convictions-holder').prepend(`<div class="white-tag">${value} </div>`);
                    })
                }
            }
            if (e.isLimited) {
                $(".manage-profile-vehs-container").fadeOut(250)
                $(".manage-profile-weapons-container").fadeOut(250)
                $(".manage-profile-licenses-container").fadeOut(250)
            } else {
                $(".manage-profile-vehs-container").fadeIn(250)
                $(".manage-profile-weapons-container").fadeIn(250)
                $(".manage-profile-licenses-container").fadeIn(250)
            }
        } else if (e.type == "profiles") {
            let table = e.data
            canSearchForProfiles = true
            $(".profile-items").empty();
            $.each(table, function (index, value) {
                let name = value.firstname + " " + value.lastname
                let weapon = ""
                let pilot = ""
                let car = ""
                let bike = ""
                let truck = ""
                if (value.weapon == true) {
                    weapon = "green-tag";
                } else {
                    weapon = "red-tag";
                }
                if (value.pilot == true) {
                    pilot = "green-tag";
                } else {
                    pilot = "red-tag";
                }
                if (value.car == true) {
                    car = "green-tag";
                } else {
                    car = "red-tag";
                }
                if (value.bike == true) {
                    bike = "green-tag";
                } else {
                    bike = "red-tag";
                }
                if (value.truck == true) {
                    truck = "green-tag";
                } else {
                    truck = "red-tag";
                }
                $('.profile-items').prepend(
                    `   
                <div class="profile-item" data-id="${value.id}">
                    <img src="${value.pp}" class="profile-image">
                    <div style="display: flex; flex-direction: column; margin-top: 2.5px; margin-left: 5px; width: 100%; padding: 5px;">
                    <div style="display: flex; flex-direction: column;">
                        <div class="profile-item-title">${name}</div>
                            <div class="profile-tags">
                                <div class="profile-tag ${car}">Car</div>
                                <div class="profile-tag ${bike}">Bike</div>
                                <div class="profile-tag ${truck}">Truck</div>
                                <div class="profile-tag ${weapon}">Weapon</div>
                                <div class="profile-tag ${pilot}">Pilot</div>
                            </div>
                        </div>
                        <div class="profile-bottom-info">
                            <div class="profile-id">ID: ${value.id}</div>
                        </div>
                    </div>
                </div>
                `);
            });
        } else if (e.type == "bulletin") {
            $(".bulletin-items-continer").empty();
            $.each(e.data, function (index, value) {
                $('.bulletin-items-continer').prepend(`<div class="bulletin-item" data-id=${value.id}>
                <div class="bulletin-item-title">${value.title}</div>
                <div class="bulletin-item-info">${value.info}</div>
                <div class="bulletin-bottom-info">
                    <div class="bulletin-id">ID: ${value.id}</div>
                    <div class="bulletin-date">${value.author} - ${timeAgo(Number(value.time))}</div>
                </div>
                </div>`)
            })
        } else if (e.type == "newBulletin") {
            const value = e.data
            $('.bulletin-items-continer').prepend(`<div class="bulletin-item" data-id=${value.id}>
                <div class="bulletin-item-title">${value.title}</div>
                <div class="bulletin-item-info">${value.info}</div>
                <div class="bulletin-bottom-info">
                    <div class="bulletin-id">ID: ${value.id}</div>
                    <div class="bulletin-date">${value.author} - ${timeAgo(Number(value.time))}</div>
                </div>
            </div>`)
        } else if (e.type == "removeCall") {
            const callid = e.callid
            $(".active-calls-item").filter("[data-id='" + callid + "']").remove()
        } else if (e.type == "deleteBulletin") {
            $(".bulletin-items-continer").find("[data-id='" + e.data + "']").remove();
        } else if (e.type == "warrants") {
            $(".warrants-items").empty();
            $.each(e.data, function (index, value) {
                $('.warrants-items').prepend(`<div class="warrants-item" data-cid=${value.cid} data-id=${value.linkedincident}><div style="display: flex; flex-direction: column; margin-top: 2.5px; margin-left: 0.75vh; width: 100%;">
                    <div style="display: flex; flex-direction: column;">
                        <div class="warrant-title">${value.name}</div>
                        <div class="warrant-item-info">${value.reporttitle} - ${timeAgo(Number(value.time))}</div>
                    </div>
                    <div class="warrant-bottom-info">
                        <div class="warrant-id">ID: ${value.linkedincident}</div>
                    </div>
                </div></div>`)
            })
        } else if (e.type == "dispatchmessages") {
            const table = e.data
            LastName = ""
            DispatchNum = 0
            $(".dispatch-items").empty();
            $.each(table, function (index, value) {
                DispatchNum = DispatchNum + 1
                if (LastName == value.author) {
                    $('.dispatch-items').append(`
                    <div class="dispatch-item-grid dispatch-item-msg">
                        <div class="dispatch-item-message">${value.message}</div>
                    </div>
                    `)
                } else {
                    if (DispatchNum == 1) {
                        $('.dispatch-items').append(`<div class="dispatch-item" style="display: flex; margin-top: 0vh;" >
                        <img src="${value.profilepic}" class="dispatch-message-profilepic">
                        <div class="dispatch-item-grid">
                            <div class="dispatch-item-info dispatch-info-job-${value.job}"> ${value.author} <span style="color:#969696; margin-left: 0.5vh; font-size: 12px; font-weight: normal;">${timeAgo(Number(value.time))}</span> </div>
                            <div class="dispatch-item-message">${value.message}</div>
                        </div>
                        </div>`)
                    } else {
                        $('.dispatch-items').append(`<div class="dispatch-item" style="display: flex;" >
                        <img src="${value.profilepic}" class="dispatch-message-profilepic">
                        <div class="dispatch-item-grid">
                            <div class="dispatch-item-info dispatch-info-job-${value.job}"> ${value.author} <span style="color:#969696; margin-left: 0.5vh; font-size: 12px; font-weight: normal;">${timeAgo(Number(value.time))}</span> </div>
                            <div class="dispatch-item-message">${value.message}</div>
                        </div>
                        </div>`)
                    }
                }
                LastName = value.author
                $('.dispatch-items').scrollTop($('.dispatch-items')[0].scrollHeight)
            })
            $('.dispatch-items').scrollTop($('.dispatch-items')[0].scrollHeight)
        } else if (e.type == "dispatchmessage") {
            const value = e.data
            DispatchNum = DispatchNum + 1
            const BodyDisplay = $("body").css("display")
            if ((BodyDisplay) == "block") {
                if (LastName == value.name) {
                    $('.dispatch-items').append(`
                    <div class="dispatch-item-grid dispatch-item-msg">
                        <div class="dispatch-item-message ">${value.message}</div>
                    </div>
                    `)
                } else {
                    if (DispatchNum == 1) {
                        $('.dispatch-items').append(`<div class="dispatch-item" style="display: flex; margin-top: 0vh;" >
                        <img src="${value.profilepic}" class="dispatch-message-profilepic">
                        <div class="dispatch-item-grid">
                            <div class="dispatch-item-info dispatch-info-job-${value.job}"> ${value.name} <span style="color:#969696; margin-left: 0.5vh; font-size: 12px; font-weight: normal;">${timeAgo(Number(value.time))}</span> </div>
                            <div class="dispatch-item-message">${value.message}</div>
                        </div>
                        </div>`)
                    } else {
                        $('.dispatch-items').append(`<div class="dispatch-item" style="display: flex;" >
                        <img src="${value.profilepic}" class="dispatch-message-profilepic">
                        <div class="dispatch-item-grid">
                            <div class="dispatch-item-info dispatch-info-job-${value.job}"> ${value.name} <span style="color:#969696; margin-left: 0.5vh; font-size: 12px; font-weight: normal;">${timeAgo(Number(value.time))}</span> </div>
                            <div class="dispatch-item-message">${value.message}</div>
                        </div>
                        </div>`)
                    }
                }
                LastName = value.name
            } else if ((BodyDisplay) == "none") {
                $.post(`https://${GetParentResourceName()}/dispatchNotif`, JSON.stringify({
                    data: value,
                }));
            }
            $('.dispatch-items').scrollTop($('.dispatch-items')[0].scrollHeight)
        } else if (e.type == "call") {
            const value = e.data
            if (value) {
                const prio = value['priority']
                let DispatchItem = `<div class="active-calls-item" data-id="${value.callId}" data-canrespond="false"><div class="active-call-inner-container"><div class="call-item-top"><div class="call-number">#${value.callId}</div><div class="call-code priority-${value.priority}">${value.dispatchCode}</div><div class="call-title">${value.dispatchMessage}</div></div><div class="call-item-bottom">`
                        
                if (value.dispatchCode == "911" || value.dispatchCode == "311") {
                    DispatchItem = `<div class="active-calls-item" data-id="${value.callId}" data-canrespond="true"><div class="active-call-inner-container"><div class="call-item-top"><div class="call-number">#${value.callId}</div><div class="call-code priority-${value.priority}">${value.dispatchCode}</div><div class="call-title">${value.dispatchMessage}</div><div class="call-radio">${value.units.length}</div></div><div class="call-item-bottom">`
                }
                
                if (value['time']) {
                    DispatchItem += `<div class="call-bottom-info"><span class="fas fa-clock"></span>${timeAgo(value.time)}</div>`
                }

                if (value['firstStreet']) {
                    DispatchItem += `<div class="call-bottom-info"><span class="fas fa-map-pin"></span>${value.firstStreet}</div>`
                }

                if (value['heading']) {
                    DispatchItem += `<div class="call-bottom-info"><span class="fas fa-share"></span>${value.heading}</div>`
                }

                if (value['gender']) {
                    let gender = "Male"
                    if (value['gender'] == 0 || value['gender'] == 2) { gender = "Female" }
                    DispatchItem += `<div class="call-bottom-info"><span class="fas fa-genderless"></span>${gender}</div>`
                }

                if (value['model'] && value['plate']) {
                    DispatchItem += `<div class="call-bottom-info"><span class="fas fa-car"></span>${value['model']}<span class="fas fa-digital-tachograph" style="margin-left: 2vh;"></span>${value['plate']}</div>`
                } else if (value['plate']) {
                    DispatchItem += `<div class="call-bottom-info"><span class="fas fa-digital-tachograph"></span>${value['plate']}</div>`
                } else if (value['model']) {
                    DispatchItem += `<div class="call-bottom-info"><span class="fas fa-car"></span>${value['model']}</div>`
                }
            
                if (value['firstColor']) {
                    DispatchItem += `<div class="call-bottom-info"><span class="fas fa-spray-can"></span>${value['firstColor']}</div>`
                }

                if (value['automaticGunfire'] == true) {
                    DispatchItem += `<div class="call-bottom-info"><span class="fab fa-blackberry"></span>Automatic Gunfire</div>`
                }

                if (value['name'] && value['number']) {
                    DispatchItem += `<div class="call-bottom-info"><span class="far fa-id-badge"></span>${value['name']}<span class="fas fa-mobile-alt" style="margin-left: 2vh;"></span>${value['number']}</div>`
                } else if (value['number']) {
                    DispatchItem += `<div class="call-bottom-info"><span class="fas fa-mobile-alt"></span>${value['number']}</div>`
                } else if (value['name']) {
                    DispatchItem += `<div class="call-bottom-info"><span class="far fa-id-badge"></span>${value['name']}</div>`
                }
            
                if (value['information']) {
                    DispatchItem += `<div class="call-bottom-info call-bottom-information"><span class="far fa-question-circle"></span>${value['information']}</div>`
                }

                DispatchItem += `</div></div></div>`
                $(".active-calls-list").prepend($(DispatchItem).hide().fadeIn('slow'))
            }
        } else if (e.type == "attachedUnits") {
            const table = e.data
            if (table) {
                $(".dispatch-attached-units").fadeIn(0)
                $(".dispatch-attached-units-container").fadeIn(250)
                $(".close-all").css("filter", "brightness(15%)");
                $(".dispatch-attached-units-holder").empty()
                $.each(table, function (index, value) {
                    $(".dispatch-attached-units-holder").prepend(`<div class="dispatch-attached-unit-item" data-id="${value.cid}">
                        <div class="unit-job unit-police">${value.job}</div>
                        <div class="unit-name">(${value.callsign}) ${value.fullname}</div>
                        <div class="unit-radio">1</div>
                    </div> `)
                })
                setTimeout(() => {
                    $(".dispatch-attached-units-container").attr("id", e.callid)
                }, 1000);
            }
        } else if (e.type == "sendCallResponse") {
            if ( $(".respond-calls-container").data("id") == e.callid) {
                $(".respond-calls-responses").prepend(`<div class="respond-calls-response"> ${e['name']} responded "${e['message']}" - ${timeAgo(Number(e.time))}. </div>`)
            }
        } else if (e.type == "getCallResponses") {
            const table = e.data
            $(".respond-calls").fadeIn(0)
            $(".respond-calls-container").fadeIn(250)
            $(".close-all").css("filter", "brightness(15%)");
            $("#respondcalls").val("")
            $(".respond-calls-responses").empty()
            setTimeout(() => {
                $(".respond-calls-container").data("id", e.callid)
            }, 1000);
            $.each(table, function (index, value) {
                $(".respond-calls-responses").prepend(`<div class="respond-calls-response"> ${value['name']} responded "${value['message']}" - ${timeAgo(Number(value.time))}. </div>`)
            })      
        } else if (e.type == "calls") {
            const table = e.data
            $(".active-calls-list").empty();
            $.each(table, function (index, value) {
                if (value) {
                    const prio = value['priority']
                    let DispatchItem = `<div class="active-calls-item" data-id="${value.callId}" data-canrespond="false"><div class="active-call-inner-container"><div class="call-item-top"><div class="call-number">#${value.callId}</div><div class="call-code priority-${value.priority}">${value.dispatchCode}</div><div class="call-title">${value.dispatchMessage}</div><div class="call-radio">${value.units.length}</div></div><div class="call-item-bottom">`
                        
                    if (value.dispatchCode == "911" || value.dispatchCode == "311") {
                        DispatchItem = `<div class="active-calls-item" data-id="${value.callId}" data-canrespond="true"><div class="active-call-inner-container"><div class="call-item-top"><div class="call-number">#${value.callId}</div><div class="call-code priority-${value.priority}">${value.dispatchCode}</div><div class="call-title">${value.dispatchMessage}</div><div class="call-radio">${value.units.length}</div></div><div class="call-item-bottom">`
                    }

                    if (value['time']) {
                        DispatchItem += `<div class="call-bottom-info"><span class="fas fa-clock" style="margin-left: -0.1vh;"></span>${timeAgo(value.time)}</div>`
                    }

                    if (value['firstStreet']) {
                        DispatchItem += `<div class="call-bottom-info"><span class="fas fa-map-pin"></span>${value.firstStreet}</div>`
                    }
    
                    if (value['heading']) {
                        DispatchItem += `<div class="call-bottom-info"><span class="fas fa-share"></span>${value.heading}</div>`
                    }
    
                    if (value['gender']) {
                        let gender = "Male"
                        if (value['gender'] == 0 || value['gender'] == 2) { gender = "Female" }
                        DispatchItem += `<div class="call-bottom-info"><span class="fas fa-genderless"></span>${gender}</div>`
                    }
    
                    if (value['model'] && value['plate']) {
                        DispatchItem += `<div class="call-bottom-info"><span class="fas fa-car"></span>${value['model']}<span class="fas fa-digital-tachograph" style="margin-left: 2vh;"></span>${value['plate']}</div>`
                    } else if (value['plate']) {
                        DispatchItem += `<div class="call-bottom-info"><span class="fas fa-digital-tachograph"></span>${value['plate']}</div>`
                    } else if (value['model']) {
                        DispatchItem += `<div class="call-bottom-info"><span class="fas fa-car"></span>${value['model']}</div>`
                    }
                
                    if (value['firstColor']) {
                        DispatchItem += `<div class="call-bottom-info"><span class="fas fa-spray-can"></span>${value['firstColor']}</div>`
                    }

                    if (value['automaticGunfire'] == true) {
                        DispatchItem += `<div class="call-bottom-info"><span class="fab fa-blackberry"></span>Automatic Gunfire</div>`
                    }
                    
                    if (value['name'] && value['number']) {
                        DispatchItem += `<div class="call-bottom-info"><span class="far fa-id-badge"></span>${value['name']}<span class="fas fa-mobile-alt" style="margin-left: 2vh;"></span>${value['number']}</div>`
                    } else if (value['number']) {
                        DispatchItem += `<div class="call-bottom-info"><span class="fas fa-mobile-alt"></span>${value['number']}</div>`
                    } else if (value['name']) {
                        DispatchItem += `<div class="call-bottom-info"><span class="far fa-id-badge"></span>${value['name']}</div>`
                    }
                
                    if (value['information']) {
                        DispatchItem += `<div class="call-bottom-info call-bottom-information"><span class="far fa-question-circle"></span>${value['information']}</div>`
                    }
    
                    DispatchItem += `</div></div></div>`
                    $(".active-calls-list").prepend($(DispatchItem).hide().fadeIn('slow'))
                }
                

            })

           
            

        } else if (e.type == "incidents") {
            let table = e.data
            canSearchForProfiles = true
            $(".incidents-items").empty();
            $.each(table, function (index, value) {
                if (value.type == "ambulance") {
                    if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
                        $('.incidents-items').prepend(
                            `<div class="incidents-item" data-id="${value.id}">
                            <div class="incidents-top-holder">
                                <div class="incidents-item-title">${value.title}</div>
                                <div class="incedent-report-name">ICU Report</div>
                            </div>
                            <div class="incidents-bottom-holder">
                                <div class="incedent-report-id">ID: ${value.id}</div>
                                <div class="incedent-report-time-ago">${value.author} - ${timeAgo(Number(value.time))}</div>
                            </div>
                        </div>`
                        )
                    }
                } else if (value.type == "police") {
                    if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602343483260958/sasp_badge.png') {
                        $('.incidents-items').prepend(
                            `<div class="incidents-item" data-id="${value.id}">
                            <div class="incidents-top-holder">
                                <div class="incidents-item-title">${value.title}</div>
                                <div class="incedent-report-name">Incident Report</div>
                            </div>
                            <div class="incidents-bottom-holder">
                                <div class="incedent-report-id">ID: ${value.id}</div>
                                <div class="incedent-report-time-ago">${value.author} - ${timeAgo(Number(value.time))}</div>
                            </div>
                        </div>`
                        )
                    }
                }
            })
        } else if (e.type == "getPenalCode") {
            const titles = e.titles
            const penalcode = e.penalcode
            const job = e.job
            if (job == "police") {
                $(".incidents-charges-title").html("Charges");
                $(".offenses-main-container").empty();
                $.each(titles, function (index, value) {
                    $('.offenses-main-container').append(
                        `<div class="offenses-title-container">
                            <div class="offenses-title">${value}</div>
                        </div>
                        <div class="offenses-container offenses-prepend-holder" id="penal-${index}">
                        </div>
                        `
                    )
                })
                $.each(penalcode, function (index, value) {
                    $.each(value, function (i, v) {
                        $(`#penal-${index}`).append(`
                        <div class="offense-item ${v.color}-penis-code" data-sentence="${v.months}" data-fine="${v.fine}">
                        <div style="display: flex; flex-direction: row; width: 100%; margin: auto; margin-top: 0vh;">
                            <div class="offense-item-offense">${v.title}</div>
                            <div class="offfense-item-name">${v.class}</div>
                        </div>
                        <div style="display: flex; flex-direction: row; width: 100%; margin: auto; margin-bottom: 0vh; padding-top: 0.75vh;">
                            <div class="offense-item-id">${v.id}</div>
                            <div class="offfense-item-months">${v.months} Months - $${v.fine} - 0 Points(s)</div>
                        </div>
                        `)
                    })
                })
            } else {
                $(".offenses-main-container").empty();
                $(".incidents-charges-title").html("Treatments");
                $.each(titles, function (index, value) {
                    $('.offenses-main-container').append(
                        `<div class="offenses-title-container">
                            <div class="offenses-title">${value}</div>
                        </div>
                        <div class="offenses-container offenses-prepend-holder" id="penal-${index}">
                        </div>
                        `
                    )
                })
                $.each(penalcode, function (index, value) {
                    $.each(value, function (i, v) {
                        $(`#penal-${index}`).append(`
                        <div class="offense-item ${v.color}-penis-code" data-fine="${v.fine}">
                        <div style="display: flex; flex-direction: row; width: 100%; margin: auto; margin-top: 0vh;">
                            <div class="offense-item-offense">${v.title}</div>
                            <div class="offfense-item-name">${v.class}</div>
                        </div>
                        <div style="display: flex; flex-direction: row; width: 100%; margin: auto; margin-bottom: 0vh; padding-top: 0.75vh;">
                            <div class="offense-item-id">${v.id}</div>
                            <div class="offfense-item-months">$${v.fine}</div>
                        </div>
                        `)
                    })
                })
            }
        } else if (e.type == "incidentData") {
            let table = e.data

            $(".incidents-ghost-holder").html("")
            $(".associated-incidents-tags-holder").html("")

            if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
                $(".manage-incidents-editing-title").html("You are currently editing check-in report " + table["id"]);
            } else {
                $(".manage-incidents-editing-title").html("You are currently editing incident " + table["id"]);
            }
            $(".manage-incidents-editing-title").data("id", Number(table['id']));

            $(".manage-incidents-tags-add-btn").css("pointer-events", "auto")
            $(".manage-incidents-reports-content").css("pointer-events", "auto")
            $(".manage-incidents-officeun-add-btn").css("pointer-events", "auto")
            $(".manage-incidents-civilians-add-btn").css("pointer-events", "auto")
            $(".manage-incidents-evidence-add-btn").css("pointer-events", "auto")
            $(".associated-incidents-tags-add-btn").css("pointer-events", "auto")

            $("#manage-incidents-title-input").val(table["title"]);
            $(".manage-incidents-reports-content").val(table["information"]);

            $(".manage-incidents-tags-holder").empty();
            $.each(JSON.parse(table["tags"]), function (index, value) {
                $('.manage-incidents-tags-holder').append(`<div class="manage-incidents-tag tag">${value}</div>`);
            })

            $(".manage-incidents-officeun-holder").empty();
            $.each(JSON.parse(table["officers"]), function (index, value) {
                $(".manage-incidents-officeun-holder").append(`<div class="manage-incidents-officers">${value}</div>`);
            })

            $(".manage-incidents-civilians-holder").empty();
            $.each(JSON.parse(table["civilians"]), function (index, value) {
                $(".manage-incidents-civilians-holder").append(`<div class="manage-incidents-civilians">${value}</div>`);
            })

            $(".manage-incidents-evidence-holder").empty();
            $.each(JSON.parse(table["evidence"]), function (index, value) {
                $(".manage-incidents-evidence-holder").append(`<img class="incidents-img" src=${value}>`);
            })

            $(".manage-incidents-title-holder").empty();

            if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
                $(".manage-incidents-title-holder").prepend(
                    `
                    <div class="manage-incidents-title">Manage ICU Check-in</div>
                    <div class="manage-incidents-create"> <span class="fas fa-plus" style="margin-top: 3.5px;"></span></div>
                    <div class="manage-incidents-save"><span class="fas fa-save" style="margin-top: 3.5px;"></span></div>
                    `
                );
            } else {
                $(".manage-incidents-title-holder").prepend(
                    `
                    <div class="manage-incidents-title">Manage Incident</div>
                    <div class="manage-incidents-create"> <span class="fas fa-plus" style="margin-top: 3.5px;"></span></div>
                    <div class="manage-incidents-save"><span class="fas fa-save" style="margin-top: 3.5px;"></span></div>
                    `
                );
            }

            $(".manage-incidents-title").css("width", "66%");
            $(".manage-incidents-create").css("margin-right", "0px");

            let associateddata = e.convictions
            $.each(associateddata, function (index, value) {
                $(".associated-incidents-tags-holder").prepend(
                    `<div class="associated-incidents-tag" data-id="${value.cid}">${value.name}</div>`
                );

                var warrantTag = "red-tag"
                var guiltyTag = "red-tag"
                var processedTag = "red-tag"
                var associatedTag = "red-tag"

                if (value.warrant == 1) { warrantTag = "green-tag" }
                if (value.guilty == 1) { guiltyTag = "green-tag" }
                if (value.processed == 1) { processedTag = "green-tag" }
                if (value.associated == 1) { associatedTag = "green-tag" }

                const cid = value.cid
        
                if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
                    if (value.associated == 1) {
                        $(".incidents-ghost-holder").prepend(
                            `<div class="associated-incidents-user-container" data-id="${value.cid}">
                                <div class="associated-incidents-user-title">${value.name} (#${value.cid})</div>
                                <div class="associated-incidents-user-holder" data-name="${value.cid}" style="display:none;">
                                </div>
                                <div class="manage-incidents-title-tag" data-id="${value.cid}" style="display:none;">Recommended Fine</div>
                                <div class="associated-incidents-fine-input" data-id="${value.cid}" style="display:none;"><img src="https://i.imgur.com/h7S5f9J.png"> <input placeholder="0" disabled class="fine-recommended-amount" id="fine-recommended-amount" data-id="${value.cid}" type="number"></div>      
                                <div class="manage-incidents-title-tag" data-id="${value.cid}" style="display:none;">Fine</div>
                                <div class="associated-incidents-fine-input" data-id="${value.cid}" style="display:none;"><img src="https://i.imgur.com/h7S5f9J.png"> <input placeholder="Enter fine here..." value="0" class="fine-amount" data-id="${value.cid}" type="number"></div>
                            </div>`
                        );
                    } else {
                        $(".incidents-ghost-holder").prepend(
                            `<div class="associated-incidents-user-container" data-id="${value.cid}">
                                <div class="associated-incidents-user-title">${value.name} (#${value.cid})</div>
                                <div class="associated-incidents-user-holder" data-name="${value.cid}">
                                </div>
                                <div class="manage-incidents-title-tag" data-id="${value.cid}">Recommended Fine</div>
                                <div class="associated-incidents-fine-input" data-id="${value.cid}"><img src="https://i.imgur.com/h7S5f9J.png"> <input placeholder="0" disabled class="fine-recommended-amount" id="fine-recommended-amount" data-id="${value.cid}" type="number"></div>
                                <div class="manage-incidents-title-tag" data-id="${value.cid}">Fine</div>
                                <div class="associated-incidents-fine-input" data-id="${value.cid}"><img src="https://i.imgur.com/h7S5f9J.png"> <input placeholder="Enter fine here..." value="0" class="fine-amount" data-id="${value.cid}" type="number"></div>
                            </div>`
                        );
                    }
                } else {
                    if (value.associated == 1) {
                        $(".incidents-ghost-holder").prepend(
                            `<div class="associated-incidents-user-container" data-id="${value.cid}">
                                <div class="associated-incidents-user-title">${value.name} (#${value.cid})</div>
                                <div class="associated-incidents-user-tags-holder">
                                    <div class="associated-incidents-user-tag ${warrantTag}" data-id="${value.cid}">Warrant</div>
                                    <div class="associated-incidents-user-tag ${guiltyTag}" data-id="${value.cid}">Guilty</div>
                                    <div class="associated-incidents-user-tag ${processedTag}" data-id="${value.cid}">Processed</div>
                                    <div class="associated-incidents-user-tag ${associatedTag}" data-id="${value.cid}">Associated</div>
                                </div>
                                <div class="associated-incidents-user-holder" data-name="${value.cid}" style="display:none;">
                                </div>
                                <div class="manage-incidents-title-tag" data-id="${value.cid}" style="display:none;">Recommended Fine</div>
                                <div class="associated-incidents-fine-input" data-id="${value.cid}" style="display:none;"><img src="https://i.imgur.com/h7S5f9J.png"> <input placeholder="0" disabled class="fine-recommended-amount" id="fine-recommended-amount" data-id="${value.cid}" type="number"></div>
                                <div class="manage-incidents-title-tag" data-id="${value.cid}" style="display:none;">Recommended Sentence</div>
                                <div class="associated-incidents-sentence-input" data-id="${value.cid}" style="display:none;"><img src="https://i.imgur.com/9Xn6xXK.png"> <input placeholder="0" disabled class="sentence-recommended-amount" id="sentence-recommended-amount" data-id="${value.cid}" type="number"></div>            
                                <div class="manage-incidents-title-tag" data-id="${value.cid}" style="display:none;">Fine</div>
                                <div class="associated-incidents-fine-input" data-id="${value.cid}" style="display:none;"><img src="https://i.imgur.com/h7S5f9J.png"> <input placeholder="Enter fine here..." value="0" class="fine-amount" data-id="${value.cid}" type="number"></div>
                                <div class="manage-incidents-title-tag" data-id="${value.cid}" style="display:none;">Sentence</div>
                                <div class="associated-incidents-sentence-input" data-id="${value.cid}" style="display:none;"><img src="https://i.imgur.com/9Xn6xXK.png"> <input placeholder="Enter months here..." value="0" class="sentence-amount" data-id="${value.cid}" type="number"></div>
                            </div>`
                        );
                    } else {
                        $(".incidents-ghost-holder").prepend(
                            `<div class="associated-incidents-user-container" data-id="${value.cid}">
                                <div class="associated-incidents-user-title">${value.name} (#${value.cid})</div>
                                <div class="associated-incidents-user-tags-holder">
                                    <div class="associated-incidents-user-tag ${warrantTag}" data-id="${value.cid}">Warrant</div>
                                    <div class="associated-incidents-user-tag ${guiltyTag}" data-id="${value.cid}">Guilty</div>
                                    <div class="associated-incidents-user-tag ${processedTag}" data-id="${value.cid}">Processed</div>
                                    <div class="associated-incidents-user-tag ${associatedTag}" data-id="${value.cid}">Associated</div>
                                </div>
                                <div class="associated-incidents-user-holder" data-name="${value.cid}">
                                </div>
                                <div class="manage-incidents-title-tag" data-id="${value.cid}">Recommended Fine</div>
                                <div class="associated-incidents-fine-input" data-id="${value.cid}"><img src="https://i.imgur.com/h7S5f9J.png"> <input placeholder="0" disabled class="fine-recommended-amount" id="fine-recommended-amount" data-id="${value.cid}" type="number"></div>
                                <div class="manage-incidents-title-tag" data-id="${value.cid}">Recommended Sentence</div>
                                <div class="associated-incidents-sentence-input" data-id="${value.cid}"><img src="https://i.imgur.com/9Xn6xXK.png"> <input placeholder="0" disabled class="sentence-recommended-amount" id="sentence-recommended-amount" data-id="${value.cid}" type="number"></div>            
                                <div class="manage-incidents-title-tag" data-id="${value.cid}">Fine</div>
                                <div class="associated-incidents-fine-input" data-id="${value.cid}"><img src="https://i.imgur.com/h7S5f9J.png"> <input placeholder="Enter fine here..." value="0" class="fine-amount" data-id="${value.cid}" type="number"></div>
                                <div class="manage-incidents-title-tag" data-id="${value.cid}">Sentence</div>
                                <div class="associated-incidents-sentence-input" data-id="${value.cid}"><img src="https://i.imgur.com/9Xn6xXK.png"> <input placeholder="Enter months here..." value="0" class="sentence-amount" data-id="${value.cid}" type="number"></div>
                            </div>`
                        );
                    }
                }
                
                $(".fine-amount").filter("[data-id='" + value.cid + "']").val(value.fine)
                $(".sentence-amount").filter("[data-id='" + value.cid + "']").val(value.sentence)

                $(".fine-recommended-amount").filter("[data-id='" + value.cid + "']").val(value.recfine)
                $(".sentence-recommended-amount").filter("[data-id='" + value.cid + "']").val(value.recsentence)

                const charges = value['charges']
                for (var i = 0; i < charges.length; i++) {
                    const randomNum = Math.ceil(Math.random() * 1000).toString()
                    $(`[data-name="${cid}"]`).prepend(`<div class="white-tag" data-link="${randomNum}" data-id="${cid}">${charges[i]}</div>`);
                }
            })

        } else if (e.type == "incidentSearchPerson") {
            let table = e.data
            $(".icidents-person-search-holder").empty();
            $.each(table, function (index, value) {
                let name = value.firstname + " " + value.lastname
                $(".icidents-person-search-holder").prepend(
                    `
                    <div class="icidents-person-search-item" data-info="${name} (#${value.id})" data-cid="${value.id}" data-name="${name}">
                        <img src="${value.profilepic}" class="icidents-person-search-item-pfp">
                        <div class="icidents-person-search-item-right">
                            <div class="icidents-person-search-item-right-cid-title">Citizen ID</div>
                            <div class="icidents-person-search-item-right-cid-input"><span class="fas fa-id-card"></span> ${value.id}</div>
                            <div class="icidents-person-search-item-right-name-title">Name</div>
                            <div class="icidents-person-search-item-right-name-input"><span class="fas fa-user"></span> ${name}</div>
                        </div>
                    </div>
                    `
                )
            })
        } else if (e.type == "boloData") {
            let table = e.data
            $(".manage-bolos-editing-title").html("You are currently editing BOLO " + table["id"]);
            
            if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
                $(".manage-bolos-editing-title").html("You are editing ICU Check-in " + table["id"]);
            }

            $(".manage-bolos-editing-title").data("id", Number(table["id"]));

            $(".manage-bolos-input-title").val(table["title"]);
            $(".manage-bolos-input-plate").val(table["plate"]);
            $(".manage-bolos-input-owner").val(table["owner"]);
            $(".manage-bolos-input-individual").val(table["individual"]);

            $(".manage-bolos-reports-content").val(table["detail"]);

            $(".manage-bolos-tags-holder").empty();
            $.each(JSON.parse(table["tags"]), function (index, value) {
                $('.manage-bolos-tags-holder').prepend(`<div class="tag-bolo-input">${value}</div>`);
            })

            $(".bolo-gallery-inner-container").empty();
            $.each(JSON.parse(table["gallery"]), function (index, value) {
                let randomNum = Math.ceil(Math.random() * 10).toString()
                $('.bolo-gallery-inner-container').prepend(`<img src="${value}" class="bolo-img ${randomNum}" onerror="this.src='https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg'">`);
            })

            $(".manage-officeun-tags-holder").empty();
            $.each(JSON.parse(table["officers"]), function (index, value) {
                $('.manage-officeun-tags-holder').prepend(`<div class="manage-bolos-officers">${value}</div>`);
            })

        } else if (e.type == "bolos") {
            let table = e.data
            var reportName = "General BOLO"
            canSearchForProfiles = true
            $(".bolos-items").empty();
            if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {reportName = "ICU Check-in"}
            $.each(table, function (index, value) {
                if (value.type == "ambulance") {
                    if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
                        $('.bolos-items').prepend(
                            `<div class="bolo-item" data-id="${value.id}">
                            <div class="bolo-top-holder">
                                <div class="bolo-item-title">${value.title}</div>
                                <div class="bolo-report-name">${reportName}</div>
                            </div>
                            <div class="bolo-bottom-holder">
                                <div class="bolo-report-id">ID: ${value.id}</div>
                                <div class="bolo-report-time-ago">${value.author} - ${timeAgo(Number(value.time))}</div>
                            </div>
                        </div>`
                        )
                    }
                } else if (value.type == "police") {
                    if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602343483260958/sasp_badge.png') {
                        $('.bolos-items').prepend(
                            `<div class="bolo-item" data-id="${value.id}">
                            <div class="bolo-top-holder">
                                <div class="bolo-item-title">${value.title}</div>
                                <div class="bolo-report-name">${reportName}</div>
                            </div>
                            <div class="bolo-bottom-holder">
                                <div class="bolo-report-id">ID: ${value.id}</div>
                                <div class="bolo-report-time-ago">${value.author} - ${timeAgo(Number(value.time))}</div>
                            </div>
                        </div>`
                        )
                    }
                }
            })
        } else if (e.type == "missing") {
            let table = e.data
            let image = "https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg"
            $(".missing-items").empty();
            canSearchForVehicles = true
            $.each(table, function (index, value) {
                if (value.image) {
                    image = value.image
                }
                $('.missing-items').prepend(`
                <div class="missing-item" data-id="${value.id}" data-dbid="${value.id}" data-cid="${value.identifier}">
                    <img src="${image}" class="missing-image">
                    <div style="display: flex; flex-direction: column; margin-top: 2.5px; margin-left: 5px; width: 100%; padding: 5px;">
                    <div style="display: flex; flex-direction: column;">
                        <div class="missing-item-title">${value.name}</div></div>
                        <div class="missing-bottom-info">
                            <div class="missing-id">ID: ${value.id} · Last Seen: ${timeAgo(Number(value.lastseen))}</div>
                        </div>
                    </div>
                </div>
                `)
            })
        } else if (e.type == "boloComplete") {
            let id = e.data
            if (canRefreshBolo == true) {
                canRefreshBolo = false
                $(".bolos-search-refresh").empty();
                $('.bolos-search-refresh').prepend(`<span class="fas fa-spinner fa-spin"></span>`);
                setTimeout(() => {
                    $(".bolos-search-refresh").empty();
                    $(".bolos-search-refresh").html("Refresh");
                    canRefreshBolo = true
                    $.post(`https://${GetParentResourceName()}/getAllBolos`, JSON.stringify({}));
                }, 1500);
            }
            $(".manage-bolos-editing-title").html("You are currently editing BOLO " + id);
            $(".manage-bolos-editing-title").data("id", Number(id));
        } else if (e.type == "reportComplete") {
            let id = e.data
            if (canRefreshReports == true) {
                canRefreshReports = false
                $(".reports-search-refresh").empty();
                $('.reports-search-refresh').prepend(`<span class="fas fa-spinner fa-spin"></span>`);
                setTimeout(() => {
                    $(".reports-search-refresh").empty();
                    $(".reports-search-refresh").html("Refresh");
                    canRefreshReports = true
                    $.post(`https://${GetParentResourceName()}/getAllReports`, JSON.stringify({}));
                }, 1500);
            }
            $(".manage-reports-editing-title").html("You are currently editing report " + id);
            $(".manage-reports-editing-title").data("id", Number(id));
        } else if (e.type == "reports") {
            let table = e.data
            canSearchForReports = true
            $(".reports-items").empty();
            $.each(table, function (index, value) {
                if (value.type == "ambulance") {
                    if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602342275301396/ems_badge.png') {
                        $('.reports-items').prepend(
                            `<div class="reports-item" data-id="${value.id}">
                            <div class="reports-top-holder">
                                <div class="reports-item-title">${value.title}</div>
                                <div class="reports-report-name">${value.reporttype} Report</div>
                            </div>
                            <div class="reports-bottom-holder">
                                <div class="reports-report-id">ID: ${value.id}</div>
                                <div class="reports-report-time-ago">${value.author} - ${timeAgo(Number(value.time))}</div>
                            </div>
                        </div>`
                        )
                    }
                } else if (value.type == "police") {
                    if ($(".badge-logo").attr('src') == 'https://cdn.discordapp.com/attachments/770324167894761522/912602343483260958/sasp_badge.png') {
                        $('.reports-items').prepend(
                            `<div class="reports-item" data-id="${value.id}">
                            <div class="reports-top-holder">
                                <div class="reports-item-title">${value.title}</div>
                                <div class="reports-report-name">${value.reporttype} Report</div>
                            </div>
                            <div class="reports-bottom-holder">
                                <div class="reports-report-id">ID: ${value.id}</div>
                                <div class="reports-report-time-ago">${value.author} - ${timeAgo(Number(value.time))}</div>
                            </div>
                        </div>`
                        )
                    }
                }
            })
        } else if (e.type == "reportData") {
            let table = e.data

            $(".manage-reports-editing-title").html("You are currently editing report " + table["id"]);

            $(".manage-reports-editing-title").data("id", Number(table["id"]));

            $(".manage-reports-input-title").val(table["title"]);
            $(".manage-reports-input-type").val(table["reporttype"]);
            $(".manage-reports-reports-content").val(table["detail"]);

            $(".manage-reports-tags-holder").empty();
            $(".reports-gallery-inner-container").empty();
            $(".reports-officeun-tags-holder").empty();
            $(".reports-civilians-tags-holder").empty();
            $.each(JSON.parse(table["tags"]), function (index, value) {
                $('.manage-reports-tags-holder').append(`<div class="manage-reports-tags">${value}</div>`);
            })
            $.each(JSON.parse(table["gallery"]), function (index, value) {
                let randomNum = Math.ceil(Math.random() * 10).toString()
                $('.reports-gallery-inner-container').append(`<img src="${value}" class="reports-img ${randomNum}" onerror="this.src='https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg'">`);
            })
            $.each(JSON.parse(table["officers"]), function (index, value) {
                $('.reports-officeun-tags-holder').append(`<div class="manage-reports-officers">${value}</div>`);
            })
            $.each(JSON.parse(table["civilians"]), function (index, value) {
                $('.reports-civilians-tags-holder').append(`<div class="manage-reports-civilians">${value}</div>`);
            })
        } else if (e.type == "searchedVehicles") {
            let table = e.data
            $(".dmv-items").empty();
            canSearchForVehicles = true
            $.each(table, function (index, value) {
                let paint = value.color
                let impound = "red-tag"
                let bolo = "red-tag"
                let codefive = "red-tag"
                let stolen = "red-tag"

                if (value.impound) {
                    impound = "green-tag"
                }

                if (value.bolo) {
                    bolo = "green-tag"
                }

                if (value.code) {
                    codefive = "green-tag"
                }

                if (value.stolen) {
                    stolen = "green-tag"
                }
                

                $('.dmv-items').prepend(`
                <div class="dmv-item" data-id="${value.id}" data-dbid="${value.dbid}" data-plate="${value.plate}">
                    <img src="${value.image}" class="dmv-image">
                    <div style="display: flex; flex-direction: column; margin-top: 2.5px; margin-left: 5px; width: 100%; padding: 5px;">
                    <div style="display: flex; flex-direction: column;">
                        <div class="dmv-item-title">${value.model}</div>
                            <div class="dmv-tags">
                                <div class="dmv-tag ${impound}">Impound</div>
                                <div class="dmv-tag ${bolo}">BOLO</div>
                                <div class="dmv-tag ${stolen}">Stolen</div>
                                <div class="dmv-tag ${codefive}">Code 5</div>
                            </div>
                        </div>
                        <div class="dmv-bottom-info">
                            <div class="dmv-id">ID: ${value.id} · Owner: ${value.owner}</div>
                        </div>
                    </div>
                </div>
                `)
            })
        } else if (e.type == "searchedWeapons") {
            let table = e.data
            let image = "https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg"
            $(".weapons-items").empty();
            canSearchForVehicles = true
            $.each(table, function (index, value) {
                if (value.image) {
                    image = value.image
                }
                $('.weapons-items').prepend(`
                <div class="weapon-item" data-id="${value.id}" data-dbid="${value.id}" data-plate="${value.serialnumber}">
                    <img src="${image}" class="weapon-image">
                    <div style="display: flex; flex-direction: column; margin-top: 2.5px; margin-left: 5px; width: 100%; padding: 5px;">
                    <div style="display: flex; flex-direction: column;">
                        <div class="weapon-item-title">${value.serialnumber}</div></div>
                        <div class="weapon-bottom-info">
                            <div class="weapon-id">ID: ${value.id} · Owner: ${value.owner}</div>
                        </div>
                    </div>
                </div>
                `)
            })
        }
        else if (e.type == "searchedMissing") {
            let table = e.data
            let image = "https://cdn.discordapp.com/attachments/770324167894761522/912602343164502096/not-found.jpg"
            $(".missing-items").empty();
            canSearchForVehicles = true
            $.each(table, function (index, value) {
                if (value.image) {
                    image = value.image
                }
                $('.missing-items').prepend(`
                <div class="missing-item" data-id="${value.id}" data-dbid="${value.id}" data-cid="${value.identifier}">
                    <img src="${image}" class="missing-image">
                    <div style="display: flex; flex-direction: column; margin-top: 2.5px; margin-left: 5px; width: 100%; padding: 5px;">
                    <div style="display: flex; flex-direction: column;">
                        <div class="missing-item-title">${value.name}</div></div>
                        <div class="missing-bottom-info">
                            <div class="missing-id">ID: ${value.id} · Last Seen: ${timeAgo(Number(value.lastseen))}</div>
                        </div>
                    </div>
                </div>
                `)
            })
        } else if (e.type == "getVehicleData") {
            let table = e.data

            $(".vehicle-information-title-holder").data("dbid", Number(table["dbid"]));

            $(".vehicle-info-plate-input").val(table["plate"]);
            $(".vehicle-info-owner-input").val(table["name"]);
            $(".vehicle-info-class-input").val(table["class"]);
            $(".vehicle-info-model-input").val(table["model"]);
            $(".vehicle-info-imageurl-input").val(table["image"]);
            
            $(".vehicle-info-content").val(table["information"]);

            $(".vehicle-tags").empty();
            $(".vehicle-info-image").attr("src", table["image"]);

            let impound = "red-tag"
            let bolo = "red-tag"
            let codefive = "red-tag"
            let stolen = "red-tag"

            if (table.impound) {
                impound = "green-tag"
            }

            if (table.bolo) {
                bolo = "green-tag"
            }

            if (table.code) {
                codefive = "green-tag"
            }

            if (table.stolen) {
                stolen = "green-tag"
            }

            $('.vehicle-tags').append(`<div class="vehicle-tag ${impound}">Impound</div>`);
            $('.vehicle-tags').append(`<div class="vehicle-tag ${bolo}">BOLO</div>`);
            $('.vehicle-tags').append(`<div class="vehicle-tag ${codefive} code5-tag">Code 5</div>`);
            $('.vehicle-tags').append(`<div class="vehicle-tag ${stolen} stolen-tag">Stolen</div>`);
            $(".vehicle-info-imageurl-input").val(table["image"]);
        } else if (e.type == "getWeaponData") {
            let table = e.data
            $(".weapon-information-title-holder").data("dbid", Number(table["id"]));
            $(".weapon-info-plate-input").val(table["serialnumber"]);
            $(".weapon-info-owner-input").val(table["owner"]);
            $(".weapon-info-class-input").val(table["brand"]);
            $(".weapon-info-model-input").val(table["type"]);
            $(".weapon-info-imageurl-input").val(table["image"]);
            $(".weapon-info-content").val(table["information"]);
            $(".weapon-tags").empty();
            $(".weapon-info-image").attr("src", table["image"]);
        } else if (e.type == "getMissingData") {
            let table = e.data
            $(".missing-information-title-holder").data("dbid", Number(table["id"]));
            $(".missing-info-plate-input").val(table["name"]);
            $(".missing-info-owner-input").val(timeAgo(Number(table["date"])));
            $(".missing-info-class-input").val(table["age"]);
            $(".missing-info-model-input").val(timeAgo(Number(table["lastseen"])));
            $(".missing-info-imageurl-input").val(table["image"]);
            $(".missing-info-content").val(table["notes"]);
            $(".missing-tags").empty();
            $(".missing-info-image").attr("src", table["image"]);
        } else if (e.type == "updateVehicleDbId") {
            $(".vehicle-information-title-holder").data("dbid", Number(e.data));
        } else if (e.type == "updateIncidentDbId") {
            $(".manage-incidents-editing-title").data("id", Number(e.data));
            
            $(".manage-incidents-tags-add-btn").css("pointer-events", "auto")
            $(".manage-incidents-reports-content").css("pointer-events", "auto")
            $(".manage-incidents-officeun-add-btn").css("pointer-events", "auto")
            $(".manage-incidents-civilians-add-btn").css("pointer-events", "auto")
            $(".manage-incidents-evidence-add-btn").css("pointer-events", "auto")
            $(".associated-incidents-tags-add-btn").css("pointer-events", "auto")
        } else if (e.type == "callDetach") {
            $(".active-calls-item").filter("[data-id='" + e.callid + "']").children().children().find(".call-radio").html(e.data)
        } else if (e.type == "callAttach") {
            $(".active-calls-item").filter("[data-id='" + e.callid + "']").children().children().find(".call-radio").html(e.data)
        } else if (e.type == "getAllLogs") {
            let table = e.data
            $(".stafflogs-container").empty();
            $.each(table, function (index, value) {
                $('.stafflogs-container').prepend(`<p style="margin : 0; padding-top:0.8vh;">• ${value.log} <span style="color: grey; float: right; padding-right: 1vh;">(${timeAgo(Number(value.time))})</span></p>`)
            })
        } else if (e.type == "getActiveUnits") {
            var PoliceCount = 0
            var EmsCount = 0
            var DocCount = 0
            var PaCount = 0

            const lspd = e.lspd
            const ems = e.ems

            $(".active-unit-list").empty();

            $.each(lspd, function (index, value) {
                var status = "10-8"
                var statuscolor = "green-status"
                var radio = "0"
                var callsign = "000"
                if (value.duty == 0) { 
                    status = "10-7"
                    statuscolor = "yellow-status"
                } else if (value.duty == 1) {
                    PoliceCount = PoliceCount + 1
                }
                if (value.radio) { radio = value.radio }
                if (value.callsign) { callsign = value.callsign }
                $('.active-unit-list').prepend(`
                <div class="active-unit-item" data-id="${value.cid}">
                    <div class="unit-status ${statuscolor}">${status}</div>
                    <div class="unit-job active-info-job-lspd">LSPD</div>
                    <div class="unit-name">(${callsign}) ${value.name}</div>
                    <div class="unit-radio">${radio}</div>
                </div>
                `)
            })

            $.each(ems, function (index, value) {
                var status = "10-8"
                var statuscolor = "green-status"
                var radio = "0"
                var callsign = "000"
                if (value.duty == 0) { 
                    status = "10-7"
                    statuscolor = "yellow-status"
                } else if (value.duty == 1) {
                    EmsCount = EmsCount + 1
                }
                if (value.radio) { radio = value.radio }
                if (value.callsign) { callsign = value.callsign }
                $('.active-unit-list').prepend(`
                <div class="active-unit-item" data-id="${value.cid}">
                    <div class="unit-status ${statuscolor}">${status}</div>
                    <div class="unit-job active-info-job-ambulance">MZ</div>
                    <div class="unit-name">(${callsign}) ${value.name}</div>
                    <div class="unit-radio">${radio}</div>
                </div>
                `)
            })

            $("#police-count").html(PoliceCount)
            $("#ems-count").html(EmsCount)

        } else if (e.type == "UpdatePoliceRoster") {
            PoliceRoster = e.data
        } else if (e.type == "UpdateEMSRoster") {
            EMSRoster = e.data
        }
    });
})

function fidgetSpinner(page) {
    $(".close-all").fadeOut(0)
    $(".container-load").fadeIn(0);
    if (page == '.bolos-page-container') {
        $.post(`https://${GetParentResourceName()}/getAllBolos`, JSON.stringify({}));
    }
    if (page == '.missing-page-container') {
        $.post(`https://${GetParentResourceName()}/getAllMissing`, JSON.stringify({}));
    }
    if (page == '.reports-page-container') {
        $.post(`https://${GetParentResourceName()}/getAllReports`, JSON.stringify({}));
    }
    if (page == '.stafflogs-page-container') {
        $.post(`https://${GetParentResourceName()}/getAllLogs`, JSON.stringify({}));
    }
    if (page == '.incidents-page-container') {
        $.post(`https://${GetParentResourceName()}/getAllIncidents`, JSON.stringify({}));
    }
    $(".container-load").fadeOut(0);
    $(page).fadeIn(0)  
}

function timeShit() {
    let localDate = new Date();
    date = localDate.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
    time = localDate.toLocaleTimeString('en-US', { timeZone: 'America/New_York' });
    $(".date").html(date)
    $(".time").html(time)
}

setInterval(timeShit, 1000)

function addTag(tagInput) {
    $('.tags-holder').prepend(`<div class="tag">${tagInput}</div>`);

    $.post(`https://${GetParentResourceName()}/newTag`, JSON.stringify({
        id: $(".manage-profile-citizenid-input").val(),
        tag: tagInput
    }));

}

function addWeapon(Input) {
    $('.weapons-holder').prepend(`<div class="tag">${Input}</div>`);
    $.post(`https://${GetParentResourceName()}/newWeapon`, JSON.stringify({
        id: $(".manage-profile-citizenid-input").val(),
        serialnumber: Input
    }));
}

// Context menu

var menu = document.querySelector('.contextmenu');

function showMenu(x, y) {
    $(".contextmenu").css("left", x + 'px');
    $(".contextmenu").css("top", y + 'px');
    $(".contextmenu").addClass("contextmenu-show");
}

function hideMenu() {
    $(".contextmenu").removeClass("contextmenu-show");
}

function onMouseDown(e) {
    hideMenu();
    document.removeEventListener('mouseup', onMouseDown);
}

function openContextMenu(e, args) {
    if (isPublicRecords == false) {
        e.preventDefault();
        showMenu(e.pageX, e.pageY);
        $(".contextmenu").empty();
        $.each(args, function (index, value) {
            if (value.status !== "blur(5px)") {
                $(".contextmenu").prepend(
                    `
                    <li class="contextmenu-item ${value.className}" data-info="${value.info}" data-status="${value.status}">
                        <a href="#" class="contextmenu-btn">
                            <i class="${value.icon}"></i>
                            <span class="contextmenu-text">${value.text}</span>
                        </a>
                    </li>
                    `
                );
            }
        })
        document.addEventListener('mouseup', onMouseDown);
    }
}

function expandImage(url) {
    $(".close-all").css("filter", "brightness(35%)");
    $(".gallery-image-enlarged").fadeIn(150);
    $(".gallery-image-enlarged").css("display", "block");
    $(".gallery-image-enlarged").attr("src", url);
}

function removeImage(url) {
    let cid = $(".manage-profile-citizenid-input").val();
    $(".gallery-inner-container img").filter("[src='" + url + "']").remove();
    $.post(`https://${GetParentResourceName()}/removeGalleryImg`, JSON.stringify({
        cid: cid,
        URL: url
    }));
}

function hideIcidentsMenu() {
    if ($(".icidents-person-search-container").css("display") != "none" && ! mouse_is_inside) {
        $(".icidents-person-search-container").fadeOut(250);
        $(".close-all").css("filter", "none");
    }
}

function onMouseDownIcidents(e) {
    hideIcidentsMenu();
    document.removeEventListener('mouseup', onMouseDownIcidents);
}

window.addEventListener("load", function(){
    document.getElementById("offenses-search").addEventListener("keyup", function(){
      var search = this.value.toLowerCase();
          if (search.length > 1) {
              $.each($(".offense-item"), function(i, d) {
                  const Name = $(this).find(".offense-item-offense").html().toLowerCase();
                  const Number = $(this).find(".offense-item-id").html().toLowerCase();
                  if (Name.includes(search)) {
                      $(this).show()
                  } else if (Number.includes(search)) {
                      $(this).show()
                  } else {
                      $(this).hide()
                  }
              })
          } else {
              $.each($(".offense-item"), function(i, d) {
                  $(this).show()
              })
          }
    });
});