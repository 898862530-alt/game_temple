// Award years are distinct from release dates. 2006–2013 belong to VGA/VGX.
games.find(g=>g.id==='tetris').themes.push('几何与秩序');
const annualIds=['oblivion','bioshock','gta-iv','uncharted-2','rdr','skyrim','walking-dead','gta-v','inquisition','witcher-3','overwatch','botw','god-of-war','sekiro','tlou2','it-takes-two','elden-ring','bg3','astro','expedition-33'];
annualIds.forEach((id,i)=>{const year=2006+i,g=games.find(g=>g.id===id),program=year<2013?'VGA':year===2013?'VGX':'TGA';if(!g)throw Error('Missing annual winner '+id);g.award={year,program};g.sources.push([year+' '+program+' 年度游戏获奖档案',year<2014?'https://en.wikipedia.org/wiki/Spike_Video_Game_Awards':year===2025?'https://thegameawards.com/nominees/game-of-the-year':'https://thegameawards.com/rewind/year-'+year]);});
const historicalReasons={
 'pong':'将实时双人电子游戏带入商业街机场景的重要早期作品。',
 'space-invaders':'以队列、节奏升级和高分竞争形成街机射击的重要范式。',
 'tetris':'以极简空间规则获得跨平台、跨文化的长期传播。',
 'mario':'将横向卷轴、惯性跳跃和关卡教学组织为经典平台语言。',
 'doom':'推动第一人称射击、联网对战和玩家模组文化的发展。',
 'pokemon':'让收集、交换与伙伴关系成为可携带的社会体验。',
 'ocarina':'锁定、情境操作与三维空间教学的重要行业坐标。',
 'wow':'将大型多人世界的任务、协作与长期运营带给广泛玩家。',
 'minecraft':'以可组合方块和玩家创作扩展沙盒游戏的表达与教育空间。',
 're4-2005':'过肩视角与遭遇节奏成为后来动作射击的重要参考。',
 'gta-v':'多主角城市叙事与长期线上世界构成大型商业开放世界的重要案例。',
 'pacman':'规则可读性与角色传播共同推动电子游戏进入大众文化；2015 年入选 The Strong 名人堂。',
 'civilization':'将城市、科技、探索与外交组织为大型回合策略的重要范式；2022 年入选 The Strong 名人堂。',
 'half-life-2':'将物理交互、连续第一人称演出和关卡节奏紧密结合。',
 'dark-souls':'互联关卡、死亡回收与风险管理形成持续影响动作角色扮演的设计范式。'
};
games.forEach(g=>{g.historical=historicalReasons[g.id]||'';g.honors=[...(g.personal?['Ocean 精选']:[]),...(g.award?['年度游戏']:[]),...(g.historical?['历史里程碑']:[])];if(!g.honors.length)throw Error('Missing admission reason '+g.id);});
games.find(g=>g.id==='pacman').sources.push(['The Strong · Pac-Man 名人堂档案','https://www.museumofplay.org/games/pac-man/']);
games.find(g=>g.id==='civilization').sources.push(['The Strong · Civilization 名人堂档案','https://www.museumofplay.org/games/sid-meiers-civilization/']);
games.find(g=>g.id==='dark-souls').sources.push(['GamesRadar+ · 2021 金摇杆玩家投票','https://www.gamesradar.com/dark-souls-is-your-ultimate-game-of-all-time-at-the-golden-joystick-awards/']);
