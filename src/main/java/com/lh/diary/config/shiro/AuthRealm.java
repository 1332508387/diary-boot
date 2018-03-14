package com.lh.diary.config.shiro;

import com.lh.diary.mapper.UserMapper;
import com.lh.diary.pojo.User;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.Set;

public class AuthRealm extends AuthorizingRealm{

	@Resource
	private UserMapper userMapper;
	
	/**
	 * 权限控制
	 */
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
		Subject subject = SecurityUtils.getSubject();
		User user = (User) subject.getSession().getAttribute("currentUser");
		
		Set<String> roles = new HashSet<String>();
		roles.add("role:" + user.getType());
		// 创建权限控制的对象
		SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
		
		// 设置用户角色列表
		info.addRoles(roles);
		
		// 设置用户权限列表
		// info.addStringPermissions(modules);
		
		return info;
	}

	/**
	 * 登录认证
	 */
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		// 获取令牌
		UsernamePasswordToken loginToken = (UsernamePasswordToken) token;
		
		// 通过令牌获取用户名(已在 controller 中将用户名密码设置到 token 中)
		String username = loginToken.getUsername();
				
		// 根据用户名查询用户信息
		User user = this.userMapper.getUserByUsername(username);

		if (user == null) {
			throw new UnknownAccountException("用户不存在！");
		}

		/*
		 * 创建认证对象，并返回
		 * 参数一： 通过用户名查询出的 User 的实例
		 * 参数二：数据库中真实的密码
		 * 参数三：当前 Realm 的名称
		 */
		AuthenticationInfo authenticationInfo = 
				new SimpleAuthenticationInfo(user, user.getPassword(), this.getName());
		
		return authenticationInfo;
	}

}
