{//加载

    var ready=0;//记载加载有没有完成

    window.onload = function (){ready++;}
    
    var bg = new Image;
    bg.src = "img/bg.jpg";
    bg.onload = function() {ready++;}

    var mapimg = new Image;
    mapimg.src = "img/map.png";
    mapimg.onload = function() {ready++;}
    
    var heroimg = new Image;
    heroimg.src = "img/hero.png";
    heroimg.onload = function() {ready++;}

    var monsterimg = new Image;
    monsterimg.src = "img/monster.png";
    monsterimg.onload = function() {ready++;}

    var pengimg = new Image;
    pengimg.src = "img/peng.png";
    pengimg.onload = function() {ready++;}

    var obstacleimg = new Image;
    obstacleimg.src = "img/obstacle.jpg";
    obstacleimg.onload = function() {ready++;}

    var gunimg = new Image;
    gunimg.src = "img/gun.png";
    gunimg.onload = function() {ready++;}

    var knifeimg = new Image;
    knifeimg.src = "img/knife.png";
    knifeimg.onload = function() {ready++;}
    
    var readyEvent=setInterval(function()//检测是否加载完毕
        {
        if(ready >=8)
        {
            start();//开始游戏
        }
    },100,false)
    
}

{//采用键盘事件的监听,保持稍后存储用户输入
//这个部分我们旨在用addEventListener()方法、采用“keydown”、“keyup”来对键盘设置事件的监听，以此来获取用户键盘的输入。addEventListener()方法接受三个参数，即： 
//1）event，必选，注意: 不要使用 “on” 前缀。 例如，使用 “click” ,而不是使用 “onclick”。 
//2）必选。指定要事件触发时执行的函数， 当事件对象会作为第一个参数传入函数。 事件对象的类型取决于特定的事件。 
//3） 可选。布尔值，指定事件是否在捕获或冒泡阶段执行。
// ————————————————— 
//版权声明：本文为CSDN博主「rememberyf」的原创文章，遵循CC 4.0 by-sa版权协议，转载请附上原文出处链接及本声明。
//原文链接：https://blog.csdn.net/rememberyf/article/details/80556678	
var keyDown = {};

addEventListener("keydown", function(e) {
	keyDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
	delete keyDown[e.keyCode];
}, false);

}


function start()
{
	clearInterval(readyEvent);//结束检测
	alert("1、建议使用电脑玩本游戏。2、攻击-A，换武器-S。3、刀：伤害10，攻速2，攻击范围：50；枪：伤害1，攻速8，攻击范围：250。确认开始游戏？")
	window.cxt = document.getElementById("gamebox").getContext("2d");//初始化画笔
	
    window.map=new map(mapimg)//初始化地图对象
    window.hero=new hero(Math.random()*constent.MAP_WIDTH, Math.random()*constent.MAP_HEIGHT,heroimg);//英雄位置随机生成
    window.monsters=new Array();
    for(var i=0;i<50;i++)
    {
        monsters.push(new monster(Math.random()*constent.MAP_WIDTH, Math.random()*constent.MAP_HEIGHT,monsterimg,5));
    }
    window.fireBalls=new Array();//初始化子弹类数组
    window.bullets=new Array();
    
    window.pengimgs=new Array();

    window.times=0;//记录refresh次数

    window.obstacles=new Array();
    for(var i=0;i<5;i++)
    {
        obstacles.push(new obstacle(Math.floor(Math.random()*32)*32,Math.floor(Math.random()*32)*30,obstacleimg));
    }

    hero.weapons.push(new knife(knifeimg));//创建武器对象并加入英雄
    hero.weapons.push(new gun(gunimg));

    window.refreshEvent =setInterval(refresh,40,false);//开始更新

}

