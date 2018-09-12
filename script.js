let loading_page = new Vue({
    el: ".loading-page",
    data: {
        isActive: true,
        isLoad: false
    }
});

let main_page = new Vue({
    el: ".main-page",
    data: {
        isNotActive: true,
        message: "",
        activeGray:false,
        ZIndex:1
    },
    methods: {
        get_search: function () {
            //无法直接触发，需通过下面的写法或者触发a标签里的其他元素
            //$("#link_to_baidu").trigger("click");

            //注意顺序，这里link之后再清零操作无效
            main_page.message="";
            $("#link_to_baidu")[0].click();
        },
        scale:function () {
            main_page.activeGray=!main_page.activeGray;
            console.log("mouseenter");
        }
    }
});

function loading_page_fadeOut_FOR_DEBUG_NOT_LOADED_() {
    loading_page.isLoad = true;
    loading_page.isActive = false;
    main_page.isNotActive = false;
}

function loading_page_fadeOut() {
    loading_page.isLoad = true;
    main_page.isNotActive = false;
    setTimeout("loading_page.isActive = false;", 3000);
}

window.onload = function () {
    // this.setTimeout("loading_page_fadeOut()", 3000);
    // loading_page_fadeOut();
    loading_page_fadeOut_FOR_DEBUG_NOT_LOADED_();
};