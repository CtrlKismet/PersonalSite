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
        activeGray: false,
        activeDropdownBG: false,
        DayCOL: [],
        // {
        //     isNow: true,   //是不是今天
        //     active: true,  //是不是本月
        //     number: ""     //日期（day）
        // }
        title_to_index: { //实现页码的简单传参
            "bilibili": 1,
            "test long title how do display in the main page": 2
        },
        page_show: [false, false], //页面在首页显示
        now_active_page: 0, //当前激活的界面序号
        now_active_page_cnt: 0, //当前激活的界面数量
        head_window_width: {
            width: '0'
        },
        bilibili_msg: [],
        // {
        //     url:"",  //视频链接
        //     title:"" //视频标题
        // }
        all_page: [{}, {
            active: false,
            title: "bilibili",
            index: 1
        }, {
            active: false,
            title: "test long title how do display in the main page",
            index: 2
        }]
        // {
        //     active:true,    //当前页面是否激活
        //     title:"",       //标题
        //     index:1,        //序号
        //     isOpen:true     //当前页面是否打开
        // }
    },
    mounted: function () {
        this.$nextTick(function () {
            var nowaday = new Date();
            var m = new Date();
            var cnt = 0;
            var C = new Array();
            //处理上个月
            m = new Date(m.getFullYear(), m.getMonth(), 1);
            for (var i = 1; i <= m.getDay(); i++) {
                var t = new Date(m.getFullYear(), m.getMonth(), i - m.getDay());
                C.push({
                    isNow: false,
                    active: false,
                    number: t.getDate()
                });
                cnt++;
            }

            //处理当月
            var nowMonth = m.getMonth();
            while (m.getMonth() == nowMonth) {
                C.push({
                    isNow: (nowaday.getDate() == m.getDate()),
                    active: true,
                    number: m.getDate()
                });
                cnt++;
                m = new Date(m.getFullYear(), m.getMonth(), m.getDate() + 1);
                if (cnt == 7) {
                    main_page.DayCOL.push(C);
                    C = new Array();
                    cnt = 0;
                }
            }
            //处理下个月
            while (m.getDay() != 6) {
                C.push({
                    isNow: false,
                    active: false,
                    number: m.getDate()
                });

                m = new Date(m.getFullYear(), m.getMonth(), m.getDate() + 1);
            }
            //最后一天
            C.push({
                active: false,
                number: m.getDate()
            });
            main_page.DayCOL.push(C);

            //获取视频数据Bilibili
            $.get("http://ctrlkismet.top/home/GetB1l1b1l1Data", function (json_data) {
                json_data.data.cards.forEach(i => {
                    var x = JSON.parse(i.card);
                    if (x.category != null) return;
                    var title = x.title;
                    if (x.apiSeasonInfo != null) title = x.apiSeasonInfo.title + " " + x.index + " " + x.index_title;
                    main_page.bilibili_msg.push({
                        url: "https://www.bilibili.com/video/av" + x.aid,
                        title: title
                    });
                });
            });
        });
    },
    methods: {
        get_search: function () {
            //无法直接触发，需通过下面的写法或者触发a标签里的其他元素
            //$("#link_to_baidu").trigger("click");

            //注意顺序，这里link之后再清零操作无效
            main_page.message = "";
            $("#link_to_baidu")[0].click();
        },
        scale: function () {
            main_page.activeGray = !main_page.activeGray;
        },
        dropdown: function () {
            main_page.activeDropdownBG = !main_page.activeDropdownBG;
        },
        change_bg: function () {
            $('#backupBG').src = $('#img-id').src + "?" + Math.random();
        },
        change_row: function () {
            main_page.row = 3;
            alert('sda');
        },
        show_page: function (idx) {
            //处理页面是否在主页上
            if (main_page.page_show[idx] == true);
            else {
                Vue.set(main_page.page_show, idx, true);
                //处理多出界面后标题栏统一宽度
                main_page.now_active_page_cnt++;
                main_page.head_window_width.width = 100 / main_page.now_active_page_cnt + '%';
            }
            //激活当前界面
            if (main_page.now_active_page != 0) Vue.set(main_page.all_page[main_page.now_active_page], "active", false);
            Vue.set(main_page.all_page[idx], "active", true); //因为加不加入if几乎不影响时间，所以省略
            main_page.now_active_page = idx;
        },
        close_page: function (idx) {
            Vue.set(main_page.page_show, idx, false);
            main_page.now_active_page_cnt--;
            main_page.head_window_width.width = 100 / main_page.now_active_page_cnt + '%';
            if(main_page.now_active_page_cnt<1) {
                Vue.set(main_page.all_page[idx], "active", false);
                return;
            }
            if (idx == main_page.now_active_page) {
                main_page.now_active_page = idx == 1 ? 2 : idx - 1;
                this.show_page(main_page.now_active_page);
            }
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

$(document).ready(function () {
    $('body').css('backgroundImage', $('body').css('backgroundImage').slice(0, -2) + "?" + Math.random() + '")');
    $('#backupBG')[0].src = $('#backupBG')[0].src + "?" + Math.random();
});

window.onload = function () {
    // this.setTimeout("loading_page_fadeOut()", 3000);
    // loading_page_fadeOut();
    loading_page_fadeOut_FOR_DEBUG_NOT_LOADED_();
};