function refresh()
{
    times++;//记录refresh次数
    cxt.drawImage(bg,0,0);//重绘canvas

    hero.act(keyDown);//把检测键盘事件的数组传入英雄对象

    map.draw(cxt,hero);//绘制地图，传入画笔，英雄用于定位
    
    for(var i=0;i<obstacles.length;i++)
    {
        obstacles[i].draw(cxt,hero);//画障碍物
        
        for(var ii=0;ii<fireBalls.length;ii++)
        {
            if(ifpeng(fireBalls[ii],obstacles[i]))//检测火球是否装上障碍物
            {
                fireBalls.splice(ii,1);//撞上了删除火球对象
                ii--;
            }
        }
        for(var ii=0;ii<bullets.length;ii++)//同上
        {
            if(ifpeng(bullets[ii],obstacles[i]))
            {
                bullets.splice(ii,1);
                ii--;
            }
        }
    }
    
    for (var ii = 0; ii < monsters.length; ii++)//同上
    {
        for (var i = 0; i < obstacles.length; i++) 
        {
            if (ifpeng(monsters[ii], obstacles[i])) //撞上了怪物反向
            {
                monsters[ii].direction = -1;
                break;//break必须加，否则只有怪物与所有障碍物撞上才会反向
            } else {
                monsters[ii].direction = 1;
            }

        }
    }
    
    for(var i=0;i<obstacles.length;i++)//同上
    {
        if(ifpeng(hero,obstacles[i]))
        {
            hero.direction= -1;
            break;
        }else{
            hero.direction=1;
        }
    }
    
    if(hero.attack)
    {
        if(times%hero.weapons[hero.wearedWeapon].delay==0)//实现攻击速率
        {
            hero.weapons[hero.wearedWeapon].attack(hero,monsters);//传入存放怪物对象的数组进行攻击
        }
    }
    
    for(var i=0;i<monsters.length;i++)
    {
        
        if(monsters[i].death)//怪物死了留下痕迹
        {
            hero.achievement++;
            pengimgs.push(new pengimage(monsters[i].x,monsters[i].y,pengimg));
            monsters[i]=new monster(Math.random()*constent.MAP_WIDTH, Math.random()*constent.MAP_HEIGHT,monsterimg,5+times%25)
        }else{
            monsters[i].draw(cxt,hero);
        }

        if(Math.random()<0.001)//0.1%概率发射火球
        {
            for(var ii=0;ii < monsters[i].numberOfFairball;ii++)
            {
                fireBalls.push(new fireBall(monsters[i].x,monsters[i].y));
            }
        }

    }
    
    for(var i=0;i<fireBalls.length;i++)
    {
        if(ifpeng(fireBalls[i],hero))//检测英雄与火球是否碰撞
        {
            hero.wound(fireBalls[i].injury);
        }
        
        if(fireBalls[i].x<0||fireBalls[i].y<0||fireBalls[i].x>(constent.MAP_WIDTH-fireBalls[i].w)||fireBalls[i].y>(constent.MAP_HEIGHT-fireBalls[i].h))//检测火球是否出界
        {
            fireBalls.splice(i,1);
            i--;
        }else{
            fireBalls[i].draw(cxt,hero);
        }
        
    }
    
    for(var i=0;i<bullets.length;i++)//子弹，同火球
    {
        for(var ii=0;ii<monsters.length;ii++)
        {
            if(ifpeng(bullets[i],monsters[ii]))
            {
                monsters[ii].wound(bullets[i].injury);
            }
        }
        
        if(bullets[i].x<0||bullets[i].y<0||bullets[i].x>(constent.MAP_WIDTH-bullets[i].w)||bullets[i].y>(constent.MAP_HEIGHT-bullets[i].h))
        {
            bullets.splice(i,1);
            i--;
        }else{
            bullets[i].draw(cxt,hero);
        }
        
    }
    
    for(var i=0;i<pengimgs.length;i++)
    {
        pengimgs[i].draw(cxt,hero);
    }

    hero.recover(times);
    hero.draw(cxt);

    if(hero.death)
    {
        clearInterval(refreshEvent);
		alert("你死了，你一共干掉了"+hero.achievement+"只怪物");
    }
}