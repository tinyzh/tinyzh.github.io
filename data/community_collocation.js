/**
 * 穿搭模块
 * createTime : 2017-04-05
 */

/**
 * 切换分类和翻页
 * @type {{}}
 */
var switchCate = {
    page : 1,//默认第一页
    size : 25,//每页商品个数
    interface : 'xxx.html',//接口
    categoryId : null,//当前分类id
    totalPage : null,
    loadingData : function(cateId,currentPage){//加载数据
        var self = this;
        $.ajax({
            url : DOMAIN + '/fun/community_ajax.php?act=outfitGoodsList',
            cache : false,
            type : 'GET',
            data : {
                cat_id : self.categoryId,
                page : self.page,
                pageSize : self.size
            },
            success : function(data){
                if(data.status == 1){
                    self.totalPage = parseInt(data.total);
                    self.renderTpl(data);
                    if(data.total > 25){
                        var pageHtml = self.pageHtml(self.page,self.size,self.totalPage);
                        $("#page").html(pageHtml);
                    }else{
                        $("#page").html('');
                    }

                }
            },
            dataType : 'json'
        });
    },
    changeCate : function(cid){ //切换分类
        this.page = 1;
        this.categoryId = cid;
        this.loadingData(cid,1);
    },
    renderTpl : function(data){//生成html结构
        var gettpl = document.getElementById("js-cateSwitch").innerHTML;
        laytpl(gettpl).render(data, function (html) {
            $('#js-goodsWrap').html(html);
        });
    },
    pageHtml : function(page,limit,total){//生成分页
        var cPage = parseInt(page),
            cLimit = parseInt(limit),
            cTotal = parseInt(total),
            pageNum = Math.ceil(cTotal/cLimit),
            htmlStr = "",
            aStr = "",
            optionHtml = "",
            num = 0;

        if(cPage>8){
            var i = cPage-8;
            for(i;i<cPage;i++){
                num = Number(i)+1;
                if(num == cPage){
                    aStr += "<a class='page_on js_pageChange' href='javascript:void(0);'  page="+ num +">"+ num +"</a>";
                }else{
                    aStr += "<a href='javascript:void(0);' class='js_pageChange' page="+ num +">"+ num +"</a>";
                }
            }
        }else{
            for(var i = 0;i<(pageNum > 8 ? 8 : pageNum);i++){
                num = Number(i)+1;
                if(num == cPage){
                    aStr += "<a class='page_on js_pageChange' href='javascript:void(0);' page="+ num +">"+ num +"</a>";
                }else{
                    aStr += "<a href='javascript:void(0);' class='js_pageChange' page="+ num +">"+ num +"</a>";
                }
            }
        }
        if(cPage<pageNum && cPage == 1){
            htmlStr += "<a href='javascript:void(0);' class='page_dip js_pageChange'><</a>";
            htmlStr += aStr;
            htmlStr += "<a href='javascript:void(0);' class='js_pageChange' page="+ (cPage+1) +">></a>";
        }else if(cPage>1 && cPage<pageNum){
            htmlStr += "<a href='javascript:void(0);' class='js_pageChange' page="+ (cPage-1) +"><</a>";
            htmlStr += aStr;
            htmlStr += "<a href='javascript:void(0);' class='js_pageChange' page="+ (cPage+1) +">></a>";
        }else if(cPage == pageNum){
            htmlStr += "<a href='javascript:void(0);' class='js_pageChange' page="+ (cPage-1) +"><</a>";
            htmlStr += aStr;
            htmlStr += "<a href='javascript:void(0);' class='page_dip js_pageChange'>></a>";
        }
        htmlStr += "<span class='gotoselect'>To Page &nbsp;&nbsp;";
        htmlStr += "<select id='pageQuery' class='lie_sls'>";
        for(var j=0;j<pageNum;j++){
            var opVal = Number(j)+1;
            if(opVal == cPage){
                optionHtml += "<option value="+ opVal +" selected>"+ opVal +"</option>";
            }else{
                optionHtml += "<option value="+ opVal +">"+ opVal +"</option>";
            }
        }
        htmlStr += optionHtml;
        htmlStr += "</select></span>";

        return htmlStr;
    },
    bindEvent : function(){
        var self = this;
        //切换分页
        $("body").on("click",".js_pageChange",function(){
            var $this = $(this);
            if(!$this.hasClass("page_dip")){
                self.page = $this.attr("page");
                self.loadingData(self.categoryId,self.page);
            }
        });
        //切换分类
        $('#js-cateFlex').on('click','.js-cateChange',function(){
            var $this = $(this);
            if(!$this.parent().hasClass('active')){
                var cid = $this.data('cid');
                self.changeCate(cid);
            }
            $this.closest('li').addClass('active').siblings('li').removeClass('active');
        });
    },
    init : function(){
        this.bindEvent();
    }
};


