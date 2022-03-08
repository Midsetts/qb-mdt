Config = {}

Config["MDTCommand"] = "mdt"

Config["PoliceJobs"] = {
    "police"
}

Config["EMSJobs"] = {
    "ambulance"
}

Config["PoliceRosterLink"] = ""

Config["EMSRosterLink"] = ""

Config["PublicRecords"] = {
    ['Coords'] = vector3(236.35, -409.44, 47.92),
    ['AllowImageChange'] = false
}

Config["SQLWrapper"] = "oxmysql" -- Your sql wrapper | mysql-async / oxmysql / ghmattimysql

Config["CoreSettings"]  = {
    ["Core"] = "qbcore", -- Your core | qbcore, esx,
    ["QBCore"] = {
        ["QBCoreVersion"] = "new", -- new = using exports | old = using events
        ["QBCoreExport"] = exports['qb-core']:GetCoreObject(), -- If you are using old qbcore version just remove this line
        ["QBUSTrigger"] = "QBCore:GetObject",
        ["Players_Table"] = "players",
        ["OwnedVehicles_Table"] = "player_vehicles"
    }
}

Config['OffensesTitels'] = {
    [1] = 'OFFENSES AGAINST PERSONS',
	[2] = 'OFFENSES INVOLVING THEFT',
	[3] = 'OFFENSES INVOLVING FRAUD',
	[4] = 'OFFENSES INVOLVING DAMAGE TO PROPERTY',
	[5] = 'OFFENSES AGAINST PUBLIC ADMINISTRATION',
	[6] = 'OFFENSES AGAINST PUBLIC ORDER',
	[7] = 'OFFENSES AGAINST HEALTH AND MORALS',
	[8] = 'OFFENSES AGAINST PUBLIC SAFETY',
	[9] = 'OFFENSES INVOLVING THE OPERATION OF A VEHICLE',
	[10] = 'OFFENSES INVOLVING THE WELL-BEING OF WILDLIFE'
}

