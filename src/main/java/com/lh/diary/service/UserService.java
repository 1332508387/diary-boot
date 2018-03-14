package com.lh.diary.service;

import com.lh.diary.common.vo.SysResult;
import com.lh.diary.pojo.User;

import java.util.Map;

public interface UserService {
    Map<String,Object> listUser(Integer pageIndex, Integer pageSize, String key, String value);

    void removeUserById(Long userId);

    void saveUser(User user);

    SysResult saveAdminUser(User user);

    User getUserById(Long userId);

    User getUser(User user);
}