/**
 * 穿搭构造函数
 * @param param  自定义参数
 */
function Collocation(param){
    this.container = param.container || $('#js-dragContainer');//移入容器
    this.dragItem = param.dragItem || $('.js-dragItem');//可拖拽元素(商品图)
    this.currentItem = null;//当前被拖动元素
    this.endPosition = {left : '', top : ''};//放开元素时的鼠标坐标
    this.cacheEle = $('#js-cacheHtml').html(); //拉伸，旋转 html结构
    this.defaultWH = {};//默认原图的宽高
    this.maxItem = 6; //容器最多容纳6个商品
    this.itemList = [];//已加入容器元素，控制层级使用
    this.maxNumPop = $('#js-maxNumPop'); //超出最大数量弹窗
    this.layerNum = null;
    this.closeBtn = $('.js-closeBtn');  // 关闭弹窗按钮
    this.removeItemBtn = $('#js-removeItem'); // 移除元素按钮
    this.backwordsItemBtn = $('#js-backwordsItem'); //元素降一层
    this.forwardsItemBtn = $('#js-fordwardsItem'); //元素升一层
    this.borderSwitchBtn = $('.js-changeBorder'); // 边框切换
    this.cacheNum = 0; // 每增加一个元素加1，删除元素不变
    this.lastPosition = {x:0,y:0}; //拖拽四个角 上次一的坐标值  给判断拉伸方向用
    this.cancelBtn = $('#js-calBtn'); //cancel按钮
    this.makeImgBtn = $('#js-MakeImg'); //生成图片，然后出发上传按钮
    this.skuList = [];//当前加入的元素sku
    this.defaultTags = $('#js-defaultTags').val(); // 默认标签

    this.dragBox = $('.drag'); //左边容器中的拖拽元素
    this.cAreaW = this.container.width();
    this.cAreaH = this.container.height();
    this.currentEle = null;// 缓存当前被拖动的元素
    this.cAreaTop = this.getPosition(this.container).Y; //容器距离浏览器上边界距离
    this.cAreaLeft = this.getPosition(this.container).X; //容器距离浏览器左边界距离
    this.pictureScale = null; // 当前被拖动元素的比例 w/h
    this.mousePosition = null;
    this.mouseStartX = null;  // 当前鼠标坐标
    this.mouseStartY = null;
    this.dragLeft = null;
    this.dragTop = null;
    this.roatting = false; // 旋转标识

};

// 计算当前元素数量
Collocation.prototype.countItem = function(){
    var imgSrc = $(this.currentItem).data('orig');
    var gid = $(this.currentItem).data('gid');
    var currentId = 'js-' + this.cacheNum;
    if(this.itemList.length < this.maxItem){
        this.itemList.push(currentId);
        this.skuList.push(gid);
        this.setHtml(imgSrc,currentId,gid);
        this.cacheNum++;
    }else{
        this.noticePop(this.maxNumPop);
    }
};

// 检测当前容器是否有元素
Collocation.prototype.checkItem = function(){
    if(this.itemList.length != 0){
        this.container.removeClass('empty');
        this.makeImgBtn.removeClass('disabled');
    }else{
        this.container.addClass('empty');
        this.makeImgBtn.addClass('disabled');
    }
}

