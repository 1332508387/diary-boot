package com.lh.diary.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

/**
 * 读取自定义属性文件
 */
@Component      // 读取自定义的配置文件必须添加(或 @Configuration)；读取 application.properties 文件中的属性不需要
@PropertySource("classpath:config/config.properties")  // 默认读取 application.properties 文件
@ConfigurationProperties(prefix = "diary.common")
public class ConfigBean {
    private String prop1;
    private String prop2;
    private String random;

    public String getRandom() {
        return random;
    }

    public void setRandom(String random) {
        this.random = random;
    }

    public String getProp1() {
        return prop1;
    }

    public void setProp1(String prop1) {
        this.prop1 = prop1;
    }

    public String getProp2() {
        return prop2;
    }

    public void setProp2(String prop2) {
        this.prop2 = prop2;
    }
}
