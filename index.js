/**
 * Created by katherine on 2017/3/30.
 */
window.onload =function () {

    //获取页面上的元素

    var PuzzleContainer = document.getElementById("imgContainer");
    var buttonContainer = document.querySelector(".buttonContainer");
    var textContainer = document.querySelector(".textContainer");
    var startbutton = document.querySelector(".click1");
    var changeimgbutton = document.querySelector(".click2");
    //图片库
    var imgContainer = ["./img/image1.png","./img/image2.png","./img/image3.gif","./img/image4.jpg",
                        "./img/image6.jpg","./img/image7.gif","./img/image8.gif"];


    var Inuseimg = false;   //正在使用的图片
    var InuseUrl = "";      //正在使用的图片的URL
    var imgArr = [];        //

    //拼图的行数和列数
    var cols =3;
    var rows = 4;

    var  timer=null;


    //元素的行数列数索引[0-0，0-1，0-2.。。。]
    var Oldset= [];

    var setOk = false;
    var Oldindex = [];

    var ARR = [];
    // var ranorder = [];
    var scrambleCheck = false;
    //实例化的对象
    var BRR = [];


    //一个排序的函数
    function compareFunction(a, b){
        if (a < b) {
            return -1;
        }else if (a > b) {
            return 1;
        }else{
            return 0;
        }
    }

    //创建一个图片对象，将图片组存进图片对象，方便后续获取URL；
    for(var i=0;i<imgContainer.length;i++){
        var Nimg = new Image();
        Nimg.src = imgContainer[i];
        imgArr.push(Nimg);
    }

    //随机获取一张图片：
    function getRandomImg() {
        var imgindex = Math.ceil(imgContainer.length*Math.random())-1;
        Inuseimg = imgArr[imgindex];
        InuseUrl = Inuseimg.src;
        return Inuseimg;
    }

    //获取一张图片的宽度和高度，图片初始化需要点时间，所以需要判断一下
    function getImagewidth() {
        if(Inuseimg.width>0){
            initPuzzle();
        }else{
            setTimeout(getImagewidth,200);
        }
    }

    function setArea() {
        var leftline = PuzzleContainer.offsetLeft;
        var topline = PuzzleContainer.offsetTop;
        var rightline = leftline+Inuseimg.width;
        var bottomline = topline+Inuseimg.height;
        var Area = {left:leftline,top:topline,right:rightline,bottom:bottomline};
        return Area;
    }
    //   初始化一张图片，九宫格图片生成：
    function initPuzzle() {
        PuzzleContainer.innerHTML = "";
        var Odiv = [];
        var num = 0;
        //原始的索引值[1，2，3，。。。。]
        var Oldorder =[];

        //分别确定行宽和行高
        colwidth =parseInt( Inuseimg.width/cols) ;
        colheight = parseInt(Inuseimg.height/rows);

        //生成div模块
        if(PuzzleContainer){
            PuzzleContainer.style.width = Inuseimg.width + "px";
            PuzzleContainer.style.height = Inuseimg.height +  "px";
        }
        if(!setOk){
            for(var i =0;i<rows;i++){
                for(var j=0;j<cols;j++){
                    Odiv[num] = document.createElement("div");
                    Odiv[num].dataset.index = num+1;
                    Odiv[num].setAttribute("id",i+"-"+j);
                    Odiv[num].setAttribute("class","PartContainer draggable");
                    Odiv[num].style.width = colwidth +"px";
                    Odiv[num].style.height = colheight +"px";
                    Odiv[num].style.left =  j*colwidth +"px"
                    Odiv[num].style.top=i*colheight+"px";
                    var Img = new Image();
                    Img.src = InuseUrl;
                    Img.style.left = -(j*colwidth) +"px";
                    Img.style.top = -(i*colheight)+"px";
                    Odiv[num].appendChild(Img);
                    PuzzleContainer.appendChild(Odiv[num]);
                    Oldorder.push(num+1);
                    Oldset.push([i,j]);
                    Oldindex.push(Odiv[num].id);
                    num++;
                }
            }
            setOk = false;
        }
        }
    //打乱图片顺序，开始游戏
    function scramble(){
        var index1 = 0 ;
        var totalNum = cols*rows;
        var CurrentDiv=null;
        var temp = [];
        var rannum =Math.floor(Math.random()*totalNum+1);
        for(var i =0;i<totalNum;i++){
            if(temp.length>0){
                rannum =Math.ceil(Math.random()*totalNum);
                while((temp.indexOf(rannum)>-1)||(rannum>totalNum)){
                    rannum =Math.ceil(Math.random()*totalNum);
                }
                temp.push(rannum);
            }
            else {
                temp.push(rannum);
            }
        }
        for(var i =0;i<rows;i++){
            for(var j=0;j<cols;j++){
                CurrentDiv = document.getElementById(i+"-"+j);
                CurrentDiv.classList.add("movestyle");
                var index = temp[index1];
                CurrentDiv.style.top = (Oldset[index-1][0]*colheight)+"px";
                CurrentDiv.style.left = (Oldset[index-1][1]*colwidth)+"px";
                CurrentDiv.dataset.index = index;
                index1++;
            }
        }
        scrambleCheck = true;
    }
    //获取图片的区域：

    //拖拽对象构造函数
    function drag(ele) {
        this.ele = ele;
        this.move(ele);
    }
    drag.prototype = {
        //存放被拖拽对象的原始位置
        origin:{},
        //移动方法，鼠标事件
        move: function (ele) {
                var target = ele;
                var isClick = false;
                var difX;
                var difY;
                var self = this;
                var zerolist =[]; //碰撞元素的数组
                var result; //碰撞元素的距离数组
                var moveEvent = function (event) {
                    if(isClick){
                        target.classList.remove("movestyle");
                        target.style.left = (event.pageX - difX) + "px";
                        target.style.top = (event.pageY - difY) + "px";
                        var Area = setArea();
                        if(event.pageX<Area.left||event.pageX>Area.right||event.pageY<Area.top||event.pageY>=Area.bottom-5){
                            onmouseUp(event);
                        }
                    }
                }
                target.addEventListener("mousedown", function (e) {
                    target.style.zIndex = 999;
                    isClick = true;
                    var index = self.ele.dataset.index;
                    self.origin = {
                        left:Oldset[index-1][1]*colwidth,
                        top: Oldset[index-1][0]*colheight
                    };
                    e.preventDefault();
                    e.stopPropagation();
                    onmousemove(isClick, target);
                    difX = event.pageX - self.ele.offsetLeft;
                    difY = event.pageY - self.ele.offsetTop;
                });
                function onmousemove(isClick, target) {
                    document.body.addEventListener('mousemove', moveEvent)
                };
                function onmouseUp(e) {
                        isClick = false;
                        target.style.zIndex = 12;
                        result = [];
                        zerolist = [];
                        target.removeEventListener('mousemove', moveEvent);
                        e.preventDefault();
                        e.stopPropagation();
                        var newlist = document.querySelectorAll(".draggable");
                        var passive;
                        for(var i = 0;i < 12;i++){
                            passive= newlist[i];
                            if(passive.dataset.index!=target.dataset.index){
                                var ifbump =self.collision(target,passive);
                                if(ifbump){
                                    zerolist.push(passive);
                                }
                            }
                        }
                        result = self.getdistance(target,zerolist);  //计算碰撞的元素的距离组合
                        // 如果没有碰撞，则返回原来的地方，没有移动
                        if(zerolist.length==0){
                            self.backorigin(target);
                        }else{
                            var minindex = self.minmeter(result); //找到最小值的索引
                            var passivetarget = zerolist[minindex];
                            self.exchange(target, passivetarget);
                            self.isfinished();
                        }
                    }

                target.addEventListener("mouseup", onmouseUp)
        },
        //回到原先的地方，没有移动
        backorigin:function (target) {
            target.style.left = this.origin.left +"px";
            target.style.top = this.origin.top +"px";
        },
        //获取最小距离的索引
        minmeter:function (result) {
            var oldresult = result;
            var newresult = JSON.parse(JSON.stringify(result)).sort(compareFunction);
            var index = oldresult.indexOf(newresult[0]);
            return index;
        },
        //获取碰撞元素与拖拽元素的距离
        getdistance :function (target,passivelist) {
            var result = [];
            for(var i=0;i<passivelist.length;i++){
                var a = (target.offsetLeft + target.offsetWidth/2) - (passivelist[i].offsetLeft + passivelist[i].offsetWidth/2);
                var b = (target.offsetTop +target.offsetHeight/2) - (passivelist[i].offsetTop + passivelist[i].offsetHeight/2);
                if(Math.ceil(Math.sqrt(a*a+b*b))>4){
                    result.push(Math.sqrt(a*a+b*b));
                    console.log(result);
                }
            }
            return result;
        },
        //碰撞判断
        collision:function (target,passive) {
            var ct = target.offsetTop,
                cl = target.offsetLeft,
                cb = ct + target.offsetHeight,
                cr = cl + target.offsetWidth;
            var pt = passive.offsetTop,
                pl = passive.offsetLeft,
                pb = pt + passive.offsetHeight,
                pr = pl + passive.offsetWidth;
            if (ct < pb && cl < pr && cb > pt && cr > pl) {
                return true;
            }
            return false;
        },
        //交换位置
        exchange:function(target,passive) {
                    target.classList.add("movestyle");
                    passive.classList.add("movestyle");
                    var targetindex = target.dataset.index;
                    var guestindex = passive.dataset.index;

        //            移动元素的位置：
                    var Oleft = target.offsetLeft;
                    var Otop = target.offsetTop;

        //            被替换元素的位置：
                    var Bleft = passive.offsetLeft;
                    var Btop = passive.offsetTop;

                    target.style.left = Bleft +"px";
                    target.style.top = Btop +"px";

                    passive.style.left = this.origin.left +"px";
                    passive.style.top = this.origin.top +"px";
                    target.dataset.index = guestindex;
                    passive.dataset.index = targetindex;
        },
        //游戏是否结束判断
        isfinished :function () {
            var list = document.querySelectorAll(".draggable");
            var ranorder = [];
            for(var i=0;i<12;i++){
                ranorder.push(+list[i].dataset.index);
        }
            for(var i = 0 ; i < ranorder.length-1 ; i++){
                if(ranorder[i] > ranorder[i+1]){
                    return false
                }
            }
            setTimeout(function () {
                alert('恭喜你成功了')
            },1000)

        }
    }

    function init() {
        getRandomImg();    //初始化的时候随机生成一张图片
        getImagewidth();    //九宫格图片生成
        if(BRR.length!=0){
            BRR=[];
            startbutton.addEventListener("click",startgame);
        }
    }

    //    绑定点击的事件 以及初始化函数
    init();
    startbutton.addEventListener("click",scramble);   //打乱图片按钮
    startbutton.addEventListener("click",startgame);
    changeimgbutton.addEventListener("click",init);   //换图片按钮
    function startgame() {
        ARR = document.querySelectorAll(".draggable");
        for(var i =0;i<12;i++){
           BRR = new drag(ARR[i]);
        }
        startbutton.removeEventListener("click",startgame);
    }
}