// 生成拖放图片的结构
Collocation.prototype.setHtml = function(imgSrc,currentId,gid){
    var self = this;
    var $img = $('<img>');
    var $dragEle = $('<div>');
    $img.attr('src',imgSrc).attr('data-type','drag');

    $dragEle.addClass('drag').attr({
        "data-type":'drag',
        "data-curid" : currentId,
        "data-gid" : gid
    }).html($img).append(this.cacheEle);
    //设置元素位置
    $dragEle.css({
        'left' : self.endPosition.left - (self.defaultWH.width/2),
        'top' : self.endPosition.top - (self.defaultWH.height/2),
        'width' : self.defaultWH.width,
        'height' : self.defaultWH.height
    }).attr('data-wh',$(this.currentItem).attr('data-wh'));

    this.container.append($dragEle);
    self.calcIndex();
};

// 计算index
Collocation.prototype.calcIndex = function(){
    var self = this;
    self.itemList.forEach(function(item,index){
        self.container.find('.drag').each(function(i,v){
            if($(v).attr('data-curid') == item){
                $(v).css('z-index',index + 1);
            }
        });
    });
    self.checkItem();
};

// 删除容器中元素
Collocation.prototype.removeItem = function(){
    var self = this;
    var activeItem = self.container.find('.active');//当前选中元素
    var curid = activeItem.attr('data-curid');
    var gid = parseInt(activeItem.attr('data-gid'));
    if(activeItem.length){
        $(activeItem).remove();
        this.itemList.remove(curid);
        this.skuList.remove(gid);
        self.calcIndex();
    }else{
        self.textPop('Please select item!');
    }
};


// 向上移动
Collocation.prototype.forwards = function(){
    var self = this;
    var activeItem = self.container.find('.active');//当前选中元素
    var curid = activeItem.attr('data-curid');
    if(activeItem.length){
        var index = self.itemList.indexOf(curid);
        if(index < self.itemList.length-1){
            self.itemList[index] = self.itemList[index + 1];
            self.itemList[index + 1] = curid;
            self.calcIndex();
        }
    }else{
        self.textPop('Please select item!');
    }
};

// 向下移动
Collocation.prototype.backwords = function(){
    var self = this;
    var activeItem = self.container.find('.active');//当前选中元素
    var curid = activeItem.attr('data-curid');
    if(activeItem.length){
        var index = self.itemList.indexOf(curid);
        if(index != 0){
            self.itemList[index] = self.itemList[index - 1];
            self.itemList[index - 1] = curid;
            self.calcIndex();
        }
    }else{
        self.textPop('Please select item!');
    }
};
// 切换边框
Collocation.prototype.switchBorder = function(obj){
    var oriImg = obj.data('ori');
    this.container.css('background','url('+oriImg+')');
    obj.addClass('active').siblings().removeClass('active');
};

// 文字提示
Collocation.prototype.textPop = function(text){
    GLOBAL.PopObj.alert({
        msg : text
    });
};

// 提示弹窗
Collocation.prototype.noticePop = function(dom){
    var self = this;
    self.layerNum = GLOBAL.PopObj.openPop({
        area : ['auto','auto'],
        page :{dom : dom},
        border:[0],
        shadeClose: false,
        closeBtn: true,
        shade : [0.3, '#000']
    });
};

// 关闭弹窗
Collocation.prototype.closePop = function(){
    layer.close(this.layerNum);
};

// 容器中元素开始拖拽
Collocation.prototype.startDrag = function(e){
    e.preventDefault();
    var self = this;
    this.currentEle = $(e.target).closest('.drag').get(0);

    // 记录当前图片比例
    var cacheWH = $(this.currentEle).data('wh').split('/');
    this.pictureScale = (cacheWH[0] / cacheWH[1]).toFixed(2);

    $(this.currentEle).addClass('active').siblings('.drag').removeClass('active');

    this.mouseStartX = e.clientX;
    this.mouseStartY = e.clientY;

    this.dragLeft = parseInt($(this.currentEle).css('left')); // 按下鼠标时，拉伸框距离容器顶部的距离
    this.dragTop = parseInt($(this.currentEle).css('top')); // 按下鼠标时，拉伸框距离容器顶部的距离

    this.mousePosition = $(e.target).attr('data-type');//判断按下的位置，是中间还是边上的拉伸点
    if(!this.mousePosition){
        this.mousePosition = $(e.target).attr('class').split(" ")[1];
    }
    if(this.mousePosition == 'rotate'){
        this.rotate(e);
    }
    $(document).on('mousemove',function(e){
        self.dragging(e);
    }).on('mouseup',self.clearDragEvent.bind(self));
};

