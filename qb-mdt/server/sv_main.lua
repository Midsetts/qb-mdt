QBCore = nil
local MDTDispatchData = {}
local AttachedUnits = {}
local calls = 0

SQL = function(query, parameters, cb)
    local res = nil
    local IsBusy = true
    if Config["SQLWrapper"] == "mysql-async" then
        if string.find(query, "SELECT") then
            MySQL.Async.fetchAll(query, parameters, function(result)
                if cb then
                    cb(result)
                else
                    res = result
                    IsBusy = false
                end
            end)
        else
            MySQL.Async.execute(query, parameters, function(result)
                if cb then
                    cb(result)
                else
                    res = result
                    IsBusy = false
                end
            end)
        end
    elseif Config["SQLWrapper"] == "oxmysql" then
        exports.oxmysql:execute(query, parameters, function(result)
            if cb then
                cb(result)
            else
                res = result
                IsBusy = false
            end
        end)
    elseif Config["SQLWrapper"] == "ghmattimysql" then
        exports.ghmattimysql:execute(query, parameters, function(result)
            if cb then
                cb(result)
            else
                res = result
                IsBusy = false
            end
        end)
    end
    while IsBusy do
        Citizen.Wait(0)
    end
    return res
end

CheckIfValueInTable = function(table, item)
    for i = 1, #table do
        if table[i] == item then
            return true
        end
    end
    return false
end

