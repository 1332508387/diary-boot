package com.lh.diary.controller;

import com.lh.diary.config.ConfigBean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
public class HelloController {
    @Resource
    private ConfigBean configBean;

    @RequestMapping("/com/lh/diary/hello")
    public String hello() {
        return this.configBean.getProp1() + " " + this.configBean.getProp2() + " " + this
                .configBean.getRandom();
    }

//    @RequestMapping("/com/lh/diary/ip")
//    public String hello() {
//        return ip + ":" +request.getRemoteAddr();
//    }
}