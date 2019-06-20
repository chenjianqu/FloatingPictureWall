var tick;
var wallfallPosArr=new Array();

var mode=0;
var currentPoint=0;
var picObjArr=new Array();
var posArray=new Array();

var numPic=122;
var delta=20;
var aeraHeight=1000;

var count=0;

$( window ).load(function(){
    var angle = 0;
    var isShowFullPic=false;
    var $closeBtn=$(".close");
    var centerPicPos={left:0,top:0,w:0,h:0};
    var centerPicObj;
    var centerPicObjPos;

    picObjArr=$("#main").children("div.box");//获取所有图片对象

    AddPic();//添加图片到网页
    picObjArr=$("#main").children("div.box");//获取所有图片对象
    waterfall();//图片以瀑布流的形式排布

    centerPicObj=picObjArr.eq(0);//当前置于中心的图片
    currentPoint=0;//中心图片索引

    //初始化图片位置数组
    for(var i=0;i<numPic;i++)
        posArray[i]={left:0,top:0,width:100,height:100,randomLeft:Math.round(Math.random()*delta-delta/2),randomTop:Math.round(Math.random()*delta-delta/2)};

    //点击切换按键
    mode=1;
    $("#menu").click(function () {
        if(mode==1)
        {
            mode=2;
            centerMode();
            console.log("centerMode");
        }
        else if(mode==2)
        {
            ShowWXY();
            mode=3;
        }
        else if(mode==3){
            waterfall();
            console.log("winterfallMode");
            mode=1;
        }
    });

    //点击关闭按钮
    $closeBtn.click(function () {
        isShowFullPic=false;
        if(mode==1) {
            centerPicObj.css({
                "left": wallfallPosArr[currentPoint].left,
                "top": wallfallPosArr[currentPoint].top,
                "z-index":1,
            });
            centerPicObj.children().children().css({
                "width": 100,
                "height": "auto",
            });
        }
        else if(mode==2) {
            centerPicObj.css({
                "left": posArray[currentPoint].left,
                "top": posArray[currentPoint].top,
                "z-index":1,
            });
            centerPicObj.children().children().css({
                "width": 100,
                "height": "auto",
            });
        }
        else if(mode==3) {
            if(currentPoint==-1)
                currentPoint=1;
            centerPicObj.css({
                "left": posArray[currentPoint].left,
                "top": posArray[currentPoint].top,
                "z-index":1,
            });
            centerPicObj.children().children().css({
                "width": 100,
                "height": "auto",
            });
        }
        centerPicPos.w=0
        centerPicPos.h=0;
        centerPicPos.left=0;
        centerPicPos.top=0;
        $closeBtn.hide();
    });

    //设置图片的点击事件
    picObjArr.each(function (index,value) {
        $(this).click(function () {
            StopAllPicAnimate();//清除动画队列

            isShowFullPic=true;
            $closeBtn.show();

            //重置中心图片的大小和位置
            if(mode==1) {
                centerPicObj.css({
                    "left": wallfallPosArr[currentPoint].left,
                    "top": wallfallPosArr[currentPoint].top,
                    "z-index":1,
                });
                centerPicObj.children().children().css({
                    "width": 100,
                    "height": "auto",
                });
            }
            else if(mode==2)
            {
                clearInterval(tick);
                centerPicObj.css({
                    "left": posArray[currentPoint].left,
                    "top": posArray[currentPoint].top,
                    "z-index":1,
                });
                centerPicObj.children().children().css({
                    "width": 100,
                    "height": "auto",
                });

            }
            else if(mode==3)
            {
                if(currentPoint==-1)
                    currentPoint=1;
                clearInterval(tick);
                centerPicObj.css({
                    "left": posArray[currentPoint].left,
                    "top": posArray[currentPoint].top,
                    "z-index":1,
                });
                centerPicObj.children().children().css({
                    "width": 100,
                    "height": "auto",
                });
                count++;
                if(count==4)say();
            }
            ResetSomePic();

            currentPoint=index;
            centerPicObj=$(this);
            centerPicObjPos={"left":$(this).left}

            centerPicPos.w=800;
            centerPicPos.h=$(this).height()/$(this).width()*800;
            centerPicPos.left=$(window).width()/2-centerPicPos.w/2;
            centerPicPos.top=300;


            $(this).css({
                "left":centerPicPos.left,
                "top":centerPicPos.top,
                "z-index":10.
            });
            $(this).children().css({
                "width":"auto",
            });
            $(this).children().children().css({
                "width":centerPicPos.w,
                "height":centerPicPos.h,
            });

            if(mode==2||mode==3)
            {
                tick=setInterval(PicFloat, 100);
            }
        });
    });



    function centerMode()
    {
        //初始化属性
        $(".box").css({
            "position":"absolute",
            "float":null,
        });
        $(".pic").children().css({
            "width":100,
            "height":"auto",
        });
        //设置中心图片的位置
        var len=picObjArr.length;
        picObjArr.each(function (index,value) {//获得所有图片的位置
            posArray[index].width=$(this).children().outerWidth();
            posArray[index].height=$(this).children().outerHeight();
            if(index<len/2) {
                posArray[index].left = index * 10;
                posArray[index].top = index * 10;
            }
            else{
                posArray[index].left = $(window).width()-(index-len/2) * 25;
                posArray[index].top = (index-len/2) * 18;
            }
            //设置默认的中心图片
            if(index==currentPoint) {
                centerPicObj=$(this);
                centerPicPos.w=400;
                centerPicPos.h=$(this).height()/$(this).width()*400;
                centerPicPos.left=$(window).width()/2-centerPicPos.w/2;
                centerPicPos.top=300;
                $(this).css({
                    "left":centerPicPos.left,
                    "top":centerPicPos.top,
                });
                $(this).children().width("auto");
                $(this).children().children().css({
                    "width":centerPicPos.w,
                    "height":centerPicPos.h,
                });
            }
        });
        //设置图片游动定时器
        tick=setInterval(PicFloat, 500);
    }




    function PicFloat() {
        var cl=centerPicPos.left,ct=centerPicPos.top,cw=centerPicPos.w,ch=centerPicPos.h;
        var cr=cl+cw,cb=ct+ch;

        //限制图片的游走区域
        for(var i=0;i<numPic;i++)
        {
            var pl=posArray[i].left,pt=posArray[i].top,pw=posArray[i].width,ph=posArray[i].height;
            var pr=pl+pw,pb=pt+ph;
            //图片不能超过四个边界
            if(pl<0)
                posArray[i].randomLeft=Math.abs(posArray[i].randomLeft);
            else if(pr>$(window).width())
                posArray[i].randomLeft=-Math.abs(posArray[i].randomLeft);
            if(pt<0)
                posArray[i].randomTop=Math.abs(posArray[i].randomTop);
            else if(pb>aeraHeight )
                posArray[i].randomTop=-Math.abs(posArray[i].randomTop);

            //图片不能盖住中心图片
            if(pb>ct && pt<cb &&pr>cl &&pl<cl)
                posArray[i].randomLeft = -posArray[i].randomLeft;
            if(pb>ct && pt<cb &&(pl<cr &&pr>cr))
                posArray[i].randomLeft = -posArray[i].randomLeft;
            if(pb>ct && pt<ct &&(pl<cr &&pr>cl))
                posArray[i].randomTop = -posArray[i].randomTop;
            if(pb>cb && pt<cb &&(pl<cr &&pr>cl))
                posArray[i].randomTop = -posArray[i].randomTop;

            if(pb<cb && pt>ct &&pl>cl &&pr<cr) {
                posArray[i].randomTop = -posArray[i].randomTop;
                posArray[i].randomLeft = -posArray[i].randomLeft;
            }

            posArray[i].top+=posArray[i].randomTop;
            posArray[i].left+=posArray[i].randomLeft;
        }

        //图片浮动
        picObjArr.each(function (index,value) {
            if(currentPoint!=index) {
                var p = posArray[index];

                $(this).animate({
                    left: p.left,
                    top: p.top,
                });
            }
        });
    }

    function say() {

    }

    function ResetSomePic() {
        var cl=centerPicPos.left,ct=centerPicPos.top,cw=centerPicPos.w,ch=centerPicPos.h;
        var cr=cl+cw,cb=ct+ch;

        for(var i=0;i<posArray.length;i++) {
            var pl = posArray[i].left, pt = posArray[i].top, pw = posArray[i].width, ph = posArray[i].height;
            var pr = pl + pw, pb = pt + ph;

            if(pb>aeraHeight)
                posArray[i].top=posArray[i].randomTop
            //图片不能盖住中心图片
            if (pb > ct && pt < cb && pr > cl && pl < cl)
                posArray[i].left = posArray[i].randomLeft;
            if (pb > ct && pt < cb && (pl < cr && pr > cr))
                posArray[i].left = $(window).width() - posArray[i].randomLeft - pw;

            if (pb > ct && pt < ct && (pl < cr && pr > cl))
                posArray[i].top = posArray[i].randomTop;
            if (pb > cb && pt < cb && (pl < cr && pr > cl))
                posArray[i].top = aeraHeight;

            if (pb < cb && pt > ct && pl > cl && pr < cr) {
                if (i % 4 == 0) {
                    posArray[i].left = 0;
                    posArray[i].top = 0;
                } else if (i % 4 == 1) {
                    posArray[i].left = $(window).width() - pw;
                    posArray[i].top = 0;
                } else if (i % 4 == 2) {
                    posArray[i].left = $(window).width() - pw;
                    posArray[i].top = aeraHeight - ph;
                } else if (i % 4 == 3) {
                    posArray[i].left = 0;
                    posArray[i].top = aeraHeight - ph;
                    ;
                }
            }
        }
    }

});



