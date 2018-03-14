package com.lh.diary.controller;

import com.alibaba.fastjson.JSONObject;
import com.github.abel533.echarts.Option;
import com.github.abel533.echarts.code.Orient;
import com.github.abel533.echarts.code.Trigger;
import com.github.abel533.echarts.data.PieData;
import com.github.abel533.echarts.series.Pie;
import com.github.abel533.echarts.style.ItemStyle;
import com.github.abel533.echarts.style.itemstyle.Emphasis;
import com.lh.diary.common.DateFormatContant;
import com.lh.diary.common.util.DateUtil;
import com.lh.diary.common.util.UserUtil;
import com.lh.diary.common.vo.SysResult;
import com.lh.diary.pojo.Diary;
import com.lh.diary.pojo.User;
import com.lh.diary.service.DiaryService;
import com.lh.diary.service.StatisticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.*;

@RequestMapping("/statistics")
@RestController
public class StatisticsController {
    @Resource
    private StatisticsService statisticsService;
    @Resource
    private DiaryService diaryService;

    /**
     * 获取时间轴统计数据
     *
     * @param session
     * @return
     */
    @GetMapping("/timelist")
    public SysResult statisticsForTimeline (HttpSession session) {
        User currUser = UserUtil.getCurrUser(session);
        Map<String, List<Diary>> diarys = this.statisticsService.statisticsForTimeline(currUser.getId());
        return SysResult.ok(diarys);

    }

    /**
     * 返回当前用户开写日记日期
     *
     * @param session
     * @return
     */
    @GetMapping("/diary/startDate")
    public SysResult getStartDate(HttpSession session) {
        User currUser = UserUtil.getCurrUser(session);
        Date startDate = this.statisticsService.getStartDate(currUser.getId());
        String startDateStr = "";
        if (startDate != null) {
            startDateStr = DateUtil.getDate(startDate, DateFormatContant.FORMAT2);
        }
        return SysResult.ok(startDateStr);
    }

    /**
     * 统计当前用户应写日记总数，已写数量，缺写数量
     *
     * @param session
     * @return
     */
    @GetMapping("/diary/amount")
    public SysResult amount(HttpSession session) {
        User currUser = UserUtil.getCurrUser(session);
        Map<Object, Object> amountMap = this.statisticsService.amount(currUser.getId());
        return SysResult.ok(amountMap);
    }

    @RequestMapping("/diary/writeDate/list2")
    public List<String> getWriteDateList2(HttpSession session, @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate, @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate){
        return this.statisticsService.getWriteDateList2(UserUtil.getCurrUser(session).getId(), startDate, endDate);
    }

    /**
     * 统计当前用户心情及数量
     *
     * @param session
     * @return
     */
    @GetMapping("/diary/mood")
    public SysResult statisticsMood(HttpSession session) {
        Map<String, Object> resultMap = new HashMap<>();

        User user = UserUtil.getCurrUser(session);
        // 统计当前用户日记心情及数量
        List<Map<Object, Object>> moodAndAmountList = this.statisticsService.getMoodAndAmountMap(user.getId());
        List<String> legendDataList = new ArrayList<>();
        for (Map<Object, Object> map : moodAndAmountList) {
            legendDataList.add(map.get("name").toString());
        }

        resultMap.put("legendDataList", legendDataList);
        resultMap.put("seriesDataList", moodAndAmountList);
        return SysResult.ok(resultMap);
    }

    @GetMapping("/diary/mood2")
    public SysResult statisticsMood2() {
        Option option = new Option();
        option.title().setText("日记心情统计");
        option.title().setSubtext("心情");
        option.title().setX("center");
        option.tooltip().setTrigger(Trigger.item);
        option.tooltip().setFormatter("{a} <br/>{b} : {c} ({d}%)");
        option.legend().setOrient(Orient.vertical);
        option.legend().setLeft("left");
        List<String> data1 = new ArrayList<>();
        data1.add("直接访问");
        data1.add("间接访问");
        option.legend().setData(data1);
        Pie pie = new Pie();
        pie.radius("55%");
        pie.center(new String[]{"50%", "60%"});
        List data2 = new ArrayList();
        data2.add(new PieData("直接访问", 254));
        data2.add(new PieData("间接访问", 600));
        pie.setData(data2);
        ItemStyle itemStyle = new ItemStyle();
        Emphasis emphasis = new Emphasis();
        emphasis.setShadowBlur(10);
        emphasis.setShadowOffsetX(0);
        emphasis.setShadowColor("rgba(0, 0, 0, 0.5)");
        itemStyle.setEmphasis(emphasis);
        pie.setItemStyle(itemStyle);
        pie.setName("访问来源");
        option.series(pie);
        return SysResult.ok(JSONObject.toJSONString(option));
    }
}
