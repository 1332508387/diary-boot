package com.lh.diary.mapper;

import com.lh.diary.common.MyMapper;
import com.lh.diary.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserMapper extends MyMapper<User> {
    @Select("SELECT * FROM tb_user WHERE id= #{userId}")
    User getUserById(Long userId);

    /**
     * 根据用户名查询用户信息
     *
     * @param username
     * @return
     */
    @Select("SELECT * FROM tb_user WHERE username = #{username} AND status = 0")
    User getUserByUsername(String username);

    List<User> listUser(@Param("pageIndex") Integer pageIndex,
                           @Param("pageSize") Integer pageSize,
                           @Param("key") String key,
                           @Param("value") String value);

    int count(@Param("key") String key, @Param("value") String value);
}
