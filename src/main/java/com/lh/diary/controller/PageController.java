package com.lh.diary.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PageController {
    @RequestMapping("/")
    public String goHome() {
        return "/home";
    }

    @RequestMapping("/{pageName}")
    public String goPage(@PathVariable String pageName) {
        return pageName;
    }
}
