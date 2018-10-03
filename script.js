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
            "notepad": 2,
            "downupload": 3
        },
        page_show: [false, false, false], //页面在首页显示
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
            title: "哔哩哔哩",
            index: 1
        }, {
            active: false,
            title: "便签",
            index: 2
        }, {
            active: false,
            title: "云盘",
            index: 3
        }],
        // {
        //     active:true,    //当前页面是否激活
        //     title:"",       //标题
        //     index:1,        //序号
        //     isOpen:true     //当前页面是否打开
        // }
        upload_percentage: 0.0, //文件上传进度
        downupload_file_msg: [],
        // {
        //     filename:"",      //文件名称
        //     filesize:""       //文件大小（带单位  MB,KB）
        // }
    },
    mounted: function () {
        this.$nextTick(function () {
            let nowaday = new Date();
            let m = new Date();
            let cnt = 0;
            let C = new Array();
            //处理上个月
            m = new Date(m.getFullYear(), m.getMonth(), 1);
            for (let i = 1; i <= m.getDay(); i++) {
                let t = new Date(m.getFullYear(), m.getMonth(), i - m.getDay());
                C.push({
                    isNow: false,
                    active: false,
                    number: t.getDate()
                });
                cnt++;
            }

            //处理当月
            let nowMonth = m.getMonth();
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

            if (main_page.DayCOL.length < 6) {
                C = new Array();
                for (let i = 0; i < 7; i++) {
                    m = new Date(m.getFullYear(), m.getMonth(), m.getDate() + 1);
                    C.push({
                        isNow: false,
                        active: false,
                        number: m.getDate()
                    });
                }
                main_page.DayCOL.push(C);
            }

            //获取视频数据Bilibili
            $.get("http://ctrlkismet.top/home/GetB1l1b1l1Data", function (json_data) {
                json_data.data.cards.forEach(i => {
                    let x = JSON.parse(i.card);
                    if (x.category != null) return;
                    let title = x.title;
                    if (x.apiSeasonInfo != null) title = x.apiSeasonInfo.title + " " + x.index + " " + x.index_title;
                    main_page.bilibili_msg.push({
                        url: "https://www.bilibili.com/video/av" + x.aid,
                        title: title,
                        active: false
                    });
                });
                Vue.set(main_page.bilibili_msg[0], "active", true);
            });

            //获取服务器上的文件
            $.get("http://ctrlkismet.top/home/GetFileData", function (json_data) {
                main_page.downupload_file_msg = json_data;
            });
        });
    },
    methods: {
        // 导航栏中的搜索相关
        get_search: function () {
            //无法直接触发，需通过下面的写法或者触发a标签里的其他元素
            //$("#link_to_baidu").trigger("click");

            //注意顺序，这里link之后再清零操作无效
            main_page.message = "";
            $("#link_to_baidu")[0].click();
        },

        //壁纸更换相关
        scale: function () {
            main_page.activeGray = !main_page.activeGray;
        },
        dropdown: function () {
            main_page.activeDropdownBG = !main_page.activeDropdownBG;
        },
        change_bg: function () {
            $('#backupBG').src = $('#img-id').src + "?" + Math.random();
        },

        //页面通用设置相关
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
            //关闭idx的标签
            Vue.set(main_page.page_show, idx, false);
            main_page.now_active_page_cnt--;
            main_page.head_window_width.width = 100 / main_page.now_active_page_cnt + '%';
            Vue.set(main_page.all_page[idx], "active", false);

            //只有idx一个标签
            if (main_page.now_active_page_cnt < 1) {
                return;
            }

            //idx为当前激活的标签
            if (idx == main_page.now_active_page) {
                let temp_page = -1;
                for (let i = idx - 1; i >= 1; i--) {
                    if (main_page.page_show[i]) {
                        temp_page = i;
                        break;
                    }
                }
                if (temp_page == -1)
                    for (let i = idx + 1; i <= main_page.all_page.length; i++) {
                        if (main_page.page_show[i]) {
                            temp_page = i;
                            break;
                        }
                    }
                main_page.now_active_page = temp_page;
                this.show_page(main_page.now_active_page);
            }
        },
        reload_page: function (idx) {
            //获取视频数据Bilibili
            if (idx == 1) {
                main_page.bilibili_msg.splice(0, main_page.bilibili_msg.length);
                $.get("http://ctrlkismet.top/home/GetB1l1b1l1Data", function (json_data) {
                    json_data.data.cards.forEach(i => {
                        let x = JSON.parse(i.card);
                        if (x.category != null) return;
                        let title = x.title;
                        if (x.apiSeasonInfo != null) title = x.apiSeasonInfo.title + " " + x.index + " " + x.index_title;
                        main_page.bilibili_msg.push({
                            url: "https://www.bilibili.com/video/av" + x.aid,
                            title: title
                        });
                    });
                });
            }

            //获取服务器上的文件
            else if (idx == 3) $.get("http://ctrlkismet.top/home/GetFileData", function (json_data) {
                main_page.downupload_file_msg = json_data;
            });
        },

        //视频相关
        change_focus_video: function (direction) {
            let nowpage = 0;
            for (let i = 0; i < main_page.bilibili_msg.length; i++) {
                if (main_page.bilibili_msg[i]["active"]) {
                    nowpage = i;
                    break;
                }
            }
            //清除旧标记
            Vue.set(main_page.bilibili_msg[nowpage],"active",false);

            if(nowpage+direction<0) nowpage=0;
            else if(nowpage+direction>=main_page.bilibili_msg.length) nowpage=main_page.bilibili_msg.length-1;
            else nowpage+=direction;

            //设置新标记
            Vue.set(main_page.bilibili_msg[nowpage],"active",true);
        },

        //文件上传下载相关
        delete_file: function (filename) {
            $.get("http://ctrlkismet.top/home/DeleteFile?filename=" + filename, function (json_data) {
                main_page.downupload_file_msg = json_data;
            });
        },
        upload_file: function () {
            let fileUpload = $("#fileinput").get(0);
            let file = fileUpload.files[0];
            let data = new FormData();
            data.append(file.name, file);
            $.ajax({
                type: "POST",
                url: "http://ctrlkismet.top/home/Upload",
                contentType: false,
                processData: false,
                data: data,
                xhr: function xhr() {
                    let xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener('progress', function (e) {
                            main_page.upload_percentage = (e.loaded / e.total).toFixed(2);
                        }, false);
                    }
                    return xhr;
                },
                success: function () {
                    main_page.reload_page(3);
                    main_page.upload_percentage = 0;
                    $('.upload-file span').show();
                }
            });
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