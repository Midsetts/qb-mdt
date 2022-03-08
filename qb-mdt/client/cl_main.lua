local isOpen = false
local callSign = ""
local QBCore = nil
local insidePublicRecordsZone = false

local ColorNames = {
    [0] = "Metallic Black",
    [1] = "Metallic Graphite Black",
    [2] = "Metallic Black Steel",
    [3] = "Metallic Dark Silver",
    [4] = "Metallic Silver",
    [5] = "Metallic Blue Silver",
    [6] = "Metallic Steel Gray",
    [7] = "Metallic Shadow Silver",
    [8] = "Metallic Stone Silver",
    [9] = "Metallic Midnight Silver",
    [10] = "Metallic Gun Metal",
    [11] = "Metallic Anthracite Grey",
    [12] = "Matte Black",
    [13] = "Matte Gray",
    [14] = "Matte Light Grey",
    [15] = "Util Black",
    [16] = "Util Black Poly",
    [17] = "Util Dark silver",
    [18] = "Util Silver",
    [19] = "Util Gun Metal",
    [20] = "Util Shadow Silver",
    [21] = "Worn Black",
    [22] = "Worn Graphite",
    [23] = "Worn Silver Grey",
    [24] = "Worn Silver",
    [25] = "Worn Blue Silver",
    [26] = "Worn Shadow Silver",
    [27] = "Metallic Red",
    [28] = "Metallic Torino Red",
    [29] = "Metallic Formula Red",
    [30] = "Metallic Blaze Red",
    [31] = "Metallic Graceful Red",
    [32] = "Metallic Garnet Red",
    [33] = "Metallic Desert Red",
    [34] = "Metallic Cabernet Red",
    [35] = "Metallic Candy Red",
    [36] = "Metallic Sunrise Orange",
    [37] = "Metallic Classic Gold",
    [38] = "Metallic Orange",
    [39] = "Matte Red",
    [40] = "Matte Dark Red",
    [41] = "Matte Orange",
    [42] = "Matte Yellow",
    [43] = "Util Red",
    [44] = "Util Bright Red",
    [45] = "Util Garnet Red",
    [46] = "Worn Red",
    [47] = "Worn Golden Red",
    [48] = "Worn Dark Red",
    [49] = "Metallic Dark Green",
    [50] = "Metallic Racing Green",
    [51] = "Metallic Sea Green",
    [52] = "Metallic Olive Green",
    [53] = "Metallic Green",
    [54] = "Metallic Gasoline Blue Green",
    [55] = "Matte Lime Green",
    [56] = "Util Dark Green",
    [57] = "Util Green",
    [58] = "Worn Dark Green",
    [59] = "Worn Green",
    [60] = "Worn Sea Wash",
    [61] = "Metallic Midnight Blue",
    [62] = "Metallic Dark Blue",
    [63] = "Metallic Saxony Blue",
    [64] = "Metallic Blue",
    [65] = "Metallic Mariner Blue",
    [66] = "Metallic Harbor Blue",
    [67] = "Metallic Diamond Blue",
    [68] = "Metallic Surf Blue",
    [69] = "Metallic Nautical Blue",
    [70] = "Metallic Bright Blue",
    [71] = "Metallic Purple Blue",
    [72] = "Metallic Spinnaker Blue",
    [73] = "Metallic Ultra Blue",
    [74] = "Metallic Bright Blue",
    [75] = "Util Dark Blue",
    [76] = "Util Midnight Blue",
    [77] = "Util Blue",
    [78] = "Util Sea Foam Blue",
    [79] = "Uil Lightning blue",
    [80] = "Util Maui Blue Poly",
    [81] = "Util Bright Blue",
    [82] = "Matte Dark Blue",
    [83] = "Matte Blue",
    [84] = "Matte Midnight Blue",
    [85] = "Worn Dark blue",
    [86] = "Worn Blue",
    [87] = "Worn Light blue",
    [88] = "Metallic Taxi Yellow",
    [89] = "Metallic Race Yellow",
    [90] = "Metallic Bronze",
    [91] = "Metallic Yellow Bird",
    [92] = "Metallic Lime",
    [93] = "Metallic Champagne",
    [94] = "Metallic Pueblo Beige",
    [95] = "Metallic Dark Ivory",
    [96] = "Metallic Choco Brown",
    [97] = "Metallic Golden Brown",
    [98] = "Metallic Light Brown",
    [99] = "Metallic Straw Beige",
    [100] = "Metallic Moss Brown",
    [101] = "Metallic Biston Brown",
    [102] = "Metallic Beechwood",
    [103] = "Metallic Dark Beechwood",
    [104] = "Metallic Choco Orange",
    [105] = "Metallic Beach Sand",
    [106] = "Metallic Sun Bleeched Sand",
    [107] = "Metallic Cream",
    [108] = "Util Brown",
    [109] = "Util Medium Brown",
    [110] = "Util Light Brown",
    [111] = "Metallic White",
    [112] = "Metallic Frost White",
    [113] = "Worn Honey Beige",
    [114] = "Worn Brown",
    [115] = "Worn Dark Brown",
    [116] = "Worn straw beige",
    [117] = "Brushed Steel",
    [118] = "Brushed Black steel",
    [119] = "Brushed Aluminium",
    [120] = "Chrome",
    [121] = "Worn Off White",
    [122] = "Util Off White",
    [123] = "Worn Orange",
    [124] = "Worn Light Orange",
    [125] = "Metallic Securicor Green",
    [126] = "Worn Taxi Yellow",
    [127] = "police car blue",
    [128] = "Matte Green",
    [129] = "Matte Brown",
    [130] = "Worn Orange",
    [131] = "Matte White",
    [132] = "Worn White",
    [133] = "Worn Olive Army Green",
    [134] = "Pure White",
    [135] = "Hot Pink",
    [136] = "Salmon pink",
    [137] = "Metallic Vermillion Pink",
    [138] = "Orange",
    [139] = "Green",
    [140] = "Blue",
    [141] = "Mettalic Black Blue",
    [142] = "Metallic Black Purple",
    [143] = "Metallic Black Red",
    [144] = "hunter green",
    [145] = "Metallic Purple",
    [146] = "Metaillic V Dark Blue",
    [147] = "MODSHOP BLACK1",
    [148] = "Matte Purple",
    [149] = "Matte Dark Purple",
    [150] = "Metallic Lava Red",
    [151] = "Matte Forest Green",
    [152] = "Matte Olive Drab",
    [153] = "Matte Desert Brown",
    [154] = "Matte Desert Tan",
    [155] = "Matte Foilage Green",
    [156] = "DEFAULT ALLOY COLOR",
    [157] = "Epsilon Blue",
    [158] = "Unknown",
}

