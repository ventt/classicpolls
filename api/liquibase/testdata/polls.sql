insert into api.poll (id, user_sub, title, description, created_at, category_name)
values  ('e142753e-bc9e-4856-a68f-e4cc9591e7b9', 527838957325778954, 'Remove Barrens', 'Remove Barrens from existence', '2025-10-28 22:35:41.737529 +00:00', 'World'),
        ('401a7c03-770e-4487-ae79-188ab8876f27', 1005133725123760160, 'Kill all Gnomes', 'Gnomes are filth', '2025-10-28 22:35:41.737529 +00:00', 'Races'),
        ('1a2b3c4d-5e6f-4a70-9b90-112233445502', 1000000000000000002, 'Improve quest tracker', 'Add better tracking for objectives without changing gameplay.', '2025-10-28 22:36:05 +00:00', 'UI'),
        ('2b3c4d5e-6f70-4b80-ac01-223344556603', 1000000000000000005, 'Dual talent specialization', 'Allow swapping between two talent builds at an inn or capital city.', '2025-10-28 22:36:10 +00:00', 'Talents'),
        ('3c4d5e6f-7081-4c90-bd12-334455667704', 1000000000000000006, 'Buff underused talents slightly', 'Small numeric tweaks to rarely used talents to increase build diversity.', '2025-10-28 22:36:15 +00:00', 'Talents'),
        ('4d5e6f70-8192-4da0-8e23-445566778805', 1000000000000000009, 'Increase Black Lotus spawns', 'Slightly increase spawn rate and spread to reduce monopolies.', '2025-10-28 22:36:20 +00:00', 'Professions'),
        ('5e6f7081-92a3-4eb0-9f34-556677889906', 1000000000000000011, 'Naxx attunement cost reduction', 'Lower the total materials and gold required for Naxxramas attunement.', '2025-10-28 22:36:25 +00:00', 'Raids'),
        ('6f708192-a3b4-4fc0-a045-66778899aa07', 1000000000000000015, 'Fix PvP leeway edge cases', 'Tighten melee range leeway interactions to feel more consistent.', '2025-10-28 22:36:30 +00:00', 'PvP'),
        ('708192a3-b4c5-40d0-b156-778899aabb08', 1000000000000000016, 'Meeting stone summoning', 'Enable summoning at meeting stones to reduce downtime for groups.', '2025-10-28 22:36:35 +00:00', 'Dungeons'),
        ('8192a3b4-c5d6-41e0-8a67-8899aabbcc09', 1000000000000000018, 'World buff limits in raids', 'Cap the number of world buffs active in raids to balance progression.', '2025-10-28 22:36:40 +00:00', 'Raids'),
        ('92a3b4c5-d6e7-42f0-9b78-99aabbccdd10', 1000000000000000020, 'Threat API for addons',
         'Expose read-only threat values for better tanking tools.', '2025-10-28 22:36:45 +00:00', 'Addons'),
        ('a1000001-1111-4aaa-b001-000000000001', 527838957325778954,
         'Classic Barber Shop Options',
         'Add minimal customization options like small hairstyle changes without changing character identity.',
         '2025-10-28 22:40:01 +00:00', 'UI'),

        ('a1000002-1111-4aaa-b002-000000000002', 1005133725123760160,
         'Improve Dungeon Finder Tools',
         'Enhance the LFG chat interface without automating group formation.',
         '2025-10-28 22:40:02 +00:00', 'Dungeons'),

        ('a1000003-1111-4aaa-b003-000000000003', 1000000000000000002,
         'Class Trainer QoL Updates',
         'Allow trainers to indicate which abilities will be useful for upcoming level ranges.',
         '2025-10-28 22:40:03 +00:00', 'UI'),

        ('a1000004-1111-4aaa-b004-000000000004', 1000000000000000005,
         'Improved Mailbox UI',
         'Add better sorting for mail and a safer system for sending materials.',
         '2025-10-28 22:40:04 +00:00', 'UI'),

        ('a1000005-1111-4aaa-b005-000000000005', 1000000000000000006,
         'Bag Space Relief',
         'Introduce small-scale bag compression without adding new bags or changing gameplay.',
         '2025-10-28 22:40:05 +00:00', 'UI'),

        ('a1000006-1111-4aaa-b006-000000000006', 1000000000000000009,
         'Profession Specialization Review',
         'Revise underused profession specializations to increase choice.',
         '2025-10-28 22:40:06 +00:00', 'Professions'),

        ('a1000007-1111-4aaa-b007-000000000007', 1000000000000000011,
         'AoE Looting Discussion',
         'Consider limited AoE looting for non-instance content to reduce tedium.',
         '2025-10-28 22:40:07 +00:00', 'UI'),

        ('a1000008-1111-4aaa-b008-000000000008', 1000000000000000015,
         'Improve Honor Calculation Transparency',
         'Clarify weekly honor standings with improved UI visibility.',
         '2025-10-28 22:40:08 +00:00', 'PvP'),

        ('a1000009-1111-4aaa-b009-000000000009', 1000000000000000016,
         'Classic Dungeon Pathing Fixes',
         'Improve mob pathing in certain dungeons to feel more consistent.',
         '2025-10-28 22:40:09 +00:00', 'Dungeons'),

        ('a1000010-1111-4aaa-b010-000000000010', 1000000000000000018,
         'Raid Lockout Flexibility',
         'Allow raid lockouts to persist per-boss if the group changes membership.',
         '2025-10-28 22:40:10 +00:00', 'Raids'),

        ('a1000011-1111-4aaa-b011-000000000011', 1000000000000000020,
         'Addon API Documentation Expansion',
         'Add clearer guidelines for Classic addon developers.',
         '2025-10-28 22:40:11 +00:00', 'Addons'),