// 监听鼠标移动
Collocation.prototype.dragging = function(e){
    e.stopPropagation();
    window.getSelection().removeAllRanges(); //取消处于选中状态的文字
    switch(this.mousePosition){
        case 'drag' : this.dragMove(e); break;
        // case 'cLeftUp' : this.moveCommon(e,'left','up'); break;
        // case 'cLeftDown' : this.moveCommon(e,'left','down'); break;
        case 'rotate' : this.calcAngle(e); break;
        default : this.moveCommon(e,this.mousePosition); break;
    }
};

// 拉伸编辑框
Collocation.prototype.dragMove = function(e){
    var moveX = e.clientX - this.mouseStartX; // 拖拽移动中  当前坐标 - 初始坐标
    var moveY = e.clientY - this.mouseStartY;
    var desX = moveX + this.dragLeft;
    var desY = moveY + this.dragTop;
    $(this.currentEle).css({
        left : desX,
        top : desY
    });
};

// 鼠标松开 释放事件
Collocation.prototype.clearDragEvent = function(e){
    var self = this;
    self.roatting = false;
    self.loopDragDot(e);
    $('body').removeClass('rotate-cursor');
    $(document).off('mousemove',undefined).off('mouseup',undefined);
};

// 拉伸公共方法
Collocation.prototype.moveCommon = function(e,item){
    var draggingY = e.clientY + $(document).scrollTop();
    var draggingX = e.clientX;
    var horizontal = null;
    var vertical = null;
    var degree = this.calcDegree('.'+item);
    var itemTop = $('.'+item,$(this.currentEle)).offset().top;
    var itemLeft = $('.'+item,$(this.currentEle)).offset().left;


    if((degree > 0 && degree < 90) || (degree > 270 && degree < 360)){ // 当前的点击元素位于y轴左边
        horizontal = 'left';
    }else{
        horizontal = 'right';
    }
    if((degree > 180 && degree < 360)){ // 当前的点击元素位于x轴上方
        vertical = 'up';
    }else{
        vertical = 'down';
    }

    var dragY = this.getPosition(this.currentEle).Y;
    var dragX = this.getPosition(this.currentEle).X;

    if(horizontal == 'left'){ // 向左移动
        var changeWidth = dragX - draggingX;
        this.currentEle.style.left = this.currentEle.offsetLeft - changeWidth + 'px';
    }else{
        var changeWidth = draggingX - dragX - $(this.currentEle).outerWidth();


    }

    // 以宽度做基准  根据图片比例算出高度
    var endWidth = changeWidth + parseFloat($(this.currentEle).css('width'));
    var endHeight = Math.ceil(endWidth/this.pictureScale);//取整 防止计算top的时候有误差

    if(vertical == 'up'){ // 向上移动
        this.currentEle.style.top = parseInt(this.currentEle.style.top) - parseInt(endHeight - $(this.currentEle).outerHeight()) + 'px';
    }

    $(this.currentEle).css({
        width : endWidth,
        height : endHeight
    });

};

// 旋转方法
Collocation.prototype.rotate = function(e){
    e.preventDefault();
    e.stopPropagation();
    this.roatting = true;
};

// 计算角度
Collocation.prototype.calcAngle = function(e){
    var target = $(this.currentEle);
    if(this.roatting){
        $('body').addClass('rotate-cursor');
        var s_x = e.clientX,
            s_y = e.clientY + $(document).scrollTop();
        if(s_x !== this.dragLeft && s_y !== this.dragTop){
            // 得到当前鼠标 相对于当前元素中心点的弧度
            var s_rad = Math.atan2(this.getPosition(this.currentEle).Y + target.outerHeight()/2 - s_y, s_x - this.getPosition(this.currentEle).X - target.outerWidth()/2);
            // Math.PI/180  每一个弧度对应的角度
            var degree =  s_rad / (Math.PI / 180) - 90;// 角度值   因为旋转的按钮是在上面，此时的x轴应该减90度，x轴指向上方  所以需要把当前计算的角度-90度
            degree = -degree;// 因为这里计算出来的角度 是逆时针方向的  但是rotate是按正时针旋转，所以这里还需要进行取反
            target.css('-moz-transform', 'rotate(' + degree + 'deg)');
            target.css('-webkit-transform', 'rotate(' + degree + 'deg)');
            target.css('-o-transform', 'rotate(' + degree + 'deg)');
            target.css('-ms-transform', 'rotate(' + degree + 'deg)');
        }
    }
};