function heartShape(r, dx, dy, c) {//r:大小;dx:水平偏移;dy:垂直偏移;c:颜色
    var m, n, x, y, i;
    for (i = 0; i <= 200; i += 0.04) {
        m = i;
        n=-r*(((Math.sin(i)*Math.sqrt(Math.abs(Math.cos(i))))/(Math.sin(i)+1.4))-2*Math.sin(i)+2);
        x = n * Math.cos(m) + dx;
        y = n * Math.sin(m) + dy;
        createPoint(x, y, c);
    }
}




function ShowWXY() {
    StopAllPicAnimate();//清除动画队列
    //初始化属性
    $(".box").css({
        "position":"absolute",
        "float":null,
    });
    $(".pic").children().css({
        "width":100,
        "height":"auto",
    });
    currentPoint=-1;

    //设置中心图片的位置
    var len=picObjArr.length;
    picObjArr.each(function (index,value) {//获得所有图片的位置
        posArray[index].width = $(this).children().outerWidth();
        posArray[index].height = $(this).children().outerHeight();
        if (index < len / 2) {
            posArray[index].left = index * 10;
            posArray[index].top = index * 10;
        } else {
            posArray[index].left = $(window).width() - (index - len / 2) * 25;
            posArray[index].top = (index - len / 2) * 18;
        }
    });

    var dx=10,dy=10;
    var r=200;
    var last_t=-1;
    var m, n, x, y, i,t;
    for (i = 0; i <= 200; i += 0.04) {
        m = i;
        n=-r*(((Math.sin(i)*Math.sqrt(Math.abs(Math.cos(i))))/(Math.sin(i)+1.4))-2*Math.sin(i)+2);
        x = n * Math.cos(m) + $(window).width()/2;
        y = n * Math.sin(m) + 200;

       t=Math.floor(i%posArray.length);
       if(t!=last_t) {
           //console.log(t);
           posArray[t].left = x;
           posArray[t].top = y;
       }
        last_t=t;
    }

}


