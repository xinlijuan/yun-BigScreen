// 数据请求-物业管理
$(function () {
    //一: 物业管理
    var firstData = null;
    var secondData = null;
    var Xdata = new Array()
    var Ydata = new Array()
    var zoneCoord = new Array() //地图地址：经纬度
    var zoneCoord1 = [];
    var YQcountMonth = [];
    var XCcountMonth = [];
    var SHcountMonth = [];
    var HMcountMonth = [];
    var rkeName = [];
    var rkeDate = [];
    var rkeImg = [];
    $.ajax({
        type: 'get',
        url: "json/firstPage.json",
        dataType: "json",
        success: function (data) {
            firstData = data
            console.log(firstData);
        },
        error: function () {
            console.log("失败");

        }
    }),
        $.ajax({
            type: 'get',
            url: "json/myFirstPage.json",
            dataType: "json",
            success: function (data) {
                secondData = data
                console.log(secondData);
                // 2.小区设备使用率排行
                var homeUser = data.map.equipment
                for (i = 0; i < homeUser.length; i++) {
                    Xdata.push(homeUser[i].本年度使用数)
                    Ydata.push(homeUser[i].communityName)
                }

                // 3.呼市小区用户数据汇总
                mapData = data.map.map
                console.log(mapData);
                for (var i in mapData) {
                    zoneCoord1.push(mapData[i].communityName)
                    zoneCoord.push([JSON.parse(mapData[i].lng), JSON.parse(mapData[i].lat)])
                    // console.log(zoneCoord1[i]);
                    // console.log(zoneCoord[i]);
                    m = zoneCoord1[i].concat(":" + zoneCoord[i])
                    // console.log(m)
                }

                //5.各区季度柱状图
                countMonthYQ = data.map.countMonthYQ  //玉泉区
                for (i = 0; i < countMonthYQ.length; i++) {
                    YQcountMonth.push(countMonthYQ[i].数目)
                }

                countMonthXC = data.map.countMonthXC  //新城区
                for (i = 0; i < countMonthXC.length; i++) {
                    XCcountMonth.push(countMonthXC[i].数目)
                }

                countMonthSH = data.map.countMonthSH  //赛罕区
                for (i = 0; i < countMonthSH.length; i++) {
                    SHcountMonth.push(countMonthSH[i].数目)
                }

                countMonthHM = data.map.countMonthHM  //回民区
                for (i = 0; i < countMonthHM.length; i++) {
                    HMcountMonth.push(countMonthHM[i].数目)
                }

                // 3.门禁记录i++SH
                var RKEdata = {}
                RKEdata = data.map.RKE
                for (i = 0; i < RKEdata.length; i++) {
                    rkeName.push(RKEdata[i].communityName)
                    rkeDate.push(RKEdata[i].creDate)
                    rkeImg.push(RKEdata[i].image)
                }

            }
        }).then(function () {
            newData();
            //1.小区开门类型数据---立体柱状图
            (function () {
                var myChart = echarts.init(document.getElementById('door_type'));
                var xdata = ["刷卡开门", "人脸开门", "手机开门", "人证核验开门", "业主密码开门"];
                var dataArr = [firstData.sxkmCount, firstData.faceCount, firstData.photoCount, firstData.unitCount, firstData.UserCount];
                var dataArr1 = [];
                dataArr1 = dataArr.map(item => {
                    return 2;
                })
                var option = {
                    backgroundColor: 'rgb(5, 7, 20,0.5)',
                    title: {
                        top: '5%',
                        left: 'center',
                        text: '小区开门类型数据',
                        textStyle: {
                            align: 'center',
                            color: '#00FFFF',
                            fontSize: 14
                        }
                    },
                    tooltip: { // 提示框组件
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        },
                        show: true,
                        formatter: function (params) {
                            return params[0].name + "<br>" + params[0].data + '次';
                        }
                    },
                    grid: {
                        left: '5%',
                        right: '5%',
                        bottom: '0%',
                        top: '24%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: xdata,
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: "rgba(255,255,255,0.9)",
                                fontSize: 9
                            },
                            interval: 0,//横轴信息全部显示
                            rotate: 30,//角度倾斜显示
                        },
                        axisLine: {
                            show: false
                        },
                    },
                    yAxis: {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: "#00E4FF",
                                fontSize: 8
                            },
                            formatter: '{value}次',
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(255,255,255,0.4)'
                            }
                        },
                    },
                    series: [
                        {
                            name: '1',
                            type: 'bar',
                            stack: "次数",
                            barWidth: '23',
                            barGap: "50%",
                            itemStyle: {
                                normal: {
                                    color: '#00FF00'
                                }
                            },
                            data: dataArr
                        }
                    ]
                };
                myChart.setOption(option)
                window.addEventListener("resize", function () { myChart.resize(); })
            })();

            //2.小区使用率前10
            (function () {
                var myChart = echarts.init(document.getElementById('door_plot'));
                var fontColor = 'rgba(255,255,255,0.9)';
                option = {
                    color: ['#bf19ff', '#854cff', '#5f45ff', '#02cdff', '#0090ff', '#f9e264', '#f47a75', '#009db2', '#0780cf', '#765005'],
                    backgroundColor: 'rgb(5, 7, 20,0.5)',
                    textStyle: {
                        fontSize: 12
                    },
                    title: {
                        text: '小区本年度设备使用率TOP10',
                        top: '5%',
                        left: 'center',
                        textStyle: {
                            color: '#00FFFF',
                            align: 'center',
                            fontSize: 14
                        }
                    },
                    grid: {
                        left: '20',
                        right: '20',
                        bottom: '0',
                        top: '40',
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                backgroundColor: '#333'
                            }
                        }
                    },
                    legend: {
                        show: true,
                        x: 'center',
                        top: '20',
                        textStyle: {
                            color: fontColor
                        },
                        data: ['使用率']
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            textStyle: {
                                color: fontColor,
                                fontSize: 9
                            },
                            rotate: 30,
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#397cbc',
                            }
                        },
                        // data: ['五里营小区', '内大交通家属院', '疾控小区', '城市桂冠', '恒泰盛都', '民和花园', '远鹏星河', '鼎盛国际']
                        data: Xdata
                    }],
                    yAxis: [{
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: fontColor
                            },
                        },

                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: "#00E4FF",
                                fontSize: 8
                            },
                            formatter: '{value}次',
                        },
                    }],
                    series: [{
                        type: 'line',
                        symbol: 'circle',
                        symbolSize: 6,
                        label: {
                            normal: {
                                show: false,
                                position: 'top',
                                color: '	#00FF00'
                            }
                        },
                        lineStyle: {
                            color: 'transparent'
                        },
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#FF5624'
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#FF5624'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(8,228,222,0.3)'
                                    }
                                ])
                            }
                        },
                        // data: [65851, 568, 101, 10576, 131, 11226, 604, 182, 191, 234, 260, 280]
                        data: Ydata
                    }]
                }
                option.series[0].data = Xdata
                option.xAxis[0].data = Ydata
                myChart.setOption(option);
                window.addEventListener("resize", function () { myChart.resize(); })
            })();

            //3.呼市小区地图
            (function () {
                var uploadedDataURL = "json/huhehaote.json";
                var zoneCoord = {
                    //     zoneCoord
                    回民区: [111.662162, 40.815149],
                    五里营小区: [111.686511, 40.779544],
                    厂汉板一期: [111.63169, 40.854193],
                    毓秀国际: [111.677144, 40.870746],
                    富城家园: [111.632482, 40.835664],
                    呼铁菁华园: [111.647255, 40.832582],
                    沿河小区: [111.639835, 40.8323],
                    旺第嘉苑: [111.743782, 40.766553],
                    铁西家园: [111.63442, 40.831908],
                    中华家园: [111.719695, 40.854268],
                    新西兰小区: [111.615403, 40.844376],
                    天昱自由度: [111.639277, 40.834807],
                    远鹏星河国际小区: [111.649692, 40.77919],
                    春光嘉园: [111.694426, 40.784915],
                    敬老院小区: [111.701745, 40.742066],
                    城市桂冠: [111.675396, 40.809949],
                    内蒙古大学交通学院家属院: [111.678173, 40.809949],
                    云常社区: [111.656967, 40.852982],
                    水岸新城淳园: [109.791662, 39.582031],
                    昭君新村: [111.687108, 40.84946],
                    西岸国际: [111.642259, 40.791683],
                    监狱医院家属院: [111.648031, 40.844738],
                    鹏泰家园: [106.800269, 39.675069],
                    公园壹号: [111.569422, 41.011996],
                    祥和花园: [114.357184, 22.540445],
                    桃花岛小区: [111.649287, 40.777489],
                    龙江华苑: [111.791336, 40.794718],
                    阳光馨苑: [111.756859, 40.843735],
                    百灵小区: [111.684234, 40.83508],
                    中意二期: [111.679507, 40.800693],
                    恒泰盛都: [111.70346, 40.76304],
                    小府路清和家园: [111.651822, 40.846949],
                    水岸新巢: [111.645835, 40.83442],
                    内蒙古教育出版社住宅小区: [111.719527, 40.831184],
                    圣廷小区: [114.031618, 22.639391],
                    工商小区: [111.707967, 40.790937],
                    金色港湾小区: [111.652573, 40.820348],
                    信号厂小区: [111.648541, 40.830097],
                    海达B区: [106.822393, 39.663815],
                    厂汗板二期: [111.629522, 40.854937],
                    水岸新城润园: [109.787659, 39.583365],
                    政法委办公楼: [111.707674, 40.798795],
                    新街坊小区: [111.628949, 40.816935],
                    建行小区: [111.689361, 40.835395],
                    // 云常科技: [111.657261, 40.852887],
                    鸿博雅园二期: [111.646896, 40.85106],
                    银河小区: [111.655882, 40.817133],
                    云家惠智慧社区: [111.657206, 40.852958],
                    鼎峰丽景天下: [111.66704, 40.795723],
                    轻盐工纺: [111.684485, 40.833211],
                    监狱局小区: [111.631112, 40.815891],
                    秋实璟峯汇: [111.695466, 40.782609],
                    新希望家园A区: [111.700047, 40.799076],
                    智云祥网络科技有限公司: [0, 0],
                    香槟美景小区: [111.637252, 40.812348],
                    内蒙疾控小区: [111.673732, 40.799323],
                    都市雅园: [111.221227, 39.861197],
                    民和花园: [111.669371, 40.802682],
                    鼎盛国际: [111.736374, 40.849226],
                    星熠科技小区: [109.854876, 40.651983],
                    商户体验小区: [114.071164, 22.576224],
                    南店2期: [111.755165, 40.863133],
                    测试小区是否为单位: [111.652899, 40.847118],
                    云常智慧社区: [113.781694, 22.762976],
                    东苑小区: [111.701583, 40.804183],
                    云常市场部: [111.661297, 40.853515],
                    西统建小区: [111.714584, 40.83252],
                    云常dev小区: [111.659971, 40.853586],
                    云常科技市场部: [111.657224, 40.853017],
                    新希望家园B区: [111.700047, 40.799076],
                    壕赖沟小区: [111.572881, 40.876251],
                    巴彦呼舒第三中学: [121.464977, 45.057559],
                    咱家西区: [111.621631, 40.817995],
                    琪泰新居小区: [111.617828, 40.81894],
                    富兴花园: [111.629351, 40.81133],
                    明泽未来城: [111.748792, 40.858481],
                    云常科技: [111.770064, 40.831848],
                    东方维也纳: [111.790391, 40.843332],
                    泰和熙地: [111.543756, 40.796461],
                    黄金支队小区: [111.7134, 40.824765],
                    美林湾: [106.819891, 39.665441],
                    锦泽园小区: [111.632482, 40.809829],
                    科右中旗电视台: [121.467987, 45.064639],
                    金桥华府: [108.265591, 41.095294],
                    巴彥呼舒第一中学: [121.505647, 45.052414],
                    秀水佳园: [111.775052, 40.802474],
                    萨拉齐云家惠小区: [110.528581, 40.56794],
                    电信四分局宿舍: [111.708536, 40.830756],
                    铁路小区: [111.642551, 40.816621],
                    万和家园: [111.680659, 40.784419],
                    翡翠家园: [111.722086, 40.733609],
                    桃李文苑: [111.686605, 40.761073],
                    云家惠小区: [118.909006, 46.475674],
                    正太和平花园: [111.548989, 40.795702],
                    天骄熙岸小区: [111.645207, 40.784066],
                    大溪地: [113.955929, 22.555885],
                    四毛小区: [111.682667, 40.821199]
                };
                var newOD = [
                    {
                        from: '云常科技',
                        to: '五里营小区',
                        value: 3625
                    },
                    {
                        from: '云常科技',
                        to: '厂汉板一期',
                        value: 3078
                    },
                    {
                        from: '云常科技',
                        to: '毓秀国际',
                        value: 1506
                    },
                    {
                        from: '云常科技',
                        to: '富城家园',
                        value: 1315
                    },
                    {
                        from: '回民区',
                        to: '沿河小区',
                        value: 1106
                    },
                    {
                        from: '云常科技',
                        to: '呼铁菁华园',
                        value: 1208
                    },
                    {
                        from: '云常科技',
                        to: '旺第嘉苑',
                        value: 200
                    },
                    {
                        from: '回民区',
                        to: '铁西家园',
                        value: 1051
                    },
                    {
                        from: '云常科技',
                        to: '中华家园',
                        value: 1042
                    },
                    {
                        from: '云常科技',
                        to: '新西兰小区',
                        value: 924
                    },
                    {
                        from: '云常科技',
                        to: '天昱自由度',
                        value: 871
                    },
                    {
                        from: '云常科技',
                        to: '远鹏星河国际小区',
                        value: 783
                    },
                    {
                        from: '回民区',
                        to: '春光嘉园',
                        value: 650
                    },
                    {
                        from: '云常科技',
                        to: '敬老院小区',
                        value: 1042
                    },
                    {
                        from: '云常科技',
                        to: '城市桂冠',
                        value: 531
                    },
                    {
                        from: '云常科技',
                        to: '内蒙古大学交通学院家属院',
                        value: 513
                    },
                    {
                        from: '云常科技',
                        to: '水岸新城淳园',
                        value: 495
                    },
                    {
                        from: '云常科技',
                        to: '昭君新村',
                        value: 438
                    },
                    {
                        from: '云常科技',
                        to: '西岸国际',
                        value: 435
                    },
                    {
                        from: '云常科技',
                        to: '监狱医院家属院',
                        value: 399
                    },
                    {
                        from: '云常科技',
                        to: '鹏泰家园',
                        value: 379
                    },
                    {
                        from: '云常科技',
                        to: '公园壹号',
                        value: 369
                    },
                    {
                        from: '云常科技',
                        to: '祥和花园',
                        value: 344
                    },
                    // {
                    //     from: '云常科技',
                    //     to: '58号院',
                    //     value: 335
                    // },
                    {
                        from: '云常科技',
                        to: '桃花岛小区',
                        value: 328
                    },
                    {
                        from: '云常科技',
                        to: '龙江华苑',
                        value: 317
                    }, {
                        from: '云常科技',
                        to: '阳光馨苑',
                        value: 254
                    },
                    {
                        from: '云常科技',
                        to: '中意二期',
                        value: 254
                    },
                    {
                        from: '云常科技',
                        to: '百灵小区',
                        value: 252
                    },
                    {
                        from: '云常科技',
                        to: '恒泰盛都',
                        value: 158
                    },
                    {
                        from: '云常科技',
                        to: '小府路清和家园',
                        value: 148
                    },
                    , {
                        from: '云常科技',
                        to: '水岸新巢',
                        value: 137
                    },
                    {
                        from: '云常科技',
                        to: '内蒙古教育出版社住宅小区',
                        value: 136
                    },
                    {
                        from: '云常科技',
                        to: '圣廷小区',
                        value: 107
                    },
                  
                    {
                        from: '云常科技',
                        to: '工商小区',
                        value: 107
                    },
                    {
                        from: '云常科技',
                        to: '金色港湾小区',
                        value: 85
                    },
                    {
                        from: '云常科技',
                        to: '信号厂小区',
                        value: 78
                    },
                    {
                        from: '云常科技',
                        to: '海达B区',
                        value: 65
                    },
                    {
                        from: '云常科技',
                        to: '水岸新城润园',
                        value: 53
                    },
                    {
                        from: '云常科技',
                        to: '政法委办公楼',
                        value: 43
                    },
                    {
                        from: '云常科技',
                        to: '新街坊小区',
                        value: 40
                    },
                    {
                        from: '云常科技',
                        to: '建行小区',
                        value: 34
                    },
                    {
                        from: '云常科技',
                        to: '鸿博雅园二期',
                        value: 25
                    },
                    // {
                    //     // from: '云常科技',
                    //     // to: '云常科技',
                    //     // value: 23
                    // },
                    {
                        from: '云常科技',
                        to: '银河小区',
                        value: 23
                    },
                    {
                        from: '云常科技',
                        to: '云家惠智慧社区',
                        value: 23
                    },
                    {
                        from: '云常科技',
                        to: '鼎峰丽景天下',
                        value: 21
                    },
                    {
                        from: '云常科技',
                        to: '轻盐工纺',
                        value: 20
                    },
                    {
                        from: '云常科技',
                        to: '监狱局小区',
                        value: 20
                    },
                    {
                        from: '云常科技',
                        to: '秋实璟峯汇',
                        value: 19
                    },
                    {
                        from: '云常科技',
                        to: '新希望家园A区',
                        value: 18
                    },
                    {
                        from: '云常科技',
                        to: '智云祥网络科技有限公司',
                        value: 18
                    },
                    {
                        from: '云常科技',
                        to: '香槟美景小区',
                        value: 18
                    },
                    {
                        from: '云常科技',
                        to: '内蒙疾控小区',
                        value: 17
                    },
                    {
                        from: '云常科技',
                        to: '都市雅园',
                        value: 15
                    },
                    {
                        from: '云常科技',
                        to: '民和花园',
                        value: 15
                    },
                    {
                        from: '云常科技',
                        to: '鼎盛国际',
                        value: 10
                    },
                    {
                        from: '云常科技',
                        to: '星熠科技小区',
                        value: 10
                    },
                    {
                        from: '云常科技',
                        to: '商户体验小区',
                        value: 9
                    },
                    {
                        from: '云常科技',
                        to: '南店2期',
                        value: 8
                    },
                    {
                        from: '云常科技',
                        to: '测试小区是否为单位',
                        value: 7
                    },
                    {
                        from: '云常科技',
                        to: '云常智慧社区',
                        value: 6
                    },
                    {
                        from: '云常科技',
                        to: '东苑小区',
                        value: 6
                    },
                    {
                        from: '云常科技',
                        to: '云常市场部',
                        value: 6
                    },
                    {
                        from: '云常科技',
                        to: '西统建小区',
                        value: 5
                    },
                    {
                        from: '云常科技',
                        to: '云常dev小区',
                        value: 5
                    },
                    {
                        from: '云常科技',
                        to: '云常科技市场部',
                        value: 5
                    },
                    {
                        from: '云常科技',
                        to: '新希望家园B区',
                        value: 5
                    },
                    {
                        from: '云常科技',
                        to: '壕赖沟小区',
                        value: 5
                    },
                    {
                        from: '云常科技',
                        to: '巴彦呼舒第三中学',
                        value: 4
                    },
                    {
                        from: '云常科技',
                        to: '咱家西区',
                        value: 4
                    },
                    {
                        from: '云常科技',
                        to: '琪泰新居小区',
                        value: 4
                    },
                    {
                        from: '云常科技',
                        to: '富兴花园',
                        value: 4
                    },
                    {
                        from: '云常科技',
                        to: '明泽未来城',
                        value: 3
                    },
                    // {
                    //     from: '云常科技',
                    //     to: '云常科技',
                    //     value: 3
                    // },
                    {
                        from: '云常科技',
                        to: '东方维也纳',
                        value: 3
                    },
                    {
                        from: '云常科技',
                        to: '泰和熙地',
                        value: 3
                    },
                    {
                        from: '云常科技',
                        to: '黄金支队小区',
                        value: 3
                    },
                    {
                        from: '云常科技',
                        to: '美林湾',
                        value: 3
                    },
                    {
                        from: '云常科技',
                        to: '锦泽园小区',
                        value: 2
                    },
                    {
                        from: '云常科技',
                        to: '科右中旗电视台',
                        value: 2
                    },
                    {
                        from: '云常科技',
                        to: '金桥华府',
                        value: 2
                    },
                    {
                        from: '云常科技',
                        to: '巴彥呼舒第一中学',
                        value: 2
                    },
                    {
                        from: '云常科技',
                        to: '秀水佳园',
                        value: 2
                    },
                    {
                        from: '云常科技',
                        to: '萨拉齐云家惠小区',
                        value: 2
                    },
                    {
                        from: '云常科技',
                        to: '电信四分局宿舍',
                        value: 254
                    },
                    {
                        from: '云常科技',
                        to: '铁路小区',
                        value: 1
                    },
                    {
                        from: '云常科技',
                        to: '万和家园',
                        value: 1
                    },
                    {
                        from: '云常科技',
                        to: '翡翠家园',
                        value: 1
                    },
                    {
                        from: '云常科技',
                        to: '桃李文苑',
                        value: 1
                    },
                    {
                        from: '云常科技',
                        to: '云家惠小区',
                        value: 1
                    },
                    {
                        from: '云常科技',
                        to: '正太和平花园',
                        value: 1
                    },
                    {
                        from: '云常科技',
                        to: '天骄熙岸小区',
                        value: 1
                    },
                    {
                        from: '云常科技',
                        to: '大溪地',
                        value: 1
                    },
                    {
                        from: '云常科技',
                        to: '四毛小区',
                        value: 1
                    }
                ];
                var initData = newOD.filter(function (e) {
                    return e.from == "云常科技";
                });
                var getOdValue = function (odData, name) {
                    var fromObj = {};
                    var toObj = {};
                    for (var e in odData) {
                        if (fromObj[odData[e].from] === undefined) {
                            fromObj[odData[e].from] = odData[e].value;
                        } else {
                            fromObj[odData[e].from] = fromObj[odData[e].from] + odData[e].value;
                        }
                        if (toObj[odData[e].to] === undefined) {
                            toObj[odData[e].to] = odData[e].value;
                        } else {
                            toObj[odData[e].to] = toObj[odData[e].to] + odData[e].value;
                        }
                    }
                    var result = [];
                    for (var item in fromObj) {
                        if (item == name) continue;
                        result.push({
                            name: item,
                            value: zoneCoord[item].concat(fromObj[item]),
                        });
                    }

                    for (var ind in toObj) {
                        if (ind == name) continue;
                        result.push({
                            name: ind,
                            value: zoneCoord[ind].concat(toObj[ind]),
                        });
                    }
                    return result;
                }
                var convertData = function (data) {
                    var res = [];
                    for (var e in data) {
                        var fromCoord = zoneCoord[data[e].from];
                        var toCoord = zoneCoord[data[e].to];
                        if (fromCoord && toCoord) {
                            res.push([{
                                coord: fromCoord
                            },
                            {
                                coord: toCoord
                            }
                            ]);
                        }
                    }
                    return res;
                };
                $.get(uploadedDataURL, function (geoJson) {
                    var myChart = echarts.init(document.getElementById('property_map'));
                    echarts.registerMap('property_map', geoJson);
                    var option = {
                        backgroundColor: '',
                        title: {
                            text: "呼和浩特市区用户数据汇总",
                            left: 'center',
                            top: "5%",
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        tooltip: {
                            trigger: 'item',
                            // backgroundColor: 'rgba(166, 200, 76, 0.82)',
                            borderColor: '#FFFFCC',
                            showDelay: 0,
                            hideDelay: 0,
                            enterable: true,
                            transitionDuration: 0,
                            extraCssText: 'z-index:100'
                        },
                        geo: {
                            map: 'property_map',
                            scaleLimit: {
                                min: 1,
                                max: 50
                            },
                            center: [111.662162, 40.815149],
                            nameMap: {
                                selectedMode: 'single'
                            },
                            zoom: 15, //地图大小
                            label: {
                                emphasis: {
                                    show: true,
                                    fontSize: 20,
                                    textStyle: {
                                        color: '#ffffff'
                                    }
                                }
                            },
                            roam: true, //是否允许缩放
                            itemStyle: {
                                normal: {
                                    color: 'rgba(10, 37, 105, .8)', //地图背景色
                                    borderColor: '#4bf5ff', //省市边界线00fcff 516a89
                                    borderWidth: 2
                                },
                                emphasis: {
                                    color: 'rgba(37, 43, 61, .5)' //悬浮背景
                                }
                            }
                        },
                        visualMap: { //图例值控制
                            min: 0,
                            max: 15000,
                            // left: 'right',
                            // right: 50,
                            // bottom:100,
                            text: ['高', '低'], // 文本，默认为数值文本
                            seriesIndex: [1],
                            calculable: true,
                            inRange: {
                                // color: ['yellow', 'lightskyblue', 'orangered']
                                color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'] // 黄橙红
                            },
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        series: [{
                            name: '云常科技',
                            type: 'lines',
                            coordinateSystem: 'geo',
                            zlevel: 1,
                            data: convertData(initData),
                            silent: true,
                            lineStyle: {
                                normal: {
                                    // width: 1, //尾迹线条宽度
                                    // opacity: 1, //尾迹线条透明度
                                    // curveness: .3 ,//尾迹线条曲直度
                                    // color:'yellow'
                                    color: '#f6ff54',
                                    width: 1,
                                    curveness: 0.3
                                }
                            },
                            effect: {
                                show: true,
                                period: 4, //箭头指向速度，值越小速度越快
                                trailLength: 0.05, //特效尾迹长度[0,1]值越大，尾迹越长重
                                symbol: 'arrow', //箭头图标
                                symbolSize: 6, //图标大小
                            },
                        },
                        {
                            // name: '出行量',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            zlevel: 0,
                            rippleEffect: { //涟漪特效
                                brushType: 'stroke', //波纹绘制方式 stroke, fill
                                scale: 3
                            },
                            symbol: 'circle',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right', //显示位置
                                    offset: [5, 0], //偏移设置
                                    formatter: function (params) { //圆环显示文字
                                        return params.data.name;
                                    },
                                    fontSize: 10,
                                    textStyle: {
                                        color: 'rgb(120,350,10)'
                                    }
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            tooltip: {
                                formatter: function (params, ticket, callback) {
                                    let data = params.data;
                                    let name = data.name;
                                    let value = parseInt(data.value[2]);
                                    let res = name + '<br/>开户量：' + value;
                                    return res;
                                },
                            },
                            symbolSize: function (val) {
                                var value = val[2];
                                if (value < 100) {
                                    return 4;
                                } else if (value >= 100 && value < 500) {
                                    return 9;
                                } else if (value >= 500 && value < 1000) {
                                    return 15;
                                } else if (value >= 1000 && value < 5000) {
                                    return 22;
                                } else if (value >= 5000 && value < 10000) {
                                    return 30;
                                } else {
                                    return 40;
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#f6ff54'
                                }
                            },
                            data: getOdValue(initData, "美林街道")
                        }
                        ]
                    };

                    myChart.setOption(option);
                    myChart.on('click', function (obj) {
                        console.log(obj);
                        var name = obj.name;
                        var data = newOD.filter(function (value) {
                            return value.from == name;
                        })
                        if (data.length > 0) {
                            option.series[0].data = convertData(data);
                            option.series[1].data = getOdValue(data, name);
                            myChart.setOption(option);
                        }
                        window.addEventListener("resize", function () { myChart.resize(); })
                    });
                });
            })();

            //4.呼和浩特市用户使用率--饼图
            (function () {
                var myChart = echarts.init(document.getElementById('home_install4'));
                var data = {
                    value: 24.2,
                    text: '-',
                    color: ['#2979FF', '#00E5FF', '#1976D2', '#29B6F6'],
                    xAxis: ['现有房屋数', '现有门禁卡数', 'App下载量', '现有住户总数'],
                    values: ['1176', '1178', '1122', '1133'],
                }
                var seriesData = []
                var titleData = []
                data.values.forEach(function (item, index) {
                    titleData.push({
                        text: '台' + '\n\n\n\n',
                        left: 21 * (index + 1) - .9 + '%',
                        top: '50%',
                        textAlign: 'center',
                        textStyle: {
                            fontSize: '1',
                            color: 'rgba(255,255,255,0.3)',
                        },
                        subtext: data.xAxis[index],
                        subtextStyle: {
                            fontSize: '12',
                            color: '#00FFFF',
                            fontWeight: '400',
                        },
                    })
                    seriesData.push({
                        type: 'pie',
                        radius: ['20', '22'],
                        center: [21 * (index + 1) + '%', '38%'],
                        hoverAnimation: false,
                        label: {
                            normal: {
                                position: 'center'
                            },
                        },
                        data: [{
                            value: item,
                            name: data.text,
                            itemStyle: {
                                normal: {
                                    color: data.color[index],
                                }
                            },
                            label: {
                                normal: {
                                    show: false,
                                }
                            }
                        },
                        {
                            value: 100 - item,
                            name: '占位',
                            tooltip: {
                                show: false
                            },
                            itemStyle: {
                                normal: {
                                    color: '#edf1f4',
                                }
                            },
                            label: {
                                normal: {
                                    formatter: item,
                                    textStyle: {
                                        fontSize: 18,
                                        color: 'rgba(255,255,255,1)',
                                    }
                                },

                            }
                        }
                        ]
                    })
                })
                ////////////////////////////////////////
                let value = data.value || 0
                option = {
                    backgroundColor: 'rgb(5, 7, 20,0.5)',
                    title: titleData,
                    series: seriesData,
                    grid: {
                        top: "30px",
                        left: "-10px",
                        right: "0",
                        bottom: "10px"
                    }
                }
                myChart.setOption(option);
                window.addEventListener("resize", function () { myChart.resize(); })
            })();

            //5.2020年季度各区设备使用率--柱状图
            (function () {
                var myChart = echarts.init(document.getElementById('home'));
                option = {
                    backgroundColor: 'rgb(5, 7, 20,0.5)',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    title: {
                        text: '2020年季度各区设备使用率',
                        top: '5%',
                        left: 'center',
                        textStyle: {
                            color: '#00FFFF',
                            align: 'center',
                            fontSize: 14
                        }
                    },
                    legend: {
                        data: ['4月', '5月', '6月'],
                        right: 10,
                        top: '15%',
                        textStyle: {
                            color: "#fff"
                        },
                        itemWidth: 12,
                        itemHeight: 10,
                    },
                    grid: {
                        left: '4%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: [
                            '玉泉区',
                            '新城区',
                            '赛罕区',
                            '回民区',

                        ],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#063374",
                                width: 1,
                                type: "solid"
                            }
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: "#FFF",
                                fontSize: 12
                            }
                        },
                    }],
                    yAxis: [{
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}次 '
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: "#00c7ff",
                                width: 1,
                                type: "solid"
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#063374",
                            }
                        }
                    }],
                    series: [{
                        name: '4月',
                        type: 'bar',
                        data: [YQcountMonth[0], XCcountMonth[0], SHcountMonth[0], HMcountMonth[0]],
                        barWidth: 10, //柱子宽度
                        barGap: 0, //柱子之间间距
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#fccb05'
                                }, {
                                    offset: 1,
                                    color: '#f5804d'
                                }]),
                                opacity: 1,
                                barBorderRadius: 12,
                            }
                        }
                    }, {
                        name: '5月',
                        type: 'bar',
                        data: [YQcountMonth[1], XCcountMonth[1], SHcountMonth[1], HMcountMonth[1]],
                        barWidth: 10,
                        barGap: 1,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#8bd46e'
                                }, {
                                    offset: 1,
                                    color: '#09bcb7'
                                }]),
                                opacity: 1,
                                barBorderRadius: 12,
                            }
                        }
                    }, {
                        name: '6月',
                        type: 'bar',
                        data: [YQcountMonth[2], XCcountMonth[2], SHcountMonth[2], HMcountMonth[2]],
                        barWidth: 10,
                        barGap: 1,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#248ff7'
                                }, {
                                    offset: 1,
                                    color: '#6851f1'
                                }]),
                                opacity: 1,
                                barBorderRadius: 12,
                            }
                        }
                    }]
                };
                var app = {
                    currentIndex: -1,
                };
                setInterval(function () {
                    var dataLen = option.series[0].data.length;

                    // 取消之前高亮的图形
                    myChart.dispatchAction({
                        type: 'downplay',
                        seriesIndex: 0,
                        dataIndex: app.currentIndex
                    });
                    app.currentIndex = (app.currentIndex + 1) % dataLen;
                    //console.log(app.currentIndex);
                    // 高亮当前图形
                    myChart.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 0,
                        dataIndex: app.currentIndex,
                    });
                    // 显示 tooltip
                    myChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: app.currentIndex
                    });


                }, 1000);
                myChart.setOption(option)
                window.addEventListener("resize", function () { myChart.resize(); })
            })();
        })
    function newData() {
        var htmlStr = `
             <img src="http://118.89.235.124:8080/images/${rkeImg[1]}" alt="">
             <span>
               <p>小区：${rkeName[1]}</p>
               <p>抓拍时间：${rkeDate[1]}</p>
               <p>单元楼号：*栋*单元*号</p>
               <p>业主/访客</p>
             </span>
            `
        $('.new').html(htmlStr)
    }
})

