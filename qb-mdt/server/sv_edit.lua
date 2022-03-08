-- ######################################################
-- ### This Function Will Get All The Player Licenses ###
-- ######################################################

GetPlayerLicenses = function(identifier, type)
    local response = false
    local Player = QBCore.Functions.GetPlayerByCitizenId(identifier)
    if Player ~= nil then
        return Player.PlayerData.metadata.licences[type]
    else
        local result = SQL('SELECT * FROM players WHERE citizenid = @identifier', {['@identifier'] = identifier})
        if result[1] ~= nil then
            local metadata = json.decode(result[1].metadata)
            if metadata["licences"][type] ~= nil and metadata["licences"][type] then
                return true
            end
        end
    end
end

-- #################################################
-- ### This Function Will Get Player Duty Status ###
-- #################################################

GetPlayerDutyStatus = function(src)
    local source = src
    local Player = QBCore.Functions.GetPlayer(source)
    return Player.PlayerData.job.onduty
end

-- ###################################################
-- ### This Function Will Get Player Radio Channel ###
-- ###################################################

GetPlayerRadio = function(src)
    local src = source
	local ply = Player(src)

    return ply.state.radioChannel  -- Return The Player Radio Channel
end

-- ####################################################
-- ### This Function Will Update Player Duty Status ###
-- ####################################################

ChangePlayerDuty = function(identifier, status)
    --TriggerEvent("QBCore:ToggleDuty") -- this cannot be called from the server-side, must use client-side solution
    -- TriggerEvent("police:updateDuty", identifier, status) Example
end

-- ######################################################
-- ### This Function Will Manage Player Duty Licenses ###
-- ######################################################

ManageLicenses = function(identifier, type, status)
    local Player = QBCore.Functions.GetPlayerByCitizenId(identifier)
    local licenseStatus = nil
    if status == "give" then licenseStatus = true elseif status == "revoke" then licenseStatus = false end
    if Player ~= nil then
        local licences = Player.PlayerData.metadata["licences"]
        local newLicenses = {}
        for k, v in pairs(licences) do
            local status = v
            if k == type then
                status = licenseStatus
            end
            newLicenses[k] = status
        end
        Player.Functions.SetMetaData("licences", newLicenses)
    else
        local licenseType = '$.licences.'..type
        local result = SQL('UPDATE `players` SET `metadata` = JSON_REPLACE(`metadata`, ?, ?) WHERE `citizenid` = ?', {licenseType, licenseStatus, identifier})
    end
end

-- ##############################################
-- ### This Function Will Send Player To Jail ###
-- ##############################################

JailPlayer = function(src, identifier, time)
    local Player = QBCore.Functions.GetPlayer(src)
    local Target = QBCore.Functions.GetPlayerByCitizenId(identifier)
    if Player.PlayerData.job.name == "police" and Player.PlayerData.job.onduty then
        TriggerClientEvent("police:client:JailCommand", src, Target.PlayerData.source, time)
    end
end

-- #######################################################
-- ### This Function Will Check Vehicle Impound Status ###
-- #######################################################

CheckImpoundStatus = function(plate)
    -- Return True If Vehicle Is Impounded Else Return False
    local result = SQL('SELECT * FROM player_vehicles WHERE plate = @plate', {['@plate'] = plate})
    if result[1] then
        if result[1].state == 1 then
            return false
        else
            return true
        end
    end
end

-- ##############################
-- ### Staff Logs Permissions ###
-- ##############################

isAdmin = function(src)
    local src = source
    local response = QBCore.Functions.HasPermission(src, 'admin')
    return response
    -- Return True If The Player Have Admin Permission Else Return False
end