// 便利四个顶点
Collocation.prototype.loopDragDot = function(e){
    var self = this;
    $(this.currentEle).find('.dragDot').each(function(index,item){
        //便利四个顶点  计算角度
        self.setCursor(item);
    });
};

// 根据当前元素相对于中心的角度  改变光标
Collocation.prototype.setCursor = function(item){
    var degree = this.calcDegree(item);
    var defaultDegree = 180;
    var classList = $(item).attr('class');
    var res = null;
    if(degree <25+defaultDegree && degree > -25+defaultDegree){
        res = classList.replace(/(\w*)-resize/,'ew-resize');
    }else if(degree > 24 + defaultDegree && degree < 65 + defaultDegree){
        res = classList.replace(/(\w*)-resize/,'ne-resize');
    }else if(degree > 64+ defaultDegree && degree < 115+ defaultDegree){
        res = classList.replace(/(\w*)-resize/,'ns-resize');
    }else if(degree > 114+ defaultDegree && degree < 165+ defaultDegree){
        res = classList.replace(/(\w*)-resize/,'nw-resize');
    }else if(degree > 164+ defaultDegree && degree < 335){
        res = classList.replace(/(\w*)-resize/,'nw-resize');
    }else if(degree < 25 || degree > 334 ){
        res = classList.replace(/(\w*)-resize/,'ew-resize');
    }else if(degree > 24 && degree < 65){
        res = classList.replace(/(\w*)-resize/,'ne-resize');
    }else if(degree > 64 && degree < 115){
        res = classList.replace(/(\w*)-resize/,'ns-resize');
    }else if(degree > 114 && degree < 165){
        res = classList.replace(/(\w*)-resize/,'nw-resize');
    }else if(degree > 164 && degree < 205){
        res = classList.replace(/(\w*)-resize/,'ew-resize');
    }

    $(item).attr('class',res);
};

Collocation.prototype.calcDegree = function(item){
    var s_x = $(item,$(this.currentEle)).offset().left,
        s_y = $(item,$(this.currentEle)).offset().top;
    var defaultDegree = 180;
    var s_rad = Math.atan2(this.getPosition(this.currentEle).Y + $(this.currentEle).outerHeight()/2 - s_y, s_x - this.getPosition(this.currentEle).X - $(this.currentEle).outerWidth()/2);
    var degree =  Math.ceil(s_rad / (Math.PI / 180) + defaultDegree); // 转换为360°  好计算  x的负轴为0° 按逆时针增加角度 x正轴为180°
    return degree;
};


/**
 * 获取元素距离父容器的距离
 * @param elem 元素
 */
Collocation.prototype.getPosition = function(elem){
    var elem = elem instanceof jQuery ? elem.get(0) : elem;
    var elemX = elem.offsetLeft;
    var elemY = elem.offsetTop;
    while(elem = elem.offsetParent) {
        elemX += elem.offsetLeft;
        elemY += elem.offsetTop
    }
    return {X : elemX, Y : elemY}
};

// 生成图片
Collocation.prototype.makeImg = function(layerIndex){
    var self = this;
    $('.control').hide();

    var ele = document.getElementById('js-dragContainer');
    ele.style.borderColor = '#fff';
    html2canvas(ele,{
        "proxy":"/lib/html2canvas/html2canvasproxy.php",//跨域支持
        onrendered : function(canvas){
            var img = canvas.toDataURL("image/png");
            self.saveImg(img,function(obj){
                if(self.defaultTags && $('#js-defaultTags').val().indexOf(self.defaultTags) == -1){
                    $('#js-defaultTags').val(self.defaultTags + $('#js-defaultTags').val());
                }
                layer.close(layerIndex);
                $('#js-postUrl').val(JSON.stringify(obj));
                $('#js-hiddenOrderGoods').val(self.skuList.join(','));
                $('#js-postFormBtn').trigger('click');//提交表单
            })
        }
    });

};

