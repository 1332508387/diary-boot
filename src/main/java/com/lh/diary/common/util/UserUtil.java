package com.lh.diary.common.util;

import com.lh.diary.pojo.User;

import javax.servlet.http.HttpSession;

public class UserUtil {
    private UserUtil() {}

    public static User getCurrUser(HttpSession session) {
        User user = new User();
        if (session != null) {
            Object o = session.getAttribute("currentUser");
            if (o != null) {
                user = (User) o;
            }
        }
        return user;
    }
}