Config["Offenses"] = {
    [1] = {
        [1] = { title = 'Simple Assault', class = 'Misdemeanor', id = 'P.C. 1001', months = 10, fine = 200, color = 'green' },
        [2] = { title = 'Assault', class = 'Misdemeanor', id = 'P.C. 1002', months = 20, fine = 450, color = 'orange' },
        [3] = { title = 'Aggravated Assault', class = 'Felony', id = 'P.C. 1003', months = 30, fine = 700, color = 'orange' },
        [4] = { title = 'Assault with a deadly weapon', class = 'Felony', id = 'P.C. 1004', months = 50, fine = 2500, color = 'red' },
        [5] = { title = 'Involuntary Manslaughter', class = 'Felony', id = 'P.C. 1005', months = 60, fine = 5000, color = 'red' },
        [6] = { title = 'Voluntary Manslaughter', class = 'Felony', id = 'P.C. 1006', months = 100, fine = 10000, color = 'red' },
        [7] = { title = 'Vehicular Manslaughter', class = 'Felony', id = 'P.C. 1007', months = 100, fine = 3000, color = 'red' },
        [8] = { title = 'Attempted Murder of a civilian', class = 'Felony', id = 'P.C. 1008', months = 50, fine = 5000, color = 'red' },
        [9] = { title = 'Second Degree Murder', class = 'Felony', id = 'P.C. 1009', months = 100, fine = 6000, color = 'red' },
        [10] = { title = 'Accessory to Second Degree Murder', class = 'Felony', id = 'P.C. 1010', months = 50, fine = 3000, color = 'red' },
        [11] = { title = 'First Degree Murder', class = 'Felony', id = 'P.C. 1011', months = 0, fine = 0, color = 'red' },
        [12] = { title = 'Accessory to First Degree Murder', class = 'Felony', id = 'P.C. 1012', months = 0, fine = 0, color = 'red' },
        [13] = { title = 'Murder of a Public Servant or Peace Officer', class = 'Felony', id = 'P.C. 1013', months = 0, fine = 0, color = 'red' },
        [14] = { title = 'Attempted Murder of a Public Servant or Peace Officer', class = 'Felony', id = 'P.C. 1014', months = 100, fine = 7500, color = 'red' },
        [15] = { title = 'Accessory to the Murder of a Public Servant or Peace Officer', class = 'Felony', id = 'P.C. 1015', months = 0, fine = 0, color = 'red' },
        [16] = { title = 'Unlawful Imprisonment', class = 'Misdemeanor', id = 'P.C. 1016', months = 20, fine = 400, color = 'green' },
        [17] = { title = 'Kidnapping', class = 'Felony', id = 'P.C. 1017', months = 30, fine = 600, color = 'orange' },
        [18] = { title = 'Hostage Taking', class = 'Felony', id = 'P.C. 1018', months = 50, fine = 1000, color = 'orange' },
        [19] = { title = 'Criminal Threats', class = 'Misdemeanor', id = 'P.C. 1019', months = 5, fine = 300, color = 'orange' },
        [20] = { title = 'Reckless Endagerment', class = 'Misdemeanor', id = 'P.C. 1020', months = 10, fine = 500, color = 'orange' },
        [21] = { title = 'Gang Related Shooting', class = 'Felony', id = 'P.C. 1021', months = 60, fine = 400, color = 'red' },
        [22] = { title = 'Unlawful Imprisonment of a Public Servant or Peace Officer.', class = 'Felony', id = 'P.C. 1022', months = 100, fine = 5000, color = 'orange' },
        [23] = { title = 'Cannibalism', class = 'Felony', id = 'P.C. 1023', months = 40, fine = 2000, color = 'red' },
        [24] = { title = 'Torture', class = 'Felony', id = 'P.C. 1024', months = 40, fine = 2000, color = 'red' },
	},
	[2] = {       
        [1] = { title = 'Petty Theft', class = 'infraction', id = 'P.C. 2001', months = 0, fine = 200, color = 'green' }, 
        [2] = { title = 'Grand Theft', class = 'Misdemeanor', id = 'P.C. 2002', months = 10, fine = 400, color = 'green' },
        [3] = { title = 'Grand Theft Auto A', class = 'Felony', id = 'P.C. 2003', months = 20, fine = 600, color = 'green' },
        [4] = { title = 'Grand Theft Auto B', class = 'Felony', id = 'P.C. 2004', months = 50, fine = 5000, color = 'green' },
        [5] = { title = 'Burglary', class = 'Misdemeanor', id = 'P.C. 2005', months = 20, fine = 300, color = 'green' },
        [6] = { title = 'Robbery (A)', class = 'Felony', id = 'P.C. 2006', months = 20, fine = 400, color = 'green' },
        [7] = { title = 'Attempted Robbery (A)', class = 'Felony', id = 'P.C. 2007', months = 15, fine = 200, color = 'green' },
        [8] = { title = 'Accessory to Robbery (A)', class = 'Felony', id = 'P.C. 2008', months = 5, fine = 100, color = 'green' },
        [9] = { title = 'Armed Robbery (A)', class = 'Felony', id = 'P.C. 2009', months = 20, fine = 600, color = 'orange' },
        [10] = { title = 'Attempted Armed Robbery (A)', class = 'Felony', id = 'P.C. 2010', months = 15, fine = 300, color = 'orange' },
        [11] = { title = 'Accessory to Armed Robbery (A)', class = 'Felony', id = 'P.C. 2011', months = 10, fine = 300, color = 'orange' },
        [12] = { title = 'Robbery (B)', class = 'Felony', id = 'P.C. 2012', months = 25, fine = 800, color = 'green' },
        [13] = { title = 'Attempted Robbery (B)', class = 'Felony', id = 'P.C. 2013', months = 20, fine = 400, color = 'green' },
        [14] = { title = 'Accessory to Robbery (B)', class = 'Felony', id = 'P.C. 2014', months = 15, fine = 250, color = 'green' },
        [15] = { title = 'Armed Robbery (B)', class = 'Felony', id = 'P.C. 2015', months = 30, fine = 1200, color = 'orange' },
        [16] = { title = 'Attempted Armed Robbery (B)', class = 'Felony', id = 'P.C. 2016', months = 25, fine = 600, color = 'orange' },
        [17] = { title = 'Accessory to Armed Robbery (B)', class = 'Felony', id = 'P.C. 2017', months = 20, fine = 300, color = 'orange' },
        [18] = { title = 'Robbery (C)', class = 'Felony', id = 'P.C. 2018', months = 35, fine = 1600, color = 'green' },
        [19] = { title = 'Attempted Robbery (C)', class = 'Felony', id = 'P.C. 2019', months = 30, fine = 800, color = 'green' },
        [20] = { title = 'Accessory to Robbery (C)', class = 'Felony', id = 'P.C. 2020', months = 25, fine = 400, color = 'green' },
        [21] = { title = 'Armed Robbery (C)', class = 'Felony', id = 'P.C. 2021', months = 40, fine = 2400, color = 'orange' },
        [22] = { title = 'Attempted Armed Robbery (C)', class = 'Felony', id = 'P.C. 2022', months = 35, fine = 1200, color = 'orange' },
        [23] = { title = 'Accessory to Armed Robbery (C)', class = 'Felony', id = 'P.C. 2023', months = 30, fine = 600, color = 'orange' },
        [24] = { title = 'Grand Larceny', class = 'Felony', id = 'P.C. 2024', months = 50, fine = 1000, color = 'orange' },
        [25] = { title = 'Leaving Without Paying', class = 'Misdemeanor', id = 'P.C. 2025', months = 10, fine = 100, color = 'green' },
        [26] = { title = 'Possession of Nonlegal Currency (A)', class = 'Infraction', id = 'P.C. 2026', months = 0, fine = 0, color = 'green' },
        [27] = { title = 'Possession of Nonlegal Currency (B)', class = 'Infraction', id = 'P.C. 2027', months = 0, fine = 0, color = 'green' },
        [28] = { title = 'Possession of Nonlegal Currency (C)', class = 'Misdemeanor', id = 'P.C. 2028', months = 30, fine = 50, color = 'orange' },
        [29] = { title = 'Possession of Items Used in the Commission of a Crime', class = 'Misdemeanor', id = 'P.C. 2029', months = 10, fine = 150, color = 'green' },
        [30] = { title = 'Sale of Items Used in the Commission of a Crime', class = 'Felony', id = 'P.C. 2030', months = 20, fine = 400, color = 'orange' },
	},
	[3] = { 
        [1] = { title = 'Impersonating', class = 'Misdemeanor', id = 'P.C. 3001', months = 10, fine = 300, color = 'green' }, 
        [2] = { title = 'Impersonating a Peace Officer', class = 'Felony', id = 'P.C. 3002', months = 50, fine = 3000, color = 'green' },
        [3] = { title = 'Impersonating a Judge', class = 'Felony', id = 'P.C. 3003', months = 0, fine = 0, color = 'green' },
        [4] = { title = 'Possession of Stolen Identification', class = 'Misdemeanor', id = 'P.C. 3004', months = 20, fine = 500, color = 'green' },
        [5] = { title = 'Extortion', class = 'Felony', id = 'P.C. 3005', months = 25, fine = 600, color = 'orange' },
        [6] = { title = 'Fraud', class = 'Misdemeanor', id = 'P.C. 3006', months = 15, fine = 300, color = 'green' },
        [7] = { title = 'Forgery', class = 'Misdemeanor', id = 'P.C. 3007', months = 10, fine = 500, color = 'green' },
        [8] = { title = 'Money Laundering', class = 'Felony', id = 'P.C. 3008', months = 0, fine = 0, color = 'red' },
	},
	[4] = { 
        [1] = { title = 'Trespassing', class = 'Misdemeanor', id = 'P.C. 4001', months = 10, fine = 300, color = 'green' },
        [2] = { title = 'Felony Trespassing', class = 'Felony', id = 'P.C. 4002', months = 20, fine = 1000, color = 'green' },
        [3] = { title = 'Arson', class = 'Felony', id = 'P.C. 4003', months = 15, fine = 500, color = 'orange' },
        [4] = { title = 'Vandalism', class = 'infraction', id = 'P.C. 4004', months = 0, fine = 200, color = 'green' },
        [5] = { title = 'Vandalism of Government Property', class = 'Felony', id = 'P.C. 4005', months = 30, fine = 1000, color = 'green' },
	},
	[5] = { 
        [1] = { title = 'Bribery of a Government Official', class = 'Felony', id = 'P.C. 5001', months = 20, fine = 300, color = 'green' },
        [2] = { title = 'Anti-Mask Law', class = 'Misdemeanor', id = 'P.C. 5002', months = 10, fine = 500, color = 'green' },
        [3] = { title = 'Possession of Contraband in a Government Facility', class = 'Felony', id = 'P.C. 5003', months = 20, fine = 600, color = 'green' },
        [4] = { title = 'Criminal Possession of Stolen Property', class = 'Misdemeanor', id = 'P.C. 5004', months = 10, fine = 250, color = 'green' },
        [5] = { title = 'Escaping', class = 'Felony', id = 'P.C. 5005', months = 15, fine = 300, color = 'green' },
        [6] = { title = 'Jailbreak', class = 'Felony', id = 'P.C. 5006', months = 30, fine = 500, color = 'orange' },
        [7] = { title = 'Accessory to Jailbreak', class = 'Felony', id = 'P.C. 5007', months = 15, fine = 250, color = 'orange' },
        [8] = { title = 'Attempted Jailbreak', class = 'Felony', id = 'P.C. 5008', months = 10, fine = 150, color = 'orange' },
        [9] = { title = 'Perjury', class = 'Felony', id = 'P.C. 5009', months = 0, fine = 0, color = 'green' },
        [10] = { title = 'Violation of a Restraining Order', class = 'Felony', id = 'P.C. 5010', months = 30, fine = 500, color = 'green' },
        [11] = { title = 'Embezzlement', class = 'Felony', id = 'P.C. 5011', months = 30, fine = 500, color = 'green' },
        [12] = { title = 'Unlawful Practice', class = 'Felony', id = 'P.C. 5012', months = 20, fine = 1000, color = 'orange' },
        [13] = { title = 'Misuse of Emergency Systems', class = 'Misdemeanor', id = 'P.C. 5013', months = 10, fine = 400, color = 'orange' },
        [14] = { title = 'Conspiracy', class = 'Misdemeanor', id = 'P.C. 5014', months = 8, fine = 300, color = 'green' },
        [15] = { title = 'Violating a Court Order', class = 'Misdemeanor', id = 'P.C. 5015', months = 0, fine = 0, color = 'orange' },
        [16] = { title = 'Failure to Appear', class = 'Misdemeanor', id = 'P.C. 5016', months = 0, fine = 0, color = 'orange' },
        [17] = { title = 'Contempt of Court', class = 'Felony', id = 'P.C. 5017', months = 0, fine = 0, color = 'orange' },
	},
	[6] = { 
        [1] = { title = 'Disobeying a Peace Officer', class = 'infraction', id = 'P.C. 6001', months = 0, fine = 500, color = 'green' },
        [2] = { title = 'Disorderly Conduct', class = 'Misdemeanor', id = 'P.C. 6002', months = 10, fine = 150, color = 'green' },
        [3] = { title = 'Disturbing the Peace', class = 'infraction', id = 'P.C. 6003', months = 0, fine = 200, color = 'green' },
        [4] = { title = 'False Reporting', class = 'Misdemeanor', id = 'P.C. 6004', months = 10, fine = 500, color = 'green' },
        [5] = { title = 'Harassment', class = 'Misdemeanor', id = 'P.C. 6005', months = 10, fine = 300, color = 'orange' },
        [6] = { title = 'Obstruction', class = 'Felony', id = 'P.C. 6006', months = 20, fine = 600, color = 'green' },
        [7] = { title = 'Inciting a Riot', class = 'Felony', id = 'P.C. 6007', months = 30, fine = 500, color = 'orange' },
        [8] = { title = 'Loitering on Government Properties', class = 'infraction', id = 'P.C. 6008', months = 0, fine = 300, color = 'green' },
        [9] = { title = 'Tampering', class = 'Felony', id = 'P.C. 6009', months = 15, fine = 300, color = 'green' },
        [10] = { title = 'Failure to provide Identification', class = 'Misdemeanor', id = 'P.C. 6010', months = 25, fine = 1000, color = 'green' },
        [11] = { title = 'Vigilantism', class = 'Felony', id = 'P.C. 6011', months = 40, fine = 1000, color = 'orange' },
        [12] = { title = 'Unlawful Assembly', class = 'Misdemeanor', id = 'P.C. 6012', months = 10, fine = 500, color = 'orange' },
        [13] = { title = 'Government Corruption', class = 'Felony', id = 'P.C. 6013', months = 0, fine = 0, color = 'red' },
        [14] = { title = 'Stalking', class = 'Felony', id = 'P.C. 6014', months = 60, fine = 500, color = 'orange' },
        [15] = { title = 'Aiding and Abetting', class = 'Misdemeanor', id = 'P.C. 6015', months = 20, fine = 300, color = 'orange' },
	},
	[7] = { 
        [1] = { title = 'Misdemeanor Possession of Marijuana', class = 'Mask', id = 'P.C. 7001', months = 5, fine = 150, color = 'green' },
        [2] = { title = 'Felony Possession of Marijuana', class = 'Felony', id = 'P.C. 7002', months = 15, fine = 450, color = 'green' },
        [3] = { title = 'Cultivation of Marijuana A', class = 'Misdemeanor', id = 'P.C. 7003', months = 10, fine = 500, color = 'green' },
        [4] = { title = 'Cultivation of Marijuana B', class = 'Felony', id = 'P.C. 7004', months = 30, fine = 2000, color = 'orange' },
        [5] = { title = 'Possession of Marijuana with intent to distribute', class = 'Felony', id = 'P.C. 7005', months = 40, fine = 2000, color = 'orange' },
        [6] = { title = 'Misdemeanor Possession of Cocaine', class = 'Misdemeanor', id = 'P.C. 7006', months = 10, fine = 400, color = 'green' },
        [7] = { title = 'Felony Possession of Cocaine', class = 'Felony', id = 'P.C. 7007', months = 25, fine = 800, color = 'green' },
        [8] = { title = 'Possession of Cocaine with intent to distribute', class = 'Felony', id = 'P.C. 7008', months = 40, fine = 2000, color = 'orange' },
        [9] = { title = 'Misdemeanor Possession of Methamphetamine', class = 'Misdemeanor', id = 'P.C. 7009', months = 10, fine = 800, color = 'green' },
        [10] = { title = 'Felony Possession of Methamphetamine', class = 'Felony', id = 'P.C. 7010', months = 25, fine = 800, color = 'green' },
        [11] = { title = 'Possession of Methamphetamine with intent to distribute', class = 'Felony', id = 'P.C. 7011', months = 40, fine = 4000, color = 'orange' },
        [12] = { title = 'Misdemeanor Possession of Oxy / Vicodin', class = 'Felony', id = 'P.C. 7012', months = 10, fine = 525, color = 'green' },
        [13] = { title = 'Felony Possession of Oxy / Vicodin', class = 'Felony', id = 'P.C. 7013', months = 25, fine = 1000, color = 'green' },
        [14] = { title = 'Felony Possession of Oxy / Vicodin with intent to distribute', class = 'Felony', id = 'P.C. 7014', months = 40, fine = 1500, color = 'orange' },
        [15] = { title = 'Misdemeanor Possession of Ecstasy', class = 'Misdemeanor', id = 'P.C. 7015', months = 10, fine = 400, color = 'green' },
        [16] = { title = 'Felony Possession of Ecstasy', class = 'Felony', id = 'P.C. 7016', months = 20, fine = 800, color = 'green' },
        [17] = { title = 'Possession of Ecstasy with intent to distribute', class = 'Felony', id = 'P.C. 7017', months = 40, fine = 2000, color = 'orange' },
        [18] = { title = 'Misdemeanor Possession of Opium', class = 'Misdemeanor', id = 'P.C. 7018', months = 10, fine = 400, color = 'green' },
        [19] = { title = 'Felony Possession of Opium', class = 'Felony', id = 'P.C. 7019', months = 25, fine = 800, color = 'green' },
        [20] = { title = 'Possession of Opium with intent to distribute', class = 'Felony', id = 'P.C. 7020', months = 40, fine = 2000, color = 'orange' },
        [21] = { title = 'Sale of a controlled substance', class = 'Misdemeanor', id = 'P.C. 7021', months = 10, fine = 500, color = 'green' },
        [22] = { title = 'Drug Trafficking', class = 'Felony', id = 'P.C. 7022', months = 0, fine = 0, color = 'red' },
        [23] = { title = 'Desecration of a Human Corpse', class = 'Felony', id = 'P.C. 7023', months = 35, fine = 1000, color = 'orange' },
        [24] = { title = 'Public Intoxication', class = 'infraction', id = 'P.C. 7024', months = 0, fine = 100, color = 'green' },
        [25] = { title = 'Public Indecency', class = 'Misdemeanor', id = 'P.C. 7025', months = 10, fine = 500, color = 'green' },
        [26] = { title = 'Misdemeanor Possession of Adderall', class = 'Misdemeanor', id = 'P.C. 7026', months = 10, fine = 400, color = 'green' },
        [27] = { title = 'Felony Possession of Adderall', class = 'Felony', id = 'P.C. 7027', months = 20, fine = 1000, color = 'green' },
        [28] = { title = 'Possession of Adderall with Intent to Distribute', class = 'Felony', id = 'P.C. 7028', months = 40, fine = 4000, color = 'orange' },
        [29] = { title = 'Misdemeanor Possession of Xanax', class = 'Misdemeanor', id = 'P.C. 7029', months = 10, fine = 400, color = 'green' },
        [30] = { title = 'Felony Possession of Xanax', class = 'Felony', id = 'P.C. 7030', months = 20, fine = 1000, color = 'green' },
        [31] = { title = 'Possession of Xanax with Intent to Distribute', class = 'Felony', id = 'P.C. 7031', months = 40, fine = 4000, color = 'orange' },
        [32] = { title = 'Misdemeanor Possession of Shrooms', class = 'Misdemeanor', id = 'P.C. 7032', months = 5, fine = 200, color = 'green' },
        [33] = { title = 'Felony Possession of Shrooms', class = 'Felony', id = 'P.C. 7033', months = 15, fine = 500, color = 'green' },
        [34] = { title = 'Possession of Shrooms with Intent to Distribute', class = 'Felony', id = 'P.C. 7034', months = 40, fine = 2000, color = 'orange' },
        [35] = { title = 'Misdemeanor Possession of Lean', class = 'Misdemeanor', id = 'P.C. 7035', months = 5, fine = 200, color = 'green' },
        [36] = { title = 'Felony Possession of Lean', class = 'Felony', id = 'P.C. 7036', months = 15, fine = 500, color = 'green' },
        [37] = { title = 'Possession of Lean with Intent to Distribute', class = 'Felony', id = 'P.C. 7037', months = 40, fine = 2000, color = 'orange' },
	},
	[8] = { 
        [1] = { title = 'Criminal Possession of Weapon Class A', class = 'Felony', id = 'P.C. 8001', months = 10, fine = 300, color = 'green' },
        [2] = { title = 'Criminal Possession of weapon class B', class = 'Felony', id = 'P.C. 8002', months = 25, fine = 500, color = 'green' },
        [3] = { title = 'Criminal Possession of Weapon/Item Class C', class = 'Felony', id = 'P.C. 8003', months = 100, fine = 3000, color = 'green' },
        [4] = { title = 'Criminal Possession of Weapon Class D', class = 'Felony', id = 'P.C. 8004', months = 40, fine = 1000, color = 'green' },
        [5] = { title = 'Criminal Sale of Weapon Class A', class = 'Felony', id = 'P.C. 8005', months = 25, fine = 500, color = 'orange' },
        [6] = { title = 'Criminal Sale of Weapon Class B', class = 'Felony', id = 'P.C. 8006', months = 45, fine = 1000, color = 'orange' },
        [7] = { title = 'Criminal Sale of Weapon Class C', class = 'Felony', id = 'P.C. 8007', months = 150, fine = 5000, color = 'orange' },
        [8] = { title = 'Criminal Sale of Weapon Class D', class = 'Felony', id = 'P.C. 8008', months = 60, fine = 2000, color = 'orange' },
        [9] = { title = 'Criminal Use of Weapon', class = 'Misdemeanor', id = 'P.C. 8009', months = 10, fine = 600, color = 'orange' },
        [10] = { title = 'Possession of Illegal Firearm Modifications', class = 'Misdemeanor', id = 'P.C. 8010', months = 10, fine = 200, color = 'green' },
        [11] = { title = 'Weapon Trafficking', class = 'Felony', id = 'P.C. 8011', months = 0, fine = 0, color = 'red' },
        [12] = { title = 'Brandishing', class = 'Misdemeanor', id = 'P.C. 8012', months = 5, fine = 100, color = 'orange' },
        [13] = { title = 'Insurrection', class = 'Felony', id = 'P.C. 8013', months = 200, fine = 45000, color = 'red' },
        [14] = { title = 'Flying into Restricted Airspace', class = 'Felony', id = 'P.C. 8014', months = 30, fine = 1000, color = 'green' },
        [15] = { title = 'Jaywalking', class = 'infraction', id = 'P.C. 8015', months = 0, fine = 100, color = 'green' },
	},
	[9] = {
        [1] = { title = 'Driving While Intoxicated', class = 'Misdemeanor', id = 'P.C. 9001', months = 7, fine = 200, color = 'green' },
        [2] = { title = 'Evading', class = 'Misdemeanor', id = 'P.C. 9002', months = 5, fine = 250, color = 'green' },
        [3] = { title = 'Reckless Evading', class = 'Felony', id = 'P.C. 9003', months = 10, fine = 450, color = 'orange' },
        [4] = { title = 'Failure to Yield to Emergency Vehicle', class = 'infraction', id = 'P.C. 9004', months = 0, fine = 600, color = 'green' },
        [5] = { title = 'Failure to Obey Traffic Control Device', class = 'infraction', id = 'P.C. 9005', months = 0, fine = 100, color = 'green' },
        [6] = { title = 'Nonfunctional Vehicle', class = 'infraction', id = 'P.C. 9006', months = 0, fine = 50, color = 'green' },
        [7] = { title = 'Negligent Driving', class = 'infraction', id = 'P.C. 9007', months = 0, fine = 200, color = 'green' },
        [8] = { title = 'Reckless Driving', class = 'Felony', id = 'P.C. 9008', months = 10, fine = 500, color = 'orange' },
        [9] = { title = 'Third Degree Speeding', class = 'infraction', id = 'P.C. 9009', months = 0, fine = 150, color = 'green' },
        [10] = { title = 'Second Degree Speeding', class = 'infraction', id = 'P.C. 9010', months = 0, fine = 300, color = 'green' },
        [11] = { title = 'First Degree Speeding', class = 'infraction', id = 'P.C. 9011', months = 0, fine = 400, color = 'green' },
        [12] = { title = 'Unlicensed Operation of Vehicle', class = 'infraction', id = 'P.C. 9012', months = 0, fine = 400, color = 'green' },
        [13] = { title = 'Illegal U-Turn', class = 'infraction', id = 'P.C. 9013', months = 0, fine = 50, color = 'green' },
        [14] = { title = 'Illegal Passing', class = 'infraction', id = 'P.C. 9014', months = 0, fine = 200, color = 'green' },
        [15] = { title = 'Failure to Maintain Lane', class = 'infraction', id = 'P.C. 9015', months = 0, fine = 200, color = 'green' },
        [16] = { title = 'Illegal Turn', class = 'infraction', id = 'P.C. 9016', months = 0, fine = 100, color = 'green' },
        [17] = { title = 'Failure to Stop', class = 'infraction', id = 'P.C. 9017', months = 0, fine = 400, color = 'green' },
        [18] = { title = 'Unauthorized Parking', class = 'infraction', id = 'P.C. 9018', months = 0, fine = 200, color = 'green' },
        [19] = { title = 'Hit and Run', class = 'Misdemeanor', id = 'P.C. 9019', months = 10, fine = 300, color = 'green' },
        [20] = { title = 'Driving without Headlights or Signals', class = 'infraction', id = 'P.C. 9020', months = 0, fine = 200, color = 'green' },
        [21] = { title = 'Street Racing', class = 'Misdemeanor', id = 'P.C. 9021', months = 20, fine = 600, color = 'green' },
        [22] = { title = 'Piloting without Proper Licensing', class = 'Felony', id = 'P.C. 9022', months = 30, fine = 1000, color = 'orange' },
        [23] = { title = 'Unlawful Use of a Motorvehicle', class = 'Misdemeanor', id = 'P.C. 9023', months = 10, fine = 500, color = 'green' },
	},
	[10] = {
        [1] = { title = 'Hunting in Restricted Areas', class = 'infraction', id = 'P.C. 10001', months = 0, fine = 300, color = 'green' },
        [2] = { title = 'Unlicensed Hunting', class = 'infraction', id = 'P.C. 10002', months = 0, fine = 300, color = 'green' },
        [3] = { title = 'Animal Cruelty', class = 'Misdemeanor', id = 'P.C. 10003', months = 10, fine = 500, color = 'green' },
        [4] = { title = 'Hunting with a Non-Hunting Weapon', class = 'Misdemeanor', id = 'P.C. 10004', months = 10, fine = 500, color = 'green' },
        [5] = { title = 'Hunting outside of hunting hours', class = 'Infraction', id = 'P.C. 10005', months = 0, fine = 300, color = 'green' },	
        [6] = { title = 'Poaching', class = 'Felony', id = 'P.C. 10006', months = 20, fine = 700, color = 'red' },
	}
}

