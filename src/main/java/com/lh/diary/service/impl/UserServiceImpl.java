package com.lh.diary.service.impl;

import com.lh.diary.common.util.MD5Util;
import com.lh.diary.common.vo.SysResult;
import com.lh.diary.mapper.UserMapper;
import com.lh.diary.pojo.User;
import com.lh.diary.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
    @Resource
    protected UserMapper userMapper;

    @Transactional
    //@RequiresRoles({"role:0"})
    @Override
    public void saveUser(User user) {
        user.setStatus(0);
        user.setType(1);
        user.setCreated(new Date());
        user.setUpdated(user.getCreated());
        user.setPassword(MD5Util.md5(user.getPassword()));
        this.userMapper.insertSelective(user);
    }

//    @RequiresRoles({"role:0"})
    @Override
    public Map<String, Object> listUser(Integer pageIndex, Integer pageSize, String key, String value) {
        //PageHelper.startPage(pageIndex, pageSize);
        if (StringUtils.equals("all", key)) {
            key = null;
            value = null;
        }
        List<User> users = this.userMapper.listUser(pageIndex, pageSize, key, value);
        int count = this.userMapper.count(key, value);
        //PageInfo<User> info = new PageInfo<>(users);

        Map<String, Object> result = new HashMap<>();
        result.put("data", users);
        result.put("recordsTotal", count);
        result.put("recordsFiltered", count);

        return result;
    }

    @Transactional
    @RequiresRoles({"role:0"})
    @Override
    public void removeUserById(Long userId) {
        User user = new User();
        user.setId(userId);
        user.setType(null);
        user.setStatus(-1);
        this.userMapper.updateByPrimaryKeySelective(user);
    }

    @Transactional
    @RequiresRoles({"role:0"})
    @Override
    public SysResult saveAdminUser(User user) {
        // 只允许手动添加管理员用户
        if(user.getType() == null ? true : user.getType() != 0) {
            return SysResult.build(201, "只能添加管理员用户");
        }

        User user2 = new User();
        user2.setUsername(user.getUsername());
        user2.setType(null);
        List<User> users = this.userMapper.select(user2);
        if(!users.isEmpty()) {
            return SysResult.build(201, "用户名已存在");
        }

        user.setStatus(0);
        user.setPassword(MD5Util.md5(user.getPassword()));
        user.setCreated(new Date());
        user.setUpdated(user.getCreated());
        this.userMapper.insertSelective(user);
        return SysResult.build(200, "管理员用户添加成功");
    }

    @RequiresRoles({"role:0"})
    @Override
    public User getUserById(Long userId) {
        return this.userMapper.getUserById(userId);
    }

    @Override
    public User getUser(User user) {
        List<User> users = this.userMapper.select(user);
        return users.size() == 0 ? null : users.get(0);
    }
}