//停止所有动画
function StopAllPicAnimate() {
    picObjArr.each(function () {
        $(this).stop(true);
    });
}

//添加图片
function AddPic() {
    var addStr="";
    for(var i=1;i<=120;i++)
    {
        addStr+='    <div class=\"box\" >\n' +
            '        <div class=\"pic\">\n' +
            '            <img src=\"./pic1/pic ('+i+').jpg\"/>\n' +
            '        </div>\n' +
            '    </div>\n'
    }
    $("#pidAddTag").after(addStr);
}

//以瀑布流的方式排布图片
function waterfall() {
    clearInterval(tick);
    StopAllPicAnimate();
    currentPoint=1;
    var w=100;
    var hArr=[];

    $(".box").css({
        "position":"absolute",
//        "float":"left",
    });
    $(".pic").css({
       "width":"auto",
       "height":"auto",
    });
    $(".pic").children().css({
        "width":w,
        "height":"auto",
    });

    var $boxs=$("#main").children();

    var cols=Math.floor($(window).width()/(w+20));//得到列数
    $('#main').width((w+20)*cols).css('margin','0 auto');//设置main div的宽度 同时让它居中

    picObjArr.each(function (index,value) {//遍历boxs,两个参数:元素索引和值
        var h = $boxs.eq(index).outerHeight();//包括padding的高度
        if (index < cols) {
            $(value).css({
                "position":"absolute",
                "top":50,
                "left":index*(w+20)
            });
            hArr[index] = h+50;
            wallfallPosArr[index] = {left: index*(w+20), top: 50};
        }
    });

    picObjArr.each(function (index,value) {
        if(index>=cols) {
            var h = $boxs.eq(index).outerHeight();
            var minH = Math.min.apply(null, hArr);//找到hArr中的最小值
            var minH_Index = $.inArray(minH, hArr);//找到minH在数组中的索引
            $(value).css({
                "position": "absolute",
                "top": minH,
                "left": minH_Index * (w + 20)
            });
            wallfallPosArr[index] = {left: minH_Index * (w+20), top: minH};
            hArr[minH_Index] += $boxs.eq(index).outerHeight();//更新高度数组里面的值
        }
    });


}


