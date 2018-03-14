package com.lh.diary;

import com.lh.diary.config.ConfigBean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * 启动应用程序。此类放到应用程序根目录下，启动时将自动扫描注册 Beans，而不需设置 @ComponentScan 的 basePackages 属性
 */
@EnableConfigurationProperties({ConfigBean.class})
//@ComponentScan(basePackages = "diary")
//@MapperScan(basePackages  = "com.lh.diary.mapper")
@SpringBootApplication
public class Application extends WebMvcConfigurerAdapter implements CommandLineRunner {
    private Logger logger = LoggerFactory.getLogger(Application.class);

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... strings) throws Exception {
        logger.info("服务器启动成功。。。");
    }
}



