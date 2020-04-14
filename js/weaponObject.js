function obstacle(x,y,img)
{
	this.x=x;
	this.y=y;
	this.img=img;
    this.w=this.img.width;
    this.h=this.img.height;

	this.draw= function(cxt,hero)
	{
		cxt.drawImage(this.img,this.x-hero.x+hero.left,this.y-hero.y+hero.top);
	}

}

function fireBall(x,y)
{
	this.x=x;
	this.y=y;
	this.w=10;
	this.h=10;
	
	this.degree=Math.random()*Math.PI*2;
	this.speed=5;
	this.injury=2;
	
	this.draw= function(cxt,hero)
	{
		this.x += this.speed*Math.cos(this.degree);
		this.y += this.speed*Math.sin(this.degree);

		cxt.fillStyle = "#ff0000";
		cxt.beginPath();
		cxt.arc(this.x-hero.x+hero.left,this.y-hero.y+hero.top,5,0,Math.PI*2,false);
		cxt.fill();
		
	}

}

function knife(img)
{
    this.x=-25;//以英雄d左上角为坐标原点
	this.y=15;
    this.img=img;
    this.delay=12;
    this.injury=10;

    this.attack=function(hero,enemys)
    {
        for(var i=0;i<enemys.length;i++)
        {
            if(Math.sqrt(Math.pow((hero.x-enemys[i].x),2)+Math.pow((hero.y-enemys[i].y),2))<50)//对与英雄距离小于50的怪物进行攻击
            {
                enemys[i].wound(this.injury);
            }
        }
        
    }
}

function gun(img)
{
    this.x=0;//以英雄d左上角为坐标原点
	this.y=15;
    this.img=img;
    this.delay=3;
    this.injury=1;


    this.attack=function(hero,enemys)
    {
        var numberOfEnemyOfMindistence =0
        for(var i=0;i<enemys.length;i++)//冒泡算法求最近的怪物
        {
            if(Math.sqrt(Math.pow((hero.x-enemys[i].x),2)+Math.pow((hero.y-enemys[i].y),2))
            <Math.sqrt(Math.pow((hero.x-enemys[numberOfEnemyOfMindistence].x),2)+Math.pow((hero.y-enemys[numberOfEnemyOfMindistence].y),2)))
            {
                numberOfEnemyOfMindistence=i;
            }
        }
        
        if(Math.sqrt(Math.pow((hero.x-enemys[numberOfEnemyOfMindistence].x),2)+Math.pow((hero.y-enemys[numberOfEnemyOfMindistence].y),2))<250)//对与英雄距离小于250的怪物进行攻击
        {
            if(enemys[numberOfEnemyOfMindistence].x>=hero.x)//使子弹射向怪物
            {
                window.bullets.push(new bullet(hero.x+this.x+this.img.width,hero.y+this.y+this.img.height,this.injury,Math.atan((hero.y-enemys[numberOfEnemyOfMindistence].y)/(hero.x-enemys[numberOfEnemyOfMindistence].x))))
            }else{
                window.bullets.push(new bullet(hero.x+this.x+this.img.width,hero.y+this.y+this.img.height,this.injury,Math.atan((hero.y-enemys[numberOfEnemyOfMindistence].y)/(hero.x-enemys[numberOfEnemyOfMindistence].x))+Math.PI))
            }
        }
    }
}

function bullet(x,y,injury,degree)
{
	this.x=x;
	this.y=y;
	this.w=10;
	this.h=10;
	
	this.degree=degree;
	this.speed=5;
	this.injury=injury;
	
	this.draw= function(cxt,hero)
	{
		this.x += this.speed*Math.cos(this.degree);
		this.y += this.speed*Math.sin(this.degree);

		cxt.fillStyle = "#ffff00";
		cxt.beginPath();
		cxt.arc(this.x-hero.x+hero.left,this.y-hero.y+hero.top,5,0,Math.PI*2,false);
		cxt.fill();
		
	}

}