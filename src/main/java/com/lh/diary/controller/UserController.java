package com.lh.diary.controller;

import com.lh.diary.common.VerifyCodeContant;
import com.lh.diary.common.vo.SysResult;
import com.lh.diary.pojo.User;
import com.lh.diary.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;

@RequestMapping("/user")
@RestController
public class UserController {
    @Resource
    private UserService userService;

    /*@RequestMapping(value = "/diary/user/{userId}", method = RequestMethod.GET)
    public User getUser(@PathVariable("userId") Long userId) {
        return this.userService.getUserById(userId);
    }*/

    @RequestMapping("/doRegister")
    public SysResult register(User user, String verifyCode,  HttpSession session){
        String realVerifyCode = (String) session.getAttribute(VerifyCodeContant.KAPTHA_VERIFY_CODE_KEY);
        if(!StringUtils.equalsIgnoreCase(realVerifyCode, verifyCode)){
            session.invalidate();
            return SysResult.build(201, "验证码错误");
        }
        session.removeAttribute(VerifyCodeContant.KAPTHA_VERIFY_CODE_KEY);
        // 检查用户是否已存在
        User _user = new User();
        _user.setUsername(user.getUsername());
        _user.setStatus(0);
        User checkUser = this.userService.getUser(_user);
        if(null != checkUser){
            return SysResult.build(201, "该用户已存在！");
        }

        try {
            this.userService.saveUser(user);
            return SysResult.build(200, "注册成功，请登陆");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return SysResult.build(201, "用户注册失败！");
    }

    @PostMapping("/doLogin")
    public SysResult doLogin(String verifyCode, User user, HttpSession session, HttpServletRequest request) {
        String srcVerifyCode = (String) (session.getAttribute(KaptchaController.KAPTCHA_VERIFY_CODE));
        if (!StringUtils.equals(verifyCode, srcVerifyCode)) {
            session.invalidate();
            return SysResult.build(201, "验证码错误");
        }

        SysResult result = null;

        UsernamePasswordToken token = new UsernamePasswordToken(user.getUsername(), user.getPassword());

        Subject subject = SecurityUtils.getSubject();

        try {
            subject.login(token);
            User realUser = (User) subject.getPrincipal();
//            subject.getSession().setAttribute("currentUser", realUser);
            request.getSession().setAttribute("currentUser", realUser);
            session.setAttribute("currentUser", realUser);
            result = SysResult.ok();
        } catch (UnknownAccountException e) {
            result = result.build(201, "用户不存在");
        } catch (IncorrectCredentialsException e) {
           result = SysResult.build(201, "用户名或密码错误");
        }
        return result;
    }

    @RequestMapping("/getData")
    public Map<String, Object> listUser(Integer pageIndex, Integer pageSize, String key, String value){
        return this.userService.listUser(pageIndex, pageSize, key, value);
    }

    @RequestMapping("/del/{userId}")
    public SysResult remove(@PathVariable Long userId) {
        User user = this.userService.getUserById(userId);
        if (StringUtils.equals("admin", user.getUsername())) {
            return SysResult.build(201, "删除失败：没有权限");
        }
        this.userService.removeUserById(userId);
        return SysResult.build(200, "用户删除成功");
    }

    @GetMapping("/logout")
    public SysResult logout() {
        Subject subject = SecurityUtils.getSubject();
        if (subject.isAuthenticated()) {
            subject.logout(); // session 会销毁，在SessionListener监听session销毁，清理权限缓存
        }
        return SysResult.ok();
    }

    @RequestMapping("/save")
    public SysResult save(User user) {
        return this.userService.saveAdminUser(user);
    }
}
