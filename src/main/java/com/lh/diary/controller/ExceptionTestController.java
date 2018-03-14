package com.lh.diary.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/exception")
@RestController
public class ExceptionTestController {
    @RequestMapping("/e1")
    public Object throwException() {
/* return "ok"; */
        throw new RuntimeException("我是一个故意抛出的异常信息。。。");
    }
}