local ColorInformation = {
    [0] = "black",
    [1] = "black",
    [2] = "black",
    [3] = "darksilver",
    [4] = "silver",
    [5] = "bluesilver",
    [6] = "silver",
    [7] = "darksilver",
    [8] = "silver",
    [9] = "bluesilver",
    [10] = "darksilver",
    [11] = "darksilver",
    [12] = "matteblack",
    [13] = "gray",
    [14] = "lightgray",
    [15] = "black",
    [16] = "black",
    [17] = "darksilver",
    [18] = "silver",
    [19] = "utilgunmetal",
    [20] = "silver",
    [21] = "black",
    [22] = "black",
    [23] = "darksilver",
    [24] = "silver",
    [25] = "bluesilver",
    [26] = "darksilver",
    [27] = "red",
    [28] = "torinored",
    [29] = "formulared",
    [30] = "blazered",
    [31] = "gracefulred",
    [32] = "garnetred",
    [33] = "desertred",
    [34] = "cabernetred",
    [35] = "candyred",
    [36] = "orange",
    [37] = "gold",
    [38] = "orange",
    [39] = "red",
    [40] = "mattedarkred",
    [41] = "orange",
    [42] = "matteyellow",
    [43] = "red",
    [44] = "brightred",
    [45] = "garnetred",
    [46] = "red",
    [47] = "red",
    [48] = "darkred",
    [49] = "darkgreen",
    [50] = "racingreen",
    [51] = "seagreen",
    [52] = "olivegreen",
    [53] = "green",
    [54] = "gasolinebluegreen",
    [55] = "mattelimegreen",
    [56] = "darkgreen",
    [57] = "green",
    [58] = "darkgreen",
    [59] = "green",
    [60] = "seawash",
    [61] = "midnightblue",
    [62] = "darkblue",
    [63] = "saxonyblue",
    [64] = "blue",
    [65] = "blue",
    [66] = "blue",
    [67] = "diamondblue",
    [68] = "blue",
    [69] = "blue",
    [70] = "brightblue",
    [71] = "purpleblue",
    [72] = "blue",
    [73] = "ultrablue",
    [74] = "brightblue",
    [75] = "darkblue",
    [76] = "midnightblue",
    [77] = "blue",
    [78] = "blue",
    [79] = "lightningblue",
    [80] = "blue",
    [81] = "brightblue",
    [82] = "mattedarkblue",
    [83] = "matteblue",
    [84] = "matteblue",
    [85] = "darkblue",
    [86] = "blue",
    [87] = "lightningblue",
    [88] = "yellow",
    [89] = "yellow",
    [90] = "bronze",
    [91] = "yellow",
    [92] = "lime",
    [93] = "champagne",
    [94] = "beige",
    [95] = "darkivory",
    [96] = "brown",
    [97] = "brown",
    [98] = "lightbrown",
    [99] = "beige",
    [100] = "brown",
    [101] = "brown",
    [102] = "beechwood",
    [103] = "beechwood",
    [104] = "chocoorange",
    [105] = "yellow",
    [106] = "yellow",
    [107] = "cream",
    [108] = "brown",
    [109] = "brown",
    [110] = "brown",
    [111] = "white",
    [112] = "white",
    [113] = "beige",
    [114] = "brown",
    [115] = "brown",
    [116] = "beige",
    [117] = "steel",
    [118] = "blacksteel",
    [119] = "aluminium",
    [120] = "chrome",
    [121] = "wornwhite",
    [122] = "offwhite",
    [123] = "orange",
    [124] = "lightorange",
    [125] = "green",
    [126] = "yellow",
    [127] = "blue",
    [128] = "green",
    [129] = "brown",
    [130] = "orange",
    [131] = "white",
    [132] = "white",
    [133] = "darkgreen",
    [134] = "white",
    [135] = "pink",
    [136] = "pink",
    [137] = "pink",
    [138] = "orange",
    [139] = "green",
    [140] = "blue",
    [141] = "blackblue",
    [142] = "blackpurple",
    [143] = "blackred",
    [144] = "darkgreen",
    [145] = "purple",
    [146] = "darkblue",
    [147] = "black",
    [148] = "purple",
    [149] = "darkpurple",
    [150] = "red",
    [151] = "darkgreen",
    [152] = "olivedrab",
    [153] = "brown",
    [154] = "tan",
    [155] = "green",
    [156] = "silver",
    [157] = "blue",
    [158] = "black",
}

