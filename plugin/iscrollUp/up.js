



(function( global, factory ) {
    global._slideUp = factory();
}) ( this, function( options ) {
    var SlideUp = function(  ){
         }
    SlideUp.prototype.init = function( options ){
             var _default = {
                 pullDown:  '.pullDown',
                 pullUp: '.pullUp',
                 wrapper: 'wrapper',
                 thelist: '.thelist',
                 DownCallback: function(){},
                 pullUpCallback: function(){}
             }
             if (!options) {
                 options = _default;
             }
             var pullDown  = options.pullDown;
             var pullUp = options.pullUp;
             var wrapper = options.wrapper;
             var thelist = options.thelist;
             var DownCallback = options.DownCallback;
             var pullUpCallback = options.pullUpCallback;
             // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

             // 下拉加载；
             function pullDownAction (thelist, myScroll) {
                 var el, li, i;
                 el = document.querySelector(thelist);
                 DownCallback && DownCallback(el, function(){
                     myScroll.refresh();
                 });
             }
             /*  上啦加载
                 类名： thelist  即将加入Li的父元素；
             */
             function pullUpAction (thelist, myScroll) {

                 var el, li, i;
                 el = document.querySelector(thelist);
                 pullUpCallback && pullUpCallback(el, function(){
                     myScroll.refresh();
                 })
             }
             /*
             wrapper: 必须是id；
             pullDown, pullUp  , thelist 可以是类名；
             */
             var generatedCount = 0;
             var loaded = (function(pullDown, pullUp, wrapper, thelist, pullDownAction, pullUpAction) {
                 var myScroll,
                     pullDownEl, pullDownOffset,
                     pullUpEl, pullUpOffset;
                 return  function( ) {

                     if ( !pullDown || !pullUp || !wrapper || !thelist) return;
                     pullDownEl = document.querySelector(pullDown);
                     pullDownOffset = pullDownEl.offsetHeight;
                     pullUpEl = document.querySelector(pullUp);
                     pullUpOffset = pullUpEl.offsetHeight;
                     myScroll = new iScroll(wrapper, {
                         useTransition: true,
                         topOffset: pullDownOffset,
                         onRefresh: function () {
                             if (pullDownEl.className.match('loading')) {
                                 pullDownEl.className = '';
                                 // pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                             } else if (pullUpEl.className.match('loading')) {
                                 pullUpEl.className = '';
                                 pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                             }
                         },
                         onScrollMove: function () {
                             // console.log(this);
                             if (this.y > 5 && !pullDownEl.className.match('flip')) {
                                 pullDownEl.className = 'flip';
                                 // pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to 2refresh...';
                                 this.minScrollY = 0;
                             } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                                 pullDownEl.className = '';
                                 // pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                                 this.minScrollY = -pullDownOffset;
                             } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                                 pullUpEl.className = 'flip';
                                 pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新';
                                 this.maxScrollY = this.maxScrollY;
                             } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                                 pullUpEl.className = '';
                                 pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                                 this.maxScrollY = pullUpOffset;
                             }
                         },
                         onScrollEnd: function () {
                             if (pullDownEl.className.match('flip')) {
                                 pullDownEl.className = 'loading';
                                 // pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
                                 pullDownAction && pullDownAction(thelist, myScroll);	// Execute custom function (ajax call?)
                             } else if (pullUpEl.className.match('flip')) {
                                 pullUpEl.className = 'loading';
                                 pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
                                 pullUpAction && pullUpAction(thelist, myScroll);	// Execute custom function (ajax call?)
                             }
                         }
                     });
                     setTimeout(function () { document.getElementById(wrapper).style.left = '0'; }, 800);
                 }
             })(pullDown, pullUp, wrapper, thelist,  pullDownAction, pullUpAction );
        document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

         }
    return new SlideUp( options );
} );