LoadQBCoreVersion = function()
    RPC.register("erp-mdt:isAdmin", function()
        return isAdmin(source)
    end)
    GetFullNameFromIdentifier = function(citizenid)
        local result = SQL('SELECT * FROM '..Config["CoreSettings"]["QBCore"]["Players_Table"]..' WHERE citizenid = @citizenid', {['@citizenid'] = citizenid})
        local charInfo = json.decode(result[1].charinfo)
        return charInfo.firstname..' '..charInfo.lastname
    end
    GetBulletinIdFromName = function(name)
        local result = SQL('SELECT * FROM mdt_bulletins WHERE title = @title', {['@title'] = name})
        return result[1].id
    end
    GetAllBulletinData = function()
        local results = SQL('SELECT * FROM mdt_bulletins', {})
        return results
    end
    GetAllMessages = function()
        local results = SQL('SELECT * FROM mdt_dashmessage', {})
        return results
    end
    GetPlayerVehicles = function(citizenid)
        local VehicleTable = {}
        local results = SQL('SELECT * FROM '..Config["CoreSettings"]["QBCore"]["OwnedVehicles_Table"]..' WHERE citizenid = @citizenid', {['@citizenid'] = citizenid})
        for index, data in pairs(results) do
            table.insert(VehicleTable, {
                plate = data.plate,
                model = data.vehicle
            })
        end
        return VehicleTable
    end
    GetPlayerProfilePicture = function(citizenid)
        local result = SQL('SELECT * FROM '..Config["CoreSettings"]["QBCore"]["Players_Table"]..' WHERE citizenid = @citizenid', {['@citizenid'] = citizenid})
        if result[1].pp == nil or result[1].pp == "" then
            local charInfo = json.decode(result[1].charinfo)
            if charInfo.gender == "Male" or charInfo.gender == "M" or charInfo.gender == "0" or charInfo.gender == 0 or charInfo.gender == "m" or charInfo.gender == "man" then
                return "https://cdn.discordapp.com/attachments/769245887654002782/890279531959693312/male.png"
            elseif charInfo.gender == "Female" or charInfo.gender == "F" or charInfo.gender == "1" or charInfo.gender == 1 or charInfo.gender == "f" or charInfo.gender == "female" then
                return "https://cdn.discordapp.com/attachments/769245887654002782/890279637953953822/female.png"
            end
        else
            return result[1].pp
        end
    end
    GetVehicleImage = function(plate)
        local result = SQL('SELECT * FROM mdt_vehicleinfo WHERE plate = @plate', {['@plate'] = plate})
        if result[1] and result[1].image and result[1].image ~= "" then
            return result[1].image
        else
            return "https://cdn.discordapp.com/attachments/769245887654002782/890579805798531082/not-found.jpg"
        end
    end
    GetVehicleInformation = function(plate)
        local result = SQL('SELECT * FROM mdt_vehicleinfo WHERE plate = @plate', {['@plate'] = plate})
        if result[1] then
            return result[1].info
        end
    end
    GetVehicleCodeStatus = function(plate)
        local result = SQL('SELECT * FROM mdt_vehicleinfo WHERE plate = @plate', {['@plate'] = plate})
        if result[1] then
            if tonumber(result[1].code5) == 1 then
                return true
            else
                return false
            end
        end
    end
    GetVehicleStolenStatus = function(plate)
        local result = SQL('SELECT * FROM mdt_vehicleinfo WHERE plate = @plate', {['@plate'] = plate})
        if result[1] then
            if tonumber(result[1].stolen) == 1 then
                return true
            else
                return false
            end
        end
    end
    CreateStuffLog = function(type, time, ...)
        local currentLog = Config["StaffLogs"][type]:format(...)
        SQL('INSERT INTO mdt_logs (log, time) VALUES (@log, @time)', {['@log'] = currentLog, ['@time'] = time})
    end
    CheckType = function(src)
        local xPlayer = QBCore.Functions.GetPlayer(src)
        for index, job in pairs(Config["PoliceJobs"]) do
            for index2, job2 in pairs(Config["EMSJobs"]) do
                if xPlayer.PlayerData.job.name == job then
                    return "police"
                elseif xPlayer.PlayerData.job.name == job2 then
                    return "ambulance"
                end
            end
        end
    end
    CheckBoloStatus = function(plate)
        local BolosData = SQL("SELECT * FROM mdt_bolos", {})
        for index = 1, #BolosData, 1 do
            if string.lower(BolosData[index].plate) == string.lower(plate) then
                return true
            else
                return false
            end
        end
    end
    CheckIfMissing = function(cid)
        local data = SQL("SELECT * FROM mdt_missing", {})
        for idx, data in pairs(data) do
            if data.identifier == cid then
                return true
            end
        end
        return false
    end
    RPC.register("erp-mdt:getInfo", function()
        local xPlayer = QBCore.Functions.GetPlayer(source)
        return {firstname = xPlayer.PlayerData.charinfo.firstname, lastname = xPlayer.PlayerData.charinfo.lastname}
    end)
    RegisterCommand(Config["MDTCommand"], function(source)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        for index, job in pairs(Config["PoliceJobs"]) do
            for index2, job2 in pairs(Config["EMSJobs"]) do
                if xPlayer.PlayerData.job.name == job or xPlayer.PlayerData.job.name == job2 then
                    local job = xPlayer.PlayerData.job.name
                    local jobLabel = xPlayer.PlayerData.charinfo.firstname
                    local lastname = xPlayer.PlayerData.charinfo.lastname
                    local firstname = xPlayer.PlayerData.charinfo.firstname
                    TriggerClientEvent("erp-mdt:open", source, job, jobLabel, lastname, firstname)
                end
            end
        end
    end)
    RPC.register("erp-mdt:dashboardbulletin", function()
        return GetAllBulletinData()
    end)
    RPC.register("erp-mdt:dashboardMessages", function()
        return GetAllMessages()
    end)
    RPC.register("erp-mdt:getWarrants", function()
        local WarrantData = {}
        local data = SQL("SELECT * FROM mdt_incidents", {})
        for index = 1, #data, 1 do
            local associatedData = json.decode(data[index].associated)
            for _, value in pairs(associatedData) do
                if value.Warrant then
                    table.insert(WarrantData, {
                        cid = value.Cid,
                        linkedincident = data[index].id,
                        name = GetFullNameFromIdentifier(value.Cid),
                        reporttitle = data[index].title,
                        time = data[index].time
                    })
                end
            end
        end
        return WarrantData
    end)
    RPC.register("erp-mdt:getActiveLSPD", function()
        local ActiveLSPD = {}
        for index, player in pairs(QBCore.Functions.GetPlayers()) do
            local xPlayer = QBCore.Functions.GetPlayer(player)
            if xPlayer.PlayerData.job.name == "police" then
                table.insert(ActiveLSPD, {
                    duty = GetPlayerDutyStatus(xPlayer.PlayerData.source),
                    cid = xPlayer.PlayerData.citizenid,
                    name = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname,
                    callsign = GetResourceKvpString("erp-mdt:callsign-"..xPlayer.PlayerData.citizenid),
                    radio = GetPlayerRadio(xPlayer.PlayerData.source)
                })
            end
        end
        return ActiveLSPD
    end)
    RPC.register("erp-mdt:getActiveEMS", function()
        local ActiveEMS = {}
        for index, player in pairs(QBCore.Functions.GetPlayers()) do
            local xPlayer = QBCore.Functions.GetPlayer(player)
            if xPlayer.PlayerData.job.name == "ambulance" then
                table.insert(ActiveEMS, {
                    duty = GetPlayerDutyStatus(xPlayer.PlayerData.source),
                    cid = xPlayer.PlayerData.citizenid,
                    name = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname,
                    callsign = GetResourceKvpString("erp-mdt:callsign-"..xPlayer.PlayerData.citizenid),
                    radio = GetPlayerRadio(xPlayer.PlayerData.source)
                })
            end
        end
        return ActiveEMS
    end)
    GetProfileConvictions = function(cid)
        local Convictions = {}
        local data = SQL("SELECT * FROM mdt_incidents", {})
        for index = 1, #data, 1 do
            if CheckIfValueInTable(Config["PoliceJobs"], data[index].type) then
                local associatedData = json.decode(data[index].associated)
                for index, value in pairs(associatedData) do
                    if value.Cid == cid then
                        if #value.Charges > 0 then
                            for _, name in pairs(value.Charges) do
                                table.insert(Convictions, name)
                            end
                        end
                    end
                end
            end
        end
        return json.encode(Convictions)
    end
    GetProfileTreatments = function(cid)
        local Treatments = {}
        local data = SQL("SELECT * FROM mdt_incidents", {})
        for index = 1, #data, 1 do
            if CheckIfValueInTable(Config["EMSJobs"], data[index].type) then
                local associatedData = json.decode(data[index].associated)
                for index, value in pairs(associatedData) do
                    if value.Cid == cid then
                        if #value.Charges > 0 then
                            for _, name in pairs(value.Charges) do
                                table.insert(Treatments, name)
                            end
                        end
                    end
                end
            end
        end
        return json.encode(Treatments)
    end
    GetPlayerWeapons = function(cid)
        local Weapons = {}
        local data = SQL("SELECT * FROM mdt_weapons", {})
        for index = 1, #data, 1 do
            if data[index].identifier == cid then
                table.insert(Weapons, data[index].serialnumber)
            end
        end
        return Weapons
    end
    RPC.register("erp-mdt:getProfileData", function(citizenid)
        local ReturnData = {}
        local result = SQL('SELECT * FROM '..Config["CoreSettings"]["QBCore"]["Players_Table"]..' WHERE citizenid = @citizenid', {['@citizenid'] = citizenid})
        local CharInfo = json.decode(result[1].charinfo)
        ReturnData.vehicles = GetPlayerVehicles(result[1].citizenid)
        ReturnData.firstname = CharInfo.firstname
        ReturnData.lastname = CharInfo.lastname
        ReturnData.phone = CharInfo.phone
        ReturnData.cid = result[1].citizenid
        ReturnData.dateofbirth = CharInfo.birthdate
        ReturnData.job = json.decode(result[1].job).label
        ReturnData.profilepic = GetPlayerProfilePicture(result[1].citizenid)
        ReturnData.policemdtinfo = result[1].policemdtinfo
        ReturnData.weapon = GetPlayerLicenses(result[1].citizenid, "weapon")
        ReturnData.pilot = GetPlayerLicenses(result[1].citizenid, "pilot")
        ReturnData.car = GetPlayerLicenses(result[1].citizenid, "driver")
        ReturnData.truck = GetPlayerLicenses(result[1].citizenid, "truck")
        ReturnData.bike = GetPlayerLicenses(result[1].citizenid, "bike")
        ReturnData.tags = result[1].tags
        ReturnData.gallery = result[1].gallery
        ReturnData.weapons = GetPlayerWeapons(result[1].citizenid)
        ReturnData.convictions = GetProfileConvictions(result[1].citizenid)
        ReturnData.treatments = GetProfileTreatments(result[1].citizenid)
        return ReturnData
    end)
    RPC.register("erp-mdt:JailPlayer", function(cid, time)
        JailPlayer(source, cid, time)
    end)
    RPC.register("erp-mdt:saveProfile", function(profilepic, information, cid)
        SQL("UPDATE "..Config["CoreSettings"]["QBCore"]["Players_Table"].." SET pp = @profilepic, policemdtinfo = @policemdtinfo WHERE citizenid = @citizenid", {
            ['@profilepic'] = profilepic,
            ['@policemdtinfo'] = information, 
            ['@citizenid'] = cid
        })
    end)
    RPC.register("erp-mdt:addGalleryImg", function(cid, url)
        SQL("SELECT * FROM "..Config["CoreSettings"]["QBCore"]["Players_Table"].." WHERE citizenid = @citizenid", {
            ['@citizenid'] = cid
        }, function(result)
            local NewGallery = {}
            table.insert(NewGallery, url)
            if result[1].gallery ~= nil and result[1].gallery ~= "" then
                for index, data in pairs(json.decode(result[1].gallery)) do
                    table.insert(NewGallery, data)
                end
            end
            SQL("UPDATE "..Config["CoreSettings"]["QBCore"]["Players_Table"].." SET gallery = @gallery WHERE citizenid = @citizenid", {
                ['@gallery'] = json.encode(NewGallery),
                ['@citizenid'] = cid
            })
        end)
    end)
    RPC.register("erp-mdt:removeGalleryImg", function(cid, url)
        SQL("SELECT * FROM "..Config["CoreSettings"]["QBCore"]["Players_Table"].." WHERE citizenid = @citizenid", {
            ['@citizenid'] = cid
        }, function(result)
            local NewGallery = {}
            if result[1].gallery ~= nil and result[1].gallery ~= "" then
                for index, data in pairs(json.decode(result[1].gallery)) do
                    if data ~= url then
                        table.insert(NewGallery, data)
                    end
                end
            end
            SQL("UPDATE "..Config["CoreSettings"]["QBCore"]["Players_Table"].." SET gallery = @gallery WHERE citizenid = @citizenid", {
                ['@gallery'] = json.encode(NewGallery),
                ['@citizenid'] = cid
            })
        end)
    end)
    RPC.register("erp-mdt:addWeapon", function(cid, serialnumber)
        local xPlayer = QBCore.Functions.GetPlayerByCitizenId(cid)
        local owner = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname
        SQL('INSERT INTO mdt_weapons (identifier, serialnumber, owner) VALUES (@identifier, @serialnumber, @owner)', {['@identifier'] = cid, ['@serialnumber'] = serialnumber, ['@owner'] = owner})
    end)
    RPC.register("erp-mdt:newTag", function(identifier, tag)
        SQL("SELECT * FROM "..Config["CoreSettings"]["QBCore"]["Players_Table"].." WHERE citizenid = @citizenid", {
            ['@citizenid'] = identifier
        }, function(result)
            local NewTags = {}
            table.insert(NewTags, tag)
            if result[1].tags ~= nil and result[1].tags ~= "" then
                for index, data in pairs(json.decode(result[1].tags)) do
                    table.insert(NewTags, data)
                end
            end
            SQL("UPDATE "..Config["CoreSettings"]["QBCore"]["Players_Table"].." SET tags = @tags WHERE citizenid = @citizenid", {
                ['@tags'] = json.encode(NewTags),
                ['@citizenid'] = identifier
            })
        end)
    end)
    RPC.register("erp-mdt:missingCitizen", function(cid, time)
        local result = SQL('SELECT * FROM '..Config["CoreSettings"]["QBCore"]["Players_Table"]..' WHERE citizenid = @citizenid', {['@citizenid'] = cid})
        if not CheckIfMissing(cid) then 
            SQL('INSERT INTO mdt_missing (identifier, name, date, age, lastseen) VALUES (@identifier, @name, @date, @age, @lastseen)', {
                ['@identifier'] = cid, 
                ['@name'] = json.decode(result[1].charinfo).firstname..' '..json.decode(result[1].charinfo).lastname, 
                ['@date'] = time,
                ['@age'] = json.decode(result[1].charinfo).birthdate,
                ['@lastseen'] = time
            })
        end
    end)
    RPC.register("erp-mdt:removeProfileTag", function(cid, tagtext)
        SQL("SELECT * FROM "..Config["CoreSettings"]["QBCore"]["Players_Table"].." WHERE citizenid = @citizenid", {
            ['@citizenid'] = cid
        }, function(result)
            local NewTags = {}
            if result[1].tags ~= nil and result[1].tags ~= "" then
                for index, data in pairs(json.decode(result[1].tags)) do
                    if data ~= tagtext then
                        table.insert(NewTags, data)
                    end
                end
            end
            SQL("UPDATE "..Config["CoreSettings"]["QBCore"]["Players_Table"].." SET tags = @tags WHERE citizenid = @citizenid", {
                ['@tags'] = json.encode(NewTags),
                ['@citizenid'] = cid
            })
        end)
    end)
    RPC.register("erp-mdt:updateLicence", function(type, status, cid)
        ManageLicenses(cid, type, status)
    end)
    RPC.register("erp-mdt:deleteBulletin", function(id, time)
        local src = source
        local xPlayer = QBCore.Functions.GetPlayer(src)
        SQL("DELETE FROM mdt_bulletins WHERE id = @id", {['@id'] = id}, function(isSec)
            CreateStuffLog("DeleteBulletin", time, xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname)
            return src, id, xPlayer.PlayerData.job.name
        end)
    end)
    RPC.register("erp-mdt:newBulletin", function(title, info, time)
        local src = source
        local xPlayer = QBCore.Functions.GetPlayer(src)
        local Author = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname
        SQL('INSERT INTO mdt_bulletins (author, title, info, time) VALUES (@author, @title, @info, @time)', {['@author'] = Author, ['@title'] = title, ['@info'] = info, ['@time'] = time}, function(isSec)
            if isSec then
                CreateStuffLog("NewBulletin", time, Author)
                local SendData = {}
                SendData.id = GetBulletinIdFromName(title)
                SendData.title = title
                SendData.info = info
                SendData.author = Author
                SendData.time = time
                return src, SendData, xPlayer.job.name
            end
        end)
    end)
    RPC.register("erp-mdt:searchProfile", function(name)
        local Matches = {}
        local users = SQL("SELECT * FROM "..Config["CoreSettings"]["QBCore"]["Players_Table"].."", {})
        for index = 1, #users, 1 do
            local CharInfo = json.decode(users[index].charinfo)
            if CharInfo ~= nil then
                local firstname = string.lower(CharInfo.firstname)
                local lastname = string.lower(CharInfo.lastname)
                local fullname = firstname..' '..lastname
                local identifier = string.lower(users[index].citizenid)
                if string.find(firstname, string.lower(name)) or string.find(lastname, string.lower(name)) or string.find(fullname, string.lower(name)) or string.find(identifier, string.lower(name)) then
                    table.insert(Matches, {
                        id = users[index].citizenid,
                        firstname = CharInfo.firstname,
                        lastname = CharInfo.lastname,
                        weapon = GetPlayerLicenses(users[index].citizenid, "weapon"),
                        pilot = GetPlayerLicenses(users[index].citizenid, "pilot"),
                        car = GetPlayerLicenses(users[index].citizenid, "driver"),
                        truck = GetPlayerLicenses(users[index].citizenid, "truck"),
                        bike = GetPlayerLicenses(users[index].citizenid, "bike"),
                        pp = GetPlayerProfilePicture(users[index].citizenid)
                    })
                end
            end
        end
        return Matches
    end)
    RPC.register("erp-mdt:searchIncidents", function(incident)
        local Matches = {}
        local incidents = SQL('SELECT * FROM mdt_incidents', {})
        for index = 1, #incidents, 1 do 
            if string.find(string.lower(incidents[index].title), string.lower(incident)) or string.find(string.lower(incidents[index].id), string.lower(incident)) then
                table.insert(Matches, incidents[index])
            end
        end
        return Matches
    end)
    RPC.register("erp-mdt:saveIncident", function(ID, title, information, tags, officers, civilians, evidence, associated, time)
        local src = source
        local xPlayer = QBCore.Functions.GetPlayer(src)
        local result = SQL('SELECT * FROM mdt_incidents WHERE id = @id', {['@id'] = ID})
        if result[1] then
            SQL("UPDATE mdt_incidents SET title = @title, information = @information, tags = @tags, officers = @officers, civilians = @civilians, evidence = @evidence, associated = @associated, time = @time, author = @author, type = @type WHERE id = @id", {
                ['@id'] = ID,
                ['@title'] = title, 
                ['@information'] = information, 
                ['@tags'] = json.encode(tags),
                ['@officers'] = json.encode(officers),
                ['@civilians'] = json.encode(civilians), 
                ['@evidence'] = json.encode(evidence), 
                ['@associated'] = json.encode(associated), 
                ['@time'] = time,
                ['@author'] = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname,
                ['@type'] = xPlayer.PlayerData.job.name
            })
            CreateStuffLog("EditIncident", time, xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname)
        else
            SQL('INSERT INTO mdt_incidents (title, information, tags, officers, civilians, evidence, associated, time, author, type) VALUES (@title, @information, @tags, @officers, @civilians, @evidence, @associated, @time, @author, @type)', {
                ['@title'] = title, 
                ['@information'] = information, 
                ['@tags'] = json.encode(tags),
                ['@officers'] = json.encode(officers),
                ['@civilians'] = json.encode(civilians), 
                ['@evidence'] = json.encode(evidence), 
                ['@associated'] = json.encode(associated), 
                ['@time'] = time,
                ['@author'] = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname,
                ['@type'] = xPlayer.PlayerData.job.name
            })
            CreateStuffLog("NewIncident", time, xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname)
        end
    end)
    RPC.register("erp-mdt:getAllIncidents", function()
        local Tables = {}
        local results = SQL('SELECT * FROM mdt_incidents', {})
        for index, data in pairs(results) do
            table.insert(Tables, data)
        end
        return Tables
    end)
    RPC.register("erp-mdt:getIncidentData", function(id)
        local result = SQL('SELECT * FROM mdt_incidents WHERE id = @id', {['@id'] = id})
        local convictions = {}
        local associatedData = json.decode(result[1].associated)
        for index, data in pairs(associatedData) do
            table.insert(convictions, {
                cid = data.Cid,
                name = GetFullNameFromIdentifier(data.Cid),
                warrant = data.Warrant,
                guilty = data.Guilty,
                processed = data.Processed,
                associated = data.Isassociated,
                fine = data.Fine,
                sentence = data.Sentence,
                recfine = data.recfine,
                recsentence = data.recsentence,
                charges = data.Charges
            })
        end
        return result[1], convictions
    end)
    RPC.register("erp-mdt:incidentSearchPerson", function(name)
        local Matches = {}
        local users = SQL("SELECT * FROM "..Config["CoreSettings"]["QBCore"]["Players_Table"].."", {})
        for index = 1, #users, 1 do
            local CharInfo = json.decode(users[index].charinfo)
            if CharInfo ~= nil then
                local firstname = string.lower(CharInfo.firstname)
                local lastname = string.lower(CharInfo.lastname)
                local fullname = firstname..' '..lastname
                if string.find(firstname, string.lower(name)) or string.find(lastname, string.lower(name)) or string.find(fullname, string.lower(name)) then
                    table.insert(Matches, {
                        firstname = firstname,
                        lastname = lastname,
                        id = users[index].citizenid,
                        profilepic = GetPlayerProfilePicture(users[index].citizenid),
                    })
                end
            end
        end
        return Matches
    end)
    RPC.register("erp-mdt:removeIncidentCriminal", function(cid, incidentId)
        local result = SQL('SELECT * FROM mdt_incidents WHERE id = @id', {['@id'] = incidentId})
        if result[1] then
            local Table = {}
            for index, data in pairs(json.decode(result[1].associated)) do
                if data.Cid ~= cid then
                    table.insert(Table, data)
                end
            end
            SQL("UPDATE mdt_incidents SET associated = @associated WHERE id = @id", {
                ['@associated'] = json.encode(Table),
                ['@id'] = incidentId
            })
        end
    end)
    RPC.register("erp-mdt:getPenalCode", function()
        local xPlayer = QBCore.Functions.GetPlayer(source)
        for index, job in pairs(Config["PoliceJobs"]) do
            for index2, job2 in pairs(Config["EMSJobs"]) do
                if xPlayer.PlayerData.job.name == job then
                    return Config['OffensesTitels'], Config["Offenses"], xPlayer.PlayerData.job.name
                elseif xPlayer.PlayerData.job.name == job2 then
                    return Config['TreatmentsTitels'], Config["Treatments"], xPlayer.PlayerData.job.name
                end
            end
        end
    end)
    RPC.register("erp-mdt:searchBolos", function(searchVal)
        local Matches = {}
        local BolosData = SQL("SELECT * FROM mdt_bolos", {})
        for index = 1, #BolosData, 1 do
            if string.find(string.lower(BolosData[index].title), string.lower(searchVal)) then
                table.insert(Matches, BolosData[index])
            end
        end
        return Matches
    end)
    RPC.register("erp-mdt:getAllBolos", function()
        local Tables = {}
        local BolosData = SQL("SELECT * FROM mdt_bolos", {})
        for index = 1, #BolosData, 1 do
            table.insert(Tables, BolosData[index])
        end
        return Tables
    end)
    RPC.register("erp-mdt:getAllMissing", function()
        local Tables = {}
        local MissingCitizens = SQL("SELECT * FROM mdt_missing", {})
        for index = 1, #MissingCitizens, 1 do
            MissingCitizens[index].image = GetPlayerProfilePicture(MissingCitizens[index].identifier)
            table.insert(Tables, MissingCitizens[index])
        end
        return Tables
    end)
    RPC.register("erp-mdt:getBoloData", function(id)
        local result = SQL('SELECT * FROM mdt_bolos WHERE id = @id', {['@id'] = id})
        return result[1]
    end)
    RPC.register("erp-mdt:newBolo", function(existing, id, title, plate, owner, individual, detail, tags, gallery, officers, time)
        local src = source
        local xPlayer = QBCore.Functions.GetPlayer(src)
        if not existing then
            SQL('INSERT INTO mdt_bolos (title, plate, owner, individual, detail, tags, gallery, officers, time, author, type) VALUES (@title, @plate, @owner, @individual, @detail, @tags, @gallery, @officers, @time, @author, @type)', {
                ['@title'] = title, 
                ['@plate'] = plate, 
                ['@owner'] = owner,
                ['@individual'] = individual,
                ['@detail'] = detail, 
                ['@tags'] = json.encode(tags), 
                ['@gallery'] = json.encode(gallery), 
                ['@officers'] = json.encode(officers),
                ['@time'] = time,
                ['@author'] = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname,
                ['@type'] = CheckType(src)
            })
            CreateStuffLog("NewBolo", time, xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname)
            return id
        else
            SQL("UPDATE mdt_bolos SET title = @title, plate = @plate, owner = @owner, individual = @individual, detail = @detail, tags = @tags, gallery = @gallery, officers = @officers, time = @time, author = @author, type = @type WHERE id = @id", {
                ['@id'] = id,
                ['@title'] = title, 
                ['@plate'] = plate, 
                ['@owner'] = owner,
                ['@individual'] = individual,
                ['@detail'] = detail, 
                ['@tags'] = json.encode(tags), 
                ['@gallery'] = json.encode(gallery), 
                ['@officers'] = json.encode(officers),
                ['@time'] = time,
                ['@author'] = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname,
                ['@type'] = CheckType(src)
            })
            CreateStuffLog("EditBolo", time, xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname)
            return id
        end
    end)
    RPC.register("erp-mdt:deleteBolo", function(id, time)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        CreateStuffLog("DeleteBolo", time, xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname)
        SQL("DELETE FROM mdt_bolos WHERE id = @id", {['@id'] = id})
    end)
    RPC.register("erp-mdt:deleteIncident", function(id, time)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        CreateStuffLog("DeleteIncident", time, xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname)
        SQL("DELETE FROM mdt_incidents WHERE id = @id", {['@id'] = id})
    end)
    RPC.register("erp-mdt:deleteMissing", function(id, time)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        CreateStuffLog("DeleteMissing", time, xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname)
        SQL("DELETE FROM mdt_missing WHERE id = @id", {['@id'] = id})
    end)
    RPC.register("erp-mdt:deleteReport", function(id, time)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        CreateStuffLog("DeleteReport", time, xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname)
        SQL("DELETE FROM mdt_report WHERE id = @id", {['@id'] = id})
    end)
    RPC.register("erp-mdt:deleteICU", function(id)
        SQL("DELETE FROM mdt_bolos WHERE id = @id", {['@id'] = id})
    end)
    RPC.register("erp-mdt:getAllReports", function()
        local Tables = {}
        local results = SQL('SELECT * FROM mdt_report', {})
        for index = 1, #results, 1 do
            table.insert(Tables, results[index])
        end
        return Tables
    end)
    RPC.register("erp-mdt:getReportData", function(id)
        local result = SQL('SELECT * FROM mdt_report WHERE id = @id', {['@id'] = id})
        return result[1]
    end)
    RPC.register("erp-mdt:searchReports", function(name)
        local Matches = {}
        local ReportsData = SQL('SELECT * FROM mdt_report', {})
        for index = 1, #ReportsData, 1 do
            if string.find(string.lower(ReportsData[index].title), string.lower(name)) then
                table.insert(Matches, ReportsData[index])
            end
        end
        return Matches
    end)
    RPC.register("erp-mdt:newReport", function(existing, id, title, reporttype, detail, tags, gallery, officers, civilians, time)
        local src = source
        local xPlayer = QBCore.Functions.GetPlayer(src)
        if not existing then
            SQL('INSERT INTO mdt_report (title, reporttype, author, detail, tags, gallery, officers, civilians, time, type) VALUES (@title, @reporttype, @author, @detail, @tags, @gallery, @officers, @civilians, @time, @type)', {
                ['@title'] = title, 
                ['@reporttype'] = reporttype, 
                ['@author'] = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname,
                ['@detail'] = detail,
                ['@tags'] = json.encode(tags), 
                ['@gallery'] = json.encode(gallery), 
                ['@officers'] = json.encode(officers), 
                ['@civilians'] = json.encode(civilians),
                ['@time'] = time,
                ['@type'] = CheckType(src)
            })
            CreateStuffLog("NewReport", time, xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname)
            return id
        else
            SQL("UPDATE mdt_report SET title = @title, reporttype = @reporttype, author = @author, detail = @detail, tags = @tags, gallery = @gallery, officers = @officers, civilians = @civilians, time = @time, type = @type WHERE id = @id", {
                ['@id'] = id,
                ['@title'] = title, 
                ['@reporttype'] = reporttype, 
                ['@author'] = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname,
                ['@detail'] = detail,
                ['@tags'] = json.encode(tags), 
                ['@gallery'] = json.encode(gallery), 
                ['@officers'] = json.encode(officers), 
                ['@civilians'] = json.encode(civilians),
                ['@time'] = time,
                ['@type'] = CheckType(src)
            })
            CreateStuffLog("EditReport", time, xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname)
            return id
        end
    end)
    RPC.register("erp-mdt:searchVehicles", function(name)
        local ReturnData = {}
        local VehiclesData =  SQL('SELECT * FROM '..Config["CoreSettings"]["QBCore"]["OwnedVehicles_Table"]..'', {})
        for index = 1, #VehiclesData, 1 do
            if string.find(string.lower(VehiclesData[index].plate), string.lower(name)) then
                table.insert(ReturnData, {
                    vehicle = VehiclesData[index].mods,
                    plate = VehiclesData[index].plate,
                    id = index,
                    model = VehiclesData[index].vehicle,
                    owner = GetFullNameFromIdentifier(VehiclesData[index].citizenid),
                    bolo = CheckBoloStatus(VehiclesData[index].plate),
                    impound = CheckImpoundStatus(VehiclesData[index].plate),
                    image = GetVehicleImage(VehiclesData[index].plate),
                    code = GetVehicleCodeStatus(VehiclesData[index].plate),
                    stolen = GetVehicleStolenStatus(VehiclesData[index].plate)
                })
            end
        end

        return ReturnData
    end)
    RPC.register("erp-mdt:searchWeapon", function(name)
        local ReturnData = {}
        local Weapons =  SQL('SELECT * FROM mdt_weapons', {})
        for index = 1, #Weapons, 1 do
            if string.find(string.lower(Weapons[index].serialnumber), string.lower(name)) then
                table.insert(ReturnData, Weapons[index])
            end
        end
        return ReturnData
    end)
    RPC.register("erp-mdt:saveMissingInfo", function(id, imageurl, notes)
        SQL("UPDATE mdt_missing SET image = @image, notes = @notes WHERE id = @id", {
            ['@id'] = id,
            ['@image'] = imageurl, 
            ['@notes'] = notes
        })
    end)
    RPC.register("erp-mdt:searchMissing", function(name)
        local ReturnData = {}
        local Missing =  SQL('SELECT * FROM mdt_missing', {})
        for index = 1, #Missing, 1 do
            if string.find(string.lower(Missing[index].name), string.lower(name)) then
                Missing[index].image = GetPlayerProfilePicture(Missing[index].identifier)
                table.insert(ReturnData, Missing[index])
            end
        end
        return ReturnData
    end)
    RPC.register("erp-mdt:getWeaponData", function(serialnumber)
        local result = SQL('SELECT * FROM mdt_weapons WHERE serialnumber = @serialnumber', {['@serialnumber'] = serialnumber})
        if result[1] then
            return result[1]
        end
    end)
    RPC.register("erp-mdt:getMissingData", function(id)
        local result = SQL('SELECT * FROM mdt_missing WHERE id = @id', {['@id'] = id})
        if result[1] then
            result[1].image = GetPlayerProfilePicture(result[1].identifier)
            return result[1]
        end
    end)
    RPC.register("erp-mdt:saveWeaponInfo", function(serialnumber, imageurl, brand, type, notes)
        SQL("UPDATE mdt_weapons SET image = @image, brand = @brand, type = @type, information = @information WHERE serialnumber = @serialnumber", {
            ['@serialnumber'] = serialnumber,
            ['@image'] = imageurl, 
            ['@brand'] = brand,
            ['@type'] = type,
            ['@information'] = notes
        })
    end)
    RPC.register("erp-mdt:getVehicleData", function(plate)
        local result = SQL('SELECT * FROM '..Config["CoreSettings"]["QBCore"]["OwnedVehicles_Table"]..' WHERE plate = @plate', {['@plate'] = plate})
        if result[1] then
            result[1].bolo = CheckBoloStatus(plate)
            result[1].impound = CheckImpoundStatus(plate)
            result[1].name = GetFullNameFromIdentifier(result[1].citizenid)
            result[1].image = GetVehicleImage(plate)
            result[1].information = GetVehicleInformation(plate)
            result[1].code = GetVehicleCodeStatus(plate)
            result[1].stolen = GetVehicleStolenStatus(plate)
            return result[1]
        end
    end)
    RPC.register("erp-mdt:saveVehicleInfo", function(plate, imageurl, notes, code5, stolen)
        local result = SQL('SELECT * FROM mdt_vehicleinfo WHERE plate = @plate', {['@plate'] = plate})
        if result[1] then
            SQL("UPDATE mdt_vehicleinfo SET info = @info, image = @image WHERE plate = @plate", {
                ['@info'] = notes,
                ['@image'] = imageurl, 
                ['@plate'] = plate
            })
        else
            SQL('INSERT INTO mdt_vehicleinfo (plate, info, image, code5, stolen) VALUES (@plate, @info, @image, @code5, @stolen)', {
                ['@plate'] = plate, 
                ['@info'] = notes, 
                ['@image'] = imageurl,
                ['@code5'] = code5,
                ['@stolen'] = stolen,
            })
        end
    end)
    RPC.register("erp-mdt:knownInformation", function(type, status, plate)
        local result = SQL('SELECT * FROM mdt_vehicleinfo WHERE plate = @plate', {['@plate'] = plate})
        if result[1] then
            if type == "code5" then
                SQL("UPDATE mdt_vehicleinfo SET code5 = @code5 WHERE plate = @plate", {
                    ['@code5'] = status,
                    ['@plate'] = plate
                })
            elseif type == "stolen" then
                SQL("UPDATE mdt_vehicleinfo SET stolen = @stolen WHERE plate = @plate", {
                    ['@stolen'] = status,
                    ['@plate'] = plate
                })
            end
        else
            if type == "code5" then
                SQL('INSERT INTO mdt_vehicleinfo (plate, code5) VALUES (@plate, @code5)', {
                    ['@plate'] = plate, 
                    ['@code5'] = status
                })
            elseif type == "stolen" then
                SQL('INSERT INTO mdt_vehicleinfo (plate, stolen) VALUES (@plate, @stolen)', {
                    ['@plate'] = plate, 
                    ['@stolen'] = status
                })
            end
        end
    end)
    RPC.register("erp-mdt:getAllLogs", function()
        local result = SQL('SELECT * FROM mdt_logs LIMIT 120', {})
        return result
    end)
    RPC.register("erp-mdt:toggleDuty", function(cid, status)
        ChangePlayerDuty(cid, status)
    end)
    RPC.register("erp-mdt:setCallsign", function(cid, newcallsign)
        SetResourceKvp("erp-mdt:callsign-"..cid, tostring(newcallsign))
        return GetResourceKvpString("erp-mdt:callsign-"..cid)
    end)
    RPC.register("erp-mdt:setWaypoint", function(callid)
        return MDTDispatchData[callid]
    end)
    RegisterServerEvent("dispatch:svNotify", function(data)
        calls = calls + 1
        MDTDispatchData[calls] = data
    end)
    RPC.register("erp-mdt:callDetach", function(callid)
        local src = source
        local NewTable = {}
        for index, data in pairs(AttachedUnits) do
            if data.Source == src then
                table.remove(AttachedUnits, index)
            end
        end
        return callid, GetPlayerRadio(src)
    end)
    RPC.register("erp-mdt:removeCall", function(callid)
        MDTDispatchData[callid] = nil
        return source, callid
    end)
    RPC.register("erp-mdt:callAttach", function(callid)
        local src = source
        for _, data in pairs(AttachedUnits) do
            if data.CallId == callid then
                if data.Source == src then
                    table.remove(AttachedUnits, _)
                end
            end
        end
        table.insert(AttachedUnits, {
            CallId = callid,
            Source = src
        })
        return callid, GetPlayerRadio(src)
    end)
    RPC.register("erp-mdt:attachedUnits", function(callid)
        local ReturnData = {}
        for index, data in pairs(AttachedUnits) do
            if data.CallId == callid then
                local xPlayer = QBCore.Functions.GetPlayer(data.Source)
                table.insert(ReturnData, {
                    cid = xPlayer.PlayerData.citizenid,
                    job = xPlayer.PlayerData.job.label,
                    callsign = GetResourceKvpString("erp-mdt:callsign-"..xPlayer.PlayerData.citizenid) or "No Callsign",
                    fullname = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname
                })
            end
        end
        return ReturnData, callid
    end)
    RPC.register("erp-mdt:callDispatchDetach", function(callid, cid)
        local xPlayer = QBCore.Functions.GetPlayerByCitizenId(tostring(cid))
        for index, data in pairs(AttachedUnits) do
            if data.CallId == callid and data.Source == xPlayer.PlayerData.source then
                table.remove(AttachedUnits, index)
            end
        end
    end)
    RPC.register("erp-mdt:setDispatchWaypoint", function(callid)
        return MDTDispatchData[callid]
    end)
    RPC.register("erp-mdt:callDragAttach", function(callid, cid)
        local xPlayer = QBCore.Functions.GetPlayerByCitizenId(tostring(cid))
        for _, data in pairs(AttachedUnits) do
            if data.CallId == callid then
                if data.Source == xPlayer.PlayerData.source then
                    table.remove(AttachedUnits, _)
                end
            end
        end
        table.insert(AttachedUnits, {
            CallId = callid,
            Source = xPlayer.PlayerData.source
        })
    end)
    RPC.register("erp-mdt:sendMessage", function(message, time)
        local src = source
        local xPlayer = QBCore.Functions.GetPlayer(src)
        local ReturnData = {}
        SQL('INSERT INTO mdt_dashmessage (message, time, author, profilepic, job) VALUES (@message, @time, @author, @profilepic, @job)', {
            ['@message'] = message, 
            ['@time'] = time, 
            ['@author'] = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname,
            ['@profilepic'] = GetPlayerProfilePicture(xPlayer.PlayerData.citizenid),
            ['@job'] = xPlayer.PlayerData.job.name
        })
        ReturnData.message = message
        ReturnData.time = time
        ReturnData.name = xPlayer.PlayerData.charinfo.firstname..' '..xPlayer.PlayerData.charinfo.lastname
        ReturnData.profilepic = GetPlayerProfilePicture(xPlayer.PlayerData.citizenid)
        ReturnData.job = xPlayer.PlayerData.job.name
        return ReturnData
    end)
    RPC.register("erp-mdt:refreshDispatchMsgs", function()
        return GetAllMessages()
    end)
    RPC.register("erp-mdt:setWaypoint:unit", function(cid)
        local xPlayer = QBCore.Functions.GetPlayerByCitizenId(cid)
        local xPlayerCoords = GetEntityCoords(GetPlayerPed(xPlayer.PlayerData.source))
        return xPlayerCoords
    end)
    RPC.register("erp-mdt:isLimited", function()
        local xPlayer = QBCore.Functions.GetPlayer(source)
        for index, policejob in pairs(Config["PoliceJobs"]) do
            for index, emsjob in pairs(Config["EMSJobs"]) do
                if xPlayer.PlayerData.job.name == emsjob then
                    return true
                elseif xPlayer.PlayerData.job.name == policejob then
                    return false
                end
            end
        end
        return true
    end)
end

Citizen.CreateThread(function()
    if Config["CoreSettings"]["Core"] == "qbcore" then
        if Config["CoreSettings"]["QBCore"]["QBCoreVersion"] == "new" then
            QBCore = Config["CoreSettings"]["QBCore"]["QBCoreExport"]
        elseif Config["CoreSettings"]["QBCore"]["QBCoreVersion"] == "old" then
            TriggerEvent(Config["CoreSettings"]["QBCore"]["QBUSTrigger"], function(obj) QBCore = obj end)
        end
        LoadQBCoreVersion()
    end
end)