local classlist = {
    [0] = "Compact",
    [1] = "Sedan",
    [2] = "SUV",
    [3] = "Coupe",
    [4] = "Muscle",
    [5] = "Sport Classic",
    [6] = "Sport",
    [7] = "Super",
    [8] = "Motorbike",
    [9] = "Off-Road",
    [10] = "Industrial",
    [11] = "Utility",
    [12] = "Van",
    [13] = "Bike",
    [14] = "Boat",
    [15] = "Helicopter",
    [16] = "Plane",
    [17] = "Service",
    [18] = "Emergency",
    [19] = "Military",
    [20] = "Commercial",
    [21] = "Train"
}

function DrawText3D(coords, text)
    SetTextScale(0.35, 0.35)
    SetTextFont(4)
    SetTextProportional(1)
    SetTextColour(255, 255, 255, 215)
    SetTextEntry('STRING')
    SetTextCentre(true)
    AddTextComponentString(text)
    SetDrawOrigin(coords, 0)
    DrawText(0.0, 0.0)
    local factor = (string.len(text)) / 370
    DrawRect(0.0, 0.0 + 0.0125, 0.017 + factor, 0.03, 0, 0, 0, 75)
    ClearDrawOrigin()
end

LoadQBCoreVersion = function()
    
    OpenPublicRecords = function()
        isOpen = true
        SetNuiFocus(true, true)
        SendNUIMessage({type = "PublicRecords", settings = Config["PublicRecords"]})
        TriggerEvent('erp-mdt:animation')
        local PlayerInfo = RPC.execute("erp-mdt:getInfo")
        local x, y, z = table.unpack(GetEntityCoords(PlayerPedId()))
        local currentStreetHash, intersectStreetHash = GetStreetNameAtCoord(x, y, z)
        local currentStreetName = GetStreetNameFromHashKey(currentStreetHash)
        local intersectStreetName = GetStreetNameFromHashKey(intersectStreetHash)
        local zone = tostring(GetNameOfZone(x, y, z))
        local area = GetLabelText(zone)
        local playerStreetsLocation = area
        if not zone then zone = "UNKNOWN" end;
        if intersectStreetName ~= nil and intersectStreetName ~= "" then playerStreetsLocation = currentStreetName .. ", " .. intersectStreetName .. ", " .. area
        elseif currentStreetName ~= nil and currentStreetName ~= "" then playerStreetsLocation = currentStreetName .. ", " .. area
        else playerStreetsLocation = area end
        SendNUIMessage({type = "data", name = "Welcome, " ..PlayerInfo.firstname..' '..PlayerInfo.lastname, location = playerStreetsLocation, fullname = PlayerInfo.firstname..' '..PlayerInfo.lastname})
    end
    function EnableGUI(enable)
        if enable then 
            SendNUIMessage({type = "bulletin", data = RPC.execute("erp-mdt:dashboardbulletin")})
            SendNUIMessage({type = "dispatchmessages", data = RPC.execute("erp-mdt:dashboardMessages")})
            SendNUIMessage({type = "getActiveUnits", lspd = RPC.execute("erp-mdt:getActiveLSPD"), ems = RPC.execute("erp-mdt:getActiveEMS")})
            SendNUIMessage({type = "UpdatePoliceRoster", data = Config["PoliceRosterLink"]})
            SendNUIMessage({type = "UpdateEMSRoster", data = Config["EMSRosterLink"]})
            SendNUIMessage({type = "warrants", data = RPC.execute("erp-mdt:getWarrants")})
        end
        SetNuiFocus(enable, enable)
        SendNUIMessage({type = "show", enable = enable, job = QBCore.Functions.GetPlayerData().job.name, isAdmin = RPC.execute("erp-mdt:isAdmin")})
        isOpen = enable
        TriggerEvent('erp-mdt:animation')
    end
    function RefreshGUI()
        SetNuiFocus(false, false)
        SendNUIMessage({type = "show", enable = false, job = QBCore.Functions.GetPlayerData().job.name, isAdmin = RPC.execute("erp-mdt:isAdmin")})
        isOpen = false
    end
    AddEventHandler('erp-mdt:animation', function()
        if not isOpen then 
            return 
        end
        RequestAnimDict("amb@code_human_in_bus_passenger_idles@female@tablet@base")
        while not HasAnimDictLoaded("amb@code_human_in_bus_passenger_idles@female@tablet@base") do 
            Citizen.Wait(100) 
        end
        RequestModel(`prop_cs_tablet`)
        while not HasModelLoaded(`prop_cs_tablet`) do 
            Citizen.Wait(100) 
        end
        local plyPed = PlayerPedId()
        local tabletObj = CreateObject(`prop_cs_tablet`, 0.0, 0.0, 0.0, true, true, false)
        local tabletBoneIndex = GetPedBoneIndex(plyPed, 60309)
        AttachEntityToEntity(tabletObj, plyPed, tabletBoneIndex, vector3(0.03, 0.002, -0.0), vector3(10.0, 160.0, 0.0), true, false, false, false, 2, true)
        SetModelAsNoLongerNeeded(`prop_cs_tablet`)
        CreateThread(function()
            while isOpen do
                Wait(0)
                if not IsEntityPlayingAnim(plyPed, "amb@code_human_in_bus_passenger_idles@female@tablet@base", "base", 3) then
                    TaskPlayAnim(plyPed, "amb@code_human_in_bus_passenger_idles@female@tablet@base", "base", 3.0, 3.0, -1, 49, 0, 0, 0, 0)
                end
            end
            ClearPedSecondaryTask(plyPed)
            Citizen.Wait(250)
            DetachEntity(tabletObj, true, false)
            DeleteEntity(tabletObj)
            return
        end)
    end)
    local function CurrentDuty(duty)
        if duty == 1 then
            return "10-41"
        end
        return "10-42"
    end
    RegisterNUICallback("deleteBulletin", function(data, cb)
        local ignoreId, sentData, job = RPC.execute("erp-mdt:deleteBulletin", data.id, data.time)
        if ignoreId == GetPlayerServerId(PlayerId()) then 
            return 
        end
        if job == 'police' and QBCore.Functions.GetPlayerData().job.name == "police" then
            SendNUIMessage({type = "deleteBulletin", data = sentData})
        elseif job == QBCore.Functions.GetPlayerData().job.name then
            SendNUIMessage({type = "deleteBulletin", data = sentData})
        end
    end)
    RegisterNUICallback("updateLicence", function(data, cb)
        local type = data.type
        local status = data.status
        local cid = data.cid
        RPC.execute("erp-mdt:updateLicence", type, status, cid)
    end)
    RegisterNUICallback("newBulletin", function(data, cb)
        local ignoreId, sentData, job = RPC.execute("erp-mdt:newBulletin", data.title, data.info, data.time)
        if ignoreId == GetPlayerServerId(PlayerId()) then 
            return 
        end
        if job == 'police' and QBCore.Functions.GetPlayerData().job.name == "police" then
            SendNUIMessage({type = "newBulletin", data = sentData})
        elseif job == QBCore.Functions.GetPlayerData().job.name then
            SendNUIMessage({type = "newBulletin", data = sentData})
        end
    end)
    RegisterNetEvent('erp-mdt:open')
    AddEventHandler('erp-mdt:open', function(job, jobLabel, lastname, firstname)
        open = true
        EnableGUI(open)
        local x, y, z = table.unpack(GetEntityCoords(PlayerPedId()))
        local currentStreetHash, intersectStreetHash = GetStreetNameAtCoord(x, y, z)
        local currentStreetName = GetStreetNameFromHashKey(currentStreetHash)
        local intersectStreetName = GetStreetNameFromHashKey(intersectStreetHash)
        local zone = tostring(GetNameOfZone(x, y, z))
        local area = GetLabelText(zone)
        local playerStreetsLocation = area
        if not zone then zone = "UNKNOWN" end;
        if intersectStreetName ~= nil and intersectStreetName ~= "" then playerStreetsLocation = currentStreetName .. ", " .. intersectStreetName .. ", " .. area
        elseif currentStreetName ~= nil and currentStreetName ~= "" then playerStreetsLocation = currentStreetName .. ", " .. area
        else playerStreetsLocation = area end
        SendNUIMessage({type = "data", name = "Welcome, " ..jobLabel..' '..lastname, location = playerStreetsLocation, fullname = firstname..' '..lastname})
    end)
    RegisterNUICallback('escape', function(data, cb)
        open = false
        EnableGUI(open)
    end)
    RegisterNUICallback("searchProfiles", function(data, cb)
        SendNUIMessage({type = "profiles", data = RPC.execute("erp-mdt:searchProfile", data.name), isLimited = RPC.execute("erp-mdt:isLimited")})
    end)
    RegisterNUICallback("saveProfile", function(data, cb)
        RPC.execute("erp-mdt:saveProfile", data.pfp, data.description, data.id)
    end)
    RegisterNUICallback("newWeapon", function(data, cb)
        RPC.execute("erp-mdt:addWeapon", data.id, data.serialnumber)
    end)
    RegisterNUICallback("getProfileData", function(data, cb)
        local isLimited = RPC.execute("erp-mdt:isLimited")
        local ProfileData = RPC.execute("erp-mdt:getProfileData", data.id)
        if not isLimited then
            local vehicles = ProfileData['vehicles']
            for i = 1, #vehicles do
                ProfileData['vehicles'][i]['plate'] = string.upper(ProfileData['vehicles'][i]['plate'])
                local tempModel = vehicles[i]['model']
                if tempModel and tempModel ~= "Unknown" then
                    local DisplayNameModel = GetDisplayNameFromVehicleModel(tempModel)
                    local LabelText = GetLabelText(DisplayNameModel)
                    if LabelText == "NULL" then LabelText = DisplayNameModel end
                    ProfileData['vehicles'][i]['model'] = LabelText
                end
            end
        end
        SendNUIMessage({type = "profileData", data = ProfileData, isLimited = isLimited})
    end)
    RegisterNUICallback("newTag", function(data, cb)
        if data.id ~= "" and data.tag ~= "" then
            RPC.execute("erp-mdt:newTag", data.id, data.tag)
        end
    end)
    RegisterNUICallback("removeProfileTag", function(data, cb)
        RPC.execute("erp-mdt:removeProfileTag", data.cid, data.text)
    end)
    RegisterNUICallback("addGalleryImg", function(data, cb)
        RPC.execute("erp-mdt:addGalleryImg", data.cid, data.URL)
    end)
    RegisterNUICallback("missingCitizen", function(data, cb)
        RPC.execute("erp-mdt:missingCitizen", data.cid, data.bool)
    end)
    RegisterNUICallback("removeGalleryImg", function(data, cb)
        RPC.execute("erp-mdt:removeGalleryImg", data.cid, data.URL)
    end)
    RegisterNUICallback("searchIncidents", function(data, cb)
        SendNUIMessage({type = "incidents", data = RPC.execute("erp-mdt:searchIncidents", data.incident)})
    end)
    RegisterNUICallback("getIncidentData", function(data, cb)
        local sentData, sentConvictions = RPC.execute("erp-mdt:getIncidentData", data.id)
        SendNUIMessage({type = "incidentData", data = sentData, convictions = sentConvictions})
    end)
    RegisterNUICallback("incidentSearchPerson", function(data, cb)
        SendNUIMessage({type = "incidentSearchPerson", data = RPC.execute("erp-mdt:incidentSearchPerson", data.name)})
    end)
    RegisterNUICallback("searchBolos", function(data, cb)
        SendNUIMessage({type = "bolos", data = RPC.execute("erp-mdt:searchBolos", data.searchVal)})
    end)
    RegisterNUICallback("getAllBolos", function(data, cb)
        SendNUIMessage({type = "bolos", data = RPC.execute("erp-mdt:getAllBolos")})
    end)
    RegisterNUICallback("getAllMissing", function(data, cb)
        SendNUIMessage({type = "missing", data = RPC.execute("erp-mdt:getAllMissing")})
    end)
    RegisterNUICallback("getAllIncidents", function(data, cb)
        SendNUIMessage({type = "incidents", data = RPC.execute("erp-mdt:getAllIncidents")})
    end)
    RegisterNUICallback("getBoloData", function(data, cb)
        SendNUIMessage({type = "boloData", data = RPC.execute("erp-mdt:getBoloData", data.id)})
    end)
    RegisterNUICallback("jailPlayer", function(data, cb)
        RPC.execute("erp-mdt:JailPlayer", data.cid, data.time)
    end)
    RegisterNUICallback("newBolo", function(data, cb)
        local sentData = RPC.execute("erp-mdt:newBolo", data.existing, data.id, data.title, data.plate, data.owner, data.individual, data.detail, data.tags, data.gallery, data.officers, data.time)
        SendNUIMessage({type = "boloComplete", data = sentData})
    end)
    RegisterNUICallback("deleteBolo", function(data, cb)
        RPC.execute("erp-mdt:deleteBolo", data.id, data.time)
    end)
    RegisterNUICallback("deleteIncident", function(data, cb)
        RPC.execute("erp-mdt:deleteIncident", data.id, data.time)
    end)
    RegisterNUICallback("deleteMissing", function(data, cb)
        RPC.execute("erp-mdt:deleteMissing", data.id, data.time)
    end)
    RegisterNUICallback("deleteReport", function(data, cb)
        RPC.execute("erp-mdt:deleteReport", data.id, data.time)
    end)
    RegisterNUICallback("deleteICU", function(data, cb)
        RPC.execute("erp-mdt:deleteICU", data.id)
    end)
    RegisterNUICallback("getAllReports", function(data, cb)
        SendNUIMessage({type = "reports", data = RPC.execute("erp-mdt:getAllReports")})
    end)
    RegisterNUICallback("getReportData", function(data, cb)
        SendNUIMessage({type = "reportData", data = RPC.execute("erp-mdt:getReportData", data.id)})
    end)
    RegisterNUICallback("searchReports", function(data, cb)
        SendNUIMessage({type = "reports", data = RPC.execute("erp-mdt:searchReports", data.name)})
    end)
    RegisterNUICallback("newReport", function(data, cb)
        local sentData = RPC.execute("erp-mdt:newReport", data.existing, data.id, data.title, data.type, data.detail, data.tags, data.gallery, data.officers, data.civilians, data.time)
        SendNUIMessage({type = "reportComplete", data = sentData})
    end)
    RegisterNUICallback("searchVehicles", function(data, cb)
        local sentData = RPC.execute("erp-mdt:searchVehicles", data.name)
        for i = 1, #sentData do
            local vehicle = json.decode(sentData[i]['vehicle'])
            sentData[i]['plate'] = string.upper(sentData[i]['plate'])
            sentData[i]['model'] = GetLabelText(GetDisplayNameFromVehicleModel(sentData[i]['model']))
        end
        SendNUIMessage({type = "searchedVehicles", data = sentData})
    end)
    RegisterNUICallback("searchWeapon", function(data, cb)
        local sentData = RPC.execute("erp-mdt:searchWeapon", data.name)
        SendNUIMessage({type = "searchedWeapons", data = sentData})
    end)
    RegisterNUICallback("searchMissing", function(data, cb)
        local sentData = RPC.execute("erp-mdt:searchMissing", data.name)
        SendNUIMessage({type = "searchedMissing", data = sentData})
    end)
    RegisterNUICallback("getWeaponData", function(data, cb)
        local sentData = RPC.execute("erp-mdt:getWeaponData", data.serialnumber)
        SendNUIMessage({type = "getWeaponData", data = sentData})
    end)
    RegisterNUICallback("getMissingData", function(data, cb)
        local sentData = RPC.execute("erp-mdt:getMissingData", data.id)
        SendNUIMessage({type = "getMissingData", data = sentData})
    end)
    RegisterNUICallback("getVehicleData", function(data, cb)
        local sentData = RPC.execute("erp-mdt:getVehicleData", data.plate)
        if sentData then
            local vehicle = sentData
            vehicle['model'] = GetLabelText(GetDisplayNameFromVehicleModel(vehicle['vehicle']))
            vehicle['class'] = classlist[GetVehicleClassFromName(vehicle['vehicle'])]
            vehicle['vehicle'] = nil
            SendNUIMessage({type = "getVehicleData", data = vehicle})
        end
    end)
    RegisterNUICallback("saveVehicleInfo", function(data, cb)
        RPC.execute("erp-mdt:saveVehicleInfo", data.plate, data.imageurl, data.notes, data.code5, data.stolen)
    end)
    RegisterNUICallback("saveWeaponInfo", function(data, cb)
        RPC.execute("erp-mdt:saveWeaponInfo", data.serialnumber, data.imageurl, data.brand, data.type, data.notes)
    end)
    RegisterNUICallback("saveMissingInfo", function(data, cb)
        RPC.execute("erp-mdt:saveMissingInfo", data.id, data.imageurl, data.notes)
    end)
    RegisterNUICallback("knownInformation", function(data, cb)
        RPC.execute("erp-mdt:knownInformation", data.type, data.status, data.plate)
    end)
    RegisterNUICallback("getAllLogs", function(data, cb)
        SendNUIMessage({type = "getAllLogs", data = RPC.execute("erp-mdt:getAllLogs")})
    end)
    RegisterNUICallback("getPenalCode", function(data, cb)
        local titles, penalcode, job = RPC.execute("erp-mdt:getPenalCode")
        SendNUIMessage({type = "getPenalCode", titles = titles, penalcode = penalcode, job = job})
    end)
    RegisterNUICallback("toggleDuty", function(data, cb)
        TriggerServerEvent('QBCore:ToggleDuty')
    end)
    RegisterNUICallback("setCallsign", function(data, cb)
        callSign = RPC.execute("erp-mdt:setCallsign", data.cid, data.newcallsign)
    end)
    RegisterNUICallback("saveIncident", function(data, cb)
        RPC.execute("erp-mdt:saveIncident", data.ID, data.title, data.information, data.tags, data.officers, data.civilians, data.evidence, data.associated, data.time)
    end)
    RegisterNUICallback("removeIncidentCriminal", function(data, cb)
        RPC.execute("erp-mdt:removeIncidentCriminal", data.cid, data.incidentId)
    end)
    RegisterNUICallback("setWaypoint", function(data, cb)
        local callInformation = RPC.execute("erp-mdt:setWaypoint", data.callid)
        SetNewWaypoint(callInformation['origin']['x'], callInformation['origin']['y'])
    end)
    RegisterNUICallback("callDetach", function(data, cb)
        local callid, sentData = RPC.execute("erp-mdt:callDetach", data.callid)
        local job = QBCore.Functions.GetPlayerData().job.name
        if job == "police" or job == 'ambulance' then 
            SendNUIMessage({type = "callDetach", callid = callid, data = tonumber(sentData)}) 
        end
    end)
    RegisterNUICallback("removeCall", function(data, cb)
        local src, callid = RPC.execute("erp-mdt:removeCall", data.callid)
        if src == GetPlayerServerId(PlayerId()) then 
            return 
        end
        SendNUIMessage({type = "removeCall", callid = callid}) 
    end)
    RegisterNUICallback("callAttach", function(data, cb)
        local callid, sentData = RPC.execute("erp-mdt:callAttach", data.callid)
        local job = QBCore.Functions.GetPlayerData().job.name
        if job == "police" or job == 'ambulance' then
            SendNUIMessage({type = "callAttach", callid = callid, data = tonumber(sentData)})
        end
    end)
    RegisterNetEvent('dispatch:clNotify')
    AddEventHandler('dispatch:clNotify', function(sNotificationData, sNotificationId)
        sNotificationData.callId = sNotificationId
        SendNUIMessage({type = "call", data = sNotificationData})
    end)
    RegisterNUICallback("attachedUnits", function(data, cb)
        local sentData, callid = RPC.execute("erp-mdt:attachedUnits", data.callid)
        SendNUIMessage({type = "attachedUnits", data = sentData, callid = callid})
    end)
    RegisterNUICallback("callDispatchDetach", function(data, cb)
        RPC.execute("erp-mdt:callDispatchDetach", data.callid, data.cid)
    end)
    RegisterNUICallback("setDispatchWaypoint", function(data, cb)
        local callInformation = RPC.execute("erp-mdt:setDispatchWaypoint", data.callid)
        SetNewWaypoint(callInformation['origin']['x'], callInformation['origin']['y'])
    end)
    RegisterNUICallback("callDragAttach", function(data, cb)
        RPC.execute("erp-mdt:callDragAttach", data.callid, data.cid)
    end)
    RegisterNUICallback("setWaypointU", function(data, cb)
        local sentData = RPC.execute("erp-mdt:setWaypoint:unit", data.cid)
        SetNewWaypoint(sentData.x, sentData.y) 
    end)
    RegisterNUICallback("dispatchMessage", function(data, cb)
        local sentData = RPC.execute("erp-mdt:sendMessage", data.message, data.time)
        local job = QBCore.Functions.GetPlayerData().job.name
        if job == "police" or job == 'ambulance' then
            SendNUIMessage({type = "dispatchmessage", data = sentData})
        end
    end)
    RegisterNUICallback("refreshDispatchMsgs", function(data, cb)
        SendNUIMessage({type = "dispatchmessages", data = RPC.execute("erp-mdt:refreshDispatchMsgs")})
    end)
