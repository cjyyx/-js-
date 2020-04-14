constent={//常量
    MAP_WIDTH:1024,
    MAP_HEIGHT:960,
    GAMEBOX_WIDTH:512,
    GAMEBOX_HEIGHT:480
}

function hero(x,y,img)
{
	this.x=x;
	this.y=y;
    this.img=img;
    this.w=this.img.width;
    this.h=this.img.height;
	this.speed=5;
	this.direction=1;

	this.blood=10;
	this.shield=5;
	this.attack=false;
	this.death=false;
	this.weapons=new Array();
	this.wearedWeapon=0;

	this.achievement=0;
	
	this.left=(constent.GAMEBOX_WIDTH-this.img.width)/2;
    this.top=(constent.GAMEBOX_HEIGHT-this.img.height)/2;

	this.wound=function(wound)
	{
		this.shield-=wound;
		
		if(this.shield<0)
		{
			this.blood+=this.shield;
			this.shield=0;
		}
		
		if(this.blood<0)
		{
			this.death=true;
		}
	}

	this.recover=function(times)
	{
		if(this.shield<5&&times%75==0)//回盾上限5，每3秒回一个盾
		{
			this.shield++;
		}
	}

	this.draw= function(cxt)
	{
		cxt.font="30px Arial";
		cxt.fillStyle = "#ff0000";
		cxt.fillText("生命: "+Math.round(this.blood),10,40);
		cxt.fillStyle = "#999999";
		cxt.fillText("护盾: "+Math.round(this.shield),10,75);
		cxt.fillStyle = "#ffff00";
		cxt.fillText("干掉了"+Math.round(this.achievement)+"只怪兽",150,50);

		//判断是否出界
        if(this.x<0){this.x += this.speed;}
		if(this.x>(constent.MAP_WIDTH-this.w)){this.x -= this.speed;}
		if(this.y<0){this.y += this.speed;}
		if(this.y>(constent.MAP_HEIGHT-this.h)){this.y -= this.speed;}
		
		cxt.drawImage(this.img,this.left,this.top);//英雄保持画在中心
		//画武器
		cxt.drawImage(this.weapons[this.wearedWeapon].img,this.left+this.weapons[this.wearedWeapon].x,this.top+this.weapons[this.wearedWeapon].y);
		
    }
    
    this.act=function(keyDown)
    {
        if(38 in keyDown)
		{
			this.y -= this.speed*this.direction;
		}
		if (40 in keyDown) 
		{ 
			this.y += this.speed*this.direction;
		}
		if (37 in keyDown) 
		{ 
			this.x -= this.speed*this.direction;
		}
		if (39 in keyDown) 
		{ 
			this.x += this.speed*this.direction;
		}
		if (65 in keyDown) 
		{ 
			this.attack=true;
		}else{
			this.attack=false;
		}
		if (83 in keyDown) 
		{ 
			if(times%12==0)//切换武器
			{
				if(this.wearedWeapon<this.weapons.length-1)
				{
					this.wearedWeapon++;
				}else {
					this.wearedWeapon=0;
				}
			}
		}
    }
	
}

function map(img)
{
	this.img=img;

	this.draw= function(cxt,hero)
	{
        
        cxt.drawImage(this.img,hero.left-hero.x,hero.top-hero.y);//地图绘制以英雄为基准
		
    }
}

function monster(x,y,img,blood)
{
	this.x=x;
	this.y=y;
    this.img=img;
    this.w=this.img.width;
    this.h=this.img.height;
	this.speed=1;
	this.direction=1;
	this.maxBlood=blood;
	this.numberOfFairball=8;
	
	this.blood=blood;
	this.death=false;

	this.wound=function(wound)
	{
		this.blood-=wound;
		if(this.blood<=0)
		{
			this.death=true;
		}
	}
	
	this.draw= function(cxt,hero)
	{
        //判断是否出界
        if(this.x<0){this.x += this.speed;}
		if(this.x>(constent.MAP_WIDTH-this.w)){this.x -= this.speed;}
		if(this.y<0){this.y += this.speed;}
		if(this.y>(constent.MAP_HEIGHT-this.h)){this.y -= this.speed;}
        
        if(Math.random()<0.3&&Math.sqrt(Math.pow((hero.x-this.x),2)+Math.pow((hero.y-this.y),2))<250)
        {
            if(this.x<hero.x){this.x+=this.speed*this.direction;}else{this.x-=this.speed*this.direction;}
            if(this.y<hero.y){this.y+=this.speed*this.direction;}else{this.y-=this.speed*this.direction;}
        }

        cxt.drawImage(this.img,this.x-hero.x+hero.left,this.y-hero.y+hero.top);//怪物绘制以英雄为基准
		
		cxt.fillStyle = "#ff0000";//画血条
		cxt.fillRect(this.x-hero.x+hero.left,this.y-hero.y+hero.top-4,this.w*(this.blood/this.maxBlood),2);
    }
    
	
}

function ifpeng(r1,r2)//检测是否碰撞
{
	if(
		((r1.x<r2.x&&(r1.x+r1.w)>r2.x)
		||(r1.x<(r2.x+r2.w)&&(r1.x+r1.w)>(r2.x+r2.w)))
		&&
		((r1.y<r2.y&&(r1.y+r1.h)>r2.y)
		||(r1.y<(r2.y+r2.h)&&(r1.y+r1.h)>(r2.y+r2.h)))
	){
		return true;
	}
	return false;
}

function pengimage(x,y,img)
{
	this.x=x;
	this.y=y;
	this.img=img;

	this.draw=function(cxt,hero)
	{
		cxt.drawImage(this.img,this.x-hero.x+hero.left,this.y-hero.y+hero.top);
	}
}