-- 12
        ('a1000012-1111-4aaa-b012-000000000012', 527838957325778954,
         'Improve Quest Item Drop Consistency',
         'Reduce extreme variance in certain quest item drop rates.',
         '2025-10-28 22:40:12 +00:00', 'Quests'),

        ('a1000013-1111-4aaa-b013-000000000013', 1005133725123760160,
         'UI Scaling Options',
         'Add more granular UI scale settings for accessibility.',
         '2025-10-28 22:40:13 +00:00', 'UI'),

        ('a1000014-1111-4aaa-b014-000000000014', 1000000000000000002,
         'Wider Chat History Buffer',
         'Increase the number of lines the chat window stores by default.',
         '2025-10-28 22:40:14 +00:00', 'UI'),

        ('a1000015-1111-4aaa-b015-000000000015', 1000000000000000005,
         'Minor Travel Improvements',
         'Allow flight path linking where it already exists in lore.',
         '2025-10-28 22:40:15 +00:00', 'World'),

        ('a1000016-1111-4aaa-b016-000000000016', 1000000000000000006,
         'Class Balance Transparency',
         'Reveal internal design philosophy for minor class tuning only.',
         '2025-10-28 22:40:16 +00:00', 'Talents'),

        ('a1000017-1111-4aaa-b017-000000000017', 1000000000000000009,
         'Improve Gathering Node Visibility',
         'Make herb and ore nodes slightly more visible without altering difficulty.',
         '2025-10-28 22:40:17 +00:00', 'Professions'),

        ('a1000018-1111-4aaa-b018-000000000018', 1000000000000000011,
         'Reduce Deadzone Friction',
         'Adjust ranged/melee deadzone slightly for smoother PvP play.',
         '2025-10-28 22:40:18 +00:00', 'PvP'),

        ('a1000019-1111-4aaa-b019-000000000019', 1000000000000000015,
         'Quest Sharing Improvements',
         'Allow mid-quest sharing where it does not disrupt progression.',
         '2025-10-28 22:40:19 +00:00', 'Quests'),

        ('a1000020-1111-4aaa-b020-000000000020', 1000000000000000016,
         'Dungeon Reset Timer Display',
         'Show remaining reset timer in the instance panel.',
         '2025-10-28 22:40:20 +00:00', 'Dungeons'),

        ('a1000021-1111-4aaa-b021-000000000021', 1000000000000000018,
         'Raid Trash Drop Improvements',
         'Add a few more utility drops to raid trash without affecting loot progression.',
         '2025-10-28 22:40:21 +00:00', 'Raids'),

        ('a1000022-1111-4aaa-b022-000000000022', 1000000000000000020,
         'Addon Memory Indicator',
         'Provide a built-in way to see memory usage per addon.',
         '2025-10-28 22:40:22 +00:00', 'Addons'),
        -- 23
        ('a1000023-1111-4aaa-b023-000000000023', 527838957325778954,
         'Classic Graphics Toggle Options',
         'Allow fine-tuning of classic vs updated visual effects while keeping core models intact.',
         '2025-10-28 22:40:23 +00:00', 'UI'),

        -- 24
        ('a1000024-1111-4aaa-b024-000000000024', 1005133725123760160,
         'More Class-Specific Questlines',
         'Add a few optional flavor quests for each class without giving power rewards.',
         '2025-10-28 22:40:24 +00:00', 'Quests'),

        -- 25
        ('a1000025-1111-4aaa-b025-000000000025', 1000000000000000002,
         'Improved Combat Log Filters',
         'Add preset filters for healing, damage, and crowd control events in the combat log.',
         '2025-10-28 22:40:25 +00:00', 'UI'),

        -- 26
        ('a1000026-1111-4aaa-b026-000000000026', 1000000000000000005,
         'Classic Weather Enhancements',
         'Increase the frequency and variety of weather effects in some zones.',
         '2025-10-28 22:40:26 +00:00', 'World'),

        -- 27
        ('a1000027-1111-4aaa-b027-000000000027', 1000000000000000006,
         'Talent Reset Gold Cap',
         'Cap the maximum respec cost to keep experimentation affordable.',
         '2025-10-28 22:40:27 +00:00', 'Talents'),

        -- 28
        ('a1000028-1111-4aaa-b028-000000000028', 1000000000000000009,
         'Crafting Queue QoL',
         'Allow players to queue multiple stacks of the same crafted item.',
         '2025-10-28 22:40:28 +00:00', 'Professions'),

        -- 29
        ('a1000029-1111-4aaa-b029-000000000029', 1000000000000000011,
         'Battleground Scoreboard Improvements',
         'Show additional stats like dispels and crowd control breaks on the BG scoreboard.',
         '2025-10-28 22:40:29 +00:00', 'PvP'),

        -- 30
        ('a1000030-1111-4aaa-b030-000000000030', 1000000000000000015,
         'Dungeon Quest Indicators',
         'Highlight which party members still need dungeon quests for a given instance.',
         '2025-10-28 22:40:30 +00:00', 'Dungeons'),

        -- 31
        ('a1000031-1111-4aaa-b031-000000000031', 1000000000000000016,
         'Raid Ready Check Enhancements',
         'Add optional ready-check responses like “need reagents” or “need summons”.',
         '2025-10-28 22:40:31 +00:00', 'Raids'),

        -- 32
        ('a1000032-1111-4aaa-b032-000000000032', 1000000000000000018,
         'Addon Profile Sharing',
         'Support importing and exporting UI profiles through a built-in interface.',
         '2025-10-28 22:40:32 +00:00', 'Addons'),

        -- 33
        ('a1000033-1111-4aaa-b033-000000000033', 1000000000000000020,
         'Friendly Nameplate Options',
         'Add more customization to friendly nameplates for raids and dungeons.',
         '2025-10-28 22:40:33 +00:00', 'UI'),

        -- 34
        ('a1000034-1111-4aaa-b034-000000000034', 527838957325778954,
         'Zone Music Toggle Per Area',
         'Allow players to keep classic music but adjust its volume per zone.',
         '2025-10-28 22:40:34 +00:00', 'World'),

        -- 35
        ('a1000035-1111-4aaa-b035-000000000035', 1005133725123760160,
         'Optional RP-PvE Events',
         'Add occasional lore-friendly events in capitals that do not impact power progression.',
         '2025-10-28 22:40:35 +00:00', 'World'),

        -- 36
        ('a1000036-1111-4aaa-b036-000000000036', 1000000000000000002,
         'Quest Text Font Options',
         'Provide more readable font choices for quest dialog windows.',
         '2025-10-28 22:40:36 +00:00', 'UI'),

        -- 37
        ('a1000037-1111-4aaa-b037-000000000037', 1000000000000000005,
         'Improved Graveyard Placement',
         'Adjust a few outlier graveyards that cause very long corpse runs.',
         '2025-10-28 22:40:37 +00:00', 'World'),

        -- 38
        ('a1000038-1111-4aaa-b038-000000000038', 1000000000000000006,
         'Talent Preview Mode',
         'Allow players to experiment with talent builds before committing gold.',
         '2025-10-28 22:40:38 +00:00', 'Talents'),

        -- 39
        ('a1000039-1111-4aaa-b039-000000000039', 1000000000000000009,
         'Profession Leveling Hints',
         'Add suggestions in the UI for good level ranges to craft certain recipes.',
         '2025-10-28 22:40:39 +00:00', 'Professions'),

        -- 40
        ('a1000040-1111-4aaa-b040-000000000040', 1000000000000000011,
         'Battleground Queue Time Estimates',
         'Show estimated wait time for each battleground queue.',
         '2025-10-28 22:40:40 +00:00', 'PvP'),

        -- 41
        ('a1000041-1111-4aaa-b041-000000000041', 1000000000000000015,
         'Dungeon Lockout Information',
         'Display remaining lockouts for each dungeon in the instance panel.',
         '2025-10-28 22:40:41 +00:00', 'Dungeons'),

        -- 42
        ('a1000042-1111-4aaa-b042-000000000042', 1000000000000000016,
         'Raid Ready Consumable Checklist',
         'Offer an optional checklist UI for common raid consumables.',
         '2025-10-28 22:40:42 +00:00', 'Raids'),

        -- 43
        ('a1000043-1111-4aaa-b043-000000000043', 1000000000000000018,
         'Addon Safe Mode',
         'Provide a one-click way to reload with only Blizzard-approved API features.',
         '2025-10-28 22:40:43 +00:00', 'Addons'),

        -- 44
        ('a1000044-1111-4aaa-b044-000000000044', 1000000000000000020,
         'Quest Item Highlighting',
         'Highlight quest-related items in bags more clearly.',
         '2025-10-28 22:40:44 +00:00', 'Quests'),

        -- 45
        ('a1000045-1111-4aaa-b045-000000000045', 527838957325778954,
         'More Mailbox Locations',
         'Add a few extra mailboxes in large capital cities for convenience.',
         '2025-10-28 22:40:45 +00:00', 'World'),

        -- 46
        ('a1000046-1111-4aaa-b046-000000000046', 1005133725123760160,
         'Improved Social Panel',
         'Add notes, sorting, and grouping options to the friends list.',
         '2025-10-28 22:40:46 +00:00', 'World'),

        -- 47
        ('a1000047-1111-4aaa-b047-000000000047', 1000000000000000002,
         'Classic Tooltip Detail Options',
         'Allow toggling more detailed stat breakdowns in tooltips.',
         '2025-10-28 22:40:47 +00:00', 'UI'),

        -- 48
        ('a1000048-1111-4aaa-b048-000000000048', 1000000000000000005,
         'Flight Path Preview Routes',
         'Show the path your gryphon or wyvern will follow on the world map.',
         '2025-10-28 22:40:48 +00:00', 'World'),

        -- 49
        ('a1000049-1111-4aaa-b049-000000000049', 1000000000000000006,
         'Minor Hybrid Talent Tweaks',
         'Improve a few underperforming hybrid off-spec talent interactions.',
         '2025-10-28 22:40:49 +00:00', 'Talents'),

        -- 50
        ('a1000050-1111-4aaa-b050-000000000050', 1000000000000000009,
         'Gathering Tool Durability Removal',
         'Remove unnecessary durability loss from gathering tools if applicable.',
         '2025-10-28 22:40:50 +00:00', 'Professions'),

        -- 51
        ('a1000051-1111-4aaa-b051-000000000051', 1000000000000000011,
         'PvP Rank Progress UI',
         'Add a clearer bar for weekly rank progress within the honor tab.',
         '2025-10-28 22:40:51 +00:00', 'PvP'),

        -- 52
        ('a1000052-1111-4aaa-b052-000000000052', 1000000000000000015,
         'Dungeon Boss Ability Tips',
         'Add optional in-game tips for major boss abilities without full encounter guides.',
         '2025-10-28 22:40:52 +00:00', 'Dungeons'),

        -- 53
        ('a1000053-1111-4aaa-b053-000000000053', 1000000000000000016,
         'Raid Calendar Integration',
         'Improve calendar tools for scheduling raids within the game client.',
         '2025-10-28 22:40:53 +00:00', 'Raids'),

        -- 54
        ('a1000054-1111-4aaa-b054-000000000054', 1000000000000000018,
         'Addon Conflict Warnings',
         'Warn players when addons use deprecated or conflicting APIs.',
         '2025-10-28 22:40:54 +00:00', 'Addons'),

        -- 55
        ('a1000055-1111-4aaa-b055-000000000055', 1000000000000000020,
         'Quest Chain Map Indicators',
         'Indicate which quests are part of a larger chain on the map UI.',
         '2025-10-28 22:40:55 +00:00', 'Quests'),

        -- 56
        ('a1000056-1111-4aaa-b056-000000000056', 527838957325778954,
         'More Rested XP Feedback',
         'Show more granular rested XP information in the character pane.',
         '2025-10-28 22:40:56 +00:00', 'UI'),

        -- 57
        ('a1000057-1111-4aaa-b057-000000000057', 1005133725123760160,
         'Guild Roster Sorting Options',
         'Allow sorting guild members by class, rank, or last online time.',
         '2025-10-28 22:40:57 +00:00', 'World'),

        -- 58
        ('a1000058-1111-4aaa-b058-000000000058', 1000000000000000002,
         'Improved Accessibility Options',
         'Add colorblind modes and more keybinding presets.',
         '2025-10-28 22:40:58 +00:00', 'UI'),

        -- 59
        ('a1000059-1111-4aaa-b059-000000000059', 1000000000000000005,
         'Minor Mount Speed Indicator',
         'Display the speed percentage of active mounts in their tooltip.',
         '2025-10-28 22:40:59 +00:00', 'World'),

        -- 60
        ('a1000060-1111-4aaa-b060-000000000060', 1000000000000000006,
         'Dual Talent Spec Icon Indicator',
         'Show a clear icon when using an alternate talent build if dual spec is enabled.',
         '2025-10-28 22:41:00 +00:00', 'Talents'),

        -- 61
        ('a1000061-1111-4aaa-b061-000000000061', 1000000000000000009,
         'Profession Cooldown Tracker',
         'Add a built-in tracker for profession cooldowns like alchemy or tailoring specials.',
         '2025-10-28 22:41:01 +00:00', 'Professions'),

        -- 62
        ('a1000062-1111-4aaa-b062-000000000062', 1000000000000000011,
         'Battleground Map Ping Improvements',
         'Increase visibility and duration of pings on the battleground map.',
         '2025-10-28 22:41:02 +00:00', 'PvP'),

        -- 63
        ('a1000063-1111-4aaa-b063-000000000063', 1000000000000000015,
         'Dungeon Role Icons in Party Frames',
         'Allow optional role icon display for tank, healer, and DPS in party frames.',
         '2025-10-28 22:41:03 +00:00', 'Dungeons'),

        -- 64
        ('a1000064-1111-4aaa-b064-000000000064', 1000000000000000016,
         'Raid Mechanic Emote Channel',
         'Add a dedicated raid warning channel toggle for key boss mechanics.',
         '2025-10-28 22:41:04 +00:00', 'Raids'),

        -- 65
        ('a1000065-1111-4aaa-b065-000000000065', 1000000000000000018,
         'Addon Profile Per Character',
         'Support saving addon layouts per character rather than globally.',
         '2025-10-28 22:41:05 +00:00', 'Addons'),

        -- 66
        ('a1000066-1111-4aaa-b066-000000000066', 1000000000000000020,
         'Quest Difficulty Color Review',
         'Revisit a few quest difficulty colors to more accurately reflect challenge.',
         '2025-10-28 22:41:06 +00:00', 'Quests'),

        -- 67
        ('a1000067-1111-4aaa-b067-000000000067', 527838957325778954,
         'Zone-Level Range Signs',
         'Add subtle signposts indicating level ranges at some zone entrances.',
         '2025-10-28 22:41:07 +00:00', 'World'),

        -- 68
        ('a1000068-1111-4aaa-b068-000000000068', 1005133725123760160,
         'Improved Battle Shout Visibility',
         'Make major party-wide buffs more visually noticeable on unit frames.',
         '2025-10-28 22:41:08 +00:00', 'UI'),

        -- 69
        ('a1000069-1111-4aaa-b069-000000000069', 1000000000000000002,
         'Emote Wheel or Favorites',
         'Allow players to favorite emotes for quicker access.',
         '2025-10-28 22:41:09 +00:00', 'World'),

        -- 70
        ('a1000070-1111-4aaa-b070-000000000070', 1000000000000000005,
         'Campfire Cooking Bonus Flavor',
         'Add minor visual or sound effects when cooking at a campfire.',
         '2025-10-28 22:41:10 +00:00', 'World'),

        -- 71
        ('a1000071-1111-4aaa-b071-000000000071', 1000000000000000006,
         'Talent Loadout Names',
         'Allow naming saved talent configurations for easier swapping.',
         '2025-10-28 22:41:11 +00:00', 'Talents'),

        -- 72
        ('a1000072-1111-4aaa-b072-000000000072', 1000000000000000009,
         'Gathering Node Sound Cue',
         'Play a subtle sound when a nearby resource node appears on the minimap.',
         '2025-10-28 22:41:12 +00:00', 'Professions'),

        -- 73
        ('a1000073-1111-4aaa-b073-000000000073', 1000000000000000011,
         'Battleground Objective Timer UI',
         'Display clearer timers for flags, nodes, and graveyards where appropriate.',
         '2025-10-28 22:41:13 +00:00', 'PvP'),

        -- 74
        ('a1000074-1111-4aaa-b074-000000000074', 1000000000000000015,
         'Dungeon Quest NPC Markers',
         'Mark dungeon quest givers more clearly on the world map.',
         '2025-10-28 22:41:14 +00:00', 'Dungeons'),

        -- 75
        ('a1000075-1111-4aaa-b075-000000000075', 1000000000000000016,
         'Raid Boss Respawn Timers',
         'Indicate approximate respawn timers for cleared trash where applicable.',
         '2025-10-28 22:41:15 +00:00', 'Raids'),

        -- 76
        ('a1000076-1111-4aaa-b076-000000000076', 1000000000000000018,
         'Addon Whitelist Suggestions',
         'Highlight popular, performance-friendly addons in the interface menu.',
         '2025-10-28 22:41:16 +00:00', 'Addons'),

        -- 77
        ('a1000077-1111-4aaa-b077-000000000077', 1000000000000000020,
         'Quest Group Finder Hint',
         'Add a small hint in tough elite quests suggesting grouping up.',
         '2025-10-28 22:41:17 +00:00', 'Quests'),

        -- 78
        ('a1000078-1111-4aaa-b078-000000000078', 527838957325778954,
         'World Map Fog Adjustments',
         'Slightly reduce visual fog in a few older zones while keeping atmosphere.',
         '2025-10-28 22:41:18 +00:00', 'World'),

        -- 79
        ('a1000079-1111-4aaa-b079-000000000079', 1005133725123760160,
         'UI Theme Presets',
         'Add a few Blizzard-made presets for action bar and frame layouts.',
         '2025-10-28 22:41:19 +00:00', 'UI'),

        -- 80
        ('a1000080-1111-4aaa-b080-000000000080', 1000000000000000002,
         'Social Panel Note Length Increase',
         'Allow slightly longer notes for friends and guild members.',
         '2025-10-28 22:41:20 +00:00', 'World'),

        -- 81
        ('a1000081-1111-4aaa-b081-000000000081', 1000000000000000005,
         'World Event Calendar Previews',
         'Show previews of upcoming seasonal events in the calendar UI.',
         '2025-10-28 22:41:21 +00:00', 'World'),

        -- 82
        ('a1000082-1111-4aaa-b082-000000000082', 1000000000000000006,
         'Talents Loadout Share Codes',
         'Allow players to share talent builds via short in-game codes.',
         '2025-10-28 22:41:22 +00:00', 'Talents'),

        -- 83
        ('a1000083-1111-4aaa-b083-000000000083', 1000000000000000009,
         'Profession Trainer Map Pins',
         'Show profession trainers more clearly on the world map.',
         '2025-10-28 22:41:23 +00:00', 'Professions'),

        -- 84
        ('a1000084-1111-4aaa-b084-000000000084', 1000000000000000011,
         'PvP Spectator Mode Discussion',
         'Explore an optional spectator mode for tournaments without affecting live realms.',
         '2025-10-28 22:41:24 +00:00', 'PvP'),

        -- 85
        ('a1000085-1111-4aaa-b085-000000000085', 1000000000000000015,
         'Dungeon Difficulty Labels',
         'Add informal difficulty tags to dungeons to guide new players.',
         '2025-10-28 22:41:25 +00:00', 'Dungeons'),

        -- 86
        ('a1000086-1111-4aaa-b086-000000000086', 1000000000000000016,
         'Raid Composition Summary Panel',
         'Show class distribution and basic roles at a glance in the raid window.',
         '2025-10-28 22:41:26 +00:00', 'Raids'),

        -- 87
        ('a1000087-1111-4aaa-b087-000000000087', 1000000000000000018,
         'Addon Keybind Import/Export',
         'Support exporting and importing keybind setups per character.',
         '2025-10-28 22:41:27 +00:00', 'Addons'),

        -- 88
        ('a1000088-1111-4aaa-b088-000000000088', 1000000000000000020,
         'Quest Log Category Filters',
         'Filter quests in the log by zone, difficulty, or type.',
         '2025-10-28 22:41:28 +00:00', 'Quests'),

        -- 89
        ('a1000089-1111-4aaa-b089-000000000089', 527838957325778954,
         'Improved Underwater Visibility',
         'Slightly improve underwater visibility in older zones.',
         '2025-10-28 22:41:29 +00:00', 'World'),

        -- 90
        ('a1000090-1111-4aaa-b090-000000000090', 1005133725123760160,
         'UI Tutorials for New Players',
         'Offer optional UI tutorial prompts explaining basic panels and frames.',
         '2025-10-28 22:41:30 +00:00', 'UI'),

        -- 91
        ('a1000091-1111-4aaa-b091-000000000091', 1000000000000000002,
         'Cross-Character Friend Notes',
         'Allow shared notes across characters for the same friend.',
         '2025-10-28 22:41:31 +00:00', 'World'),

        -- 92
        ('a1000092-1111-4aaa-b092-000000000092', 1000000000000000005,
         'Seasonal Event Toy Hints',
         'Provide hints for finding fun but non-power seasonal event rewards.',
         '2025-10-28 22:41:32 +00:00', 'World'),

        -- 93
        ('a1000093-1111-4aaa-b093-000000000093', 1000000000000000006,
         'Hybrid Talent Role Icons',
         'Display whether a hybrid build is better suited for healing, tanking, or DPS.',
         '2025-10-28 22:41:33 +00:00', 'Talents'),

        -- 94
        ('a1000094-1111-4aaa-b094-000000000094', 1000000000000000009,
         'Crafting Profit Estimator Discussion',
         'Discuss adding optional UI estimates for crafting profits using vendor values only.',
         '2025-10-28 22:41:34 +00:00', 'Professions'),

        -- 95
        ('a1000095-1111-4aaa-b095-000000000095', 1000000000000000011,
         'Battleground Voice Macro Expansion',
         'Add a few more preset callouts like “defend base” or “inc middle”.',
         '2025-10-28 22:41:35 +00:00', 'PvP'),

        -- 96
        ('a1000096-1111-4aaa-b096-000000000096', 1000000000000000015,
         'Dungeon Mini-Map Improvements',
         'Improve mini-map clarity in multi-level instance maps where possible.',
         '2025-10-28 22:41:36 +00:00', 'Dungeons'),

        -- 97
        ('a1000097-1111-4aaa-b097-000000000097', 1000000000000000016,
         'Raid Loot History Panel',
         'Add a simple history of which bosses dropped which items recently.',
         '2025-10-28 22:41:37 +00:00', 'Raids'),

        -- 98
        ('a1000098-1111-4aaa-b098-000000000098', 1000000000000000018,
         'Addon Safe Presets for New Players',
         'Provide a default set of recommended settings for first-time addon users.',
         '2025-10-28 22:41:38 +00:00', 'Addons'),

        -- 99
        ('a1000099-1111-4aaa-b099-000000000099', 1000000000000000020,
         'Quest Abandon Confirmation',
         'Add an extra confirmation when abandoning long chain quests.',
         '2025-10-28 22:41:39 +00:00', 'Quests'),

        -- 100
        ('a1000100-1111-4aaa-b100-000000000100', 527838957325778954,
         'World Exploration Achievement Discussion',
         'Discuss adding purely cosmetic achievements for fully exploring classic zones.',
         '2025-10-28 22:41:40 +00:00', 'World');