// 数据请求-消防检测
$(function () {
    // 1.左地图
    (function () {
        var myChart = echarts.init(document.getElementById('map1'));
        // note: 设置灰色背景色的长度的逻辑不够好，请自行调整
        var honorData = [{
            name: "已上报总数",
            data: [1800, 1600, 1400, 1200, 1000, 500]
        }, {
            name: "待审核总数",
            data: [1800, 1600, 1400, 1200, 1000, 500]
        }, {
            name: "已审核总数",
            data: [1800, 1600, 1400, 1200, 1000, 500]
        }, {
            name: "维修中总数",
            data: [1800, 1600, 1400, 1200, 1000, 500]
        },
        {
            name: "已完成总数",
            data: [1800, 1600, 1400, 1200, 1000, 500]
        },];
        var honorXAxisData = ["赛罕区", "新城区", "玉泉区",
            "回民区", "金川开发区", "金桥开发区"
        ];
        // // 设置灰色背景色的长度
        var isMax = 2000
        var bjData1 = [isMax, isMax, isMax, isMax, isMax, isMax, isMax, isMax, isMax];
        var option = {
            title: {
                text: '消防上报消息状态分析',
                top: '3%',
                left: '5%',
                textStyle: {
                    color: '#00FFFF',
                    align: 'center',
                    fontSize: 25
                }
            },
            color: ['#0F9AF8', '#2039C3', 'rgba(32,57,195,.5)', '#2ECACE'],
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "none"
                },
            },
            // backgroundColor: '#031f2d',

            legend: {
                right: 5,
                top: '10%',
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 15,
                textStyle: {
                    color: '#ACCFFF',
                    fontSize: 16,
                },
            },
            grid: {
                left: "10%",
                right: "10%",
                bottom: "5%",
                top: "15%",
                containLabel: true
            },
            xAxis: [{
                type: "value",
                show: false,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: "#6B9DD7",
                    fontSize: 16, // 文字大小
                    fontWeight: 400,
                    interval: 0,
                    formatter: function (value) {
                        return value + "(万元)"
                    },
                },
                splitLine: {
                    show: false
                },
            },],
            yAxis: [{
                type: "category",
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: "#6B9DD7",
                    fontSize: 16, // 文字大小
                    fontWeight: 400,
                    interval: 0
                },
                offset: 20,
                data: honorXAxisData
            }],
            series: [{
                name: "已上报总数",
                type: "bar",
                stack: 'zongliang',
                barWidth: '35%',
                zlevel: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        textStyle: {
                            color: '#fff',
                            fontSize: 14
                        }
                    }
                },
                data: honorData[0].data,
            }, {
                name: "待审核总数",
                type: "bar",
                stack: 'zongliang',
                barWidth: '35%',
                zlevel: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            // return  params.seriesName + params.value ;
                            return '待审核' + params.value;
                        },
                        textStyle: {
                            color: '#fff',
                            fontSize: 10
                        }
                    }
                },
                data: honorData[1].data,
            }, {
                name: "已审核总数",
                type: "bar",
                stack: 'zongliang',
                barWidth: '35%',
                zlevel: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            // return  params.seriesName + params.value ;
                            return '已审核' + params.value;
                        },
                        textStyle: {
                            color: '#fff',
                            fontSize: 10
                        }
                    }
                },
                data: honorData[2].data,
            }, {
                name: "维修中总数",
                type: "bar",
                stack: 'zongliang',
                barWidth: '35%',
                zlevel: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        textStyle: {
                            color: '#fff',
                            fontSize: 14
                        }
                    }
                },
                data: honorData[3].data,
            }, {
                name: "已完成总数",
                type: "bar",
                stack: 'zongliang',
                barWidth: '35%',
                zlevel: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        textStyle: {
                            color: '#fff',
                            fontSize: 14
                        }
                    }
                },
                data: honorData[3].data,
            }]
        }
        myChart.setOption(option);
    })();
    // 右饼图
    (function () {
        var myChart = echarts.init(document.getElementById('fire_pie'));
        var mainGaugedata = [{
            name: '已上报总数',
            value: 10.26
        }, {
            name: '待审核总数',
            value: 90.9
        }, {
            name: '已审核总数',
            value: 94.49
        }, {
            name: '待维修总数',
            value: 98.54
        }, {
            name: '已完成总数',
            value: 98.54
        }]
        var titleArr = [],
            seriesArr = [];
        mainGaugedata.forEach(function (item, index) {
            titleArr.push(
                {
                    text: item.name,
                    left: index * 20 + 12.5 + '%',
                    top: '5%',
                    textAlign: 'center',
                    textStyle: {
                        fontWeight: 'bold',
                        fontSize: '16',
                        color: "#6b9fd6",
                        textAlign: 'center',
                    },
                }
            );
            seriesArr.push(
                {
                    name: '仪表盘每秒跳动一格v2',
                    type: 'gauge',
                    splitNumber: 10,
                    detail: {
                        formatter: '{value}%',
                        offsetCenter: [0, '60%'],
                        textStyle: {
                            color: '#fff',
                            fontSize: 20
                        }

                    },
                    center: [index * 20 + 12.5 + '%', '70%'],
                    radius: '60%',
                    min: 0,
                    max: 100,

                    axisLabel: {
                        show: false
                    },
                    axisLine: { //背景边框

                        lineStyle: {
                            width: 8,
                            color: [
                                [0.2, '#91c7ae'],
                                [0.8, '#63869e'],
                                [1, '#c23531']
                            ]
                        }
                    },
                    splitLine: { //分隔线样式
                        show: true,

                        length: 25,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    axisTick: { //小刻度样式
                        show: true,
                        lineStyle: {
                            color: 'auto',
                            width: 1
                        },
                        length: 20,
                        splitNumber: 5
                    },
                    data: [{
                        value: item.value,
                    }]
                }
            )
        })
        myChart.setOption({
            // backgroundColor: "#003366",
            title: titleArr,
            series: seriesArr
        });
        window.addEventListener("resize", function () { myChart.resize(); })
    })();
})