end

Citizen.CreateThread(function()
    if Config["CoreSettings"]["QBCore"]["QBCoreVersion"] == "new" then
        QBCore = Config["CoreSettings"]["QBCore"]["QBCoreExport"]
    elseif Config["CoreSettings"]["QBCore"]["QBCoreVersion"] == "old" then
        TriggerEvent(Config["CoreSettings"]["QBCore"]["QBUSTrigger"], function(obj) QBCore = obj end)
    end
    LoadQBCoreVersion()

    local publicRecordsZone = CircleZone:Create(vector3(Config["PublicRecords"]['Coords']), 9.0, {
        name="mdt_publicrecords",
        heading=(1),
        --debugPoly=true,
        --debugColor={255, 255, 255},
        --minZ=(v.takeVehicle.z - 1), 
        --maxZ=(v.takeVehicle.z + 2.5)
        useZ=true,
    })

    publicRecordsZone:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            insidePublicRecordsZone = true
            PublicRecordsThread()
        else
            insidePublicRecordsZone = false
        end
    end)
end)

function PublicRecordsThread()
    Citizen.CreateThread(function()
        while insidePublicRecordsZone do
            Citizen.Wait(1)
            local dist = #(GetEntityCoords(PlayerPedId()) - Config["PublicRecords"]['Coords'])
            if dist < 2 then
                DrawText3D(Config["PublicRecords"]['Coords'], "~g~E~w~ - View Public Records")
                if IsControlJustReleased(0, 38) then
                    OpenPublicRecords()
                end
            end
        end
    end)
end