Config['TreatmentsTitels'] = {
    [1] = 'TEST TITLE'
}

Config['Treatments'] = {
    [1] = {
        [1] = { title = 'Test #1', class = 'Test #1', id = 'Test #1', fine = 300, color = 'green' },
        [2] = { title = 'Test #2', class = 'Test #2', id = 'Test #2', fine = 300, color = 'red' },
        [3] = { title = 'Test #3', class = 'Test #3', id = 'Test #3', fine = 500, color = 'orange' },
    }
}

Config["StaffLogs"] = {
    ["NewBulletin"] = "%s Created New Bulletin.",
    ["DeleteBulletin"] = "%s Deleted Bulletin.",
    ["NewIncident"] = "%s Created New Incident.",
    ["EditIncident"] = "%s Edited Incident.",
    ["DeleteIncident"] = "%s Deleted Incident.",
    ["NewReport"] = "%s Created New Report.",
    ["EditReport"] = "%s Edited Report.",
    ["DeleteReport"] = "%s Deleted Report.",
    ["NewBolo"] = "%s Created New Bolo.",
    ["EditBolo"] = "%s Edited Bolo.",
    ["DeleteBolo"] = "%s Deleted Bolo.",
    ["DeleteMissing"] = "%s Deleted Missing Citizen."
}