//数据请求--智能家居
$(function () {
    // 1.人才饼图
    (function () {
        var myChart = echarts.init(document.getElementById('jiaju'));
        var img = 'data:image/png;base64,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';
        var trafficWay = [{
            name: 'web前端工程师',
            value: 5
        },
        {
            name: '程序优化',
            value: 4
        }, {
            name: '通讯设备工程师',
            value: 15
        },
        {
            name: 'Android开发工程师',
            value: 4
        },
        {
            name: 'JAVA工程师',
            value: 12
        },
        {
            name: 'IOS开发工程师',
            value: 5
        }];

        var data = [];
        var color = ['#00ffff', '#00cfff', '#006ced', '#ffe000', '#ffa800', '#ff5b00', '#ff3000']
        for (var i = 0; i < trafficWay.length; i++) {
            data.push({
                value: trafficWay[i].value,
                name: trafficWay[i].name,
                itemStyle: {
                    normal: {
                        borderWidth: 5,
                        shadowBlur: 10,
                        borderColor: color[i],
                        shadowColor: color[i]
                    }
                }
            }, {
                value: 2,
                name: '',
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        color: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 0
                    }
                }
            });
        }
        var seriesOption = [{
            name: '',
            type: 'pie',
            clockWise: false,
            radius: [60, 65],
            hoverAnimation: false,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'outside',
                        color: '#ddd',
                        formatter: function (params) {
                            var percent = 0;
                            var total = 0;
                            for (var i = 0; i < trafficWay.length; i++) {
                                total += trafficWay[i].value;
                            }
                            percent = ((params.value / 50) * 50).toFixed(0);
                            if (params.name !== '') {
                                return '' + params.name + '\n' + '\n' + '' + percent + '人';
                            } else {
                                return '';
                            }
                        },
                    },
                    labelLine: {
                        length: 10,
                        length2: 25,
                        show: true,
                        color: '#00ffff'
                    }
                }
            },
            data: data
        }];
        option = {
            // backgroundColor: '#0A2E5D',
            color: color,
            title: {
                text: '专业团队',
                top: '45%',
                textAlign: "center",
                left: "49%",
                textStyle: {
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: '300'
                }
            },
            graphic: {
                elements: [{
                    type: "image",
                    z: 3,
                    style: {
                        image: img,
                        width: 90,
                        height: 90
                    },
                    left: 'center',
                    top: 'center',
                    position: [100, 100]
                }]
            },
            tooltip: {
                show: false
            },
            legend: {
                icon: "circle",
                orient: 'horizontal',
                // x: 'left',
                data: ['web前端工程师', 'Android开发工程师', '程序优化', 'JAVA工程师', 'IOS开发工程师', '通讯设备工程师'],
                // right: 340,
                // bottom: 150,
                align: 'right',
                textStyle: {
                    color: "#fff",
                    fontSize: 10
                },
                itemGap: 10,
                show: false
            },
            toolbox: {
                show: false
            },
            series: seriesOption
        }
        myChart.setOption(option)
        window.addEventListener("resize", function () { myChart.resize(); })
    })();
    // 2.本地服务
    (function () {
        var myChart = echarts.init(document.getElementById('jiaju1'));
        option = {
            // backgroundColor: '#1a4377',
            tooltip: {},
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            // color:['#83e0ff','#45f5ce','#b158ff'],
            series: [
                {
                    "symbol": "path://M19.300,3.300 L253.300,3.300 C262.136,3.300 269.300,10.463 269.300,19.300 L269.300,21.300 C269.300,30.137 262.136,37.300 253.300,37.300 L19.300,37.300 C10.463,37.300 3.300,30.137 3.300,21.300 L3.300,19.300 C3.300,10.463 10.463,3.300 19.300,3.300 Z",
                    symbolOffset: [10, 0],
                    type: 'graph',
                    layout: 'force',
                    force: {
                        repulsion: 160,
                        edgeLength: 240
                    },
                    roam: true,
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    data: [
                        {
                            name: '信息巡检',
                            symbolSize: [80, 30],
                            itemStyle: {
                                normal: {
                                    borderColor: '#007eff',
                                    borderWidth: 1,
                                    color: 'rgba(225,225,225,0)'
                                }
                            }
                            , label: {
                                normal: {
                                    formatter: function (params) {
                                        console.log(params)
                                    },

                                    rich: {
                                        a: {
                                            color: "#fef1e8",
                                            fontSize: 12,
                                            lineHeight: 30,
                                            align: 'center'
                                        },
                                        b: {
                                            color: "#fdf9f1",
                                            fontSize: 23,
                                            align: 'center'
                                        }
                                    }

                                }
                            }
                        },
                        {
                            name: '版本升级',
                            symbolSize: 60,
                            itemStyle: {
                                normal: {
                                    borderColor: '#04f2a7',
                                    borderWidth: 2,
                                    shadowBlur: 8,
                                    shadowColor: '#04f2a7',
                                    color: '#001c43',
                                }
                            },
                            category: 1,

                        },
                        {
                            name: '售后服务',
                            symbolSize: 60,
                            category: 1,
                            itemStyle: {
                                normal: {
                                    borderColor: '#04f2a7',
                                    borderWidth: 5,
                                    shadowBlur: 8,
                                    shadowColor: '#04f2a7',
                                    color: '#001c43',
                                }
                            },

                        },
                        {
                            name: '定期维护',
                            symbolSize: 50,
                            category: 1,
                            itemStyle: {
                                normal: {
                                    borderColor: '#82dffe',
                                    borderWidth: 2,
                                    shadowBlur: 8,
                                    shadowColor: '#04f2a7',
                                    color: '#001c43',
                                }
                            },

                        },
                        {
                            name: '协助二次开发',
                            symbolSize: 60,
                            category: 1,
                            itemStyle: {
                                normal: {
                                    borderColor: '#82dffe',
                                    borderWidth: 2,
                                    shadowBlur: 8,
                                    shadowColor: '#04f2a7',
                                    color: '#001c43',
                                }
                            },

                        },
                        {
                            name: '紧急救援服务',
                            symbolSize: 50,
                            category: 2,
                            itemStyle: {
                                normal: {
                                    borderColor: '#82dffe',
                                    borderWidth: 2,
                                    shadowBlur: 8,
                                    shadowColor: '#04f2a7',
                                    color: '#001c43',
                                }
                            },

                        },
                        {
                            name: '需求反馈',
                            symbolSize: 40,
                            category: 2,
                            itemStyle: {
                                normal: {
                                    borderColor: '#b457ff',
                                    borderWidth: 2,
                                    shadowBlur: 8,
                                    shadowColor: '#b457ff',
                                    color: '#001c43'
                                }
                            },


                        }],
                    lineStyle: {
                        normal: {
                            opacity: 0.9,
                            width: 0,
                            curveness: 0
                        }
                    },
                    categories: [
                        { name: '0' },
                        { name: '1' },
                        { name: '2' }
                    ]
                }
            ]
        }
        myChart.setOption(option)
    })();
    // 3.销售业绩
    (function () {
        var myChart = echarts.init(document.getElementById('jiaju2'));
        option = {
            backgroundColor: 'rgba(255,255,255,0)',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(255,255,255,0)' // 0% 处的颜色
                            }, {
                                offset: 0.5,
                                color: 'rgba(255,255,255,1)' // 100% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba(255,255,255,0)' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    },
                },

            },
            grid: {
                top: '8%',
                left: '2%',
                right: '2%',
                bottom: '25%',
                // containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: true,
                axisLine: { //坐标轴轴线相关设置。数学上的x轴
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.4)'
                    },
                },
                axisLabel: { //坐标轴刻度标签的相关设置
                    textStyle: {
                        color: '#d1e6eb',
                        margin: 15,
                    },
                },
                axisTick: {
                    show: false,
                },
                data: ['2014', '2015', '2016', '2017', '2018', '2019'],
            }],
            yAxis: [{
                type: 'value',
                min: 0,
                // max: 140,
                splitNumber: 4,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                    margin: 20,
                    textStyle: {
                        color: '#d1e6eb',

                    },
                },
                axisTick: {
                    show: false,
                },
            }],
            series: [{
                name: '注册总量',
                type: 'line',
                // smooth: true, //是否平滑曲线显示
                // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
                showAllSymbol: true,
                // symbol: 'image://./static/images/guang-circle.png',
                symbolSize: 8,
                lineStyle: {
                    normal: {
                        color: "#53fdfe", // 线条颜色
                    },
                    borderColor: '#f0f'
                },
                label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: '#fff',
                    }
                },
                itemStyle: {
                    normal: {
                        color: "rgba(255,255,255,1)",
                    }
                },
                tooltip: {
                    show: false
                },
                areaStyle: { //区域填充样式
                    normal: {
                        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0,150,239,0.3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(0,253,252,0)'
                        }
                        ], false),
                        shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                        shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                    }
                },
                data: [150, 200, 259, 360, 378, 450, 450]
            }]
        };
        myChart.setOption(option)
    })();
})
// 数据请求-智慧商超
$(function () {
    // 1.超市分布图
    (function () {
        var myChart = echarts.init(document.getElementById('shop'));
        var nodes = [{
            x: 500,
            y: 1000,
            nodeName: '云家惠智能数控中心',
            svgPath: 'M544 552.325V800a32 32 0 0 1-32 32 31.375 31.375 0 0 1-32-32V552.325L256 423.037a32 32 0 0 1-11.525-43.512A31.363 31.363 0 0 1 288 368l224 128 222.075-128a31.363 31.363 0 0 1 43.525 11.525 31.988 31.988 0 0 1-11.525 43.513L544 551.038z m0 0,M64 256v512l448 256 448-256V256L512 0z m832 480L512 960 128 736V288L512 64l384 224z m0 0',
            symbolSize: 70,

        }, {
            x: 100,
            y: 500,
            nodeName: '云家惠超市',
            svgPath: 'M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z'
        },
        {
            x: 500,
            y: 500,
            nodeName: '消防检测',
            svgPath: 'M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z'
        },
        {
            x: 900,
            y: 500,
            nodeName: '智能家居',
            svgPath: 'M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z'
        },
        {
            x: 0,
            y: 100,
            nodeName: '线上下单',
            svgPath: 'M887.552 546.10944c-28.16 0-54.21056 8.576-75.97056 23.168l-140.22144-153.6a237.55264 237.55264 0 0 0 79.54944-176.768C750.7712 107.02336 643.8912 0.14336 512 0 380.1088 0.14336 273.2288 107.02336 273.09056 238.91456c0 67.84 28.672 128.768 74.24 172.35456L203.52 564.41856a134.60992 134.60992 0 0 0-67.01056-18.304C61.12256 546.18112 0.03584 607.29856 0 682.68544 0 757.95456 61.25056 819.2 136.50944 819.2c75.38688-0.03584 136.50432-61.12256 136.576-136.51456 0-26.112-7.68-50.176-20.48-70.97344l151.10656-161.024a234.73152 234.73152 0 0 0 74.17856 23.68v281.41056a136.448 136.448 0 0 0-102.4 131.712c0 75.264 61.184 136.50944 136.50944 136.50944 75.3664-0.07168 136.44288-61.14816 136.50944-136.50944 0-63.42144-43.648-116.41856-102.4-131.712V474.368c24.00256-3.456 46.78144-10.17344 67.84-20.29056l152.38656 166.85056c-9.53856 18.688-15.36 39.424-15.36 61.75744 0 75.264 61.184 136.51456 136.576 136.51456 75.41248-2.82624 134.25152-66.2528 131.42528-141.66528-2.68288-71.44448-59.9808-128.7424-131.42528-131.42528z m-751.03744 204.8c-37.69856 1.13664-69.17632-28.50304-70.31808-66.19648S94.69952 615.53664 132.39296 614.4c1.39264-0.04096 2.7904-0.04096 4.18304 0 37.71392 0.01536 68.2752 30.60224 68.25984 68.31616-0.01536 37.69344-30.5664 68.24448-68.25984 68.25984l-0.06144-0.06656z m204.8-512c0.1024-94.21312 76.47232-170.55232 170.68544-170.61888 94.21312 0.07168 170.58304 76.41088 170.68544 170.624C682.61888 333.15328 606.23872 409.52832 512 409.6c-94.23872-0.07168-170.61888-76.44672-170.68544-170.69056z m238.976 648.576c-0.01536 37.71392-30.60736 68.2752-68.32128 68.25472-37.71392-0.01536-68.2752-30.60736-68.25472-68.32128 0.01536-37.71392 30.60224-68.2752 68.31616-68.25984 37.69344 0.01536 68.24448 30.5664 68.25984 68.25984v0.06656z m307.2-136.576c-37.67296-0.03584-68.21888-30.55104-68.29056-68.224 0-37.71392 30.57152-68.28544 68.29056-68.28544 37.71392 0 68.29056 30.57152 68.28544 68.29056 0 37.68832-30.53568 68.25472-68.224 68.28544l-0.06144-0.06656z',
        },
        {
            x: 300,
            y: 100,
            nodeName: '线下配送',
            svgPath: 'M887.552 546.10944c-28.16 0-54.21056 8.576-75.97056 23.168l-140.22144-153.6a237.55264 237.55264 0 0 0 79.54944-176.768C750.7712 107.02336 643.8912 0.14336 512 0 380.1088 0.14336 273.2288 107.02336 273.09056 238.91456c0 67.84 28.672 128.768 74.24 172.35456L203.52 564.41856a134.60992 134.60992 0 0 0-67.01056-18.304C61.12256 546.18112 0.03584 607.29856 0 682.68544 0 757.95456 61.25056 819.2 136.50944 819.2c75.38688-0.03584 136.50432-61.12256 136.576-136.51456 0-26.112-7.68-50.176-20.48-70.97344l151.10656-161.024a234.73152 234.73152 0 0 0 74.17856 23.68v281.41056a136.448 136.448 0 0 0-102.4 131.712c0 75.264 61.184 136.50944 136.50944 136.50944 75.3664-0.07168 136.44288-61.14816 136.50944-136.50944 0-63.42144-43.648-116.41856-102.4-131.712V474.368c24.00256-3.456 46.78144-10.17344 67.84-20.29056l152.38656 166.85056c-9.53856 18.688-15.36 39.424-15.36 61.75744 0 75.264 61.184 136.51456 136.576 136.51456 75.41248-2.82624 134.25152-66.2528 131.42528-141.66528-2.68288-71.44448-59.9808-128.7424-131.42528-131.42528z m-751.03744 204.8c-37.69856 1.13664-69.17632-28.50304-70.31808-66.19648S94.69952 615.53664 132.39296 614.4c1.39264-0.04096 2.7904-0.04096 4.18304 0 37.71392 0.01536 68.2752 30.60224 68.25984 68.31616-0.01536 37.69344-30.5664 68.24448-68.25984 68.25984l-0.06144-0.06656z m204.8-512c0.1024-94.21312 76.47232-170.55232 170.68544-170.61888 94.21312 0.07168 170.58304 76.41088 170.68544 170.624C682.61888 333.15328 606.23872 409.52832 512 409.6c-94.23872-0.07168-170.61888-76.44672-170.68544-170.69056z m238.976 648.576c-0.01536 37.71392-30.60736 68.2752-68.32128 68.25472-37.71392-0.01536-68.2752-30.60736-68.25472-68.32128 0.01536-37.71392 30.60224-68.2752 68.31616-68.25984 37.69344 0.01536 68.24448 30.5664 68.25984 68.25984v0.06656z m307.2-136.576c-37.67296-0.03584-68.21888-30.55104-68.29056-68.224 0-37.71392 30.57152-68.28544 68.29056-68.28544 37.71392 0 68.29056 30.57152 68.28544 68.29056 0 37.68832-30.53568 68.25472-68.224 68.28544l-0.06144-0.06656z',
        },
        {
            x: 700,
            y: 100,
            nodeName: '云家惠APP',
            svgPath: 'M887.552 546.10944c-28.16 0-54.21056 8.576-75.97056 23.168l-140.22144-153.6a237.55264 237.55264 0 0 0 79.54944-176.768C750.7712 107.02336 643.8912 0.14336 512 0 380.1088 0.14336 273.2288 107.02336 273.09056 238.91456c0 67.84 28.672 128.768 74.24 172.35456L203.52 564.41856a134.60992 134.60992 0 0 0-67.01056-18.304C61.12256 546.18112 0.03584 607.29856 0 682.68544 0 757.95456 61.25056 819.2 136.50944 819.2c75.38688-0.03584 136.50432-61.12256 136.576-136.51456 0-26.112-7.68-50.176-20.48-70.97344l151.10656-161.024a234.73152 234.73152 0 0 0 74.17856 23.68v281.41056a136.448 136.448 0 0 0-102.4 131.712c0 75.264 61.184 136.50944 136.50944 136.50944 75.3664-0.07168 136.44288-61.14816 136.50944-136.50944 0-63.42144-43.648-116.41856-102.4-131.712V474.368c24.00256-3.456 46.78144-10.17344 67.84-20.29056l152.38656 166.85056c-9.53856 18.688-15.36 39.424-15.36 61.75744 0 75.264 61.184 136.51456 136.576 136.51456 75.41248-2.82624 134.25152-66.2528 131.42528-141.66528-2.68288-71.44448-59.9808-128.7424-131.42528-131.42528z m-751.03744 204.8c-37.69856 1.13664-69.17632-28.50304-70.31808-66.19648S94.69952 615.53664 132.39296 614.4c1.39264-0.04096 2.7904-0.04096 4.18304 0 37.71392 0.01536 68.2752 30.60224 68.25984 68.31616-0.01536 37.69344-30.5664 68.24448-68.25984 68.25984l-0.06144-0.06656z m204.8-512c0.1024-94.21312 76.47232-170.55232 170.68544-170.61888 94.21312 0.07168 170.58304 76.41088 170.68544 170.624C682.61888 333.15328 606.23872 409.52832 512 409.6c-94.23872-0.07168-170.61888-76.44672-170.68544-170.69056z m238.976 648.576c-0.01536 37.71392-30.60736 68.2752-68.32128 68.25472-37.71392-0.01536-68.2752-30.60736-68.25472-68.32128 0.01536-37.71392 30.60224-68.2752 68.31616-68.25984 37.69344 0.01536 68.24448 30.5664 68.25984 68.25984v0.06656z m307.2-136.576c-37.67296-0.03584-68.21888-30.55104-68.29056-68.224 0-37.71392 30.57152-68.28544 68.29056-68.28544 37.71392 0 68.29056 30.57152 68.28544 68.29056 0 37.68832-30.53568 68.25472-68.224 68.28544l-0.06144-0.06656z',
        },
        {
            x: 1000,
            y: 100,
            nodeName: '家居全面',
            svgPath: 'M887.552 546.10944c-28.16 0-54.21056 8.576-75.97056 23.168l-140.22144-153.6a237.55264 237.55264 0 0 0 79.54944-176.768C750.7712 107.02336 643.8912 0.14336 512 0 380.1088 0.14336 273.2288 107.02336 273.09056 238.91456c0 67.84 28.672 128.768 74.24 172.35456L203.52 564.41856a134.60992 134.60992 0 0 0-67.01056-18.304C61.12256 546.18112 0.03584 607.29856 0 682.68544 0 757.95456 61.25056 819.2 136.50944 819.2c75.38688-0.03584 136.50432-61.12256 136.576-136.51456 0-26.112-7.68-50.176-20.48-70.97344l151.10656-161.024a234.73152 234.73152 0 0 0 74.17856 23.68v281.41056a136.448 136.448 0 0 0-102.4 131.712c0 75.264 61.184 136.50944 136.50944 136.50944 75.3664-0.07168 136.44288-61.14816 136.50944-136.50944 0-63.42144-43.648-116.41856-102.4-131.712V474.368c24.00256-3.456 46.78144-10.17344 67.84-20.29056l152.38656 166.85056c-9.53856 18.688-15.36 39.424-15.36 61.75744 0 75.264 61.184 136.51456 136.576 136.51456 75.41248-2.82624 134.25152-66.2528 131.42528-141.66528-2.68288-71.44448-59.9808-128.7424-131.42528-131.42528z m-751.03744 204.8c-37.69856 1.13664-69.17632-28.50304-70.31808-66.19648S94.69952 615.53664 132.39296 614.4c1.39264-0.04096 2.7904-0.04096 4.18304 0 37.71392 0.01536 68.2752 30.60224 68.25984 68.31616-0.01536 37.69344-30.5664 68.24448-68.25984 68.25984l-0.06144-0.06656z m204.8-512c0.1024-94.21312 76.47232-170.55232 170.68544-170.61888 94.21312 0.07168 170.58304 76.41088 170.68544 170.624C682.61888 333.15328 606.23872 409.52832 512 409.6c-94.23872-0.07168-170.61888-76.44672-170.68544-170.69056z m238.976 648.576c-0.01536 37.71392-30.60736 68.2752-68.32128 68.25472-37.71392-0.01536-68.2752-30.60736-68.25472-68.32128 0.01536-37.71392 30.60224-68.2752 68.31616-68.25984 37.69344 0.01536 68.24448 30.5664 68.25984 68.25984v0.06656z m307.2-136.576c-37.67296-0.03584-68.21888-30.55104-68.29056-68.224 0-37.71392 30.57152-68.28544 68.29056-68.28544 37.71392 0 68.29056 30.57152 68.28544 68.29056 0 37.68832-30.53568 68.25472-68.224 68.28544l-0.06144-0.06656z',
        },
        ]
        var charts = {
            nodes: [],
            linesData: [{
                coords: [
                    [500, 1000],
                    [500, 800],
                ]
            }, {
                coords: [
                    [500, 800],
                    [100, 800],
                    [100, 600]

                ]
            }, {
                coords: [
                    [500, 800],
                    [500, 600],

                ]
            }, {
                coords: [
                    [500, 800],
                    [900, 800],
                    [900, 600]

                ]
            },
            {
                coords: [
                    [100, 600],
                    [0, 300]
                ]
            },
            {
                coords: [
                    [100, 600],
                    [300, 300]
                ]
            },
            {
                coords: [
                    [900, 600],
                    [700, 300]
                ]
            },
            {
                coords: [
                    [900, 600],
                    [1000, 300]
                ]
            }
            ]
        }
        for (var j = 0; j < nodes.length; j++) {
            const {
                x,
                y,
                nodeName,
                svgPath,
                symbolSize
            } = nodes[j];
            var node = {
                nodeName,
                value: [x, y],
                symbolSize: symbolSize || 50,
                symbol: 'path://' + svgPath,
                itemStyle: {
                    color: 'orange',
                }
            }
            charts.nodes.push(node)
        }
        option = {
            // backgroundColor: "rgba(0,93,93,0.1)",
            // title: {
            //     top: '3%',
            //     left: '0',
            //     text: '超市分类',
            //     textStyle: {
            //         align: 'center',
            //         color: '#FFF',
            //         fontSize: 16
            //     }
            // },
            xAxis: {
                min: 0,
                max: 1000,
                show: false,
                type: 'value'
            },
            yAxis: {
                min: 0,
                max: 1000,
                show: false,
                type: 'value'
            },
            series: [{
                type: 'graph',
                coordinateSystem: 'cartesian2d',
                label: {
                    show: true,
                    position: 'bottom',
                    color: 'orange',
                    formatter: function (item) {
                        return item.data.nodeName
                    }
                },
                data: charts.nodes,
            }, {
                type: 'lines',
                polyline: true,
                coordinateSystem: 'cartesian2d',
                lineStyle: {
                    type: 'dashed',
                    width: 2,
                    color: '#175064',
                    curveness: 0.3

                },
                effect: {
                    show: true,
                    trailLength: 0.1,
                    symbol: 'arrow',
                    color: 'orange',
                    symbolSize: 8
                },
                data: charts.linesData
            }]
        };
        myChart.setOption(option)
        window.addEventListener("resize", function () { myChart.resize(); })
    })();
    // 2.超市流程图
    (function () {
        var myChart = echarts.init(document.getElementById('shop1'));
        var obj = [{
            name: "云家惠数控中心",
            path: "M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z",
            value: [0, 400],
            offset: [0, '-100%']
        }, {
            name: "云家惠超市",
            path: "M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z",
            value: [100, 400],
            offset: [0, '-100%']
        }, {
            name: "线上下单",
            path: "M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z",
            value: [200, 400],
            offset: [0, '-100%']
        }, {
            name: "线下配送",
            path: "M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z",
            value: [200, 300],
            direction: "left",
            offset: ['100%', 0]
        }, {
            name: "特惠商品",
            path: "M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z",
            value: [100, 300],
            offset: [0, '-100%']
        }, {
            name: "农事活动",
            path: "M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z",
            value: [0, 300],
            offset: [0, '-100%']
        }, {
            name: "采收",
            path: "M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z",
            value: [0, 200],
            direction: "left",
            offset: [0, 0]
        }, {
            name: "二维码",
            path: "M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z",
            value: [200, 200],
            direction: "left",
            offset: ['100%', 0]
        }, {
            name: "流通",
            path: "M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z",
            value: [0, 100],
            direction: "left",
            offset: [0, 0]
        }, {
            name: "消费者",
            path: "M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z",
            value: [100, 100],
            offset: [0, '-100%']
        }, {
            name: "溯源查询",
            path: "M1172.985723 682.049233l-97.748643-35.516964a32.583215 32.583215 0 0 0-21.830134 61.582735l25.7398 9.123221-488.744218 238.181638L115.670112 741.349163l47.245961-19.223356a32.583215 32.583215 0 0 0-22.808051-60.604819l-119.579777 47.896905a32.583215 32.583215 0 0 0 0 59.952875l557.820313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.527227-278.584184a32.583215 32.583215 0 0 0-3.258721-59.952875z,M1185.041693 482.966252l-191.587622-68.749123a32.583215 32.583215 0 1 0-21.831133 61.254764l118.927833 43.010323-488.744218 237.855666-471.474695-213.744727 116.973-47.244961a32.583215 32.583215 0 1 0-24.111938-60.604819l-190.609705 75.593537a32.583215 32.583215 0 0 0-20.528246 29.650465 32.583215 32.583215 0 0 0 20.528246 30.30141l557.819313 251.866468a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0 18.24744-30.953354 32.583215 32.583215 0 0 0-21.505161-29.651465z,M32.583215 290.075742l557.819313 251.540496a32.583215 32.583215 0 0 0 27.695632 0l570.201254-278.584184a32.583215 32.583215 0 0 0-3.257721-59.952875L626.244463 2.042365a32.583215 32.583215 0 0 0-23.134022 0l-570.527226 228.080502a32.583215 32.583215 0 0 0-19.224357 30.627382 32.583215 32.583215 0 0 0 19.224357 29.325493zM615.817355 67.534767l474.733416 170.408432-488.744218 238.180638-471.474695-215.372588z",
            value: [200, 100],
            direction: "left",
            offset: ['100%', 0]
        }];

        var seriesData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                res.push({
                    name: data[i].name,
                    symbol: "path://" + data[i].path,
                    symbolSize: 28,               //图标大小
                    symbolOffset: data[i].offset,
                    draggable: false,
                    fixed: true,
                    value: data[i].value,
                    label: {
                        normal: {
                            position: data[i].direction ? data[i].direction : "bottom",
                            distance: 10,	//离图标多远					
                            show: true,
                            textStyle: {
                                fontSize: 14,
                                color: "#0ca361",
                                fontWeight: 700
                            }
                        }
                    },
                    itemStyle: {
                        color: "#0ca361"
                    }
                })
            }
            return res;
        }

        var option = {
            // backgroundColor: '#fff',
            grid: {
                left: "18%",
                bottom: '-10%',
                top: '20%',
                right: '15%'
            },
            xAxis: {
                show: false,
                type: "value"
            },
            yAxis: {
                show: false,
                type: "value"
            },
            series: [
                {
                    type: "graph",
                    coordinateSystem: "cartesian2d",
                    legendHoverLink: false,
                    hoverAnimation: true,
                    nodeScaleRatio: false,
                    roam: false,
                    lineStyle: {
                        normal: {
                            width: 0,
                            shadowColor: "none",
                            color: "transparent"
                        }
                    },
                    data: seriesData(obj)
                },
                {
                    type: "lines",
                    coordinateSystem: "cartesian2d",
                    z: 1,
                    animationEasing: "linear",
                    clip: false,
                    effect: {
                        show: true,
                        smooth: true,
                        trailLength: 0,
                        symbol: "arrow",
                        color: "#0ca361",
                        symbolSize: 8,
                        period: 4,    //特效动画的时间
                        loop: true
                    },
                    lineStyle: {
                        curveness: 0,
                        color: '#0ca361',
                        opacity: 0.6,
                        width: 1,
                        type: "dashed"
                    },
                    data: [
                        { coords: [[0, 400], [100, 400]] },
                        { coords: [[100, 400], [200, 400]] },
                        { coords: [[200, 400], [200, 300]] },
                        { coords: [[200, 300], [100, 300]] },
                        { coords: [[100, 300], [0, 300]] },
                        { coords: [[0, 300], [0, 200]] },
                        { coords: [[200, 200], [0, 200]] },
                        { coords: [[200, 200], [200, 100]] },
                        { coords: [[0, 200], [0, 100]] },
                        { coords: [[0, 100], [100, 100]] },
                        { coords: [[100, 100], [200, 100]] },
                    ]
                }
            ]
        }
        myChart.setOption(option)
        window.addEventListener("resize", function () { myChart.resize(); })
    })();
    // 3.超市柱状图
    (function () {
        var myChart = echarts.init(document.getElementById('shop3'));
        var colors = [{
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: '#28f0f5'
            }, {
                offset: 0.5,
                color: '#16abaf'
            }, {
                offset: 0.5,
                color: '#16abaf'
            }, {
                offset: 1,
                color: '#077175'
            }]
        }, {
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: '#0172e2'
            }, {
                offset: 0.5,
                color: '#0656c6'
            }, {
                offset: 0.5,
                color: '#0656c6'
            }, {
                offset: 1,
                color: '#0f299a'
            }]
        }];
        var barWidth = 25;
        myChart.setOption({
            tooltip: {
                trigger: 'item',
            },
            legend: {
                right: 30,
                textStyle: {
                    color: '#A9DDEE',
                },
            },
            xAxis: [{
                type: 'category',
                name: "月",
                axisLine: {
                    lineStyle: {
                        color: '#65C6E7'
                    }
                },
                axisLabel: {
                    fontSize: 14
                },
                data: ['20/01', '20/02', '20/03', '20/04', '20/05', '20/06'],
            }],
            yAxis: [{
                type: 'value',
                min: 0,
                splitLine: {
                    lineStyle: {
                        color: '#65C6E7'
                    }
                },
                splitNumber: 5,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    fontSize: 14,
                    color: '#65C6E7'
                },

            }, {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    fontSize: 14,
                    color: '#65C6E7'
                }
            }],
            series: [{
                z: 1,
                name: '出货量',
                type: 'bar',
                barWidth: barWidth,
                data: [20, 90, 37, 23, 25, 67],
                itemStyle: {
                    normal: {
                        color: colors[0]
                    },
                }
            }, {
                z: 3,
                type: 'pictorialBar',
                symbolPosition: 'end',
                data: [20, 40, 60, 80, 100, 120
                ],
                symbol: 'diamond',
                symbolOffset: [12.5, '50%'],
                symbolSize: [barWidth - 4, (10 * (barWidth - 4)) / barWidth],
                itemStyle: {
                    normal: {
                        borderColor: '#12bac1',
                        borderWidth: 2,
                        color: '#12bac1'
                    }
                },
            },
            {
                z: 1,
                name: '下单量',
                type: 'bar',
                barGap: 0,
                barWidth: barWidth,
                data: [20, 40, 60, 80, 100, 120
                ],
                itemStyle: {
                    normal: {
                        color: colors[1]
                    }
                }
            },
            {
                z: 3,
                type: 'pictorialBar',
                symbolPosition: 'end',
                data: [16, 59, 40, 24, 27, 77],
                symbol: 'diamond',
                symbolOffset: [12.5, '-50%'],
                symbolSize: [barWidth - 4, (10 * (barWidth - 4)) / barWidth],
                itemStyle: {
                    normal: {
                        borderColor: '#319cf1',
                        borderWidth: 2,
                        color: '#319cf1'
                    }
                },
            }
            ]
        })
        window.addEventListener("resize", function () { myChart.resize(); })
    })();
})


