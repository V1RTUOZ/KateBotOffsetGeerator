const fs = require('fs');
const https = require('https');

const pref = {
  m_dwClientState: { 'path': 'signatures/dwClientState' },
  m_dwLocalPlayer: { 'path': 'signatures/dwLocalPlayer' },
  m_dwEntityList: { 'path': 'signatures/dwEntityList' },
  m_dwGlowObject: { 'path': 'signatures/dwGlowObjectManager' },
  m_dwForceJump: { 'path': 'signatures/dwForceJump' },
  m_dwForceAttack: { 'path': 'signatures/dwForceAttack' },
  m_dwIndex: { 'value': '0x64' },
  m_hActiveWeapon: { 'path': 'netvars/m_hActiveWeapon' },
  m_iCrossHairID: { 'path': 'netvars/m_iCrosshairId' },
  m_iHealth: { 'path': 'netvars/m_iHealth' },
  m_iTeamNum: { 'path': 'netvars/m_iTeamNum' },
  m_iShotsFired: { 'path': 'netvars/m_iShotsFired' },
  m_bDormant: { 'value': '0xE9' },
  m_fFlags: { 'path': 'netvars/m_fFlags' },
  m_lifeState: { 'path': 'netvars/m_lifeState' },
  m_bSpottedByMask: { 'path': 'netvars/m_bSpottedByMask' },
  m_vecOrigin: { 'path': 'netvars/m_vecOrigin' },
  m_vecViewOffset: { 'path': 'netvars/m_vecViewOffset' },
  m_angEyeAngles: { 'value': '0xAA08' },
  m_dwViewAngles: { 'path': 'signatures/dwClientState_ViewAngles' },
  m_vecVelocity: { 'path': 'netvars/m_vecVelocity' },
  m_aimPunchAngle: { 'path': 'netvars/m_aimPunchAngle' },
  m_dwBoneMatrix: { 'path': 'netvars/m_dwBoneMatrix' },
  m_flNextPrimaryAttack: { 'path': 'netvars/m_flNextPrimaryAttack' },
  m_nTickBase: { 'path': 'netvars/m_nTickBase' },
  m_dwGlobalVars: { 'path': 'signatures/dwGlobalVars' },
  m_dwPlayerResource: { 'path': 'signatures/dwPlayerResource' },
  m_iPlayerC4: { 'value': '0x161C' },
  m_bIsDefusing: { 'path': 'netvars/m_bIsDefusing' },
  m_dwInGame: { 'path': 'signatures/dwClientState_State' },
  m_iItemDefinitionIndex: { 'path': 'netvars/m_iItemDefinitionIndex' },
  m_iClip1: { 'path': 'netvars/m_iClip1' },
  m_nDeltaTick: { 'value': '0x16C' },
  m_iWorldModelIndex: { 'value': '0x31E4' },
  m_nModelIndex: { 'value': '0x254' },
  m_hViewModel: { 'value': '0x32FC' },
  m_iAccountID: { 'path': 'netvars/m_iAccountID' },
  m_nFallbackPaintKit: { 'path': 'netvars/m_nFallbackPaintKit' },
  m_OriginalOwnerXuidLow: { 'path': 'netvars/m_OriginalOwnerXuidLow' },
  m_iItemIDLow: { 'path': 'netvars/m_iItemIDHigh', 'fn': function (v) { return v + 4; } },
  m_hMyWeapons: { 'path': 'netvars/m_hMyWeapons' }
};

const url = 'https://raw.githubusercontent.com/frk1/hazedumper/master/csgo.min.json';

console.warn('KateBot Config Generator by v1rtuoz\n');
console.log(`Trying to get ${url}...`);
https.get(url, (response) => {

  var responseData = '';
  response.on('data', (d) => {
    responseData += d;
  });

  response.on('end', () => {
    console.log('Parsing data...');
    var json = JSON.parse(responseData);
    var output = '[Offsets]\n';

    for (var k in pref) {
      if (pref[k].hasOwnProperty('value')) {
        output += `${k} = ${pref[k].value}\n`;
      } else {
        var path = pref[k].path.split('/');
        var value = parseInt(json[path[0]][path[1]]);
        if (pref[k].hasOwnProperty('fn')) value = pref[k].fn(value);
        var stringVal = value.toString(16).toUpperCase();
        output += `${k} = 0x${stringVal}\n`;
      }
    }
    
    fs.writeFile('offsets.ini', output, 'utf8', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Done. Copy offsets from \'offsets.ini\' to your KateBot config.');
      }
    });
  });

}).on('error', (err) => {
  console.error(err);
});