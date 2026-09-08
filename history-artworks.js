const historicPictures={
  'half-life-2':{url:'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/220/ss_47b4105b396de408cb8b6b4f358c69e5e2a62dae.1920x1080.jpg?t=1745368545',source:'https://store.steampowered.com/app/220/',caption:'半衰期 2 · Steam 公开场景'},
  'dark-souls':{url:'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570940/ss_3a71463e4ccaf28c5c27f6cf8d32a3a125f45404.1920x1080.jpg?t=1778518110',source:'https://store.steampowered.com/app/570940/',caption:'黑暗之魂 · 2018 Remastered 版本，展文评述 2011 原作'},
  rdr:{url:'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2668510/ss_ba2c07c5db3da423ea658a49dd7a1aef30cdd43f.1920x1080.jpg?t=1781132266',source:'https://store.steampowered.com/app/2668510/',caption:'荒野大镖客：救赎 · PC 移植画面，展文评述 2010 原作'},
  pacman:{url:'https://indiegamerchick.com/wp-content/uploads/2024/06/main-maze.png?w=584',source:'https://indiegamerchick.com/2024/07/03/pac-man-museum-the-games-they-couldnt-or-wouldnt-include/',caption:'吃豆人 · 经典迷宫资料画面'},
  civilization:{url:'https://i.gzn.jp/img/2018/04/15/sid-meiers-civilization-making/00.jpg',source:'https://gigazine.net/news/20180415-sid-meiers-civilization-making/',caption:'文明 · 1991 年原作资料画面'},
  tetris:{url:'https://3.bp.blogspot.com/-xGtRBSzLGHQ/Vj1B8bXIyBI/AAAAAAAAGtg/Ge3AjkKcyPs/s1600/FirstVersions_Tetris_1984_game-ru.png',source:'https://www.firstversions.com/2015/11/tetris.html',caption:'俄罗斯方块 · 早期终端版本资料画面'}
};
games.forEach(g=>{if(historicPictures[g.id])g.pictures=[historicPictures[g.id]]});