// 保存图片至图片服务器
Collocation.prototype.saveImg = function(base64,callback){
    var form = new FormData();
    form.append("site", "zaful");
    form.append("files", base64);

    $.ajax({
        url: UPLOAD_URL + 'review/upload',
        type: 'POST',
        cache: false,
        data: form,
        processData: false,
        contentType: false
    }).done(function(data) {
        if(data.status == 1){
            callback && callback(data);
        }
    });

};


//监听可拖拽元素的事件
Collocation.prototype.dragItemEvent = function(){
    var self = this;
    $('#js-goodsWrap').on('selectstart',self.dragItem,function(){
        return false;
    }).on('dragstart',self.dragItem,function(ev){
        //开始拖拽
        ev.originalEvent.dataTransfer.effectAllowed = 'move';
        self.currentItem = ev.target;
        var cacheWH = $(ev.target).data('wh').split('/');
        self.defaultWH = {width : cacheWH[0], height : cacheWH[1]};
        return true;
    }).on('dragend',self.dragItem,function(ev){
        //结束拖拽
        self.currentItem = null;
        return false;
    });
};
// 监听被移入容器的事件
Collocation.prototype.containerEvent = function(){
    var self = this;
    self.container.on('dragover',function(ev){
        ev.preventDefault();
        return true;
    }).on('dragenter',function(ev){
        ev.originalEvent.dataTransfer.dropEffect = 'move';
        $(this).toggleClass('active');
        return true;
    }).on('dragleave',function(){
        $(this).toggleClass('active');
        return true;
    }).on('drop',function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        self.endPosition.left = ev.originalEvent.clientX - self.container.offset().left;
        self.endPosition.top = ev.originalEvent.clientY - self.container.offset().top + $(document).scrollTop();
        if(self.currentItem){
            self.countItem();
        }
        $(this).toggleClass('active');
    });
};

// 事件绑定
Collocation.prototype.bindEvent = function(){
    var self = this;
    // 关闭弹窗
    self.closeBtn.on('click',function(){
        self.closePop();
    });

    //删除元素
    self.removeItemBtn.on('click',function(){
        self.removeItem();
    });
    // 向上移动
    self.forwardsItemBtn.on('click',function(){
        self.forwards();
    });
    // 向下移动
    self.backwordsItemBtn.on('click',function(){
       self.backwords();
    });
    // 切换边框
    self.borderSwitchBtn.on('click',function(){
        self.switchBorder($(this));
    });

    // 监听左边容器中元素拖拽
    $('body').on('mousedown','.drag',function(e){
        self.startDrag(e);
    });

    // cancel btn
    self.cancelBtn.on('click',function(){
        self.noticePop($('#js-cancelPop'));
    });

    // make img
    self.makeImgBtn.on('click',function(){
        var textLength = $.trim($('#js-postForm').find('textarea').val()).length; //字符长度
        var outfitLength = $.trim($('#js-postForm').find('input').val()).length; // outfit 标题长度
        if(outfitLength > 30 || textLength > 500){
            community.alertMsg('Sorry,please write under maximum characters.',0);
        }else if(textLength <= 0 || outfitLength <= 0){
            community.alertMsg("Opps, don't forget to write your title and description.",0);
        }else if(!$(self.container).find('.drag').length){
            community.alertMsg('Not so fast, how about some awesome pictures for your outfit?',0);
        }else{
            $('#js-uploadWrap').append('<li></li>');
            $('.drag').removeClass('active');
            var layerIndex = layer.load(jsLg.loading,15);
            self.makeImg(layerIndex);
        }
    });
};

Collocation.prototype.init = function(){
    this.dragItemEvent();
    this.containerEvent();
    this.bindEvent();
    this.borderSwitchBtn.eq(0).trigger('click'); //选中默认边框
};



